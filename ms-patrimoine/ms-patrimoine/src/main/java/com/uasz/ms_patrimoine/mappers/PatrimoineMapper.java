package com.uasz.ms_patrimoine.mappers;

import com.uasz.ms_patrimoine.dto.PatrimoineDto;
import com.uasz.ms_patrimoine.entities.Patrimoine;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PatrimoineMapper {

    // Convertit le DTO reçu en Entité pour la base de données
    Patrimoine toEntity(PatrimoineDto patrimoineDto);

    // Convertit l'Entité sauvegardée en DTO pour la réponse
    PatrimoineDto toDto(Patrimoine patrimoine);
}
