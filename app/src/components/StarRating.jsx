import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_VALUES = [1, 2, 3, 4, 5];

/**
 * Renders 1-5 stars. Pass `value` for a read-only display (e.g. an
 * average rating, which may be fractional) or `interactive` + `onRate`
 * to let the user click a star to submit a rating.
 */
export function StarRating({
  value = 0,
  interactive = false,
  onRate,
  size = "size-5",
  className,
}) {
  const [hovered, setHovered] = useState(null);
  const displayValue = hovered ?? value;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_VALUES.map((star) => {
        const filled = star <= Math.round(displayValue);

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            className={cn(
              "text-muted-foreground",
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default"
            )}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                size,
                filled ? "fill-yellow-400 text-yellow-400" : "fill-transparent"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
