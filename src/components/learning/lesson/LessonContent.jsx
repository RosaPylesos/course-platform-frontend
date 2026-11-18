import LessonHeadingBlock from "../../lesson-blocks/LessonHeadingBlock"
import LessonTextBlock from "../../lesson-blocks/LessonTextBlock"
import LessonImageBlock from "../../lesson-blocks/LessonImageBlock"
import LessonVideoBlock from "../../lesson-blocks/LessonVideoBlock"
import LessonCalloutBlock from "../../lesson-blocks/LessonCalloutBlock"
import LessonCodeBlock from "../../lesson-blocks/LessonCodeBlock"

const blockComponents = {
    heading: LessonHeadingBlock,
    text: LessonTextBlock,
    image: LessonImageBlock,
    video: LessonVideoBlock,
    callout: LessonCalloutBlock,
    code: LessonCodeBlock,
}

function LessonContent({ content }) {
    const blocks = content?.blocks ?? []

    if (blocks.length === 0) {
        return (
            <p className="py-8 text-center text-muted-foreground">
                Содержимое урока пока отсутствует.
            </p>
        )
    }

    return (
        <div className="space-y-6">
            {blocks.map((block) => {
                const BlockComponent = blockComponents[block.type]

                if (!BlockComponent) {
                    return null
                }

                return (
                    <BlockComponent
                        key={block.id}
                        content={block.content}
                    />
                )
            })}
        </div>
    )
}

export default LessonContent