import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Check,
  ExternalLink,
  Eye,
  Layers,
  LayoutGrid,
  LayoutList,
  ListChecks,
  MessageSquareText,
  MonitorPlay,
  PenLine,
  Plug,
  Quote,
  RefreshCw,
  Rocket,
  UserRound,
  Volume2,
  VolumeX,
  Workflow,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ============================================================
   발표용 콘텐츠 데이터 — 문구 수정은 전부 여기서 하면 됩니다.
   (소개 문구는 초안입니다. 실제 서비스 내용에 맞게 다듬어 주세요.)
   ============================================================ */

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4'

const SECTIONS = [
  { id: 'home', label: '홈' },
  { id: 'projects', label: '프로젝트' },
  { id: 'tips', label: 'AI 팁' },
  { id: 'vibe', label: '바이브코딩' },
  { id: 'extend', label: 'AI 활용' },
] as const

type Project = {
  name: string
  tag: string
  url: string
  oneLiner: string
  points: string[]
}

const PROJECTS: Project[] = [
  {
    name: 'InterBiz Link',
    tag: '링크 허브',
    url: 'https://interbiz-link.vercel.app',
    oneLiner: '흩어져 있는 업무 링크를 한 페이지에 모아 공유하는 링크 허브',
    points: [
      '자주 쓰는 사이트와 툴을 카드로 정리해 한눈에 탐색',
      '기획부터 화면 구성, 배포까지 전부 프롬프트로 진행',
      '배운 점 — 작게 시작할수록 완성이 빨라진다',
    ],
  },
  {
    name: 'InterBiz Edu Hub',
    tag: '교육 허브',
    url: 'https://interbiz-edu-hub.vercel.app',
    oneLiner: '사내 교육 자료를 주제별로 모아 찾아보는 러닝 아카이브',
    points: [
      '교육 콘텐츠를 주제별로 분류하고 검색하는 구조',
      '디자인 시안 없이 대화만으로 UI를 다듬어 완성',
      '배운 점 — 예시를 주면 결과물의 수준이 달라진다',
    ],
  },
  {
    name: 'InterPick',
    tag: '추천 픽',
    url: 'https://interpick.vercel.app',
    oneLiner: '고민되는 선택지를 올리고 팀의 픽을 모으는 추천 서비스',
    points: [
      '선택지를 등록하면 투표와 픽으로 의견이 모이는 흐름',
      '기능 추가와 수정도 코드 대신 말로 반복해서 개선',
      '배운 점 — 마지막 검수는 반드시 사람의 몫이다',
    ],
  },
]

type Tip = {
  icon: LucideIcon
  title: string
  desc: string
  bad: string
  good: string
}

const TIPS: Tip[] = [
  {
    icon: UserRound,
    title: '역할을 정해주세요',
    desc: '"10년차 기획자처럼" — 역할을 주면 답변의 기준과 눈높이가 생깁니다.',
    bad: '보고서 써줘',
    good: '너는 10년차 전략기획자야. 아래 자료로 한 장짜리 보고서 초안을 써줘',
  },
  {
    icon: Layers,
    title: '맥락부터 주세요',
    desc: '상황·대상·목적을 먼저 알려주면 AI가 되묻지 않고 바로 일합니다.',
    bad: '메일 써줘',
    good: '거래처에 납기 지연 양해를 구하는 메일이야. 정중하지만 간결하게 써줘',
  },
  {
    icon: LayoutList,
    title: '형식을 지정하세요',
    desc: '표, 불릿, 분량까지 정해주면 바로 복사해 쓸 수 있는 답이 옵니다.',
    bad: '정리해줘',
    good: '핵심만 표로 정리해줘. 항목·일정·담당자 3개 열로',
  },
  {
    icon: Quote,
    title: '예시를 붙여주세요',
    desc: '원하는 결과물 샘플 하나면 톤과 수준이 단번에 맞춰집니다.',
    bad: '이런 느낌으로 써줘',
    good: '아래 예시와 같은 톤으로 써줘 (잘 쓴 사례 붙여넣기)',
  },
  {
    icon: ListChecks,
    title: '하나씩 시키세요',
    desc: '큰 일은 단계로 쪼개서 확인하며 진행해야 품질이 안정적입니다.',
    bad: '기획서 완성해줘',
    good: '먼저 목차만 잡아줘. 내가 확인하면 항목별로 채워가자',
  },
  {
    icon: RefreshCw,
    title: '끝나면 되물으세요',
    desc: '"빠진 건 없어?" 한마디가 검증의 시작입니다. 결과를 그대로 믿지 마세요.',
    bad: '(결과를 그대로 복사해서 전달)',
    good: '이 답변에서 빠졌거나 틀린 부분이 있는지 스스로 점검해줘',
  },
]

const VIBE_STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: MessageSquareText, title: '말로 설명', desc: '만들고 싶은 것을 대화하듯 설명' },
  { icon: Bot, title: 'AI가 코딩', desc: '화면·기능·데이터까지 한 번에 작성' },
  { icon: Eye, title: '보며 수정', desc: '결과를 확인하며 말로 고치기를 반복' },
  { icon: Rocket, title: '바로 배포', desc: 'Vercel 등으로 링크 공유까지 완료' },
]

const VIBE_TOOLS = ['Claude Code', 'Cursor', 'v0', 'Bolt', 'Replit']

const VIBE_RULES = [
  '작게 시작해서 자주 확인하기 — 한 번에 완성품을 바라지 않기',
  '한 번에 한 가지씩 요청하기 — 수정 지시는 짧고 구체적으로',
  '마지막 검수는 사람이 하기 — 링크·숫자·문구는 직접 확인',
]

const AI_AREAS = [
  '문서 초안',
  '요약·번역',
  '회의록 정리',
  '데이터 정리',
  '아이디어 발상',
  '코드 작성',
  '이미지 생성',
  '자료 조사',
]

const PROMPT_FORMULA = [
  { label: '역할', desc: '누구로서 답하게 할까' },
  { label: '맥락', desc: '지금 어떤 상황인가' },
  { label: '형식', desc: '어떤 모양으로 받을까' },
  { label: '예시', desc: '기준이 되는 샘플 하나' },
]

const MCP_EXAMPLES = ['노션', '깃허브', '슬랙', '구글 드라이브', '사내 DB']

const AUTOMATION_EXAMPLES = [
  '매일 아침 메일과 뉴스 요약 받아보기',
  '주간 보고 초안을 자동으로 만들기',
  '데이터 취합 후 리포트 정리와 발송까지',
]

/* ============================================================
   기계음 사운드 엔진 (Web Audio) — 클릭 틱 + 서보 모터 소리
   ============================================================ */

function createAudioEngine() {
  let ctx: AudioContext | null = null
  let muted = false

  const ready = (): AudioContext | null => {
    if (typeof window === 'undefined') return null
    // 자동재생 정책: 사용자 입력이 있기 전에는 소리를 만들지 않는다
    const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
      .userActivation
    if (activation && !activation.hasBeenActive) return null
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }

  const click = () => {
    if (muted) return
    const c = ready()
    if (!c) return
    const t = c.currentTime
    const osc = c.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(1500, t)
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.05)
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.1, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    osc.connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.1)
    const tick = c.createOscillator()
    tick.type = 'triangle'
    tick.frequency.setValueAtTime(3400, t)
    const tickGain = c.createGain()
    tickGain.gain.setValueAtTime(0.05, t)
    tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03)
    tick.connect(tickGain).connect(c.destination)
    tick.start(t)
    tick.stop(t + 0.035)
  }

  const servo = () => {
    if (muted) return
    const c = ready()
    if (!c) return
    const t = c.currentTime
    const osc = c.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(170, t)
    osc.frequency.linearRampToValueAtTime(540, t + 0.14)
    osc.frequency.linearRampToValueAtTime(390, t + 0.3)
    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 950
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.03)
    gain.gain.setValueAtTime(0.06, t + 0.22)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
    osc.connect(filter).connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.34)
  }

  return {
    click,
    servo,
    setMuted: (m: boolean) => {
      muted = m
    },
  }
}

const audio = createAudioEngine()

/* ============================================================
   로고 (인라인 SVG)
   ============================================================ */

function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="none">
      <path
        fill="rgb(84, 84, 84)"
        d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
      />
    </svg>
  )
}

/* ============================================================
   공통 섹션 헤더
   ============================================================ */

function SectionHeader({ no, kicker, title, sub }: { no: string; kicker: string; title: string; sub: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-3 text-[11.5px] font-medium text-blue-500">
        {no} · {kicker}
      </div>
      <h2 className="mb-3 text-[1.5rem] font-medium leading-[1.15] tracking-tight text-gray-900 sm:text-[1.75rem]">
        {title}
      </h2>
      <p className="text-[13px] font-normal text-gray-400">{sub}</p>
    </div>
  )
}

/* ============================================================
   App
   ============================================================ */

export default function App() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const activeRef = useRef(0)
  const scrollRaf = useRef(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    audio.setMuted(muted)
  }, [muted])

  const scrollToIndex = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onScroll = () => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0
      const scroller = scrollerRef.current
      if (!scroller) return
      const mid = scroller.scrollTop + scroller.clientHeight / 2
      let idx = 0
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= mid) idx = i
      })
      if (idx !== activeRef.current) {
        activeRef.current = idx
        setActiveIdx(idx)
        audio.servo() // 화면 전환 기계음
      }
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const nextKeys = ['ArrowDown', 'ArrowRight', 'PageDown', ' ']
      const prevKeys = ['ArrowUp', 'ArrowLeft', 'PageUp']
      const isNext = nextKeys.includes(e.key)
      const isPrev = prevKeys.includes(e.key)
      if (!isNext && !isPrev && e.key !== 'Home' && e.key !== 'End') return
      e.preventDefault()
      let idx = activeRef.current
      if (isNext) idx = Math.min(idx + 1, SECTIONS.length - 1)
      if (isPrev) idx = Math.max(idx - 1, 0)
      if (e.key === 'Home') idx = 0
      if (e.key === 'End') idx = SECTIONS.length - 1
      scrollToIndex(idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 히어로 영상 속 로봇손이 마우스 커서에 연동돼 부드럽게 움직인다 (첫 화면에서만)
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    const target = { x: 0, y: 0 } // 화면 중앙 기준 -1 ~ 1
    const cur = { x: 0, y: 0 }
    let press = 0
    let raf = 0
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onDown = () => {
      press = 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    const step = () => {
      cur.x += (target.x - cur.x) * 0.08
      cur.y += (target.y - cur.y) * 0.08
      press *= 0.9
      const el = videoRef.current
      if (el && activeRef.current === 0) {
        // 커서 쪽으로 이동 + 살짝 기울고, 클릭하면 눌리듯 살짝 물러난다
        const scale = 1.1 - press * 0.025
        el.style.transform = `scale(${scale}) translate(${cur.x * 42}px, ${cur.y * 26}px) rotate(${cur.x * 1.5}deg)`
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  // 클릭 틱 기계음
  useEffect(() => {
    const onDown = () => audio.click()
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  const navTo = (id: string) => {
    const idx = SECTIONS.findIndex((s) => s.id === id)
    if (idx >= 0) scrollToIndex(idx)
  }

  const setSectionRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el
  }

  const sectionClass =
    'relative min-h-screen snap-start flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 pt-20 pb-12'

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className="relative h-screen snap-y snap-proximity overflow-y-auto overflow-x-hidden scroll-smooth bg-[#f0f0ee] text-gray-900 antialiased"
    >
      {/* ───────── 상단 내비게이션 (알약 2 + 음소거 버튼) ───────── */}
      <header className="fixed inset-x-0 top-0 z-40">
        <nav className="flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              navTo('home')
            }}
            aria-label="홈으로"
            className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0"
            style={{ backgroundColor: '#EDEDED' }}
          >
            <Logo />
          </a>
          <div
            className="flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3"
            style={{ backgroundColor: '#EDEDED' }}
          >
            {SECTIONS.slice(1).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  navTo(s.id)
                }}
                className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? '기계음 켜기' : '기계음 끄기'}
            title={muted ? '기계음 켜기' : '기계음 끄기'}
            className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            style={{ backgroundColor: '#EDEDED' }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </nav>
      </header>

      {/* ───────── 우측 슬라이드 인디케이터 ───────── */}
      <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2.5 sm:right-5">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={s.label}
            title={s.label}
            className={`rounded-full transition-all duration-300 ${
              i === activeIdx ? 'h-5 w-1.5 bg-gray-900' : 'h-1.5 w-1.5 bg-gray-900/25 hover:bg-gray-900/50'
            }`}
          />
        ))}
      </div>

      {/* ───────── 0. 히어로 (로봇 손 배경 영상) ───────── */}
      <section id="home" ref={setSectionRef(0)} className="relative min-h-screen snap-start overflow-hidden">
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) el.muted = true
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.1)', willChange: 'transform' }}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
            <div className="max-w-xs">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  navTo('projects')
                }}
                className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3 group"
              >
                사내 AI 활용 공유 · 25–30분
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
              <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
                AI,
                <br />
                질문에서 업무로
              </h1>
              <p className="text-[13px] text-gray-400 font-normal mb-3">
                물어보는 AI를 넘어, 일하는 AI로. 직접 만들고 써본 것만 담았습니다.
              </p>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  navTo('projects')
                }}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
              >
                발표 시작하기
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 1. 직접 만든 사이트 리뷰 ───────── */}
      <section id="projects" ref={setSectionRef(1)} className={sectionClass}>
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeader
            no="01"
            kicker="프로젝트 리뷰"
            title="AI와 함께 만든 사이트 3개"
            sub="기획은 사람이, 코드는 AI가 — 말로 만들어 배포까지 마친 실제 서비스입니다."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {PROJECTS.map((p) => (
              <div key={p.name} className="flex flex-col overflow-hidden rounded-2xl" style={{ backgroundColor: '#EDEDED' }}>
                {/* 브라우저 목업 + 라이브 미리보기 */}
                <div className="px-4 pt-4">
                  <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="flex items-center gap-1.5 border-b border-gray-100 px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-gray-200" />
                      <span className="h-2 w-2 rounded-full bg-gray-200" />
                      <span className="h-2 w-2 rounded-full bg-gray-200" />
                      <span className="ml-2 flex-1 truncate rounded-md bg-[#f0f0ee] px-2 py-0.5 text-[10px] text-gray-400">
                        {p.url.replace('https://', '')}
                      </span>
                    </div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#f0f0ee]">
                      <iframe
                        src={p.url}
                        title={`${p.name} 미리보기`}
                        loading="lazy"
                        tabIndex={-1}
                        aria-hidden
                        className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-medium text-gray-900">{p.name}</h3>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-blue-500">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-gray-500">{p.oneLiner}</p>
                  <ul className="flex flex-col gap-1.5">
                    {p.points.map((point) => (
                      <li key={point} className="flex gap-2 text-[11.5px] leading-relaxed text-gray-500">
                        <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-auto inline-flex items-center gap-1.5 pt-1 text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    사이트 열기
                    <ExternalLink size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 2. AI 사용 팁 ───────── */}
      <section id="tips" ref={setSectionRef(2)} className={sectionClass}>
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeader
            no="02"
            kicker="AI 사용 팁"
            title="이렇게 물어보면 답이 달라집니다"
            sub="오늘부터 바로 쓸 수 있는 프롬프트 습관 6가지 — 실제 화면 시연과 함께 보시죠."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIPS.map((tip, i) => (
              <div key={tip.title} className="flex flex-col gap-3 rounded-2xl p-5" style={{ backgroundColor: '#EDEDED' }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700">
                    <tip.icon size={15} />
                  </span>
                  <div>
                    <div className="text-[10.5px] font-medium tracking-wide text-blue-500">TIP 0{i + 1}</div>
                    <h3 className="text-[14px] font-medium text-gray-900">{tip.title}</h3>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-gray-500">{tip.desc}</p>
                <div className="mt-auto flex flex-col gap-1.5 rounded-xl bg-white p-3">
                  <div className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-gray-400">
                    <X size={12} className="mt-0.5 shrink-0" />
                    <span>{tip.bad}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11.5px] font-medium leading-relaxed text-gray-700">
                    <Check size={12} className="mt-0.5 shrink-0 text-blue-500" />
                    <span>{tip.good}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl bg-gray-900 px-6 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <MonitorPlay size={18} className="shrink-0 text-blue-400" />
              <p className="text-[13px] font-medium text-white">
                여기서 잠깐 — 슬라이드 대신 실제 화면으로 직접 보여드립니다.
              </p>
            </div>
            <span className="rounded-full bg-blue-500 px-3 py-1 text-[10.5px] font-semibold tracking-widest text-white">
              LIVE DEMO
            </span>
          </div>
        </div>
      </section>

      {/* ───────── 3. 바이브코딩 ───────── */}
      <section id="vibe" ref={setSectionRef(3)} className={sectionClass}>
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeader
            no="03"
            kicker="바이브코딩"
            title="코드를 몰라도, 말로 만듭니다"
            sub="바이브코딩(Vibe Coding) — 원하는 것을 자연어로 설명하면 AI가 코드를 작성하는 개발 방식."
          />
          <div className="grid gap-5 lg:grid-cols-5">
            <div className="flex flex-col gap-4 rounded-2xl p-6 lg:col-span-2" style={{ backgroundColor: '#EDEDED' }}>
              <div className="text-[10.5px] font-medium tracking-wide text-blue-500">바이브코딩이란?</div>
              <p className="text-[15px] font-medium leading-relaxed text-gray-900">
                "가장 인기 있는 새로운 프로그래밍 언어는 영어다."
              </p>
              <p className="text-[11.5px] text-gray-400">— 안드레 카파시(Andrej Karpathy), AI 연구자</p>
              <p className="text-[12px] leading-relaxed text-gray-500">
                2025년 초 카파시가 이름 붙인 개발 방식입니다. 세부 코드가 아니라 만들고 싶은 결과물에
                집중하고, 구현은 AI에게 맡깁니다. 개발자가 아니어도 아이디어를 서비스로 만들 수 있습니다.
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {VIBE_TOOLS.map((tool) => (
                  <span key={tool} className="rounded-full bg-white px-3 py-1 text-[11.5px] font-medium text-gray-700">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#EDEDED' }}>
                <div className="mb-4 text-[10.5px] font-medium tracking-wide text-blue-500">진행 방식 — 4단계 반복</div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {VIBE_STEPS.map((step, i) => (
                    <div key={step.title} className="flex flex-col gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700">
                        <step.icon size={15} />
                      </span>
                      <div className="text-[12.5px] font-medium text-gray-900">
                        {i + 1}. {step.title}
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#EDEDED' }}>
                <div className="mb-3 text-[10.5px] font-medium tracking-wide text-blue-500">실전 수칙 3가지</div>
                <ul className="flex flex-col gap-2">
                  {VIBE_RULES.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-[12px] leading-relaxed text-gray-700">
                      <Check size={13} className="mt-0.5 shrink-0 text-blue-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="px-1 text-[12.5px] font-medium text-blue-500">
                앞서 본 사이트 3개도, 지금 보고 계신 이 발표 사이트도 전부 이 방식으로 만들었습니다 →
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 4. AI 활용 영역 · 프롬프트 · MCP · 자동화 ───────── */}
      <section id="extend" ref={setSectionRef(4)} className={sectionClass}>
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeader
            no="04"
            kicker="프롬프트 · MCP · 자동화"
            title="질문에서 업무로 넓히는 법"
            sub="어디에 쓸지, 어떻게 시킬지, 무엇과 연결할지 — 그리고 자동화까지."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl p-5" style={{ backgroundColor: '#EDEDED' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700">
                  <LayoutGrid size={15} />
                </span>
                <h3 className="text-[14px] font-medium text-gray-900">활용 영역</h3>
              </div>
              <p className="text-[12px] leading-relaxed text-gray-500">
                글쓰기부터 분석까지 — 반복되는 지식 업무 대부분이 AI의 영역입니다.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {AI_AREAS.map((area) => (
                  <span key={area} className="rounded-full bg-white px-3 py-1 text-[11.5px] font-medium text-gray-700">
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-5" style={{ backgroundColor: '#EDEDED' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700">
                  <PenLine size={15} />
                </span>
                <h3 className="text-[14px] font-medium text-gray-900">프롬프트 스킬</h3>
              </div>
              <p className="text-[12px] leading-relaxed text-gray-500">
                좋은 질문의 공식 — 네 칸만 채우면 결과가 달라집니다.
              </p>
              <div className="flex flex-col gap-1.5">
                {PROMPT_FORMULA.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-1.5">
                    <span className="w-10 shrink-0 text-center text-[11px] font-semibold text-blue-500">{f.label}</span>
                    <span className="text-[11.5px] text-gray-500">{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-5" style={{ backgroundColor: '#EDEDED' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700">
                  <Plug size={15} />
                </span>
                <h3 className="text-[14px] font-medium text-gray-900">MCP — AI에 손발 달기</h3>
              </div>
              <p className="text-[12px] leading-relaxed text-gray-500">
                Model Context Protocol. AI를 사내 시스템과 데이터에 연결하는 표준 규격 — AI용 USB-C라고
                생각하면 쉽습니다. 연결되는 순간 AI가 직접 조회하고 실행합니다.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MCP_EXAMPLES.map((ex) => (
                  <span key={ex} className="rounded-full bg-white px-3 py-1 text-[11.5px] font-medium text-gray-700">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl p-5" style={{ backgroundColor: '#EDEDED' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700">
                  <Workflow size={15} />
                </span>
                <h3 className="text-[14px] font-medium text-gray-900">자동화 — 반복 업무 맡기기</h3>
              </div>
              <p className="text-[12px] leading-relaxed text-gray-500">
                정해진 시간에 정해진 일을 AI가 알아서 하고, 사람은 확인만 합니다.
              </p>
              <ul className="flex flex-col gap-1.5">
                {AUTOMATION_EXAMPLES.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-[11.5px] text-gray-500">
                    <Check size={12} className="shrink-0 text-blue-500" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* 마무리 */}
          <div className="mt-8 flex flex-col items-center gap-2.5 text-center">
            <Logo />
            <p className="text-[15px] font-medium text-gray-900">
              질문은 시작일 뿐입니다. 업무에 녹일 때, AI는 도구가 됩니다.
            </p>
            <p className="text-[11.5px] text-gray-400">
              이 발표 사이트 역시 바이브코딩으로 만들었습니다 · InterBiz
            </p>
            <span
              className="mt-1 inline-flex items-center rounded-full px-4 py-2 text-[12px] font-medium text-gray-700"
              style={{ backgroundColor: '#EDEDED' }}
            >
              Q&A · 자유롭게 질문해 주세요
            </span>
          </div>
        </div>
      </section>

    </div>
  )
}
