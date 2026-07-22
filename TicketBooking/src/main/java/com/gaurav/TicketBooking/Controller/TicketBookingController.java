package com.gaurav.TicketBooking.Controller;

import com.gaurav.TicketBooking.Model.*;
import com.gaurav.TicketBooking.Service.TicketBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        try {
            TicketBookingDTO response = this.ticketBookingService.bookNormalEvent(eventId, bookingRequest);
            return new ResponseEntity<>(Map.of(
                    "message", "Event Booked",
                    "response", response
            ), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of(
                    "message", "Booking failed",
                    "error", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllEvents() {
        List<ListEventDTO> eventDTOS = this.ticketBookingService.getAllEvents();
        return new ResponseEntity<>(Map.of(
                "message", "Events list fetched",
                "response", eventDTOS
        ),HttpStatus.OK);
    }
    @GetMapping("get-event/{eventId}")
    public ResponseEntity<?> getEvent(@PathVariable int eventId) {
        EventDTO eventDTO = this.ticketBookingService.getEvent(eventId);
        return new ResponseEntity<>(Map.of(
                "message", "Event Fetched.",
                "response", eventDTO
        ),HttpStatus.OK);
    }
}
