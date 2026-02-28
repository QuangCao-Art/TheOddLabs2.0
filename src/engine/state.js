import { MONSTERS } from '../data/monsters.js';

export const gameState = {
    // Team Management
    playerTeam: ['nitrophil', 'cambihil', 'lydrosome'],
    enemyTeam: ['nitrophil', 'cambihil', 'lydrosome'],
    cellDex: ['nitrophil', 'cambihil', 'lydrosome'],

    // Full Party Objects (Initialized during resetGame)
    playerParty: [],
    enemyParty: [],

    player: null, // Points to the active player monster
    enemy: null,  // Points to the active enemy monster

    // Unified Profile System (Management Hub Presets)
    profiles: {
        player: { level: 15, cardBox: [], team: ['nitrophil', 'cambihil', 'lydrosome'], party: [], name: 'PLAYER' },
        opponent: { level: 15, cardBox: [], team: ['nitrophil', 'cambihil', 'lydrosome'], party: [], name: 'RIVAL' },
        lana: { level: 5, cardBox: [], team: ['cambihil'], party: [], name: 'LANA' },
        dyzes: { level: 9, cardBox: [], team: ['lydrosome', 'lydrosome'], party: [], name: 'DYZES' },
        capsain: { level: 15, cardBox: [], team: ['nitrophil', 'nitrophil', 'nitrophil'], party: [], name: 'CAPSAIN' },
        jenzi: { level: 0, cardBox: [], team: ['cambihil', 'nitrophil', 'lydrosome'], party: [], name: 'JENZI' },
        npc01: { level: 2, cardBox: [], team: ['nitrophil'], party: [], name: 'NPC01_M' },
        npc02: { level: 6, cardBox: [], team: ['lydrosome'], party: [], name: 'NPC02_F' },
        npc03: { level: 12, cardBox: [], team: ['cambihil'], party: [], name: 'NPC03_M' }
    },

    isProcessing: false,
    items: [], // Array of key item IDs
    logs: []   // Redundant copy check if needed
};
