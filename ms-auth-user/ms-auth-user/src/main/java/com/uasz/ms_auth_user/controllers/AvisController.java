package com.uasz.ms_auth_user.controllers;

import com.uasz.ms_auth_user.dto.AuthDto.ReponseAvisRequest;
import com.uasz.ms_auth_user.entities.Avis;
import com.uasz.ms_auth_user.entities.GuideDetails;
import com.uasz.ms_auth_user.repositories.AvisRepository;
import com.uasz.ms_auth_user.repositories.GuideDetailsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/avis")
public class AvisController {

    private final AvisRepository avisRepository;
    private final GuideDetailsRepository guideDetailsRepository;

    public AvisController(AvisRepository avisRepository, GuideDetailsRepository guideDetailsRepository) {
        this.avisRepository = avisRepository;
        this.guideDetailsRepository = guideDetailsRepository;
    }

    // 1. Déposer un avis sur un site ou un guide (Slide 46 & 49)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Avis creerAvis(@RequestBody Avis avis) {
        if (avis.getNote() < 1 || avis.getNote() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La note doit être comprise entre 1 et 5 étoiles");
        }
        avis.setDatePublication(LocalDateTime.now());
        avis.setEstSignale(false);
        Avis saved = avisRepository.save(avis);

        // Recalcul automatique de la note moyenne du guide si assigné (Slide 46)
        if (avis.getGuideId() != null) {
            Double moy = avisRepository.getAverageRatingForGuide(avis.getGuideId());
            if (moy != null) {
                guideDetailsRepository.findByUserId(avis.getGuideId()).ifPresent(guide -> {
                    guide.setNoteMoyenne(Math.round(moy * 10.0) / 10.0);
                    guideDetailsRepository.save(guide);
                });
            }
        }
        return saved;
    }

    // 2. Récupérer les avis d'un site avec la note moyenne
    @GetMapping("/site/{siteId}")
    public Map<String, Object> getAvisBySite(@PathVariable Long siteId) {
        List<Avis> avisList = avisRepository.findBySiteId(siteId);
        Double moy = avisRepository.getAverageRatingForSite(siteId);
        Map<String, Object> response = new HashMap<>();
        response.put("avis", avisList);
        response.put("noteMoyenne", moy != null ? Math.round(moy * 10.0) / 10.0 : 5.0);
        response.put("totalAvis", avisList.size());
        return response;
    }

    // 3. Récupérer les avis d'un guide avec la note moyenne (Slide 48)
    @GetMapping("/guide/{guideId}")
    public Map<String, Object> getAvisByGuide(@PathVariable Long guideId) {
        List<Avis> avisList = avisRepository.findByGuideId(guideId);
        Double moy = avisRepository.getAverageRatingForGuide(guideId);
        Map<String, Object> response = new HashMap<>();
        response.put("avis", avisList);
        response.put("noteMoyenne", moy != null ? Math.round(moy * 10.0) / 10.0 : 5.0);
        response.put("totalAvis", avisList.size());
        return response;
    }

    // 4. Le guide répond à un commentaire (Slide 48)
    @PutMapping("/{id}/repondre")
    public ResponseEntity<Avis> repondreAvis(@PathVariable Long id, @RequestBody ReponseAvisRequest request) {
        return avisRepository.findById(id).map(avis -> {
            avis.setReponseGuide(request.getReponse());
            return ResponseEntity.ok(avisRepository.save(avis));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Supprimer un avis (modération par le conservateur)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvis(@PathVariable Long id) {
        avisRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
