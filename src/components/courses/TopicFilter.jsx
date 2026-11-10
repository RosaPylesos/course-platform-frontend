import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function TopicFilter({ topics, value, onChange }) {
  return (
    <div className="w-full max-w-sm space-y-2">
      <h2 className="text-sm font-semibold">Тема курса</h2>

      <Select
        value={value || "all"}
        onValueChange={(selectedValue) =>
          onChange(selectedValue === "all" ? "" : selectedValue)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите тему" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Все темы</SelectItem>

          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.slug}>
              {topic.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TopicFilter