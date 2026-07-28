package com.gaurav.TicketBooking.Model;

import java.time.LocalDateTime;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class EventRegistrationResponse {
    private int eventId;
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDateTime;
    private String eventVenue;
    private int totalSeats;
    private int leftSeats;
}
