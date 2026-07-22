"""Swap the face in the hero background video with the reference person.

Runs in GitHub Actions (CPU). Downloads the source video and reference face,
swaps the largest detected face in every frame with InsightFace inswapper_128,
and re-encodes the result to public/asme-hero.mp4.
"""

import glob
import os
import subprocess
import sys
import urllib.request

import cv2

WORK = 'swap_work'
FRAMES = os.path.join(WORK, 'frames')
OUTPUT = os.path.join('public', 'asme-hero.mp4')

INSWAPPER_URLS = [
    'https://huggingface.co/ezioruan/inswapper_128.onnx/resolve/main/inswapper_128.onnx',
    'https://huggingface.co/datasets/Gourieff/ReActor/resolve/main/models/inswapper_128.onnx',
    'https://github.com/facefusion/facefusion-assets/releases/download/models/inswapper_128.onnx',
]


def fetch(url: str, dest: str, min_bytes: int) -> None:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, 'wb') as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    size = os.path.getsize(dest)
    if size < min_bytes:
        raise RuntimeError(f'{url} returned only {size} bytes')
    print(f'fetched {dest}: {size} bytes', flush=True)


def main() -> None:
    os.makedirs(FRAMES, exist_ok=True)
    os.makedirs('public', exist_ok=True)

    fetch(os.environ['VIDEO_URL'], f'{WORK}/src.mp4', 100_000)
    fetch(os.environ['FACE_URL'], f'{WORK}/face.jpg', 10_000)

    model_path = f'{WORK}/inswapper_128.onnx'
    for url in INSWAPPER_URLS:
        try:
            fetch(url, model_path, 200_000_000)
            break
        except Exception as exc:  # noqa: BLE001 - try next mirror
            print(f'model fetch failed from {url}: {exc}', flush=True)
    else:
        sys.exit('could not download inswapper_128.onnx from any mirror')

    rate = subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=r_frame_rate',
        '-of', 'default=nokey=1:noprint_wrappers=1', f'{WORK}/src.mp4',
    ]).decode().strip()
    num, den = rate.split('/')
    fps = float(num) / float(den)
    print(f'source fps: {fps}', flush=True)

    subprocess.check_call(['ffmpeg', '-v', 'error', '-i', f'{WORK}/src.mp4', f'{FRAMES}/%05d.png'])

    import insightface
    from insightface.app import FaceAnalysis

    app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0, det_size=(640, 640))
    swapper = insightface.model_zoo.get_model(model_path, providers=['CPUExecutionProvider'])

    def largest(faces):
        return max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))

    face_img = cv2.imread(f'{WORK}/face.jpg')
    src_faces = app.get(face_img)
    if not src_faces:
        sys.exit('no face detected in the reference photo')
    src_face = largest(src_faces)

    frames = sorted(glob.glob(f'{FRAMES}/*.png'))
    print(f'{len(frames)} frames extracted', flush=True)
    swapped = 0
    for i, path in enumerate(frames):
        frame = cv2.imread(path)
        faces = app.get(frame)
        if faces:
            frame = swapper.get(frame, largest(faces), src_face, paste_back=True)
            cv2.imwrite(path, frame)
            swapped += 1
        if i % 25 == 0:
            print(f'frame {i}: swapped {swapped}', flush=True)
    print(f'swapped {swapped}/{len(frames)} frames', flush=True)
    if swapped < len(frames) * 0.5:
        sys.exit('face was detected in too few frames; aborting to avoid a flickering result')

    subprocess.check_call([
        'ffmpeg', '-v', 'error', '-y', '-framerate', str(fps), '-i', f'{FRAMES}/%05d.png',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
        '-movflags', '+faststart', '-an', OUTPUT,
    ])
    print(f'output: {OUTPUT} ({os.path.getsize(OUTPUT)} bytes)', flush=True)


if __name__ == '__main__':
    main()
