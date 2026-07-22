'use client';
import { useMemo } from 'react';
import styles from './SeatMap.module.css';

interface SeatMapProps {
  totalSeats: number;
  leftSeats: number;
  activeThreadCount: number; // number of threads actively booking right now
}

type SeatState = 'booked' | 'active' | 'available';

export default function SeatMap({ totalSeats, leftSeats, activeThreadCount }: SeatMapProps) {
  const bookedSeats = totalSeats - leftSeats;

  const seats: SeatState[] = useMemo(() => {
    const arr: SeatState[] = [];
    for (let i = 0; i < totalSeats; i++) {
      if (i < bookedSeats) {
        arr.push('booked');
      } else if (i < bookedSeats + activeThreadCount && activeThreadCount > 0) {
        arr.push('active');
      } else {
        arr.push('available');
      }
    }
    return arr;
  }, [totalSeats, bookedSeats, activeThreadCount]);

  const pct = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  // Limit displayed seats to 500 for performance
  const displaySeats = seats.slice(0, 500);
  const truncated = totalSeats > 500;

  return (
    <div className={`card ${styles.wrap}`}>
      <div className={styles.mapHeader}>
        <h2 className={styles.title}>
          <span>🗺</span> Seat Map
        </h2>
        <div className={styles.stats}>
          <span className={styles.statItem + ' ' + styles.available}>
            <span className={styles.dot} /> {leftSeats} Available
          </span>
          <span className={styles.statItem + ' ' + styles.active}>
            <span className={styles.dot} /> {Math.min(activeThreadCount, leftSeats)} Attempting
          </span>
          <span className={styles.statItem + ' ' + styles.booked}>
            <span className={styles.dot} /> {bookedSeats} Booked
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressLabel}>{pct}% sold out</span>
      </div>

      {/* Seat grid */}
      {totalSeats === 0 ? (
        <div className={styles.empty}>Select an event to view seat map</div>
      ) : (
        <>
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${totalSeats > 200 ? '10px' : totalSeats > 100 ? '14px' : '18px'}, 1fr))`,
            }}
          >
            {displaySeats.map((state, i) => (
              <div
                key={i}
                className={`${styles.seat} ${styles[state]}`}
                title={`Seat ${i + 1} — ${state}`}
              />
            ))}
          </div>
          {truncated && (
            <p className={styles.truncNote}>
              Showing first 500 of {totalSeats} seats for performance
            </p>
          )}
        </>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.availableDot}`} /> Available
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.activeDot}`} /> Booking Attempt
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.bookedDot}`} /> Booked
        </span>
      </div>
    </div>
  );
}
