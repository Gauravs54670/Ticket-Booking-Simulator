package com.gaurav.TicketBooking.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.gaurav.TicketBooking.Model.ListEventDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gaurav.TicketBooking.Model.EventDTO;
import com.gaurav.TicketBooking.Model.NormalEventEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NormalEventEntityRepository extends JpaRepository<NormalEventEntity, Integer> {

    @Query("""
            SELECT new com.gaurav.TicketBooking.Model.ListEventDTO(
                event.eventId,
                event.eventTitle,
                event.leftSeats
            )
            FROM NormalEventEntity event
            WHERE event.eventDateTime >= :currentTime
            ORDER BY event.eventDateTime
            """)
    List<ListEventDTO> findAllActiveEvents(@Param("currentTime") LocalDateTime currentTime);
    @Query("""
            SELECT new com.gaurav.TicketBooking.Model.EventDTO(
                event.eventId,
                event.eventTitle,
                event.eventDescription,
                event.eventDateTime,
                event.eventVenue,
                event.totalSeats,
                event.leftSeats,
                event.amountPerTicket,
                event.eventType
            )
            FROM NormalEventEntity event
            WHERE event.eventId = :eventId
            """)
    Optional<EventDTO> findEvent(@Param("eventId") int eventId);

}
