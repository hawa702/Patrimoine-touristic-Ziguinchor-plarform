package com.uasz.ms_circuit.controllers;

import com.uasz.ms_circuit.dto.CircuitDto;
import com.uasz.ms_circuit.services.CircuitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/circuits")
public class CircuitController {

    private final CircuitService circuitService;

    public CircuitController(CircuitService circuitService) {
        this.circuitService = circuitService;
    }

    // 1. Créer un circuit (POST)
    @PostMapping
    public CircuitDto createCircuit(@RequestBody CircuitDto circuitDto) {
        return this.circuitService.saveCircuit(circuitDto);
    }

    // 2. Récupérer tous les circuits (GET)
    @GetMapping
    public List<CircuitDto> getAllCircuits() {
        return this.circuitService.getAllCircuits();
    }

    // 3. Récupérer un circuit par son ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<CircuitDto> getCircuitById(@PathVariable Long id) {
        return ResponseEntity.ok(this.circuitService.getByIdCircuit(id));
    }

    // 4. Modifier un circuit (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<CircuitDto> updateCircuit(@PathVariable Long id,
                                                    @RequestBody CircuitDto circuitDto) {
        return ResponseEntity.ok(this.circuitService.updateCircuit(id, circuitDto));
    }

    // 5. Supprimer un circuit (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCircuit(@PathVariable Long id) {
        this.circuitService.deleteCircuit(id);
        return ResponseEntity.noContent().build();
    }
}
