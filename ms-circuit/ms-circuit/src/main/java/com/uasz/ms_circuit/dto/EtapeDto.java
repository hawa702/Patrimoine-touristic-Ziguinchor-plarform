package com.uasz.ms_circuit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtapeDto {
    private Long id;
    private int position;
    private int dureeEstime;
    private Long patrimoineId;          // envoyé par le client
    private PatrimoineDto patrimoine;   // rempli par ms-circuit en appelant ms-patrimoine (lecture seule)
}
