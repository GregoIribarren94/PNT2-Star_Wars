"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthProvider.jsx'; 
import Card from '../../components/Card/Card'; 

const API_TEAM_URL = 'https://691a9b0d2d8d7855756f63ee.mockapi.io/team';
const API_CHARACTERS_URL = 'https://swapi.info/api/people/'; 
const CHARACTER_IMAGE_URL = (id) => `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;


const parseValue = (value) => {
    if (!value || value.toLowerCase() === 'unknown' || value === 'n/a') return 0;
    return parseFloat(String(value).replace(/,/g, ''));
};

const getAttrName = (attr) => attr === 'height' ? 'Altura' : 'Peso';


export default function BattlePage({params}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { user, isAuthenticated, loading: authLoading } = useAuth(); 
  const teamId = resolvedParams.teamId;
  const [team, setTeam] = useState(null);
  const [userTeamPool, setUserTeamPool] = useState([]); 
  const [opponentTeamPool, setOpponentTeamPool] = useState([]); 
  const [roundAttribute, setRoundAttribute] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentRoundOpponent, setCurrentRoundOpponent] = useState(null);
  const [currentRoundUserFighter, setCurrentRoundUserFighter] = useState(null); 
  const [currentRoundResult, setCurrentRoundResult] = useState(null);
  const [gameStatus, setGameStatus] = useState('lobby'); 
  const [loading, setLoading] = useState(true);

  async function fetchCharacterDetails(id) {
    const response = await fetch(`${API_CHARACTERS_URL}${id}`);
    const data = await response.json();
    const parsedId = data.url.split('/').filter(Boolean).pop();
    
    return {
        ...data,
        id: parsedId,
        image: CHARACTER_IMAGE_URL(parsedId),
    };
  }
  
  async function selectRandomOpponentTeam() {
    const possibleIds = Array.from({ length: 82 }, (_, i) => i + 1);
    let selectedIds = [];
    while (selectedIds.length < 3) {
        const randomIndex = Math.floor(Math.random() * possibleIds.length);
        const id = possibleIds[randomIndex];
        if (!selectedIds.includes(id)) {
            selectedIds.push(id);
        }
    }
    const opponentPromises = selectedIds.map(id => fetchCharacterDetails(id));
    return await Promise.all(opponentPromises);
  }

  async function fetchBattleData(teamId) {
    setLoading(true);
    try {
        const teamRes = await fetch(`${API_TEAM_URL}/${teamId}`);
        if (!teamRes.ok) throw new Error('Team not found');
        const teamData = await teamRes.json();
        
        const memberPromises = teamData.members.map(id => fetchCharacterDetails(id));
        const detailedMembers = await Promise.all(memberPromises);
        
        setTeam({ ...teamData, members: detailedMembers });

        const opponentCharacters = await selectRandomOpponentTeam();
        
        setUserTeamPool(detailedMembers);
        setOpponentTeamPool(opponentCharacters);
        setGameStatus('selection'); 

    } catch (error) {
        console.error('Error fetching battle data:', error);
        alert('Error al cargar datos para la batalla.');
        router.push('/batalla'); 
    } finally {
        setLoading(false);
    }
  }
  
  function startNewRound() {
      if (opponentTeamPool.length === 0 || userTeamPool.length === 0) {
          setGameStatus('finished');
          return;
      }
      
      const attributes = ['height', 'mass'];
      const randomAttr = attributes[Math.floor(Math.random() * attributes.length)];
      setRoundAttribute(randomAttr);
      
      const randomIndex = Math.floor(Math.random() * opponentTeamPool.length);
      const nextOpponent = opponentTeamPool[randomIndex];
      setCurrentRoundOpponent(nextOpponent);
      
      setCurrentRoundUserFighter(null);
      setCurrentRoundResult(null);
      setGameStatus('selection'); 
  }

  function handleUserCharacterSelect(userCharacter) {
    if (gameStatus !== 'selection' || !currentRoundOpponent || !roundAttribute) return;

    setCurrentRoundUserFighter(userCharacter); 
    setGameStatus('fighting'); 

    const opponentCharacter = currentRoundOpponent;
    const attr = roundAttribute;

    const userValue = parseValue(userCharacter[attr]);
    const opponentValue = parseValue(opponentCharacter[attr]);
    
    let winner = 'tie';
    if (userValue > opponentValue) {
        winner = 'user';
    } else if (opponentValue > userValue) {
        winner = 'opponent';
    }
    
    let battleResult = `¡Ronda finalizada! Atributo: **${getAttrName(attr)}**\n`;
    battleResult += `${userCharacter.name} (${userValue}) vs ${opponentCharacter.name} (${opponentValue})\n`;
    
    if (winner === 'user') {
        setUserScore(s => s + 1);
        battleResult += '🎉 ¡Ganaste la ronda!';
    } else if (winner === 'opponent') {
        setOpponentScore(s => s + 1);
        battleResult += '❌ ¡Perdiste la ronda!';
    } else {
        battleResult += '🤝 ¡Empate!';
    }
    setCurrentRoundResult(battleResult);

    const newOpponentPool = opponentTeamPool.filter(c => c.id !== opponentCharacter.id);
    const newUserPool = userTeamPool.filter(c => c.id !== userCharacter.id);
    
    setUserTeamPool(newUserPool);
    setOpponentTeamPool(newOpponentPool);
    
    if (newUserPool.length === 0 || newOpponentPool.length === 0) { 
        setGameStatus('finished');
    } else {
        setTimeout(() => {
            startNewRound();
        }, 3000); 
    }
  }
  useEffect(() => {

    if (authLoading) return;

    if (!isAuthenticated && !user) {
        router.push('/login');
        return;
    }
    
    if (isAuthenticated && teamId && gameStatus === 'lobby') {
        fetchBattleData(teamId);
    }

    if (gameStatus === 'selection' && userTeamPool.length > 0 && opponentTeamPool.length > 0 && !currentRoundOpponent) {
        startNewRound();
    }
    
  }, [isAuthenticated, user, authLoading, router, gameStatus, userTeamPool, opponentTeamPool]);

  if (authLoading) { 
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#FFD700' }}>Verificando sesión...</div>;
  }
  
  if (!isAuthenticated && !user) {
    return null; 
  }

  if (loading || gameStatus === 'lobby') {
    return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.25rem', color: '#4CAF50' }}>Preparando la arena...</div>;
  }
  
  const roundsLeft = userTeamPool.length;
  let battleMessage = '';

  if (gameStatus === 'selection' || gameStatus === 'fighting') {
      battleMessage = `¡Tu turno! El atributo a competir es: **${getAttrName(roundAttribute)}**. Elige a tu personaje.`;
  } else if (gameStatus === 'finished') {
      if (userScore > opponentScore) {
          battleMessage = '🏆 ¡GANASTE LA BATALLA! 🏆';
      } else if (opponentScore > userScore) {
          battleMessage = '😥 ¡PERDISTE LA BATALLA! 😥';
      } else {
          battleMessage = '🤝 ¡EMPATE FINAL! 🤝';
      }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#E0E0E0' }}>
        Batalla de Equipos: {team?.name} vs Oponente
      </h1>
      
      <div style={{ marginBottom: '1.5rem', border: '1px solid #444', padding: '1rem', borderRadius: '8px', backgroundColor: '#333' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#FFD700' }}>
              Marcador: {userScore} - {opponentScore} (Rondas restantes: {roundsLeft})
          </h2>
          <p style={{ fontWeight: 'bold', color: gameStatus === 'finished' ? '#4CAF50' : '#2196F3', whiteSpace: 'pre-wrap' }}>
              {battleMessage}
          </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem', marginBottom: '2rem' }}>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#2196F3' }}>
                  TU LUCHADOR
              </h3>
              {currentRoundUserFighter ? (
                <Card
                    name={currentRoundUserFighter.name}
                    image={currentRoundUserFighter.image}
                    altura={currentRoundUserFighter.height}
                    peso={currentRoundUserFighter.mass}
                    data={{ 
                        'Año Nac.': currentRoundUserFighter.birth_year,
                        'Género': currentRoundUserFighter.gender
                    }}
                    selected={true}
                    onClick={null}
                />
              ) : (
                 <div style={{ color: '#9CA3AF', padding: '2rem', border: '1px solid #444', borderRadius: '8px', backgroundColor: '#2C2C2C' }}>Elige un personaje de abajo.</div>
              )}
          </div>
          
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              {currentRoundResult ? (
                  <div style={{ padding: '1rem', backgroundColor: '#1A1A1A', border: `1px solid ${userScore > opponentScore ? '#4CAF50' : '#F44336'}`, borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#E0E0E0' }}>
                      <h4 style={{ color: userScore > opponentScore ? '#4CAF50' : '#F44336', margin: 0 }}>ÚLTIMO RESULTADO:</h4>
                      <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>{currentRoundResult}</p>
                  </div>
              ) : (
                  <div style={{ color: '#9CA3AF' }}>{gameStatus === 'selection' ? `¡Ronda: ${getAttrName(roundAttribute)}!` : 'Esperando ronda...'}</div>
              )}
          </div>

          <div style={{ flex: 1, textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#F44336' }}>
                  OPONENTE (Atributo {getAttrName(roundAttribute)})
              </h3>
              {currentRoundOpponent && currentRoundResult ? (
                  <Card 
                      name={currentRoundOpponent.name} 
                      image={currentRoundOpponent.image}
                      altura={currentRoundOpponent.height}
                      peso={currentRoundOpponent.mass}
                      data={{ 
                        'Año Nac.': currentRoundOpponent.birth_year,
                        'Género': currentRoundOpponent.gender
                      }}
                      selected={false}
                      onClick={null}
                  />
              ) : (
                  <div style={{ color: '#9CA3AF', padding: '2rem', border: '1px solid #444', borderRadius: '8px', backgroundColor: '#2C2C2C' }}>
                      {gameStatus !== 'finished' ? 'Oponente Misterioso (Selecciona tu luchador para ver)' : 'Batalla Terminada'}
                  </div>
              )}
          </div>
      </div>

      {gameStatus === 'selection' && (
          <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', borderTop: '1px solid #444', paddingTop: '1rem', color: '#E0E0E0' }}>
                  Elige tu Luchador (Disponibles: {userTeamPool.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {userTeamPool.map((member) => (
                      <Card
                          key={member.id}
                          name={member.name}
                          image={member.image}
                          altura={member.height}
                          peso={member.mass}
                          data={{ 
                            'Año Nac.': member.birth_year,
                            'Género': member.gender
                          }}
                          selected={false}
                          onClick={() => handleUserCharacterSelect(member)}
                      />
                  ))}
              </div>
          </>
      )}

      {gameStatus === 'finished' && (
           <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#1A1A1A', border: '3px solid #FFD700', borderRadius: '8px', marginTop: '2rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: userScore > opponentScore ? '#4CAF50' : '#F44336' }}>
                  {battleMessage}
              </h3>
              <p style={{ fontSize: '1.5rem', color: '#E0E0E0' }}>Marcador Final: {userScore} - {opponentScore}</p>
              <button 
                  onClick={() => router.push('/batalla')}
                  style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '1rem',
                      transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                  Volver a Gestión de Equipos
              </button>
          </div>
      )}
    </div>
  );
}