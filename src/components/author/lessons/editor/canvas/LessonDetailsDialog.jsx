import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function LessonDetailsDialog({
    open,
    onOpenChange,
    name,
    description,
    onNameChange,
    onDescriptionChange,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Данные урока</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="lesson-name">Название</Label>
                        <Input
                            id="lesson-name"
                            value={name}
                            onChange={(event) =>
                                onNameChange(event.target.value)
                            }
                            placeholder="Название урока"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lesson-description">Описание</Label>
                        <Textarea
                            id="lesson-description"
                            value={description}
                            onChange={(event) =>
                                onDescriptionChange(event.target.value)
                            }
                            placeholder="Описание урока"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => onOpenChange(false)}>
                            Готово
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LessonDetailsDialog