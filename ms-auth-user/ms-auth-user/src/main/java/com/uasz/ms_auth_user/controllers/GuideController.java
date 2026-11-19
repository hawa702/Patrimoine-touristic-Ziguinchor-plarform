package com.uasz.ms_auth_user.controllers;

import com.uasz.ms_auth_user.dto.AuthDto.GuideResponse;
import com.uasz.ms_auth_user.entities.GuideDetails;
import com.uasz.ms_auth_user.entities.User;
import com.uasz.ms_auth_user.repositories.GuideDetailsRepository;
import com.uasz.ms_auth_user.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideDetailsRepository guideDetailsRepository;
    private final UserRepository userRepository;

    public GuideController(GuideDetailsRepository guideDetailsRepository, UserRepository userRepository) {
        this.guideDetailsRepository = guideDetailsRepository;
        this.userRepository = userRepository;
    }

    // 1. Lister tous les guides (avec filtre optionnel sur statut de vérification)
    @GetMapping
    public List<GuideResponse> getAllGuides(@RequestParam(required = false) Boolean verifie) {
        List<GuideDetails> detailsList = (verifie != null)
                ? guideDetailsRepository.findByEstVerifie(verifie)
                : guideDetailsRepository.findAll();

        List<GuideResponse> responses = new ArrayList<>();
        for (GuideDetails gd : detailsList) {
            userRepository.findById(gd.getUserId()).ifPresent(u -> {
                responses.add(new GuideResponse(
                        gd.getId(),
                        u.getId(),
                        u.getPrenom() + " " + u.getNom(),
                        u.getEmail(),
                        gd.getNumeroLicence(),
                        gd.getBiographie(),
                        gd.getNoteMoyenne(),
                        gd.getEstVerifie()
                ));
            });
        }
        return responses;
    }

    // 2. Obtenir un guide par son userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<GuideResponse> getGuideByUserId(@PathVariable Long userId) {
        return guideDetailsRepository.findByUserId(userId)
                .map(gd -> {
                    User u = userRepository.findById(userId).orElse(null);
                    String nom = u != null ? u.getPrenom() + " " + u.getNom() : "Guide";
                    String email = u != null ? u.getEmail() : "";
                    return ResponseEntity.ok(new GuideResponse(
                            gd.getId(),
                            userId,
                            nom,
                            email,
                            gd.getNumeroLicence(),
                            gd.getBiographie(),
                            gd.getNoteMoyenne(),
                            gd.getEstVerifie()
                    ));
                }).orElse(ResponseEntity.notFound().build());
    }

    // 3. Valider un compte guide par le conservateur (Slide 47)
    @PutMapping("/{id}/valider")
    public ResponseEntity<GuideDetails> validerGuide(@PathVariable Long id) {
        return guideDetailsRepository.findById(id).map(guide -> {
            guide.setEstVerifie(true);
            return ResponseEntity.ok(guideDetailsRepository.save(guide));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Refuser/Désactiver un compte guide (Slide 47)
    @PutMapping("/{id}/refuser")
    public ResponseEntity<GuideDetails> refuserGuide(@PathVariable Long id) {
        return guideDetailsRepository.findById(id).map(guide -> {
            guide.setEstVerifie(false);
            return ResponseEntity.ok(guideDetailsRepository.save(guide));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Mettre à jour son profil professionnel (Slide 48)
    @PutMapping("/user/{userId}")
    public ResponseEntity<GuideDetails> updateProfilGuide(@PathVariable Long userId, @RequestBody GuideDetails update) {
        return guideDetailsRepository.findByUserId(userId).map(guide -> {
            if (update.getNumeroLicence() != null) guide.setNumeroLicence(update.getNumeroLicence());
            if (update.getBiographie() != null) guide.setBiographie(update.getBiographie());
            return ResponseEntity.ok(guideDetailsRepository.save(guide));
        }).orElse(ResponseEntity.notFound().build());
    }
}
