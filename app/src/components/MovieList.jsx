import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/MovieCard";

export function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      const slowTimer = setTimeout(() => setSlow(true), 4000);

      api
        .get("/movies", { params: search ? { search } : {} })
        .then((res) => setMovies(res.data.movies))
        .catch(() => setError("Failed to load movies"))
        .finally(() => {
          clearTimeout(slowTimer);
          setLoading(false);
          setSlow(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <Input
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 max-w-sm"
      />

      {loading && (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">
            {slow
              ? "Still loading… the server may be waking up from idle, this can take up to a minute."
              : "Loading movies..."}
          </p>
        </div>
      )}

      {!loading && error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-sm text-muted-foreground">No movies found.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
