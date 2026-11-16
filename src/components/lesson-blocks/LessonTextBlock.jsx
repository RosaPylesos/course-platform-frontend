function LessonTextBlock({ content }) {
  const runs = content?.runs ?? []

  return (
    <p className="text-base leading-7">
      {runs.map((run, index) => {
        let element = run.content

        if (run.marks?.includes("bold")) {
          element = <strong>{element}</strong>
        }

        if (run.marks?.includes("italic")) {
          element = <em>{element}</em>
        }

        if (run.marks?.includes("underline")) {
          element = <u>{element}</u>
        }

        return (
          <span key={index}>
            {element}
          </span>
        )
      })}
    </p>
  )
}

export default LessonTextBlock