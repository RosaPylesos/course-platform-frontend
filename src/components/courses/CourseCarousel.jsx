import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import CourseCard from "./CourseCard"

function CourseCarousel({ courses }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {courses.map((course) => (
          <CarouselItem
            key={course.id}
            className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <CourseCard course={course} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="-left-4" />
      <CarouselNext className="-right-4" />
    </Carousel>
  )
}

export default CourseCarousel