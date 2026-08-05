import { StarRating } from "@/components/StarRating";
import { formatDate } from "@/lib/utils";

export function MovieReviews({ reviews, currentUserId }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No written reviews yet.</p>;
  }

  const sortedReviews = currentUserId
    ? [...reviews].sort((a, b) => {
        const aOwn = a.userId === currentUserId;
        const bOwn = b.userId === currentUserId;
        if (aOwn === bOwn) return 0;
        return aOwn ? -1 : 1;
      })
    : reviews;

  return (
    <ul className="space-y-4">
      {sortedReviews.map((review) => (
        <li key={review.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{review.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.updatedAt)}
            </span>
          </div>
          <StarRating value={review.value} size="size-3.5" className="mt-1" />
          <p className="mt-2 whitespace-pre-wrap text-sm">{review.review}</p>
        </li>
      ))}
    </ul>
  );
}
