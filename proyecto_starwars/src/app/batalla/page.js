"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Asume que esta es la ruta correcta de tu hook:
import { useAuth } from '../contexts/AuthProvider.jsx'; 

const TEAMS_API_URL = 'https://691a9b0d2d8d7855756f63ee.mockapi.io/team'; 

export default function TeamsPage() {
  const router = useRouter();
  
  const { user, authLoading, isAuthenticated, logout } = useAuth();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    if (!isAuthenticated && !user) {
        router.push('/login');
        return;
    }
    
    if (isAuthenticated && user?.email) {
        fetchTeams();
    }
    
  }, [isAuthenticated, user]); 

  async function fetchTeams() {
    const userEmail = user?.email; 
    
    if (!userEmail) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${TEAMS_API_URL}?user_email=${userEmail}`); 
      if (!response.ok && response.status != 404) throw new Error('Failed to fetch teams');
      
      const data = (response.status === 404) ? [] : await response.json();
      setTeams(data);
      
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTeam(teamId) {
    if (!confirm('¿Estás seguro de eliminar este equipo? Esta acción es irreversible.')) return;
    
    try {
      const response = await fetch(`${TEAMS_API_URL}/${teamId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete team');

      setTeams(teams.filter(t => t.id !== teamId));
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null);
      }
      alert('Equipo eliminado con éxito.');
      
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error al eliminar el equipo.');
    }
  }

  function handleBattle() {
    if (!selectedTeam) {
      alert('¡Selecciona un equipo primero para iniciar la batalla!');
      return;
    }
    console.log('Iniciar batalla con equipo:', selectedTeam);
    alert(`Iniciando batalla con el equipo: ${selectedTeam.name}`);
    router.push(`/batalla/${selectedTeam.id}/battle`);
  }

  function handleModify() {
    if (!selectedTeam) {
        alert('¡Selecciona un equipo para modificar!');
        return;
    }
    router.push(`/batalla/${selectedTeam.id}/edit`);
  }
  
  if (authLoading) { 
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#FFD700' }}>Verificando sesión...</div>;
}

if (!isAuthenticated && !user) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#FFD700' }}>Redirigiendo a Login...</div>;
}

if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#4CAF50' }}>Cargando equipos...</div>;
}

  const displayEmail = user?.email || 'Invitado';

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Gestionar tus Equipos de Batalla ({displayEmail})
      </h1>

      {/* Botones de Acción */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Botón Crear */}
        <button 
          onClick={() => router.push('/batalla/add')} 
          style={{
            backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold',
            padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45A049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          ➕ Crear Nuevo Equipo
        </button>
        
        <button 
          onClick={logout}
          style={{
            backgroundColor: '#6B7280', color: 'white', fontWeight: 'bold',
            padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6B7280'}
        >
          🔑 Cerrar Sesión
        </button>

        <button 
          onClick={() => selectedTeam && router.push(`/batalla/${selectedTeam.id}/edit`)}
          disabled={!selectedTeam}
          style={{
            backgroundColor: selectedTeam ? '#2196F3' : '#9CA3AF', color: 'white', fontWeight: 'bold',
            padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', 
            cursor: selectedTeam ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => selectedTeam && (e.currentTarget.style.backgroundColor = '#1976D2')}
          onMouseOut={(e) => selectedTeam && (e.currentTarget.style.backgroundColor = '#2196F3')}
        >
          ✏️ Modificar Equipo
        </button>
        
        <button 
          onClick={() => selectedTeam && deleteTeam(selectedTeam.id)}
          disabled={!selectedTeam}
          style={{
            backgroundColor: selectedTeam ? '#F44336' : '#9CA3AF', color: 'white', fontWeight: 'bold',
            padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', 
            cursor: selectedTeam ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => selectedTeam && (e.currentTarget.style.backgroundColor = '#D32F2F')}
          onMouseOut={(e) => selectedTeam && (e.currentTarget.style.backgroundColor = '#F44336')}
        >
          🗑️ Eliminar Equipo
        </button>

        <button 
          onClick={handleBattle} 
          disabled={!selectedTeam}
          style={{
            backgroundColor: selectedTeam ? '#9C27B0' : '#9CA3AF', color: 'white', fontWeight: 'bold',
            padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', 
            cursor: selectedTeam ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => selectedTeam && (e.currentTarget.style.backgroundColor = '#7B1FA2')}
          onMouseOut={(e) => selectedTeam && (e.currentTarget.style.backgroundColor = '#9C27B0')}
        >
          🚀 Iniciar Batalla
        </button>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
        Selecciona un Equipo ({teams.length})
      </h2>
      
      {teams.length === 0 ? (
        <p style={{ color: '#9CA3AF' }}>Aún no tienes equipos. ¡Crea uno para empezar!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              style={{
                padding: '1rem',
                border: selectedTeam?.id === team.id ? '2px solid #FFD700' : '2px solid #444',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedTeam?.id === team.id ? '#333' : '#2C2C2C',
                transition: 'border-color 0.3s, background-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = selectedTeam?.id === team.id ? '#FFD700' : '#3B82F6'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = selectedTeam?.id === team.id ? '#FFD700' : '#444'}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{team.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>ID: {team.id}</p>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Miembros: <span style={{ fontWeight: '600' }}>{team.members.length}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}