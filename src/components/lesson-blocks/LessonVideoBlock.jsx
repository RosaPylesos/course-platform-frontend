function getEmbedUrl(url) {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)

    // YouTube
    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      const videoId = parsedUrl.searchParams.get("v")
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null
    }

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1)
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null
    }

    // Vimeo
    if (parsedUrl.hostname === "vimeo.com") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0]
      return videoId
        ? `https://player.vimeo.com/video/${videoId}`
        : null
    }

    return null
  } catch {
    return null
  }
}

function LessonVideoBlock({ content }) {
  const embedUrl = getEmbedUrl(content?.url)

  if (!embedUrl) {
    return null
  }

  return (
    <figure className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          title={content.caption || "Видео урока"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {content.caption && (
        <figcaption className="text-center text-sm text-muted-foreground">
          {content.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default LessonVideoBlock