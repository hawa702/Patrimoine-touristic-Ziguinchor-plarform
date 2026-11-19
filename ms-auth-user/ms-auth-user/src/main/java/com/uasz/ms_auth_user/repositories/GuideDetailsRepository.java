package com.uasz.ms_auth_user.repositories;

import com.uasz.ms_auth_user.entities.GuideDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideDetailsRepository extends JpaRepository<GuideDetails, Long> {
    Optional<GuideDetails> findByUserId(Long userId);
    List<GuideDetails> findByEstVerifie(Boolean estVerifie);
}
