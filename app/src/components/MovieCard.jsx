import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
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
        <CardHeader>
          <CardTitle className="line-clamp-1 text-base">{movie.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">
          {movie.genre} · {movie.releaseYear}
        </CardContent>
      </Card>
    </Link>
  );
}
