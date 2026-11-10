import { Input } from "@/components/ui/input"

function CourseSearch({ value, onChange }) {
    return (
        <div>
            <Input
                type="search"
                placeholder="Поиск курсов..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

export default CourseSearch