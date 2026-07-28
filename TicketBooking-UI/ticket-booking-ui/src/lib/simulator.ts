import { bookEvent } from '@/lib/api';
import type { LogEntry, SimulationConfig, TicketBookingDTO } from '@/types';

type OnLog = (entry: LogEntry) => void;
type OnBookingSuccess = (booking: TicketBookingDTO, seatsBooked: number, amountPerTicket: number) => void;
type OnBookingFailure = () => void;
type OnActiveSeatsChange = (threadIdx: number, active: boolean) => void;

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function timestamp(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

export class SimulationEngine {
  private windowStart = Date.now();
  private onLog: OnLog;
  private onSuccess: OnBookingSuccess;
  private onFailure: OnBookingFailure;
  private onActiveSeats: OnActiveSeatsChange;
  private onMetricsUpdate: (metrics: { rps: number; peakLatency: number; successCount: number; failCount: number; totalRequests: number }) => void;

  constructor(
    onLog: OnLog,
    onSuccess: OnBookingSuccess,
    onFailure: OnBookingFailure,
    onActiveSeats: OnActiveSeatsChange,
    onMetricsUpdate: (metrics: { rps: number; peakLatency: number; successCount: number; failCount: number; totalRequests: number }) => void
  ) {
    this.onLog = onLog;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.onActiveSeats = onActiveSeats;
    this.onMetricsUpdate = onMetricsUpdate;
  }

  async start(config: SimulationConfig) {
    this.windowStart = performance.now();
    
    let cumulativeBooked = 0;
    let successCount = 0;
    let failCount = 0;
    let peakLatency = 0;

    const promises = Array.from({ length: config.threadCount }).map(async (_, i) => {
      const threadName = `Thread-${i + 1}`;
      const seats = config.seatsPerBooking;
      const now = new Date().toISOString();

      this.onActiveSeats(i, true);

      this.onLog({
        id: makeId(),
        timestamp: timestamp(),
        threadName,
        message: `Attempting to book ${seats} seat(s) for Event #${config.eventId}. Left Seats before booking: ${config.initialAvailableSeats}`,
        level: 'info',
      });

      const startMs = performance.now();
      try {
        const result = await bookEvent(config.eventId, {
          eventTitle: config.eventTitle,
          requestedSeats: seats,
          bookingDateTime: now,
        }, config.strategy);

        const latency = performance.now() - startMs;
        peakLatency = Math.max(peakLatency, latency);
        this.onActiveSeats(i, false);

        if (result.bookingStatus === 'CONFIRMED' || result.bookingId > 0) {
          cumulativeBooked += result.seatsBooked;
          successCount++;
          
          if (cumulativeBooked > config.initialAvailableSeats) {
             // Overbooking occurred!
             this.onLog({
               id: makeId(),
               timestamp: timestamp(),
               threadName,
               message: `SUCCESS (OVERBOOKED): Booked ${result.seatsBooked} seat(s). Actual Left Seats: ${result.leftSeats} (Data Inconsistency!)`,
               level: 'overbooked',
             });
          } else {
             this.onLog({
               id: makeId(),
               timestamp: timestamp(),
               threadName,
               message: `SUCCESS: Booked ${result.seatsBooked} seat(s) in ${Math.round(latency)}ms. Booking ID #${result.bookingId}`,
               level: 'success',
             });
          }
          this.onSuccess(result, result.seatsBooked, 0);
        } else {
          failCount++;
          this.onLog({
            id: makeId(),
            timestamp: timestamp(),
            threadName,
            message: `FAILED: Unexpected status ${result.bookingStatus} after ${Math.round(latency)}ms`,
            level: 'error',
          });
          this.onFailure();
        }
      } catch (error: any) {
        const latency = performance.now() - startMs;
        peakLatency = Math.max(peakLatency, latency);
        failCount++;
        this.onActiveSeats(i, false);
        this.onLog({
          id: makeId(),
          timestamp: timestamp(),
          threadName,
          message: `FAILED: ${error.message} after ${Math.round(latency)}ms`,
          level: 'error',
        });
        this.onFailure();
      }
    });

    await Promise.allSettled(promises);
    
    const durationMs = performance.now() - this.windowStart;
    const durationSec = durationMs / 1000;
    const rps = durationSec > 0 ? config.threadCount / durationSec : 0;
    
    this.onMetricsUpdate({
       rps,
       peakLatency,
       successCount,
       failCount,
       totalRequests: config.threadCount
    });
  }

  stop() {
    // No-op for burst mode
  }
}
