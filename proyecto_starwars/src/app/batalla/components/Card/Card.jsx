import React from 'react';
import styles from './Card.module.scss';

export default function Card({
  peso,
  altura, 
  name, 
  image, 
  data = {},
  selected = false, 
  onClick
}) {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <h4 className={styles.altura}>{altura} cm</h4>
        <h4 className={styles.peso}>{peso} kg</h4>
        <div className={styles.fields}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className={styles.field}>
              <span className={styles.fieldKey}>{key}:</span>{' '}
              <span className={styles.fieldValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
