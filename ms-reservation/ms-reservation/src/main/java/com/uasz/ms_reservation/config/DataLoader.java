package com.uasz.ms_reservation.config;

import com.uasz.ms_reservation.entities.Reservation;
import com.uasz.ms_reservation.entities.StatutReservation;
import com.uasz.ms_reservation.entities.TypeReservation;
import com.uasz.ms_reservation.repositories.ReservationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final ReservationRepository reservationRepository;

    public DataLoader(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public void run(String... args) {
        if (reservationRepository.count() == 0) {
            reservationRepository.save(new Reservation(
                    null,
                    TypeReservation.CIRCUIT,
                    1L,
                    3L, // Touriste Awa Diop
                    "Awa Diop",
                    "awa.diop@mail.com",
                    LocalDate.now().plusDays(2),
                    2,
                    StatutReservation.CONFIRMEE,
                    "TKT-A79B124C",
                    LocalDateTime.now().minusDays(1)
            ));

            reservationRepository.save(new Reservation(
                    null,
                    TypeReservation.EVENEMENT,
                    1L,
                    3L,
                    "Awa Diop",
                    "awa.diop@mail.com",
                    LocalDate.now().plusDays(1),
                    1,
                    StatutReservation.CONFIRMEE,
                    "TKT-E88D567F",
                    LocalDateTime.now().minusHours(5)
            ));
        }
    }
}
