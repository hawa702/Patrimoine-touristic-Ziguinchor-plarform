package com.uasz.ms_patrimoine.controllers;

import com.uasz.ms_patrimoine.entities.Media;
import com.uasz.ms_patrimoine.entities.Patrimoine;
import com.uasz.ms_patrimoine.repositories.MediaRepository;
import com.uasz.ms_patrimoine.services.PatrimoineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/patrimoines")
public class PatrimoineController {

    private final PatrimoineService patrimoineService;
    private final MediaRepository mediaRepository;

    public PatrimoineController(PatrimoineService patrimoineService, MediaRepository mediaRepository) {
        this.patrimoineService = patrimoineService;
        this.mediaRepository = mediaRepository;
    }

    // 1. Ajouter un patrimoine (POST)
    @PostMapping
    public Patrimoine createPatrimoine(@RequestBody Patrimoine patrimoine) {
        return this.patrimoineService.savePatrimoine(patrimoine);
    }

    // 2. Récupérer tous les patrimoines ou filtrer (GET)
    @GetMapping
    public List<Patrimoine> getAllPatrimoines(
            @RequestParam(required = false) String motCle,
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String type) {
        if ((motCle != null && !motCle.isBlank()) ||
            (ville != null && !ville.isBlank()) ||
            (type != null && !type.isBlank())) {
            return this.patrimoineService.searchPatrimoines(motCle, ville, type);
        }
        return this.patrimoineService.getAllPatrimoines();
    }

    // 3. Récupérer un patrimoine par son ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Patrimoine> getPatrimoineById(@PathVariable Long id) {
        return this.patrimoineService.getByIdPatrimoine(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Mettre à jour un patrimoine (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Patrimoine> updatePatrimoine(@PathVariable Long id,
                                                       @RequestBody Patrimoine patrimoine) {
        try {
            Patrimoine updated = this.patrimoineService.updatePatrimoine(id, patrimoine);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Supprimer un patrimoine (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatrimoine(@PathVariable Long id) {
        this.patrimoineService.deletePatrimoine(id);
        return ResponseEntity.noContent().build();
    }

    // 6. Gestion des médias du site (Slide 46/50)
    @GetMapping("/{id}/medias")
    public List<Media> getSiteMedias(@PathVariable Long id) {
        return this.mediaRepository.findBySiteId(id);
    }

    @PostMapping("/{id}/medias")
    public Media addMedia(@PathVariable Long id, @RequestBody Media media) {
        media.setSiteId(id);
        return this.mediaRepository.save(media);
    }

    @DeleteMapping("/medias/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId) {
        this.mediaRepository.deleteById(mediaId);
        return ResponseEntity.noContent().build();
    }
}
