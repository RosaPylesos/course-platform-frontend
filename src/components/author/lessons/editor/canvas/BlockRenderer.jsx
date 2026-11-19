import LessonHeadingBlock from "@/components/lesson-blocks/LessonHeadingBlock"
import LessonTextBlock from "@/components/lesson-blocks/LessonTextBlock"
import LessonImageBlock from "@/components/lesson-blocks/LessonImageBlock"
import LessonVideoBlock from "@/components/lesson-blocks/LessonVideoBlock"
import LessonCalloutBlock from "@/components/lesson-blocks/LessonCalloutBlock"
import LessonCodeBlock from "@/components/lesson-blocks/LessonCodeBlock"

const blockComponents = {
    heading: LessonHeadingBlock,
    text: LessonTextBlock,
    image: LessonImageBlock,
    video: LessonVideoBlock,
    callout: LessonCalloutBlock,
    code: LessonCodeBlock,
}

function BlockRenderer({ blocks, isPreview = false }) {
    if (!blocks?.length) {
        return (
            <p className="py-8 text-center text-muted-foreground">
                {isPreview
                    ? "В этом уроке пока нет содержимого."
                    : "Добавьте первый блок в урок."}
            </p>
        )
    }

    return (
        <div className="space-y-6">
            {blocks.map((block) => {
                const BlockComponent = blockComponents[block.type]

                if (!BlockComponent) return null

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

export default BlockRenderer