package com.uasz.ms_reservation.services;

import com.uasz.ms_reservation.dto.DisponibiliteDto;
import com.uasz.ms_reservation.dto.ReservationDto;
import com.uasz.ms_reservation.entities.TypeReservation;

import java.time.LocalDate;
import java.util.List;

public interface IReservationService {
    ReservationDto creerReservation(ReservationDto dto);
    List<ReservationDto> getAllReservations();
    List<ReservationDto> getReservationsByEmail(String email);
    List<ReservationDto> getReservationsByTouristeId(Long touristeId);
    ReservationDto getByIdReservation(Long id);
    ReservationDto confirmerReservation(Long id);
    ReservationDto annulerReservation(Long id);
    DisponibiliteDto verifierDisponibilite(TypeReservation type, Long referenceId, LocalDate date);
}
