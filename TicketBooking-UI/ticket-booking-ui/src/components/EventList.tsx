'use client';
import type { ListEventDTO, EventDTO } from '@/types';
import styles from './EventList.module.css';

interface EventListProps {
  events: ListEventDTO[];
  activeEvent: EventDTO | null;
  loadingId: number | null;
  onEventClick: (eventId: number) => void;
  onDeselect: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function EventList({
  events,
  activeEvent,
  loadingId,
  onEventClick,
  onDeselect,
  onRefresh,
  refreshing,
}: EventListProps) {
  return (
    <div className={`card ${styles.panel}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>🎟</span>
          <h2 className={styles.title}>Active Events</h2>
          <span className={styles.count}>{events.length}</span>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh list"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Refresh
        </button>
      </div>

      {/* List */}
      <div className={styles.list}>
        {refreshing && events.length === 0 ? (
          <div className={styles.skeleton}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>No active events found.</p>
            <p className={styles.emptyHint}>Start the Spring Boot backend and register an event.</p>
          </div>
        ) : (
          events.map((ev) => {
            const isActive = activeEvent?.eventId === ev.eventId;
            const isLoading = loadingId === ev.eventId;
            const isFull = ev.leftSeats === 0;

            return (
              <button
                key={ev.eventId}
                className={`${styles.card} ${isActive ? styles.activeCard : ''} ${isFull ? styles.fullCard : ''}`}
                onClick={() => {
                  if (isActive) { onDeselect(); return; }
                  if (!isFull) onEventClick(ev.eventId);
                }}
                disabled={isLoading}
                title={isFull ? 'Event is full' : isActive ? 'Click to deselect' : `Select: ${ev.eventTitle}`}
              >
                {/* Active indicator line */}
                {isActive && <span className={styles.activeLine} />}

                <div className={styles.cardMain}>
                  <div className={styles.cardTop}>
                    <span className={styles.eventId}>#{ev.eventId}</span>
                    <span className={styles.eventTitle}>{ev.eventTitle}</span>
                  </div>

                  <div className={styles.cardBottom}>
                    <span className={`${styles.seatsBadge} ${isFull ? styles.badgeFull : ev.leftSeats < 10 ? styles.badgeLow : styles.badgeOk}`}>
                      {isFull ? '🔴 Full' : `🟢 ${ev.leftSeats} seats left`}
                    </span>

                    {isLoading && (
                      <span className={styles.loadingDot}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.7s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                      </span>
                    )}

                    {isActive && !isLoading && (
                      <span className={styles.activeBadge}>● SELECTED</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Active event detail */}
      {activeEvent && (
        <div className={styles.detail}>
          <div className={styles.detailTitle}>{activeEvent.eventTitle}</div>
          <div className={styles.detailDesc}>{activeEvent.eventDescription}</div>
          <div className={styles.detailMeta}>
            <span>📍 {activeEvent.eventVenue}</span>
            <span>🗓 {new Date(activeEvent.eventDateTime).toLocaleString()}</span>
            <span>💺 {activeEvent.leftSeats}/{activeEvent.totalSeats} seats</span>
            <span>💰 ₹{activeEvent.amountPerTicket}/seat</span>
          </div>
          <div className={styles.detailBar}>
            <div
              className={styles.detailBarFill}
              style={{ width: `${((activeEvent.totalSeats - activeEvent.leftSeats) / activeEvent.totalSeats) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
