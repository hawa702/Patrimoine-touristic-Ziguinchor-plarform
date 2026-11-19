package com.uasz.ms_circuit.entities;

import com.uasz.ms_circuit.entities.Circuit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Etape {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int position;
    private int dureeEstime;

    @ManyToOne
    private Circuit circuit;     // <- doit s'appeler exactement "circuit"

    private Long patrimoineId;
}