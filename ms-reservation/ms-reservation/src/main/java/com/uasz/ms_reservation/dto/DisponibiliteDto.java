package com.uasz.ms_reservation.dto;

import com.uasz.ms_reservation.entities.TypeReservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisponibiliteDto {
    private TypeReservation typeReservation;
    private Long referenceId;
    private LocalDate date;
    private int capacite;
    private int placesReservees;
    private int placesRestantes;
    private boolean disponible;
}
