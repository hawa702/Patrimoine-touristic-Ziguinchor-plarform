package com.uasz.ms_evenement.dto;

import com.uasz.ms_evenement.entities.TypeEvenement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvenementDto {
    private Long id;
    private String titre;
    private String description;
    private TypeEvenement type;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String lieu;
    private Long patrimoineId;
    private int placesMax;
    private Long guideId;
    private String guideNom;
    private PatrimoineDto patrimoine;
}
