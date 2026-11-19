package com.uasz.ms_evenement.controllers;

import com.uasz.ms_evenement.entities.Evenement;
import com.uasz.ms_evenement.services.EvenementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/evenements")
public class EvenementController {

    private final EvenementService evenementService;

    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    // 1. Créer un événement / visite guidée (POST)
    @PostMapping
    public Evenement createEvenement(@RequestBody Evenement evenement) {
        return this.evenementService.saveEvenement(evenement);
    }

    // 2. Récupérer tous les événements (GET)
    // Filtres optionnels : /api/evenements?patrimoineId=1 ou /api/evenements?guideId=2
    @GetMapping
    public List<Evenement> getAllEvenements(
            @RequestParam(required = false) Long patrimoineId,
            @RequestParam(required = false) Long guideId) {
        if (patrimoineId != null) {
            return this.evenementService.getEvenementsByPatrimoine(patrimoineId);
        }
        if (guideId != null) {
            return this.evenementService.getEvenementsByGuide(guideId);
        }
        return this.evenementService.getAllEvenements();
    }

    // 3. Récupérer un événement par son ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Evenement> getEvenementById(@PathVariable Long id) {
        return this.evenementService.getByIdEvenement(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Modifier un événement (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Evenement> updateEvenement(@PathVariable Long id, @RequestBody Evenement evenement) {
        try {
            return ResponseEntity.ok(this.evenementService.updateEvenement(id, evenement));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Supprimer un événement (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        this.evenementService.deleteEvenement(id);
        return ResponseEntity.noContent().build();
    }
}
