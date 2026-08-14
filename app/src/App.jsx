import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AdminRoute, ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { HomePage } from "@/pages/HomePage";
import { MovieDetailPage } from "@/pages/MovieDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminMoviesPage } from "@/pages/admin/AdminMoviesPage";
import { MovieFormPage } from "@/pages/admin/MovieFormPage";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/movies" element={<AdminMoviesPage />} />
          <Route path="/admin/movies/new" element={<MovieFormPage />} />
          <Route path="/admin/movies/:id/edit" element={<MovieFormPage />} />
        </Route>
      </Routes>
      <ChatWidget />
    </AuthProvider>
  );
}

export default App;
