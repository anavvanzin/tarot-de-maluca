// ==========================================================================
// GAME STATE & CONSTANTS
// ==========================================================================

const INITIAL_GOLES = 0;
const MAX_PLAYERS = 10;
const PLAYER_AVATAR_DEFAULT_VARIANT = "classic";
const PLAYER_AVATAR_SELECTED_VARIANT = "cosmic";
const PERSONAL_ARCANA_SLUGS = {
    22: 'andressa',
    23: 'patricia',
    24: 'sabrina',
    25: 'shai',
    26: 'ana'
};
const PERSONAL_ARCANA_THEME_VARIANTS = new Set(["classic", "cosmic", "gold"]);
const PRIMARY_ASSET_DIR = 'assets';
const FALLBACK_ASSET_DIR = 'public/assets';
let activeAssetDir = PRIMARY_ASSET_DIR;

function getAssetFilename(assetPath) {
    return String(assetPath || '')
        .replace(/^\.?\//, '')
        .replace(/^public\/assets\//, '')
        .replace(/^assets\//, '');
}

function getAssetPath(assetPath) {
    const filename = getAssetFilename(assetPath);
    return filename ? `${activeAssetDir}/${filename}` : '';
}

function getFallbackAssetPath(assetPath) {
    const filename = getAssetFilename(assetPath);
    return filename ? `${FALLBACK_ASSET_DIR}/${filename}` : '';
}

function updateImageAsset(img, assetPath) {
    const filename = getAssetFilename(assetPath);
    if (!filename) return;
    img.dataset.assetFilename = filename;
    img.dataset.assetFallbackTried = 'false';
    img.src = getAssetPath(filename);
}

function handleAssetImageError(event) {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.assetFallbackTried === 'true') return;

    const filename = img.dataset.assetFilename || getAssetFilename(img.getAttribute('src'));
    if (!filename) return;

    activeAssetDir = FALLBACK_ASSET_DIR;
    img.dataset.assetFallbackTried = 'true';
    img.src = getFallbackAssetPath(filename);
}

function setBackgroundAssetImage(element, assetPath) {
    const filename = getAssetFilename(assetPath);
    if (!filename) return;

    const primaryUrl = getAssetPath(filename);
    element.style.backgroundImage = `url('${primaryUrl}')`;

    if (activeAssetDir === FALLBACK_ASSET_DIR) return;

    const probe = new Image();
    probe.onerror = () => {
        activeAssetDir = FALLBACK_ASSET_DIR;
        element.style.backgroundImage = `url('${getFallbackAssetPath(filename)}')`;
        refreshRenderedAvatarImages();
    };
    probe.src = primaryUrl;
}

document.addEventListener('error', handleAssetImageError, true);

function getPersonalArcanaSlug(card) {
    return card ? PERSONAL_ARCANA_SLUGS[card.id] : null;
}

function getPersonalArcanaVariant() {
    return PERSONAL_ARCANA_THEME_VARIANTS.has(currentTheme) ? currentTheme : "gold";
}

function getCardImagePath(card) {
    const personalSlug = getPersonalArcanaSlug(card);
    if (personalSlug) {
        return `arcana-${personalSlug}-${getPersonalArcanaVariant()}.png`;
    }
    return card?.image || "";
}

// Sound Settings
let soundEnabled = true;
let audioCtx = null;

// Game Data
const ALL_CARDS = [
    { id: 0, title: "O LOUCO", num: "0", image: "assets/arcana-fool.png", text: "viajei para outra cidade ou estado só para ver uma garota sáfica que conheci na internet na mesma semana." },
    { id: 1, title: "O MAGO", num: "I", image: null, text: "mudei meu visual inteiro (corte de cabelo radical, estilo de roupas) após um término ou por causa de um novo crush." },
    { id: 2, title: "A SACERDOTISA", num: "II", image: null, text: "fingi que não sabia fazer algo simples (como abrir um pote ou montar um móvel) só para deixar a garota fazer e parecer forte." },
    { id: 3, title: "A IMPERATRIZ", num: "III", image: null, text: "planejei o casamento inteiro, escolhi os nomes dos filhos e adotei três gatos na minha cabeça logo após o primeiro encontro." },
    { id: 4, title: "O IMPERADOR", num: "IV", image: null, text: "tentei dar uma aula professoral (uma versão feminina de mansplaining) sobre um assunto aleatório só para tentar impressionar." },
    { id: 5, title: "O HIEROFANTE", num: "V", image: null, text: "julguei silenciosamente o gosto musical, o estilo de roupa ou o mapa astral de alguma amiga desta roda." },
    { id: 6, title: "OS ENAMORADOS", num: "VI", image: null, text: "comprei um presente super elaborado ou fiz uma playlist gigante com significados ocultos para alguém com quem só saí duas vezes.", special: "Pacto de Enamorados: se exatamente duas jogadoras confessarem, elas escolhem uma terceira pessoa para beber 1 gole." },
    { id: 7, title: "O CARRO", num: "VII", image: null, text: "errei a entrada da rua ou passei do ponto fofocando tanto com as amigas que esqueci para onde estava dirigindo." },
    { id: 8, title: "A JUSTIÇA", num: "VIII", image: null, text: "peguei um ranço eterno e inabalável da ex de uma amiga próxima por pura solidariedade feminina." },
    { id: 9, title: "O EREMITA", num: "IX", image: null, text: "sumi do rolê ou cancelei de última hora para ficar isolada em casa com meus bichinhos assistindo série sáfica.", special: "Isolamento do Eremita: se voce for a unica a nao confessar, escolha alguem para beber 1 gole." },
    { id: 10, title: "A RODA DA FORTUNA", num: "X", image: null, text: "participei de um grupo de amigas onde quase todo mundo já tinha ficado com todo mundo em algum momento do passado.", special: "Roda da Fortuna: quem confessar bebe; quem nao confessar fica livre desta vez." },
    { id: 11, title: "A FORÇA", num: "XI", image: null, text: "tentei carregar algo super pesado ou fazer trabalho manual complexo sozinha só para provar a mim mesma que mulheres conseguem tudo.", special: "Forca Singular: se apenas uma jogadora confessar, ela ganha +1 ponto de coragem." },
    { id: 12, title: "O ENFORCADO", num: "XII", image: null, text: "fiquei presa em um chove-não-molha sáfico por meses sabendo lá no fundo que não daria em nada.", special: "Sacrificio do Enforcado: se exatamente uma jogadora confessar, ela pode cumprir prenda em vez de beber." },
    { id: 13, title: "A MORTE", num: "XIII", image: "assets/arcana-death.png", text: "dei um 'mute' ou deixei de seguir mais de 10 conhecidas do círculo sáfico local de uma vez só para preservar minha paz de espírito.", special: "Renascimento da Morte: a pessoa com menos goles escolhe quem paga 1 gole." },
    { id: 14, title: "A TEMPERANÇA", num: "XIV", image: null, text: "tentei acalmar uma fofoca na roda contando um segredo mas finalizando com a frase clássica: 'mas não espalha, hein'." },
    { id: 15, title: "O DIABO", num: "XV", image: "assets/arcana-devil.png", text: "mandei mensagem de 'oi sumida' nas redes sociais nas primeiras horas da madrugada para aquela garota que tinha me deixado no vácuo." },
    { id: 16, title: "A TORRE", num: "XVI", image: "assets/arcana-tower.png", text: "causei ou alimentei um drama gigante em um grupo de WhatsApp ou no meio do rolê por conta de um mal-entendido bobo." },
    { id: 17, title: "A ESTRELA", num: "XVII", image: null, text: "treinei uma DR (discussão de relação) inteira na minha mente ou no espelho do banheiro fingindo estar conversando com a pessoa.", special: "Esperanca da Estrela: se ninguem confessar, a mesa faz um brinde coletivo de 1 gole." },
    { id: 18, title: "A LUA", num: "XVIII", image: "assets/arcana-moon.png", text: "passei mais de duas horas stalkeando o perfil de um crush até descobrir qual era o signo solar, lunar e ascendente dela." },
    { id: 19, title: "O SOL", num: "XIX", image: null, text: "tentei paquerar alguém de forma direta e a pessoa achou que eu estava apenas sendo 'uma amiga extremamente simpática e fofa'." },
    { id: 20, title: "O JULGAMENTO", num: "XX", image: null, text: "mandei mensagem ou print reclamando das atitudes de um crush ou amiga para a própria pessoa por puro engano.", special: "Julgamento Coletivo: se a maioria confessar, todas ganham +1 ponto de caos; se metade ou menos confessar, as marcadas bebem 2 goles." },
    { id: 21, title: "O MUNDO", num: "XXI", image: null, text: "aluguei um caminhão de mudança ou comecei a dividir teto (o clássico meme U-Haul) antes de completar seis meses de relacionamento." },
    { id: 22, title: "A ANDRESSA", num: "XXII", image: "assets/arcana-andressa.png", text: "comprei mais uma blusa preta, fiz outra tatuagem de dragão ou passei a noite inteira bebendo martini fingindo desinteresse só para chamar a atenção da garota." },
    { id: 23, title: "A PATRÍCIA", num: "XXIII", image: "assets/arcana-patricia.png", text: "passei duas horas fazendo um delineado gótico impecável só para ir ao mercado, ou comprei uma camiseta de streetwear três tamanhos maior só para parecer descolada." },
    { id: 24, title: "A SABRINA", num: "XXIV", image: "assets/arcana-sabrina.png", text: "usei um colar de Senhor dos Anéis (a Estrela Vespertina), passei batom escuro e fiz pose de paz e amor fingindo ser durona de jaqueta de couro." },
    { id: 25, title: "A SHAI", num: "XXV", image: "assets/arcana-shai.png", text: "comprei um bolo decorado de natal inteiro só para tirar fotos estéticas, ou passei horas me admirando no espelho com look brilhante e choker preta." },
    { id: 26, title: "A ANA", num: "XXVI", image: "assets/arcana-ana.png", text: "andei com uma caneca de metal pela casa fingindo sobriedade, tirei foto com fundo de nuvens falsas ou fiz mais uma tatuagem minimalista no braço." }
];

const SUECA_ACTION_CARDS = [
    { id: 200, kind: "dare", title: "A PROVA", num: "✦", drink: 2, points: 3, text: "mostre a última foto da sua galeria para a roda. Sem explicar, sem apagar, sem enrolar." },
    { id: 201, kind: "dare", title: "O VÁCUO", num: "✦", drink: 3, points: 4, text: "mande um áudio de 'oi sumida' para a última garota que te deixou no vácuo." },
    { id: 202, kind: "dare", title: "A CANTADA", num: "✦", drink: 1, points: 2, text: "imite a pior cantada que já jogaram em você, com voz e pose." },
    { id: 203, kind: "dare", title: "O ELOGIO", num: "✦", drink: 1, points: 2, text: "olhe para a jogadora à esquerda e faça um elogio sincero por dez segundos." },
    { id: 204, kind: "dare", title: "O DORAMA", num: "✦", drink: 2, points: 3, text: "declare-se para a jogadora à direita como se fosse cena final de dorama na chuva." },
    { id: 300, kind: "target", title: "O DESEJO", num: "↺", drink: 1, points: 1, text: "escolha uma jogadora para beber por você." },
    { id: 301, kind: "target", title: "A MALDIÇÃO", num: "↺", drink: 2, points: 1, text: "aponte sem dó: a escolhida bebe dois goles." },
    { id: 302, kind: "group", title: "A CASCATA", num: "↺", drink: 1, points: 1, text: "a jogadora atual começa. Em sentido horário, todas bebem um gole." },
    { id: 303, kind: "rule", title: "A REGRA", num: "✶", drink: 1, points: 2, text: "crie uma regra para a mesa. Quem quebrar bebe um gole até a próxima carta de regra." },
    { id: 400, kind: "vote", title: "A U-HAUL", num: "✺", drink: 1, points: 1, text: "a roda escolhe: quem mudaria para a casa do crush antes do terceiro encontro?" },
    { id: 401, kind: "vote", title: "O TEXTÃO", num: "✺", drink: 1, points: 1, text: "a roda escolhe: quem manda o textão mais dramático às três da manhã?" },
    { id: 402, kind: "vote", title: "A STALKER", num: "✺", drink: 2, points: 1, text: "a roda escolhe: quem descobre signo, ascendente e CEP de um crush em uma noite?" }
];

const CARD_KIND_META = {
    confession: { label: "Eu nunca...", symbol: "✶", title: "Quem confessa bebe?", prompt: "Marque quem já fez. Cada marcada bebe." },
    dare: { label: "Prenda", symbol: "✦", title: "Cumpre ou bebe?", prompt: "A jogadora da vez escolhe: cumprir a prenda ou pagar em goles." },
    target: { label: "Reviravolta", symbol: "↺", title: "Escolha quem bebe", prompt: "A jogadora da vez aponta uma pessoa para pagar a carta." },
    group: { label: "Mesa inteira", symbol: "☾", title: "Todo mundo bebe", prompt: "Carta coletiva: resolva e passe a vez." },
    rule: { label: "Regra", symbol: "✶", title: "Nova regra da mesa", prompt: "Crie uma regra rápida. Quem quebrar, bebe." },
    vote: { label: "Votação", symbol: "✺", title: "A roda escolhe", prompt: "Votem na mesa e selecione quem vai beber." }
};

// Active State
let players = [
    { name: "Sabrina", lives: INITIAL_GOLES, avatarSlug: "sabrina", archetype: "labrador" },
    { name: "Shai", lives: INITIAL_GOLES, avatarSlug: "shai", archetype: "gato-preto" },
    { name: "Andressa", lives: INITIAL_GOLES, avatarSlug: "andressa", archetype: "labrador" },
    { name: "Patrícia", lives: INITIAL_GOLES, avatarSlug: "patricia", archetype: "gato-preto" },
    { name: "Ana", lives: INITIAL_GOLES, avatarSlug: "ana", archetype: "gato-preto" }
];
let cardDeck = [];
let activePlayerIndex = 0;
let currentCard = null;
let confessedPlayers = new Set(); // holds indexes of players who confessed for current card
let currentTheme = 'gold';

// Game Mode & Special States
let gameMode = 'sueca';
let activeRules = [];      // Custom rules created during the game
let questionMasterIndex = -1;
let toiletPassIndex = -1;
let partnerships = {};     // Map of index -> index for Os Enamorados
let caliceSagradoCount = 0;
let totalRotasDrawn = 0;
let totalCardsInSession = 0;
let revealedCardsCount = 0;
let lastOmenText = "A mesa ainda aguarda o primeiro presságio.";

// DOM Elements
const screenLobby = document.getElementById("screen-lobby");
const screenGameplay = document.getElementById("screen-gameplay");
const screenReveal = document.getElementById("screen-reveal");
const screenGameover = document.getElementById("screen-gameover");

const formAddPlayer = document.getElementById("form-add-player");
const inputPlayerName = document.getElementById("player-name-input");
const listLobbyPlayers = document.getElementById("lobby-players-list");
const btnAddGuestPlayer = document.getElementById("btn-add-guest-player");
const btnStartGame = document.getElementById("btn-start-game");

const activePlayerNameText = document.getElementById("active-player-name");
const ritualModeLabel = document.getElementById("ritual-mode-label");
const ritualRevealedCount = document.getElementById("ritual-revealed-count");
const ritualTotalCount = document.getElementById("ritual-total-count");
const ritualDeckCount = document.getElementById("ritual-deck-count");
const lastOmenStrip = document.getElementById("last-omen-strip");
const visualCardDeck = document.getElementById("mystic-card-deck");
const scoreboardPlayers = document.getElementById("scoreboard-players");

const cardFlip3d = document.getElementById("card-flip-3d");
const arcanaNumberText = document.getElementById("arcana-number");
const arcanaTitleText = document.getElementById("arcana-title");
const arcanaIllustration = document.getElementById("arcana-illustration");
const cardKindPrefixText = document.getElementById("card-kind-prefix");
const arcanaStatementText = document.getElementById("arcana-statement");
const confessionTitleText = document.getElementById("confession-title-text");
const listConfessionPlayers = document.getElementById("confession-players-list");
const btnSubmitConfession = document.getElementById("btn-submit-confession");

const btnRestartGame = document.getElementById("btn-restart-game");
const listGameoverRankings = document.getElementById("gameover-rankings");
const btnToggleSound = document.getElementById("btn-toggle-sound");
const themeSelector = document.getElementById("theme-selector");

const customCardDialog = document.getElementById("custom-card-dialog");
const formCustomCard = document.getElementById("form-custom-card");
const btnOpenForge = document.getElementById("btn-open-forge");
const btnCloseDialog = document.getElementById("btn-close-dialog");
const inputCustomTitle = document.getElementById("custom-card-title");
const inputCustomText = document.getElementById("custom-card-text");

const activeRulesPanel = document.getElementById("active-rules-panel");
const rulesList = document.getElementById("rules-list");
const caliceSagradoContainer = document.getElementById("calice-sagrado-container");
const caliceSagradoCountText = document.getElementById("calice-sagrado-count");
const caliceLiquidFill = document.getElementById("calice-liquid-fill");
const minigameContainer = document.getElementById("mystic-minigame-container");
const scoreboardTitleText = document.getElementById("scoreboard-title-text");

let customCards = [];
try {
    const saved = localStorage.getItem("tarot_custom_cards");
    if (saved) {
        customCards = JSON.parse(saved);
    }
} catch (e) {
    customCards = [];
}
let gameHistory = []; // Tracks confessions history
let heartbeatInterval = null; // Tracks tension heartbeat interval

// Grimório DOM Elements
const btnOpenGrimoire = document.getElementById("btn-open-grimoire");
const grimoireDialog = document.getElementById("grimoire-dialog");
const btnCloseGrimoire = document.getElementById("btn-close-grimoire");
const grimoireHistoryContent = document.getElementById("grimoire-history-content");

// ==========================================================================
// SOUND SYNTHESIZER (Web Audio API)
// ==========================================================================

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Ambient Synthesizer Node references
let ambientDroneNode1 = null;
let ambientDroneNode2 = null;
let ambientGainNode = null;
let ambientLfoNode = null;
let ambientTimer = null;

function startAmbientDrone() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (ambientDroneNode1) return;

    const t = audioCtx.currentTime;

    ambientGainNode = audioCtx.createGain();
    ambientGainNode.gain.setValueAtTime(0, t);
    ambientGainNode.gain.linearRampToValueAtTime(0.04, t + 3.0);
    ambientGainNode.connect(audioCtx.destination);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, t);
    filter.Q.setValueAtTime(4, t);
    filter.connect(ambientGainNode);

    ambientDroneNode1 = audioCtx.createOscillator();
    ambientDroneNode1.type = 'sine';
    ambientDroneNode1.frequency.setValueAtTime(55, t);

    ambientDroneNode2 = audioCtx.createOscillator();
    ambientDroneNode2.type = 'sine';
    ambientDroneNode2.frequency.setValueAtTime(55.4, t);

    ambientLfoNode = audioCtx.createOscillator();
    ambientLfoNode.frequency.setValueAtTime(0.08, t);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(25, t);

    ambientLfoNode.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    ambientDroneNode1.connect(filter);
    ambientDroneNode2.connect(filter);

    ambientDroneNode1.start(t);
    ambientDroneNode2.start(t);
    ambientLfoNode.start(t);

    scheduleWindChimes();
}

function stopAmbientDrone() {
    const t = audioCtx ? audioCtx.currentTime : 0;
    if (ambientGainNode) {
        ambientGainNode.gain.cancelScheduledValues(t);
        ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, t);
        ambientGainNode.gain.linearRampToValueAtTime(0, t + 1.0);
        
        const node1 = ambientDroneNode1;
        const node2 = ambientDroneNode2;
        const lfo = ambientLfoNode;

        setTimeout(() => {
            try {
                if (node1) node1.stop();
                if (node2) node2.stop();
                if (lfo) lfo.stop();
            } catch(e) {}
        }, 1200);
    }
    ambientDroneNode1 = null;
    ambientDroneNode2 = null;
    ambientLfoNode = null;
    ambientGainNode = null;
    if (ambientTimer) {
        clearTimeout(ambientTimer);
        ambientTimer = null;
    }
}

function scheduleWindChimes() {
    if (!soundEnabled) return;
    const nextTime = 12000 + Math.random() * 12000;
    ambientTimer = setTimeout(() => {
        playMysticChime();
        scheduleWindChimes();
    }, nextTime);
}

function playMysticChime() {
    if (!soundEnabled || !audioCtx) return;
    const t = audioCtx.currentTime;

    const scale = currentTheme === 'cosmic'
        ? [196.00, 220.00, 261.63, 311.13, 392.00, 440.00, 493.88] // C minor/mystical pentatonic
        : currentTheme === 'classic'
        ? [146.83, 164.81, 196.00, 220.00, 293.66, 329.63] // Deep G/A minor pentatonic
        : [220, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // A minor pentatonic
    const notesCount = Math.floor(Math.random() * 2) + 2;
    
    let noteOffset = 0;
    for (let i = 0; i < notesCount; i++) {
        const freq = scale[Math.floor(Math.random() * scale.length)];
        const delay = t + noteOffset;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, delay);
        
        gain.gain.setValueAtTime(0, delay);
        gain.gain.linearRampToValueAtTime(0.06, delay + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, delay + 1.2);
        
        osc.start(delay);
        osc.stop(delay + 1.5);
        
        noteOffset += 0.25 + Math.random() * 0.15;
    }
}

function updateAmbientDroneFrequency() {
    if (!audioCtx || !ambientDroneNode1 || !ambientDroneNode2 || !ambientGainNode) return;
    const t = audioCtx.currentTime;
    
    if (currentTheme === 'cosmic') {
        // Space pad: A1 (55Hz) and E2 (82.4Hz)
        ambientDroneNode1.frequency.exponentialRampToValueAtTime(55, t + 2.0);
        ambientDroneNode2.frequency.exponentialRampToValueAtTime(82.4, t + 2.0);
        ambientGainNode.gain.linearRampToValueAtTime(0.05, t + 2.0);
    } else if (currentTheme === 'classic') {
        // Deep organic hum: G1 (49Hz) and G1.3 (49.3Hz)
        ambientDroneNode1.frequency.exponentialRampToValueAtTime(49, t + 2.0);
        ambientDroneNode2.frequency.exponentialRampToValueAtTime(49.3, t + 2.0);
        ambientGainNode.gain.linearRampToValueAtTime(0.06, t + 2.0);
    } else {
        // Gold/Default: A1 (55Hz) and A1.4 (55.4Hz)
        ambientDroneNode1.frequency.exponentialRampToValueAtTime(55, t + 2.0);
        ambientDroneNode2.frequency.exponentialRampToValueAtTime(55.4, t + 2.0);
        ambientGainNode.gain.linearRampToValueAtTime(0.04, t + 2.0);
    }
}

function startHeartbeat(livesCount) {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (!soundEnabled || !audioCtx) return;

    const intervalTime = livesCount === 1 ? 600 : 1000; 

    heartbeatInterval = setInterval(() => {
        if (!soundEnabled || !audioCtx) return;
        if (audioCtx.state === 'suspended') return;
        const t = audioCtx.currentTime;
        triggerHeartbeatNode(t);
        triggerHeartbeatNode(t + 0.18);
    }, intervalTime);
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

function triggerHeartbeatNode(time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, time); // Deep bass frequency

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.2);
}

function playGlassShatter() {
    if (!soundEnabled || !audioCtx) return;
    const t = audioCtx.currentTime;

    const bufferSize = audioCtx.sampleRate * 0.3; // 0.3s duration
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8000, t); // High pitch shatter
    filter.Q.setValueAtTime(5, t);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(t);
    noise.stop(t + 0.3);
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    // Resume context if suspended (browser security)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    // Auto-start ambient drone when user interacts
    startAmbientDrone();

    const t = audioCtx.currentTime;

    switch (type) {
        case 'click': {
            // High-pitched woodblock click
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.15);
            break;
        }
        case 'confess': {
            // Mistic bell chime
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, t); // D5
            osc.frequency.exponentialRampToValueAtTime(880, t + 0.05); // A5
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
            osc.start(t);
            osc.stop(t + 0.6);
            break;
        }
        case 'draw': {
            // Whispering air swoosh
            const bufferSize = audioCtx.sampleRate * 0.4;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(200, t);
            filter.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
            filter.Q.setValueAtTime(5, t);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start(t);
            noise.stop(t + 0.4);
            break;
        }
        case 'flip': {
            // Mistic deep resonance sweep
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc1.type = 'sine';
            osc2.type = 'sawtooth';
            
            osc1.frequency.setValueAtTime(110, t); // A2
            osc1.frequency.exponentialRampToValueAtTime(440, t + 0.5);
            
            osc2.frequency.setValueAtTime(112, t);
            osc2.frequency.exponentialRampToValueAtTime(445, t + 0.5);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, t);
            filter.frequency.exponentialRampToValueAtTime(2000, t + 0.4);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.25, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start(t);
            osc2.start(t);
            osc1.stop(t + 0.6);
            osc2.stop(t + 0.6);
            break;
        }
        case 'gameover': {
            // Mistic celestial minor arpeggio
            const freqs = [220, 261.63, 329.63, 440]; // A minor
            freqs.forEach((freq, idx) => {
                const noteTime = t + idx * 0.12;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);
                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.8);
                osc.start(noteTime);
                osc.stop(noteTime + 0.9);
            });
            break;
        }
    }
}

// ==========================================================================
// STATE TRANSITIONS (SPA routing with View Transitions support)
// ==========================================================================

function switchScreen(toScreen) {
    const screens = [screenLobby, screenGameplay, screenReveal, screenGameover];
    
    const updateDOM = () => {
        screens.forEach(screen => {
            if (screen === toScreen) {
                screen.classList.add("active");
            } else {
                screen.classList.remove("active");
            }
        });
        document.body.dataset.screen = toScreen.id.replace("screen-", "");
        if (!document.startViewTransition) {
            toScreen.focus();
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    if (document.startViewTransition) {
        const transition = document.startViewTransition(updateDOM);
        transition.finished.finally(() => {
            toScreen.focus();
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        });
    } else {
        updateDOM();
    }
}

// ==========================================================================
// GAMEPLAY LOGIC
// ==========================================================================

function setupNewGame() {
    gameMode = 'sueca';
    players = players.map(p => ({ ...p, lives: 0, points: 0 }));
    scoreboardTitleText.textContent = "Goles & Glória";

    cardDeck = buildSuecaDeck();
    totalCardsInSession = cardDeck.length;
    revealedCardsCount = 0;
    lastOmenText = "A mesa ainda aguarda o primeiro presságio.";
    activePlayerIndex = 0;
    currentCard = null;
    confessedPlayers.clear();
    gameHistory = []; // Reset confessions history
    stopHeartbeat();  // Stop any active heartbeat

    // Reset Sueca states
    activeRules = [];
    questionMasterIndex = -1;
    toiletPassIndex = -1;
    partnerships = {};
    caliceSagradoCount = 0;
    totalRotasDrawn = 0;

    renderActiveRules();
    updateCaliceSagradoDisplay();
    updateScoreboard();
    updateRitualStatus();
    prepareNextTurn();
    switchScreen(screenGameplay);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareNextTurn() {
    if (players.length === 0) return;

    if (cardDeck.length === 0) {
        endGame();
        return;
    }

    const activePlayer = players[activePlayerIndex];
    activePlayerNameText.innerHTML = `
        ${renderPlayerAvatar(activePlayer, "active-player-avatar", PLAYER_AVATAR_SELECTED_VARIANT)}
        <span>${escapeHTML(activePlayer.name)}</span>
    `;
    
    // Highlight active player on scoreboard
    updateScoreboard();
    updateRitualStatus();
}

function getGameModeLabel() {
    return 'Sueca de Maluca';
}

function updateRitualStatus() {
    if (ritualModeLabel) {
        ritualModeLabel.textContent = getGameModeLabel();
    }
    if (ritualRevealedCount) {
        ritualRevealedCount.textContent = String(revealedCardsCount);
    }
    if (ritualTotalCount) {
        ritualTotalCount.textContent = String(totalCardsInSession);
    }
    if (ritualDeckCount) {
        ritualDeckCount.textContent = String(cardDeck.length);
    }
    if (lastOmenStrip) {
        lastOmenStrip.textContent = lastOmenText;
    }
}

function formatNameList(names) {
    if (names.length <= 1) return names[0] || "";
    if (names.length === 2) return `${names[0]} e ${names[1]}`;
    return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function normalizePlayerName(name) {
    return name
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function getAvatarSlugForName(name) {
    return {
        sabrina: "sabrina",
        shai: "shai",
        andressa: "andressa",
        patricia: "patricia",
        ana: "ana"
    }[normalizePlayerName(name)] || null;
}

function getPlayerAvatarSlug(player) {
    return player.avatarSlug || getAvatarSlugForName(player.name);
}

function getPlayerAvatarSrc(player, variant = PLAYER_AVATAR_DEFAULT_VARIANT) {
    const slug = getPlayerAvatarSlug(player);
    return slug ? getAssetPath(`${slug}-${variant}.png`) : "";
}

function getPlayerInitial(name) {
    return Array.from(name.trim())[0]?.toLocaleUpperCase("pt-BR") || "?";
}

function renderPlayerAvatar(player, className = "player-avatar", variant = PLAYER_AVATAR_DEFAULT_VARIANT) {
    const slug = getPlayerAvatarSlug(player);
    if (slug) {
        const src = getPlayerAvatarSrc(player, variant);
        return `<span class="${className}" aria-hidden="true"><img class="${className}-img" src="${src}" alt="" loading="lazy" decoding="async" data-avatar-slug="${slug}" data-avatar-variant="${variant}" data-asset-filename="${slug}-${variant}.png"></span>`;
    }

    return `<span class="${className} ${className}--initial" aria-hidden="true">${escapeHTML(getPlayerInitial(player.name))}</span>`;
}

function refreshRenderedAvatarImages() {
    document.querySelectorAll("img[data-avatar-slug]").forEach((img) => {
        const variant = img.dataset.avatarVariant || PLAYER_AVATAR_DEFAULT_VARIANT;
        updateImageAsset(img, `${img.dataset.avatarSlug}-${variant}.png`);
    });
}

function setRenderedAvatarVariant(container, variant) {
    const img = container.querySelector("img[data-avatar-slug]");
    if (!img) return;
    img.dataset.avatarVariant = variant;
    updateImageAsset(img, `${img.dataset.avatarSlug}-${variant}.png`);
}

function getArchetypeLabel(archetype) {
    return archetype === "labrador" ? "Labrador" : "Gato Preto";
}

function getArchetypeEffectText(archetype) {
    if (archetype === "labrador") return "-1 gole quando beber";
    return "+1 ponto quando beber";
}

function getEffectiveDrinkCount(playerIndex, baseCount) {
    const player = players[playerIndex];
    if (!player) return 0;
    if (player.archetype === "labrador") {
        return Math.max(0, baseCount - 1);
    }
    return baseCount;
}

function applyDrink(playerIndex, baseCount) {
    const player = players[playerIndex];
    if (!player) {
        return { playerIndex, amount: 0, bonusPoints: 0, reduced: false };
    }

    const amount = getEffectiveDrinkCount(playerIndex, baseCount);
    const reduced = player.archetype === "labrador" && amount < baseCount;
    const bonusPoints = player.archetype === "gato-preto" && baseCount > 0 ? 1 : 0;

    addSips(playerIndex, amount);
    if (bonusPoints > 0) {
        addPoints(playerIndex, bonusPoints);
    }

    return { playerIndex, amount, bonusPoints, reduced };
}

function getDrinkEffectLabel(playerIndex, baseCount) {
    const player = players[playerIndex];
    if (!player) return "";
    if (player.archetype === "labrador" && getEffectiveDrinkCount(playerIndex, baseCount) < baseCount) {
        return "Labrador segurou 1";
    }
    if (player.archetype === "gato-preto" && baseCount > 0) {
        return "Gato Preto +1 pt";
    }
    return getArchetypeEffectText(player.archetype);
}

function getDrinkResultIndexes(results) {
    return results.filter(result => result.amount > 0).map(result => result.playerIndex);
}

function formatDrinkResults(results) {
    return results
        .filter(result => players[result.playerIndex])
        .map(result => {
            const player = players[result.playerIndex];
            const notes = [];
            if (result.reduced) notes.push("Labrador -1");
            if (result.bonusPoints > 0) notes.push("+1 pt Gato Preto");
            const noteText = notes.length ? ` (${notes.join(", ")})` : "";
            return `${player.name}: ${pluralizeGole(result.amount)}${noteText}`;
        })
        .join("; ");
}

function getCardKind(card) {
    return card?.kind || "confession";
}

function getCardMeta(card) {
    return CARD_KIND_META[getCardKind(card)] || CARD_KIND_META.confession;
}

function getDrinkCount(card) {
    if (card?.drink) return card.drink;
    if ([13, 15, 20].includes(card?.id)) return 2;
    return 1;
}

function getPointValue(card) {
    if (card?.points) return card.points;
    return getCardKind(card) === "confession" ? 1 : 2;
}

function buildSuecaDeck() {
    const confessionCards = ALL_CARDS.map(card => ({
        ...card,
        kind: "confession",
        drink: getDrinkCount(card),
        points: 1
    }));
    const forgedCards = customCards.map(card => ({
        ...card,
        kind: card.kind || "confession",
        drink: card.drink || 1,
        points: card.points || 1
    }));

    return shuffle([...confessionCards, ...SUECA_ACTION_CARDS, ...forgedCards]);
}

function pluralizeGole(count) {
    return `${count} ${count === 1 ? "gole" : "goles"}`;
}

function addSips(playerIndex, count) {
    if (!players[playerIndex]) return;
    players[playerIndex].lives = (players[playerIndex].lives || 0) + count;
}

function addPoints(playerIndex, count) {
    if (!players[playerIndex]) return;
    players[playerIndex].points = (players[playerIndex].points || 0) + count;
}

function setupMiniGameForCard(card) {
    if (!minigameContainer) return;
    minigameContainer.innerHTML = '';
    minigameContainer.classList.add("hidden");

    // Default confession subtitle text
    const subtitleText = document.getElementById("confession-subtitle-text");
    if (subtitleText) {
        if (gameMode === 'sueca') {
            subtitleText.textContent = "Marque as jogadoras que devem beber (goles acumulados):";
        } else {
            subtitleText.textContent = "Marque as jogadoras que devem resolver a carta:";
        }
    }

    if (gameMode !== 'sueca') {
        return;
    }

    minigameContainer.classList.remove("hidden");

    switch(card.id) {
        case 0: // O Louco
            minigameContainer.innerHTML = `
                <div class="minigame-title">✶ A Regra da Louca</div>
                <div class="minigame-instruction">A jogadora atual (${players[activePlayerIndex].name}) deve criar uma regra personalizada para a mesa! Quem quebrar, bebe 1 gole. Digite a regra abaixo:</div>
                <div class="minigame-input-group">
                    <input type="text" id="input-louco-rule" class="minigame-input" placeholder="Ex: Proibido apontar o dedo" maxlength="40">
                    <button type="button" id="btn-save-louco-rule" class="btn-mystic" style="margin-top: 0.5rem; width: 100%;">Decretar Regra</button>
                </div>
            `;
            setTimeout(() => {
                const btn = document.getElementById("btn-save-louco-rule");
                const input = document.getElementById("input-louco-rule");
                if (btn && input) {
                    btn.addEventListener("click", () => {
                        const ruleText = input.value.trim();
                        if (ruleText) {
                            activeRules.push(`${players[activePlayerIndex].name}: "${ruleText}"`);
                            renderActiveRules();
                            playSound('confess');
                            minigameContainer.innerHTML = `<div class="minigame-instruction" style="color: var(--color-gold); font-weight: bold; text-align: center;">Regra decretada: "${ruleText}"!</div>`;
                        }
                    });
                }
            }, 100);
            break;

        case 1: // O Mago
            questionMasterIndex = activePlayerIndex;
            renderActiveRules();
            minigameContainer.innerHTML = `
                <div class="minigame-title">✶ Mestre da Pergunta</div>
                <div class="minigame-instruction"><strong>${players[activePlayerIndex].name}</strong> agora é o Mestre da Pergunta! Ninguém pode responder às suas perguntas. Quem responder bebe 1 gole!</div>
            `;
            break;

        case 2: // A Sacerdotisa
            toiletPassIndex = activePlayerIndex;
            renderActiveRules();
            minigameContainer.innerHTML = `
                <div class="minigame-title">✦ Chave do Banheiro</div>
                <div class="minigame-instruction"><strong>${players[activePlayerIndex].name}</strong> ganhou a Chave do Banheiro! Ninguém pode ir ao banheiro sem permissão, ou beberá 3 goles!</div>
            `;
            break;

        case 5: // O Hierofante
            minigameContainer.innerHTML = `
                <div class="minigame-title">∑ O Jogo do Pi</div>
                <div class="minigame-instruction">Sentido horário: contem a partir de ${players[activePlayerIndex].name}. Números com 7 ou múltiplos de 7 dizem "Pi!". Quem errar bebe 2 goles! Marque o perdedor abaixo.</div>
            `;
            break;

        case 6: // Os Enamorados
            minigameContainer.innerHTML = `
                <div class="minigame-title">◇ Pacto do Gole</div>
                <div class="minigame-instruction">A jogadora atual (${players[activePlayerIndex].name}) deve escolher uma parceira. Toda vez que uma beber, a outra bebe 1 gole junto! Escolha abaixo:</div>
                <div class="minigame-grid-select" id="enamorados-select"></div>
            `;
            setTimeout(() => {
                const container = document.getElementById("enamorados-select");
                if (container) {
                    players.forEach((p, idx) => {
                        if (idx !== activePlayerIndex) {
                            const btn = document.createElement("button");
                            btn.className = "minigame-select-btn";
                            btn.innerHTML = `${renderPlayerAvatar(p, "mini-player-avatar")}<span>${escapeHTML(p.name)}</span>`;
                            btn.addEventListener("click", () => {
                                partnerships[activePlayerIndex] = idx;
                                partnerships[idx] = activePlayerIndex;
                                renderActiveRules();
                                playSound('confess');
                                container.innerHTML = `<div class="minigame-instruction" style="color: var(--color-gold); text-align: center; width: 100%;">Pacto selado entre <strong>${players[activePlayerIndex].name}</strong> e <strong>${p.name}</strong>!</div>`;
                            });
                            container.appendChild(btn);
                        }
                    });
                }
            }, 100);
            break;

        case 7: // O Carro
            minigameContainer.innerHTML = `
                <div class="minigame-title">↺ Jogo das Categorias</div>
                <div class="minigame-instruction">A jogadora atual (${players[activePlayerIndex].name}) escolhe uma categoria. Em sentido horário, falem itens dela. O primeiro que falhar/repetir bebe 2 goles!</div>
            `;
            break;

        case 8: // A Força
            minigameContainer.innerHTML = `
                <div class="minigame-title">✦ Desafio do Dedo</div>
                <div class="minigame-instruction">Coloquem o dedo na mesa física IMEDIATAMENTE! O grupo deve decidir quem foi a última. Selecione-a abaixo para confessar (beberá 2 goles):</div>
                <div class="minigame-grid-select" id="finger-select"></div>
            `;
            setTimeout(() => {
                const container = document.getElementById("finger-select");
                if (container) {
                    players.forEach((p, idx) => {
                        const btn = document.createElement("button");
                        btn.className = "minigame-select-btn";
                        btn.innerHTML = `${renderPlayerAvatar(p, "mini-player-avatar")}<span>${escapeHTML(p.name)}</span>`;
                        btn.addEventListener("click", () => {
                            container.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
                            btn.classList.add("selected");
                            confessedPlayers.clear();
                            confessedPlayers.add(idx);
                            
                            const mainBtns = listConfessionPlayers.querySelectorAll(".confession-btn");
                            mainBtns.forEach(mb => {
                                const pIdx = parseInt(mb.getAttribute("data-player-index"));
                                if (pIdx === idx) {
                                    mb.classList.add("confessed");
                                    setRenderedAvatarVariant(mb, PLAYER_AVATAR_SELECTED_VARIANT);
                                } else {
                                    mb.classList.remove("confessed");
                                    setRenderedAvatarVariant(mb, PLAYER_AVATAR_DEFAULT_VARIANT);
                                }
                            });
                        });
                        container.appendChild(btn);
                    });
                }
            }, 100);
            break;

        case 9: // O Eremita
            activeRules.push("Voto de Silêncio (Eremita)");
            renderActiveRules();
            minigameContainer.innerHTML = `
                <div class="minigame-title">◇ Voto de Silêncio</div>
                <div class="minigame-instruction">Ninguém pode falar nada até a próxima carta! Quem quebrar o silêncio bebe 1 gole.</div>
            `;
            break;

        case 10: // A Roda da Fortuna
            caliceSagradoCount += 2;
            updateCaliceSagradoDisplay();
            totalRotasDrawn += 1;
            
            let rodaHtml = '';
            if (totalRotasDrawn >= 4) {
                rodaHtml = `<div class="minigame-instruction" style="color: var(--color-crimson); font-weight: bold; animation: pulseGold 1s infinite; text-align: center;">4ª RODA DA FORTUNA! A jogadora atual (${players[activePlayerIndex].name}) deve beber o CÁLICE SAGRADO INTEIRO (${caliceSagradoCount} goles)!</div>`;
                applyDrink(activePlayerIndex, caliceSagradoCount);
                caliceSagradoCount = 0;
                setTimeout(() => {
                    updateCaliceSagradoDisplay();
                    updateScoreboard();
                }, 1500);
            } else {
                rodaHtml = `<div class="minigame-instruction">A Roda girou! +2 Goles adicionados ao Cálice Sagrado central (Total: ${caliceSagradoCount} goles). Quem confessar bebe, quem não confessar está livre.</div>`;
            }
            minigameContainer.innerHTML = `
                <div class="minigame-title">☾ O Cálice Sagrado</div>
                ${rodaHtml}
            `;
            break;

        case 13: // A Morte
            let minSips = Math.min(...players.map(p => p.lives));
            let soberestPlayers = players.map((p, idx) => ({p, idx})).filter(item => item.p.lives === minSips);
            let carrasco = soberestPlayers[Math.floor(Math.random() * soberestPlayers.length)];
            
            minigameContainer.innerHTML = `
                <div class="minigame-title">† Carrasco da Morte</div>
                <div class="minigame-instruction">A jogadora mais sóbria (${carrasco.p.name}) deve apontar para alguém e condená-la a beber 3 goles! Selecione a vítima abaixo:</div>
                <div class="minigame-grid-select" id="morte-select"></div>
            `;
            setTimeout(() => {
                const container = document.getElementById("morte-select");
                if (container) {
                    players.forEach((p, idx) => {
                        const btn = document.createElement("button");
                        btn.className = "minigame-select-btn";
                        btn.innerHTML = `${renderPlayerAvatar(p, "mini-player-avatar")}<span>${escapeHTML(p.name)}</span>`;
                        btn.addEventListener("click", () => {
                            container.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
                            btn.classList.add("selected");
                            confessedPlayers.clear();
                            confessedPlayers.add(idx);
                            
                            const mainBtns = listConfessionPlayers.querySelectorAll(".confession-btn");
                            mainBtns.forEach(mb => {
                                const pIdx = parseInt(mb.getAttribute("data-player-index"));
                                if (pIdx === idx) {
                                    mb.classList.add("confessed");
                                    setRenderedAvatarVariant(mb, PLAYER_AVATAR_SELECTED_VARIANT);
                                } else {
                                    mb.classList.remove("confessed");
                                    setRenderedAvatarVariant(mb, PLAYER_AVATAR_DEFAULT_VARIANT);
                                }
                            });
                        });
                        container.appendChild(btn);
                    });
                }
            }, 100);
            break;

        case 15: // O Diabo
            minigameContainer.innerHTML = `
                <div class="minigame-title">✺ Verdade ou Consequência</div>
                <div class="minigame-instruction">A jogadora atual (${players[activePlayerIndex].name}) deve confessar uma fofoca/segredo ("Verdade") ou confessar a carta e beber 3 goles!</div>
                <div class="minigame-grid-select" id="diabo-select">
                    <button type="button" class="minigame-select-btn" id="btn-diabo-verdade">Verdade (Livre)</button>
                    <button type="button" class="minigame-select-btn" id="btn-diabo-consequencia">Beber 3 Goles</button>
                </div>
            `;
            setTimeout(() => {
                const btnVerdade = document.getElementById("btn-diabo-verdade");
                const btnConsequencia = document.getElementById("btn-diabo-consequencia");
                if (btnVerdade && btnConsequencia) {
                    btnVerdade.addEventListener("click", () => {
                        btnVerdade.classList.add("selected");
                        btnConsequencia.classList.remove("selected");
                        confessedPlayers.clear();
                        listConfessionPlayers.querySelectorAll(".confession-btn").forEach(mb => {
                            mb.classList.remove("confessed");
                            setRenderedAvatarVariant(mb, PLAYER_AVATAR_DEFAULT_VARIANT);
                        });
                    });
                    btnConsequencia.addEventListener("click", () => {
                        btnConsequencia.classList.add("selected");
                        btnVerdade.classList.remove("selected");
                        confessedPlayers.clear();
                        confessedPlayers.add(activePlayerIndex);
                        listConfessionPlayers.querySelectorAll(".confession-btn").forEach(mb => {
                            const pIdx = parseInt(mb.getAttribute("data-player-index"));
                            if (pIdx === activePlayerIndex) {
                                mb.classList.add("confessed");
                                setRenderedAvatarVariant(mb, PLAYER_AVATAR_SELECTED_VARIANT);
                            } else {
                                mb.classList.remove("confessed");
                                setRenderedAvatarVariant(mb, PLAYER_AVATAR_DEFAULT_VARIANT);
                            }
                        });
                    });
                }
            }, 100);
            break;

        case 16: // A Torre
            minigameContainer.innerHTML = `
                <div class="minigame-title">✺ A Cascata da Torre</div>
                <div class="minigame-instruction">A jogadora atual (${players[activePlayerIndex].name}) começa a beber. A da sua direita começa a seguir, e assim por diante. Todos bebem 2 goles!</div>
            `;
            setTimeout(() => {
                players.forEach((p, idx) => {
                    confessedPlayers.add(idx);
                });
                listConfessionPlayers.querySelectorAll(".confession-btn").forEach(mb => {
                    mb.classList.add("confessed");
                    setRenderedAvatarVariant(mb, PLAYER_AVATAR_SELECTED_VARIANT);
                });
            }, 100);
            break;

        case 17: // A Estrela
            minigameContainer.innerHTML = `
                <div class="minigame-title">✦ Brinde Coletivo</div>
                <div class="minigame-instruction">Um brinde celestial! Todos da mesa confessam a carta e bebem 1 gole juntos.</div>
            `;
            setTimeout(() => {
                players.forEach((p, idx) => {
                    confessedPlayers.add(idx);
                });
                listConfessionPlayers.querySelectorAll(".confession-btn").forEach(mb => {
                    mb.classList.add("confessed");
                    setRenderedAvatarVariant(mb, PLAYER_AVATAR_SELECTED_VARIANT);
                });
            }, 100);
            break;
    }
}

function finishSuecaRound(summary, drankIndexes = []) {
    gameHistory.push({
        cardTitle: currentCard.title,
        cardText: currentCard.text,
        targetPlayer: players[activePlayerIndex].name,
        summary
    });

    lastOmenText = summary;
    updateScoreboard();
    updateRitualStatus();
    triggerBurst(window.innerWidth / 2, window.innerHeight / 2);
    if (drankIndexes.length > 0) {
        setTimeout(() => playSound('confess'), 220);
    }

    activePlayerIndex = (activePlayerIndex + 1) % players.length;
    setTimeout(() => {
        if (cardDeck.length === 0) {
            endGame();
        } else {
            prepareNextTurn();
            switchScreen(screenGameplay);
        }
    }, 720);
}

function renderConfessionResolver() {
    const drink = getDrinkCount(currentCard);
    listConfessionPlayers.className = "confession-grid";
    players.forEach((player, idx) => {
        const effectiveDrink = getEffectiveDrinkCount(idx, drink);
        const effectLabel = getDrinkEffectLabel(idx, drink);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "confession-btn";
        btn.setAttribute("data-player-index", idx);
        btn.setAttribute("title", `${player.name}: ${effectLabel}`);
        btn.innerHTML = `
            ${renderPlayerAvatar(player, "confession-avatar")}
            <span class="confession-player-name">${escapeHTML(player.name)}</span>
            <span class="confession-mark">+${effectiveDrink}</span>
            <span class="confession-effect">${escapeHTML(effectLabel)}</span>
        `;

        btn.addEventListener("click", () => {
            playSound('click');
            if (confessedPlayers.has(idx)) {
                confessedPlayers.delete(idx);
                btn.classList.remove("confessed");
                setRenderedAvatarVariant(btn, PLAYER_AVATAR_DEFAULT_VARIANT);
            } else {
                confessedPlayers.add(idx);
                btn.classList.add("confessed");
                setRenderedAvatarVariant(btn, PLAYER_AVATAR_SELECTED_VARIANT);
            }
        });
        listConfessionPlayers.appendChild(btn);
    });
    btnSubmitConfession.style.display = "";
    btnSubmitConfession.textContent = "Resolver Rodada";
}

function renderDareResolver() {
    const active = players[activePlayerIndex];
    const drink = getDrinkCount(currentCard);
    const points = getPointValue(currentCard);
    listConfessionPlayers.className = "round-action-grid";

    [
        { label: `Cumpri +${points} pts`, outcome: "did" },
        { label: `Bebi ${pluralizeGole(drink)}`, outcome: "drink" },
        { label: `Fiz e bebi +${points + 1} pts`, outcome: "both" }
    ].forEach(option => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "round-action-btn";
        btn.textContent = option.label;
        btn.addEventListener("click", () => resolveDare(option.outcome));
        listConfessionPlayers.appendChild(btn);
    });

    btnSubmitConfession.style.display = "none";
    confessionTitleText.textContent = `${active.name}: cumpre ou bebe?`;
}

function renderTargetResolver(includeActive = false) {
    const drink = getDrinkCount(currentCard);
    listConfessionPlayers.className = "confession-grid";
    players.forEach((player, idx) => {
        if (!includeActive && idx === activePlayerIndex) return;
        const effectiveDrink = getEffectiveDrinkCount(idx, drink);
        const effectLabel = getDrinkEffectLabel(idx, drink);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "confession-btn";
        btn.setAttribute("title", `${player.name}: ${effectLabel}`);
        btn.innerHTML = `
            ${renderPlayerAvatar(player, "confession-avatar")}
            <span class="confession-player-name">${escapeHTML(player.name)}</span>
            <span class="confession-mark">+${effectiveDrink}</span>
            <span class="confession-effect">${escapeHTML(effectLabel)}</span>
        `;
        btn.addEventListener("click", () => resolveTarget(idx));
        listConfessionPlayers.appendChild(btn);
    });
    btnSubmitConfession.style.display = "none";
}

function renderSingleActionResolver(label, onResolve) {
    listConfessionPlayers.className = "round-action-grid";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "round-action-btn round-action-btn-wide";
    btn.textContent = label;
    btn.addEventListener("click", onResolve);
    listConfessionPlayers.appendChild(btn);
    btnSubmitConfession.style.display = "none";
}

function renderRoundResolver() {
    const meta = getCardMeta(currentCard);
    const drink = getDrinkCount(currentCard);
    listConfessionPlayers.innerHTML = '';
    if (minigameContainer) {
        minigameContainer.classList.add("hidden");
        minigameContainer.innerHTML = '';
    }
    confessionTitleText.textContent = meta.title;
    document.getElementById("confession-subtitle-text").textContent = `${meta.prompt} Valor: ${pluralizeGole(drink)}.`;

    if (getCardKind(currentCard) === "confession") {
        renderConfessionResolver();
    } else if (getCardKind(currentCard) === "dare") {
        renderDareResolver();
    } else if (getCardKind(currentCard) === "target") {
        renderTargetResolver(false);
    } else if (getCardKind(currentCard) === "vote") {
        renderTargetResolver(true);
    } else if (getCardKind(currentCard) === "group") {
        renderSingleActionResolver(`Todo mundo bebe ${pluralizeGole(drink)}`, resolveGroupCard);
    } else if (getCardKind(currentCard) === "rule") {
        renderSingleActionResolver("Regra criada, passar a vez", resolveRuleCard);
    }
}

function drawCard() {
    if (cardDeck.length === 0) {
        endGame();
        return;
    }

    playSound('draw');
    currentCard = cardDeck.pop();
    const meta = getCardMeta(currentCard);
    revealedCardsCount += 1;
    lastOmenText = `${currentCard.title} saiu para ${players[activePlayerIndex].name}.`;
    confessedPlayers.clear();

    arcanaNumberText.textContent = currentCard.num || meta.symbol;
    arcanaTitleText.textContent = currentCard.title;
    cardKindPrefixText.textContent = meta.label;

    const personalArcanaSlug = getPersonalArcanaSlug(currentCard);
    cardFlip3d.classList.toggle("personal-arcana-card", Boolean(personalArcanaSlug));
    arcanaIllustration.className = `card-illustration${personalArcanaSlug ? ' personal-arcana-art' : ''}`;
    arcanaIllustration.innerHTML = '';
    const imgUrl = getCardImagePath(currentCard);
    if (imgUrl) {
        arcanaIllustration.innerHTML = '';
        setBackgroundAssetImage(arcanaIllustration, imgUrl);
    } else {
        arcanaIllustration.style.backgroundImage = 'none';
        arcanaIllustration.innerHTML = `<div class="custom-card-symbol-badge">${currentCard.customSymbol || meta.symbol}</div>`;
    }

    arcanaStatementText.textContent = `"${currentCard.text}"`;
    renderRoundResolver();
    updateRitualStatus();

    cardFlip3d.classList.remove("flipped");
    switchScreen(screenReveal);

    setTimeout(() => {
        playSound('flip');
        cardFlip3d.classList.add("flipped");
        triggerBurst(window.innerWidth / 2, window.innerHeight / 2);
    }, 450);
}

function submitConfession() {
    if (!currentCard || getCardKind(currentCard) !== "confession") return;
    playSound('click');
    const drink = getDrinkCount(currentCard);
    const pointValue = getPointValue(currentCard);
    const drinkers = Array.from(confessedPlayers);
    const drinkResults = drinkers.map(idx => {
        const result = applyDrink(idx, drink);
        addPoints(idx, pointValue);
        return result;
    });

    const names = drinkers.map(idx => players[idx].name);
    const action = names.length === 1 ? "bebeu" : "beberam";
    const summary = names.length
        ? `${currentCard.title}: ${formatNameList(names)} ${action}. ${formatDrinkResults(drinkResults)}.`
        : `${currentCard.title}: ninguém confessou, ninguém bebeu.`;
    finishSuecaRound(summary, getDrinkResultIndexes(drinkResults));
}

function resolveDare(outcome) {
    playSound('click');
    const drink = getDrinkCount(currentCard);
    const points = getPointValue(currentCard);
    const active = players[activePlayerIndex];
    const drank = [];

    if (outcome === "did") {
        addPoints(activePlayerIndex, points);
        finishSuecaRound(`${active.name} cumpriu ${currentCard.title} e ganhou ${points} pontos.`);
        return;
    }

    if (outcome === "drink") {
        const drinkResult = applyDrink(activePlayerIndex, drink);
        if (drinkResult.amount > 0) drank.push(activePlayerIndex);
        finishSuecaRound(`${active.name} recusou ${currentCard.title}. ${formatDrinkResults([drinkResult])}.`, drank);
        return;
    }

    const drinkResult = applyDrink(activePlayerIndex, drink);
    addPoints(activePlayerIndex, points + 1);
    if (drinkResult.amount > 0) drank.push(activePlayerIndex);
    finishSuecaRound(`${active.name} fez a prenda e ainda pagou gole. ${formatDrinkResults([drinkResult])}.`, drank);
}

function resolveTarget(targetIndex) {
    playSound('click');
    const drink = getDrinkCount(currentCard);
    const target = players[targetIndex];
    const active = players[activePlayerIndex];
    const drinkResult = applyDrink(targetIndex, drink);
    addPoints(activePlayerIndex, getPointValue(currentCard));
    finishSuecaRound(`${active.name} mandou ${target.name} beber. ${formatDrinkResults([drinkResult])}.`, getDrinkResultIndexes([drinkResult]));
}

function resolveGroupCard() {
    playSound('click');
    const drink = getDrinkCount(currentCard);
    const drinkers = players.map((_, idx) => idx);
    const drinkResults = drinkers.map(idx => applyDrink(idx, drink));
    finishSuecaRound(`${currentCard.title}: a mesa inteira bebeu. ${formatDrinkResults(drinkResults)}.`, getDrinkResultIndexes(drinkResults));
}

function resolveRuleCard() {
    playSound('click');
    const active = players[activePlayerIndex];
    addPoints(activePlayerIndex, getPointValue(currentCard));
    activeRules.push(`${active.name}: regra da mesa ativa`);
    renderActiveRules();
    finishSuecaRound(`${active.name} criou uma regra nova para a mesa.`);
}

function renderActiveRules() {
    if (!rulesList) return;
    rulesList.innerHTML = '';
    
    let hasRules = false;

    if (questionMasterIndex !== -1) {
        hasRules = true;
        const badge = document.createElement("span");
        badge.className = "rule-badge";
        badge.innerHTML = `<strong>Mestre da Pergunta:</strong> ${players[questionMasterIndex].name}`;
        rulesList.appendChild(badge);
    }

    if (toiletPassIndex !== -1) {
        hasRules = true;
        const badge = document.createElement("span");
        badge.className = "rule-badge";
        badge.innerHTML = `<strong>Chave do Banheiro:</strong> ${players[toiletPassIndex].name}`;
        rulesList.appendChild(badge);
    }

    // Render partnerships
    Object.keys(partnerships).forEach(key => {
        const p1 = parseInt(key);
        const p2 = partnerships[key];
        if (p1 < p2 && players[p1] && players[p2]) {
            hasRules = true;
            const badge = document.createElement("span");
            badge.className = "rule-badge";
            badge.innerHTML = `<strong>Pacto:</strong> ${players[p1].name} + ${players[p2].name}`;
            rulesList.appendChild(badge);
        }
    });

    activeRules.forEach(rule => {
        hasRules = true;
        const badge = document.createElement("span");
        badge.className = "rule-badge";
        badge.textContent = rule;
        rulesList.appendChild(badge);
    });

    if (hasRules) {
        activeRulesPanel.classList.remove("hidden");
    } else {
        activeRulesPanel.classList.add("hidden");
    }
}

function updateCaliceSagradoDisplay() {
    if (!caliceSagradoContainer) return;
    caliceSagradoContainer.classList.add("hidden");
}

function updateScoreboard() {
    scoreboardPlayers.innerHTML = '';
    players.forEach((player, idx) => {
        const item = document.createElement("div");
        item.className = "score-item";
        item.classList.add(`arch-${player.archetype}`);
        if (idx === activePlayerIndex) {
            item.classList.add("active-turn");
        }

        const scoreHtml = `
            <span class="score-drinks">${player.lives || 0} ${player.lives === 1 ? 'gole' : 'goles'}</span>
            <span class="score-points">${player.points || 0} pts</span>
        `;

        const archLabel = getArchetypeLabel(player.archetype);
        const avatarVariant = idx === activePlayerIndex ? PLAYER_AVATAR_SELECTED_VARIANT : PLAYER_AVATAR_DEFAULT_VARIANT;
        item.innerHTML = `
            ${renderPlayerAvatar(player, "score-avatar", avatarVariant)}
            <span class="score-name">${escapeHTML(player.name)}</span>
            <span class="score-archetype">${archLabel}</span>
            ${scoreHtml}
        `;
        scoreboardPlayers.appendChild(item);
    });
}

function endGame() {
    playSound('gameover');
    stopHeartbeat();
    
    const rankedPlayers = [...players].sort((a, b) => {
        const pointsDiff = (b.points || 0) - (a.points || 0);
        if (pointsDiff !== 0) return pointsDiff;
        return (a.lives || 0) - (b.lives || 0);
    });

    listGameoverRankings.innerHTML = '';
    
    const maxPoints = Math.max(...rankedPlayers.map(p => p.points || 0));
    const maxDrinks = Math.max(...rankedPlayers.map(p => p.lives || 0));

    rankedPlayers.forEach((player, rank) => {
        const item = document.createElement("div");
        item.className = "ranking-item";

        // Assign mystical titles based on score and temperament
        let titleBadge = '';
        const archLabel = getArchetypeLabel(player.archetype);
        
        if ((player.points || 0) === maxPoints && maxPoints > 0) {
            titleBadge = `<span class="ranking-title-badge pure">${archLabel} da Glória</span>`;
        } else if ((player.lives || 0) === maxDrinks && maxDrinks > 0) {
            titleBadge = `<span class="ranking-title-badge doomed">${archLabel} Afundada</span>`;
        } else {
            titleBadge = `<span class="ranking-title-badge">${archLabel} Cúmplice</span>`;
        }

        const scoreText = `${player.points || 0} pts · ${player.lives || 0} ${player.lives === 1 ? 'gole' : 'goles'}`;

        item.innerHTML = `
            <div class="ranking-player-name">
                <span class="ranking-player-main">${renderPlayerAvatar(player, "ranking-avatar")}<span>${rank + 1}. ${escapeHTML(player.name)}</span></span>
                ${titleBadge}
            </div>
            <span class="ranking-lives-info">${scoreText}</span>
        `;
        listGameoverRankings.appendChild(item);
    });

    switchScreen(screenGameover);
}

// ==========================================================================
// LOBBY MANAGMENT
// ==========================================================================

function addPlayer(name) {
    if (players.length >= MAX_PLAYERS) {
        alert("O círculo místico atingiu o limite de almas!");
        return;
    }

    const nameClean = name.trim();
    if (!nameClean) return;

    // Check duplicate
    if (players.some(p => p.name.toLowerCase() === nameClean.toLowerCase())) {
        alert("Esta alma já foi invocada!");
        return;
    }

    // Get selected archetype
    const archetypeVal = document.querySelector('input[name="archetype"]:checked').value;

    players.push({
        name: nameClean,
        lives: INITIAL_GOLES,
        avatarSlug: getAvatarSlugForName(nameClean),
        archetype: archetypeVal
    });

    playSound('click');
    renderLobbyPlayers();
    inputPlayerName.value = '';
    
    // Auto-focus input for fast addition
    inputPlayerName.focus();
}

function addGuestPlayer() {
    if (players.length >= MAX_PLAYERS) {
        alert("O círculo místico atingiu o limite de almas!");
        return;
    }

    const baseName = "Outra pessoa";
    let guestName = baseName;
    let suffix = 2;
    while (players.some(p => p.name.toLowerCase() === guestName.toLowerCase())) {
        guestName = `${baseName} ${suffix}`;
        suffix += 1;
    }

    const archetypeVal = document.querySelector('input[name="archetype"]:checked')?.value || "labrador";
    players.push({
        name: guestName,
        lives: INITIAL_GOLES,
        points: 0,
        avatarSlug: null,
        archetype: archetypeVal
    });

    playSound('click');
    renderLobbyPlayers();
}

function removePlayer(idx) {
    playSound('click');
    players.splice(idx, 1);

    renderLobbyPlayers();
}

function renderLobbyPlayers() {
    listLobbyPlayers.innerHTML = '';
    
    if (players.length === 0) {
        listLobbyPlayers.innerHTML = `<li class="empty-list-msg">Nenhuma alma invocada ainda...</li>`;
        btnStartGame.classList.add("disabled");
        btnStartGame.disabled = true;
        return;
    }

    players.forEach((player, idx) => {
        const li = document.createElement("li");
        li.className = "player-badge";
        const archLabel = getArchetypeLabel(player.archetype);
        const archEffect = getArchetypeEffectText(player.archetype);
        li.innerHTML = `
            ${renderPlayerAvatar(player)}
            <span class="player-badge-name">${escapeHTML(player.name)}</span>
            <span class="player-archetype" aria-label="${archLabel}: ${archEffect}">
                <strong>${archLabel}</strong>
                <small>${archEffect}</small>
            </span>
            <button class="remove-player-btn" aria-label="Remover ${escapeHTML(player.name)}" data-index="${idx}">&times;</button>
        `;
        
        li.querySelector(".remove-player-btn").addEventListener("click", (e) => {
            const index = parseInt(e.currentTarget.getAttribute("data-index"));
            removePlayer(index);
        });

        listLobbyPlayers.appendChild(li);
    });

    // Require at least 2 players to start
    if (players.length >= 2) {
        btnStartGame.classList.remove("disabled");
        btnStartGame.disabled = false;
    } else {
        btnStartGame.classList.add("disabled");
        btnStartGame.disabled = true;
    }
}

// ==========================================================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================================================

// Add player event
formAddPlayer.addEventListener("submit", (e) => {
    e.preventDefault();
    addPlayer(inputPlayerName.value);
});

if (btnAddGuestPlayer) {
    btnAddGuestPlayer.addEventListener("click", () => {
        addGuestPlayer();
    });
}

// Start game event
btnStartGame.addEventListener("click", () => {
    if (players.length < 2) return;
    playSound('click');
    setupNewGame();
});

// Draw card event
visualCardDeck.addEventListener("click", () => {
    drawCard();
});

function isTypingTarget(element) {
    if (!element) return false;
    const tagName = element.tagName;
    return element.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || tagName === "BUTTON";
}

function canUseDrawHotkey(event) {
    const isDrawKey = event.key === "Enter" || event.key === " ";
    if (!isDrawKey) return false;
    if (!screenGameplay.classList.contains("active")) return false;
    if (document.querySelector("dialog[open]")) return false;
    if (isTypingTarget(document.activeElement)) return false;
    return cardDeck.length > 0;
}

document.addEventListener("keydown", (event) => {
    if (!canUseDrawHotkey(event)) return;
    event.preventDefault();
    drawCard();
});

// Submit confession event
btnSubmitConfession.addEventListener("click", () => {
    submitConfession();
});

// Restart game event
btnRestartGame.addEventListener("click", () => {
    playSound('click');
    setupNewGame();
});

// Toggle sound event
btnToggleSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    const soundIcon = btnToggleSound.querySelector(".sound-icon");
    if (soundEnabled) {
        soundIcon.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>`;
        initAudio();
        playSound('click');
        startAmbientDrone();
    } else {
        soundIcon.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
            <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
            <path d="M18 8a6 6 0 0 0-9.33-5"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>`;
        stopAmbientDrone();
    }
});

// Forjar card listeners
if (btnOpenForge) {
    btnOpenForge.addEventListener("click", () => {
        playSound('click');
        customCardDialog.showModal();
    });
}

if (btnCloseDialog) {
    btnCloseDialog.addEventListener("click", () => {
        playSound('click');
        customCardDialog.close();
    });
}

// Fallback for light-dismiss (clicking outside the dialog)
if (customCardDialog && !('closedBy' in HTMLDialogElement.prototype)) {
    customCardDialog.addEventListener('click', (event) => {
        if (event.target !== customCardDialog) return;
        const rect = customCardDialog.getBoundingClientRect();
        const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        customCardDialog.close();
    });
}

if (formCustomCard) {
    formCustomCard.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = inputCustomTitle.value.trim().toUpperCase();
        const text = inputCustomText.value.trim();
        const symbol = document.querySelector('input[name="custom-symbol"]:checked').value;
        
        if (!title || !text) return;
        
        const newCard = {
            id: 100 + customCards.length,
            title: title,
            num: "✶",
            image: null,
            text: text,
            isCustom: true,
            customSymbol: symbol
        };
        
        customCards.push(newCard);
        try {
            localStorage.setItem("tarot_custom_cards", JSON.stringify(customCards));
        } catch (e) {}
        
        playSound('confess');
        
        inputCustomTitle.value = '';
        inputCustomText.value = '';
        customCardDialog.close();
    });
}

// ==========================================================================
// MYSTIC PARTICLES SYSTEM (HTML5 Canvas)
// ==========================================================================

class MysticParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + Math.random() * 50;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = Math.random() * 0.003 + 0.001;
        this.isRune = Math.random() < 0.07;
        this.runeSymbol = this.isRune ? ['☽', '⛧', '✶', '✦', '✺', '◇'][Math.floor(Math.random() * 6)] : '';
        
        if (currentTheme === 'cosmic') {
            this.color = this.isRune ? '218, 112, 214' : '186, 85, 211'; // orchid/purple
            if (Math.random() < 0.15) this.color = '255, 46, 99'; // cosmic pink
        } else if (currentTheme === 'classic') {
            this.color = '110, 80, 50'; // charcoal / sepia ash
            if (Math.random() < 0.1) this.color = '166, 36, 36'; // dark crimson ash
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleAmount = Math.random() * 0.5 + 0.2;
        } else {
            this.color = this.isRune ? '219, 180, 97' : '217, 180, 97'; // gold
            if (Math.random() < 0.1) this.color = '166, 36, 36'; // crimson spark
        }
    }

    update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;

        if (currentTheme === 'classic') {
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * this.wobbleAmount;
        }

        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                const force = (80 - dist) / 80;
                this.x += (dx / dist) * force * 1.5;
            }
        }

        if (this.alpha <= 0 || this.x < 0 || this.x > this.canvas.width || this.y < -20) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        if (this.isRune) {
            ctx.fillStyle = `rgb(${this.color})`;
            ctx.font = `${Math.floor(this.size * 5 + 6)}px 'Almendra', Georgia, serif`;
            ctx.fillText(this.runeSymbol, this.x, this.y);
        } else {
            ctx.fillStyle = `rgb(${this.color})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

class BurstParticle extends MysticParticle {
    constructor(canvas, x, y) {
        super(canvas);
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.decay = Math.random() * 0.02 + 0.015;
        this.alpha = 1.0;
        this.size = Math.random() * 3 + 1.5;
    }

    update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }
}

let canvasParticles = null;
let ctxParticles = null;
let particles = [];
let burstParticles = [];
let mouseX = undefined;
let mouseY = undefined;

function triggerBurst(x, y) {
    if (!canvasParticles) return;
    const count = 25;
    for (let i = 0; i < count; i++) {
        burstParticles.push(new BurstParticle(canvasParticles, x, y));
    }
}

function initParticles() {
    canvasParticles = document.getElementById("mystic-particles");
    if (!canvasParticles) return;
    
    ctxParticles = canvasParticles.getContext("2d");
    
    function resizeCanvas() {
        canvasParticles.width = window.innerWidth;
        canvasParticles.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
 
    particles = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
        particles.push(new MysticParticle(canvasParticles));
    }

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouseX = undefined;
        mouseY = undefined;
    });

    animateParticles();
}

function animateParticles() {
    if (!ctxParticles) return;
    ctxParticles.clearRect(0, 0, canvasParticles.width, canvasParticles.height);
    
    // Draw connections/constellations for theme-cosmic first
    if (currentTheme === 'cosmic') {
        ctxParticles.save();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    const alpha = ((80 - dist) / 80) * (particles[i].alpha * particles[j].alpha) * 0.25;
                    ctxParticles.strokeStyle = `rgba(186, 85, 211, ${alpha})`;
                    ctxParticles.lineWidth = 0.5;
                    ctxParticles.beginPath();
                    ctxParticles.moveTo(particles[i].x, particles[i].y);
                    ctxParticles.lineTo(particles[j].x, particles[j].y);
                    ctxParticles.stroke();
                }
            }
        }
        ctxParticles.restore();
    }

    // Update and draw normal particles
    particles.forEach(p => {
        p.update(mouseX, mouseY);
        p.draw(ctxParticles);
    });

    // Update and draw burst particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.update(mouseX, mouseY);
        if (bp.alpha <= 0) {
            burstParticles.splice(i, 1);
        } else {
            bp.draw(ctxParticles);
        }
    }

    requestAnimationFrame(animateParticles);
}

// Initialize Lobby UI and Particles
renderLobbyPlayers();
initParticles();

// Initialize Theme Selector
if (themeSelector) {
    currentTheme = themeSelector.value;
    document.body.className = `theme-${currentTheme}`;
    themeSelector.addEventListener("change", (e) => {
        currentTheme = e.target.value;
        document.body.className = `theme-${currentTheme}`;
        playSound('click');
        
        refreshRenderedAvatarImages();

        // Update personal arcana image if a themed personal card is revealed.
        if (currentCard && getPersonalArcanaSlug(currentCard)) {
            const imgUrl = getCardImagePath(currentCard);
            arcanaIllustration.innerHTML = '';
            setBackgroundAssetImage(arcanaIllustration, imgUrl);
        }
        
        updateAmbientDroneFrequency();
        updateScoreboard();
    });
}

// ==========================================================================
// GRIMÓRIO (HISTORY OF CONFESSIONS)
// ==========================================================================

if (btnOpenGrimoire) {
    btnOpenGrimoire.addEventListener("click", () => {
        playSound('click');
        renderGrimoire();
        grimoireDialog.showModal();
    });
}

if (btnCloseGrimoire) {
    btnCloseGrimoire.addEventListener("click", () => {
        playSound('click');
        grimoireDialog.close();
    });
}

// Click outside to close for grimoire dialog
if (grimoireDialog && !('closedBy' in HTMLDialogElement.prototype)) {
    grimoireDialog.addEventListener('click', (event) => {
        if (event.target !== grimoireDialog) return;
        const rect = grimoireDialog.getBoundingClientRect();
        const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        grimoireDialog.close();
    });
}

function renderGrimoire() {
    if (!grimoireHistoryContent) return;
    
    if (gameHistory.length === 0) {
        grimoireHistoryContent.innerHTML = `<p class="empty-list-msg" style="text-align:center; padding: 2rem 0; opacity: 0.7;">Nenhum arcano foi revelado nesta sessão ainda...</p>`;
        return;
    }
    
    grimoireHistoryContent.innerHTML = '';
    
    gameHistory.forEach(entry => {
        const item = document.createElement("div");
        item.className = "grimoire-item";
        const summaryText = entry.summary || "Rodada resolvida.";
        
        item.innerHTML = `
            <div class="grimoire-item-header">
                <span>${entry.cardTitle}</span>
                <small style="opacity: 0.8; font-size: 0.8rem;">Tirada por: ${entry.targetPlayer}</small>
            </div>
            <p class="grimoire-item-text">"${entry.cardText}"</p>
            <div class="grimoire-item-confessed">${escapeHTML(summaryText)}</div>
        `;
        grimoireHistoryContent.appendChild(item);
    });
}
