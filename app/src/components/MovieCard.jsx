import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { formatDate } from "@/lib/utils";

export function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`}>
      <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="aspect-[2/3] w-full bg-muted">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No poster
            </div>
          )}
        </div>
        <CardHeader className="pt-6">
          <CardTitle className="line-clamp-2 text-base">{movie.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-6 text-sm text-muted-foreground">
          <p className="truncate">{movie.genre}</p>
          <p>{formatDate(movie.releaseDate)}</p>
          {movie.averageRating != null && (
            <div className="mt-2 flex items-center gap-1.5">
              <StarRating value={movie.averageRating} size="size-3.5" />
              <span className="text-xs">
                {movie.averageRating.toFixed(1)} ({movie.ratingCount})
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
