package com.uasz.ms_reservation.dto;

import com.uasz.ms_reservation.entities.StatutReservation;
import com.uasz.ms_reservation.entities.TypeReservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Long id;
    private TypeReservation typeReservation;
    private Long referenceId;
    private Long touristeId;
    private String nomClient;
    private String email;
    private LocalDate dateVisite;
    private int nombrePlaces;
    private StatutReservation statut;
    private String qrCodeHash;
    private LocalDateTime dateCreation;
}
