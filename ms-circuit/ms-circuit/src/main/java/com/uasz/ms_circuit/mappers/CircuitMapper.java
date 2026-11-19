package com.uasz.ms_circuit.mappers;

import com.uasz.ms_circuit.dto.CircuitDto;
import com.uasz.ms_circuit.entities.Circuit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CircuitMapper {

    Circuit toEntity(CircuitDto circuitDto);

    // les étapes sont ajoutées à la main dans le service (table séparée)
    @Mapping(target = "etapes", ignore = true)
    CircuitDto toDto(Circuit circuit);
}
