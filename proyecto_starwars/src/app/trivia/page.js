"use client";
import { useTrivia } from "./triviaContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuestionCard from "./questionCard";

export default function TriviaPage() {
  const router = useRouter();
  const { questions, deleteQuestion } = useTrivia();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    async function fetchChars() {
      const res = await fetch("https://www.swapi.tech/api/people");
      const data = await res.json();
      setCharacters(data.results.slice(0, 5));
    }
    fetchChars();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #0b0b0b 0%, #000000 100%)",
        color: "#ffe81f",
        fontFamily: "'Orbitron', sans-serif",
        padding: 40,
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: 40,
          textShadow: "0 0 20px #ffe81f",
        }}
      >
        🎯 Trivia Star Wars
      </h1>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <button
          onClick={() => router.push("/trivia/add")}
          style={{
            background: "linear-gradient(90deg, #ffe81f, #ffd700)",
            border: "none",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 0 10px #ffe81f",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ➕ Nueva pregunta
        </button>
      </div>

      <section
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          padding: 20,
          borderRadius: 12,
          marginBottom: 40,
          boxShadow: "0 0 10px rgba(255, 232, 31, 0.2)",
        }}
      >
        <h2 style={{ marginBottom: 16, textShadow: "0 0 10px #ffe81f" }}>
          📜 Preguntas creadas
        </h2>

        {questions.length === 0 ? (
          <p style={{ color: "#aaa" }}>No hay preguntas aún.</p>
        ) : (
          <ul>
            {questions.map((q) => (
              <li
                key={q.id}
                style={{
                  marginBottom: 20,
                  background: "rgba(255,255,255,0.07)",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <strong style={{ color: "#fff" }}>{q.text}</strong>
                <br />
                <span style={{ color: "#ccc" }}>
                  Opciones: {q.options.join(", ")}
                </span>
                <br />
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => router.push(`/trivia/edit/${q.id}`)}
                    style={{
                      background: "#ffe81f",
                      color: "#000",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      marginRight: 10,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    style={{
                      background: "red",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(255, 232, 31, 0.2)",
        }}
      >
        <h2 style={{ marginBottom: 16, textShadow: "0 0 10px #ffe81f" }}>
          👾 Jugar Trivia
        </h2>
        {questions.length === 0 ? (
          <p style={{ color: "#aaa" }}>
            Crea algunas preguntas para comenzar.
          </p>
        ) : (
          questions.map((q) => <QuestionCard key={q.id} question={q} />)
        )}
      </section>
    </div>
  );
}