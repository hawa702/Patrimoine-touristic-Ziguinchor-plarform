package com.uasz.ms_reservation.mappers;

import com.uasz.ms_reservation.dto.ReservationDto;
import com.uasz.ms_reservation.entities.Reservation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    Reservation toEntity(ReservationDto reservationDto);

    ReservationDto toDto(Reservation reservation);
}
