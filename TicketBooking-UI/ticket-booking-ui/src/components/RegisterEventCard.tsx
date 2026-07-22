'use client';
import { useState } from 'react';
import type { EventRegistrationRequest } from '@/types';
import { registerEvent } from '@/lib/api';
import styles from './RegisterEventCard.module.css';

interface RegisterEventCardProps {
  onSuccess: () => void;
}

const defaultForm: EventRegistrationRequest = {
  eventTitle: '',
  eventDescription: '',
  eventDatetime: '',
  eventVenue: '',
  totalSeats: 100,
  amountPerTicket: 500,
};

export default function RegisterEventCard({ onSuccess }: RegisterEventCardProps) {
  const [form, setForm] = useState<EventRegistrationRequest>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: keyof EventRegistrationRequest, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const isoDatetime = new Date(form.eventDatetime).toISOString().replace('Z', '');
      await registerEvent({ ...form, eventDatetime: isoDatetime });
      setForm(defaultForm);
      setSuccess(true);
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <span className={styles.icon}>📝</span>
        <h2 className={styles.title}>Register Event</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="eventTitle">Event Title</label>
          <input
            id="eventTitle"
            type="text"
            placeholder="e.g. Summer Festival"
            value={form.eventTitle}
            onChange={(e) => set('eventTitle', e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="eventDescription">Description</label>
          <input
            id="eventDescription"
            type="text"
            placeholder="Brief description…"
            value={form.eventDescription}
            onChange={(e) => set('eventDescription', e.target.value)}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="eventDatetime">Date & Time</label>
            <input
              id="eventDatetime"
              type="datetime-local"
              value={form.eventDatetime}
              onChange={(e) => set('eventDatetime', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="eventVenue">Venue</label>
            <input
              id="eventVenue"
              type="text"
              placeholder="e.g. Mumbai Arena"
              value={form.eventVenue}
              onChange={(e) => set('eventVenue', e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="totalSeats">Total Seats</label>
            <input
              id="totalSeats"
              type="number"
              min={1}
              value={form.totalSeats}
              onChange={(e) => set('totalSeats', parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="amountPerTicket">Price (₹)</label>
            <input
              id="amountPerTicket"
              type="number"
              min={0}
              step={0.01}
              value={form.amountPerTicket}
              onChange={(e) => set('amountPerTicket', parseFloat(e.target.value) || 0)}
              required
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Event registered successfully!</div>}

        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
          {loading ? 'Registering...' : 'Register Event'}
        </button>
      </form>
    </div>
  );
}
