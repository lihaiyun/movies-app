import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { MovieForm } from "@/components/MovieForm";

export function MovieFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(isEditing ? null : undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/movies/${id}`)
      .then((res) =>
        setDefaultValues({
          title: res.data.title,
          description: res.data.description,
          genre: res.data.genre,
          releaseDate: res.data.releaseDate,
          posterUrl: res.data.posterUrl ?? "",
        })
      )
      .catch(() => setError("Movie not found"));
  }, [id, isEditing]);

  async function handleSubmit(values) {
    setError(null);
    const payload = { ...values, posterUrl: values.posterUrl || undefined };
    try {
      if (isEditing) {
        await api.put(`/movies/${id}`, payload);
      } else {
        await api.post("/movies", payload);
      }
      navigate("/admin/movies");
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to save movie");
    }
  }

  if (isEditing && !defaultValues && !error) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">
        {isEditing ? "Edit Movie" : "New Movie"}
      </h1>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <MovieForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? "Save changes" : "Create movie"}
      />
    </div>
  );
}
