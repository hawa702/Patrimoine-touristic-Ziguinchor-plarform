package com.uasz.ms_patrimoine.config;

import com.uasz.ms_patrimoine.entities.Media;
import com.uasz.ms_patrimoine.entities.Patrimoine;
import com.uasz.ms_patrimoine.repositories.MediaRepository;
import com.uasz.ms_patrimoine.repositories.PatrimoineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final PatrimoineRepository patrimoineRepository;
    private final MediaRepository mediaRepository;

    public DataLoader(PatrimoineRepository patrimoineRepository, MediaRepository mediaRepository) {
        this.patrimoineRepository = patrimoineRepository;
        this.mediaRepository = mediaRepository;
    }

    @Override
    public void run(String... args) {
        if (patrimoineRepository.count() == 0) {
            Patrimoine p1 = patrimoineRepository.save(new Patrimoine(
                    null,
                    "Mémorial-Musée du Bateau Le Joola",
                    "PMZ001",
                    "Espace de mémoire solennel et culturel dédié aux 1 863 victimes du naufrage du ferry Le Joola survenu le 26 septembre 2002.",
                    "Inauguré pour préserver le souvenir et l'histoire maritime de la Casamance et du Sénégal.",
                    "Quartier Escale, berges du fleuve Casamance",
                    "Ziguinchor",
                    "Mar - Dim : 09h00 - 18h00",
                    "MUSEE",
                    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                    120,
                    12.5605f,
                    -16.2719f
            ));

            Patrimoine p2 = patrimoineRepository.save(new Patrimoine(
                    null,
                    "Case à Impluvium d'Enampore",
                    "PMZ002",
                    "Chef-d'œuvre de l'architecture traditionnelle diola en banco avec toit conique et ouverture centrale captant les eaux de pluie.",
                    "Habitat ancestral communautaire du royaume du Bandial, classé patrimoine culturel national.",
                    "Village d'Enampore, Royaume Bandial",
                    "Enampore",
                    "Lun - Dim : 08h30 - 19h00",
                    "MONUMENT",
                    "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80",
                    50,
                    12.5112f,
                    -16.4489f
            ));

            Patrimoine p3 = patrimoineRepository.save(new Patrimoine(
                    null,
                    "Île Historique de Carabane",
                    "PMZ003",
                    "Ancien comptoir colonial français fondé en 1836, célèbre pour son église bretonne de style missionnaire et son cimetière marin.",
                    "Premier comptoir commercial français en Casamance, riche en vestiges coloniaux et faune fluviale.",
                    "Embouchure du fleuve Casamance, Île de Carabane",
                    "Carabane",
                    "Tous les jours : 08h00 - 18h30",
                    "SITE_NATUREL",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    200,
                    12.5367f,
                    -16.6978f
            ));

            Patrimoine p4 = patrimoineRepository.save(new Patrimoine(
                    null,
                    "Musée Sangawatt de Boucotte",
                    "PMZ004",
                    "Musée vivant des traditions diolas et des fétiches rituels, niché au cœur d'un bois sacré préservé.",
                    "Créé par les anciens pour transmettre les secrets des rites d'initiation et de l'artisanat traditionnel.",
                    "Village de Boucotte Oussouye",
                    "Oussouye",
                    "Mer - Lun : 09h30 - 17h30",
                    "MUSEE",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
                    60,
                    12.4851f,
                    -16.5458f
            ));

            // Medias
            mediaRepository.save(new Media(null, "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", "IMAGE", "Façade principale du Mémorial", p1.getId()));
            mediaRepository.save(new Media(null, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", "IMAGE", "Salle d'exposition et recueillement", p1.getId()));
            mediaRepository.save(new Media(null, "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80", "IMAGE", "Architecture intérieure de l'impluvium", p2.getId()));
            mediaRepository.save(new Media(null, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", "IMAGE", "Plage et ancienne mission de Carabane", p3.getId()));
        }
    }
}
