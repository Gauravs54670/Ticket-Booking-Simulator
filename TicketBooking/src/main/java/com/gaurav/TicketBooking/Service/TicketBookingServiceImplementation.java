package com.gaurav.TicketBooking.Service;

import com.gaurav.TicketBooking.Model.*;
import com.gaurav.TicketBooking.Repository.NormalEventEntityRepository;
import com.gaurav.TicketBooking.Repository.NormalSeatBookingRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class TicketBookingServiceImplementation implements TicketBookingService {

    private final NormalEventEntityRepository normalEventEntityRepository;
    private final NormalSeatBookingRepository normalSeatBookingRepository;
    public TicketBookingServiceImplementation(
        NormalEventEntityRepository normalEventEntityRepository,
        NormalSeatBookingRepository normalSeatBookingRepository) {
            this.normalEventEntityRepository = normalEventEntityRepository;
            this.normalSeatBookingRepository = normalSeatBookingRepository;
    }
    // register event
    @Override
    public EventRegistrationResponse registerForEvent(EventRegistrationRequest request) {
        log.info("{} start executing.", Thread.currentThread().getName());
        if(request.getEventDatetime().toLocalDate().isBefore(LocalDateTime.now().toLocalDate())){
            throw new RuntimeException("Event date is before current date");
        }
        NormalEventEntity eventEntity = NormalEventEntity.builder()
                .eventTitle(request.getEventTitle())
                .eventDescription(request.getEventDescription())
                .eventDateTime(request.getEventDatetime())
                .eventVenue(request.getEventVenue())
                .totalSeats(request.getTotalSeats())
                .leftSeats(request.getTotalSeats())
                .amountPerTicket(request.getAmountPerTicket())
                .totalTicketsBooked(0)
                .totalRevenue(0)
                .eventType(EventType.NORMAL_EVENT)
                .build();
        eventEntity = this.normalEventEntityRepository.save(eventEntity);
        return EventRegistrationResponse.builder()
                .eventId(eventEntity.getEventId())
                .eventTitle(eventEntity.getEventTitle())
                .eventDescription(eventEntity.getEventDescription())
                .eventDatetime(eventEntity.getEventDateTime())
                .eventVenue(eventEntity.getEventVenue())
                .totalSeats(eventEntity.getTotalSeats())
                .ticketAmountPerSeat(eventEntity.getAmountPerTicket())
                .eventType(eventEntity.getEventType().toString())
                .build();
    }

    @Override
    public TicketBookingDTO bookNormalEvent(int eventId, SeatBookingRequest bookingRequest) {
        log.info(Thread.currentThread().getName(), "start booking ticket executing");
        NormalEventEntity event = this.normalEventEntityRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found."));
        if(bookingRequest.getBookingDateTime().toLocalDate().isAfter(event.getEventDateTime().toLocalDate()))
            throw new RuntimeException("Request can't be completed. Event already completed.");
        if(event.getLeftSeats() <= 0) throw new RuntimeException("Event HouseFull. No more registration");
        if(bookingRequest.getRequestedSeats() > event.getLeftSeats())
            throw new RuntimeException("Request can't be completed. Requested seats can not be assign.");
        NormalSeatBooking seatBooking = NormalSeatBooking.builder()
                .eventEntity(event)
                .requestedSeats(bookingRequest.getRequestedSeats())
                .threadName(Thread.currentThread().getName())
                .bookingStatus(BookingStatus.SUCCESS)
                .bookedAt(bookingRequest.getBookingDateTime())
                .build();
        this.normalSeatBookingRepository.save(seatBooking);
        event.setLeftSeats(event.getLeftSeats() - bookingRequest.getRequestedSeats());
        event.setTotalTicketsBooked(event.getTotalTicketsBooked() + bookingRequest.getRequestedSeats());
        event.setTotalRevenue(event.getTotalRevenue() + (bookingRequest.getRequestedSeats() * event.getAmountPerTicket()));
        this.normalEventEntityRepository.save(event);
        return TicketBookingDTO.builder()
                .eventId(event.getEventId())
                .bookingId(seatBooking.getBookingId())
                .bookingThread(seatBooking.getThreadName())
                .seatsBooked(seatBooking.getRequestedSeats())
                .bookingStatus(seatBooking.getBookingStatus().toString())
                .build();
    }

}
