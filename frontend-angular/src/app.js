/**
 * Frontend Applicatif - Gestion du Patrimoine Touristique
 * Single Page Application connectée à l'API Gateway Nginx (:8080)
 * avec repli local persistant si un microservice est hors ligne.
 */

const API_CONFIG = {
    gatewayUrl: 'http://localhost:8080'
};

const STORAGE_KEYS = {
    session: 'patrimoine_session_user',
    users: 'patrimoine_registered_users',
    reservations: 'patrimoine_reservations_data',
    sites: 'patrimoine_sites_data',
    circuits: 'patrimoine_circuits_data',
    evenements: 'patrimoine_evenements_data',
    signalements: 'patrimoine_signalements_data'
};

// --------------------------------------------------------------------------
// ETAT GLOBAL (STORE)
// --------------------------------------------------------------------------
const AppState = {
    currentUser: null,
    currentRoute: 'home',
    routeParam: null,
    editingSiteId: null,
    sites: [],
    circuits: [],
    evenements: [],
    reservations: [],
    guides: [],
    users: [],
    signalements: [],
    userLocation: null
};

async function hashPassword(plainText) {
    const encoder = new TextEncoder();
    const data = encoder.encode(String(plainText));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_SITES = [
    {
        id: 1,
        nomPatrimoine: "Mémorial-Musée du Bateau Le Joola",
        codePatrimoine: "PMZ001",
        prixBillet: 2500,
        descriptionPatrimoine: "Espace de mémoire solennel et culturel dédié aux victimes du naufrage du 26 septembre 2002.",
        historiquePatrimoine: "Inauguré pour préserver le souvenir et l'histoire maritime de la Casamance.",
        adressePatrimoine: "Quartier Escale, berges du fleuve Casamance",
        ville: "Ziguinchor",
        horaires: "Mar - Dim : 09h00 - 18h00",
        typePatrimoine: "MUSEE",
        imageUrl: "/img/memorial.png",
        capacitePatrimoine: 120,
        latitudePatrimoine: 12.5605,
        longitudePatrimoine: -16.2719
    },
    {
        id: 2,
        nomPatrimoine: "Case à Impluvium d'Enampore",
        codePatrimoine: "PMZ002",
        prixBillet: 2000,
        descriptionPatrimoine: "Chef-d'œuvre d'architecture en terre crue et paille avec puits de lumière central et captage d'eau.",
        historiquePatrimoine: "Habitat communautaire ancestral du royaume du Bandial.",
        adressePatrimoine: "Village d'Enampore, Royaume Bandial",
        ville: "Enampore",
        horaires: "Lun - Dim : 08h30 - 19h00",
        typePatrimoine: "MONUMENT",
        imageUrl: "/img/case.png",
        capacitePatrimoine: 50,
        latitudePatrimoine: 12.5112,
        longitudePatrimoine: -16.4489
    },
    {
        id: 3,
        nomPatrimoine: "Île Historique de Carabane",
        codePatrimoine: "PMZ003",
        prixBillet: 5000,
        descriptionPatrimoine: "Ancien comptoir colonial français fondé en 1836, célèbre pour son église missionnaire et son cimetière marin.",
        historiquePatrimoine: "Premier comptoir français en Casamance, riche en vestiges coloniaux et faune fluviale.",
        adressePatrimoine: "Embouchure du fleuve Casamance",
        ville: "Carabane",
        horaires: "Tous les jours : 08h00 - 18h30",
        typePatrimoine: "SITE_NATUREL",
        imageUrl: "/img/iledecarabane.png",
        capacitePatrimoine: 200,
        latitudePatrimoine: 12.5367,
        longitudePatrimoine: -16.6978
    },
    {
        id: 4,
        nomPatrimoine: "Musée Sangawatt de Boucotte",
        codePatrimoine: "PMZ004",
        prixBillet: 2000,
        descriptionPatrimoine: "Musée vivant des traditions diolas et des fétiches rituels, niché au cœur d'un bois sacré préservé.",
        historiquePatrimoine: "Créé par les anciens pour transmettre les secrets des rites d'initiation.",
        adressePatrimoine: "Village de Boucotte Oussouye",
        ville: "Oussouye",
        horaires: "Mer - Lun : 09h30 - 17h30",
        typePatrimoine: "MUSEE",
        imageUrl: "/img/museeboucot.png",
        capacitePatrimoine: 60,
        latitudePatrimoine: 12.4851,
        longitudePatrimoine: -16.5458
    },
    {
        id: 5,
        nomPatrimoine: "Plages & Station Balnéaire de Cap Skirring",
        codePatrimoine: "PMZ005",
        prixBillet: 3000,
        descriptionPatrimoine: "Célèbre station balnéaire bordée de cocotiers, de plages de sable fin et de bolongs propices à l'écotourisme.",
        historiquePatrimoine: "Ancien village de pêcheurs diolas devenu un haut lieu du tourisme balnéaire et écologique en Basse-Casamance.",
        adressePatrimoine: "Côte Atlantique, Département d'Oussouye",
        ville: "Cap Skirring",
        horaires: "Accès libre : 24h/24",
        typePatrimoine: "SITE_NATUREL",
        imageUrl: "/img/caps.png",
        capacitePatrimoine: 300,
        latitudePatrimoine: 12.3931,
        longitudePatrimoine: -16.7436
    },
    {
        id: 6,
        nomPatrimoine: "Quartier Historique de l'Escale",
        codePatrimoine: "PMZ006",
        prixBillet: 1500,
        descriptionPatrimoine: "Ensemble architectural témoignant de l'époque coloniale avec ses bâtiments administratifs et comptoirs.",
        historiquePatrimoine: "Cœur historique de Ziguinchor fondé à l'époque des comptoirs le long du fleuve.",
        adressePatrimoine: "Rue du Commerce & Quais, Ziguinchor",
        ville: "Ziguinchor",
        horaires: "Lun - Sam : 08h00 - 18h00",
        typePatrimoine: "MONUMENT",
        imageUrl: "/img/histoire.png",
        capacitePatrimoine: 100,
        latitudePatrimoine: 12.5833,
        longitudePatrimoine: -16.2719
    },
    {
        id: 7,
        nomPatrimoine: "Le Fleuve Casamance & Bolongs",
        codePatrimoine: "PMZ007",
        prixBillet: 4500,
        descriptionPatrimoine: "Réseau labyrinthique de chenaux d'eau salée bordés de mangroves, refuge d'oiseaux migrateurs.",
        historiquePatrimoine: "Artère vitale de la région ayant façonné le commerce et la riziculture.",
        adressePatrimoine: "Embarcadère de Ziguinchor",
        ville: "Ziguinchor",
        horaires: "Tous les jours : 07h30 - 18h30",
        typePatrimoine: "SITE_NATUREL",
        imageUrl: "/img/fleuve.png",
        capacitePatrimoine: 80,
        latitudePatrimoine: 12.6681,
        longitudePatrimoine: -16.2953
    },
    {
        id: 8,
        nomPatrimoine: "Marché Saint-Maur & Village Artisanal",
        codePatrimoine: "PMZ008",
        prixBillet: 1000,
        descriptionPatrimoine: "Centre névralgique de l'artisanat casamançais : tissage manjak, vannerie, poterie et sculpture.",
        historiquePatrimoine: "Lieu emblématique de rencontre des savoir-faire ancestraux des artisans.",
        adressePatrimoine: "Avenue Émile Badiane, Ziguinchor",
        ville: "Ziguinchor",
        horaires: "Lun - Dim : 08h00 - 19h30",
        typePatrimoine: "MONUMENT",
        imageUrl: "/img/marche1.png",
        capacitePatrimoine: 150,
        latitudePatrimoine: 12.5735,
        longitudePatrimoine: -16.2682
    }
];

const DEFAULT_CIRCUITS = [
    {
        id: 1,
        codeCircuit: "CIR001",
        prixBillet: 7500,
        nomCircuit: "Circuit Mémoire & Fleuve de Ziguinchor",
        descriptionCircuit: "Parcours guidé reliant le Mémorial-Musée du Bateau Le Joola, le quartier historique de l'Escale, les berges du fleuve et le village artisanal de Saint-Maur.",
        etapes: ["Mémorial Le Joola", "Quartier Escale", "Berges du Fleuve", "Marché Saint-Maur"],
        dureeTotale: 180,
        distanceTotale: 7,
        difficulte: "FACILE",
        capaciteMax: 25
    },
    {
        id: 2,
        codeCircuit: "CIR002",
        prixBillet: 12500,
        nomCircuit: "Circuit Royaumes du Bandial & Case à Impluvium",
        descriptionCircuit: "Immersion culturelle et architecturale à travers les villages diolas, la visite de la Case à Impluvium d'Enampore et la découverte de l'habitat traditionnel.",
        etapes: ["Départ Ziguinchor", "Villages du Bandial", "Case à Impluvium d'Enampore"],
        dureeTotale: 300,
        distanceTotale: 28,
        difficulte: "MOYEN",
        capaciteMax: 18
    },
    {
        id: 3,
        codeCircuit: "CIR003",
        prixBillet: 18000,
        nomCircuit: "Circuit Bolongs, Île de Carabane & Cap Skirring",
        descriptionCircuit: "Traversée des bolongs bordés de mangroves vers l'île historique de Carabane (église coloniale, cimetière marin) puis poursuite vers la côte de Cap Skirring.",
        etapes: ["Bolongs de Casamance", "Île de Carabane", "Cap Skirring"],
        dureeTotale: 420,
        distanceTotale: 65,
        difficulte: "MOYEN",
        capaciteMax: 15
    }
];

const DEFAULT_EVENEMENTS = [
    {
        id: 1,
        codeEvenement: "EVT001",
        titre: "Visite Guidée Historique : L'Escale & le Mémorial Le Joola",
        typeEvenement: "VISITE_GUIDEE",
        description: "Visite accompagnée d'un guide certifié retraçant l'histoire maritime de la Casamance, le patrimoine de l'Escale et le devoir de mémoire au Mémorial Le Joola.",
        lieu: "Quartier Escale & Mémorial Le Joola, Ziguinchor",
        dateEvenement: "2026-12-05",
        heureDebut: "09h30",
        guideAssigne: "Amadou Diallo (Licence GUIDE-CAS-2024-0042)",
        placesDisponibles: 20,
        prixPlace: 3500
    },
    {
        id: 2,
        codeEvenement: "EVT002",
        titre: "Atelier Savoir-Faire & Artisanat Casamançais (Poterie, Vannerie & Tissage)",
        typeEvenement: "ATELIER",
        description: "Rencontre et initiation pratique avec des artisans locaux autour de la poterie traditionnelle, du tissage et de la vannerie.",
        lieu: "Marché Saint-Maur & Village Artisanal, Ziguinchor",
        dateEvenement: "2026-12-12",
        heureDebut: "14h00",
        guideAssigne: "Amadou Diallo",
        placesDisponibles: 15,
        prixPlace: 4000
    },
    {
        id: 3,
        codeEvenement: "EVT003",
        titre: "Sortie Écotouristique & Observation des Mangroves des Bolongs",
        typeEvenement: "EXPOSITION_SORTIE",
        description: "Sortie nature encadrée dans les bolongs de Basse-Casamance pour observer les mangroves, l'avifaune et les pratiques de pêche durable.",
        lieu: "Embarcadère & Bolongs de Casamance",
        dateEvenement: "2026-12-19",
        heureDebut: "08h00",
        guideAssigne: "Guide Écotourisme Casamance",
        placesDisponibles: 16,
        prixPlace: 6000
    }
];

async function createSeedUsers() {
    return [
        {
            id: 1,
            prenom: "Babacar",
            nom: "Fall",
            email: "admin@patrimoine-casamance.sn",
            telephone: "+221 77 100 00 01",
            passwordHash: await hashPassword("Admin@2026"),
            role: "ADMIN"
        },
        {
            id: 2,
            prenom: "Amadou",
            nom: "Diallo",
            email: "guide@patrimoine-casamance.sn",
            telephone: "+221 77 200 00 02",
            passwordHash: await hashPassword("Guide@2026"),
            role: "GUIDE",
            guideDetails: {
                numeroLicence: "GUIDE-CAS-2024-0042",
                biographie: "Guide certifié en Casamance, spécialisé dans l'histoire du Joola, les traditions diolas et les bolongs.",
                noteMoyenne: 4.9,
                estVerifie: true
            }
        },
        {
            id: 3,
            prenom: "Awa",
            nom: "Diop",
            email: "touriste@patrimoine-casamance.sn",
            telephone: "+221 77 300 00 03",
            passwordHash: await hashPassword("Touriste@2026"),
            role: "TOURIST"
        }
    ];
}

function getDefaultReservations() {
    return [
        {
            id: 1001,
            typeReservation: "SITE",
            referenceId: 1,
            titreOffre: "Mémorial-Musée du Bateau Le Joola",
            touristeId: 3,
            nomClient: "Awa Diop",
            email: "touriste@patrimoine-casamance.sn",
            telephone: "+221 77 300 00 03",
            dateVisite: "2026-11-24",
            nombrePlaces: 2,
            prixUnitaire: 2500,
            montantTotal: 5000,
            statut: "CONFIRMEE",
            qrCodeHash: "TKT-JLA2026A"
        }
    ];
}

function getDefaultSignalements() {
    return [
        {
            id: 1,
            auteurAvis: "Moussa Ndiaye",
            commentaire: "Contenu hors sujet / lien promotionnel dans l'avis.",
            signalePar: "Amadou Diallo",
            motif: "Avis inapproprié",
            statut: "EN_ATTENTE"
        }
    ];
}

// --------------------------------------------------------------------------
// HELPERS HTTP, QR CODE MATRICIEL & PERSISTANCE
// --------------------------------------------------------------------------
function formatFcfa(montant) {
    return `${Number(montant || 0).toLocaleString('fr-FR')} FCFA`;
}

function getAuthHeaders(includeJson = true) {
    const headers = { 'Accept': 'application/json' };
    if (includeJson) headers['Content-Type'] = 'application/json';
    if (AppState.currentUser?.token) {
        headers['Authorization'] = `Bearer ${AppState.currentUser.token}`;
    }
    return headers;
}

function saveUsers() {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(AppState.users));
}

function saveReservations() {
    localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify(AppState.reservations));
}

function saveSites() {
    localStorage.setItem(STORAGE_KEYS.sites, JSON.stringify(AppState.sites));
}

function saveCircuits() {
    localStorage.setItem(STORAGE_KEYS.circuits, JSON.stringify(AppState.circuits));
}

function saveEvenements() {
    localStorage.setItem(STORAGE_KEYS.evenements, JSON.stringify(AppState.evenements));
}

function saveSignalements() {
    localStorage.setItem(STORAGE_KEYS.signalements, JSON.stringify(AppState.signalements));
}

async function apiGet(path, fallbackData) {
    try {
        const res = await fetch(`${API_CONFIG.gatewayUrl}/api/${path}`, {
            method: 'GET',
            headers: getAuthHeaders(false)
        });
        if (res.ok) return await res.json();
    } catch (_) {
        // Repli local
    }
    return fallbackData;
}

async function apiPost(path, payload, localFallbackFn) {
    try {
        const res = await fetch(`${API_CONFIG.gatewayUrl}/api/${path}`, {
            method: 'POST',
            headers: getAuthHeaders(true),
            body: JSON.stringify(payload)
        });
        if (res.ok) return { fromBackend: true, data: await res.json() };
    } catch (_) {
        // Repli local
    }
    return { fromBackend: false, data: await localFallbackFn() };
}

function getUserLocation() {
    return new Promise((resolve) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    AppState.userLocation = loc;
                    resolve(loc);
                },
                () => {
                    const loc = { lat: 12.5605, lng: -16.2719 };
                    AppState.userLocation = loc;
                    resolve(loc);
                },
                { timeout: 5000 }
            );
        } else {
            const loc = { lat: 12.5605, lng: -16.2719 };
            AppState.userLocation = loc;
            resolve(loc);
        }
    });
}

// Générateur de QR code matriciel 21x21 déterministe avec motifs de repérage
function generateQrCodeSvg(text) {
    const size = 21;
    const cell = 6;
    const offset = 12;
    const totalPx = size * cell + offset * 2;
    const matrix = Array.from({ length: size }, () => Array(size).fill(false));
    const reserved = Array.from({ length: size }, () => Array(size).fill(false));

    function drawFinder(top, left) {
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                const rr = top + r;
                const cc = left + c;
                if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
                    reserved[rr][cc] = true;
                    const inOuter = r === 0 || r === 6 || c === 0 || c === 6;
                    const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                    matrix[rr][cc] = (r >= 0 && r <= 6 && c >= 0 && c <= 6) && (inOuter || inInner);
                }
            }
        }
    }

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Motif d'alignement central (14, 14)
    for (let r = 13; r <= 17; r++) {
        for (let c = 13; c <= 17; c++) {
            reserved[r][c] = true;
            const edge = r === 13 || r === 17 || c === 13 || c === 17;
            const center = r === 15 && c === 15;
            matrix[r][c] = edge || center;
        }
    }

    // Lignes de synchronisation (timing patterns)
    for (let i = 8; i < size - 8; i++) {
        reserved[6][i] = true;
        reserved[i][6] = true;
        matrix[6][i] = i % 2 === 0;
        matrix[i][6] = i % 2 === 0;
    }

    // Remplissage déterministe basé sur le code du billet
    let seed = 2166136261;
    const str = String(text || 'TICKET-CASAMANCE');
    for (let i = 0; i < str.length; i++) {
        seed ^= str.charCodeAt(i);
        seed = Math.imul(seed, 16777619);
    }

    let bitIdx = 0;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!reserved[r][c]) {
                seed ^= (r * 31 + c * 17 + bitIdx);
                seed = Math.imul(seed, 1103515245) + 12345;
                matrix[r][c] = ((seed >>> 16) & 1) === 1;
                bitIdx++;
            }
        }
    }

    let rects = '';
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c]) {
                const x = offset + c * cell;
                const y = offset + r * cell;
                rects += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#0f172a"/>`;
            }
        }
    }

    return `<div class="d-inline-flex flex-column align-items-center bg-white p-3 rounded-3 border shadow-sm">
        <svg width="${totalPx}" height="${totalPx}" viewBox="0 0 ${totalPx} ${totalPx}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${totalPx}" height="${totalPx}" fill="#ffffff"/>
            ${rects}
        </svg>
        <span class="mt-2 small fw-semibold text-secondary">${str}</span>
    </div>`;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show shadow-sm`;
    toast.innerHTML = `<i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'} me-2"></i>${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --------------------------------------------------------------------------
// AUTHENTIFICATION, INSCRIPTION & DÉCONNEXION
// --------------------------------------------------------------------------
function navigateTo(route, param = null) {
    AppState.currentRoute = route;
    AppState.routeParam = param;
    window.location.hash = `#${route}` + (param ? `/${param}` : '');
    renderApp();
}

function handleHashChange() {
    const hash = window.location.hash.slice(1);
    if (!hash) { navigateTo('home'); return; }
    const parts = hash.split('/');
    AppState.currentRoute = parts[0] || 'home';
    AppState.routeParam = parts[1] || null;
    renderApp();
}

window.addEventListener('hashchange', handleHashChange);

function setSessionUser(user) {
    if (user) {
        const { passwordHash, ...safeUser } = user;
        AppState.currentUser = safeUser;
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(safeUser));
    } else {
        AppState.currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.session);
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const result = await apiPost('auth/login', { email, password }, async () => {
        const inputHash = await hashPassword(password);
        return AppState.users.find(
            u => u.email.toLowerCase() === email && u.passwordHash === inputHash
        ) || null;
    });

    if (!result.data) {
        showToast("Adresse email ou mot de passe incorrect.", "danger");
        return;
    }

    const sessionData = result.fromBackend
        ? { ...(result.data.user || result.data), token: result.data.token || 'jwt-token' }
        : { ...result.data, token: 'local-session' };

    setSessionUser(sessionData);
    showToast(`Bienvenue ${sessionData.prenom || ''} ${sessionData.nom || ''}`.trim() + " !", "success");

    if (sessionData.role === 'ADMIN') navigateTo('conservateur');
    else if (sessionData.role === 'GUIDE') navigateTo('guide');
    else navigateTo('mes-reservations');
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const fullName = document.getElementById('regName').value.trim().split(/\s+/);
    const prenom = fullName[0] || 'Utilisateur';
    const nom = fullName.slice(1).join(' ') || '';
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const telephone = document.getElementById('regPhone').value.trim();
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;

    if (password.length < 6) {
        showToast("Le mot de passe doit contenir au moins 6 caractères.", "warning");
        return;
    }

    if (AppState.users.some(u => u.email.toLowerCase() === email)) {
        showToast("Un compte existe déjà avec cette adresse email.", "danger");
        return;
    }

    const payload = {
        prenom,
        nom,
        email,
        telephone,
        role,
        password,
        guideDetails: role === 'GUIDE' ? {
            numeroLicence: document.getElementById('regLicence').value.trim() || `GUIDE-CAS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
            biographie: document.getElementById('regBio').value.trim() || "Guide inscrit sur la plateforme.",
            noteMoyenne: 5.0,
            estVerifie: false
        } : null
    };

    const result = await apiPost('auth/register', payload, async () => ({
        id: Date.now(),
        prenom,
        nom,
        email,
        telephone,
        role,
        passwordHash: await hashPassword(password),
        ...(payload.guideDetails ? { guideDetails: payload.guideDetails } : {})
    }));

    const createdUser = result.fromBackend
        ? { ...(result.data.user || result.data), token: result.data.token || 'jwt-token' }
        : { ...result.data, token: 'local-session' };

    AppState.users.push(createdUser);
    saveUsers();
    setSessionUser(createdUser);
    showToast("Compte créé avec succès !", "success");

    if (createdUser.role === 'ADMIN') navigateTo('conservateur');
    else if (createdUser.role === 'GUIDE') navigateTo('guide');
    else navigateTo('mes-reservations');
}

function logout() {
    setSessionUser(null);
    showToast("Déconnexion effectuée.", "secondary");
    navigateTo('home');
}

async function loadInitialData() {
    const savedUsers = localStorage.getItem(STORAGE_KEYS.users);
    if (savedUsers) {
        try { AppState.users = JSON.parse(savedUsers); } catch (_) { AppState.users = await createSeedUsers(); }
    } else {
        AppState.users = await createSeedUsers();
        saveUsers();
    }

    const savedReservations = localStorage.getItem(STORAGE_KEYS.reservations);
    if (savedReservations) {
        try { AppState.reservations = JSON.parse(savedReservations); } catch (_) { AppState.reservations = getDefaultReservations(); }
    } else {
        AppState.reservations = getDefaultReservations();
        saveReservations();
    }

    let fallbackSites = DEFAULT_SITES;
    const savedSites = localStorage.getItem(STORAGE_KEYS.sites);
    if (savedSites) {
        try { fallbackSites = JSON.parse(savedSites); } catch (_) {}
    }

    let fallbackCircuits = DEFAULT_CIRCUITS;
    const savedCircuits = localStorage.getItem(STORAGE_KEYS.circuits);
    if (savedCircuits) {
        try { fallbackCircuits = JSON.parse(savedCircuits); } catch (_) {}
    }

    let fallbackEvenements = DEFAULT_EVENEMENTS;
    const savedEvenements = localStorage.getItem(STORAGE_KEYS.evenements);
    if (savedEvenements) {
        try { fallbackEvenements = JSON.parse(savedEvenements); } catch (_) {}
    }

    let fallbackSignalements = getDefaultSignalements();
    const savedSignalements = localStorage.getItem(STORAGE_KEYS.signalements);
    if (savedSignalements) {
        try { fallbackSignalements = JSON.parse(savedSignalements); } catch (_) {}
    }

    const savedSession = localStorage.getItem(STORAGE_KEYS.session);
    if (savedSession) {
        try { AppState.currentUser = JSON.parse(savedSession); } catch (_) { AppState.currentUser = null; }
    }

    AppState.sites = await apiGet('patrimoines', fallbackSites);
    saveSites();

    const remoteCircuits = await apiGet('circuits', null);
    AppState.circuits = Array.isArray(remoteCircuits) && remoteCircuits.length > 0 ? remoteCircuits : fallbackCircuits;
    saveCircuits();

    const remoteEvenements = await apiGet('evenements', null);
    AppState.evenements = Array.isArray(remoteEvenements) && remoteEvenements.length > 0 ? remoteEvenements : fallbackEvenements;
    saveEvenements();

    const remoteReservations = await apiGet('reservations', null);
    if (Array.isArray(remoteReservations) && remoteReservations.length > 0) {
        AppState.reservations = remoteReservations;
        saveReservations();
    }

    const remoteGuides = await apiGet('guides', null);
    AppState.guides = Array.isArray(remoteGuides)
        ? remoteGuides
        : AppState.users.filter(u => u.role === 'GUIDE');

    AppState.signalements = await apiGet('signalements', fallbackSignalements);
    saveSignalements();

    await getUserLocation();
    handleHashChange();
}

// --------------------------------------------------------------------------
// RENDU GLOBAL & NAVIGATION
// --------------------------------------------------------------------------
function renderApp() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;
    appRoot.innerHTML = `
        ${renderNavbar()}
        <div id="toast-container" class="position-fixed top-0 end-0 p-3" style="z-index: 1080;"></div>
        <main class="main-content">${renderCurrentView()}</main>
        ${renderFooter()}
    `;
}

function renderNavbar() {
    const u = AppState.currentUser;
    const r = AppState.currentRoute;
    return `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#home" onclick="navigateTo('home')">
                    <i class="bi bi-bank2 me-2 text-warning"></i>Patrimoine Casamance
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link ${r === 'home' ? 'active fw-bold' : ''}" href="#home" onclick="navigateTo('home')">Accueil</a></li>
                        <li class="nav-item"><a class="nav-link ${r === 'sites' ? 'active fw-bold' : ''}" href="#sites" onclick="navigateTo('sites')">Sites & Monuments</a></li>
                        <li class="nav-item"><a class="nav-link ${r === 'circuits' ? 'active fw-bold' : ''}" href="#circuits" onclick="navigateTo('circuits')">Circuits</a></li>
                        <li class="nav-item"><a class="nav-link ${r === 'evenements' ? 'active fw-bold' : ''}" href="#evenements" onclick="navigateTo('evenements')">Événements</a></li>
                    </ul>
                    <ul class="navbar-nav align-items-center gap-2">
                        ${!u ? `
                            <li class="nav-item"><button class="btn btn-outline-light btn-sm" onclick="navigateTo('login')"><i class="bi bi-box-arrow-in-right me-1"></i>Se connecter</button></li>
                            <li class="nav-item"><button class="btn btn-warning btn-sm fw-semibold" onclick="navigateTo('register')"><i class="bi bi-person-plus me-1"></i>S'inscrire</button></li>
                        ` : `
                            <li class="nav-item"><span class="navbar-text small text-light me-1">${u.prenom || ''} ${u.nom || ''}</span></li>
                            ${u.role === 'TOURIST' ? `<li class="nav-item"><button class="btn btn-primary btn-sm" onclick="navigateTo('mes-reservations')"><i class="bi bi-ticket-perforated me-1"></i>Mes Réservations</button></li>` : ''}
                            ${u.role === 'GUIDE' ? `<li class="nav-item"><button class="btn btn-success btn-sm" onclick="navigateTo('guide')"><i class="bi bi-person-badge me-1"></i>Espace Guide</button></li>` : ''}
                            ${u.role === 'ADMIN' ? `<li class="nav-item"><button class="btn btn-danger btn-sm" onclick="navigateTo('conservateur')"><i class="bi bi-speedometer2 me-1"></i>Espace Conservateur</button></li>` : ''}
                            <li class="nav-item"><button class="btn btn-outline-danger btn-sm" onclick="logout()"><i class="bi bi-box-arrow-right me-1"></i>Déconnexion</button></li>
                        `}
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

function renderCurrentView() {
    switch (AppState.currentRoute) {
        case 'home': return renderHomeView();
        case 'sites': return renderSitesView();
        case 'site-detail': return renderSiteDetailView(AppState.routeParam);
        case 'circuits': return renderCircuitsView();
        case 'evenements': return renderEvenementsView();
        case 'mes-reservations': return renderTouristeReservationsView();
        case 'guide': return renderGuideView();
        case 'conservateur': return renderConservateurView();
        case 'login': return renderLoginView();
        case 'register': return renderRegisterView();
        default: return renderHomeView();
    }
}

// --------------------------------------------------------------------------
// VUES PUBLIQUES & RÉSERVATIONS (SITES, CIRCUITS, ÉVÉNEMENTS)
// --------------------------------------------------------------------------
function renderHomeView() {
    const sites = AppState.sites.length > 0 ? AppState.sites : DEFAULT_SITES;
    return `
        <div class="hero-banner text-center shadow-lg position-relative overflow-hidden py-5" style="border-radius: 0 0 40px 40px;">
            <div class="container py-5">
                <span class="badge bg-warning text-dark px-4 py-2 rounded-pill text-uppercase fw-bold mb-3 shadow floating-text d-inline-block">
                    <i class="bi bi-compass me-1"></i> Basse-Casamance • Terre d'Histoire et d'Écotourisme
                </span>
                <h1 class="display-3 fw-bold mb-4 text-white floating-text" style="text-shadow: 0 3px 10px rgba(0,0,0,0.5);">
                    Découvrez la Magie et le Patrimoine de la Casamance
                </h1>
                <p class="lead mb-5 mx-auto text-light floating-text" style="max-width: 800px; text-shadow: 0 1px 5px rgba(0,0,0,0.5);">
                    Région luxuriante aux traditions ancestrales préservées, la Casamance vous invite à explorer ses îles mystiques, ses architectures uniques en terre crue et ses fleuves sinueux.
                </p>
                <div class="d-flex justify-content-center gap-3 flex-wrap">
                    <button class="btn btn-warning px-4 py-2 rounded-pill fw-bold text-dark" onclick="navigateTo('circuits')">Découvrir les circuits</button>
                    <button class="btn btn-outline-light px-4 py-2 rounded-pill fw-bold" onclick="navigateTo('evenements')">Découvrir les événements</button>
                </div>
            </div>
        </div>

     <div class="row g-5 align-items-center mb-5 bg-white p-4 p-lg-5 rounded-4 shadow-sm border">
                <div class="col-lg-6 anim-float">
                    <div class="rounded-4 overflow-hidden shadow-lg bg-light d-flex align-items-center justify-content-center" style="height: 800px;">
                        <img src="/img/casamance.png" alt="Patrimoine Casamançais" class="w-100 h-100" style="object-fit: cover; object-position: center;">
                    </div>
                </div>
                <div class="col-lg-6 d-flex flex-column justify-content-center py-3">
                    <span class="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-2 rounded-pill mb-3 align-self-start">
                        <i class="bi bi-stars me-1"></i> Patrimoine Ancestral
                    </span>
                    <h2 class="display-6 fw-bold mb-4">Un Héritage Culturel Unique au Sénégal</h2>
                    <p class="text-muted fs-5 mb-3">
                        Le patrimoine de la Casamance est façonné par une histoire riche, entre les royaumes traditionnels (Bandial, Oussouye), l'architecture unique des cases à impluvium, et les vestiges coloniaux de Carabane.
                    </p>
                    <p class="text-muted fs-5 mb-4">
                        Entre forêts sacrées, bolongs majestueux et artisanat d'art, chaque site raconte une histoire d'harmonie entre l'homme et la nature.
                    </p>

                    <div class="row g-3 mb-4">
                        <div class="col-sm-6">
                            <div class="p-3 rounded-3 bg-light border h-100">
                                <div class="fw-bold text-dark mb-1"><i class="bi bi-bank text-primary me-2"></i>Histoire & Mémoire</div>
                                <div class="small text-muted">Comptoirs de l'Escale, île de Carabane et lieux de mémoire.</div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="p-3 rounded-3 bg-light border h-100">
                                <div class="fw-bold text-dark mb-1"><i class="bi bi-tree text-success me-2"></i>Nature & Traditions</div>
                                <div class="small text-muted">Cases à impluvium, bolongs, mangroves et savoir-faire locaux.</div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap gap-3">
                        <button class="btn btn-primary btn-lg px-4 py-2 rounded-pill fw-bold" onclick="navigateTo('sites')">
                            Explorer tous les sites <i class="bi bi-arrow-right ms-2"></i>
                        </button>
                        <button class="btn btn-outline-dark btn-lg px-4 py-2 rounded-pill fw-bold" onclick="navigateTo('circuits')">
                            Voir les circuits
                        </button>
                    </div>
                </div>
            </div>

            <!-- PRÉSENTATION DES CIRCUITS TOURISTIQUES -->
            <div class="row g-5 align-items-center mb-5 bg-white p-4 p-lg-5 rounded-4 shadow-sm border">
                <div class="col-lg-6">
                    <span class="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill mb-3">
                        <i class="bi bi-map me-1"></i> Parcours Organisés & Étapes
                    </span>
                    <h2 class="fw-bold mb-3">Les Circuits Touristiques en Casamance</h2>
                    <p class="text-muted mb-3">
                        Les <strong>circuits touristiques</strong> relient plusieurs sites, villages, bolongs et étapes sur un itinéraire structuré avec une durée, une distance, un niveau de difficulté et un tarif global.
                    </p>
                    <p class="text-muted mb-4">
                        Idéaux pour découvrir en un seul voyage l'histoire de Ziguinchor, la Case à Impluvium d'Enampore, l'île de Carabane ou les côtes de Cap Skirring, avec réservation directe de vos places.
                    </p>
                    <button class="btn btn-success px-4 py-2 rounded-pill fw-bold" onclick="navigateTo('circuits')">
                        Voir la liste des circuits <i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
                <div class="col-lg-6">
                    <img src="/img/fleuve.png" alt="Circuits touristiques et bolongs de Casamance" class="img-fluid rounded-4 shadow-lg w-100" style="height: 360px; object-fit: cover;">
                </div>
            </div>

            <!-- PRÉSENTATION DES ÉVÉNEMENTS, VISITES GUIDÉES & ATELIERS -->
            <div class="row g-5 align-items-center mb-5 bg-white p-4 p-lg-5 rounded-4 shadow-sm border">
                <div class="col-lg-6 order-lg-2">
                    <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-3">
                        <i class="bi bi-calendar-event me-1"></i> Visites Guidées, Ateliers & Sorties
                    </span>
                    <h2 class="fw-bold mb-3">Les Événements & Activités Encadrées</h2>
                    <p class="text-muted mb-3">
                        Les <strong>événements</strong> regroupent des rendez-vous ponctuels ou planifiés — visites guidées historiques, ateliers d'artisanat traditionnel et sorties nature — organisés à une date et une heure précises.
                    </p>
                    <p class="text-muted mb-4">
                        Encadrés par des guides et acteurs locaux avec un nombre de places défini, ils vous permettent de vivre une expérience culturelle ou écologique immersive et de réserver votre place en ligne.
                    </p>
                    <button class="btn btn-warning text-dark px-4 py-2 rounded-pill fw-bold" onclick="navigateTo('evenements')">
                        Voir la liste des événements <i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
                <div class="col-lg-6 order-lg-1">
                    <img src="/img/marche1.png" alt="Événements, artisanat et visites en Casamance" class="img-fluid rounded-4 shadow-lg w-100" style="height: 360px; object-fit: cover;">
                </div>
            </div>

            <div class="text-center mb-5">
                <h2 class="fw-bold"><i class="bi bi-grid-fill text-warning me-2"></i>Catalogue Complet de Nos Sites Patrimoniaux</h2>
                <p class="text-muted">Consultez les tarifs des billets et réservez votre visite.</p>
            </div>

            <div class="row g-4 mb-5">
                ${sites.map(site => `
                    <div class="col-md-3">
                        <div class="card card-site h-100 shadow-sm border-0 rounded-4 overflow-hidden" onclick="navigateTo('site-detail', ${site.id})" style="cursor: pointer;">
                            <div class="position-relative">
                                <img src="${site.imageUrl}" class="card-img-top" alt="${site.nomPatrimoine}" style="height: 200px; object-fit: cover;">
                                <span class="badge bg-dark bg-opacity-75 position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill">${site.ville}</span>
                            </div>
                            <div class="card-body d-flex flex-column p-4">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-primary bg-opacity-10 text-primary fw-bold px-2 py-1 rounded">${site.typePatrimoine}</span>
                                    <span class="badge bg-success fw-bold">${formatFcfa(site.prixBillet)}</span>
                                </div>
                                <h5 class="card-title fw-bold text-dark mb-2">${site.nomPatrimoine}</h5>
                                <p class="card-text text-muted small flex-grow-1 mb-3">${String(site.descriptionPatrimoine || '').substring(0, 85)}...</p>
                                <button class="btn btn-sm btn-outline-primary rounded-pill w-100 mt-auto fw-bold">Voir les détails & Réserver</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- DESCRIPTION DES RÔLES : VISITEUR, TOURISTE & GUIDE -->
            <div class="bg-white p-4 p-lg-5 rounded-4 shadow-sm border">
                <div class="text-center mb-4">
                    <span class="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-1 rounded-pill mb-2">Profils & Accès</span>
                    <h2 class="fw-bold mb-2">Quel est votre profil sur la plateforme ?</h2>
                    <p class="text-muted mx-auto mb-0" style="max-width: 720px;">
                        Que vous veniez simplement découvrir la Casamance, réserver vos billets ou accompagner des voyageurs en tant que guide, choisissez le rôle qui correspond à votre besoin.
                    </p>
                </div>

                <div class="row g-4">
                    <!-- RÔLE VISITEUR -->
                    <div class="col-md-4">
                        <div class="card h-100 border rounded-4 p-4 shadow-sm d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-secondary px-3 py-2 rounded-pill"><i class="bi bi-eye me-1"></i> Visiteur</span>
                            </div>
                            <h4 class="fw-bold mb-2">Vous êtes Visiteur ?</h4>
                            <p class="text-muted small mb-3">
                                Vous souhaitez explorer librement le catalogue des sites patrimoniaux, consulter les tarifs en FCFA, découvrir les 3 circuits et repérer les événements sans contrainte.
                            </p>
                            <p class="small fw-semibold text-dark mb-3">
                                Tu es visiteur et tu veux parcourir le patrimoine et les circuits ?
                            </p>
                            <div class="mt-auto d-flex flex-column gap-2">
                                <button class="btn btn-outline-secondary rounded-pill fw-bold" onclick="navigateTo('sites')">
                                    Explorer les sites
                                </button>
                                <button class="btn btn-outline-primary btn-sm rounded-pill" onclick="navigateTo('register')">
                                    Créer un compte si vous voulez réserver
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- RÔLE TOURISTE -->
                    <div class="col-md-4">
                        <div class="card h-100 border border-primary rounded-4 p-4 shadow-sm d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-primary px-3 py-2 rounded-pill"><i class="bi bi-ticket-perforated me-1"></i> Touriste</span>
                            </div>
                            <h4 class="fw-bold mb-2">Vous êtes Touriste ?</h4>
                            <p class="text-muted small mb-3">
                                Vous voulez réserver des billets pour un site, un circuit ou un événement, calculer le montant total et retrouver tous vos billets avec leur QR code dans votre espace personnel.
                            </p>
                            <p class="small fw-semibold text-primary mb-3">
                                Tu es touriste et tu veux réserver tes billets et garder tes QR codes ?
                            </p>
                            <div class="mt-auto d-flex flex-column gap-2">
                                <button class="btn btn-primary rounded-pill fw-bold" onclick="navigateTo('register')">
                                    Créer un compte Touriste
                                </button>
                                <button class="btn btn-outline-primary btn-sm rounded-pill" onclick="navigateTo('login')">
                                    Déjà inscrit ? Se connecter
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- RÔLE GUIDE -->
                    <div class="col-md-4">
                        <div class="card h-100 border border-success rounded-4 p-4 shadow-sm d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-success px-3 py-2 rounded-pill"><i class="bi bi-person-badge me-1"></i> Guide Touristique</span>
                            </div>
                            <h4 class="fw-bold mb-2">Vous êtes Guide ?</h4>
                            <p class="text-muted small mb-3">
                                Vous souhaitez faire valoriser votre numéro de licence professionnelle, présenter votre biographie et votre spécialité en Casamance, et accéder à votre espace guide.
                            </p>
                            <p class="small fw-semibold text-success mb-3">
                                Tu es guide et tu veux enregistrer ta licence et ta biographie ?
                            </p>
                            <div class="mt-auto d-flex flex-column gap-2">
                                <button class="btn btn-success rounded-pill fw-bold" onclick="navigateTo('register')">
                                    Créer un compte Guide
                                </button>
                                <button class="btn btn-outline-success btn-sm rounded-pill" onclick="navigateTo('login')">
                                    Accéder à mon espace Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSitesView() {
    const sites = AppState.sites.length > 0 ? AppState.sites : DEFAULT_SITES;
    return `
        <div class="container py-4">
            <h2 class="fw-bold mb-4"><i class="bi bi-geo-alt text-danger me-2"></i>Tous les Sites & Monuments</h2>
            <div class="row g-4">
                ${sites.map(site => `
                    <div class="col-md-4">
                        <div class="card card-site h-100 shadow-sm border-0 rounded-4 overflow-hidden" onclick="navigateTo('site-detail', ${site.id})" style="cursor: pointer;">
                            <img src="${site.imageUrl}" class="card-img-top" alt="${site.nomPatrimoine}" style="height: 220px; object-fit: cover;">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-secondary">${site.ville}</span>
                                    <span class="badge bg-success fs-6">${formatFcfa(site.prixBillet)} / billet</span>
                                </div>
                                <h5 class="fw-bold">${site.nomPatrimoine}</h5>
                                <p class="text-muted small">${site.descriptionPatrimoine}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function updateReservationTotal(prixUnitaire) {
    const places = Math.max(1, parseInt(document.getElementById('resPlaces')?.value || '1', 10));
    const el = document.getElementById('resTotalDisplay');
    if (el) el.textContent = formatFcfa(places * prixUnitaire);
}

function renderSiteDetailView(siteId) {
    const sites = AppState.sites.length > 0 ? AppState.sites : DEFAULT_SITES;
    const site = sites.find(s => s.id == siteId) || sites[0];
    const u = AppState.currentUser;
    const prix = Number(site.prixBillet || 2000);

    return `
        <div class="container py-4">
            <button class="btn btn-outline-secondary btn-sm mb-4" onclick="navigateTo('sites')"><i class="bi bi-arrow-left"></i> Retour</button>
            <div class="row g-4">
                <div class="col-md-7">
                    <img src="${site.imageUrl}" class="img-fluid rounded-4 shadow-sm mb-3 w-100" style="max-height: 400px; object-fit: cover;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${site.typePatrimoine}</span>
                        <span class="badge bg-success fs-6 px-3 py-2">Tarif du billet : ${formatFcfa(prix)}</span>
                    </div>
                    <h1 class="fw-bold">${site.nomPatrimoine}</h1>
                    <p class="text-muted">${site.descriptionPatrimoine}</p>
                    <p><strong>Historique :</strong> ${site.historiquePatrimoine}</p>
                    <p><strong>Adresse :</strong> ${site.adressePatrimoine} (${site.ville}) • <strong>Horaires :</strong> ${site.horaires}</p>
                </div>
                <div class="col-md-5">
                    <div class="card border-0 shadow-sm p-4 rounded-4">
                        <h4 class="fw-bold mb-3"><i class="bi bi-ticket-perforated text-primary me-2"></i>Réserver des billets</h4>
                        <form onsubmit="handleReservationSubmit(event, 'SITE', ${site.id}, '${String(site.nomPatrimoine).replace(/'/g, "\\'")}', ${prix})">
                            <div class="mb-3">
                                <label class="form-label">Nom complet du visiteur</label>
                                <input type="text" id="resName" class="form-control" required value="${u ? `${u.prenom || ''} ${u.nom || ''}`.trim() : ''}" placeholder="Prénom et Nom">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Adresse Email</label>
                                <input type="email" id="resEmail" class="form-control" required value="${u ? (u.email || '') : ''}" placeholder="visiteur@exemple.sn">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Numéro de téléphone</label>
                                <input type="tel" id="resPhone" class="form-control" required value="${u ? (u.telephone || '') : ''}" placeholder="+221 77 ...">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Date de visite</label>
                                <input type="date" id="resDate" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nombre de billets (${formatFcfa(prix)} / place)</label>
                                <input type="number" id="resPlaces" class="form-control" min="1" max="${site.capacitePatrimoine || 50}" value="1" required oninput="updateReservationTotal(${prix})">
                            </div>
                            <div class="alert alert-light border d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-semibold">Montant total :</span>
                                <strong id="resTotalDisplay" class="text-success fs-5">${formatFcfa(prix)}</strong>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 py-2 fw-bold rounded-pill">Valider la réservation</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonction générique de réservation (SITE, CIRCUIT ou EVENEMENT)
async function createBooking({ typeReservation, referenceId, titreOffre, prixUnitaire, nomClient, email, telephone, dateVisite, nombrePlaces }) {
    const unitPrice = Number(prixUnitaire || 0);
    const places = Math.max(1, parseInt(nombrePlaces, 10) || 1);
    const montantTotal = places * unitPrice;
    const u = AppState.currentUser;

    const payload = {
        typeReservation,
        referenceId,
        titreOffre,
        touristeId: u ? u.id : null,
        nomClient,
        email: String(email || '').trim().toLowerCase(),
        telephone,
        dateVisite,
        nombrePlaces: places,
        prixUnitaire: unitPrice,
        montantTotal
    };

    const result = await apiPost('reservations', payload, () => ({
        id: Date.now(),
        ...payload,
        statut: "CONFIRMEE",
        qrCodeHash: "TKT-" + Math.random().toString(36).substring(2, 10).toUpperCase()
    }));

    const savedRes = {
        ...payload,
        ...(typeof result.data === 'object' && result.data !== null ? result.data : {}),
        montantTotal: result.data?.montantTotal ?? montantTotal,
        prixUnitaire: result.data?.prixUnitaire ?? unitPrice,
        statut: result.data?.statut || "CONFIRMEE",
        qrCodeHash: result.data?.qrCodeHash || ("TKT-" + Math.random().toString(36).substring(2, 10).toUpperCase())
    };

    AppState.reservations.unshift(savedRes);
    saveReservations();
    showToast(`Réservation confirmée (${formatFcfa(savedRes.montantTotal)}).`, "success");

    if (u && u.role === 'TOURIST') navigateTo('mes-reservations');
    else if (u && u.role === 'ADMIN') navigateTo('conservateur');
    else navigateTo('home');
}

async function handleReservationSubmit(event, typeReservation, referenceId, titreOffre, prixUnitaire) {
    event.preventDefault();
    await createBooking({
        typeReservation,
        referenceId,
        titreOffre,
        prixUnitaire,
        nomClient: document.getElementById('resName').value.trim(),
        email: document.getElementById('resEmail').value.trim(),
        telephone: document.getElementById('resPhone').value.trim(),
        dateVisite: document.getElementById('resDate').value,
        nombrePlaces: document.getElementById('resPlaces').value
    });
}

// --------------------------------------------------------------------------
// RÉSERVER UN CIRCUIT (3 CIRCUITS RÉELS)
// --------------------------------------------------------------------------
function updateCircuitTotal(circuitId, prixUnitaire) {
    const places = Math.max(1, parseInt(document.getElementById(`circuitPlaces-${circuitId}`)?.value || '1', 10));
    const el = document.getElementById(`circuitTotal-${circuitId}`);
    if (el) el.textContent = formatFcfa(places * prixUnitaire);
}

async function reserverCircuit(event, circuitId) {
    event.preventDefault();
    const circuits = AppState.circuits.length > 0 ? AppState.circuits : DEFAULT_CIRCUITS;
    const circuit = circuits.find(c => c.id == circuitId);
    if (!circuit) return;

    await createBooking({
        typeReservation: 'CIRCUIT',
        referenceId: circuit.id,
        titreOffre: circuit.nomCircuit,
        prixUnitaire: Number(circuit.prixBillet || 0),
        nomClient: document.getElementById(`circuitName-${circuit.id}`).value.trim(),
        email: document.getElementById(`circuitEmail-${circuit.id}`).value.trim(),
        telephone: document.getElementById(`circuitPhone-${circuit.id}`).value.trim(),
        dateVisite: document.getElementById(`circuitDate-${circuit.id}`).value,
        nombrePlaces: document.getElementById(`circuitPlaces-${circuit.id}`).value
    });
}

function renderCircuitsView() {
    const circuits = AppState.circuits.length > 0 ? AppState.circuits : DEFAULT_CIRCUITS;
    const u = AppState.currentUser;

    return `
        <div class="container py-4">
            <h2 class="fw-bold mb-2"><i class="bi bi-map text-success me-2"></i>Circuits Touristiques en Casamance</h2>
            <p class="text-muted mb-4">Choisissez un circuit et réservez vos places directement.</p>
            <div class="row g-4">
                ${circuits.map(c => {
                    const prix = Number(c.prixBillet || 0);
                    const etapesTexte = Array.isArray(c.etapes) ? c.etapes.join(' → ') : '';
                    return `
                        <div class="col-md-4">
                            <div class="card shadow-sm border-0 p-4 rounded-4 h-100 d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-success">${c.difficulte}</span>
                                    <span class="badge bg-primary fs-6">${formatFcfa(prix)} / pers.</span>
                                </div>
                                <h4 class="fw-bold text-primary">${c.nomCircuit}</h4>
                                <p class="text-muted small">${c.descriptionCircuit}</p>
                                ${etapesTexte ? `<p class="small"><strong>Étapes :</strong> ${etapesTexte}</p>` : ''}
                                <p class="small text-secondary mb-3">Durée : ${c.dureeTotale} min • Distance : ${c.distanceTotale} km • Max : ${c.capaciteMax} pers.</p>

                                <form onsubmit="reserverCircuit(event, ${c.id})" class="mt-auto border-top pt-3">
                                    <h6 class="fw-bold mb-2"><i class="bi bi-ticket-perforated me-1 text-success"></i>Réserver ce circuit</h6>
                                    <div class="mb-2">
                                        <input type="text" id="circuitName-${c.id}" class="form-control form-control-sm" required value="${u ? `${u.prenom || ''} ${u.nom || ''}`.trim() : ''}" placeholder="Nom complet">
                                    </div>
                                    <div class="mb-2">
                                        <input type="email" id="circuitEmail-${c.id}" class="form-control form-control-sm" required value="${u ? (u.email || '') : ''}" placeholder="Adresse email">
                                    </div>
                                    <div class="mb-2">
                                        <input type="tel" id="circuitPhone-${c.id}" class="form-control form-control-sm" required value="${u ? (u.telephone || '') : ''}" placeholder="Téléphone (+221 ...)">
                                    </div>
                                    <div class="row g-2 mb-2">
                                        <div class="col-6">
                                            <input type="date" id="circuitDate-${c.id}" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-6">
                                            <input type="number" id="circuitPlaces-${c.id}" class="form-control form-control-sm" min="1" max="${c.capaciteMax || 25}" value="1" required oninput="updateCircuitTotal(${c.id}, ${prix})">
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center small mb-2 px-1">
                                        <span>Total :</span>
                                        <strong id="circuitTotal-${c.id}" class="text-success fs-6">${formatFcfa(prix)}</strong>
                                    </div>
                                    <button type="submit" class="btn btn-success btn-sm w-100 py-2 fw-bold rounded-pill">Réserver le circuit</button>
                                </form>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// --------------------------------------------------------------------------
// RÉSERVER UNE PLACE POUR UN ÉVÉNEMENT (3 ÉVÉNEMENTS RÉELS)
// --------------------------------------------------------------------------
function updateEvenementTotal(evenementId, prixPlace) {
    const places = Math.max(1, parseInt(document.getElementById(`evtPlaces-${evenementId}`)?.value || '1', 10));
    const el = document.getElementById(`evtTotal-${evenementId}`);
    if (el) el.textContent = formatFcfa(places * prixPlace);
}

async function reserverPlaceEvenement(event, evenementId) {
    event.preventDefault();
    const evenements = AppState.evenements.length > 0 ? AppState.evenements : DEFAULT_EVENEMENTS;
    const evt = evenements.find(e => e.id == evenementId);
    if (!evt) return;

    const placesDemandees = Math.max(1, parseInt(document.getElementById(`evtPlaces-${evt.id}`).value, 10) || 1);
    const dispo = Number(evt.placesDisponibles ?? 20);
    if (placesDemandees > dispo) {
        showToast(`Il ne reste que ${dispo} place(s) disponible(s) pour cet événement.`, "warning");
        return;
    }

    await createBooking({
        typeReservation: 'EVENEMENT',
        referenceId: evt.id,
        titreOffre: evt.titre,
        prixUnitaire: Number(evt.prixPlace || 0),
        nomClient: document.getElementById(`evtName-${evt.id}`).value.trim(),
        email: document.getElementById(`evtEmail-${evt.id}`).value.trim(),
        telephone: document.getElementById(`evtPhone-${evt.id}`).value.trim(),
        dateVisite: document.getElementById(`evtDate-${evt.id}`).value || evt.dateEvenement,
        nombrePlaces: placesDemandees
    });

    evt.placesDisponibles = Math.max(0, dispo - placesDemandees);
    saveEvenements();
}

function renderEvenementsView() {
    const evenements = AppState.evenements.length > 0 ? AppState.evenements : DEFAULT_EVENEMENTS;
    const u = AppState.currentUser;

    return `
        <div class="container py-4">
            <h2 class="fw-bold mb-2"><i class="bi bi-calendar-event text-warning me-2"></i>Événements, Visites Guidées & Ateliers</h2>
            <p class="text-muted mb-4">Réservez une place pour une visite guidée, un atelier artisanal ou une sortie nature.</p>
            <div class="row g-4">
                ${evenements.map(evt => {
                    const prix = Number(evt.prixPlace || 0);
                    const dispo = Number(evt.placesDisponibles ?? 15);
                    return `
                        <div class="col-md-4">
                            <div class="card shadow-sm border-0 p-4 rounded-4 h-100 d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-warning text-dark">${evt.typeEvenement}</span>
                                    <span class="badge bg-primary fs-6">${formatFcfa(prix)} / place</span>
                                </div>
                                <h4 class="fw-bold text-dark">${evt.titre}</h4>
                                <p class="text-muted small">${evt.description}</p>
                                <p class="small mb-1"><strong>Lieu :</strong> ${evt.lieu}</p>
                                <p class="small mb-1"><strong>Date & Heure :</strong> ${evt.dateEvenement} à ${evt.heureDebut || '09h00'}</p>
                                <p class="small text-secondary mb-3"><strong>Guide :</strong> ${evt.guideAssigne || 'Guide certifié'} • <strong>Places restantes :</strong> ${dispo}</p>

                                <form onsubmit="reserverPlaceEvenement(event, ${evt.id})" class="mt-auto border-top pt-3">
                                    <h6 class="fw-bold mb-2"><i class="bi bi-person-check me-1 text-primary"></i>Réserver une place</h6>
                                    <div class="mb-2">
                                        <input type="text" id="evtName-${evt.id}" class="form-control form-control-sm" required value="${u ? `${u.prenom || ''} ${u.nom || ''}`.trim() : ''}" placeholder="Nom complet">
                                    </div>
                                    <div class="mb-2">
                                        <input type="email" id="evtEmail-${evt.id}" class="form-control form-control-sm" required value="${u ? (u.email || '') : ''}" placeholder="Adresse email">
                                    </div>
                                    <div class="mb-2">
                                        <input type="tel" id="evtPhone-${evt.id}" class="form-control form-control-sm" required value="${u ? (u.telephone || '') : ''}" placeholder="Téléphone (+221 ...)">
                                    </div>
                                    <div class="row g-2 mb-2">
                                        <div class="col-6">
                                            <input type="date" id="evtDate-${evt.id}" class="form-control form-control-sm" required value="${evt.dateEvenement || ''}">
                                        </div>
                                        <div class="col-6">
                                            <input type="number" id="evtPlaces-${evt.id}" class="form-control form-control-sm" min="1" max="${Math.max(1, dispo)}" value="1" required oninput="updateEvenementTotal(${evt.id}, ${prix})">
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center small mb-2 px-1">
                                        <span>Total :</span>
                                        <strong id="evtTotal-${evt.id}" class="text-success fs-6">${formatFcfa(prix)}</strong>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-sm w-100 py-2 fw-bold rounded-pill" ${dispo <= 0 ? 'disabled' : ''}>
                                        ${dispo <= 0 ? 'Complet' : 'Réserver ma place'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// --------------------------------------------------------------------------
// ESPACES AUTHENTIFIÉS (TOURISTE, GUIDE, CONSERVATEUR/ADMIN, LOGIN, REGISTER)
// --------------------------------------------------------------------------
function renderTouristeReservationsView() {
    const u = AppState.currentUser;
    if (!u || u.role !== 'TOURIST') {
        return `
            <div class="container py-5 text-center">
                <div class="alert alert-warning shadow-sm p-4 d-inline-block rounded-4">
                    <h4>Accès réservé aux touristes</h4>
                    <p>Veuillez vous connecter avec un compte touriste pour consulter vos billets.</p>
                    <button class="btn btn-primary btn-sm" onclick="navigateTo('login')">Se connecter</button>
                </div>
            </div>
        `;
    }

    const mine = AppState.reservations.filter(
        r => r.touristeId === u.id || (r.email && r.email.toLowerCase() === u.email.toLowerCase())
    );

    return `
        <div class="container py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold mb-0"><i class="bi bi-ticket-perforated text-primary me-2"></i>Mes Réservations & Billets</h2>
                <button class="btn btn-outline-danger btn-sm" onclick="logout()">Déconnexion</button>
            </div>
            ${mine.length === 0 ? `<div class="alert alert-info">Vous n'avez pas encore de réservation.</div>` : `
                <div class="row g-4">
                    ${mine.map(r => `
                        <div class="col-md-6">
                            <div class="card shadow-sm border-0 p-4 rounded-4">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-info text-dark">${r.typeReservation || 'SITE'}</span>
                                    <span class="badge ${r.statut === 'CONFIRMEE' ? 'bg-success' : 'bg-secondary'}">${r.statut}</span>
                                    <span class="fw-bold text-primary fs-5">${formatFcfa(r.montantTotal)}</span>
                                </div>
                                <h5 class="fw-bold">${r.titreOffre || `${r.typeReservation} #${r.referenceId}`}</h5>
                                <p class="text-muted small mb-1">Titulaire : <strong>${r.nomClient}</strong> • ${r.email} • ${r.telephone || ''}</p>
                                <p class="text-muted small mb-1">Date : <strong>${r.dateVisite}</strong> • ${r.nombrePlaces} place(s) à ${formatFcfa(r.prixUnitaire)}</p>
                                <div class="text-center bg-light p-3 rounded mt-3">
                                    ${generateQrCodeSvg(r.qrCodeHash)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}

function renderGuideView() {
    const u = AppState.currentUser;
    if (!u || u.role !== 'GUIDE') {
        return `
            <div class="container py-5 text-center">
                <div class="alert alert-warning shadow-sm p-4 d-inline-block rounded-4">
                    <h4>Accès réservé aux guides</h4>
                    <p>Veuillez vous connecter avec un compte guide touristique.</p>
                    <button class="btn btn-success btn-sm" onclick="navigateTo('login')">Se connecter</button>
                </div>
            </div>
        `;
    }

    const details = u.guideDetails || { numeroLicence: "N/A", biographie: "", noteMoyenne: 5.0, estVerifie: false };

    return `
        <div class="container py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold mb-0"><i class="bi bi-person-badge text-success me-2"></i>Espace Guide : ${u.prenom || ''} ${u.nom || ''}</h2>
                <button class="btn btn-outline-danger btn-sm" onclick="logout()">Déconnexion</button>
            </div>
            <div class="card shadow-sm border-0 p-4 rounded-4">
                <span class="badge ${details.estVerifie ? 'bg-success' : 'bg-warning text-dark'} mb-3 align-self-start">
                    ${details.estVerifie ? 'Guide Vérifié & Certifié' : 'En attente de validation'}
                </span>
                <p><strong>Email :</strong> ${u.email} • <strong>Téléphone :</strong> ${u.telephone || 'Non renseigné'}</p>
                <p><strong>Numéro de licence :</strong> ${details.numeroLicence}</p>
                <p class="mb-0"><strong>Biographie :</strong> ${details.biographie}</p>
            </div>
        </div>
    `;
}

async function updateReservationStatus(resId, newStatut) {
    try {
        await fetch(`${API_CONFIG.gatewayUrl}/api/reservations/${resId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(true),
            body: JSON.stringify({ statut: newStatut })
        });
    } catch (_) {
        // Repli local
    }
    const target = AppState.reservations.find(r => r.id === resId);
    if (target) {
        target.statut = newStatut;
        saveReservations();
        showToast(`Réservation #${resId} passée à ${newStatut}.`, "info");
        renderApp();
    }
}

async function handleGuideVerification(userId, estVerifie) {
    try {
        await fetch(`${API_CONFIG.gatewayUrl}/api/guides/${userId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(true),
            body: JSON.stringify({ estVerifie })
        });
    } catch (_) {
        // Repli local
    }
    const target = AppState.users.find(u => u.id === userId) || AppState.guides.find(g => g.id === userId);
    if (target) {
        target.guideDetails = target.guideDetails || { numeroLicence: "GUIDE-CAS-2026", biographie: "", noteMoyenne: 5.0 };
        target.guideDetails.estVerifie = estVerifie;
        saveUsers();
    }
    showToast(estVerifie ? "Compte guide validé." : "Compte guide refusé.", estVerifie ? "success" : "warning");
    renderApp();
}

function startEditSite(siteId) {
    AppState.editingSiteId = siteId;
    renderApp();
}

function cancelEditSite() {
    AppState.editingSiteId = null;
    renderApp();
}

async function handleSiteSave(event) {
    event.preventDefault();
    const editId = AppState.editingSiteId;
    const payload = {
        nomPatrimoine: document.getElementById('siteNom').value.trim(),
        codePatrimoine: document.getElementById('siteCode').value.trim() || `PMZ${Date.now().toString().slice(-3)}`,
        typePatrimoine: document.getElementById('siteType').value,
        ville: document.getElementById('siteVille').value.trim(),
        adressePatrimoine: document.getElementById('siteAdresse').value.trim(),
        horaires: document.getElementById('siteHoraires').value.trim(),
        capacitePatrimoine: parseInt(document.getElementById('siteCapacite').value, 10) || 50,
        prixBillet: parseInt(document.getElementById('sitePrix').value, 10) || 0,
        latitudePatrimoine: parseFloat(document.getElementById('siteLat').value) || 12.5605,
        longitudePatrimoine: parseFloat(document.getElementById('siteLng').value) || -16.2719,
        imageUrl: document.getElementById('siteMediaUrl').value.trim() || "/img/casamance.png",
        descriptionPatrimoine: document.getElementById('siteDesc').value.trim(),
        historiquePatrimoine: document.getElementById('siteHist').value.trim()
    };

    try {
        const url = editId
            ? `${API_CONFIG.gatewayUrl}/api/patrimoines/${editId}`
            : `${API_CONFIG.gatewayUrl}/api/patrimoines`;
        const res = await fetch(url, {
            method: editId ? 'PUT' : 'POST',
            headers: getAuthHeaders(true),
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const saved = await res.json();
            if (editId) {
                AppState.sites = AppState.sites.map(s => s.id === editId ? { ...s, ...saved, ...payload } : s);
            } else {
                AppState.sites.push({ id: saved.id || Date.now(), ...payload });
            }
            AppState.editingSiteId = null;
            saveSites();
            showToast(editId ? "Site mis à jour." : "Nouveau site ajouté.", "success");
            renderApp();
            return;
        }
    } catch (_) {
        // Repli local
    }

    if (editId) {
        AppState.sites = AppState.sites.map(s => s.id === editId ? { ...s, ...payload } : s);
    } else {
        AppState.sites.push({ id: Date.now(), ...payload });
    }
    AppState.editingSiteId = null;
    saveSites();
    showToast(editId ? "Site mis à jour." : "Nouveau site ajouté.", "success");
    renderApp();
}

async function handleSiteDelete(siteId) {
    try {
        await fetch(`${API_CONFIG.gatewayUrl}/api/patrimoines/${siteId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(false)
        });
    } catch (_) {
        // Repli local
    }
    AppState.sites = AppState.sites.filter(s => s.id !== siteId);
    if (AppState.editingSiteId === siteId) AppState.editingSiteId = null;
    saveSites();
    showToast("Site supprimé.", "info");
    renderApp();
}

async function handleSignalementDecision(sigId, decision) {
    try {
        await fetch(`${API_CONFIG.gatewayUrl}/api/signalements/${sigId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(true),
            body: JSON.stringify({ decision })
        });
    } catch (_) {
        // Repli local
    }
    const sig = AppState.signalements.find(item => item.id === sigId);
    if (sig) {
        sig.statut = decision === 'SUPPRIMER_AVIS' ? 'AVIS_SUPPRIME' : 'REJETE';
    }
    saveSignalements();
    showToast(
        decision === 'SUPPRIMER_AVIS' ? "Avis supprimé suite au signalement." : "Signalement rejeté.",
        "info"
    );
    renderApp();
}

function renderConservateurView() {
    const u = AppState.currentUser;
    if (!u || u.role !== 'ADMIN') {
        return `
            <div class="container py-5 text-center">
                <div class="alert alert-danger shadow-sm p-4 d-inline-block rounded-4">
                    <h4>Accès réservé au conservateur</h4>
                    <p>Veuillez vous connecter avec un compte administrateur pour consulter les réservations et gérer la plateforme.</p>
                    <button class="btn btn-dark btn-sm" onclick="navigateTo('login')">Se connecter</button>
                </div>
            </div>
        `;
    }

    const totalRevenus = AppState.reservations
        .filter(r => r.statut !== 'ANNULEE')
        .reduce((acc, r) => acc + Number(r.montantTotal || 0), 0);

    const guidesList = AppState.users.filter(item => item.role === 'GUIDE');
    const editingSite = AppState.editingSiteId
        ? AppState.sites.find(s => s.id === AppState.editingSiteId) || null
        : null;

    return `
        <div class="container py-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="fw-bold mb-1"><i class="bi bi-speedometer2 text-danger me-2"></i>Espace Conservateur</h2>
                    <p class="text-muted mb-0">Réservations & visiteurs, validation des guides, CRUD des sites/médias/tarifs et modération.</p>
                </div>
                <button class="btn btn-outline-danger btn-sm" onclick="logout()">Déconnexion</button>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="card shadow-sm border-0 p-4 rounded-4 bg-primary text-white">
                        <h3>${AppState.reservations.length}</h3>
                        <p class="mb-0">Réservations</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow-sm border-0 p-4 rounded-4 bg-success text-white">
                        <h3>${formatFcfa(totalRevenus)}</h3>
                        <p class="mb-0">Recettes billets</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow-sm border-0 p-4 rounded-4 bg-dark text-white">
                        <h3>${AppState.sites.length}</h3>
                        <p class="mb-0">Sites patrimoniaux</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow-sm border-0 p-4 rounded-4 bg-warning text-dark">
                        <h3>${AppState.signalements.filter(s => s.statut === 'EN_ATTENTE').length}</h3>
                        <p class="mb-0">Signalements en attente</p>
                    </div>
                </div>
            </div>

            <!-- 1. RESERVATIONS & INFORMATIONS COMPLETES DES VISITEURS -->
            <div class="card shadow-sm border-0 p-4 rounded-4 mb-4">
                <h4 class="fw-bold mb-3"><i class="bi bi-people-fill text-primary me-2"></i>Réservations & Informations des Visiteurs</h4>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Billet</th>
                                <th>Qui a réservé</th>
                                <th>Email & Téléphone</th>
                                <th>Type & Offre</th>
                                <th>Date</th>
                                <th>Places & Tarif</th>
                                <th>Prix Total</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppState.reservations.map(r => `
                                <tr>
                                    <td><code>${r.qrCodeHash}</code></td>
                                    <td><strong>${r.nomClient}</strong></td>
                                    <td class="small">
                                        <div>${r.email}</div>
                                        <div class="text-muted">${r.telephone || 'Non renseigné'}</div>
                                    </td>
                                    <td><span class="badge bg-info text-dark me-1">${r.typeReservation || 'SITE'}</span>${r.titreOffre || `#${r.referenceId}`}</td>
                                    <td>${r.dateVisite}</td>
                                    <td>${r.nombrePlaces} × ${formatFcfa(r.prixUnitaire)}</td>
                                    <td class="fw-bold text-success">${formatFcfa(r.montantTotal)}</td>
                                    <td><span class="badge ${r.statut === 'CONFIRMEE' ? 'bg-success' : 'bg-secondary'}">${r.statut}</span></td>
                                    <td>
                                        ${r.statut !== 'ANNULEE'
                                            ? `<button class="btn btn-sm btn-outline-danger" onclick="updateReservationStatus(${r.id}, 'ANNULEE')">Annuler</button>`
                                            : `<button class="btn btn-sm btn-outline-success" onclick="updateReservationStatus(${r.id}, 'CONFIRMEE')">Confirmer</button>`}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 2. VALIDATION DES COMPTES GUIDES -->
            <div class="card shadow-sm border-0 p-4 rounded-4 mb-4">
                <h4 class="fw-bold mb-3"><i class="bi bi-award text-success me-2"></i>Validation des Comptes Guides</h4>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Guide</th>
                                <th>Contact</th>
                                <th>Licence</th>
                                <th>Biographie</th>
                                <th>Statut</th>
                                <th>Décision</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${guidesList.map(g => {
                                const gd = g.guideDetails || {};
                                return `
                                    <tr>
                                        <td><strong>${g.prenom || ''} ${g.nom || ''}</strong></td>
                                        <td class="small">${g.email}<br><span class="text-muted">${g.telephone || ''}</span></td>
                                        <td><code>${gd.numeroLicence || 'N/A'}</code></td>
                                        <td class="small">${gd.biographie || ''}</td>
                                        <td><span class="badge ${gd.estVerifie ? 'bg-success' : 'bg-warning text-dark'}">${gd.estVerifie ? 'Vérifié' : 'En attente'}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-success me-1" onclick="handleGuideVerification(${g.id}, true)">Valider</button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="handleGuideVerification(${g.id}, false)">Refuser</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 3. CRUD SITES, MEDIAS & PRIX DES BILLETS -->
            <div class="card shadow-sm border-0 p-4 rounded-4 mb-4">
                <h4 class="fw-bold mb-3"><i class="bi bi-building text-dark me-2"></i>${editingSite ? `Modifier le site #${editingSite.id}` : 'Ajouter un site patrimonial & tarif'}</h4>
                <form onsubmit="handleSiteSave(event)" class="row g-3 mb-4">
                    <div class="col-md-4">
                        <label class="form-label">Nom du site</label>
                        <input type="text" id="siteNom" class="form-control" required value="${editingSite?.nomPatrimoine || ''}">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Code</label>
                        <input type="text" id="siteCode" class="form-control" value="${editingSite?.codePatrimoine || ''}" placeholder="PMZ009">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Type</label>
                        <select id="siteType" class="form-select">
                            <option value="MUSEE" ${editingSite?.typePatrimoine === 'MUSEE' ? 'selected' : ''}>MUSEE</option>
                            <option value="MONUMENT" ${editingSite?.typePatrimoine === 'MONUMENT' ? 'selected' : ''}>MONUMENT</option>
                            <option value="SITE_NATUREL" ${editingSite?.typePatrimoine === 'SITE_NATUREL' ? 'selected' : ''}>SITE_NATUREL</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Prix du billet (FCFA)</label>
                        <input type="number" id="sitePrix" class="form-control" min="0" required value="${editingSite?.prixBillet ?? 2000}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Ville</label>
                        <input type="text" id="siteVille" class="form-control" required value="${editingSite?.ville || 'Ziguinchor'}">
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Adresse</label>
                        <input type="text" id="siteAdresse" class="form-control" required value="${editingSite?.adressePatrimoine || ''}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Horaires</label>
                        <input type="text" id="siteHoraires" class="form-control" required value="${editingSite?.horaires || 'Lun - Dim : 08h00 - 18h00'}">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Capacité</label>
                        <input type="number" id="siteCapacite" class="form-control" min="1" value="${editingSite?.capacitePatrimoine ?? 100}">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Latitude</label>
                        <input type="number" step="any" id="siteLat" class="form-control" value="${editingSite?.latitudePatrimoine ?? 12.5605}">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Longitude</label>
                        <input type="number" step="any" id="siteLng" class="form-control" value="${editingSite?.longitudePatrimoine ?? -16.2719}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Média (URL image / vidéo)</label>
                        <input type="text" id="siteMediaUrl" class="form-control" value="${editingSite?.imageUrl || '/img/casamance.png'}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Description</label>
                        <input type="text" id="siteDesc" class="form-control" required value="${editingSite?.descriptionPatrimoine || ''}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Historique</label>
                        <input type="text" id="siteHist" class="form-control" value="${editingSite?.historiquePatrimoine || ''}">
                    </div>
                    <div class="col-12 d-flex gap-2">
                        <button type="submit" class="btn btn-primary fw-bold">${editingSite ? 'Enregistrer modifications' : 'Ajouter le site'}</button>
                        ${editingSite ? `<button type="button" class="btn btn-outline-secondary" onclick="cancelEditSite()">Annuler</button>` : ''}
                    </div>
                </form>

                <div class="table-responsive">
                    <table class="table table-sm table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Site</th>
                                <th>Ville</th>
                                <th>Type</th>
                                <th>Billet</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppState.sites.map(s => `
                                <tr>
                                    <td><strong>${s.nomPatrimoine}</strong></td>
                                    <td>${s.ville}</td>
                                    <td><span class="badge bg-secondary">${s.typePatrimoine}</span></td>
                                    <td class="fw-bold text-success">${formatFcfa(s.prixBillet)}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="startEditSite(${s.id})">Modifier</button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="handleSiteDelete(${s.id})">Supprimer</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 4. MODERATION DES SIGNALEMENTS D'AVIS -->
            <div class="card shadow-sm border-0 p-4 rounded-4">
                <h4 class="fw-bold mb-3"><i class="bi bi-flag text-danger me-2"></i>Modération des Signalements d'Avis</h4>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Auteur / Avis</th>
                                <th>Signalé par</th>
                                <th>Motif</th>
                                <th>Statut</th>
                                <th>Décision</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppState.signalements.map(sig => `
                                <tr>
                                    <td><strong>${sig.auteurAvis}</strong><div class="small text-muted">${sig.commentaire}</div></td>
                                    <td>${sig.signalePar}</td>
                                    <td>${sig.motif}</td>
                                    <td><span class="badge bg-info text-dark">${sig.statut}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-danger me-1" onclick="handleSignalementDecision(${sig.id}, 'SUPPRIMER_AVIS')">Supprimer l'avis</button>
                                        <button class="btn btn-sm btn-outline-secondary" onclick="handleSignalementDecision(${sig.id}, 'REJETER')">Rejeter</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderLoginView() {
    return `
        <div class="container py-5" style="max-width: 450px;">
            <div class="card shadow-sm border-0 p-4 rounded-4">
                <h3 class="fw-bold text-center mb-4"><i class="bi bi-box-arrow-in-right text-primary me-2"></i>Connexion</h3>
                <form onsubmit="handleLoginSubmit(event)">
                    <div class="mb-3">
                        <label class="form-label">Adresse Email</label>
                        <input type="email" id="loginEmail" class="form-control" required placeholder="exemple@domaine.sn">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mot de passe</label>
                        <input type="password" id="loginPassword" class="form-control" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-bold rounded-pill">Se connecter</button>
                </form>
                <div class="text-center mt-3 small">
                    Pas encore de compte ? <a href="#register" onclick="navigateTo('register')">Créer un compte</a>
                </div>
            </div>
        </div>
    `;
}

function renderRegisterView() {
    return `
        <div class="container py-5" style="max-width: 500px;">
            <div class="card shadow-sm border-0 p-4 rounded-4">
                <h3 class="fw-bold text-center mb-4"><i class="bi bi-person-plus text-warning me-2"></i>Créer un compte</h3>
                <form onsubmit="handleRegisterSubmit(event)">
                    <div class="mb-3">
                        <label class="form-label">Prénom & Nom</label>
                        <input type="text" id="regName" class="form-control" required placeholder="Prénom Nom">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Adresse Email</label>
                        <input type="email" id="regEmail" class="form-control" required placeholder="nom@exemple.sn">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Téléphone</label>
                        <input type="tel" id="regPhone" class="form-control" required placeholder="+221 77 000 00 00">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Type de Compte</label>
                        <select id="regRole" class="form-select" required onchange="toggleGuideFields(this.value)">
                            <option value="TOURIST">Touriste (Visiteur / Réservations)</option>
                            <option value="GUIDE">Guide Touristique</option>
                            <option value="ADMIN">Conservateur (Administrateur)</option>
                        </select>
                    </div>
                    <div id="guideExtraFields" class="mb-3 p-3 bg-light rounded-3 d-none">
                        <label class="form-label fw-semibold text-success">Numéro de Licence Professionnelle</label>
                        <input type="text" id="regLicence" class="form-control mb-2" placeholder="Ex: GUIDE-CAS-2026-0150">
                        <label class="form-label fw-semibold text-success">Courte biographie</label>
                        <textarea id="regBio" class="form-control" rows="2" placeholder="Spécialité, langues parlées..."></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mot de passe</label>
                        <input type="password" id="regPassword" class="form-control" required minlength="6" placeholder="Minimum 6 caractères">
                    </div>
                    <button type="submit" class="btn btn-warning w-100 py-2 fw-bold text-dark rounded-pill shadow-sm">Créer mon compte</button>
                </form>
            </div>
        </div>
    `;
}

function toggleGuideFields(role) {
    const extraFields = document.getElementById('guideExtraFields');
    if (!extraFields) return;
    extraFields.classList.toggle('d-none', role !== 'GUIDE');
}

function renderFooter() {
    return `
        <footer class="bg-dark text-white text-center py-4 mt-auto">
            <div class="container">
                <p class="mb-1 fw-semibold">Plateforme de Gestion du Patrimoine Touristique - Casamance</p>
                <p class="small text-muted mb-0">Université Assane Seck de Ziguinchor • 2026</p>
            </div>
        </footer>
    `;
}

window.addEventListener('DOMContentLoaded', loadInitialData);