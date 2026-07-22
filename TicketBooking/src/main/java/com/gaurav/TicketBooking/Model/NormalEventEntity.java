package com.gaurav.TicketBooking.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "normal_event_entity")
public class NormalEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int eventId;
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDateTime;
    private String eventVenue;
    private int totalSeats;
    private int leftSeats;
    private double amountPerTicket;
    private int totalTicketsBooked;
    private double totalRevenue;
    @Enumerated(EnumType.STRING)
    private EventType eventType;
}
