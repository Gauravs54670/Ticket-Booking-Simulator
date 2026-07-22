package com.gaurav.TicketBooking.Model;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventRegistrationResponse {
    private int eventId;
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDatetime;
    private String eventVenue;
    private int totalSeats;
    private double ticketAmountPerSeat;
    private String eventType;
}
