package com.uasz.ms_evenement.services;

import com.uasz.ms_evenement.entities.Evenement;
import com.uasz.ms_evenement.repositories.EvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvenementService implements IEvenementService {

    @Autowired
    EvenementRepository evenementRepository;

    // CREATE
    @Override
    public Evenement saveEvenement(Evenement evenement) {
        evenement.setId(null);
        return evenementRepository.save(evenement);
    }

    // READ ALL
    @Override
    public List<Evenement> getAllEvenements() {
        return evenementRepository.findAll();
    }

    // READ ONE
    @Override
    public Optional<Evenement> getByIdEvenement(Long id) {
        return evenementRepository.findById(id);
    }

    // READ par patrimoine
    @Override
    public List<Evenement> getEvenementsByPatrimoine(Long patrimoineId) {
        return evenementRepository.findByPatrimoineId(patrimoineId);
    }

    // READ par guide
    @Override
    public List<Evenement> getEvenementsByGuide(Long guideId) {
        return evenementRepository.findByGuideId(guideId);
    }

    // UPDATE
    @Override
    public Evenement updateEvenement(Long id, Evenement newEvenement) {
        return evenementRepository.findById(id).map(evenement -> {
            evenement.setTitre(newEvenement.getTitre());
            evenement.setDescription(newEvenement.getDescription());
            evenement.setType(newEvenement.getType());
            evenement.setDateDebut(newEvenement.getDateDebut());
            evenement.setDateFin(newEvenement.getDateFin());
            evenement.setLieu(newEvenement.getLieu());
            evenement.setPatrimoineId(newEvenement.getPatrimoineId());
            evenement.setPlacesMax(newEvenement.getPlacesMax());
            evenement.setGuideId(newEvenement.getGuideId());
            evenement.setGuideNom(newEvenement.getGuideNom());
            return evenementRepository.save(evenement);
        }).orElseThrow(() -> new RuntimeException("Evenement non trouvé avec l'id : " + id));
    }

    // DELETE
    @Override
    public void deleteEvenement(Long id) {
        evenementRepository.deleteById(id);
    }
}
