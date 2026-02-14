import { MONSTERS } from '../data/monsters.js';

export const gameState = {
    player: {
        ...JSON.parse(JSON.stringify(MONSTERS.nitrophil)),
        currentNode: null,
        selectedMove: 'membrane_pierce'
    },
    enemy: {
        ...JSON.parse(JSON.stringify(MONSTERS.nitrophil)),
        currentNode: null,
        selectedMove: 'membrane_pierce'
    },
    currentTurn: 'PLAYER', // 'PLAYER' or 'ENEMY'
    phase: 'MOVE_SELECTION', // 'MOVE_SELECTION', 'NODE_SELECTION', 'RESOLUTION'
    turnNumber: 1,
    isProcessing: false
};
