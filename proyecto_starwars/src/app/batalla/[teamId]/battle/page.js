"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthProvider.jsx'; 

const Card = ({ name, image, details, onClick, selected }) => (
    <div 
        onClick={onClick}
        style={{
            padding: '1rem',
            border: selected ? '3px solid #FFD700' : '2px solid #444',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: selected ? '#333' : '#2C2C2C',
            transition: 'border-color 0.3s',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
        }}
    >
        <img 
            src={image} 
            alt={name} 
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} 
        />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{name}</h3>
        {details && (
            <div style={{ textAlign: 'left', fontSize: '0.9rem', color: '#B0B0B0' }}>
                {details.map(([key, value]) => (
                    <p key={key} style={{ margin: '0.2rem 0' }}>
                        <span style={{ fontWeight: 'bold', color: '#E0E0E0' }}>{key}:</span> {value}
                    </p>
                ))}
            </div>
        )}
    </div>
);


const API_TEAM_URL = 'https://691a9b0d2d8d7855756f63ee.mockapi.io/team';
const API_CHARACTERS_URL = 'https://swapi.dev/api/people/'; 
const CHARACTER_IMAGE_URL = (id) => `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;


const parseValue = (value) => {
    if (!value || value.toLowerCase() === 'unknown') return 0;
    return parseFloat(String(value).replace(/,/g, ''));
};

export default function BattlePage({ params }) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth(); 
  const { teamId } = params;

  const [team, setTeam] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [userCharacter, setUserCharacter] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState('height');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lógica de Autenticación y Carga
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated && !user) {
        router.push('/login');
        return;
    }
    
    if (isAuthenticated && teamId) {
        fetchBattleData();
    }
  }, [isAuthenticated, user, authLoading, teamId, router]);

  async function fetchCharacterDetails(id) {
    const response = await fetch(`${API_CHARACTERS_URL}${id}/`);
    const data = await response.json();
    const parsedId = data.url.split('/').filter(Boolean).pop();
    
    return {
        ...data,
        id: parsedId,
        image: CHARACTER_IMAGE_URL(parsedId),
    };
  }
  
  async function fetchBattleData() {
    setLoading(true);
    try {
        // 1. Obtener detalles del equipo
        const teamRes = await fetch(`${API_TEAM_URL}/${teamId}`);
        if (!teamRes.ok) throw new Error('Team not found');
        const teamData = await teamRes.json();
        
        // 2. Obtener detalles de los miembros del equipo
        const memberPromises = teamData.members.map(id => fetchCharacterDetails(id));
        const detailedMembers = await Promise.all(memberPromises);
        setTeam({ ...teamData, members: detailedMembers });
        
        // 3. Seleccionar Oponente al azar
        await selectRandomOpponent();
        
    } catch (error) {
        console.error('Error fetching battle data:', error);
        alert('Error al cargar datos para la batalla.');
        router.push('/batalla'); 
    } finally {
        setLoading(false);
    }
  }

  async function selectRandomOpponent() {
      // 1. Obtener lista completa para elegir
      const listRes = await fetch(API_CHARACTERS_URL);
      const listData = await listRes.json();
      const count = listData.count;
      
      // 2. Elegir un número de página y un índice al azar
      const randomPage = Math.floor(Math.random() * Math.ceil(count / 10)) + 1;
      const paginatedRes = await fetch(`${API_CHARACTERS_URL}?page=${randomPage}`);
      const paginatedData = await paginatedRes.json();
      
      const opponentList = paginatedData.results;
      const randomOpponentIndex = Math.floor(Math.random() * opponentList.length);
      const randomOpponent = opponentList[randomOpponentIndex];

      // 3. Obtener detalles completos del oponente
      const opponentDetails = await fetchCharacterDetails(randomOpponent.url.split('/').filter(Boolean).pop());
      setOpponent(opponentDetails);
  }

  function startBattle() {
    if (!userCharacter || !opponent) {
      setResult('Error: Selecciona tu personaje y el oponente debe estar cargado.');
      return;
    }

    const attr = selectedAttribute === 'height' ? 'Altura' : 'Peso';
    const userValue = parseValue(userCharacter[selectedAttribute]);
    const opponentValue = parseValue(opponent[selectedAttribute]);
    
    const opponentName = opponent.name || 'Oponente Desconocido';
    const userCharacterName = userCharacter.name || 'Tu Personaje';

    let battleResult = `¡Batalla iniciada por **${attr}**!\n`;
    battleResult += `\n${userCharacterName} (${userValue}) vs ${opponentName} (${opponentValue})\n`;

    if (userValue > opponentValue) {
      battleResult += `\n🎉 ¡Victoria para ${userCharacterName}! Mayor ${attr}.`;
    } else if (opponentValue > userValue) {
      battleResult += `\n❌ ¡Derrota! ${opponentName} tiene mayor ${attr}.`;
    } else {
      battleResult += '\n🤝 ¡Empate! Los atributos son iguales.';
    }

    setResult(battleResult);
  }

  if (authLoading) { 
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#FFD700' }}>Verificando sesión...</div>;
  }
  
  if (!isAuthenticated && !user) {
    return null; 
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#4CAF50' }}>Preparando la arena...</div>;
  }

  const userCharacterDetails = userCharacter ? [
      ['Altura', userCharacter.height],
      ['Peso', userCharacter.mass],
      ['Año Nac.', userCharacter.birth_year],
      ['Género', userCharacter.gender]
  ] : null;

  const opponentDetails = opponent ? [
      ['Altura', opponent.height],
      ['Peso', opponent.mass],
      ['Año Nac.', opponent.birth_year],
      ['Género', opponent.gender]
  ] : null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Arena de Batalla: Equipo {team?.name || 'Cargando...'}
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Sección del Oponente */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#F44336' }}>
            Oponente Misterioso
          </h2>
          {opponent ? (
            <Card 
                name={opponent.name} 
                image={opponent.image}
                details={opponentDetails}
                selected={false}
            />
          ) : (
             <div style={{ color: '#9CA3AF', padding: '2rem', border: '1px solid #444', borderRadius: '8px' }}>Cargando oponente...</div>
          )}
        </div>
        
        {/* Sección de Batalla y Resultados */}
        <div style={{ flex: 1, backgroundColor: '#2C2C2C', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2196F3' }}>
                Reglas de Batalla
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Comparar por:</label>
                <select
                    value={selectedAttribute}
                    onChange={(e) => { setSelectedAttribute(e.target.value); setResult(null); }}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#E0E0E0' }}
                >
                    <option value="height">Altura</option>
                    <option value="mass">Peso</option>
                </select>
            </div>

            <button 
                onClick={startBattle}
                disabled={!userCharacter || !opponent}
                style={{
                    backgroundColor: (!userCharacter || !opponent || result) ? '#9CA3AF' : '#9C27B0',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: (!userCharacter || !opponent || result) ? 'not-allowed' : 'pointer',
                    width: '100%',
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => !(!userCharacter || !opponent || result) && (e.currentTarget.style.backgroundColor = '#7B1FA2')}
                onMouseOut={(e) => !(!userCharacter || !opponent || result) && (e.currentTarget.style.backgroundColor = '#9C27B0')}
            >
                {result ? '¡Batalla Terminada!' : '💥 Luchar Ahora'}
            </button>

            {result && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#1A1A1A', border: '1px solid #4CAF50', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#4CAF50' }}>RESULTADO:</h3>
                    <p style={{ margin: 0 }}>{result}</p>
                </div>
            )}
            
            <button 
                onClick={() => router.push('/batalla')}
                style={{
                    backgroundColor: '#4B5563',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '1rem',
                    marginTop: '1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
            >
                Volver a Equipos
            </button>
        </div>
      </div>
      
      {/* Sección de Selección de Equipo */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
        Selecciona tu Luchador ({team?.name})
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {team?.members?.map((member) => (
          <Card
            key={member.id}
            name={member.name}
            image={member.image}
            details={[
                ['Altura', member.height],
                ['Peso', member.mass],
                ['Año Nac.', member.birth_year],
            ]}
            selected={userCharacter?.id === member.id}
            onClick={() => { setUserCharacter(member); setResult(null); }}
          />
        ))}
      </div>
    </div>
  );
}