import { MONSTERS } from '../data/monsters.js';

export let SKIP_TUTORIAL = false;
export let FULL_CELL_DEBUG = false;

export const gameState = {
    exp: 0,
    credits: 0,
    biomass: 0,
    // Team Management
    playerTeam: FULL_CELL_DEBUG ? ['nitrophil', 'lydrosome', 'cambihil'] : [],
    enemyTeam: FULL_CELL_DEBUG ? ['nitrophil', 'cambihil', 'lydrosome'] : [],
    cellDex: FULL_CELL_DEBUG ? ['nitrophil', 'cambihil', 'lydrosome'] : [],

    // Full Party Objects (Initialized during resetGame)
    playerParty: [],
    enemyParty: [],

    player: null, // Points to the active player monster
    enemy: null,  // Points to the active enemy monster

    // Unified Profile System (Management Hub Presets)
    profiles: {
        player: {
            level: FULL_CELL_DEBUG ? 20 : 0,
            cardBox: [],
            team: FULL_CELL_DEBUG ? ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'] : [],
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
        starterChosen: SKIP_TUTORIAL,
        jenziFirstBattleDone: SKIP_TUTORIAL,
        jenziAtriumUnlocked: SKIP_TUTORIAL,
        jenziAtriumBattleDone: SKIP_TUTORIAL,
        botanicSectorUnlocked: SKIP_TUTORIAL,
        humanWardUnlocked: SKIP_TUTORIAL,
        executiveSuiteUnlocked: SKIP_TUTORIAL,
        oldLabUnlocked: SKIP_TUTORIAL,
        // Character Meetings
        lanaMet: SKIP_TUTORIAL,
        dyzesMet: SKIP_TUTORIAL,
        capsainMet: SKIP_TUTORIAL,
        // Quest Bosses
        lanaBattleDone: SKIP_TUTORIAL,
        dyzesBattleDone: SKIP_TUTORIAL,
        capsainBattleDone: SKIP_TUTORIAL,
        // Dialogue Seen Flags
        lanaDefeatedSeen: false,
        dyzesDefeatedSeen: false,
        capsainDefeatedSeen: false
    },

    isProcessing: false,
    items: SKIP_TUTORIAL ? ['datapad', 'CARD00'] : [], // Logs/Key items collected
    logs: [],   // Redundant copy check if needed
    showHiddenLogs: false, // DEBUG: Show red X on hidden logs
    debugAllLogs: false,   // DEBUG: Toggle all logs visibility
    debugAllItems: false,  // DEBUG: Toggle all items visibility
    debugUnlockDoors: false, // DEBUG: Toggle all doors status
    unseenLogs: [], // Track newly found logs that haven't been viewed yet
    bioExtractGrid: new Array(9).fill(null), // 3x3 grid for bio extraction [monster, biomassStored, lastTick]
    
    // Persistent Session Tracking
    lastOverworldPos: {
        zone: null,
        x: null,
        y: null
    }
};

export function applySkipTutorial(isSkip) {
    SKIP_TUTORIAL = isSkip;
    
    // Only skip the initial Lobby onboarding
    gameState.storyFlags.starterChosen = isSkip;
    gameState.storyFlags.jenziFirstBattleDone = isSkip;
    gameState.storyFlags.jenziAtriumUnlocked = isSkip;

    // Reset later flags if skipping (or leave them if unskipping)
    if (!isSkip) {
        gameState.storyFlags.jenziAtriumBattleDone = false;
        gameState.storyFlags.botanicSectorUnlocked = false;
        gameState.storyFlags.humanWardUnlocked = false;
        gameState.storyFlags.executiveSuiteUnlocked = false;
        gameState.storyFlags.oldLabUnlocked = false;
        gameState.storyFlags.lanaMet = false;
        gameState.storyFlags.dyzesMet = false;
        gameState.storyFlags.capsainMet = false;
        gameState.storyFlags.lanaBattleDone = false;
        gameState.storyFlags.dyzesBattleDone = false;
        gameState.storyFlags.capsainBattleDone = false;
    } else {
        // If skipping, mark people as met for convenience
        gameState.storyFlags.lanaMet = true;
        gameState.storyFlags.dyzesMet = true;
        gameState.storyFlags.capsainMet = true;
    }

    if (SKIP_TUTORIAL) {
        // Grant tutorial-equivalent progress items
        if (!gameState.items.includes('datapad')) gameState.items.push('datapad');
        // Ensure player has the essential Stemmy card
        if (!gameState.items.includes('CARD00')) gameState.items.push('CARD00');
    }
}

export function applyFullCellDebug(isFull) {
    FULL_CELL_DEBUG = isFull;
    
    const fullTeam = ['nitrophil', 'lydrosome', 'cambihil'];
    const fullRoster = ['nitrophil', 'lydrosome', 'cambihil', 'nitrophil', 'nitrophil', 'lydrosome', 'lydrosome', 'cambihil', 'cambihil', 'stemmy', 'stemmy', 'stemmy'];
    
    gameState.playerTeam = isFull ? [...fullTeam] : [];
    gameState.enemyTeam = isFull ? [...fullTeam] : [];
    gameState.cellDex = isFull ? [...fullTeam] : [];
    
    Object.keys(gameState.profiles).forEach(key => {
        gameState.profiles[key].level = isFull ? 20 : 0;
        // In full debug, give everyone the full roster
        gameState.profiles[key].team = isFull ? [...fullRoster] : [];
        gameState.profiles[key].party = []; // Reset party so resetGame rebuilds it
    });
}
