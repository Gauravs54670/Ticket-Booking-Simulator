package com.gaurav.TicketBooking.Controller;

import com.gaurav.TicketBooking.Model.EventRegistrationRequest;
import com.gaurav.TicketBooking.Model.EventRegistrationResponse;
import com.gaurav.TicketBooking.Model.SeatBookingRequest;
import com.gaurav.TicketBooking.Model.TicketBookingDTO;
import com.gaurav.TicketBooking.Service.TicketBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ticket-booking")
public class TicketBookingController {
    private final TicketBookingService ticketBookingService;
    public TicketBookingController(TicketBookingService ticketBookingService) {
        this.ticketBookingService = ticketBookingService;
    }
    @PostMapping("/register-event")
    public ResponseEntity<?> registerNormalEvent(@RequestBody EventRegistrationRequest request) {
        EventRegistrationResponse response = this.ticketBookingService.registerForEvent(request);
        return new ResponseEntity<>(Map.of(
                "message", "Event Registered",
                "response", response
        ), HttpStatus.OK);
    }
    @PostMapping("/book-normal-event/{eventId}")
    public ResponseEntity<?> bookNormalEvent(@PathVariable int eventId, @RequestBody SeatBookingRequest bookingRequest) {
        TicketBookingDTO response = this.ticketBookingService.bookNormalEvent(eventId, bookingRequest);
        return new ResponseEntity<>(Map.of(
                "message", "Event Booked",
                "response", response
        ), HttpStatus.OK);
    }
}
