import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setError("Movie not found"));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button asChild variant="link" className="px-0">
          <Link to="/">Back to movies</Link>
        </Button>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to="/">← Back to movies</Link>
      </Button>

      <div className="grid gap-8 sm:grid-cols-[300px_1fr]">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted">
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

        <div>
          <h1 className="text-3xl font-semibold">{movie.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {movie.genre} · {formatDate(movie.releaseDate)}
          </p>
          <p className="mt-4 whitespace-pre-wrap">{movie.description}</p>
        </div>
      </div>
    </div>
  );
}
