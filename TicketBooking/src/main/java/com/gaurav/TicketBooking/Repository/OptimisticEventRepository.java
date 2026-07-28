package com.gaurav.TicketBooking.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.gaurav.TicketBooking.Model.EventDTO;
import com.gaurav.TicketBooking.Model.EventDTOList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gaurav.TicketBooking.Model.OptimisticEventEntity;

public interface OptimisticEventRepository extends JpaRepository<OptimisticEventEntity, Integer> {
    @Query("""
               SELECT new com.gaurav.TicketBooking.Model.EventDTOList(
                   event.eventId,
                   event.eventTitle,
                   event.eventType,
                   event.leftSeats
               )
               FROM OptimisticEventEntity event
               WHERE event.eventDateTime >= :currentTime
               ORDER BY event.eventDateTime
               """)
       List<EventDTOList> findAllActiveEvents(@Param("currentTime") LocalDateTime currentTime);
    
       @Query("""
               SELECT new com.gaurav.TicketBooking.Model.EventDTO(
                   event.eventId,
                   event.eventTitle,
                   event.eventDescription,
                   event.eventDateTime,
                   event.eventVenue,
                   event.totalSeats,
                   event.leftSeats,
                   event.perTicketPrice,
                   event.eventType
               )
               FROM OptimisticEventEntity event
               WHERE event.eventId = :eventId
               """)
       Optional<EventDTO> findEvent(@Param("eventId") int eventId);
}

