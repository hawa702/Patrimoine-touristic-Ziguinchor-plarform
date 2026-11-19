package com.uasz.ms_circuit.repositories;

import com.uasz.ms_circuit.entities.Etape;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtapeRepository extends JpaRepository<Etape, Long> {

    // "CircuitId" = circuit.id : Spring Data génère la requête à partir du nom
    List<Etape> findByCircuitIdOrderByPositionAsc(Long circuitId);

    void deleteByCircuitId(Long circuitId);
}
