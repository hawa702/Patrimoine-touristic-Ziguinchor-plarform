package com.uasz.ms_reservation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** Vue minimale d'un événement renvoyé par ms-evenement (les autres champs sont ignorés). */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class EvenementDto {
    private Long id;
    private String titre;
    private LocalDateTime dateDebut;
    private int placesMax;
}
