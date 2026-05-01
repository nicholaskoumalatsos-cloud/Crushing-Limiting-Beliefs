interface VideoPlayerProps {
  src: string | null
  title: string
}

// V1: placeholder. V2: Bunny.net iframe (or HLS.js for direct streaming).
export function VideoPlayer({ src, title }: VideoPlayerProps) {
  if (src) {
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

  return (
    <div className="aspect-video w-full bg-ink-900 border border-ink-800 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-display text-bone-muted text-xs tracking-widest uppercase mb-2">
          Video
        </p>
        <p className="text-bone-muted text-sm">
          Footage drops here once Bunny.net is wired up.
        </p>
      </div>
    </div>
  )
}
