package com.gaurav.TicketBooking.Model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class EventDTOList {
    private int eventId;
    private String eventTitle;
    private String eventType;
    private int leftSeats;
    public EventDTOList(int eventId, String eventTitle, EventType eventType, int leftSeats) {
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.eventType = eventType.name();
        this.leftSeats = leftSeats;
    }
}
