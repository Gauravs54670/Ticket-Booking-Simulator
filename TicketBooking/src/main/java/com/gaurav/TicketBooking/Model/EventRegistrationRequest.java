package com.gaurav.TicketBooking.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class EventRegistrationRequest {
    private String eventTitle;
    private String eventDescription;
    private String eventVenue;
    @JsonProperty("eventDatetime")
    private LocalDateTime eventDateTime;
    @JsonProperty("amountPerTicket")
    private Double perTicketPrice;
    private int totalSeats;
}
