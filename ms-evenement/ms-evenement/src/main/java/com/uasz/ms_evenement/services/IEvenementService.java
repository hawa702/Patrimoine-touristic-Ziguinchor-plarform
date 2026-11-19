package com.uasz.ms_evenement.services;

import com.uasz.ms_evenement.entities.Evenement;

import java.util.List;
import java.util.Optional;

public interface IEvenementService {
    Evenement saveEvenement(Evenement evenement);
    List<Evenement> getAllEvenements();
    Optional<Evenement> getByIdEvenement(Long id);
    List<Evenement> getEvenementsByPatrimoine(Long patrimoineId);
    List<Evenement> getEvenementsByGuide(Long guideId);
    Evenement updateEvenement(Long id, Evenement evenement);
    void deleteEvenement(Long id);
}
