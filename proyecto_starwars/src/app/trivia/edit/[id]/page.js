"use client";
import { useTrivia } from "../../triviaContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditTriviaPage() {
  const router = useRouter();
  const { id } = useParams();
  const { questions, updateQuestion } = useTrivia();

  const q = questions.find((q) => q.id == id);

  // 🧹 Estado del formulario
  const [form, setForm] = useState(
    q
      ? {
          ...q,
          options: q.options.map((o) => o.trim()),
        }
      : {
          text: "",
          options: [],
          correctAnswer: "",
        }
  );

  // 🧹 Estado separado SOLO para escribir en el textarea sin que se rompa
  const [textAreaValue, setTextAreaValue] = useState(
    q ? q.options.join(", ") : ""
  );

  useEffect(() => {
    if (!q) router.push("/trivia");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertimos el texto del textarea → array limpio
    const cleanOptions = textAreaValue
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    const cleanForm = {
      ...form,
      options: cleanOptions,
      correctAnswer: form.correctAnswer.trim(),
    };

    updateQuestion(q.id, cleanForm);

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
        {/* TEXTO */}
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

        {/* OPCIONES */}
        <label style={{ display: "block", marginBottom: 10, color: "#ffe81f" }}>
          Opciones (separadas por coma):
        </label>

        <textarea
          value={textAreaValue} // ← editable libremente
          onChange={(e) => {
            setTextAreaValue(e.target.value); // ← NO reconvierte mientras escribís
          }}
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

        {/* RESPUESTA CORRECTA */}
        <label style={{ display: "block", marginBottom: 10, color: "#ffe81f" }}>
          Respuesta correcta:
        </label>

        <select
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
        >
          <option value="">Seleccioná una opción</option>

          {/* opciones convertidas recién al guardar */}
          {textAreaValue
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o.length > 0)
            .map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
        </select>

        {/* BOTÓN */}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          💾 Guardar cambios
        </button>
      </form>
    </div>
  );
}
