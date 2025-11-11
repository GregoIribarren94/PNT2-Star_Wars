"use client";
import { useEffect, useState } from "react";
import { useWiki } from "./wikiContext";
import { useRouter } from "next/navigation";

// ✅ Mapa para traducir género
const genderMap = {
  male: "Masculino",
  female: "Femenino",
  hermaphrodite: "Hermafrodita",
  "n/a": "No aplica",
  none: "No especifica",
  unknown: "Desconocido",
};

export default function WikiPage() {
  const router = useRouter();
  const { customCharacters, deleteCharacter } = useWiki();
  const [apiCharacters, setApiCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch("https://www.swapi.tech/api/people");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return setApiCharacters([]);
        }

        const data = await res.json();
        const results = data?.results || [];

        const detailed = await Promise.all(
          results.slice(0, 5).map(async (char) => {
            const res = await fetch(char.url);
            const info = await res.json();
            const p = info.result.properties;

            const vehicles = await Promise.all(
              p.vehicles.map(async (vUrl) => {
                try {
                  const r = await fetch(vUrl);
                  const d = await r.json();
                  return d.result?.properties?.name || "Vehículo desconocido";
                } catch {
                  return "Vehículo desconocido";
                }
              })
            );

            const starships = await Promise.all(
              p.starships.map(async (sUrl) => {
                try {
                  const r = await fetch(sUrl);
                  const d = await r.json();
                  return d.result?.properties?.name || "Nave desconocida";
                } catch {
                  return "Nave desconocida";
                }
              })
            );

            return {
              id: char.uid,
              name: p.name,
              birth_year: p.birth_year,
              gender: p.gender,
              height: p.height,
              mass: p.mass,
              films: p.films,
              vehicles,
              starships,
              species: p.species || "Human",
            };
          })
        );

        setApiCharacters(detailed);
      } catch {
        setApiCharacters([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  return (
    <div
      style={{
        color: "#fff",
        padding: "40px",
        backgroundColor: "#0c0e14",
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>📚 Wiki Star Wars</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#1f2937",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid #4b5563",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ⬅ Volver al Home
        </button>

        <button
          onClick={() => router.push("/wiki/add")}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ➕ Agregar personaje
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px", fontSize: "1.2rem" }}>
          ⏳ Cargando personajes oficiales...
        </div>
      )}

      {!loading && (
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#93c5fd", borderBottom: "1px solid #374151", paddingBottom: "8px" }}>
            Personajes oficiales
          </h2>

          <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
            {apiCharacters.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: "#111827",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #1f2937",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                <h3 style={{ margin: "0 0 10px", color: "#facc15" }}>{p.name}</h3>
                <p>
                  <strong>Año de nacimiento:</strong> {p.birth_year}<br />
                  <strong>Género:</strong> {genderMap[p.gender] || p.gender}<br />
                  <strong>Altura:</strong> {p.height} cm | <strong>Peso:</strong> {p.mass} kg<br />
                  <strong>Especie:</strong> {p.species}
                </p>

                <div style={{ marginTop: "10px" }}>
                  <strong>Habilidades:</strong>
                  <ul style={{ marginLeft: "20px", lineHeight: "1.6" }}>
                    <li>Fuerza: {p.films?.length > 4 ? "Alta" : "Normal"}</li>
                    <li>Experiencia: {p.films?.length} películas</li>
                    <li>Velocidad: {p.height > 180 ? "Alta" : "Media"}</li>
                  </ul>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <strong>Herramientas:</strong>
                  <ul style={{ marginLeft: "20px", lineHeight: "1.6" }}>
                    {p.vehicles.length === 0 && p.starships.length === 0 && (
                      <li>Sin vehículos registrados</li>
                    )}
                    {p.vehicles.map((v, i) => (
                      <li key={i}>🚗 {v}</li>
                    ))}
                    {p.starships.map((s, i) => (
                      <li key={i}>🚀 {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ color: "#93c5fd", borderBottom: "1px solid #374151", paddingBottom: "8px" }}>
          Personajes creados por ti
        </h2>

        {customCharacters.length === 0 ? (
          <p style={{ marginTop: "15px", color: "#9ca3af" }}>
            Aún no agregaste personajes personalizados.
          </p>
        ) : (
          <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
            {customCharacters.map((c) => (
              <li
                key={c.id}
                style={{
                  backgroundColor: "#111827",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "10px",
                  border: "1px solid #1f2937",
                }}
              >
                <strong>{c.name}</strong> — {c.species}
                <div style={{ fontSize: "0.9rem", marginTop: "6px", lineHeight: "1.4" }}>
                  <strong>Año:</strong> {c.birthYear || "?"} ·{" "}
                  <strong>Género:</strong> {c.gender || "?"} ·{" "}
                  <strong>Planeta:</strong> {c.homeworld || "?"}
                  <br />
                  <strong>Habilidades:</strong> {c.abilities || "No registradas"}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => router.push(`/wiki/edit/${c.id}`)}
                    style={{
                      backgroundColor: "#2563eb",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    ✏ Editar
                  </button>
                  <button
                    onClick={() => deleteCharacter(c.id)}
                    style={{
                      backgroundColor: "#dc2626",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
