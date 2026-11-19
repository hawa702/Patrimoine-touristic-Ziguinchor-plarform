package com.uasz.ms_auth_user.controllers;

import com.uasz.ms_auth_user.dto.AuthDto.*;
import com.uasz.ms_auth_user.entities.GuideDetails;
import com.uasz.ms_auth_user.entities.Role;
import com.uasz.ms_auth_user.entities.User;
import com.uasz.ms_auth_user.repositories.GuideDetailsRepository;
import com.uasz.ms_auth_user.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final GuideDetailsRepository guideDetailsRepository;

    public AuthController(UserRepository userRepository, GuideDetailsRepository guideDetailsRepository) {
        this.userRepository = userRepository;
        this.guideDetailsRepository = guideDetailsRepository;
    }

    // 1. Connexion (Slide 44 & 49)
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect"));

        if (!user.getMotDePasse().equals(request.getMotDePasse())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }

        UserResponse response = buildUserResponse(user);
        return ResponseEntity.ok(response);
    }

    // 2. Inscription Touriste / Guide (Slide 48 & 49)
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cette adresse email");
        }

        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setMotDePasse(request.getMotDePasse());
        user.setRole(request.getRole() != null ? request.getRole() : Role.TOURIST);

        User savedUser = userRepository.save(user);

        // Si rôle GUIDE : création de la demande de validation avec licence et biographie
        if (savedUser.getRole() == Role.GUIDE) {
            GuideDetails guide = new GuideDetails();
            guide.setUserId(savedUser.getId());
            guide.setNumeroLicence(request.getNumeroLicence());
            guide.setBiographie(request.getBiographie());
            guide.setNoteMoyenne(5.0);
            guide.setEstVerifie(false); // Doit être validé par le conservateur (Slide 47 & 48)
            guideDetailsRepository.save(guide);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(buildUserResponse(savedUser));
    }

    // 3. Obtenir l'utilisateur actuel
    @GetMapping("/me/{id}")
    public ResponseEntity<UserResponse> getMe(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        return ResponseEntity.ok(buildUserResponse(user));
    }

    // 4. Lister tous les utilisateurs
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::buildUserResponse).toList();
    }

    private UserResponse buildUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setNom(user.getNom());
        response.setPrenom(user.getPrenom());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setToken("jwt-token-" + UUID.randomUUID().toString());

        if (user.getRole() == Role.GUIDE) {
            guideDetailsRepository.findByUserId(user.getId()).ifPresent(details -> {
                GuideResponse gr = new GuideResponse();
                gr.setId(details.getId());
                gr.setUserId(user.getId());
                gr.setNomComplet(user.getPrenom() + " " + user.getNom());
                gr.setEmail(user.getEmail());
                gr.setNumeroLicence(details.getNumeroLicence());
                gr.setBiographie(details.getBiographie());
                gr.setNoteMoyenne(details.getNoteMoyenne());
                gr.setEstVerifie(details.getEstVerifie());
                response.setGuideDetails(gr);
            });
        }
        return response;
    }
}
