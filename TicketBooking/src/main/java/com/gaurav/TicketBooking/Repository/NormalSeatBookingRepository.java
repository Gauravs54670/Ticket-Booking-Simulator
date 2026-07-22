package com.gaurav.TicketBooking.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gaurav.TicketBooking.Model.NormalSeatBooking;
public interface NormalSeatBookingRepository extends JpaRepository<NormalSeatBooking, Integer>{

}
