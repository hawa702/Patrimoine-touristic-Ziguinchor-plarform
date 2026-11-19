package com.uasz.ms_reservation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Vue minimale d'un circuit renvoyé par ms-circuit (les autres champs sont ignorés). */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CircuitDto {
    private Long id;
    private String nomCircuit;
    private int capaciteMax;
}
