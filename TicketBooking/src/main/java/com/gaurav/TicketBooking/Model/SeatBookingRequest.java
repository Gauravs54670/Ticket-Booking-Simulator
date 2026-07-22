package com.gaurav.TicketBooking.Model;

import java.time.LocalDateTime;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SeatBookingRequest {
    private String eventTitle;
    private int requestedSeats;
    private LocalDateTime bookingDateTime;
}
