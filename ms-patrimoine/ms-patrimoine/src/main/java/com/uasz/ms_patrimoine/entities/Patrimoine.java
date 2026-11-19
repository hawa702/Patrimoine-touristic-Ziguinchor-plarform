package com.uasz.ms_patrimoine.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Patrimoine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomPatrimoine;
    private String codePatrimoine;
    @Lob
    private String descriptionPatrimoine;
    @Lob
    private String historiquePatrimoine;
    private String adressePatrimoine;
    private String ville;
    private String horaires;
    private String typePatrimoine; // MONUMENT, MUSEE, PARC, SITE_NATUREL, HISTORIQUE
    private String imageUrl;
    private int capacitePatrimoine;
    private float latitudePatrimoine;
    private float longitudePatrimoine;
}
