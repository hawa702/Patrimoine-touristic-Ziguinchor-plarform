package com.uasz.ms_circuit.dto;

import com.uasz.ms_circuit.entities.Difficulte;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CircuitDto {
    private Long id;
    private String codeCircuit;
    private String nomCircuit;
    private String descriptionCircuit;
    private int dureeTotale;
    private int distanceTotale;
    private Difficulte difficulte;
    private int capaciteMax;
    private List<EtapeDto> etapes;
}
