import { MONSTERS } from '../data/monsters.js';

export const gameState = {
    // Team Management
    playerTeam: ['nitrophil', 'cambihil', 'lydrosome'],
    cellDex: ['nitrophil', 'cambihil', 'lydrosome'],

    player: {
        ...JSON.parse(JSON.stringify(MONSTERS.nitrophil)), // Initial default, will be overridden by team leader
        currentNode: null,
        selectedMove: 'membrane_pierce'
    },
    enemy: {
        ...JSON.parse(JSON.stringify(MONSTERS.nitrophil)),
        currentNode: null,
        selectedMove: 'membrane_pierce'
    },
    currentTurn: 'PLAYER',
    phase: 'MOVE_SELECTION',
    turnNumber: 1,
    isProcessing: false
};
