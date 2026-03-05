import { MONSTERS } from '../data/monsters.js';

export let DEBUG_MODE = false; // Set to false to start a real game from scratch

export const gameState = {
    exp: 0,
    credits: 0,
    // Team Management
    playerTeam: DEBUG_MODE ? ['nitrophil', 'lydrosome', 'cambihil'] : [],
    enemyTeam: DEBUG_MODE ? ['nitrophil', 'cambihil', 'lydrosome'] : [],
    cellDex: DEBUG_MODE ? ['nitrophil', 'cambihil', 'lydrosome'] : [],

    // Full Party Objects (Initialized during resetGame)
    playerParty: [],
    enemyParty: [],

    player: null, // Points to the active player monster
    enemy: null,  // Points to the active enemy monster

    // Unified Profile System (Management Hub Presets)
    profiles: {
        player: {
            level: DEBUG_MODE ? 20 : 0,
            cardBox: [],
            team: DEBUG_MODE ? ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'] : [],
            party: [],
            name: 'PLAYER'
        },
        opponent: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'RIVAL' },
        lana: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'LANA' },
        dyzes: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'DYZES' },
        capsain: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'CAPSAIN' },
        jenzi: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'JENZI' },
        npc01: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'NPC01_M' },
        npc02: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'NPC02_F' },
        npc03: { level: 0, cardBox: [], team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'], party: [], name: 'NPC03_M' }
    },

    storyFlags: {
        starterChosen: DEBUG_MODE,
        jenziFirstBattleDone: DEBUG_MODE,
        jenziAtriumUnlocked: DEBUG_MODE
    },

    isProcessing: false,
    items: DEBUG_MODE ? ['datapad', 'card_stemmy'] : [], // Logs/Key items collected
    logs: []   // Redundant copy check if needed
};

export function applyDebugMode(isDebug) {
    DEBUG_MODE = isDebug;
    gameState.exp = 0;
    gameState.credits = 0;

    gameState.playerTeam = DEBUG_MODE ? ['nitrophil', 'lydrosome', 'cambihil'] : [];
    gameState.enemyTeam = DEBUG_MODE ? ['nitrophil', 'cambihil', 'lydrosome'] : [];
    gameState.cellDex = DEBUG_MODE ? ['nitrophil', 'cambihil', 'lydrosome'] : [];

    gameState.playerParty = [];
    gameState.enemyParty = [];

    gameState.profiles.player.level = DEBUG_MODE ? 20 : 0;
    gameState.profiles.player.team = DEBUG_MODE ? ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'] : [];
    gameState.profiles.player.cardBox = [];
    gameState.profiles.player.party = [];

    gameState.storyFlags.starterChosen = DEBUG_MODE;
    gameState.storyFlags.jenziFirstBattleDone = DEBUG_MODE;

    gameState.items = DEBUG_MODE ? ['datapad', 'card_stemmy'] : [];
    gameState.logs = [];
}
