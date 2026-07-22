"""Generate head-swapped hero keyframe candidates via the Pollinations API.

Runs in GitHub Actions. Sends a side-by-side collage (scene | reference person)
to the kontext instruct-edit model and asks it to replace the woman in the scene
with the reference man, then saves several seed variants under generated/.
"""

import os
import sys
import time
import urllib.parse
import urllib.request

COLLAGE_URL = 'https://raw.githubusercontent.com/interbizai/interbiz-lsg/tmp/asset-import/collage.jpg'

PROMPT = (
    'Replace the woman sitting at the laptop in the left scene with the young man '
    'shown in the right reference photo, matching his face exactly: round face, '
    'short black hair with a straight fringe covering his forehead. He wears the '
    'same cream knit hoodie and sits in the exact same pose, typing on the laptop '
    'and looking down at the screen. Keep everything else in the scene identical: '
    'the desk with stacks of books, bright yellow flowers, glowing light trails '
    'swirling in the dark background, and the warm cinematic screen glow on his '
    'face. Photorealistic, seamless edit. Output ONLY the left scene as a full '
    '16:9 image; do not include the reference panel or any split view.'
)

SEEDS = [7, 21, 42, 77]


def get(url: str, timeout: int = 300) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def main() -> None:
    for i in range(12):
        try:
            data = get(COLLAGE_URL, 60)
            if len(data) > 50_000:
                print(f'collage reachable ({len(data)} bytes)', flush=True)
                break
        except Exception as exc:  # noqa: BLE001
            print(f'collage not ready yet: {exc}', flush=True)
        time.sleep(15)
    else:
        sys.exit('collage URL never became reachable')

    try:
        print('models:', get('https://image.pollinations.ai/models', 60)[:400], flush=True)
    except Exception as exc:  # noqa: BLE001
        print(f'model list failed (continuing): {exc}', flush=True)

    os.makedirs('generated', exist_ok=True)
    prompt_enc = urllib.parse.quote(PROMPT, safe='')
    image_enc = urllib.parse.quote(COLLAGE_URL, safe='')
    saved = 0
    for seed in SEEDS:
        url = (
            f'https://image.pollinations.ai/prompt/{prompt_enc}'
            f'?model=kontext&image={image_enc}&width=1920&height=1080'
            f'&seed={seed}&nologo=true&referrer=interbiz-lsg'
        )
        for attempt in range(4):
            try:
                data = get(url)
                if len(data) < 30_000:
                    raise RuntimeError(f'suspiciously small response: {len(data)} bytes')
                path = f'generated/keyframe_{seed}.jpg'
                with open(path, 'wb') as f:
                    f.write(data)
                print(f'saved {path} ({len(data)} bytes)', flush=True)
                saved += 1
                break
            except Exception as exc:  # noqa: BLE001
                print(f'seed {seed} attempt {attempt + 1} failed: {exc}', flush=True)
                time.sleep(25)
        time.sleep(8)

    if saved == 0:
        sys.exit('no keyframe candidates were generated')
    print(f'done: {saved} candidates', flush=True)


if __name__ == '__main__':
    main()
