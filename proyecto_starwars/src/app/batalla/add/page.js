"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthProvider.jsx'; 

import Card from '../components/Card/Card'; 
import PlaceholderCardsSection from '../components/PlaceholderCardsSection/PlaceholderCardsSection'; 

const API_TEAM_URL = 'https://691a9b0d2d8d7855756f63ee.mockapi.io/team';
const API_CHARACTERS_URL = 'https://swapi.dev/api/people/'; 
 
export default function AddTeamPage() {
  const router = useRouter();
  
  const { user, isAuthenticated, loading: authLoading } = useAuth(); 
  
  const [personajes, setPersonajes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated && !user) {
        router.push('/login');
        return;
    }
    
    if (isAuthenticated && user?.email) {
        fetchCharacters();
    }
  }, [isAuthenticated, user, authLoading, router]);

  async function fetchCharacters() {
    setLoading(true);
    try {
      const response = await fetch(API_CHARACTERS_URL, { cache: 'force-cache' });
      const data = await response.json();
      setPersonajes(data.results || data); 
    } catch (error) {
      console.error('Error al cargar personajes:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleClick = (id) => {
    const idString = String(id);
    setSelectedIds(prev => {
      if (prev.includes(idString)) {
        return prev.filter(selectedId => selectedId !== idString);
      }
      if (prev.length >= 3) {
        alert('Máximo 3 miembros por equipo.');
        return prev;
      }
      return [...prev, idString];
    });
  };

  const handleCreate = async () => {
    if (!teamName.trim() || selectedIds.length === 0) {
        alert('Ingresa un nombre y selecciona al menos un miembro.');
        return;
    }
    if (!user?.email) {
        alert('Error: Usuario no autenticado. Redirigiendo.');
        router.push('/login');
        return;
    }
    
    setIsSaving(true);
    try {
        const response = await fetch(API_TEAM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: user.email, 
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

  if (authLoading) { 
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#FFD700' }}>Verificando sesión...</div>;
  }
  
  if (!isAuthenticated && !user) {
    return null; 
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#4CAF50' }}>Cargando personajes...</div>;
  }

  const isButtonDisabled = isSaving || !teamName.trim() || selectedIds.length === 0;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Crear Nuevo Equipo</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <input
            type="text"
            placeholder="Nombre del Equipo"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{ 
                padding: '0.75rem', fontSize: '1.2rem', width: '100%', 
                border: '1px solid #444', borderRadius: '4px', 
                backgroundColor: '#333', color: '#E0E0E0'
            }}
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
          backgroundColor: isButtonDisabled ? '#9CA3AF' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          marginTop: '1.5rem',
          marginBottom: '2rem',
          width: '100%',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => !isButtonDisabled && (e.currentTarget.style.backgroundColor = '#45A049')}
        onMouseOut={(e) => !isButtonDisabled && (e.currentTarget.style.backgroundColor = '#4CAF50')}
      > 
        {isSaving ? 'Creando...' : `Aceptar y Crear Equipo (${selectedIds.length}/3)`}
      </button>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
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
          const idString = String(id);
          
          return (
            <Card
                peso={p.mass}
                altura={p.height}
              key={id}
              name={p.name}
              image={image}
              selected={selectedIds.includes(idString)}
              onClick={() => handleClick(id)}
            />
          );
        })}
      </div>
    </div>
  );
}