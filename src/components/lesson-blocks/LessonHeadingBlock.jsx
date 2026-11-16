function LessonHeadingBlock({ content }) {
  const level = Math.min(6, Math.max(1, Number(content.level) || 1))
  const HeadingTag = `h${level}`

  const headingStyles = {
    1: "text-3xl font-bold",
    2: "text-2xl font-bold",
    3: "text-xl font-semibold",
    4: "text-lg font-semibold",
    5: "text-base font-semibold",
    6: "text-sm font-semibold",
  }

  return (
    <HeadingTag className={headingStyles[level]}>
      {content.text}
    </HeadingTag>
  )
}

export default LessonHeadingBlock