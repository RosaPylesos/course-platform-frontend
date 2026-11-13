function LessonImageBlock({ content }) {
  if (!content?.url) {
    return null
  }

  return (
    <figure className="space-y-2">
      <img
        src={content.url}
        alt={content.alt ?? ""}
        className="mx-auto max-w-full rounded-lg"
        loading="lazy"
      />

      {content.caption && (
        <figcaption className="text-center text-sm text-muted-foreground">
          {content.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default LessonImageBlock