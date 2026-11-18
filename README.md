# Patrimoine touristique de Ziguinchor — plateforme web

Site Angular + API Gateway + 6 microservices Spring Boot, le tout dockerisé.

```
Navigateur ─► frontend (nginx :4200) ─► /api ─► api-gateway :8080 (JWT + rôles)
                                                  ├─ ms-auth        :3005  comptes, guides
                                                  ├─ ms-avis        :3006  avis, signalements
                                                  ├─ ms-patrimoine  :3001  sites
                                                  ├─ ms-circuit     :3002  circuits (Feign → patrimoine)
                                                  ├─ ms-evenement   :3003  évènements (Feign → patrimoine)
                                                  └─ ms-reservation :3004  réservations + QR (Feign → circuit/évènement)
```

Seuls le frontend (4200) et la gateway (8080) sont exposés. Les microservices ne sont joignables que dans le réseau Docker : la gateway vérifie le JWT, applique les rôles et transmet `X-User-*`.

## Lancer

```bash
docker compose up --build          # première fois : plusieurs minutes (builds Maven)
# Site : http://localhost:4200      API : http://localhost:8080
```
Pour tester avec Postman directement sur chaque service (ports 3001–3006) :
`docker compose -f docker-compose.yml -f docker-compose.debug.yml up --build`

Changez `JWT_SECRET` dans `.env` (≥ 32 caractères) et mettez `SEED_DEMO_USERS=false` hors démonstration.

## Comptes de démonstration (mot de passe `password123`)
| Rôle | Email |
|---|---|
| Conservateur (ADMIN) | conservateur@patrimoine.sn |
| Guide (validé) | guide@patrimoine.sn |
| Touriste | touriste@patrimoine.sn |

## Pages par rôle (issues des cas d'utilisation du PDF)
- **Visiteur** : accueil, sites (recherche mot-clé/ville/type, « près de moi »), détail + carte + avis, circuits, évènements, annuaire des guides, inscription touriste/guide.
- **Touriste** : réserver un circuit/évènement (disponibilité en direct), confirmer/annuler, QR code, déposer un avis (site ou guide).
- **Guide** : agenda, profil, avis reçus (répondre, signaler). Compte à faire valider par le conservateur.
- **Conservateur** : CRUD sites/circuits/évènements (affectation d'un guide), validation des guides, réservations, modération des signalements, données de démo.

## Modifications apportées à vos 4 services
- Feign : packages `clients` corrigés, `@EnableFeignClients`, URL via `services.*.url`.
- ms-patrimoine : champs ville/type/horaires/imageUrl, DTO + mapper, données de démo.
- ms-evenement : `guideId/guideNom`, filtre `?guideId=`, vérification du site par Feign.
- ms-reservation : `/mes`, contrôle du propriétaire, `GET /{id}/qrcode` (ZXing, réservation confirmée uniquement), email pris dans `X-User-Email`.
- `server.error.include-message: always` dans les 4 yamls.

## Limites connues (à lire)
- **Rien n'a pu être compilé ni exécuté dans mon environnement** : le code Java a seulement été analysé syntaxiquement et le TypeScript parsé (sans vérification de types). Attendez-vous à corriger quelques erreurs au premier `docker compose up --build`.
- La compatibilité Spring Boot 4.1.1 / Spring Cloud 2025.1.3 (Gateway) n'est pas vérifiée.
- Les images sont des URL (`imageUrl`), pas d'upload de fichiers.
- La recherche par période d'ouverture se limite au texte libre des horaires.
- Les avis ne sont pas liés à une réservation effective.
- Base H2 fichier (volumes Docker) : adaptée à un TP, pas à la production.
