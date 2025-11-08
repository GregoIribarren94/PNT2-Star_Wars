"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthProvider";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // 🔹 Maneja la navegación: si no hay sesión, manda al login
  const handleProtectedNavigation = (path) => {
    if (isAuthenticated) {
      router.push(path);
    } else {
      router.push("/login");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://wallpapers.com/images/hd/star-wars-space-background-1920-x-1080-dmwx6r9suhtxj7hv.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* LOGO Y TÍTULO */}
      <h1
        style={{
          fontSize: "3rem",
          color: "#FFE81F",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          textShadow: "2px 2px 8px #000",
          marginBottom: "0.5rem",
        }}
      >
        🌌 Mundo Star Wars
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          color: "#ddd",
          maxWidth: "600px",
          marginBottom: "2rem",
          textShadow: "1px 1px 4px #000",
        }}
      >
        Explorá la galaxia, enfrentate en batallas épicas, poné a prueba tus conocimientos
        y descubrí todo sobre tus personajes favoritos del universo Star Wars.
      </p>

      {/* BOTONES DE ACCIÓN */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => handleProtectedNavigation("/batalla")}
          style={buttonStyle("#E53935")}
        >
          ⚔️ Batalla en grupo
        </button>
        <button
          onClick={() => handleProtectedNavigation("/trivia")}
          style={buttonStyle("#43A047")}
        >
          🧩 Trivia
        </button>
        <button
          onClick={() => handleProtectedNavigation("/wiki")}
          style={buttonStyle("#1E88E5")}
        >
          📚 Wiki
        </button>
      </div>

      {/* SESIÓN */}
      {!isAuthenticated ? (
        <button onClick={() => router.push("/login")} style={buttonStyle("#FFC107")}>
          🚀 Iniciar sesión
        </button>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ marginBottom: "1rem", color: "#FFE81F" }}>
            Bienvenido/a, {user?.name || user?.email} ✨
          </p>
          <button onClick={logout} style={buttonStyle("#757575")}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "4rem",
          fontSize: "0.85rem",
          color: "#ccc",
          textShadow: "1px 1px 2px #000",
        }}
      >
        <p>TP Programación con Nuevas Tecnologías II – ORT</p>
        <p>Hecho con ❤️ por Alen, Federico, Gregorio y Gina</p>
      </footer>
    </main>
  );
}

function buttonStyle(color) {
  return {
    backgroundColor: color,
    border: "none",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.2s, background-color 0.3s",
    textTransform: "uppercase",
    fontWeight: "600",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    textShadow: "1px 1px 2px #000",
  };
}
