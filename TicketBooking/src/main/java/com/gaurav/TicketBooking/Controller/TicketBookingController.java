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
        EventRegistrationResponse response = this.ticketBookingService.registerForNormalEvent(request);
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
    @PostMapping("/book-reentrant-lock-event/{eventId}")
    public ResponseEntity<?> bookReentrantLocking(@PathVariable int eventId, @RequestBody SeatBookingRequest request) {
        try {
            TicketBookingDTO response = this.ticketBookingService.bookReentrantLockEvent(eventId, request
            );
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
    @PostMapping("/register-optimistic-event")
    public ResponseEntity<?> registerOptimisticEvent(@RequestBody EventRegistrationRequest request) {
        EventRegistrationResponse response = this.ticketBookingService.registerForOptimisticEvent(request);
        return new ResponseEntity<>(Map.of(
                "message", "Optimistic Event Registered",
                "response", response
        ), HttpStatus.OK);
    }
    @PostMapping("/book-optimistic-event/{eventId}")
    public ResponseEntity<?> bookOptimisticEvent(@PathVariable int eventId, @RequestBody SeatBookingRequest request) {
        try {
            TicketBookingDTO response = this.ticketBookingService.bookOptimisticEvent(eventId, request);
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
    @PostMapping("/book-read-write-lock-event/{eventId}")
    public ResponseEntity<?> bookReadWriteLockEvent(@PathVariable int eventId, @RequestBody SeatBookingRequest request) {
        try {
            TicketBookingDTO response = this.ticketBookingService.bookReadWriteLockEvent(eventId, request);
            return new ResponseEntity<>(Map.of(
                    "message", "Event Booked with ReadWriteLock",
                    "response", response
            ), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of(
                    "message", "Booking failed",
                    "error", e.getMessage()
            ), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/audit-logs")
    public ResponseEntity<?> getBookingAuditLogs() {
        try {
            List<String> logs = this.ticketBookingService.getBookingAuditLogs();
            return new ResponseEntity<>(Map.of(
                    "message", "Audit logs fetched",
                    "response", logs
            ), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of(
                    "message", "Failed to fetch audit logs",
                    "error", e.getMessage()
            ), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllEvents() {
        try {
            List<EventDTOList> eventDTOS = this.ticketBookingService.getAllEvents();
            return new ResponseEntity<>(Map.of(
                    "message", "Events list fetched",
                    "response", eventDTOS
            ),HttpStatus.OK);
        }
        catch (Exception ex) {
            throw new RuntimeException("Failed to retrieve events. Details: " + ex.getMessage(), ex);
        }
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
