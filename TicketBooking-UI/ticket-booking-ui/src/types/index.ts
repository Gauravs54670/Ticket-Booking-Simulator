export interface ListEventDTO {
  eventId: number;
  eventTitle: string;
  leftSeats: number;
}

export interface EventDTO {
  eventId: number;
  eventTitle: string;
  eventDescription: string;
  eventDateTime: string;
  eventVenue: string;
  totalSeats: number;
  leftSeats: number;
  amountPerTicket: number;
  eventType: string;
}

export interface EventRegistrationRequest {
  eventTitle: string;
  eventDescription: string;
  eventDatetime: string;
  eventVenue: string;
  totalSeats: number;
  amountPerTicket: number;
}

export interface SeatBookingRequest {
  eventTitle: string;
  requestedSeats: number;
  bookingDateTime: string;
}

export interface TicketBookingDTO {
  bookingId: number;
  eventId: number;
  bookingThread: string;
  bookingStatus: string;
  seatsBooked: number;
  leftSeats: number;
  message: string;
}

export type LogLevel = 'info' | 'success' | 'error' | 'warn' | 'overbooked';

export interface LogEntry {
  id: string;
  timestamp: string;
  threadName: string;
  message: string;
  level: LogLevel;
}

export type LockStrategy = 'NO_LOCK' | 'REENTRANT_LOCK';

export interface SimulationConfig {
  threadCount: number;
  seatsPerBooking: number;
  strategy: LockStrategy;
  eventId: number;
  eventTitle: string;
  initialAvailableSeats: number;
}
