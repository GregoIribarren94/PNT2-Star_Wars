import React from 'react';
import styles from './PlaceholderCard.module.scss';

export default function PlaceholderCard({ number }) {
  return (
    <div className={styles.placeholder}>
      <div className={styles.icon}>?</div>
      <div className={styles.text}>Slot {number}</div>
    </div>
  );
}