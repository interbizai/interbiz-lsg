# Asme — Hero Landing Page

풀스크린 루프 배경 영상 + 리퀴드 글라스 UI의 다크 시네마틱 히어로 섹션입니다.
Vite + React 18 + TypeScript + Tailwind CSS 3 + lucide-react로 만들었고, 페이지 전체가 `src/App.tsx` 하나에 들어 있습니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 구성

- **배경 영상** — 풀스크린 muted 자동재생, `object-cover`, 아래로 17% 이동(상단 크롭). 루프 경계는 CSS 트랜지션 없이 `requestAnimationFrame` 기반 500ms 페이드 인/아웃으로 부드럽게 처리 (끝나기 0.55초 전 페이드아웃 → `ended` 후 100ms 뒤 처음부터 재생 + 페이드인)
- **리퀴드 글라스** — `src/index.css`의 `.liquid-glass` 클래스 (luminosity 블렌드 + blur(4px) + 마스크 트릭으로 만든 그라데이션 보더)
- **레이아웃** — 상단 내비게이션(Asme 로고, Features/Pricing/About, Sign Up/Login), 중앙 히어로("Built for the curious" + 이메일 구독 바 + Manifesto 버튼), 하단 소셜 아이콘(Instagram/Twitter/Globe)
- **폰트** — 제목에 Google Font "Instrument Serif" 사용

## 배경 영상 교체

`src/App.tsx` 상단의 `VIDEO_URL` 상수만 바꾸면 됩니다.
