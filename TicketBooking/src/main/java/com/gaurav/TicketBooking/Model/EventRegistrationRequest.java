package com.gaurav.TicketBooking.Model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRegistrationRequest {
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDatetime;
    private String eventVenue;
    private int totalSeats;
    private double amountPerTicket;
}
