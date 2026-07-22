# Asme — Hero Landing Page

풀스크린 루프 배경 영상 + 리퀴드 글라스 UI의 다크 시네마틱 히어로 섹션.
Vite + React 18 + TypeScript + Tailwind CSS 3 + lucide-react.

## 실행

```bash
npm install
npm run dev      # 개발 서버 → http://localhost:5173
npm run build    # 타입체크 + 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기 → http://localhost:4173
```

## 폴더 구조

```
public/asme-hero.mp4   배경 영상 (로컬 파일, 외부 CDN 의존 없음)
src/App.tsx            페이지 전체 (내비 · 히어로 · 소셜 푸터)
src/index.css          Instrument Serif @import + Tailwind + .liquid-glass
index.html             진입 HTML
tailwind.config.js     Tailwind 설정 (기본, 확장 없음)
```

## 자주 바꾸는 것

| 바꿀 내용 | 위치 |
| --- | --- |
| 배경 영상 | `public/asme-hero.mp4` 교체, 또는 `src/App.tsx`의 `VIDEO_URL` |
| 히어로 문구 · 버튼 · 링크 | `src/App.tsx` JSX |
| 리퀴드 글라스 스타일 | `src/index.css`의 `.liquid-glass` |
| 영상 페이드 타이밍 | `src/App.tsx`의 `FADE_MS`, `FADE_OUT_LEAD_S` |

## 배경 영상 동작

`src/App.tsx`가 CSS 트랜지션 없이 `requestAnimationFrame` 기반으로 루프 경계를 페이드 처리합니다:
로드/재시작 시 500ms 페이드인, 종료 0.55초 전 500ms 페이드아웃, `ended` 후 100ms 뒤 처음부터 재생.
