import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function ImageBlockEditor({ content, onChange }) {
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
                    URL изображения
                </label>
                <Input
                    type="url"
                    value={content.url}
                    placeholder="https://example.com/image.jpg"
                    onChange={(event) =>
                        updateField("url", event.target.value)
                    }
                />
            </div>

            {content.url && (
                <div className="overflow-hidden rounded-lg border">
                    <img
                        src={content.url}
                        alt={content.alt || ""}
                        className="max-h-64 w-full object-contain"
                        onError={(event) => {
                            event.currentTarget.style.display = "none"
                        }}
                        onLoad={(event) => {
                            event.currentTarget.style.display = "block"
                        }}
                    />
                </div>
            )}

            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Альтернативный текст
                </label>
                <Input
                    value={content.alt}
                    placeholder="Описание изображения"
                    onChange={(event) =>
                        updateField("alt", event.target.value)
                    }
                />
                <p className="text-xs text-muted-foreground">
                    Краткое описание изображения для доступности.
                </p>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Подпись
                </label>
                <Textarea
                    value={content.caption ?? ""}
                    placeholder="Подпись под изображением (необязательно)"
                    rows={2}
                    onChange={(event) =>
                        updateField("caption", event.target.value)
                    }
                />
            </div>
        </div>
    )
}

export default ImageBlockEditor