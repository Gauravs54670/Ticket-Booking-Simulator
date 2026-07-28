package com.gaurav.TicketBooking.Model;

import lombok.*;

import java.time.LocalDateTime;
@NoArgsConstructor
@Getter
@Setter
public class EventDTO {
    private int eventId;
    private String eventTitle;
    private String eventDescription;
    @com.fasterxml.jackson.annotation.JsonProperty("eventDateTime")
    private LocalDateTime eventDatetime;
    private String eventVenue;
    private int totalSeats;
    private int leftSeats;
    private double perTicketPrice;
    private String eventType;
    public EventDTO
            (int eventId, String eventTitle,
             String eventDescription, LocalDateTime eventDatetime,
             String eventVenue, int totalSeats,
             int leftSeats, double perTicketPrice,
             EventType eventType) {
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.eventDatetime = eventDatetime;
        this.eventVenue = eventVenue;
        this.totalSeats = totalSeats;
        this.leftSeats = leftSeats;
        this.perTicketPrice = perTicketPrice;
        this.eventType = eventType.name();
    }
}
