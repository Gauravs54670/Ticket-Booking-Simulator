package com.gaurav.TicketBooking.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ListEventDTO {
    private int eventId;
    private String eventTitle;
    private int leftSeats;
    public ListEventDTO(int eventId, String eventTitle, int leftSeats) {
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.leftSeats = leftSeats;
    }
}
