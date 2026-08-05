import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

export function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch(() => setError("Movie not found"));
  }, [id]);

  useEffect(() => {
    if (!user) {
      setMyRating(null);
      return;
    }

    api
      .get(`/movies/${id}/rating`)
      .then((res) => setMyRating(res.data.value))
      .catch(() => setMyRating(null));
  }, [id, user]);

  async function handleRate(value) {
    setSubmitting(true);
    try {
      const res = await api.put(`/movies/${id}/rating`, { value });
      setMyRating(res.data.value);
      setMovie((prev) => ({
        ...prev,
        averageRating: res.data.averageRating,
        ratingCount: res.data.ratingCount,
      }));
    } finally {
      setSubmitting(false);
    }
  }

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

          <div className="mt-3 flex items-center gap-2">
            <StarRating value={movie.averageRating ?? 0} />
            {movie.averageRating != null ? (
              <span className="text-sm text-muted-foreground">
                {movie.averageRating.toFixed(1)} ({movie.ratingCount}{" "}
                {movie.ratingCount === 1 ? "rating" : "ratings"})
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">No ratings yet</span>
            )}
          </div>

          <p className="mt-4 whitespace-pre-wrap">{movie.description}</p>

          {user && (
            <div className="mt-6">
              <p className="mb-1 text-sm font-medium">Your rating</p>
              <StarRating
                value={myRating ?? 0}
                interactive={!submitting}
                onRate={handleRate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
