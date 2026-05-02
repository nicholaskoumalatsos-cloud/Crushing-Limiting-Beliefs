import { useState } from 'react'
import { PlayIcon } from '@/components/icons'

interface VideoPlayerProps {
  src: string | null
  title: string
}

function getYouTubeId(src: string): string | null {
  const short = src.match(/youtu\.be\/([\w-]+)/)
  if (short) return short[1]
  const watch = src.match(/youtube\.com\/watch\?v=([\w-]+)/)
  if (watch) return watch[1]
  const embed = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/)
  if (embed) return embed[1]
  return null
}

function youTubeEmbedUrl(id: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    playsinline: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

export function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [activated, setActivated] = useState(false)

  if (!src) return null

  const youTubeId = getYouTubeId(src)

  if (!youTubeId) {
    return (
      <div className="aspect-video w-full bg-ink-900 border border-ink-800">
        <iframe
          src={src}
          title={title}
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (activated) {
    return (
      <div className="aspect-video w-full bg-ink-900 border border-ink-800">
        <iframe
          src={youTubeEmbedUrl(youTubeId)}
          title={title}
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className="group relative aspect-video w-full bg-ink-900 border border-ink-800 overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Play ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const img = e.currentTarget
          if (!img.dataset.fallback) {
            img.dataset.fallback = '1'
            img.src = `https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 group-hover:from-black/60 group-hover:via-black/10 group-hover:to-black/20 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-accent group-hover:bg-accent-hover flex items-center justify-center transition-colors shadow-lg">
          <PlayIcon className="w-8 h-8 md:w-10 md:h-10 text-bone ml-1" />
        </div>
      </div>
    </button>
  )
}
