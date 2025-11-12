"use client";

import { useRouter } from "next/navigation";
import UsersList from "../UsersList.jsx";

export default function UsersPage() {
    const router = useRouter();

    return (
        <main
            style={{
                color: "white",
                padding: 20,
                minHeight: "100vh",
                backgroundImage:
                    "url('https://wallpapers.com/images/hd/star-wars-space-background-1920-x-1080-dmwx6r9suhtxj7hv.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                textAlign: "center",
            }}
        >
            <h1
                style={{
                    color: "#FFE81F",
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    textShadow: "2px 2px 8px #000",
                }}
            >
                Administración de usuarios
            </h1>

            {/* 🔹 Tabla de usuarios */}
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "10px",
                    padding: "1rem",
                    display: "inline-block",
                    marginBottom: "2rem",
                }}
            >
                <UsersList />
            </div>

            {/* 🔹 Botón Volver */}
            <button
                onClick={() => router.push("/")}
                style={{
                    backgroundColor: "#1E88E5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s, background-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565C0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1E88E5")}
            >
                ⬅️ Volver
            </button>
        </main>
    );
}