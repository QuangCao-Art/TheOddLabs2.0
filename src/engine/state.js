import { MONSTERS } from '../data/monsters.js';

export const gameState = {
    // Team Management
    playerTeam: ['nitrophil', 'cambihil', 'lydrosome'],
    cellDex: ['nitrophil', 'cambihil', 'lydrosome'],

    player: {
        id: 'nitrophil',
        name: 'Nitrophil',
        hp: 100,
        maxHp: 100,
        pp: 1,
        maxPp: 10,
        moves: [],
        defenseMoves: [],
        currentNode: null,
        blockedNodes: [],
        burnedNodes: [],
        jammedNodes: [],
        selectedMove: null
    },
    enemy: {
        id: 'nitrophil',
        name: 'Nitrophil',
        hp: 100,
        maxHp: 100,
        pp: 1,
        maxPp: 10,
        moves: [],
        defenseMoves: [],
        currentNode: null,
        blockedNodes: [],
        burnedNodes: [],
        jammedNodes: [],
        selectedMove: null
    },
    currentTurn: 'PLAYER',
    phase: 'MOVE_SELECTION',
    turnNumber: 1,
    isProcessing: false
};
