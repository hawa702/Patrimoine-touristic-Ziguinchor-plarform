package com.uasz.ms_patrimoine.repositories;

import com.uasz.ms_patrimoine.entities.Patrimoine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatrimoineRepository extends JpaRepository<Patrimoine, Long> {
    List<Patrimoine> findByVilleIgnoreCase(String ville);
    List<Patrimoine> findByTypePatrimoineIgnoreCase(String typePatrimoine);

    @Query("SELECT p FROM Patrimoine p WHERE " +
           "LOWER(p.nomPatrimoine) LIKE LOWER(CONCAT('%', :mc, '%')) OR " +
           "LOWER(p.descriptionPatrimoine) LIKE LOWER(CONCAT('%', :mc, '%')) OR " +
           "LOWER(p.ville) LIKE LOWER(CONCAT('%', :mc, '%')) OR " +
           "LOWER(p.adressePatrimoine) LIKE LOWER(CONCAT('%', :mc, '%'))")
    List<Patrimoine> searchByKeyword(@Param("mc") String mc);
}
