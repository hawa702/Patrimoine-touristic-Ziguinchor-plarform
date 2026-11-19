package com.uasz.ms_evenement.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Evenement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    private TypeEvenement type;

    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String lieu;             // lieu précis sur le site
    private Long patrimoineId;       // référence vers ms-patrimoine (site qui accueille l'événement)
    private int placesMax;           // nombre de places maximales disponibles
    private Long guideId;            // Guide assigné (Slide 46/48)
    private String guideNom;         // Nom complet du guide
}
