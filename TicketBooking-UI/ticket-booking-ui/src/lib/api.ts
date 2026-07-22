import type {
  ListEventDTO,
  EventDTO,
  SeatBookingRequest,
  TicketBookingDTO,
  LockStrategy,
} from '@/types';

const BASE_URL = 'http://localhost:8080/api/ticket-booking';

/** Map each strategy to its backend endpoint path */
const STRATEGY_ENDPOINTS: Record<LockStrategy, string> = {
  NO_LOCK: 'book-normal-event',
  REENTRANT_LOCK: 'book-reentrant-lock-event',
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errorBody = await res.json();
      if (errorBody && errorBody.error) {
        errorMessage = errorBody.error;
      } else if (errorBody && errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      try {
        const text = await res.text();
        if (text) errorMessage = text;
      } catch {}
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function registerEvent(body: any): Promise<any> {
  const data = await request<{ response: any }>(
    `${BASE_URL}/register-event`,
    { method: 'POST', body: JSON.stringify(body) }
  );
  return data.response;
}

/** GET /get-all → ListEventDTO[] (lightweight list) */
export async function getAllEvents(): Promise<ListEventDTO[]> {
  const data = await request<{ response: ListEventDTO[] }>(`${BASE_URL}/get-all`);
  return data.response;
}

/** GET /get-event/:id → full EventDTO (detail) */
export async function getEvent(eventId: number): Promise<EventDTO> {
  const data = await request<{ response: EventDTO }>(
    `${BASE_URL}/get-event/${eventId}`
  );
  return data.response;
}

/** POST /book-{strategy}-event/:id — routes to the correct endpoint based on strategy */
export async function bookEvent(
  eventId: number,
  body: SeatBookingRequest,
  strategy: LockStrategy = 'NO_LOCK'
): Promise<TicketBookingDTO> {
  const endpoint = STRATEGY_ENDPOINTS[strategy];
  const data = await request<{ response: TicketBookingDTO }>(
    `${BASE_URL}/${endpoint}/${eventId}`,
    { method: 'POST', body: JSON.stringify(body) }
  );
  return data.response;
}

/** Lightweight health check */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/get-all`, { signal: AbortSignal.timeout(3000) });
    return true;
  } catch {
    return false;
  }
}
