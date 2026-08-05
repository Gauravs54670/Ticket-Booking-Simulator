package com.gaurav.TicketBooking.Service;

import com.gaurav.TicketBooking.Model.*;

import java.util.List;

public interface TicketBookingService {
    EventRegistrationResponse registerForNormalEvent(EventRegistrationRequest request);
    EventRegistrationResponse registerForOptimisticEvent(EventRegistrationRequest request);
    List<EventDTOList> getAllEvents();
    EventDTO getEvent(int eventId);
    TicketBookingDTO bookNormalEvent(int eventId, SeatBookingRequest bookingRequest);
    TicketBookingDTO bookReentrantLockEvent(int eventId, SeatBookingRequest bookingRequest);
    TicketBookingDTO bookOptimisticEvent(int eventId, SeatBookingRequest bookingRequest);
    TicketBookingDTO bookReadWriteLockEvent(int eventId, SeatBookingRequest bookingRequest);
    List<String> getBookingAuditLogs();
}
