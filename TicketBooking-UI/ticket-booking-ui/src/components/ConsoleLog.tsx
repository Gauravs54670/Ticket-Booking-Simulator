'use client';
import { useEffect, useRef } from 'react';
import type { LogEntry } from '@/types';
import styles from './ConsoleLog.module.css';

interface ConsoleLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

const levelColor: Record<LogEntry['level'], string> = {
  info:    'var(--text-muted)',
  success: 'var(--green)',
  error:   'var(--red)',
  warn:    'var(--yellow)',
  overbooked: '#ff3b30',
};

const levelPrefix: Record<LogEntry['level'], string> = {
  info:    '›',
  success: '✔',
  error:   '✖',
  warn:    '⚠',
  overbooked: '💥',
};

export default function ConsoleLog({ logs, onClear }: ConsoleLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs come in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className={`card ${styles.wrap}`}>
      <div className={styles.consoleHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.trafficLights}>
            <span className={styles.tlRed} />
            <span className={styles.tlYellow} />
            <span className={styles.tlGreen} />
          </div>
          <h2 className={styles.title}>Console Output</h2>
          <span className={styles.logCount}>{logs.length} lines</span>
        </div>
        <button className={`btn btn-ghost ${styles.clearBtn}`} onClick={onClear}>
          Clear
        </button>
      </div>

      <div className={styles.terminal} id="consoleOutput">
        {logs.length === 0 ? (
          <div className={styles.emptyTerminal}>
            <span className={styles.cursor}>█</span>
            <span className={styles.emptyMsg}> Waiting for simulation to start…</span>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={styles.logLine}>
              <span className={styles.timestamp}>{log.timestamp}</span>
              <span className={styles.threadTag}>[{log.threadName}]</span>
              <span
                className={styles.prefix}
                style={{ color: levelColor[log.level] }}
              >
                {levelPrefix[log.level]}
              </span>
              <span
                className={styles.message}
                style={{ color: levelColor[log.level] }}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
