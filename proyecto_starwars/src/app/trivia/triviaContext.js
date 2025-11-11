"use client";
import { createContext, useContext, useEffect, useState } from "react";

const TriviaContext = createContext();
export const useTrivia = () => useContext(TriviaContext);

export function TriviaProvider({ children }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("triviaData")) || [];
    setQuestions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("triviaData", JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (q) => setQuestions([...questions, { id: Date.now(), ...q }]);
  const updateQuestion = (id, updated) =>
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updated } : q)));
  const deleteQuestion = (id) => setQuestions(questions.filter(q => q.id !== id));

  return (
    <TriviaContext.Provider value={{ questions, addQuestion, updateQuestion, deleteQuestion }}>
      {children}
    </TriviaContext.Provider>
  );
}
