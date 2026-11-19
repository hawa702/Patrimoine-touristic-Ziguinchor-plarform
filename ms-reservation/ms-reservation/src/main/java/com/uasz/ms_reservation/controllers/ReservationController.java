package com.uasz.ms_reservation.controllers;

import com.uasz.ms_reservation.dto.DisponibiliteDto;
import com.uasz.ms_reservation.dto.ReservationDto;
import com.uasz.ms_reservation.entities.TypeReservation;
import com.uasz.ms_reservation.services.ReservationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // 1. Créer une réservation (POST)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationDto createReservation(@RequestBody ReservationDto reservationDto) {
        return this.reservationService.creerReservation(reservationDto);
    }

    // 2. Lister les réservations avec filtres optionnels (GET)
    @GetMapping
    public List<ReservationDto> getAllReservations(
            @RequestParam(required = false) Long touristeId,
            @RequestParam(required = false) String email) {
        if (touristeId != null) {
            return this.reservationService.getReservationsByTouristeId(touristeId);
        }
        if (email != null && !email.isBlank()) {
            return this.reservationService.getReservationsByEmail(email);
        }
        return this.reservationService.getAllReservations();
    }

    // 3. Récupérer une réservation par son ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(this.reservationService.getByIdReservation(id));
    }

    // 4. Consulter la disponibilité (GET)
    @GetMapping("/disponibilite")
    public DisponibiliteDto getDisponibilite(@RequestParam TypeReservation type,
                                             @RequestParam Long referenceId,
                                             @RequestParam(required = false)
                                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return this.reservationService.verifierDisponibilite(type, referenceId, date);
    }

    // 5. Confirmer une réservation (PUT)
    @PutMapping("/{id}/confirmer")
    public ReservationDto confirmerReservation(@PathVariable Long id) {
        return this.reservationService.confirmerReservation(id);
    }

    // 6. Annuler une réservation (PUT)
    @PutMapping("/{id}/annuler")
    public ReservationDto annulerReservation(@PathVariable Long id) {
        return this.reservationService.annulerReservation(id);
    }
}
