import BlockRenderer from "../BlockRenderer"

import HeadingBlockEditor from "./HeadingBlockEditor"
import TextBlockEditor from "./TextBlockEditor"
import ImageBlockEditor from "./ImageBlockEditor"
import VideoBlockEditor from "./VideoBlockEditor"
import CalloutBlockEditor from "./CalloutBlockEditor"
import CodeBlockEditor from "./CodeBlockEditor"

const editorComponents = {
    heading: HeadingBlockEditor,
    text: TextBlockEditor,
    image: ImageBlockEditor,
    video: VideoBlockEditor,
    callout: CalloutBlockEditor,
    code: CodeBlockEditor,
}

function BlockEditor({ block, isEditing, onUpdate }) {
    if (!isEditing) {
        return <BlockRenderer blocks={[block]} />
    }

    const EditorComponent = editorComponents[block.type]

    if (!EditorComponent) {
        return <BlockRenderer blocks={[block]} />
    }

    return (
        <EditorComponent
            content={block.content}
            onChange={(content) => onUpdate(block.id, content)}
        />
    )
}

export default BlockEditor