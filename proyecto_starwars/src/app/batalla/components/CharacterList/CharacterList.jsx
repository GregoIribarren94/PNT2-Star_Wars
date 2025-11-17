"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../Card/Card';
import PlaceholderCardsSection from '../PlaceholderCardsSection/PlaceholderCardsSection';

const API_TEAM_URL = 'https://691a9b0d2d8d7855756f63ee.mockapi.io/team';
const { user, isAuthenticated, loading: authLoading } = useAuth(); 

const getCurrentUserEmail = () => user.email ? user.email : ''; 

export default function CharacterList() {
  const router = useRouter();
  const userEmail = getCurrentUserEmail();
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [teamName, setTeamName] = useState(''); // Estado para el nombre
  const [isSaving, setIsSaving] = useState(false); // Estado de guardado
  const [personajes, setPersonajes] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchCharacters();
  }, []);

  async function fetchCharacters() {
    try {
      const response = await fetch("https://swapi.info/api/people", { cache: 'force-cache' });
      const data = await response.json();
      setPersonajes(data);
    } catch (error) {
      console.error('Error al cargar personajes:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const handleClick = (id) => { 
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      }
      return [...prev, id];
    });
  };

const handleCreate = async () => {
    if (!teamName.trim() || selectedIds.length <3) {
        alert('Ingresa un nombre y selecciona 3 miembros del equipo.');
        return;
    }
    
    setIsSaving(true);
    try {
        const response = await fetch(API_TEAM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: userEmail,
                name: teamName.trim(),
                members: selectedIds 
            })
        });

        if (!response.ok) throw new Error('Error al crear el equipo');

        alert(`Equipo "${teamName.trim()}" creado con éxito.`);
        router.push('/batalla'); 

    } catch (error) {
        console.error('Error al crear equipo:', error);
        alert('Error al crear el equipo.');
    } finally {
        setIsSaving(false);
    }
  };
  
if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando personajes...</div>;
  }
  
  const isButtonDisabled = isSaving || !teamName.trim() || selectedIds.length === 0;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: '#333' }}>Crear Nuevo Equipo</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <input
            type="text"
            placeholder="Nombre del Equipo"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{ padding: '0.75rem', fontSize: '1.2rem', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <PlaceholderCardsSection 
        selectedIds={selectedIds}
        personajes={personajes}
        onCardClick={handleClick}
      />
      
      <button 
        onClick={handleCreate}
        disabled={isButtonDisabled}
        style={{
          padding: '10px 20px',
          fontSize: '1.2rem',
          backgroundColor: isButtonDisabled ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          marginTop: '1.5rem',
          marginBottom: '2rem',
          width: '100%'
        }}
      > 
        {isSaving ? 'Creando...' : `Aceptar y Crear Equipo (${selectedIds.length}/3)`}
      </button>
      
      <h2 style={{ marginBottom: '1rem', color: '#333' }}>
        Selecciona tus personajes
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        {personajes.map((p) => {
          const id = p.url.split('/').filter(Boolean).pop();
          const image = `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;
          
          return (
            <Card
              peso={p.mass}
              altura={p.height}
              key={id}
              name={p.name}
              image={image}
              selected={selectedIds.includes(id)}
              onClick={() => handleClick(id)}
            />
          );
        })}
      </div>
    </div>
  );
}