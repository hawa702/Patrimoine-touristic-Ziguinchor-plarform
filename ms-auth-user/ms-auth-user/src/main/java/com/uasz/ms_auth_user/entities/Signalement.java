package com.uasz.ms_auth_user.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Signalement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long avisId;
    private Long signaleurId;
    private String signaleurNom;

    @Lob
    private String motif;

    private LocalDateTime dateSignalement;

    private String statut; // EN_ATTENTE, RESOLU, REJETE (Slide 50)
}
