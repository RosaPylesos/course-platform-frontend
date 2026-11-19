import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { supportedLanguages } from "@/lib/highlighter"

function CodeBlockEditor({ content, onChange }) {
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
                    Язык программирования
                </label>

                <Select
                    value={content.language}
                    onValueChange={(value) =>
                        updateField("language", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {supportedLanguages.map((language) => (
                            <SelectItem key={language} value={language}>
                                {language}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">
                    Код
                </label>

                <Textarea
                    value={content.code}
                    onChange={(event) =>
                        updateField("code", event.target.value)
                    }
                    placeholder="Введите код"
                    rows={12}
                    className="font-mono"
                />
            </div>
        </div>
    )
}

export default CodeBlockEditor