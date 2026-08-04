import { MovieList } from "@/components/MovieList";

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Browse Movies</h1>
      <MovieList />
    </div>
  );
}
