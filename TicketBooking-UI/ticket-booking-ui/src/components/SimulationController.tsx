'use client';
import type { SimulationConfig } from '@/types';
import styles from './SimulationController.module.css';

interface SimulationControllerProps {
  config: Omit<SimulationConfig, 'eventId' | 'eventTitle' | 'initialAvailableSeats'>;
  onChange: (key: keyof Omit<SimulationConfig, 'eventId' | 'eventTitle' | 'initialAvailableSeats'>, value: number) => void;
  running: boolean;
  canStart: boolean;
  onStart: () => void;
  onStop: () => void; // Kept for prop compatibility but not used
  onReset: () => void;
}

export default function SimulationController({
  config,
  onChange,
  running,
  canStart,
  onStart,
  onReset,
}: SimulationControllerProps) {
  return (
    <div className={`card ${styles.card}`}>
      {/* ── Title row ──────────────── */}
      <div className={styles.titleRow}>
        <span className={styles.title}>
          <span className={styles.icon}>⚡</span> Burst Simulator
        </span>
        {running && (
          <span className={styles.runningBadge}>
            <span className={styles.runningDot} /> RUNNING
          </span>
        )}
      </div>

      <div className={styles.grid}>
        {/* ── Threads ───────────────────── */}
        <div className={styles.controlItem}>
          <div className={styles.controlLabel}>
            Concurrent Requests
            <span className={styles.controlVal}>{config.threadCount}</span>
          </div>
          <input
            type="range" min={10} max={50} step={10}
            value={config.threadCount}
            onChange={(e) => onChange('threadCount', +e.target.value)}
            disabled={running}
            className={styles.slider}
          />
        </div>

        {/* ── Seats stepper ─────────────── */}
        <div className={styles.seatsControl}>
          <span className={styles.seatsLabel}>Seats / Request</span>
          <div className={styles.stepper}>
            <button
              className={styles.stepBtn}
              onClick={() => onChange('seatsPerBooking', Math.max(1, config.seatsPerBooking - 1))}
              disabled={running || config.seatsPerBooking <= 1}
            >−</button>
            <span className={styles.stepVal}>{config.seatsPerBooking}</span>
            <button
              className={styles.stepBtn}
              onClick={() => onChange('seatsPerBooking', Math.min(4, config.seatsPerBooking + 1))}
              disabled={running || config.seatsPerBooking >= 4}
            >+</button>
          </div>
        </div>
      </div>

      {/* ── Action buttons ────────────── */}
      <div className={styles.actions}>
        <button
          id="startSimulation"
          className={`btn btn-success ${styles.actionBtn}`}
          onClick={onStart}
          disabled={!canStart || running}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          {running ? 'Firing...' : 'Fire Requests'}
        </button>

        <button
          id="resetSimulation"
          className={`btn btn-ghost ${styles.resetBtn}`}
          onClick={onReset}
          disabled={running}
        >Clear Logs</button>
      </div>

      {!canStart && !running && (
        <span className={styles.hint}>← Select an event to enable</span>
      )}
    </div>
  );
}
