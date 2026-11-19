# 🏛️ Plateforme de Gestion du Patrimoine Touristique

Projet complet de système d'information touristique basé sur une **architecture microservices Spring Boot orchestrée et dockerisée**, accompagnée d'un **frontend Angular fonctionnel et réactif** (avec Bootstrap 5).

Ce projet implémente l'intégralité des spécifications fonctionnelles et techniques du cours (*Projet : Gestion de Patrimoine Touristique* - Slides 45 à 50).

---

## 📐 1. Architecture Globale

```
                          ┌────────────────────────┐
                          │   Frontend Angular     │
                          │ (Navigateur / Port 4200│
                          └───────────┬────────────┘
                                      │
                        (Reverse Proxy & CORS Central)
                                      ▼
                          ┌────────────────────────┐
                          │  API Gateway (Nginx)   │
                          │       Port 8080        │
                          └───────────┬────────────┘
                                      │
       ┌──────────────┬───────────────┼───────────────┬──────────────┐
       ▼              ▼               ▼               ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│ ms-auth-user ││ms-patrimoine ││  ms-circuit  ││ ms-evenement ││ms-reservation│
│  Port 3000   ││  Port 3001   ││  Port 3002   ││  Port 3003   ││  Port 3004   │
│ (Users/Avis) ││(Sites/Médias)││(Circuits/Etp)││ (Visites/Evt)││ (Dispo/QR-Tk)│
└──────────────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘
                       ▲               │               │               │
                       └───────────────┴───────────────┤               │
                              OpenFeign Inter-Services  └───────────────┘
```

---

## 🚀 2. Table des Microservices & Ports

| Microservice | Port | Base H2 / Docker | Rôle & Fonctionnalités Clés |
| :--- | :---: | :--- | :--- |
| **`frontend-angular`** | **4200** | N/A (SPA Nginx/Node) | Interface complète (Visiteur, Touriste, Guide, Conservateur) |
| **`api-gateway`** | **8080** | Nginx Reverse-Proxy | Routage `/api/**`, sécurité et gestion globale des CORS |
| **`ms-auth-user`** | **3000** | `userdb` | Auth, Rôles, Validation des Guides, Avis 5★, Signalement & Modération |
| **`ms-patrimoine`** | **3001** | `patrimoinedb` | CRUD des Sites, Médias, Coordonnées GPS, Recherche & Horaires |
| **`ms-circuit`** | **3002** | `circuitdb` | Circuits touristiques, Étapes (liaison OpenFeign avec `ms-patrimoine`) |
| **`ms-evenement`** | **3003** | `evenementdb` | Visites guidées, Ateliers, Expositions & Assignation des guides |
| **`ms-reservation`** | **3004** | `reservationdb` | Réservations, Vérification des stocks (OpenFeign), **QR Code des Tickets** |

---

## 🎯 3. Cas d'Utilisation Implémentés (Conformes au PDF)

### 🧑‍💼 A. Conservateur (Administrateur) — Slide 47
* **Validation des comptes guides** : consultation des demandes avec numéro de licence professionnelle et biographie, boutons pour **Valider** ou **Refuser**.
* **CRUD complet des sites du patrimoine** : ajout, modification (nom, description, historique, adresse, coordonnées GPS, horaires d'ouverture, capacité) et suppression.
* **Gestion des médias** : association de photos et vidéos aux sites patrimoniaux.
* **Modération des avis** (Slide 46 & 48) : traitement des signalements pour avis abusifs (décision de suppression de l'avis ou rejet du signalement).

### 🧭 B. Guide Touristique — Slide 48
* **Création de compte Guide** avec demande de validation (saisie du numéro de licence et biographie).
* **Profil professionnel** avec badge de statut (*Compte vérifié* ou *En attente de validation par le conservateur*).
* **Agenda personnel du jour** : affichage des visites guidées assignées avec horaires, lieu et effectif de visiteurs inscrits.
* **Gestion des avis** : consultation des notes 5 étoiles, possibilité de **répondre aux commentaires** des touristes et bouton pour **signaler un avis abusif**.

### 🎒 C. Touriste / Visiteur Connecté — Slide 49
* **Inscription & Connexion**.
* **Recherche par proximité GPS** : calcul automatique de la distance en kilomètres (formule de Haversine) entre la position de l'utilisateur et les coordonnées GPS de chaque site.
* **Fiche détaillée du site** : galerie multimédia, horaires, localisation, circuits et événements associés, notes et avis.
* **Réservation de visite ou circuit** avec contrôle de disponibilité en temps réel.
* **Espace "Mes Réservations"** : statut de la réservation (`CONFIRMEE`, `EN_ATTENTE`, `ANNULEE`), possibilité d'annulation.
* **Billet avec QR Code** : affichage d'un ticket officiel avec QR Code dynamique scannable aux points de contrôle.
* **Dépôt d'avis** : notation interactive sur 5 étoiles et commentaire textuel après une visite.

### 🌐 D. Visiteur (Public)
* Consultation libre de la page d'accueil avec recherche par mot-clé, ville et type de patrimoine.
* Catalogue avec **pagination interactive** (pages courantes, taille de page comme présenté dans les slides 15 à 19).

---

## 🔑 4. Comptes de Démonstration (Connexion en 1 Clic)

Une barre rapide en haut du site permet de basculer instantanément entre tous les profils de démonstration :

| Rôle | Nom & Prénom | Email | Mot de passe | Spécificité |
| :--- | :--- | :--- | :--- | :--- |
| **Conservateur (Admin)** | Babacar Fall | `admin@patrimoine.sn` | `admin123` | Accès complet au tableau de bord conservateur |
| **Guide Vérifié** | Amadou Diallo | `amadou.diallo@patrimoine.sn` | `guide123` | Licence `GUIDE-CAS-2024-0042`, agenda actif, note 4.9★ |
| **Guide En Attente** | Fatou Sow | `fatou.sow@patrimoine.sn` | `guide123` | Licence `GUIDE-CAS-2026-0105`, statut en attente |
| **Touriste** | Awa Diop | `awa.diop@mail.com` | `touriste123` | Réservations actives et billets QR Code |

---

## 🐳 5. Démarrage avec Docker Compose (Recommandé)

Assurez-vous que Docker Desktop est lancé, puis exécutez dans le dossier racine :

```powershell
docker-compose up --build -d
```
*(ou double-cliquez sur `docker-start.bat`)*

Pour arrêter tous les conteneurs :
```powershell
docker-compose down
```

---

## 💻 6. Démarrage Local Sans Docker

Pour lancer tous les microservices Spring Boot et le frontend en local sur votre machine :

### Option A : Script automatique PowerShell
```powershell
.\start-all-local.ps1
```

### Option B : Script Batch Windows
Double-cliquez sur `start-all-local.bat`.

### Option C : Lancement manuel individuel
1. **ms-auth-user** : `cd ms-auth-user\ms-auth-user && mvn spring-boot:run` (Port 3000)
2. **ms-patrimoine** : `cd ms-patrimoine\ms-patrimoine && .\mvnw.cmd spring-boot:run` (Port 3001)
3. **ms-circuit** : `cd ms-circuit\ms-circuit && .\mvnw.cmd spring-boot:run` (Port 3002)
4. **ms-evenement** : `cd ms-evenement\ms-evenement && .\mvnw.cmd spring-boot:run` (Port 3003)
5. **ms-reservation** : `cd ms-reservation\ms-reservation && .\mvnw.cmd spring-boot:run` (Port 3004)
6. **frontend-angular** : `cd frontend-angular && node serve.js` (Port 4200)

Rendez-vous ensuite sur **[http://localhost:4200](http://localhost:4200)** !
