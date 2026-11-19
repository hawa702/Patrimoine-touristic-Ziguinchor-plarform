package com.uasz.ms_circuit.services;

import com.uasz.ms_circuit.clients.PatrimoineClient;
import com.uasz.ms_circuit.dto.CircuitDto;
import com.uasz.ms_circuit.dto.EtapeDto;
import com.uasz.ms_circuit.dto.PatrimoineDto;
import com.uasz.ms_circuit.entities.Circuit;
import com.uasz.ms_circuit.entities.Etape;
import com.uasz.ms_circuit.mappers.CircuitMapper;
import com.uasz.ms_circuit.mappers.EtapeMapper;
import com.uasz.ms_circuit.repositories.CircuitRepository;
import com.uasz.ms_circuit.repositories.EtapeRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CircuitService implements ICircuitService {

    @Autowired
    CircuitRepository circuitRepository;

    @Autowired
    EtapeRepository etapeRepository;

    @Autowired
    CircuitMapper circuitMapper;

    @Autowired
    EtapeMapper etapeMapper;

    @Autowired
    PatrimoineClient patrimoineClient;   // communication avec ms-patrimoine (OpenFeign)

    // CREATE
    @Override
    @Transactional
    public CircuitDto saveCircuit(CircuitDto circuitDto) {
        verifierPatrimoines(circuitDto.getEtapes());

        Circuit circuit = circuitMapper.toEntity(circuitDto);
        circuit.setId(null);
        Circuit savedCircuit = circuitRepository.save(circuit);

        saveEtapes(savedCircuit, circuitDto.getEtapes());
        return buildDto(savedCircuit);
    }

    // READ ALL
    @Override
    public List<CircuitDto> getAllCircuits() {
        return circuitRepository.findAll().stream()
                .map(this::buildDto)
                .toList();
    }

    // READ ONE
    @Override
    public CircuitDto getByIdCircuit(Long id) {
        return buildDto(findOrThrow(id));
    }

    // UPDATE
    @Override
    @Transactional
    public CircuitDto updateCircuit(Long id, CircuitDto circuitDto) {
        Circuit circuit = findOrThrow(id);
        verifierPatrimoines(circuitDto.getEtapes());

        circuit.setCodeCircuit(circuitDto.getCodeCircuit());
        circuit.setNomCircuit(circuitDto.getNomCircuit());
        circuit.setDescriptionCircuit(circuitDto.getDescriptionCircuit());
        circuit.setDureeTotale(circuitDto.getDureeTotale());
        circuit.setDistanceTotale(circuitDto.getDistanceTotale());
        circuit.setDifficulte(circuitDto.getDifficulte());
        circuit.setCapaciteMax(circuitDto.getCapaciteMax());
        Circuit savedCircuit = circuitRepository.save(circuit);

        // si le client envoie des étapes, elles remplacent les anciennes
        if (circuitDto.getEtapes() != null) {
            etapeRepository.deleteByCircuitId(id);
            saveEtapes(savedCircuit, circuitDto.getEtapes());
        }
        return buildDto(savedCircuit);
    }

    // DELETE
    @Override
    @Transactional
    public void deleteCircuit(Long id) {
        etapeRepository.deleteByCircuitId(id);   // d'abord les étapes (clé étrangère)
        circuitRepository.deleteById(id);
    }

    // ---------------------------------------------------------------------
    // Méthodes privées
    // ---------------------------------------------------------------------

    private Circuit findOrThrow(Long id) {
        return circuitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Circuit non trouvé avec l'id : " + id));
    }

    private void saveEtapes(Circuit circuit, List<EtapeDto> etapesDto) {
        if (etapesDto == null) {
            return;
        }
        for (EtapeDto etapeDto : etapesDto) {
            Etape etape = etapeMapper.toEntity(etapeDto);
            etape.setId(null);
            etape.setCircuit(circuit);
            etapeRepository.save(etape);
        }
    }

    /** Construit le CircuitDto complet : circuit + étapes + détails de chaque patrimoine. */
    private CircuitDto buildDto(Circuit circuit) {
        CircuitDto dto = circuitMapper.toDto(circuit);
        List<EtapeDto> etapes = etapeRepository.findByCircuitIdOrderByPositionAsc(circuit.getId())
                .stream()
                .map(etape -> {
                    EtapeDto etapeDto = etapeMapper.toDto(etape);
                    etapeDto.setPatrimoine(chargerPatrimoineSouple(etape.getPatrimoineId()));
                    return etapeDto;
                })
                .toList();
        dto.setEtapes(etapes);
        return dto;
    }

    /** Avant d'écrire : chaque patrimoine doit exister dans ms-patrimoine, sinon on refuse. */
    private void verifierPatrimoines(List<EtapeDto> etapes) {
        if (etapes == null) {
            return;
        }
        for (EtapeDto etape : etapes) {
            if (etape.getPatrimoineId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "patrimoineId est obligatoire pour chaque étape");
            }
            try {
                patrimoineClient.getPatrimoineById(etape.getPatrimoineId());
            } catch (FeignException.NotFound e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Patrimoine introuvable : " + etape.getPatrimoineId());
            } catch (FeignException e) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                        "ms-patrimoine est indisponible, réessayez plus tard");
            }
        }
    }

    /** En lecture : si ms-patrimoine est arrêté, on renvoie quand même le circuit (patrimoine = null). */
    private PatrimoineDto chargerPatrimoineSouple(Long patrimoineId) {
        if (patrimoineId == null) {
            return null;
        }
        try {
            return patrimoineClient.getPatrimoineById(patrimoineId);
        } catch (FeignException e) {
            return null;
        }
    }
}
