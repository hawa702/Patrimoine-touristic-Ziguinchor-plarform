package com.uasz.ms_auth_user.repositories;

import com.uasz.ms_auth_user.entities.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisRepository extends JpaRepository<Avis, Long> {
    List<Avis> findBySiteId(Long siteId);
    List<Avis> findByGuideId(Long guideId);
    List<Avis> findByReservationId(Long reservationId);

    @Query("SELECT AVG(a.note) FROM Avis a WHERE a.siteId = :siteId")
    Double getAverageRatingForSite(@Param("siteId") Long siteId);

    @Query("SELECT AVG(a.note) FROM Avis a WHERE a.guideId = :guideId")
    Double getAverageRatingForGuide(@Param("guideId") Long guideId);
}
