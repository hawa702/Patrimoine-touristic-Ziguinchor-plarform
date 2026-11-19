package com.uasz.ms_auth_user.config;

import com.uasz.ms_auth_user.entities.*;
import com.uasz.ms_auth_user.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GuideDetailsRepository guideDetailsRepository;
    private final AvisRepository avisRepository;
    private final SignalementRepository signalementRepository;

    public DataLoader(UserRepository userRepository, GuideDetailsRepository guideDetailsRepository,
                      AvisRepository avisRepository, SignalementRepository signalementRepository) {
        this.userRepository = userRepository;
        this.guideDetailsRepository = guideDetailsRepository;
        this.avisRepository = avisRepository;
        this.signalementRepository = signalementRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // 1. Conservateur (Admin)
            User admin = userRepository.save(new User(
                    null, "Fall", "Babacar", "admin@patrimoine.sn", "admin123", Role.ADMIN
            ));

            // 2. Guide vérifié (Amadou Diallo)
            User guide1 = userRepository.save(new User(
                    null, "Diallo", "Amadou", "amadou.diallo@patrimoine.sn", "guide123", Role.GUIDE
            ));
            guideDetailsRepository.save(new GuideDetails(
                    null, guide1.getId(), "GUIDE-CAS-2024-0042",
                    "Guide professionnel agréé depuis 8 ans, historien de formation, expert des royaumes du Bandial et des mémoriaux de Casamance.",
                    4.9, true
            ));

            // 3. Guide en attente de validation par le conservateur (Fatou Sow)
            User guide2 = userRepository.save(new User(
                    null, "Sow", "Fatou", "fatou.sow@patrimoine.sn", "guide123", Role.GUIDE
            ));
            guideDetailsRepository.save(new GuideDetails(
                    null, guide2.getId(), "GUIDE-CAS-2026-0105",
                    "Diplômée d'un Master en Valorisation du Patrimoine et Écotourisme. Spécialiste de la mangrove et des îles de Basse-Casamance.",
                    5.0, false // En attente de validation (Slide 47 & 48)
            ));

            // 4. Touriste (Awa Diop)
            User touriste1 = userRepository.save(new User(
                    null, "Diop", "Awa", "awa.diop@mail.com", "touriste123", Role.TOURIST
            ));

            // 5. Touriste 2 (Marc Dupont)
            User touriste2 = userRepository.save(new User(
                    null, "Dupont", "Marc", "marc.dupont@mail.com", "touriste123", Role.TOURIST
            ));

            // Avis de démonstration
            Avis a1 = avisRepository.save(new Avis(
                    null, 1L, 1L, guide1.getId(), touriste1.getId(), "Awa Diop", 5,
                    "Visite très émouvante du Mémorial Le Joola. Le guide Amadou maîtrise parfaitement l'histoire et transmet les émotions avec un immense respect.",
                    LocalDateTime.now().minusDays(2),
                    "Merci infiniment Awa pour ces mots chaleureux. Préserver cette mémoire est un devoir que nous portons avec ferveur.",
                    false
            ));

            Avis a2 = avisRepository.save(new Avis(
                    null, 2L, 2L, guide1.getId(), touriste2.getId(), "Marc Dupont", 5,
                    "La case à impluvium d'Enampore est une merveille architecturale ! Accueil traditionnel inoubliable.",
                    LocalDateTime.now().minusDays(1),
                    null,
                    false
            ));

            Avis a3 = avisRepository.save(new Avis(
                    null, 3L, 1L, null, touriste2.getId(), "Marc Dupont", 2,
                    "Commentaire avec propos déplacés et insultes gratuites sans rapport avec le site historique.",
                    LocalDateTime.now().minusHours(12),
                    null,
                    true // Signalé
            ));

            // Signalement en attente pour modération par le conservateur (Slide 46/47/48)
            signalementRepository.save(new Signalement(
                    null, a3.getId(), guide1.getId(), "Amadou Diallo",
                    "Propos injurieux et non constructifs ne respectant pas les règles de la communauté.",
                    LocalDateTime.now().minusHours(6),
                    "EN_ATTENTE"
            ));
        }
    }
}
