import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

const markOptions = [
    { value: "bold", label: "Жирный" },
    { value: "italic", label: "Курсив" },
    { value: "underline", label: "Подчёркнутый" },
]

function TextBlockEditor({ content, onChange }) {
    const runs = content.runs ?? []

    function updateRun(index, updatedRun) {
        const nextRuns = runs.map((run, runIndex) =>
            runIndex === index ? updatedRun : run
        )

        onChange({ ...content, runs: nextRuns })
    }

    function addRun() {
        onChange({
            ...content,
            runs: [
                ...runs,
                { content: "", marks: [] },
            ],
        })
    }

    function deleteRun(index) {
        onChange({
            ...content,
            runs: runs.filter((_, runIndex) => runIndex !== index),
        })
    }

    function toggleMark(index, mark, checked) {
        const run = runs[index]

        const marks = checked
            ? [...run.marks, mark]
            : run.marks.filter((item) => item !== mark)

        updateRun(index, { ...run, marks })
    }

    return (
        <div className="space-y-4">
            {runs.map((run, index) => (
                <div
                    key={index}
                    className="space-y-3 rounded-lg border p-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Фрагмент {index + 1}
                        </span>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRun(index)}
                            aria-label={`Удалить фрагмент ${index + 1}`}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                    
                    <Textarea
                        value={run.content}
                        placeholder="Введите текст фрагмента"
                        rows={3}
                        onChange={(event) =>
                            updateRun(index, {
                                ...run,
                                content: event.target.value,
                            })
                        }
                    />

                    <div className="flex flex-wrap gap-4">
                        {markOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 text-sm"
                            >
                                <Checkbox
                                    checked={run.marks.includes(option.value)}
                                    onCheckedChange={(checked) =>
                                        toggleMark(
                                            index,
                                            option.value,
                                            checked === true
                                        )
                                    }
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={addRun}
            >
                <Plus className="mr-2 size-4" />
                Добавить фрагмент
            </Button>
        </div>
    )
}

export default TextBlockEditor