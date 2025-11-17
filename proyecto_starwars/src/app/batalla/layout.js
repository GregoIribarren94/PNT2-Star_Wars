import React from 'react';

export const metadata = {
  title: "Batalla",
};

export default function BattleLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1A', color: '#E0E0E0' }}>
      <header style={{ backgroundColor: '#2C2C2C', padding: '1rem', borderBottom: '1px solid #444' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🛡️ Gestión de Batalla</h1>
      </header>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        {children} 
      </main>
    </div>
  );
}