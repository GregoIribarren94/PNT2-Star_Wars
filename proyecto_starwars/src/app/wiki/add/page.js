"use client"
import { useWiki } from "../wikiContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddPage() {
  const { addCharacter } = useWiki();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", species: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCharacter(form);
    router.push("/wiki");
  };

  return (
    <form onSubmit={handleSubmit} style={{ color: "white", padding: 20 }}>
      <h1>Agregar Personaje</h1>
      <input placeholder="Nombre"
             value={form.name}
             onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Especie"
             value={form.species}
             onChange={e => setForm({ ...form, species: e.target.value })} />

      <button type="submit">Guardar</button>
    </form>
  );
}
