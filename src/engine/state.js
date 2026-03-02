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
        player: { level: 15, cardBox: [], team: ['nitrophil', 'nitrophil', 'nitrophil', 'cambihil', 'cambihil', 'cambihil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'PLAYER' },
        opponent: { level: 15, cardBox: [], team: ['nitrophil', 'nitrophil', 'nitrophil', 'cambihil', 'cambihil', 'cambihil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'RIVAL' },
        lana: { level: 5, cardBox: [], team: ['cambihil', 'cambihil', 'cambihil', 'nitrophil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'LANA' },
        dyzes: { level: 9, cardBox: [], team: ['lydrosome', 'lydrosome', 'lydrosome', 'nitrophil', 'nitrophil', 'nitrophil', 'cambihil', 'cambihil', 'cambihil'], party: [], name: 'DYZES' },
        capsain: { level: 13, cardBox: [], team: ['nitrophil', 'nitrophil', 'nitrophil', 'cambihil', 'cambihil', 'cambihil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'CAPSAIN' },
        jenzi: { level: 15, cardBox: [], team: ['cambihil', 'cambihil', 'cambihil', 'nitrophil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'JENZI' },
        npc01: { level: 2, cardBox: [], team: ['nitrophil', 'nitrophil', 'nitrophil', 'cambihil', 'cambihil', 'cambihil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'NPC01_M' },
        npc02: { level: 6, cardBox: [], team: ['lydrosome', 'lydrosome', 'lydrosome', 'nitrophil', 'nitrophil', 'nitrophil', 'cambihil', 'cambihil', 'cambihil'], party: [], name: 'NPC02_F' },
        npc03: { level: 10, cardBox: [], team: ['cambihil', 'cambihil', 'cambihil', 'nitrophil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'lydrosome'], party: [], name: 'NPC03_M' }
    },

    isProcessing: false,
    items: [], // Array of key item IDs
    logs: []   // Redundant copy check if needed
};
