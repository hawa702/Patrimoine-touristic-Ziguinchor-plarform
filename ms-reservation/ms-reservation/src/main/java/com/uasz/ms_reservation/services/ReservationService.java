package com.uasz.ms_reservation.services;

import com.uasz.ms_reservation.clients.CircuitClient;
import com.uasz.ms_reservation.clients.EvenementClient;
import com.uasz.ms_reservation.dto.CircuitDto;
import com.uasz.ms_reservation.dto.DisponibiliteDto;
import com.uasz.ms_reservation.dto.EvenementDto;
import com.uasz.ms_reservation.dto.ReservationDto;
import com.uasz.ms_reservation.entities.Reservation;
import com.uasz.ms_reservation.entities.StatutReservation;
import com.uasz.ms_reservation.entities.TypeReservation;
import com.uasz.ms_reservation.mappers.ReservationMapper;
import com.uasz.ms_reservation.repositories.ReservationRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ReservationService implements IReservationService {

    // Les réservations annulées libèrent leurs places
    private static final Set<StatutReservation> STATUTS_ACTIFS =
            Set.of(StatutReservation.EN_ATTENTE, StatutReservation.CONFIRMEE);

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    ReservationMapper reservationMapper;

    @Autowired
    CircuitClient circuitClient;

    @Autowired
    EvenementClient evenementClient;

    // CREATE
    @Override
    @Transactional
    public ReservationDto creerReservation(ReservationDto dto) {
        if (dto.getTypeReservation() == null || dto.getReferenceId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "typeReservation et referenceId sont obligatoires");
        }
        if (dto.getNombrePlaces() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nombrePlaces doit être supérieur à 0");
        }
        if (dto.getNomClient() == null || dto.getNomClient().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nomClient est obligatoire");
        }

        LocalDate date = dto.getDateVisite();
        int capacite = 50; // valeur par défaut tolérante
        try {
            if (dto.getTypeReservation() == TypeReservation.CIRCUIT) {
                if (date == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "dateVisite est obligatoire pour un circuit");
                }
                CircuitDto circuit = chargerCircuit(dto.getReferenceId());
                if (circuit != null && circuit.getCapaciteMax() > 0) {
                    capacite = circuit.getCapaciteMax();
                }
            } else {
                EvenementDto evenement = chargerEvenement(dto.getReferenceId());
                if (evenement != null) {
                    if (evenement.getPlacesMax() > 0) {
                        capacite = evenement.getPlacesMax();
                    }
                    if (evenement.getDateDebut() != null) {
                        date = evenement.getDateDebut().toLocalDate();
                    }
                }
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            // tolérance si le microservice distant est en train de démarrer
        }

        // 2. Vérifier qu'il reste assez de places
        int dejaReservees = reservationRepository.countPlacesReservees(
                dto.getTypeReservation(), dto.getReferenceId(), date, STATUTS_ACTIFS);
        int restantes = capacite - dejaReservees;
        if (dto.getNombrePlaces() > restantes && restantes >= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Places insuffisantes : " + Math.max(restantes, 0) + " restante(s), "
                            + dto.getNombrePlaces() + " demandée(s)");
        }

        // 3. Valider la réservation
        Reservation reservation = reservationMapper.toEntity(dto);
        reservation.setId(null);
        reservation.setDateVisite(date);
        reservation.setStatut(StatutReservation.CONFIRMEE); // confirmée par défaut pour faciliter l'UX
        reservation.setDateCreation(LocalDateTime.now());
        // Génération de token QR code unique (Slide 46/50)
        reservation.setQrCodeHash("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    // READ ALL
    @Override
    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toDto)
                .toList();
    }

    // READ BY EMAIL
    @Override
    public List<ReservationDto> getReservationsByEmail(String email) {
        return reservationRepository.findByEmail(email).stream()
                .map(reservationMapper::toDto)
                .toList();
    }

    // READ BY TOURIST ID
    @Override
    public List<ReservationDto> getReservationsByTouristeId(Long touristeId) {
        return reservationRepository.findByTouristeId(touristeId).stream()
                .map(reservationMapper::toDto)
                .toList();
    }

    // READ ONE
    @Override
    public ReservationDto getByIdReservation(Long id) {
        return reservationMapper.toDto(findOrThrow(id));
    }

    // CONFIRMER
    @Override
    @Transactional
    public ReservationDto confirmerReservation(Long id) {
        Reservation reservation = findOrThrow(id);
        reservation.setStatut(StatutReservation.CONFIRMEE);
        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    // ANNULER
    @Override
    @Transactional
    public ReservationDto annulerReservation(Long id) {
        Reservation reservation = findOrThrow(id);
        if (reservation.getStatut() == StatutReservation.ANNULEE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Réservation déjà annulée");
        }
        reservation.setStatut(StatutReservation.ANNULEE);
        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    // DISPONIBILITE
    @Override
    public DisponibiliteDto verifierDisponibilite(TypeReservation type, Long referenceId, LocalDate date) {
        int capacite = 30;
        LocalDate dateRef = date;
        try {
            if (type == TypeReservation.CIRCUIT) {
                CircuitDto c = chargerCircuit(referenceId);
                if (c != null && c.getCapaciteMax() > 0) capacite = c.getCapaciteMax();
            } else {
                EvenementDto e = chargerEvenement(referenceId);
                if (e != null) {
                    if (e.getPlacesMax() > 0) capacite = e.getPlacesMax();
                    if (e.getDateDebut() != null) dateRef = e.getDateDebut().toLocalDate();
                }
            }
        } catch (Exception ignored) {}

        int reservees = reservationRepository.countPlacesReservees(type, referenceId, dateRef, STATUTS_ACTIFS);
        int restantes = Math.max(capacite - reservees, 0);
        return new DisponibiliteDto(type, referenceId, dateRef, capacite, reservees, restantes, restantes > 0);
    }

    private Reservation findOrThrow(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Réservation non trouvée avec l'id : " + id));
    }

    private CircuitDto chargerCircuit(Long id) {
        try {
            return circuitClient.getCircuitById(id);
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Circuit introuvable : " + id);
        } catch (FeignException e) {
            return null;
        }
    }

    private EvenementDto chargerEvenement(Long id) {
        try {
            return evenementClient.getEvenementById(id);
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement introuvable : " + id);
        } catch (FeignException e) {
            return null;
        }
    }
}
