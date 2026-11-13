import { Link } from "react-router-dom"

import { NavigationMenuLink } from "@/components/ui/navigation-menu"

function getTopicUrl(topic) {
  const searchParams = new URLSearchParams()

  if (topic.children?.length > 0) {
    searchParams.set("topic", topic.id)
    searchParams.set("include_descendants", "true")
  } else {
    searchParams.set("topics", topic.slug)
  }

  return `/courses?${searchParams.toString()}`
}

function HeaderTopicItem({ topic }) {
  return (
    <div className="space-y-2">
      <NavigationMenuLink asChild>
        <Link
          to={getTopicUrl(topic)}
          className="block rounded-md p-2 text-sm hover:bg-accent"
        >
          {topic.name}
        </Link>
      </NavigationMenuLink>

      {topic.children?.length > 0 && (
        <div className="ml-3 space-y-1 border-l pl-2">
          {topic.children.map((child) => (
            <HeaderTopicItem key={child.id} topic={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeaderTopicItem