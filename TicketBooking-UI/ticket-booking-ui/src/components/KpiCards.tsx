'use client';
import styles from './KpiCards.module.css';

export interface DashboardMetrics {
  rps: number;
  peakLatency: number;
  successCount: number;
  failCount: number;
  totalRequests: number;
}

interface KpiCardsProps {
  metrics: DashboardMetrics | null;
}

export default function KpiCards({ metrics }: KpiCardsProps) {
  if (!metrics) return null;

  const successRate = metrics.totalRequests > 0 
    ? Math.round((metrics.successCount / metrics.totalRequests) * 100) 
    : 0;

  return (
    <div className={styles.grid}>
      {/* Throughput */}
      <div className={`${styles.card} ${styles.purple}`}>
        <div className={styles.glow} />
        <span className={styles.cardIcon}>🚀</span>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Throughput</span>
          <span className={styles.cardValue}>
            {metrics.rps.toFixed(1)} <span className={styles.cardSub}>req/s</span>
          </span>
        </div>
      </div>
      
      {/* Success Rate */}
      <div className={`${styles.card} ${successRate === 100 ? styles.green : styles.red}`}>
        <div className={styles.glow} />
        <span className={styles.cardIcon}>{successRate === 100 ? '✅' : '⚠️'}</span>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Success Rate</span>
          <span className={styles.cardValue}>{successRate}%</span>
        </div>
      </div>
      
      {/* Peak Latency */}
      <div className={`${styles.card} ${styles.blue}`}>
        <div className={styles.glow} />
        <span className={styles.cardIcon}>⏱️</span>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Peak Latency</span>
          <span className={styles.cardValue}>
            {(metrics.peakLatency / 1000).toFixed(2)} <span className={styles.cardSub}>s</span>
          </span>
        </div>
      </div>

      {/* Requests */}
      <div className={`${styles.card} ${styles.green}`}>
        <div className={styles.glow} />
        <span className={styles.cardIcon}>📊</span>
        <div className={styles.cardBody}>
          <span className={styles.cardLabel}>Requests</span>
          <span className={styles.cardValue}>
            {metrics.totalRequests}
          </span>
        </div>
      </div>
    </div>
  );
}
