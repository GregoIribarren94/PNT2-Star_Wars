import React from 'react';
import Card from '../Card/Card';
import PlaceholderCard from '../PlaceholderCard/PlaceholderCard';
import styles from './PlaceholderCardsSection.module.scss';

export default function PlaceholderCardsSection({ 
  selectedIds, 
  personajes, 
  onCardClick 
}) {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        Tu Equipo ({selectedIds.length}/3)
      </h2>
      <div className={styles.cardsContainer}>
        {[0, 1, 2].map(slotIndex => {
          const selectedId = selectedIds[slotIndex];
          const personaje = personajes.find(p => {
            const id = p.url.split('/').filter(Boolean).pop();
            return id === selectedId;
          });
          
        if (personaje) {
            const id = personaje.url.split('/').filter(Boolean).pop();
            const image = `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;
            
            return (
                <div key={id} style={{ width: '150px' }}>
                <Card
                altura={personaje.height}
                peso={personaje.mass}
                    name={personaje.name}
                    image={image}
                    data={personaje.data}
                    selected={false}
                    onClick={() => onCardClick(id)}
                />
                </div>
            );
        }
          
          return (
            <PlaceholderCard key={`placeholder-${slotIndex}`} number={slotIndex + 1} />
          );
        })}
      </div>
    </div>
  );
}