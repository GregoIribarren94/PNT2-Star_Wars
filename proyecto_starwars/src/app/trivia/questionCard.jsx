import { useState } from "react";

export default function QuestionCard({ question }) {
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);

  const checkAnswer = () => setAnswered(true);
  const isCorrect = selected === question.correctAnswer;

  return (
    <div
      style={{
        border: "1px solid #ffe81f",
        padding: 15,
        borderRadius: 8,
        marginBottom: 16,
        background: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 0 8px #ffe81f33",
        transition: "all 0.3s ease",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{question.text}</h3>
      {question.options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "block",
            marginTop: 4,
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name={question.id}
            value={opt}
            checked={selected === opt}
            onChange={() => setSelected(opt)}
          />{" "}
          {opt}
        </label>
      ))}

      <button
        onClick={checkAnswer}
        disabled={!selected}
        style={{
          marginTop: 10,
          padding: "8px 14px",
          backgroundColor: selected ? "#ffe81f" : "#999",
          border: "none",
          borderRadius: 6,
          color: "#000",
          fontWeight: "bold",
          cursor: selected ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
        }}
      >
        Responder
      </button>

      {answered && (
        <p
          style={{
            marginTop: 10,
            color: isCorrect ? "#00ff88" : "#ff4c4c",
            fontWeight: "bold",
            textShadow: isCorrect
              ? "0 0 8px #00ff88"
              : "0 0 8px #ff4c4c",
          }}
        >
          {isCorrect
            ? "✅ ¡Correcto!"
            : `❌ Incorrecto, la respuesta era ${question.correctAnswer}`}
        </p>
      )}
    </div>
  );
}
