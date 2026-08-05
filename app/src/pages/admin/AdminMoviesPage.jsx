import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  function loadMovies() {
    api
      .get("/movies", { params: { limit: 100 } })
      .then((res) => setMovies(res.data.movies))
      .catch(() => setError("Failed to load movies"));
  }

  useEffect(loadMovies, []);

  async function handleDelete(id) {
    if (!confirm("Delete this movie?")) return;
    await api.delete(`/movies/${id}`);
    loadMovies();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Movies</h1>
        <Button asChild>
          <Link to="/admin/movies/new">New Movie</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.genre}</TableCell>
              <TableCell>{formatDate(movie.releaseDate)}</TableCell>
              <TableCell className="space-x-2 text-right">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/movies/${movie.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
