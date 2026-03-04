import { MONSTERS } from '../data/monsters.js';

export const gameState = {
    exp: 0,
    credits: 0,
    // Team Management
    playerTeam: ['nitrophil', 'lydrosome', 'cambihil'],
    enemyTeam: ['nitrophil', 'cambihil', 'lydrosome'],
    cellDex: ['nitrophil', 'cambihil', 'lydrosome'],

    // Full Party Objects (Initialized during resetGame)
    playerParty: [],
    enemyParty: [],

    player: null, // Points to the active player monster
    enemy: null,  // Points to the active enemy monster

    // Unified Profile System (Management Hub Presets)
    profiles: {
        player: {
            level: 0,
            cardBox: [],
            team: ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'],
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

    isProcessing: false,
    items: ['datapad', 'card_stemmy'], // Logs/Key items collected
    logs: []   // Redundant copy check if needed
};
