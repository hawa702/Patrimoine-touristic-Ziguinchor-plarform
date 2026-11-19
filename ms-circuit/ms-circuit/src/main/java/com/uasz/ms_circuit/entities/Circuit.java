package com.uasz.ms_circuit.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Circuit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codeCircuit;
    private String nomCircuit;
    private String descriptionCircuit;
    private int dureeTotale;        // en minutes
    private int distanceTotale;     // en km

    @Enumerated(EnumType.STRING)
    private Difficulte difficulte;

    private int capaciteMax;        // nombre max de visiteurs par date (utilisé par ms-reservation)
}
