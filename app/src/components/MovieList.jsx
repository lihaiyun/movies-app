import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/MovieCard";

export function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .get("/movies", { params: search ? { search } : {} })
        .then((res) => setMovies(res.data.movies))
        .catch(() => setError("Failed to load movies"))
        .finally(() => setLoading(false));
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

      {error && <p className="text-sm text-destructive">{error}</p>}
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
