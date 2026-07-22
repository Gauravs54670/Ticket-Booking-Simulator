package com.gaurav.TicketBooking.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDateTime;
    private String eventVenue;
    private int totalSeats;
    private double amountPerTicket;
    private String eventType;
}
