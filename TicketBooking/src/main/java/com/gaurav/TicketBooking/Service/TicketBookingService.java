package com.gaurav.TicketBooking.Service;

import com.gaurav.TicketBooking.Model.*;

import java.util.List;

public interface TicketBookingService {
    EventRegistrationResponse registerForEvent(EventRegistrationRequest request);
    List<ListEventDTO> getAllEvents();
    EventDTO getEvent(int eventId);
    TicketBookingDTO bookNormalEvent(int eventId, SeatBookingRequest bookingRequest);
    TicketBookingDTO bookReentrantLockEvent(int eventId, SeatBookingRequest bookingRequest);
}
