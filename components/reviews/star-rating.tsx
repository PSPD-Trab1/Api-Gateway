import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  )
}
