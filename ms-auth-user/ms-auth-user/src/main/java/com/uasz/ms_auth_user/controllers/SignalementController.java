package com.uasz.ms_auth_user.controllers;

import com.uasz.ms_auth_user.dto.AuthDto.SignalementRequest;
import com.uasz.ms_auth_user.entities.Signalement;
import com.uasz.ms_auth_user.repositories.AvisRepository;
import com.uasz.ms_auth_user.repositories.SignalementRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/signalements")
public class SignalementController {

    private final SignalementRepository signalementRepository;
    private final AvisRepository avisRepository;

    public SignalementController(SignalementRepository signalementRepository, AvisRepository avisRepository) {
        this.signalementRepository = signalementRepository;
        this.avisRepository = avisRepository;
    }

    // 1. Signaler un avis abusif (Guide ou Touriste) (Slide 46/48)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Signalement creerSignalement(@RequestBody SignalementRequest request) {
        Signalement s = new Signalement();
        s.setAvisId(request.getAvisId());
        s.setSignaleurId(request.getSignaleurId());
        s.setSignaleurNom(request.getSignaleurNom());
        s.setMotif(request.getMotif());
        s.setDateSignalement(LocalDateTime.now());
        s.setStatut("EN_ATTENTE");

        // Marquer l'avis comme signalé
        avisRepository.findById(request.getAvisId()).ifPresent(avis -> {
            avis.setEstSignale(true);
            avisRepository.save(avis);
        });

        return signalementRepository.save(s);
    }

    // 2. Lister tous les signalements (pour le conservateur) (Slide 46/47)
    @GetMapping
    public List<Signalement> getAllSignalements(@RequestParam(required = false) String statut) {
        if (statut != null && !statut.isBlank()) {
            return signalementRepository.findByStatut(statut);
        }
        return signalementRepository.findAll();
    }

    // 3. Traiter un signalement (RESOLU ou REJETE) par le conservateur
    @PutMapping("/{id}/traiter")
    public ResponseEntity<Signalement> traiterSignalement(@PathVariable Long id, @RequestParam String statut) {
        return signalementRepository.findById(id).map(sig -> {
            sig.setStatut(statut);
            if ("RESOLU".equalsIgnoreCase(statut)) {
                // Si résolu, supprimer l'avis inapproprié
                avisRepository.deleteById(sig.getAvisId());
            } else if ("REJETE".equalsIgnoreCase(statut)) {
                // Si rejeté, remettre l'avis comme non signalé
                avisRepository.findById(sig.getAvisId()).ifPresent(avis -> {
                    avis.setEstSignale(false);
                    avisRepository.save(avis);
                });
            }
            return ResponseEntity.ok(signalementRepository.save(sig));
        }).orElse(ResponseEntity.notFound().build());
    }
}
