"use client"
import { useWiki } from "../../wikiContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { customCharacters, updateCharacter } = useWiki();
  const character = customCharacters.find((c) => c.id == id);

  const [form, setForm] = useState({
    name: character?.name || "",
    species: character?.species || "",
    birthYear: character?.birthYear || "",
    gender: character?.gender || "",
    homeworld: character?.homeworld || "",
    abilities: character?.abilities || "",
  });

  useEffect(() => {
    // Si no existe, redirige cuando termine de montar
    if (character) {
      setForm({
        name: character?.name || "",
        species: character?.species || "",
        birthYear: character?.birthYear || "",
        gender: character?.gender || "",
        homeworld: character?.homeworld || "",
        abilities: character?.abilities || "",
      });
    } else {
      router.push("/wiki");
    }
  }, [character, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCharacter(character.id, form);
    router.push("/wiki");
  };

  return (
    <div
      style={{
        color: "#fff",
        backgroundColor: "#0c0e14",
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#111827",
          padding: "30px 40px",
          borderRadius: "12px",
          border: "1px solid #1f2937",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ color: "#facc15", textAlign: "center", marginBottom: "20px" }}>
          ✏ Editar Personaje
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label>
            Nombre
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              required
              placeholder="Ej: Luke Skywalker"
              style={inputStyle}
            />
          </label>

          <label>
            Especie
            <input
              name="species"
              value={form.species || ""}
              onChange={handleChange}
              placeholder="Ej: Humano"
              style={inputStyle}
            />
          </label>

          <label>
            Año de nacimiento
            <input
              name="birthYear"
              value={form.birthYear || ""}
              onChange={handleChange}
              placeholder="Ej: 19BBY"
              style={inputStyle}
            />
          </label>

          <label>
            Género
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="n/a">No aplica</option>
              <option value="unknown">Desconocido</option>
            </select>
          </label>

          <label>
            Planeta natal
            <input
              name="homeworld"
              value={form.homeworld || ""}
              onChange={handleChange}
              placeholder="Ej: Tatooine"
              style={inputStyle}
            />
          </label>

          <label>
            Habilidades
            <textarea
              name="abilities"
              value={form.abilities || ""}
              onChange={handleChange}
              placeholder="Ej: Control de la Fuerza, pilotaje, estrategia..."
              style={{
                ...inputStyle,
                height: "100px",
                resize: "none",
              }}
            />
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/wiki")}
            style={buttonSecondary}
          >
            ⬅ Cancelar
          </button>

          <button type="submit" style={buttonPrimary}>
            💾 Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  backgroundColor: "#1f2937",
  color: "#fff",
  border: "1px solid #374151",
  borderRadius: "6px",
  padding: "8px 10px",
  fontSize: "0.95rem",
};

const buttonPrimary = {
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "500",
};

const buttonSecondary = {
  backgroundColor: "#374151",
  color: "#fff",
  border: "1px solid #4b5563",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
};