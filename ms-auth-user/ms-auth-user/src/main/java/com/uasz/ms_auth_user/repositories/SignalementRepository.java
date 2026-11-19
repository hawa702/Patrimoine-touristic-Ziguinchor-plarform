package com.uasz.ms_auth_user.repositories;

import com.uasz.ms_auth_user.entities.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {
    List<Signalement> findByStatut(String statut);
}
