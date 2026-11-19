import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function VideoBlockEditor({ content, onChange }) {
    function updateField(field, value) {
        onChange({
            ...content,
            [field]: value,
        })
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    URL видео
                </label>
                <Input
                    type="url"
                    value={content.url}
                    placeholder="https://example.com/video"
                    onChange={(event) =>
                        updateField("url", event.target.value)
                    }
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Подпись
                </label>
                <Textarea
                    value={content.caption ?? ""}
                    placeholder="Подпись к видео (необязательно)"
                    rows={2}
                    onChange={(event) =>
                        updateField("caption", event.target.value)
                    }
                />
            </div>
        </div>
    )
}

export default VideoBlockEditor