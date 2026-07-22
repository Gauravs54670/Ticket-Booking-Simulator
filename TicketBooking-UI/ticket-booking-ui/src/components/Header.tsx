'use client';
import styles from './Header.module.css';

interface HeaderProps {
  backendOnline: boolean;
}

export default function Header({ backendOnline }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#grad)" />
              <path d="M7 10h14M7 14h10M7 18h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="21" cy="18" r="3" fill="#22c55e"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed"/>
                  <stop offset="1" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Ticket Booking Simulator</h1>
            <p className={styles.subtitle}>Concurrent Seat Booking Engine</p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={`${styles.statusPill} ${backendOnline ? styles.online : styles.offline}`}>
            <span className={styles.dot} />
            <span>Backend {backendOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className={styles.version}>Spring Boot ⟷ Next.js</div>
        </div>
      </div>
    </header>
  );
}
