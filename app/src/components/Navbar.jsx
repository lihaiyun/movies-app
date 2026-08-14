import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import movieLogo from "@/assets/movie.png";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <img src={movieLogo} alt="Movies App logo" className="h-8 w-8" />
          Movies App
        </Link>

        <div className="flex items-center gap-4">
          {user?.role === "admin" && (
            <Link to="/admin/movies" className="text-sm font-medium hover:underline">
              Manage
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm font-medium hover:underline">
                {user.name}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
