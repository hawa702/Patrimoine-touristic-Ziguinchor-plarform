package com.uasz.ms_circuit.config;

import com.uasz.ms_circuit.entities.Circuit;
import com.uasz.ms_circuit.entities.Difficulte;
import com.uasz.ms_circuit.entities.Etape;
import com.uasz.ms_circuit.repositories.CircuitRepository;
import com.uasz.ms_circuit.repositories.EtapeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final CircuitRepository circuitRepository;
    private final EtapeRepository etapeRepository;

    public DataLoader(CircuitRepository circuitRepository, EtapeRepository etapeRepository) {
        this.circuitRepository = circuitRepository;
        this.etapeRepository = etapeRepository;
    }

    @Override
    public void run(String... args) {
        if (circuitRepository.count() == 0) {
            // Circuit 1 : Mémoire et Histoire de Ziguinchor
            Circuit c1 = circuitRepository.save(new Circuit(
                    null,
                    "CIR001",
                    "Circuit Mémoire & Fleuve de Ziguinchor",
                    "Parcours historique pédestre à travers le quartier colonial de l'Escale et les berges du fleuve Casamance.",
                    180, // 3h
                    6,   // 6 km
                    Difficulte.FACILE,
                    25
            ));
            etapeRepository.save(new Etape(null, 1, 60, c1, 1L));
            etapeRepository.save(new Etape(null, 2, 45, c1, 2L));

            // Circuit 2 : Les Trésors Royaux du Bandial et d'Oussouye
            Circuit c2 = circuitRepository.save(new Circuit(
                    null,
                    "CIR002",
                    "Trésors des Royaumes du Bandial et d'Oussouye",
                    "Immersion culturelle au cœur des villages traditionnels diolas, à la découverte des cases à impluvium et des bois sacrés.",
                    300, // 5h
                    28,  // 28 km
                    Difficulte.MOYEN,
                    15
            ));
            etapeRepository.save(new Etape(null, 1, 90, c2, 2L));
            etapeRepository.save(new Etape(null, 2, 80, c2, 4L));

            // Circuit 3 : Épopée Insulaire vers l'Île de Carabane
            Circuit c3 = circuitRepository.save(new Circuit(
                    null,
                    "CIR003",
                    "Épopée en Pirogue vers Carabane",
                    "Traversée des bolongs majestueux en pirogue traditionnelle motorisée et exploration des ruines historiques de Carabane.",
                    420, // 7h
                    45,
                    Difficulte.DIFFICILE,
                    20
            ));
            etapeRepository.save(new Etape(null, 1, 120, c3, 3L));
            etapeRepository.save(new Etape(null, 2, 60, c3, 1L));
        }
    }
}
