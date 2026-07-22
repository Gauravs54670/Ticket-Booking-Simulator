package com.gaurav.TicketBooking.Service;

import com.gaurav.TicketBooking.Model.EventRegistrationRequest;
import com.gaurav.TicketBooking.Model.EventRegistrationResponse;
import com.gaurav.TicketBooking.Model.SeatBookingRequest;
import com.gaurav.TicketBooking.Model.TicketBookingDTO;

public interface TicketBookingService {
    EventRegistrationResponse registerForEvent(EventRegistrationRequest request);
    TicketBookingDTO bookNormalEvent(int eventId, SeatBookingRequest bookingRequest);
}
