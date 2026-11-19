package com.uasz.ms_patrimoine.services;

import com.uasz.ms_patrimoine.entities.Patrimoine;
import com.uasz.ms_patrimoine.repositories.PatrimoineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatrimoineService implements IPatrimoineService {

    @Autowired
    PatrimoineRepository patrimoineRepository;

    // CREATE
    @Override
    public Patrimoine savePatrimoine(Patrimoine patrimoine) {
        return patrimoineRepository.save(patrimoine);
    }

    // READ ALL
    @Override
    public List<Patrimoine> getAllPatrimoines() {
        return patrimoineRepository.findAll();
    }

    // READ ONE
    @Override
    public Optional<Patrimoine> getByIdPatrimoine(Long id) {
        return patrimoineRepository.findById(id);
    }

    // UPDATE
    @Override
    public Patrimoine updatePatrimoine(Long id, Patrimoine newPatrimoine) {
        return patrimoineRepository.findById(id).map(patrimoine -> {
            patrimoine.setNomPatrimoine(newPatrimoine.getNomPatrimoine());
            patrimoine.setCodePatrimoine(newPatrimoine.getCodePatrimoine());
            patrimoine.setDescriptionPatrimoine(newPatrimoine.getDescriptionPatrimoine());
            patrimoine.setHistoriquePatrimoine(newPatrimoine.getHistoriquePatrimoine());
            patrimoine.setAdressePatrimoine(newPatrimoine.getAdressePatrimoine());
            patrimoine.setVille(newPatrimoine.getVille());
            patrimoine.setHoraires(newPatrimoine.getHoraires());
            patrimoine.setTypePatrimoine(newPatrimoine.getTypePatrimoine());
            patrimoine.setImageUrl(newPatrimoine.getImageUrl());
            patrimoine.setCapacitePatrimoine(newPatrimoine.getCapacitePatrimoine());
            patrimoine.setLatitudePatrimoine(newPatrimoine.getLatitudePatrimoine());
            patrimoine.setLongitudePatrimoine(newPatrimoine.getLongitudePatrimoine());
            return patrimoineRepository.save(patrimoine);
        }).orElseThrow(() -> new RuntimeException("Patrimoine non trouvé avec l'id : " + id));
    }

    // DELETE
    @Override
    public void deletePatrimoine(Long id) {
        patrimoineRepository.deleteById(id);
    }

    // SEARCH
    @Override
    public List<Patrimoine> searchPatrimoines(String motCle, String ville, String type) {
        if (motCle != null && !motCle.isBlank()) {
            return patrimoineRepository.searchByKeyword(motCle.trim());
        }
        if (ville != null && !ville.isBlank()) {
            return patrimoineRepository.findByVilleIgnoreCase(ville.trim());
        }
        if (type != null && !type.isBlank()) {
            return patrimoineRepository.findByTypePatrimoineIgnoreCase(type.trim());
        }
        return patrimoineRepository.findAll();
    }
}
