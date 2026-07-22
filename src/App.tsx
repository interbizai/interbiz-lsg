import { useEffect, useRef } from 'react'
import { ArrowRight, Globe, Instagram, Twitter } from 'lucide-react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4'

const FADE_MS = 500
const FADE_OUT_LEAD_S = 0.55

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const fadingOutRef = useRef(false)
  const restartTimeoutRef = useRef<number | null>(null)

  // rAF-based fade toward a target opacity; resumes from the current opacity
  // and cancels any in-flight fade so animations never compete.
  const fadeTo = (target: number) => {
    const video = videoRef.current
    if (!video) return
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    const from = parseFloat(video.style.opacity || '0')
    const startedAt = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / FADE_MS, 1)
      video.style.opacity = String(from + (target - from) * progress)
      rafRef.current = progress < 1 ? requestAnimationFrame(step) : null
    }
    rafRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      if (restartTimeoutRef.current !== null) window.clearTimeout(restartTimeoutRef.current)
    }
  }, [])

  const handleLoadedData = () => {
    fadingOutRef.current = false
    fadeTo(1)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || fadingOutRef.current) return
    if (Number.isFinite(video.duration) && video.duration - video.currentTime <= FADE_OUT_LEAD_S) {
      fadingOutRef.current = true
      fadeTo(0)
    }
  }

  const handleEnded = () => {
    const video = videoRef.current
    if (!video) return
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    video.style.opacity = '0'
    restartTimeoutRef.current = window.setTimeout(() => {
      video.currentTime = 0
      void video.play()
      fadingOutRef.current = false
      fadeTo(1)
    }, 100)
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover translate-y-[17%]"
        style={{ opacity: 0 }}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <nav className="relative z-20 pl-6 pr-6 py-6">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white">
              <Globe size={24} />
              <span className="font-semibold text-lg">Asme</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                Pricing
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                About
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="text-white text-sm font-medium">
              Sign Up
            </button>
            <button type="button" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
              Login
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        <div className="max-w-xl w-full space-y-4">
          <form
            className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder:text-white/40 text-base"
            />
            <button type="submit" aria-label="Subscribe" className="shrink-0 bg-white rounded-full p-3 text-black">
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-white text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on
            exciting updates.
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Manifesto
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <button
          type="button"
          aria-label="Instagram"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Instagram size={20} />
        </button>
        <button
          type="button"
          aria-label="Twitter"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Twitter size={20} />
        </button>
        <button
          type="button"
          aria-label="Website"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={20} />
        </button>
      </footer>
    </div>
  )
}
