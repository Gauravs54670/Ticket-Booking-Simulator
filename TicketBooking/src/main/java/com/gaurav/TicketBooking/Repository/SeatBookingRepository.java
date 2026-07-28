package com.gaurav.TicketBooking.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gaurav.TicketBooking.Model.BookingEntity;
public interface SeatBookingRepository extends JpaRepository<BookingEntity, Integer>{

}
