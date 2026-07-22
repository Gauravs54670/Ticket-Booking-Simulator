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
  private requestCounts: number[] = [];
  private windowStart = Date.now();
  private totalRequestsInWindow = 0;
  private onLog: OnLog;
  private onSuccess: OnBookingSuccess;
  private onFailure: OnBookingFailure;
  private onActiveSeats: OnActiveSeatsChange;
  private onRpsUpdate: (rps: number) => void;

  constructor(
    onLog: OnLog,
    onSuccess: OnBookingSuccess,
    onFailure: OnBookingFailure,
    onActiveSeats: OnActiveSeatsChange,
    onRpsUpdate: (rps: number) => void
  ) {
    this.onLog = onLog;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    this.onActiveSeats = onActiveSeats;
    this.onRpsUpdate = onRpsUpdate;
  }

  async start(config: SimulationConfig) {
    this.windowStart = Date.now();
    this.totalRequestsInWindow = 0;
    
    let cumulativeBooked = 0;

    const promises = Array.from({ length: config.threadCount }).map(async (_, i) => {
      const threadName = `Thread-${i + 1}`;
      const seats = config.seatsPerBooking;
      const now = new Date().toISOString();

      this.onActiveSeats(i, true);
      this.totalRequestsInWindow++;

      this.onLog({
        id: makeId(),
        timestamp: timestamp(),
        threadName,
        message: `Attempting to book ${seats} seat(s) for Event #${config.eventId}. Left Seats before booking: ${config.initialAvailableSeats}`,
        level: 'info',
      });

      try {
        const result = await bookEvent(config.eventId, {
          eventTitle: config.eventTitle,
          requestedSeats: seats,
          bookingDateTime: now,
        }, config.strategy);

        this.onActiveSeats(i, false);

        if (result.bookingStatus === 'CONFIRMED' || result.bookingId > 0) {
          cumulativeBooked += result.seatsBooked;
          
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
               message: `SUCCESS: Booked ${result.seatsBooked} seat(s). Booking ID #${result.bookingId}`,
               level: 'success',
             });
          }
          this.onSuccess(result, result.seatsBooked, 0);
        } else {
          this.onLog({
            id: makeId(),
            timestamp: timestamp(),
            threadName,
            message: `FAILED: Unexpected status ${result.bookingStatus}`,
            level: 'error',
          });
          this.onFailure();
        }
      } catch (error: any) {
        this.onActiveSeats(i, false);
        this.onLog({
          id: makeId(),
          timestamp: timestamp(),
          threadName,
          message: `FAILED: ${error.message}`,
          level: 'error',
        });
        this.onFailure();
      }
    });

    await Promise.allSettled(promises);
  }

  stop() {
    // No-op for burst mode
  }
}
