interface VideoPlayerProps {
  src: string | null
  title: string
}

function toEmbedUrl(src: string): string {
  if (/youtube\.com\/embed\//.test(src)) return src
  const short = src.match(/youtu\.be\/([\w-]+)/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  const watch = src.match(/youtube\.com\/watch\?v=([\w-]+)/)
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`
  return src
}

// V1: YouTube embed via iframe. V2: Bunny.net Stream when DRM is wired up.
export function VideoPlayer({ src, title }: VideoPlayerProps) {
  if (src) {
    return (
      <div className="aspect-video w-full bg-ink-900 border border-ink-800">
        <iframe
          src={toEmbedUrl(src)}
          title={title}
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="aspect-video w-full bg-ink-900 border border-ink-800 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-display text-bone-muted text-xs tracking-widest uppercase mb-2">
          Video
        </p>
        <p className="text-bone-muted text-sm">
          Footage drops here once the URL is set on this lesson.
        </p>
      </div>
    </div>
  )
}
