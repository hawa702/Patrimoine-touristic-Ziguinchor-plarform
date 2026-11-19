package com.uasz.ms_auth_user.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class GuideDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private String numeroLicence;

    @Lob
    private String biographie;

    private Double noteMoyenne = 5.0;

    private Boolean estVerifie = false; // Validé par le conservateur (Slide 47/48/50)
}
