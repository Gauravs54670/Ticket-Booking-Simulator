'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ListEventDTO, EventDTO, LogEntry, SimulationConfig, LockStrategy } from '@/types';
import { getAllEvents, getEvent, checkBackendHealth } from '@/lib/api';
import { SimulationEngine } from '@/lib/simulator';
import Header from '@/components/Header';
import EventList from '@/components/EventList';
import RegisterEventCard from '@/components/RegisterEventCard';
import SimulationController from '@/components/SimulationController';
import ConsoleLog from '@/components/ConsoleLog';
import SeatMap from '@/components/SeatMap';
import KpiCards, { type DashboardMetrics } from '@/components/KpiCards';
import styles from './page.module.css';

const DEFAULT_CONFIG = {
  threadCount: 10,
  seatsPerBooking: 1,
  strategy: 'NO_LOCK' as LockStrategy,
};

const MAX_LOGS = 500;

export default function HomePage() {
  // ─── Backend ──────────────────────────────────────────────────────
  const [backendOnline, setBackendOnline] = useState(false);

  // ─── Event list (lightweight) ─────────────────────────────────────
  const [events, setEvents] = useState<ListEventDTO[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Selected event (full detail) ────────────────────────────────
  const [activeEvent, setActiveEvent] = useState<EventDTO | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // ─── Simulation ───────────────────────────────────────────────────
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeThreads, setActiveThreads] = useState(0);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const engineRef = useRef<SimulationEngine | null>(null);
  const listPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Backend health check ─────────────────────────────────────────
  useEffect(() => {
    const check = async () => setBackendOnline(await checkBackendHealth());
    check();
    const t = setInterval(check, 10_000);
    return () => clearInterval(t);
  }, []);

  // ─── Load event list ──────────────────────────────────────────────
  const loadEvents = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      // backend offline — swallow silently
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    // Poll list every 15 seconds to catch new registrations
    listPollRef.current = setInterval(loadEvents, 15_000);
    return () => { if (listPollRef.current) clearInterval(listPollRef.current); };
  }, [loadEvents]);

  // ─── Click event: fetch detail; click again: deselect ──────────
  const handleEventClick = useCallback(async (eventId: number) => {
    if (loadingId === eventId) return;
    setLoadingId(eventId);
    try {
      const detail = await getEvent(eventId);
      setActiveEvent(detail);
      setMetrics(null);
      setActiveThreads(0);
      if (detail.eventType === 'CONCURRENT_EVENT') {
        setConfig((c) => ({ ...c, strategy: 'OPTIMISTIC_LOCK' }));
      } else if (detail.eventType === 'NORMAL_EVENT') {
        setConfig((c) => ({ ...c, strategy: 'NO_LOCK' }));
      }
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  }, [loadingId]);

  const handleDeselect = useCallback(() => {
    setActiveEvent(null);
    setMetrics(null);
    setActiveThreads(0);
  }, []);

  // ─── Poll active event every 2 seconds during simulation ─────────
  useEffect(() => {
    if (eventPollRef.current) clearInterval(eventPollRef.current);
    if (!activeEvent) return;

    const poll = async () => {
      try {
        const fresh = await getEvent(activeEvent.eventId);
        setActiveEvent(fresh);
        // Also update leftSeats in the lightweight list
        setEvents((prev) =>
          prev.map((e) =>
            e.eventId === fresh.eventId ? { ...e, leftSeats: fresh.leftSeats } : e
          )
        );
      } catch { /* ignore */ }
    };

    eventPollRef.current = setInterval(poll, 2_000);
    return () => { if (eventPollRef.current) clearInterval(eventPollRef.current); };
  }, [activeEvent?.eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Simulation engine ────────────────────────────────────────────
  useEffect(() => {
    const engine = new SimulationEngine(
      (entry) =>
        setLogs((prev) => {
          const next = [...prev, entry];
          return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next;
        }),
      (_result, _seatsBooked) => {},   // no KPI state needed
      () => {},
      (_threadIdx, active) => {
        setActiveThreads((prev) => Math.max(0, active ? prev + 1 : prev - 1));
      },
      (newMetrics) => setMetrics(newMetrics)
    );
    engineRef.current = engine;
    return () => engine.stop();
  }, []);

  const handleStart = useCallback(async () => {
    if (!activeEvent || !engineRef.current) return;
    const fullConfig: SimulationConfig = {
      ...config,
      eventId: activeEvent.eventId,
      eventTitle: activeEvent.eventTitle,
      initialAvailableSeats: activeEvent.leftSeats,
    };
    setRunning(true);
    setMetrics(null);
    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        threadName: 'System',
        message: `▶ Burst Simulation started — ${config.strategy === 'NO_LOCK' ? '🔓 No Lock' : config.strategy === 'REENTRANT_LOCK' ? '🔒 ReentrantLock' : '🤞 Optimistic Lock'} | ${config.threadCount} concurrent requests, ${config.seatsPerBooking} seat(s)/req`,
        level: 'info',
      },
    ]);
    
    await engineRef.current.start(fullConfig);
    
    setRunning(false);
    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        threadName: 'System',
        message: '■ Simulation completed.',
        level: 'warn',
      },
    ]);
  }, [activeEvent, config]);

  const handleStop = useCallback(() => {
    engineRef.current?.stop();
    setRunning(false);
    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        threadName: 'System',
        message: '■ Simulation stopped.',
        level: 'warn',
      },
    ]);
  }, []);

  const handleReset = useCallback(() => {
    setLogs([]);
    setMetrics(null);
    setActiveThreads(0);
  }, []);

  const handleConfigChange = useCallback(
    (key: keyof typeof DEFAULT_CONFIG, value: number | string) =>
      setConfig((prev) => ({ ...prev, [key]: value })),
    []
  );

  return (
    <>
      <Header backendOnline={backendOnline} />
      <main className={styles.main}>
        <div className={styles.layout}>
          {/* ── Top Left: Register Event ── */}
          <div className={`${styles.cell} ${styles.cellTop}`}>
            <RegisterEventCard onSuccess={loadEvents} />
          </div>

          {/* ── Top Right: Event List ── */}
          <div className={`${styles.cell} ${styles.scrollable} ${styles.cellTop}`}>
            <EventList
              events={events}
              activeEvent={activeEvent}
              loadingId={loadingId}
              onEventClick={handleEventClick}
              onDeselect={handleDeselect}
              onRefresh={loadEvents}
              refreshing={refreshing}
            />
          </div>

          {/* ── Conditional Seat Map (Full Width) ── */}
          {activeEvent && (
            <div className={`${styles.cell} ${styles.fullWidth}`}>
              <SeatMap
                totalSeats={activeEvent.totalSeats}
                leftSeats={activeEvent.leftSeats}
                activeThreadCount={activeThreads}
              />
            </div>
          )}

          {/* ── Conditional KPI Cards (Full Width) ── */}
          {metrics && (
            <div className={`${styles.cell} ${styles.fullWidth}`}>
              <KpiCards metrics={metrics} />
            </div>
          )}

          {/* ── Bottom Left: Console Log ── */}
          <div className={`${styles.cell} ${styles.cellBottom}`}>
            <ConsoleLog logs={logs} onClear={handleReset} />
          </div>

          {/* ── Bottom Right: Simulation Controller ── */}
          <div className={`${styles.cell} ${styles.cellBottom}`}>
            <SimulationController
              config={config}
              onChange={handleConfigChange}
              running={running}
              canStart={!!activeEvent}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
              eventType={activeEvent?.eventType}
            />
          </div>
        </div>
      </main>
    </>
  );
}
