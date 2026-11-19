package com.uasz.ms_evenement.repositories;

import com.uasz.ms_evenement.entities.Evenement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    List<Evenement> findByPatrimoineId(Long patrimoineId);
    List<Evenement> findByGuideId(Long guideId);
}
