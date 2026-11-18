import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import TopicPicker from "@/components/author/TopicPicker"

function ReferenceFormDialog({
    open,
    onOpenChange,
    mode,
    title,
    initialData = {},
    fields,
    onSubmit,
    isSubmitting,
}) {
    const [formData, setFormData] = useState(initialData)

    useEffect(() => {
        if (open) {
            setFormData(initialData)
        }
    }, [open, initialData])

    function handleChange(name, value) {
        setFormData((current) => ({
            ...current,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        await onSubmit(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {mode === "create"
                                ? "Заполните данные для создания записи."
                                : "Измените необходимые данные."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <Label>{field.label}</Label>

                                {field.type === "select" ? (
                                    <Select
                                        value={formData[field.name] ?? ""}
                                        onValueChange={(value) =>
                                            handleChange(field.name, value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {field.options.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={String(option.value)}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type ==="topic-picker" ? (
                                    <TopicPicker
                                        topics={field.topics}
                                        value={formData[field.name] || null}
                                        allowClear
                                        onChange={(topic) =>
                                            handleChange(field.name, topic?.id ?? null)
                                        }
                                    />
                                ) : (
                                    <Input
                                        value={formData[field.name] ?? ""}
                                        onChange={(event) =>
                                            handleChange(
                                                field.name,
                                                event.target.value
                                            )
                                        }
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Сохранение..."
                                : mode === "create"
                                    ? "Создать"
                                    : "Сохранить"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ReferenceFormDialog