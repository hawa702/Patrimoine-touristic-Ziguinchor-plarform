package com.uasz.ms_circuit.mappers;

import com.uasz.ms_circuit.dto.EtapeDto;
import com.uasz.ms_circuit.entities.Etape;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EtapeMapper {

    @Mapping(target = "circuit", ignore = true)
    Etape toEntity(EtapeDto etapeDto);

    // le patrimoine est récupéré via Feign dans le service
    @Mapping(target = "patrimoine", ignore = true)
    EtapeDto toDto(Etape etape);
}
