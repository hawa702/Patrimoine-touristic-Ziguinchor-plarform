package com.uasz.ms_reservation.repositories;

import com.uasz.ms_reservation.entities.Reservation;
import com.uasz.ms_reservation.entities.StatutReservation;
import com.uasz.ms_reservation.entities.TypeReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByEmail(String email);

    List<Reservation> findByTouristeId(Long touristeId);

    /** Nombre de places déjà prises pour un circuit/événement à une date donnée. */
    @Query("""
           select coalesce(sum(r.nombrePlaces), 0)
           from Reservation r
           where r.typeReservation = :type
             and r.referenceId = :referenceId
             and r.dateVisite = :date
             and r.statut in :statuts
           """)
    int countPlacesReservees(@Param("type") TypeReservation type,
                             @Param("referenceId") Long referenceId,
                             @Param("date") LocalDate date,
                             @Param("statuts") Collection<StatutReservation> statuts);
}
