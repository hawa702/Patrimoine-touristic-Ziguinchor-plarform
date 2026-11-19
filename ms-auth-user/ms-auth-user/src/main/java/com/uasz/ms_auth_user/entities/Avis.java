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
public class Avis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reservationId;
    private Long siteId;
    private Long guideId;

    private Long touristeId;
    private String touristeNom;

    private int note; // 1 à 5 étoiles (Slide 46)

    @Lob
    private String commentaire;

    private LocalDateTime datePublication;

    @Lob
    private String reponseGuide; // Réponse du guide (Slide 48)

    private Boolean estSignale = false;
}
