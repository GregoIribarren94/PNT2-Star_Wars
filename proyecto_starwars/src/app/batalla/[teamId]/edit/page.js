"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '../../components/Card/Card'; 
import PlaceholderCardsSection from '../../components/PlaceholderCardsSection/PlaceholderCardsSection';

const API_TEAM_URL = 'https://691a9b0d2d8d7855756f63ee.mockapi.io/team';
const API_CHARACTERS_URL = 'https://swapi.info/api/people'; 

export default function EditTeamPage() {
  const router = useRouter();
  const { teamId } = useParams(); 
  
  const [team, setTeam] = useState(null);
  const [teamName, setTeamName] = useState(''); 
  const [personajes, setPersonajes] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (teamId) {
      loadData();
    }
  }, [teamId]);

  async function loadData() {
    setLoading(true);
    try {
      const [charactersResponse, teamResponse] = await Promise.all([
        fetch(API_CHARACTERS_URL, { cache: 'force-cache' }),
        fetch(`${API_TEAM_URL}/${teamId}`)
      ]);
      
      const allCharacters = await charactersResponse.json();
      const currentTeam = await teamResponse.json();

      if (!teamResponse.ok) throw new Error("Equipo no encontrado");

      setTeam(currentTeam);
      setTeamName(currentTeam.name); 
      setPersonajes(allCharacters.results || allCharacters);
      
      const initialIds = new Set(currentTeam.members.map(String)); 
      setSelectedIds(initialIds);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar la información del equipo o personajes.');
      router.push('/batalla');
    } finally {
      setLoading(false);
    }
  }

  const handleClick = (id) => {
    setSelectedIds(prev => {
      const newIds = new Set(prev);
      const idString = String(id);
      
      if (newIds.has(idString)) {
        newIds.delete(idString);
      } else {
        if (newIds.size >= 3) {
            alert('Máximo 3 miembros por equipo.');
            return prev;
        }
        newIds.add(idString);
      }
      return newIds;
    });
  }

  const handleSave = async () => {
    if (!teamName.trim() || selectedIds.size === 0) {
        alert('El equipo debe tener un nombre y al menos un miembro.');
        return;
    }
    
    setIsSaving(true);
    try {
      const membersToSave = Array.from(selectedIds); 
      
      const response = await fetch(`${API_TEAM_URL}/${teamId}`, {
        method: 'PUT', // PUT para actualizar
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...team, 
          name: teamName.trim(), 
          members: membersToSave
        })
      });

      if (!response.ok) throw new Error('Error al actualizar el equipo');
      
      alert(`Equipo "${teamName}" actualizado con éxito.`);
      router.push('/batalla'); 

    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar los cambios del equipo.');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos del equipo...</div>;
  }
  
  const isButtonDisabled = isSaving || !teamName.trim() || selectedIds.size < 3;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#333' }}>✏️ Editar Equipo: {team?.name}</h1>
      
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
        selectedIds={Array.from(selectedIds)}
        personajes={personajes}
        onCardClick={handleClick}
      />
      
      <button 
        onClick={handleSave}
        disabled={isButtonDisabled}
        style={{
          padding: '10px 20px',
          fontSize: '1.2rem',
          backgroundColor: isButtonDisabled ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          marginTop: '1.5rem',
          marginBottom: '2rem',
          width: '100%'
        }}
      > 
        {isSaving ? 'Guardando...' : `💾 Guardar Cambios (${selectedIds.size}/3)`}
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
          // Obtiene el ID numérico de la URL
          const id = p.url.split('/').filter(Boolean).pop();
          const image = `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;
          const idString = String(id);
          
          return (
            <Card
                peso={p.mass}
                altura={p.height}
              key={id}
              name={p.name}
              image={image}
              selected={selectedIds.has(idString)}
              onClick={() => handleClick(id)}
            />
          );
        })}
      </div>
    </div>
  );
}