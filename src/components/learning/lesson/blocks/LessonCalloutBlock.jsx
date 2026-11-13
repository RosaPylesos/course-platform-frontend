const variants = {
  info: {
    container: "border-blue-500/30 bg-blue-500/5",
    title: "Информация",
  },
  warning: {
    container: "border-yellow-500/30 bg-yellow-500/5",
    title: "Внимание",
  },
  quote: {
    container: "border-l-4 border-muted-foreground/40 bg-muted/50",
    title: "Цитата",
  },
}

function LessonCalloutBlock({ content }) {
  const variant = variants[content?.variant] ?? variants.info

  if (!content?.text) {
    return null
  }

  return (
    <aside className={`rounded-lg border p-4 ${variant.container}`}>
      <p className="mb-1 font-semibold">
        {variant.title}
      </p>

      <p className="text-sm leading-6">
        {content.text}
      </p>
    </aside>
  )
}

export default LessonCalloutBlock