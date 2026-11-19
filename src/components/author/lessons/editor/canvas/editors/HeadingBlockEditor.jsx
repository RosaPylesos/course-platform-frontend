import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function HeadingBlockEditor({ content, onChange }) {
    function updateField(field, value) {
        onChange({
            ...content,
            [field]: value,
        })
    }

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Текст заголовка
                </label>

                <Input
                    value={content.text}
                    onChange={(event) =>
                        updateField("text", event.target.value)
                    }
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Уровень заголовка
                </label>

                <Select
                    value={String(content.level)}
                    onValueChange={(value) =>
                        updateField("level", Number(value))
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((level) => (
                            <SelectItem
                                key={level}
                                value={String(level)}
                            >
                                H{level}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default HeadingBlockEditor