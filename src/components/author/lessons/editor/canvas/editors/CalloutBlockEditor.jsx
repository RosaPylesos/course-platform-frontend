import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const variants = [
    { value: "info", label: "Информация" },
    { value: "warning", label: "Предупреждение" },
    { value: "quote", label: "Цитата" },
]

function CalloutBlockEditor({ content, onChange }) {
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
                    Тип заметки
                </label>

                <Select
                    value={content.variant}
                    onValueChange={(value) =>
                        updateField("variant", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {variants.map((variant) => (
                            <SelectItem
                                key={variant.value}
                                value={variant.value}
                            >
                                {variant.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Текст заметки
                </label>

                <Textarea
                    value={content.text}
                    placeholder="Введите текст заметки"
                    rows={4}
                    onChange={(event) =>
                        updateField("text", event.target.value)
                    }
                />
            </div>
        </div>
    )
}

export default CalloutBlockEditor