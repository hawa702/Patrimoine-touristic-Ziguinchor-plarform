package com.uasz.ms_reservation.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeReservation typeReservation;   // CIRCUIT ou EVENEMENT

    private Long referenceId;                  // id du circuit ou de l'événement (autre microservice)
    private Long touristeId;                   // ID du touriste (Slide 50)
    private String nomClient;
    private String email;
    private LocalDate dateVisite;
    private int nombrePlaces;

    @Enumerated(EnumType.STRING)
    private StatutReservation statut;

    private String qrCodeHash;                 // Hash QR code pour le ticket (Slide 46/50)
    private LocalDateTime dateCreation;
}
