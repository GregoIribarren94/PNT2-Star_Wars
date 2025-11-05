"use client"
import { useEffect, useState } from "react";
import { useWiki } from "./wikiContext";
import { useRouter } from "next/navigation";

export default function WikiPage() {
  const router = useRouter();
  const { customCharacters, deleteCharacter } = useWiki();
  const [apiCharacters, setApiCharacters] = useState([]);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch("https://www.swapi.tech/api/people");
        const data = await res.json();
        const results = data?.results || data?.result || [];

        const detailed = await Promise.all(
          results.slice(0, 5).map(async (char) => {
            const res = await fetch(char.url);
            const info = await res.json();
            const p = info.result.properties;

            return {
              id: char.uid,
              name: p.name,
              birth_year: p.birth_year,
              gender: p.gender,
              height: p.height,
              mass: p.mass,
              films: p.films,
              vehicles: p.vehicles,
              starships: p.starships,
              species: p.species || "Human", // fallback
            };
          })
        );

        setApiCharacters(detailed);
      } catch (err) {
        console.error(err);
        setApiCharacters([]);
      }
    }

    fetchCharacters();
  }, []);

  return (
    <div style={{ color: "white", padding: 20 }}>
      <h1>📚 Wiki Star Wars</h1>

      {/* Volver al Home */}
      <button 
        onClick={() => router.push("/")} 
        style={{
          backgroundColor: "#444",
          color: "#fff",
          padding: "8px 14px",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #888",
          cursor: "pointer"
        }}
      >
        ⬅️ Volver al Home
      </button>

      <button onClick={() => router.push("/wiki/add")}>➕ Agregar personaje</button>

      {/* Personajes oficiales */}
      <h2>Personajes oficiales</h2>
      <ul>
        {apiCharacters.map((p) => (
          <li key={p.id} style={{ marginBottom: "14px" }}>
            <strong>{p.name}</strong>  
            <br />Año de nacimiento: {p.birth_year}
            <br />Género: {p.gender}
            <br />Altura: {p.height} cm | Peso: {p.mass} kg
            <br />Especie: {p.species}
            
            <br /><br />
            <strong>Habilidades:</strong>
            <ul>
              <li>Fuerza: {p.films?.length > 4 ? "Alta" : "Normal"}</li>
              <li>Experiencia: {p.films?.length} películas</li>
              <li>Velocidad: {p.height > 180 ? "Alta" : "Media"}</li>
            </ul>

            <strong>Herramientas:</strong>
            <ul>
              {p.vehicles.length === 0 && p.starships.length === 0 && <li>Sin vehículos registrados</li>}
              {p.vehicles.map((v) => <li key={v}>Vehículo: {v}</li>)}
              {p.starships.map((s) => <li key={s}>Nave: {s}</li>)}
            </ul>

            <hr style={{ marginTop: "10px" }} />
          </li>
        ))}
      </ul>

      <h2>Personajes creados</h2>
      <ul>
        {customCharacters.map(c => (
          <li key={c.id}>
            {c.name} — {c.species}
            <button onClick={() => router.push(`/wiki/edit/${c.id}`)}>✏️</button>
            <button onClick={() => deleteCharacter(c.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
