package com.gaurav.TicketBooking.Service;

import com.gaurav.TicketBooking.Model.*;
import com.gaurav.TicketBooking.Repository.NormalEventEntityRepository;
import com.gaurav.TicketBooking.Repository.SeatBookingRepository;
import com.gaurav.TicketBooking.Repository.OptimisticEventRepository;

import jakarta.persistence.OptimisticLockException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
public class TicketBookingServiceImplementation implements TicketBookingService {

    private final ReentrantLock reentrantLock = new ReentrantLock();
    private final NormalEventEntityRepository normalEventRepository;
    private final OptimisticEventRepository optimisticEventRepository;
    private final SeatBookingRepository seatBookingRepository;
    public TicketBookingServiceImplementation(
            NormalEventEntityRepository normalEventRepository,
            OptimisticEventRepository optimisticEventRepository,
            SeatBookingRepository seatBookingRepository) {
        this.normalEventRepository = normalEventRepository;
        this.optimisticEventRepository = optimisticEventRepository;
        this.seatBookingRepository = seatBookingRepository;
    }


    @Override
    public EventRegistrationResponse registerForNormalEvent(EventRegistrationRequest request) {
        log.info("Normal Event Registration Starts...");
        try {
            NormalEventEntity event = NormalEventEntity.builder()
                    .eventTitle(request.getEventTitle())
                    .eventDescription(request.getEventDescription())
                    .eventDateTime(request.getEventDateTime())
                    .eventVenue(request.getEventVenue())
                    .totalSeats(request.getTotalSeats())
                    .leftSeats(request.getTotalSeats())
                    .perTicketPrice(request.getPerTicketPrice() != null ? request.getPerTicketPrice() : 0.0)
                    .totalTicketsBooked(0)
                    .totalRevenue(0.0)
                    .eventType(EventType.NORMAL_EVENT)
                    .build();
            event = this.normalEventRepository.save(event);
            return EventRegistrationResponse.builder()
                    .eventId(event.getEventId())
                    .eventTitle(event.getEventTitle())
                    .eventDescription(event.getEventDescription())
                    .eventDateTime(event.getEventDateTime())
                    .eventVenue(event.getEventVenue())
                    .totalSeats(event.getTotalSeats())
                    .leftSeats(event.getLeftSeats())
                    .build();
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to register normal event." + e.getMessage());
        }
    }

    @Override
    public EventRegistrationResponse registerForOptimisticEvent(EventRegistrationRequest request) {
        log.info("Optimistic Event Registration Starts....");
        try {
            OptimisticEventEntity event = OptimisticEventEntity.builder()
                    .eventTitle(request.getEventTitle())
                    .eventDescription(request.getEventDescription())
                    .eventDateTime(request.getEventDateTime())
                    .eventVenue(request.getEventVenue())
                    .totalSeats(request.getTotalSeats())
                    .leftSeats(request.getTotalSeats())
                    .perTicketPrice(request.getPerTicketPrice() != null ? request.getPerTicketPrice() : 0.0)
                    .totalTicketsBooked(0)
                    .totalRevenue(0.0)
                    .eventType(EventType.CONCURRENT_EVENT)
                    .build();
            event = this.optimisticEventRepository.save(event);
            return EventRegistrationResponse.builder()
                    .eventId(event.getEventId())
                    .eventTitle(event.getEventTitle())
                    .eventDescription(event.getEventDescription())
                    .eventDateTime(event.getEventDateTime())
                    .eventVenue(event.getEventVenue())
                    .totalSeats(event.getTotalSeats())
                    .leftSeats(event.getLeftSeats())
                    .build();
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to register Optimistic Event." + e.getMessage());
        }
    }

    @Override
    public List<EventDTOList> getAllEvents() {
        List<EventDTOList> normalEventDTOs = this.normalEventRepository.findAllActiveEvents(LocalDateTime.now());
        List<EventDTOList> optimisticEventDTOs = this.optimisticEventRepository.findAllActiveEvents(LocalDateTime.now());
        List<EventDTOList> eventDTOs = new ArrayList<>();
        eventDTOs.addAll(normalEventDTOs);
        eventDTOs.addAll(optimisticEventDTOs);
        return eventDTOs;
    }

    @Override
    public EventDTO getEvent(int eventId) {
        return this.normalEventRepository.findEvent(eventId)
            .orElseGet(() -> this.optimisticEventRepository.findEvent(eventId)
                                .orElseThrow(() -> new RuntimeException("Event not found.")));
    }

    @Override
    public TicketBookingDTO bookNormalEvent(int eventId, SeatBookingRequest bookingRequest) {
        NormalEventEntity event = this.normalEventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found or a different Event Type i.e; CONCURRENT EVENT."));
        if(event.getLeftSeats() <= 0)
            throw new RuntimeException("Booking Failed. Seats already booked.");
        if(event.getLeftSeats() < bookingRequest.getRequestedSeats())
            throw new RuntimeException("Can not complete the request. Left seats " + event.getLeftSeats());
        event.setLeftSeats(event.getLeftSeats() - bookingRequest.getRequestedSeats());
        event.setTotalTicketsBooked(event.getTotalTicketsBooked() + bookingRequest.getRequestedSeats());
        event.setTotalRevenue(event.getTotalRevenue() + (bookingRequest.getRequestedSeats() * event.getPerTicketPrice()));
        this.normalEventRepository.save(event);
        BookingEntity booking = BookingEntity.builder()
                .threadName(Thread.currentThread().getName())
                .eventId(eventId)
                .requestedSeats(bookingRequest.getRequestedSeats())
                .bookedAt(LocalDateTime.now())
                .bookingStatus(BookingStatus.SUCCESS)
                .bookingType(BookingType.NORMAL)
                .build();
        this.seatBookingRepository.save(booking);
        return TicketBookingDTO.builder()
                .bookingId(booking.getBookingId())
                .eventId(booking.getEventId())
                .bookingThread(booking.getThreadName())
                .bookingStatus(booking.getBookingStatus().name())
                .seatsBooked(booking.getRequestedSeats())
                .leftSeats(event.getLeftSeats())
                .message(bookingRequest.getRequestedSeats() + " is booked. Thread name is " + booking.getThreadName())
                .build();
    }

    @Override
    public TicketBookingDTO bookReentrantLockEvent(int eventId, SeatBookingRequest bookingRequest) {
        log.info(Thread.currentThread().getName() ," Starts executing ReentrantLock Event Registration");
        try {
            reentrantLock.lock();
            NormalEventEntity event = this.normalEventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found for booking Reentrant Locked Event."));
            if(event.getLeftSeats() <= 0)
                throw new RuntimeException("Booking Failed. Seats already booked.");
            if(event.getLeftSeats() < bookingRequest.getRequestedSeats())
                throw new RuntimeException("Can not complete the request. Left seats " + event.getLeftSeats());
            event.setLeftSeats(event.getLeftSeats() - bookingRequest.getRequestedSeats());
            event.setTotalTicketsBooked(event.getTotalTicketsBooked() + bookingRequest.getRequestedSeats());
            event.setTotalRevenue(event.getTotalRevenue() + (bookingRequest.getRequestedSeats() * event.getPerTicketPrice()));
            this.normalEventRepository.save(event);
            BookingEntity booking = BookingEntity.builder()
                    .threadName(Thread.currentThread().getName())
                    .eventId(eventId)
                    .requestedSeats(bookingRequest.getRequestedSeats())
                    .bookedAt(LocalDateTime.now())
                    .bookingStatus(BookingStatus.SUCCESS)
                    .bookingType(BookingType.PESSIMISTIC)
                    .build();
            this.seatBookingRepository.save(booking);
            return TicketBookingDTO.builder()
                    .bookingId(booking.getBookingId())
                    .eventId(booking.getEventId())
                    .bookingThread(booking.getThreadName())
                    .bookingStatus(booking.getBookingStatus().name())
                    .seatsBooked(booking.getRequestedSeats())
                    .leftSeats(event.getLeftSeats())
                    .message(bookingRequest.getRequestedSeats() + " is booked. Thread name is " + booking.getThreadName())
                    .build();
        }
        finally {
            reentrantLock.unlock();
        }
    }
    @Override
    public TicketBookingDTO bookOptimisticEvent(int eventId, SeatBookingRequest bookingRequest) {
        log.info(Thread.currentThread().getName(), "Starts executing the Optimistic event booking.");
        int attemptCount = 0;
        int maxAttempts = 3;
        while(true) {
            try {
                OptimisticEventEntity event = this.optimisticEventRepository.findById(eventId)
                        .orElseThrow(() -> new RuntimeException("Event not found for booking Optimistic Event."));
                if(event.getLeftSeats() <= 0)
                    throw new RuntimeException("Booking Failed. Seats already booked.");
                if(event.getLeftSeats() < bookingRequest.getRequestedSeats())
                    throw new RuntimeException("Can not complete the request. Left seats " + event.getLeftSeats());
                event.setLeftSeats(event.getLeftSeats() - bookingRequest.getRequestedSeats());
                event.setTotalTicketsBooked(event.getTotalTicketsBooked() + bookingRequest.getRequestedSeats());
                event.setTotalRevenue(event.getTotalRevenue() + (bookingRequest.getRequestedSeats() * event.getPerTicketPrice()));
                this.optimisticEventRepository.save(event);
                BookingEntity booking = BookingEntity.builder()
                        .threadName(Thread.currentThread().getName())
                        .eventId(eventId)
                        .requestedSeats(bookingRequest.getRequestedSeats())
                        .bookedAt(LocalDateTime.now())
                        .bookingStatus(BookingStatus.SUCCESS)
                        .bookingType(BookingType.OPTIMISTIC)
                        .build();
                this.seatBookingRepository.save(booking);
                return TicketBookingDTO.builder()
                        .bookingId(booking.getBookingId())
                        .eventId(booking.getEventId())
                        .bookingThread(booking.getThreadName())
                        .bookingStatus(booking.getBookingStatus().name())
                        .seatsBooked(booking.getRequestedSeats())
                        .leftSeats(event.getLeftSeats())
                        .message(bookingRequest.getRequestedSeats() + " is booked. Thread name is " + booking.getThreadName())
                        .build();
            }
            catch (ObjectOptimisticLockingFailureException | OptimisticLockException ex) {
                attemptCount++;
                if (attemptCount > maxAttempts)
                    throw new RuntimeException("Booking failed after " + maxAttempts + 
                                        " attempts due to concurrent updates. "+ex.getMessage());
                else {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Thread sleep interrupted. " + e);
                    }
                }
            }
        }
    }

}
