package com.gaurav.TicketBooking.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "optimistic_event_entity")
@Entity
public class OptimisticEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_seq")
    @SequenceGenerator(name = "event_seq", sequenceName = "EVENT_SEQUENCE", allocationSize = 1)
    private int eventId;
    private String eventTitle;
    private String eventDescription;
    private LocalDateTime eventDateTime;
    private String eventVenue;
    private int totalSeats;
    private int leftSeats;
    private double perTicketPrice;
    private int totalTicketsBooked;
    private double totalRevenue;
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private EventType eventType;
    @Version
    private int version;
}
