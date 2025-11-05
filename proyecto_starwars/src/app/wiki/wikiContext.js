"use client"
import { createContext, useContext, useEffect, useState } from "react";

const WikiContext = createContext();

export function WikiProvider({ children }) {
  const [customCharacters, setCustomCharacters] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wikiData")) || [];
    setCustomCharacters(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("wikiData", JSON.stringify(customCharacters));
  }, [customCharacters]);

  const addCharacter = (character) => {
    setCustomCharacters([...customCharacters, { id: Date.now(), ...character }]);
  };

  const updateCharacter = (id, updated) => {
    setCustomCharacters(customCharacters.map(c => c.id === id ? {...c, ...updated} : c));
  };

  const deleteCharacter = (id) => {
    setCustomCharacters(customCharacters.filter(c => c.id !== id));
  };

  return (
    <WikiContext.Provider value={{ customCharacters, addCharacter, updateCharacter, deleteCharacter }}>
      {children}
    </WikiContext.Provider>
  );
}

export const useWiki = () => useContext(WikiContext);
