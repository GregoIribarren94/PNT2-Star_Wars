"use client";
import { useTrivia } from "../triviaContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AddTriviaPage() {
  const { addQuestion } = useTrivia();
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState({
    text: "",
    options: [],
    correctAnswer: "",
  });

  useEffect(() => {
    async function loadChars() {
      const res = await fetch("https://www.swapi.tech/api/people");
      const data = await res.json();
      setCharacters(data.results.slice(0, 6).map(c => c.name));
    }
    loadChars();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addQuestion(form);
    router.push("/trivia");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 20%, #0b0b0b 0%, #000 100%)",
        color: "#ffe81f",
        fontFamily: "'Orbitron', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: 30,
          boxShadow: "0 0 15px rgba(255, 232, 31, 0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 30,
            textShadow: "0 0 10px #ffe81f",
          }}
        >
          ➕ Nueva pregunta
        </h1>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 10, color: "#fff" }}>
            Texto de la pregunta:
          </label>
          <input
            placeholder="Ej: ¿Quién es el maestro de Luke Skywalker?"
            value={form.text}
            onChange={e => setForm({ ...form, text: e.target.value })}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ffe81f",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              marginBottom: 20,
            }}
          />

          <p>Elegí opciones (máx 4):</p>
          <div>
            {characters.map(name => (
              <label key={name} style={{ display: "block", margin: "5px 0" }}>
                <input
                  type="checkbox"
                  value={name}
                  checked={form.options.includes(name)}
                  onChange={(e) => {
                    const opts = e.target.checked
                      ? [...form.options, name]
                      : form.options.filter(o => o !== name);
                    setForm({ ...form, options: opts });
                  }}
                />
                {" "}{name}
              </label>
            ))}
          </div>

          <p>Respuesta correcta:</p>
          <select
            value={form.correctAnswer}
            onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ffe81f",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              marginBottom: 30,
            }}
          >
            <option value="">Seleccionar...</option>
            {form.options.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #ffe81f, #ffd700)",
                border: "none",
                color: "#000",
                padding: "12px 28px",
                borderRadius: 8,
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 10px #ffe81f",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              💾 Guardar pregunta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
