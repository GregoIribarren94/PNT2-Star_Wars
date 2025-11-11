"use client";
import { useTrivia } from "../../triviaContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditTriviaPage() {
  const router = useRouter();
  const { id } = useParams();
  const { questions, updateQuestion } = useTrivia();
  const q = questions.find(q => q.id == id);
  const [form, setForm] = useState(q || { text: "", options: [], correctAnswer: "" });

  useEffect(() => {
    if (!q) router.push("/trivia");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateQuestion(q.id, form);
    router.push("/trivia");
  };

  return (
    <form onSubmit={handleSubmit} style={{ color: "white", padding: 20 }}>
      <h1>Editar pregunta</h1>
      <input
        value={form.text}
        onChange={e => setForm({ ...form, text: e.target.value })}
      />
      <textarea
        value={form.options.join(", ")}
        onChange={e => setForm({ ...form, options: e.target.value.split(",") })}
      />
      <input
        value={form.correctAnswer}
        onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
      />
      <button>Guardar</button>
    </form>
  );
}
