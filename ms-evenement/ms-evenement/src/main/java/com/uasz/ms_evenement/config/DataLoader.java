package com.uasz.ms_evenement.config;

import com.uasz.ms_evenement.entities.Evenement;
import com.uasz.ms_evenement.entities.TypeEvenement;
import com.uasz.ms_evenement.repositories.EvenementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final EvenementRepository evenementRepository;

    public DataLoader(EvenementRepository evenementRepository) {
        this.evenementRepository = evenementRepository;
    }

    @Override
    public void run(String... args) {
        if (evenementRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();

            // Visite guidée 1 : Le Joola avec Guide Amadou Diallo (ID: 2)
            evenementRepository.save(new Evenement(
                    null,
                    "Visite Guidée : Mémoire et Histoire du Joola",
                    "Parcours commenté par un guide certifié à travers les galeries du mémorial, témoignages et archives maritimes.",
                    TypeEvenement.VISITE_GUIDEE,
                    now.plusDays(1).withHour(10).withMinute(0),
                    now.plusDays(1).withHour(12).withMinute(0),
                    "Hall principal et quai d'embarquement",
                    1L,
                    30,
                    2L,
                    "Amadou Diallo"
            ));

            // Visite guidée 2 : Case à Impluvium
            evenementRepository.save(new Evenement(
                    null,
                    "Visite Guidée & Rituels du Royaume Bandial",
                    "Découverte de l'architecture traditionnelle, explications des rites des moissons et de l'organisation villageoise.",
                    TypeEvenement.VISITE_GUIDEE,
                    now.plusDays(2).withHour(14).withMinute(30),
                    now.plusDays(2).withHour(17).withMinute(0),
                    "Cour intérieure de la Case à Impluvium",
                    2L,
                    20,
                    2L,
                    "Amadou Diallo"
            ));

            // Exposition 1
            evenementRepository.save(new Evenement(
                    null,
                    "Exposition Photographique : Casamance d'Hier et d'Aujourd'hui",
                    "Rétrospective de clichés rares du début du XXe siècle illustrant la culture fluviale et les traditions du Sud.",
                    TypeEvenement.EXPOSITION,
                    now.plusDays(3).withHour(9).withMinute(0),
                    now.plusDays(10).withHour(18).withMinute(0),
                    "Galerie des Arts de Ziguinchor",
                    1L,
                    50,
                    null,
                    null
            ));

            // Atelier 1
            evenementRepository.save(new Evenement(
                    null,
                    "Atelier Pratique : Poterie et Rituels Diola",
                    "Initiation aux techniques traditionnelles de modelage de l'argile et symbolisme des motifs rituels.",
                    TypeEvenement.ATELIER,
                    now.plusDays(4).withHour(15).withMinute(0),
                    now.plusDays(4).withHour(18).withMinute(0),
                    "Atelier des artisans du Musée Sangawatt",
                    4L,
                    15,
                    2L,
                    "Amadou Diallo"
            ));
        }
    }
}
