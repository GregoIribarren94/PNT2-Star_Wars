"use client"
import { useWiki } from "../../wikiContext";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { customCharacters, updateCharacter } = useWiki();
  const character = customCharacters.find(c => c.id == id);
  const [form, setForm] = useState(character || {});

  useEffect(() => {
    if (!character) router.push("/wiki");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCharacter(character.id, form);
    router.push("/wiki");
  };

  return (
    <form onSubmit={handleSubmit} style={{ color: "white", padding: 20 }}>
      <h1>Editar Personaje</h1>

      <input value={form.name}
             onChange={e => setForm({ ...form, name: e.target.value })} />

      <input value={form.species}
             onChange={e => setForm({ ...form, species: e.target.value })} />

      <button>Guardar</button>
    </form>
  );
}
