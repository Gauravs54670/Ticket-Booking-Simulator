package com.gaurav.TicketBooking.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class EventDTO {
    public EventDTO(
            int eventId,
            String eventTitle, String eventDescription,
            LocalDateTime eventDateTime, String eventVenue,
            int totalSeats, int leftSeats,
            double amountPerTicket,
            EventType eventType) {
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.eventDateTime = eventDateTime;
        this.eventVenue = eventVenue;
        this.totalSeats = totalSeats;
        this.leftSeats = leftSeats;
        this.amountPerTicket = amountPerTicket;
        this.eventType = eventType != null ? eventType.name() : null;
    }
    private int eventId;
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDateTime;
    private String eventVenue;
    private int totalSeats;
    private int leftSeats;
    private double amountPerTicket;
    private String eventType;
}
