"use client";
import { useTrivia } from "../../triviaContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditTriviaPage() {
  const router = useRouter();
  const { id } = useParams();
  const { questions, updateQuestion } = useTrivia();
  const q = questions.find((q) => q.id == id);

  const [form, setForm] = useState(
    q || { text: "", options: [], correctAnswer: "" }
  );

  useEffect(() => {
    if (!q) router.push("/trivia");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateQuestion(q.id, form);
    router.push("/trivia");
  };

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
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: 30,
          textShadow: "0 0 15px #ffe81f",
        }}
      >
        ✏️ Editar pregunta
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 0 15px rgba(255, 232, 31, 0.2)",
        }}
      >
        {/* TEXT */}
        <label style={{ display: "block", marginBottom: 10, color: "#ffe81f" }}>
          Texto de la pregunta:
        </label>
        <input
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ffe81f",
            background: "#111",
            color: "#ffe81f",
            marginBottom: 20,
          }}
        />

        {/* OPTIONS */}
        <label style={{ display: "block", marginBottom: 10, color: "#ffe81f" }}>
          Opciones (separadas por coma):
        </label>
        <textarea
          value={form.options.join(", ")}
          onChange={(e) =>
            setForm({ ...form, options: e.target.value.split(",") })
          }
          rows={3}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ffe81f",
            background: "#111",
            color: "#ffe81f",
            marginBottom: 20,
          }}
        />

        {/* CORRECT ANSWER */}
        <label style={{ display: "block", marginBottom: 10, color: "#ffe81f" }}>
          Respuesta correcta:
        </label>
        <input
          value={form.correctAnswer}
          onChange={(e) =>
            setForm({ ...form, correctAnswer: e.target.value })
          }
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ffe81f",
            background: "#111",
            color: "#ffe81f",
            marginBottom: 30,
          }}
        />

        {/* BUTTON */}
        <button
          style={{
            width: "100%",
            padding: "12px 20px",
            background: "linear-gradient(90deg, #ffe81f, #ffd700)",
            border: "none",
            borderRadius: 8,
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 10px #ffe81f",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          💾 Guardar cambios
        </button>
      </form>
    </div>
  );
}
