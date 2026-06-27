// ==========================================================================
// GAME STATE & CONSTANTS
// ==========================================================================

const MAX_LIVES = 5;
const PLAYER_ICONS = ['🦉', '🐍', '💀', '🍷', '☀️', '🌙', '🌟', '🗝️', '🐺', '🔥'];

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
    { id: 6, title: "OS ENAMORADOS", num: "VI", image: null, text: "comprei um presente super elaborado ou fiz uma playlist gigante com significados ocultos para alguém com quem só saí duas vezes.", special: "Pacto de Enamorados: Se exatamente duas jogadoras confessarem, elas não perdem essência. Caso contrário, perdem 1 cálice." },
    { id: 7, title: "O CARRO", num: "VII", image: null, text: "errei a entrada da rua ou passei do ponto fofocando tanto com as amigas que esqueci para onde estava dirigindo." },
    { id: 8, title: "A JUSTIÇA", num: "VIII", image: null, text: "peguei um ranço eterno e inabalável da ex de uma amiga próxima por pura solidariedade feminina." },
    { id: 9, title: "O EREMITA", num: "IX", image: null, text: "sumi do rolê ou cancelei de última hora para ficar isolada em casa com meus bichinhos assistindo série sáfica." },
    { id: 10, title: "A RODA DA FORTUNA", num: "X", image: null, text: "participei de um grupo de amigas onde quase todo mundo já tinha ficado com todo mundo em algum momento do passado.", special: "Roda da Fortuna: O destino gira! Quem confessar desta vez recupera 1 cálice de essência; quem não confessar perde 1 cálice." },
    { id: 11, title: "A FORÇA", num: "XI", image: null, text: "tentei carregar algo super pesado ou fazer trabalho manual complexo sozinha só para provar a mim mesma que mulheres conseguem tudo.", special: "Força Singular: Se apenas uma jogadora confessar, ela não perde essência. Se duas ou mais confessarem, todas perdem 1 cálice." },
    { id: 12, title: "O ENFORCADO", num: "XII", image: null, text: "fiquei presa em um chove-não-molha sáfico por meses sabendo lá no fundo que não daria em nada." },
    { id: 13, title: "A MORTE", num: "XIII", image: "assets/arcana-death.png", text: "dei um 'mute' ou deixei de seguir mais de 10 conhecidas do círculo sáfico local de uma vez só para preservar minha paz de espírito." },
    { id: 14, title: "A TEMPERANÇA", num: "XIV", image: null, text: "tentei acalmar uma fofoca na roda contando um segredo mas finalizando com a frase clássica: 'mas não espalha, hein'." },
    { id: 15, title: "O DIABO", num: "XV", image: "assets/arcana-devil.png", text: "mandei mensagem de 'oi sumida' nas redes sociais nas primeiras horas da madrugada para aquela garota que tinha me deixado no vácuo." },
    { id: 16, title: "A TORRE", num: "XVI", image: "assets/arcana-tower.png", text: "causei ou alimentei um drama gigante em um grupo de WhatsApp ou no meio do rolê por conta de um mal-entendido bobo." },
    { id: 17, title: "A ESTRELA", num: "XVII", image: null, text: "treinei uma DR (discussão de relação) inteira na minha mente ou no espelho do banheiro fingindo estar conversando com a pessoa." },
    { id: 18, title: "A LUA", num: "XVIII", image: "assets/arcana-moon.png", text: "passei mais de duas horas stalkeando o perfil de um crush até descobrir qual era o signo solar, lunar e ascendente dela." },
    { id: 19, title: "O SOL", num: "XIX", image: null, text: "tentei paquerar alguém de forma direta e a pessoa achou que eu estava apenas sendo 'uma amiga extremamente simpática e fofa'." },
    { id: 20, title: "O JULGAMENTO", num: "XX", image: null, text: "mandei mensagem ou print reclamando das atitudes de um crush ou amiga para a própria pessoa por puro engano.", special: "Julgamento Coletivo: Se a maioria das jogadoras confessar, ninguém perde essência. Se for metade ou menos, as confessadas perdem 2 cálices." },
    { id: 21, title: "O MUNDO", num: "XXI", image: null, text: "aluguei um caminhão de mudança ou comecei a dividir teto (o clássico meme U-Haul) antes de completar seis meses de relacionamento." },
    { id: 22, title: "A ANDRESSA", num: "XXII", image: "assets/arcana-andressa.png", text: "comprei mais uma blusa preta, fiz outra tatuagem de dragão ou passei a noite inteira bebendo martini fingindo desinteresse só para chamar a atenção da garota." },
    { id: 23, title: "A PATRÍCIA", num: "XXIII", image: "assets/arcana-patricia.png", text: "passei duas horas fazendo um delineado gótico impecável só para ir ao mercado, ou comprei uma camiseta de streetwear três tamanhos maior só para parecer descolada." },
    { id: 24, title: "A SABRINA", num: "XXIV", image: "assets/arcana-sabrina.png", text: "usei um colar de Senhor dos Anéis (a Estrela Vespertina), passei batom escuro e fiz pose de paz e amor fingindo ser durona de jaqueta de couro." },
    { id: 25, title: "A SHAI", num: "XXV", image: "assets/arcana-shai.png", text: "comprei um bolo decorado de natal inteiro só para tirar fotos estéticas, ou passei horas me admirando no espelho com look brilhante e choker preta." },
    { id: 26, title: "A ANA", num: "XXVI", image: "assets/arcana-ana.png", text: "andei com uma caneca de metal pela casa fingindo sobriedade, tirei foto com fundo de nuvens falsas ou fiz mais uma tatuagem minimalista no braço." }
];

// Active State
let players = [
    { name: "Sabrina", lives: MAX_LIVES, icon: PLAYER_ICONS[0], archetype: "labrador" },
    { name: "Shai", lives: MAX_LIVES, icon: PLAYER_ICONS[1], archetype: "gato-preto" },
    { name: "Andressa", lives: MAX_LIVES, icon: PLAYER_ICONS[2], archetype: "labrador" },
    { name: "Patrícia", lives: MAX_LIVES, icon: PLAYER_ICONS[3], archetype: "gato-preto" },
    { name: "Ana", lives: MAX_LIVES, icon: PLAYER_ICONS[4], archetype: "gato-preto" }
];
let cardDeck = [];
let activePlayerIndex = 0;
let currentCard = null;
let confessedPlayers = new Set(); // holds indexes of players who confessed for current card
let currentTheme = 'gold';

// DOM Elements
const screenLobby = document.getElementById("screen-lobby");
const screenGameplay = document.getElementById("screen-gameplay");
const screenReveal = document.getElementById("screen-reveal");
const screenGameover = document.getElementById("screen-gameover");

const formAddPlayer = document.getElementById("form-add-player");
const inputPlayerName = document.getElementById("player-name-input");
const listLobbyPlayers = document.getElementById("lobby-players-list");
const btnStartGame = document.getElementById("btn-start-game");

const activePlayerNameText = document.getElementById("active-player-name");
const visualCardDeck = document.getElementById("mystic-card-deck");
const scoreboardPlayers = document.getElementById("scoreboard-players");

const cardFlip3d = document.getElementById("card-flip-3d");
const arcanaNumberText = document.getElementById("arcana-number");
const arcanaTitleText = document.getElementById("arcana-title");
const arcanaIllustration = document.getElementById("arcana-illustration");
const arcanaStatementText = document.getElementById("arcana-statement");
const listConfessionPlayers = document.getElementById("confession-players-list");
const btnSubmitConfession = document.getElementById("btn-submit-confession");

const btnRestartGame = document.getElementById("btn-restart-game");
const btnToggleSound = document.getElementById("btn-toggle-sound");
const themeSelector = document.getElementById("theme-selector");

const customCardDialog = document.getElementById("custom-card-dialog");
const formCustomCard = document.getElementById("form-custom-card");
const btnOpenForge = document.getElementById("btn-open-forge");
const btnCloseDialog = document.getElementById("btn-close-dialog");
const inputCustomTitle = document.getElementById("custom-card-title");
const inputCustomText = document.getElementById("custom-card-text");

let customCards = [];

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
        if (!document.startViewTransition) {
            toScreen.focus();
        }
    };

    if (document.startViewTransition) {
        const transition = document.startViewTransition(updateDOM);
        transition.finished.finally(() => {
            toScreen.focus();
        });
    } else {
        updateDOM();
    }
}

// ==========================================================================
// GAMEPLAY LOGIC
// ==========================================================================

function setupNewGame() {
    players = players.map(p => ({ ...p, lives: MAX_LIVES }));
    cardDeck = shuffle([...ALL_CARDS, ...customCards]);
    activePlayerIndex = 0;
    currentCard = null;
    confessedPlayers.clear();
    
    updateScoreboard();
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
    
    // Check if any player has died
    const deadPlayers = players.filter(p => p.lives <= 0);
    if (deadPlayers.length > 0 || cardDeck.length === 0) {
        endGame();
        return;
    }

    const activePlayer = players[activePlayerIndex];
    activePlayerNameText.textContent = `${activePlayer.icon} ${activePlayer.name}`;
    
    // Highlight active player on scoreboard
    updateScoreboard();
}

function drawCard() {
    if (cardDeck.length === 0) {
        endGame();
        return;
    }

    playSound('draw');
    currentCard = cardDeck.pop();
    confessedPlayers.clear();

    // Populate Card details
    arcanaNumberText.textContent = currentCard.num;
    arcanaTitleText.textContent = currentCard.title;
    
    // Card illustration logic
    arcanaIllustration.className = 'card-illustration';
    if (currentCard.image) {
        let imgUrl = currentCard.image;
        if (currentCard.id >= 22 && currentCard.id <= 26) {
            const playerNamesMap = {
                22: 'andressa',
                23: 'patricia',
                24: 'sabrina',
                25: 'shai',
                26: 'ana'
            };
            imgUrl = `assets/${playerNamesMap[currentCard.id]}-${currentTheme}.png`;
        }
        arcanaIllustration.style.backgroundImage = `url('${imgUrl}')`;
    } else if (currentCard.isCustom) {
        arcanaIllustration.style.backgroundImage = 'none';
        arcanaIllustration.innerHTML = `<div class="custom-card-symbol-badge">${currentCard.customSymbol}</div>`;
    } else {
        arcanaIllustration.innerHTML = '';
        arcanaIllustration.classList.add('placeholder-art');
        arcanaIllustration.style.backgroundImage = 'none';
    }

    // Statement text (special description if applicable)
    if (currentCard.special) {
        arcanaStatementText.innerHTML = `<strong>${currentCard.special}</strong><br><br>"${currentCard.text}"`;
    } else {
        arcanaStatementText.textContent = `"${currentCard.text}"`;
    }

    // Set up confession checklist
    listConfessionPlayers.innerHTML = '';
    players.forEach((player, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "confession-btn";
        btn.setAttribute("data-player-index", idx);
        btn.innerHTML = `<span class="player-icon">${player.icon}</span> ${player.name} <span class="confession-mark">🍷</span>`;
        
        btn.addEventListener("click", () => {
            playSound('click');
            if (confessedPlayers.has(idx)) {
                confessedPlayers.delete(idx);
                btn.classList.remove("confessed");
            } else {
                confessedPlayers.add(idx);
                btn.classList.add("confessed");
            }
        });
        listConfessionPlayers.appendChild(btn);
    });

    // Reset 3D card layout rotation
    cardFlip3d.classList.remove("flipped");

    switchScreen(screenReveal);

    // Perform flip animation after screen transition
    setTimeout(() => {
        playSound('flip');
        cardFlip3d.classList.add("flipped");
    }, 450);
}

function submitConfession() {
    playSound('click');

    // Apply lives deduction or specials
    const totalConfessed = confessedPlayers.size;
    const majorityThreshold = players.length / 2;

    players.forEach((player, idx) => {
        if (currentCard.id === 10) { // Roda da Fortuna special
            if (confessedPlayers.has(idx)) {
                player.lives = Math.min(MAX_LIVES, player.lives + 1);
            } else {
                player.lives = Math.max(0, player.lives - 1);
            }
        } else if (currentCard.id === 6) { // Os Enamorados special
            if (totalConfessed === 2) {
                // Protected!
            } else {
                if (confessedPlayers.has(idx)) {
                    player.lives = Math.max(0, player.lives - 1);
                }
            }
        } else if (currentCard.id === 11) { // A Força special
            if (totalConfessed === 1) {
                // Protected!
            } else {
                if (confessedPlayers.has(idx)) {
                    player.lives = Math.max(0, player.lives - 1);
                }
            }
        } else if (currentCard.id === 20) { // O Julgamento special
            if (totalConfessed > majorityThreshold) {
                // Protected!
            } else {
                if (confessedPlayers.has(idx)) {
                    player.lives = Math.max(0, player.lives - 2);
                }
            }
        } else { // Standard card
            if (confessedPlayers.has(idx)) {
                player.lives = Math.max(0, player.lives - 1);
            }
        }
    });

    // Animate lives lost on scoreboard
    updateScoreboard();

    // Sound effect if someone confessed
    if (confessedPlayers.size > 0) {
        setTimeout(() => playSound('confess'), 300);
    }

    // Advance turn to next player
    activePlayerIndex = (activePlayerIndex + 1) % players.length;

    // Check game over condition or transition back to deck
    setTimeout(() => {
        const deadPlayers = players.filter(p => p.lives <= 0);
        if (deadPlayers.length > 0 || cardDeck.length === 0) {
            endGame();
        } else {
            prepareNextTurn();
            switchScreen(screenGameplay);
        }
    }, 800);
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

        // Chalices icons
        let chalicesHtml = '';
        for (let i = 1; i <= MAX_LIVES; i++) {
            if (i <= player.lives) {
                chalicesHtml += `<span class="chalice-icon">🍷</span>`;
            } else {
                chalicesHtml += `<span class="chalice-icon lost">🍷</span>`;
            }
        }

        const archIcon = player.archetype === 'labrador' ? '🐕' : '🐈';
        item.innerHTML = `
            <span class="score-name">${player.icon} ${player.name} <span class="archetype-icon" title="${player.archetype}">${archIcon}</span></span>
            <div class="score-lives">${chalicesHtml}</div>
        `;
        scoreboardPlayers.appendChild(item);
    });
}

function endGame() {
    playSound('gameover');
    
    // Sort players by lives descending to show ranking
    const rankedPlayers = [...players].sort((a, b) => b.lives - a.lives);

    listGameoverRankings.innerHTML = '';
    
    const maxRemainingLives = Math.max(...rankedPlayers.map(p => p.lives));
    const minRemainingLives = Math.min(...rankedPlayers.map(p => p.lives));

    rankedPlayers.forEach((player, rank) => {
        const item = document.createElement("div");
        item.className = "ranking-item";

        // Assign mystical titles based on score and temperament
        let titleBadge = '';
        const archLabel = player.archetype === 'labrador' ? 'Labrador' : 'Gato Preto';
        const archIcon = player.archetype === 'labrador' ? '🐕' : '🐈';
        
        if (player.lives === maxRemainingLives && player.lives > 0) {
            titleBadge = `<span class="ranking-title-badge pure">${archLabel} Celestial</span>`;
        } else if (player.lives === 0 || player.lives === minRemainingLives) {
            titleBadge = `<span class="ranking-title-badge doomed">${archLabel} Caótico</span>`;
        } else {
            titleBadge = `<span class="ranking-title-badge">${archLabel} Cúmplice</span>`;
        }

        item.innerHTML = `
            <div class="ranking-player-name">
                <span>${rank + 1}. ${player.icon} ${player.name} <small style="opacity:0.75;">(${archIcon})</small></span>
                ${titleBadge}
            </div>
            <span class="ranking-lives-info">${player.lives} / ${MAX_LIVES} Cálices</span>
        `;
        listGameoverRankings.appendChild(item);
    });

    switchScreen(screenGameover);
}

// ==========================================================================
// LOBBY MANAGMENT
// ==========================================================================

function addPlayer(name) {
    if (players.length >= PLAYER_ICONS.length) {
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

    // Draw unique icon
    const iconIndex = players.length;
    const icon = PLAYER_ICONS[iconIndex];

    players.push({
        name: nameClean,
        lives: MAX_LIVES,
        icon: icon,
        archetype: archetypeVal
    });

    playSound('click');
    renderLobbyPlayers();
    inputPlayerName.value = '';
    
    // Auto-focus input for fast addition
    inputPlayerName.focus();
}

function removePlayer(idx) {
    playSound('click');
    players.splice(idx, 1);
    
    // Re-assign icons based on order
    players.forEach((p, i) => {
        p.icon = PLAYER_ICONS[i];
    });

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
        const archIcon = player.archetype === 'labrador' ? '🐕' : '🐈';
        li.innerHTML = `
            <span class="player-icon">${player.icon}</span>
            <span>${player.name} <small style="font-size:0.75rem; opacity:0.8;">(${archIcon})</small></span>
            <button class="remove-player-btn" aria-label="Remover ${player.name}" data-index="${idx}">&times;</button>
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
    btnToggleSound.querySelector(".sound-icon").textContent = soundEnabled ? "🔔" : "🔕";
    if (soundEnabled) {
        initAudio();
        playSound('click');
        startAmbientDrone();
    } else {
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
            num: "🔮",
            image: null,
            text: text,
            isCustom: true,
            customSymbol: symbol
        };
        
        customCards.push(newCard);
        
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
        this.runeSymbol = this.isRune ? ['☽', '⛧', '🍷', '🗝️', '⭐', '👁️'][Math.floor(Math.random() * 6)] : '';
        
        if (currentTheme === 'cosmic') {
            this.color = this.isRune ? '218, 112, 214' : '186, 85, 211'; // orchid/purple
            if (Math.random() < 0.15) this.color = '255, 46, 99'; // cosmic pink
        } else if (currentTheme === 'classic') {
            this.color = '110, 80, 50'; // charcoal / sepia ash
            if (Math.random() < 0.1) this.color = '166, 36, 36'; // dark crimson ash
        } else {
            this.color = this.isRune ? '219, 180, 97' : '217, 180, 97'; // gold
            if (Math.random() < 0.1) this.color = '166, 36, 36'; // crimson spark
        }
    }

    update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;

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

let canvasParticles = null;
let ctxParticles = null;
let particles = [];
let mouseX = undefined;
let mouseY = undefined;

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
    particles.forEach(p => {
        p.update(mouseX, mouseY);
        p.draw(ctxParticles);
    });
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
        
        // Update active player card image if revealed
        if (currentCard && (currentCard.id >= 22 && currentCard.id <= 26)) {
            const playerNamesMap = {
                22: 'andressa',
                23: 'patricia',
                24: 'sabrina',
                25: 'shai',
                26: 'ana'
            };
            const imgUrl = `assets/${playerNamesMap[currentCard.id]}-${currentTheme}.png`;
            arcanaIllustration.style.backgroundImage = `url('${imgUrl}')`;
        }
        
        updateAmbientDroneFrequency();
        updateScoreboard();
    });
}
