"use client";
import React from "react";
import { TriviaProvider } from "./triviaContext";

export default function TriviaLayout({ children }) {
  return (
    <TriviaProvider>
      <div style={{ padding: 20, color: "white" }}>
        {children}
      </div>
    </TriviaProvider>
  );
}
