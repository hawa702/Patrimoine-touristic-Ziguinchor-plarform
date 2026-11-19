package com.uasz.ms_auth_user.dto;

import com.uasz.ms_auth_user.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String motDePasse;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String nom;
        private String prenom;
        private String email;
        private String motDePasse;
        private Role role; // TOURIST ou GUIDE
        // Champs optionnels spécifiques au Guide (Slide 48)
        private String numeroLicence;
        private String biographie;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
        private Role role;
        private String token;
        private GuideResponse guideDetails;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuideResponse {
        private Long id;
        private Long userId;
        private String nomComplet;
        private String email;
        private String numeroLicence;
        private String biographie;
        private Double noteMoyenne;
        private Boolean estVerifie;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReponseAvisRequest {
        private String reponse;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignalementRequest {
        private Long avisId;
        private Long signaleurId;
        private String signaleurNom;
        private String motif;
    }
}
