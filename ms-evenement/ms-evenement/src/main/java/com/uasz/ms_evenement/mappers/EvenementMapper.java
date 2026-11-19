package com.uasz.ms_evenement.mappers;

import com.uasz.ms_evenement.dto.EvenementDto;
import com.uasz.ms_evenement.entities.Evenement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EvenementMapper {

    Evenement toEntity(EvenementDto evenementDto);

    // le patrimoine est récupéré via Feign dans le service
    @Mapping(target = "patrimoine", ignore = true)
    EvenementDto toDto(Evenement evenement);
}
