package com.gaurav.TicketBooking.Model;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketBookingDTO {
    private int bookingId;
    private int eventId;
    private String bookingThread;
    private String bookingStatus;
    private int seatsBooked;
    private int leftSeats;
    private String message;
}
