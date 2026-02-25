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

    playerLevel: 1,
    playerExp: 0,
    cardBox: ['atk_5', 'atk_5', 'atk_5'], // Starting cards from Lvl 1

    enemyLevel: 1,
    enemyCardBox: [], // Adaptations for opponent monsters

    isProcessing: false,
    items: [], // Array of key item IDs
    logs: []   // Redundant copy check if needed, but we'll use Overworld.logsCollected
};
