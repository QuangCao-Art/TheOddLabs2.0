import { gameState } from './engine/state.js';
import { resolveTurn, getDistance, checkOverload, getModifiedStats } from './engine/combat.js';
import { AI } from './engine/ai.js';
import { MONSTERS } from './data/monsters.js';
import { Overworld } from './engine/overworld.js';
import { CARDS, LEVEL_REWARDS } from './data/cards.js';

// DOM References
const interactivePentagon = document.getElementById('interactive-pentagon');
const selectionCore = document.getElementById('selection-core');
const interactiveNodes = document.querySelectorAll('#interactive-pentagon .node');
const playerPortrait = document.querySelector('.player-display .monster-portrait');
const enemyPortrait = document.querySelector('.enemy-display .monster-portrait');
const playerVitals = document.querySelector('.player-display .character-vitals');
const enemyVitals = document.querySelector('.enemy-display .character-vitals');
const moveButtons = document.querySelectorAll('.move-btn');

// Dragging State
let isDragging = false;
let startX, startY;
const pentagonRect = interactivePentagon?.getBoundingClientRect();

// Constants for positioning
const RADIUS = 130; // Calibrated for pixel-perfect alignment with background asset

function resetSelectorCore(instant = false) {
    if (!selectionCore) return;
    selectionCore.style.transition = instant ? 'none' : 'all 0.4s ease-in-out';
    selectionCore.style.transform = `translate(-50%, -50%)`;
}

// Battle Log State
let battleLogHistory = [];
let previousScreen = 'screen-main-menu';

// Inventory Navigation State
let invNav = {
    active: false,
    tabIndex: 0, // 0: Logs, 1: Items, 2: Cells
    itemIndex: 0
};

let catalystState = {
    activeSide: 'PLAYER', // 'PLAYER' or 'OPPONENT' (Legacy support)
    activeProfile: 'player', // 'player', 'opponent', 'lana', etc.
    activeMonsterIdx: 0,
    boxSortMode: 'tier', // 'tier', 'type', or 'rarity'
    draggedCardId: null,
    dragSourceSlot: null,
    battleOpponentId: 'opponent'
};

const updateInvNav = (isKeyboardAction = false) => {
    const tabs = ['logs', 'items', 'status'];
    const currentTabId = tabs[invNav.tabIndex];

    // 1. Update Tab Visuals
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === invNav.tabIndex);
    });

    // 2. Show correct tab content
    document.querySelectorAll('.inventory-tab').forEach(t => t.classList.add('hidden'));
    const activeTab = document.getElementById(`tab-${currentTabId}`);
    if (activeTab) activeTab.classList.remove('hidden');

    // 3. Highlight selected item
    if (!activeTab) return;
    const items = activeTab.querySelectorAll('.log-item, .key-item-slot, .status-item');
    if (items.length === 0) return;

    if (invNav.itemIndex >= items.length) invNav.itemIndex = Math.max(0, items.length - 1);

    items.forEach((item, idx) => {
        item.classList.toggle('nav-selected', idx === invNav.itemIndex);
    });

    // 4. Update Detail Panel
    const selectedItem = items[invNav.itemIndex];
    if (selectedItem && isKeyboardAction) {
        // Auto-scroll to keep item in view during keyboard nav
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        selectedItem.click();
    }
};

// Initialization
function init() {
    try {
        console.log("%c ODD LABS 2.0 - BATTLE ENGINE V1.25 LOADED ", "background: #00f3ff; color: #000; font-weight: bold;");
        console.log("Odd Labs 2.0 Initializing...");

        // Pre-populate player party for menus
        const initMonster = (id) => createMonsterInstance(id);
        // Initialize Teams
        if (!gameState.enemyTeam) {
            gameState.enemyTeam = ['nitrophil', 'cambihil', 'lydrosome'];
        }

        gameState.playerParty = gameState.playerTeam
            .filter(id => id !== null)
            .map(id => initMonster(id));

        gameState.enemyParty = gameState.enemyTeam
            .filter(id => id !== null)
            .map(id => initMonster(id));

        // Initialize all profiles from teams
        Object.keys(gameState.profiles).forEach(id => {
            const p = gameState.profiles[id];
            // Clear and rebuild party from team IDs
            p.party = p.team.map(monsterName => {
                const data = JSON.parse(JSON.stringify(MONSTERS[monsterName]));
                return {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    equippedCards: [],
                    hp: data.hp,
                    pp: 1,
                    maxHp: data.hp,
                    maxPp: data.maxPp,
                    selectedMove: data.moves[0].id,
                    currentNode: 0,
                    blockedNodes: [],
                    turnCount: 0
                };
            });
            syncCardsToLevel(id, p.level);
        });

        // Initialize display with player profile
        const activeRGInput = document.getElementById('debug-active-rg');
        if (activeRGInput) activeRGInput.value = gameState.profiles[catalystState.activeProfile].level;

        setupNodePositions();
        setupEventListeners();
        showScreen('screen-main-menu');
        console.log("Initialization Complete.");
    } catch (e) {
        console.error("Initialization Failed:", e);
        alert("Game failed to initialize. Check Console (F12).");
    }
}

function syncCardsToLevel(profileId, level) {
    const profile = gameState.profiles[profileId];
    if (!profile) return;

    profile.cardBox = []; // Reset cardBox
    for (let i = 1; i <= level; i++) {
        const rewards = LEVEL_REWARDS[i];
        if (rewards) {
            rewards.forEach(cardId => {
                profile.cardBox.push(cardId);
            });
        }
    }
    if (level > 0) {
        // Add SECRET leaders for debug in all boxes for testing
        const secretLeaders = ['leader_4', 'leader_5'];
        secretLeaders.forEach(lid => {
            if (!profile.cardBox.includes(lid)) profile.cardBox.push(lid);
        });
    }

    console.log(`[DEBUG] Syncing ${profile.name} Card Box for RG-${level}. Cards: ${profile.cardBox.length}`);
}

function setupNodePositions() {
    const allNodes = document.querySelectorAll('.node');
    allNodes.forEach(node => {
        const angleDeg = parseFloat(node.style.getPropertyValue('--angle')) || 0;
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * RADIUS;
        const y = Math.sin(angleRad) * RADIUS;
        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
}

function setupEventListeners() {
    // DRAG AND DROP LOGIC
    selectionCore.addEventListener('mousedown', startDrag);
    selectionCore.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    // Move Selection (Keep existing hover/click for skills)
    moveButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => showMoveInfo(btn.dataset.move));
        btn.addEventListener('mouseleave', () => document.getElementById('move-info-panel')?.classList.add('hidden'));
        btn.addEventListener('click', () => {
            if (gameState.phase !== 'MOVE_SELECTION' && gameState.phase !== 'NODE_SELECTION') return;
            if (btn.classList.contains('disabled')) return;
            const moveId = btn.dataset.move;
            if (moveId) {
                gameState.player.selectedMove = moveId;
                updateUI();
            }
        });
    });

    // Menu Controls
    document.getElementById('btn-start-overworld')?.addEventListener('click', () => {
        showScreen('screen-overworld');
        resetGame(); // Ensure parties/stats are initialized for inventory
        Overworld.init();
    });

    document.getElementById('btn-start-battle')?.addEventListener('click', () => {
        const opponentId = catalystState.battleOpponentId || 'opponent';
        startPreBattleSequence(opponentId);
    });

    /* --- PRE-BATTLE SEQUENCE LOGIC --- */
    const PRE_BATTLE_DATA = {
        'player': { art: 'Character_FullArt_Rival', dialogue: "Analysis commencing. Do not disappoint." },
        'opponent': { art: 'Character_FullArt_Rival', dialogue: "Analysis commencing. Do not disappoint." },
        'lana': { art: 'Character_FullArt_Lana', dialogue: "Prepare for a lesson in botanical efficiency!" },
        'dyzes': { art: 'Character_FullArt_Dyzes', dialogue: "Let's see if your tactical vibe is strong enough." },
        'capsain': { art: 'Character_FullArt_Director', dialogue: "I won't have my legacy tarnished by some spicy gossip!" },
        'jenzi': { art: 'Character_FullArt_Jenzi', dialogue: "Square up, Intern! Let's see what you've got." },
        'npc01': { art: 'Character_FullArt_NPC_Male', dialogue: "Commencing standard engagement protocol." },
        'npc02': { art: 'Character_FullArt_NPC_Female', dialogue: "Bio-signature match confirmed. Initiating test." },
        'npc03': { art: 'Character_FullArt_NPC_Male', dialogue: "Deploying tactical cells. Readiness check." }
    };

    let preBattleSequenceActive = false;
    let preBattleCurrentStep = 0;

    function startPreBattleSequence(opponentProfileId) {
        preBattleSequenceActive = true;
        preBattleCurrentStep = 0;

        const opponent = gameState.profiles[opponentProfileId] || gameState.profiles.opponent;
        const data = PRE_BATTLE_DATA[opponentProfileId] || PRE_BATTLE_DATA['opponent'];

        // Set UI Content
        const portraitImg = document.getElementById('pre-battle-portrait');
        const content = document.getElementById('pre-battle-content');

        if (content) content.classList.remove('anim-dissolve');
        if (portraitImg) {
            portraitImg.classList.remove('active');
            portraitImg.src = `./assets/images/${data.art}.png`;

            // Trigger slide-in after image is ready
            portraitImg.onload = () => {
                setTimeout(() => portraitImg.classList.add('active'), 50);
            };
        }

        const nameEl = document.getElementById('pre-battle-name');
        if (nameEl) nameEl.innerText = opponent.name;

        // Initial Text
        const textEl = document.getElementById('pre-battle-text');
        if (textEl) textEl.innerText = `Engagement protocol requested by ${opponent.name}`;

        showScreen('screen-pre-battle');
        document.getElementById('pre-battle-dialogue-box')?.classList.remove('hidden');
        document.getElementById('bio-scan-overlay')?.classList.add('hidden');

        // Fallback if image already loaded or cached
        setTimeout(() => {
            if (portraitImg && !portraitImg.classList.contains('active')) {
                portraitImg.classList.add('active');
            }
        }, 200);
    }

    function advancePreBattleSequence() {
        if (!preBattleSequenceActive) return;

        const opponentProfileId = catalystState.battleOpponentId || 'opponent';
        const data = PRE_BATTLE_DATA[opponentProfileId] || PRE_BATTLE_DATA['opponent'];

        preBattleCurrentStep++;

        if (preBattleCurrentStep === 1) {
            // Show Dialogue
            const textEl = document.getElementById('pre-battle-text');
            if (textEl) textEl.innerText = `"${data.dialogue}"`;
        } else if (preBattleCurrentStep === 2) {
            // Trigger Bio-Scan and Laser Wipe
            triggerBioScanTransition();
        }
    }

    function triggerBioScanTransition() {
        const overlay = document.getElementById('bio-scan-overlay');
        const content = document.getElementById('pre-battle-content');
        const battleScreen = document.getElementById('screen-battle');
        const preBattleScreen = document.getElementById('screen-pre-battle');

        if (overlay) overlay.classList.remove('hidden');
        if (preBattleScreen) preBattleScreen.classList.add('wiped'); // Wipe the entire screen
        if (battleScreen) battleScreen.classList.add('battle-shine'); // Shine the battle scene

        // Hide dialogue box immediately
        document.getElementById('pre-battle-dialogue-box')?.classList.add('hidden');

        // Begin preparing battle screen behind the scenes
        resetGame();
        if (battleScreen) battleScreen.classList.remove('hidden');

        setTimeout(() => {
            // Officially switch screens once wipe is nearly complete
            showScreen('screen-battle');

            // Final cleanup after screen change
            if (preBattleScreen) {
                preBattleScreen.classList.add('hidden');
                preBattleScreen.classList.remove('wiped');
            }
            document.getElementById('pre-battle-portrait')?.classList.remove('active');

            setTimeout(() => {
                if (overlay) overlay.classList.add('hidden');
                if (battleScreen) battleScreen.classList.remove('battle-shine'); // Start 0.3s fade-out
                preBattleSequenceActive = false;
            }, 25);
        }, 400);
    }

    // Global listeners for advancing pre-battle dialogue
    document.addEventListener('keydown', (e) => {
        if (preBattleSequenceActive && (e.key === 'f' || e.key === 'F' || e.key === 'Enter' || e.key === ' ')) {
            advancePreBattleSequence();
        }
    });

    document.addEventListener('mousedown', () => {
        if (preBattleSequenceActive) {
            advancePreBattleSequence();
        }
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        resetGame();
    });

    document.getElementById('btn-return-menu')?.addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        showScreen('screen-main-menu');
    });

    document.getElementById('btn-battle-back')?.addEventListener('click', () => {
        // Reset pre-battle sequence if user backs out
        preBattleSequenceActive = false;
        document.getElementById('pre-battle-portrait')?.classList.remove('active');
        showScreen('screen-main-menu'); // Always back to menu for now
    });
    document.getElementById('btn-battle-rulebook')?.addEventListener('click', () => showScreen('screen-rulebook'));
    document.getElementById('btn-open-rulebook')?.addEventListener('click', () => showScreen('screen-rulebook'));
    document.getElementById('btn-rulebook-back')?.addEventListener('click', () => {
        // If coming back from rules during battle, go to battle, not pre-battle
        if (previousScreen === 'screen-pre-battle') {
            showScreen('screen-main-menu');
        } else {
            showScreen(previousScreen);
        }
    });

    // Unified Management Hub Controls
    document.getElementById('btn-open-management')?.addEventListener('click', () => {
        showScreen('screen-management-hub');
        renderManagementHub();
    });
    document.getElementById('btn-hub-back')?.addEventListener('click', () => showScreen('screen-main-menu'));

    document.getElementById('btn-close-card')?.addEventListener('click', () => {
        document.getElementById('monster-card-modal').classList.add('hidden');
    });

    // Side Toggle Logic
    // Unified Profile Toggles
    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const profileId = e.target.dataset.profile;
            if (!profileId) return;

            catalystState.activeProfile = profileId;
            catalystState.activeMonsterIdx = 0;

            // Sync legacy side for combat compatibility if needed
            catalystState.activeSide = (profileId === 'player') ? 'PLAYER' : 'OPPONENT';

            // Update button visuals
            document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Update Debug UI for this profile
            const activeRGInput = document.getElementById('debug-active-rg');
            if (activeRGInput) activeRGInput.value = gameState.profiles[profileId].level;

            renderManagementHub();
        });
    });

    // Card Box Sort Tabs
    document.querySelectorAll('.sort-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            catalystState.boxSortMode = e.target.dataset.sort;
            document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            updateCatalystBox();
        });
    });

    // RG Debug Listener (Active Profile)
    document.getElementById('debug-active-rg')?.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            const profileId = catalystState.activeProfile;
            gameState.profiles[profileId].level = Math.max(0, Math.min(15, val));
            syncCardsToLevel(profileId, gameState.profiles[profileId].level);
            renderManagementHub();
        }
    });

    document.getElementById('debug-enable-battle')?.addEventListener('change', (e) => {
        if (e.target.checked) {
            catalystState.battleOpponentId = catalystState.activeProfile;
        } else {
            catalystState.battleOpponentId = 'opponent';
        }

        const battleBtn = document.getElementById('btn-start-battle');
        if (battleBtn) {
            const profileName = gameState.profiles[catalystState.battleOpponentId].name;
            battleBtn.innerText = `DEBUG BATTLE (${profileName})`;
        }
    });

    // Inventory Controls
    document.getElementById('btn-inventory-back')?.addEventListener('click', () => {
        document.getElementById('screen-inventory').classList.add('hidden');
        invNav.active = false;
        Overworld.isPaused = false;
    });

    // Card Preview Controls
    const previewOverlay = document.getElementById('card-preview-overlay');
    const previewImg = document.getElementById('preview-image');
    const detailCardImg = document.getElementById('inventory-detail-card');

    if (detailCardImg && previewOverlay && previewImg) {
        detailCardImg.addEventListener('click', () => {
            if (detailCardImg.src && !detailCardImg.src.includes('placeholder')) {
                previewImg.src = detailCardImg.src;
                previewOverlay.classList.remove('hidden');
            }
        });

        previewOverlay.addEventListener('click', () => {
            previewOverlay.classList.add('hidden');
        });
    }

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            invNav.tabIndex = idx;
            invNav.itemIndex = 0;
            updateInvNav();
        });
    });

    // Listen for Found DataLogs
    window.addEventListener('datalog-found', (e) => {
        const logId = e.detail.id;
        console.log(`Main UI: Registering found log ${logId}`);
        // This will update the log count in the overworld UI
        const countEl = document.getElementById('log-count');
        if (countEl) countEl.innerText = Overworld.logsCollected.length;
    });


    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        const inventoryOverlay = document.getElementById('screen-inventory');
        const isInvOpen = inventoryOverlay && !inventoryOverlay.classList.contains('hidden');

        if (key === 'escape') {
            const previewOverlay = document.getElementById('card-preview-overlay');
            if (previewOverlay && !previewOverlay.classList.contains('hidden')) {
                previewOverlay.classList.add('hidden');
                return;
            }

            const rulebookScreen = document.getElementById('screen-rulebook');
            const inventoryOverlay = document.getElementById('screen-inventory');
            const managementHub = document.getElementById('screen-management-hub');
            const battleScreen = document.getElementById('screen-battle');

            if (rulebookScreen && !rulebookScreen.classList.contains('hidden')) {
                showScreen(previousScreen);
                return;
            }
            if (isInvOpen) {
                inventoryOverlay.classList.add('hidden');
                invNav.active = false;
                Overworld.isPaused = false;
                return;
            }
            if (managementHub && !managementHub.classList.contains('hidden')) {
                showScreen('screen-main-menu');
                return;
            }
            if (battleScreen && !battleScreen.classList.contains('hidden')) {
                showScreen(previousScreen);
                return;
            }
        }

        if (key === 'r') {
            const isOverworld = !document.getElementById('screen-overworld').classList.contains('hidden');
            if (isOverworld && inventoryOverlay) {
                if (!isInvOpen) {
                    renderInventory();
                    inventoryOverlay.classList.remove('hidden');
                    invNav.active = true;
                    invNav.tabIndex = 0;
                    invNav.itemIndex = 0;
                    Overworld.isPaused = true;
                    updateInvNav();
                } else {
                    inventoryOverlay.classList.add('hidden');
                    invNav.active = false;
                    Overworld.isPaused = false;
                }
            }
            return;
        }

        // Inventory Specific Navigation
        if (invNav.active && isInvOpen) {
            const tabs = ['logs', 'items', 'status'];
            const activeTab = document.getElementById(`tab-${tabs[invNav.tabIndex]}`);
            const items = activeTab.querySelectorAll('.log-item, .key-item-slot, .status-item');

            if (key === 'q') { // Tab Left
                invNav.tabIndex = (invNav.tabIndex - 1 + tabs.length) % tabs.length;
                invNav.itemIndex = 0;
                updateInvNav(true);
            } else if (key === 'e') { // Tab Right
                invNav.tabIndex = (invNav.tabIndex + 1) % tabs.length;
                invNav.itemIndex = 0;
                updateInvNav(true);
            } else if (key === 'w' || key === 'arrowup' || key === 'a' || key === 'arrowleft') {
                invNav.itemIndex = (invNav.itemIndex - 1 + items.length) % items.length;
                updateInvNav(true);
            } else if (key === 's' || key === 'arrowdown' || key === 'd' || key === 'arrowright') {
                invNav.itemIndex = (invNav.itemIndex + 1) % items.length;
                updateInvNav(true);
            } else if (key === 'f' || key === 'enter') {
                const selectedItem = items[invNav.itemIndex];
                if (selectedItem) selectedItem.click();
            }
        }
    });

    // Start Screen
    addLog("Experimental Lab Environment Online.");
    addLog("Pathogen Detected: NITROPHIL.");

    // Battle Monster Card Click Logic
    document.querySelector('.player-display .monster-portrait-container')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const portrait = e.currentTarget.querySelector('.monster-portrait');
        if (portrait) {
            portrait.classList.remove('anim-pulse');
            void portrait.offsetWidth;
            portrait.classList.add('anim-pulse');
        }
        updateBattleCard(gameState.player);
    });

    document.querySelector('.enemy-display .monster-portrait-container')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const portrait = e.currentTarget.querySelector('.monster-portrait');
        if (portrait) {
            portrait.classList.remove('anim-pulse');
            void portrait.offsetWidth;
            portrait.classList.add('anim-pulse');
        }
        updateBattleCard(gameState.enemy);
    });

    // Cell Container Slot Listeners (Attached Once)
    document.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const monsterId = e.dataTransfer.getData('monsterId');
            const sourceSlot = e.dataTransfer.getData('sourceSlot');
            const targetSlotIndex = parseInt(slot.dataset.slot);

            if (monsterId && !isNaN(targetSlotIndex)) {
                if (sourceSlot !== "") {
                    const sourceIndex = parseInt(sourceSlot);
                    // Swap logic
                    const temp = gameState.playerTeam[targetSlotIndex];
                    gameState.playerTeam[targetSlotIndex] = monsterId;
                    gameState.playerTeam[sourceIndex] = temp;
                } else {
                    // Transfer from Grid
                    gameState.playerTeam[targetSlotIndex] = monsterId;
                }
                updateTeamSlots();
            }
        });
    });

    // active-monster-dropzone Drop Listener for Switching
    const activeDropzone = document.querySelector('.active-monster-dropzone');
    activeDropzone?.addEventListener('dragover', (e) => {
        const canSwitch = (gameState.phase === 'NODE_SELECTION' || gameState.phase === 'MOVE_SELECTION') && gameState.currentTurn === 'PLAYER';
        if (!canSwitch) return;
        e.preventDefault();
        activeDropzone.classList.add('drag-over');
    });

    activeDropzone?.addEventListener('dragleave', () => {
        activeDropzone.classList.remove('drag-over');
    });

    activeDropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        activeDropzone.classList.remove('drag-over');
        const canSwitch = (gameState.phase === 'NODE_SELECTION' || gameState.phase === 'MOVE_SELECTION') && gameState.currentTurn === 'PLAYER';
        if (!canSwitch) return;

        const benchIndex = parseInt(e.dataTransfer.getData('benchIndex'));
        if (!isNaN(benchIndex)) {
            handleMonsterSwitch(benchIndex);
        }
    });

    // Collection Grid Drop Listener (Remove from team)
    const grid = document.querySelector('.grid-container');
    grid?.addEventListener('dragover', (e) => e.preventDefault());
    grid?.addEventListener('drop', (e) => {
        e.preventDefault();
        const sourceSlot = e.dataTransfer.getData('sourceSlot');
        if (sourceSlot !== "") {
            const index = parseInt(sourceSlot);
            gameState.playerTeam[index] = null;
            updateTeamSlots();
        }
    });

    // RG Debug Listeners
    document.getElementById('debug-player-rg')?.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            gameState.playerLevel = Math.max(1, Math.min(15, val));
            syncCardsToLevel('PLAYER', gameState.playerLevel);
            renderManagementHub();
        }
    });

    document.getElementById('debug-enemy-rg')?.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            gameState.enemyLevel = Math.max(1, Math.min(15, val));
            syncCardsToLevel('OPPONENT', gameState.enemyLevel);
            renderManagementHub();
        }
    });
}

function updateBattleCard(monsterOrName) {
    const cardInner = document.querySelector('.card-inner');
    const frontImg = document.getElementById('battle-card-front-img');
    const backImg = document.getElementById('battle-card-back-img');
    const bioText = document.getElementById('bio-text');
    if (!cardInner || !frontImg || !backImg || !bioText) return;

    let monster;
    if (typeof monsterOrName === 'string') {
        const nameKey = monsterOrName.toLowerCase();
        // Try to find in party first or use base
        monster = gameState.playerParty.find(m => m.name.toLowerCase() === nameKey) ||
            gameState.enemyParty.find(m => m.name.toLowerCase() === nameKey) ||
            MONSTERS[nameKey];
    } else {
        monster = monsterOrName;
    }

    if (!monster) return;
    const monsterName = monster.name;
    const newSrc = `./assets/images/Card_${monsterName}.png`;

    // Calculate Modified Stats for display
    let currentLevel = 1;
    if (gameState.playerParty.includes(monster)) {
        currentLevel = gameState.profiles.player.level;
    } else {
        // Find which profile this monster belongs to (or use current active NPC)
        const profileId = catalystState.activeProfile === 'player' ? 'opponent' : catalystState.activeProfile;
        currentLevel = gameState.profiles[profileId].level;
    }
    const mStats = getModifiedStats(monster, currentLevel);

    // Check current orientation (0 = Back showing, 180 = Front showing)
    const isFlipped = cardInner.classList.contains('is-flipped');

    if (!isFlipped) {
        // Currently showing BACK (0deg) -> Prepare FRONT and flip to 180
        frontImg.onerror = () => frontImg.src = './assets/images/Card_Placeholder.png';
        frontImg.src = newSrc;
        cardInner.classList.add('is-flipped');
    } else {
        // Currently showing FRONT (180deg) -> Prepare BACK and flip to 0
        backImg.onerror = () => backImg.src = './assets/images/Card_Placeholder.png';
        backImg.src = newSrc;
        cardInner.classList.remove('is-flipped');
    }

    // Sync bio text update midway through the rotation (0.4s)
    setTimeout(() => {
        bioText.innerText = monster?.lore || "Tactical data gathering...";

        const fmt = (base, modified) => {
            const bonus = modified - base;
            return bonus > 0 ? `${modified} (${base}+${bonus})` : modified;
        };

        // Update Stat Grid
        setSafe('#card-hp', 'innerText', fmt(monster.maxHp, mStats.maxHp));
        setSafe('#card-pp', 'innerText', fmt(monster.maxPp, mStats.maxPp));
        setSafe('#card-crit', 'innerText', mStats.crit > monster.crit ? `${mStats.crit}% (${monster.crit}%+${mStats.crit - monster.crit}%)` : `${mStats.crit}%`);
        setSafe('#card-atk', 'innerText', fmt(monster.atk, mStats.atk));
        setSafe('#card-def', 'innerText', fmt(monster.def, mStats.def));
        setSafe('#card-spd', 'innerText', fmt(monster.spd, mStats.spd));
    }, 400);

    // Monster data update triggered (Glow shifted to Arena Portraits)
}

function showMoveInfo(moveId) {
    const move = gameState.player.moves.find(m => m.id === moveId) ||
        gameState.player.defenseMoves.find(m => m.id === moveId);
    if (move) {
        const infoPanel = document.getElementById('move-info-panel');
        const infoName = document.getElementById('info-move-name');
        const infoDesc = document.getElementById('info-move-desc');
        if (infoPanel && infoName && infoDesc) {
            infoName.innerText = move.name.toUpperCase();
            infoDesc.innerHTML = formatTags(move.desc || "No tactical data available.");
            infoPanel.classList.remove('hidden');

            const activeBtn = Array.from(moveButtons).find(b => b.dataset.move === moveId);
            if (activeBtn) {
                const btnRect = activeBtn.getBoundingClientRect();
                const zoneRect = document.getElementById('command-zone').getBoundingClientRect();
                const offsetBottom = zoneRect.bottom - btnRect.top + 10;
                infoPanel.style.bottom = `${offsetBottom}px`;
            }
        }
    }
}

// CELL CONTAINER LOGIC


function openMonsterCard(monsterId) {
    const monster = MONSTERS[monsterId];
    if (!monster) return;

    const modal = document.getElementById('monster-card-modal');
    if (!modal) return;

    // Populate Basic Info
    const nameEl = document.getElementById('detail-name');
    const typeEl = document.getElementById('detail-type-tag');
    const loreEl = document.getElementById('detail-lore');
    const imgEl = document.getElementById('detail-card-img');

    if (nameEl) nameEl.innerText = monster.name.toUpperCase();
    if (typeEl) {
        typeEl.innerText = monster.type.toUpperCase();
        const typeColor = getComputedStyle(document.documentElement).getPropertyValue(`--type-${monster.type.toLowerCase()}`).trim();
        typeEl.style.setProperty('--type-color', typeColor);
    }
    if (loreEl) loreEl.innerText = monster.lore;
    if (imgEl) {
        imgEl.onerror = () => imgEl.src = './assets/images/Card_Placeholder.png';
        imgEl.src = `./assets/images/Card_${monster.name}.png`;
    }

    // Populate Stats
    const stats = {
        'detail-hp': monster.hp,
        'detail-pp': monster.maxPp,
        'detail-atk': monster.atk,
        'detail-def': monster.def,
        'detail-spd': monster.spd || 10,
        'detail-crit': (monster.crit || 5) + '%'
    };

    for (const [id, val] of Object.entries(stats)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    // Populate Skills
    const renderSkills = (skills, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        skills.forEach(skill => {
            const skillEl = document.createElement('div');
            skillEl.className = 'skill-item';

            // Format descriptions with bold/uppercase for MAP effects
            let desc = formatTags(skill.desc || "No tactical data available.");

            const element = skill.element || 'SOMATIC';
            const typeColorValue = getComputedStyle(document.documentElement).getPropertyValue(`--type-${element.toLowerCase()}`).trim();

            skillEl.innerHTML = `
                <div class="skill-name-row">
                    <div class="skill-name-container">
                        <span class="skill-name">${skill.name}</span>
                        ${skill.power ? `<span class="skill-pow">POW ${skill.power}</span>` : ''}
                        <span class="skill-type-tag" style="background: ${typeColorValue}">${element}</span>
                    </div>
                    <span class="skill-cost">${skill.cost > 0 ? skill.cost + ' PP' : 'FREE'}</span>
                </div>
                <div class="skill-desc">${desc}</div>
            `;
            container.appendChild(skillEl);
        });
    };

    renderSkills(monster.moves, 'detail-attack-skills');
    renderSkills(monster.defenseMoves, 'detail-defense-skills');

    modal.classList.remove('hidden');
}

function addLog(msg) {
    const logContainer = document.getElementById('battle-log');
    if (!logContainer) return;
    battleLogHistory.push(msg);
    if (battleLogHistory.length > 3) battleLogHistory.shift();
    renderLog();
}

function renderLog() {
    const logContainer = document.getElementById('battle-log');
    if (!logContainer) return;

    logContainer.innerHTML = '';
    battleLogHistory.forEach(msg => {
        const line = document.createElement('div');
        line.className = 'log-line';

        let formattedMsg = formatTags(msg);

        line.innerHTML = `<span>-</span> ${formattedMsg}`;
        logContainer.appendChild(line);
    });
}

// DRAG HANDLERS

// DRAG HANDLERS
function startDrag(e) {
    if (gameState.phase !== 'NODE_SELECTION' && gameState.phase !== 'MOVE_SELECTION') return;
    if (gameState.isProcessing) return;

    isDragging = true;
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;

    selectionCore.style.transition = 'none';
    e.preventDefault();
}

function onDrag(e) {
    if (!isDragging) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    selectionCore.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;

    // Check proximity to nodes for highlighting
    let nearestNode = null;
    let minDist = 60; // Detection radius (Increased for better accessibility)

    interactiveNodes.forEach((node, idx) => {
        const isBlocked = gameState.player.blockedNodes.some(b => b.index === idx);
        const rect = node.getBoundingClientRect();
        const nx = rect.left + rect.width / 2;
        const ny = rect.top + rect.height / 2;
        const d = Math.hypot(clientX - nx, clientY - ny);

        if (d < minDist && !isBlocked) {
            nearestNode = node;
            minDist = d;
        }
        node.classList.remove('highlight');
    });

    if (nearestNode) nearestNode.classList.add('highlight');
}

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;

    let targetIndex = -1;
    interactiveNodes.forEach((node, idx) => {
        const isBlocked = gameState.player.blockedNodes.some(b => b.index === idx);
        const rect = node.getBoundingClientRect();
        const nx = rect.left + rect.width / 2;
        const ny = rect.top + rect.height / 2;
        const d = Math.hypot(clientX - nx, clientY - ny);

        if (d < 60 && !isBlocked) {
            targetIndex = parseInt(node.dataset.index);
        }
        node.classList.remove('highlight');
    });

    if (targetIndex !== -1) {
        gameState.player.currentNode = targetIndex;

        // Snap core to node position smoothly
        const targetNode = interactiveNodes[targetIndex];
        const angleDeg = targetIndex * 72;
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * RADIUS;
        const y = Math.sin(angleRad) * RADIUS;

        selectionCore.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        selectionCore.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

        resolvePhase();
    } else {
        // Reset core position
        selectionCore.style.transition = 'all 0.3s ease-out';
        selectionCore.style.transform = `translate(-50%, -50%)`;
    }
}

function updateUI() {
    console.log("[DEBUG] Battle UI Updating...");
    const isPlayerTurn = gameState.currentTurn === 'PLAYER';
    // Update PP Stats (Central Arena) - Bi-directional Bar
    const pPP = gameState.player.pp;
    const pMax = gameState.player.maxPp;
    const pIsLysis = pPP < 0;

    // Width logic: Bar refills visually when negative
    const pFillPercent = (Math.abs(pPP) / pMax) * 100;

    // Color logic: Blue/Cyan for positive, Orangish-Red for negative
    const pColor = pIsLysis
        ? 'var(--color-lysis)'
        : `hsl(183, ${10 + 90 * (pPP / pMax)}%, ${40 + 10 * (pPP / pMax)}%)`;

    setStyle('.player-display .pp-fill', 'width', `${pFillPercent}%`);
    setStyle('.player-display .pp-fill', 'background', pColor);
    document.querySelector('.player-display .pp-fill')?.classList.toggle('overload', pPP >= 10);
    document.querySelector('.player-display .pp-label')?.classList.toggle('lysis', pIsLysis);

    setStyle('.player-display .hp-fill', 'width', `${(gameState.player.hp / gameState.player.maxHp) * 100}%`);
    setSafe('#player-hp-val', 'textContent', `${gameState.player.hp} / ${gameState.player.maxHp}`);
    const playerPpText = pIsLysis ? `${pPP} / -${pMax}` : `${pPP} / ${pMax}`;
    setSafe('#player-pp-val', 'textContent', playerPpText);

    moveButtons.forEach((btn, idx) => {
        const moveId = btn.dataset.move;
        const isPellicle = idx > 0; // Moves 1 and 2 are Pellicle
        let unlocked = true;

        if (isPellicle) {
            const playerCardBox = gameState.profiles.player.cardBox || [];
            if (idx === 1 && !playerCardBox.includes('leader_1')) unlocked = false;
            if (idx === 2 && !playerCardBox.includes('leader_2')) unlocked = false;
        }

        btn.classList.toggle('locked', !unlocked);
        btn.classList.toggle('disabled', !unlocked || gameState.phase !== 'MOVE_SELECTION');

        if (!unlocked) {
            btn.title = "Requires Leader Card to unlock";
        } else {
            btn.removeAttribute('title');
        }
    });

    setSafe('.player-display .name-val', 'textContent', gameState.player.name);
    setSafe('#player-rg', 'textContent', `RG-${gameState.playerLevel}`);
    setSafe('.enemy-display .name-val', 'textContent', gameState.enemy.name);
    setSafe('#enemy-rg', 'textContent', `RG-${gameState.enemyLevel || 1}`);
    const pLayer = document.querySelector('.player-display .monster-float-layer');
    const pImg = document.querySelector('.player-display .monster-portrait');
    const pNameRaw = gameState.player.name.toLowerCase();
    const pNameCased = pNameRaw.charAt(0).toUpperCase() + pNameRaw.slice(1);
    const hasBackSprite = ['Nitrophil', 'Cambihil', 'Lydrosome', 'Phagoburst'].includes(pNameCased);
    if (pImg) {
        pImg.onerror = () => pImg.src = './assets/images/Card_Placeholder.png';
        pImg.src = hasBackSprite ? `./assets/images/${pNameCased}_Back.png` : `./assets/images/${pNameCased}.png`;
    }
    if (pLayer) pLayer.classList.toggle('anim-attacker-float', gameState.currentTurn === 'PLAYER');

    // Enemy PP
    const ePP = gameState.enemy.pp;
    const eMax = gameState.enemy.maxPp;
    const eIsLysis = ePP < 0;
    const eFillPercent = Math.min(100, (Math.abs(ePP) / eMax) * 100);
    const eColor = eIsLysis
        ? 'var(--color-lysis)'
        : `hsl(183, ${10 + 90 * (ePP / eMax)}%, ${40 + 10 * (ePP / eMax)}%)`;

    setStyle('.enemy-display .pp-fill', 'width', `${eFillPercent}%`);
    setStyle('.enemy-display .pp-fill', 'background', eColor);
    document.querySelector('.enemy-display .pp-fill')?.classList.toggle('overload', ePP >= 10);
    document.querySelector('.enemy-display .pp-label')?.classList.toggle('lysis', eIsLysis);

    setStyle('.enemy-display .hp-fill', 'width', `${(gameState.enemy.hp / gameState.enemy.maxHp) * 100}%`);
    setSafe('#enemy-hp-val', 'textContent', `${gameState.enemy.hp} / ${gameState.enemy.maxHp}`);
    const enemyPpText = eIsLysis ? `${ePP} / -${eMax}` : `${ePP} / ${eMax}`;
    setSafe('#enemy-pp-val', 'textContent', enemyPpText);

    setSafe('.enemy-display .name-val', 'textContent', gameState.enemy.name);
    const eLayer = document.querySelector('.enemy-display .monster-float-layer');
    const eImg = document.querySelector('.enemy-display .monster-portrait');
    const eNameRaw = gameState.enemy.name.toLowerCase();
    const eNameCased = eNameRaw.charAt(0).toUpperCase() + eNameRaw.slice(1);
    if (eImg) {
        eImg.onerror = () => eImg.src = './assets/images/Card_Placeholder.png';
        eImg.src = `./assets/images/${eNameCased}.png`;
    }
    if (eLayer) eLayer.classList.toggle('anim-attacker-float', gameState.currentTurn === 'ENEMY');

    // Update Player Bench (Side Monsters)
    const playerBenchSlots = document.querySelectorAll('.player-bench .bench-slot');
    let pBenchIdx = 0;
    gameState.playerParty.forEach((monster, idx) => {
        if (monster === gameState.player) return; // Skip active monster

        const slot = playerBenchSlots[pBenchIdx];
        if (slot) {
            const isDead = monster.hp <= 0;
            const isPlayerChoosing = (gameState.phase === 'NODE_SELECTION' || gameState.phase === 'MOVE_SELECTION') && gameState.currentTurn === 'PLAYER';
            const mNameRaw = monster.name.toLowerCase();
            const mNameCased = mNameRaw.charAt(0).toUpperCase() + mNameRaw.slice(1);
            slot.innerHTML = `<img src="./assets/images/${mNameCased}.png" alt="${monster.name}" onerror="this.src='./assets/images/Card_Placeholder.png'">`;
            slot.classList.toggle('dead', isDead);
            slot.draggable = !isDead && isPlayerChoosing;

            // Re-bind drag events (keeping it simple with inline for now as it's a re-render)
            slot.ondragstart = (e) => {
                if (isDead) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData('benchIndex', idx);
                slot.classList.add('dragging');
            };
            slot.ondragend = () => {
                slot.classList.remove('dragging');
            };
            slot.onclick = () => {
                if (isDead) return;
                triggerBenchFeedback(slot);
                updateBattleCard(monster);
            };
            pBenchIdx++;
        }
    });
    // Clear unused player slots
    for (let i = pBenchIdx; i < playerBenchSlots.length; i++) {
        playerBenchSlots[i].innerHTML = '';
        playerBenchSlots[i].draggable = false;
        playerBenchSlots[i].onclick = null;
    }

    // Update Enemy Bench (Side Monsters)
    const enemyBenchSlots = document.querySelectorAll('.enemy-bench .bench-slot');
    let eBenchIdx = 0;
    gameState.enemyParty.forEach((monster, idx) => {
        if (monster === gameState.enemy) return; // Skip active monster

        const slot = enemyBenchSlots[eBenchIdx];
        if (slot) {
            const isDead = monster.hp <= 0;
            const mNameRaw = monster.name.toLowerCase();
            const mNameCased = mNameRaw.charAt(0).toUpperCase() + mNameRaw.slice(1);
            slot.innerHTML = `<img src="./assets/images/${mNameCased}.png" alt="${monster.name}" onerror="this.src='./assets/images/Card_Placeholder.png'">`;
            slot.classList.toggle('dead', isDead);
            slot.draggable = false;
            slot.onclick = () => {
                if (isDead) return;
                triggerBenchFeedback(slot);
                updateBattleCard(monster);
            };
            eBenchIdx++;
        }
    });
    // Clear unused enemy slots
    for (let i = eBenchIdx; i < enemyBenchSlots.length; i++) {
        enemyBenchSlots[i].innerHTML = '';
        enemyBenchSlots[i].onclick = null;
    }

    // Update Interactive Pentagon Visuals
    const showSelection = gameState.phase === 'MOVE_SELECTION' || gameState.phase === 'NODE_SELECTION';
    const isDefense = gameState.currentTurn === 'ENEMY';

    interactiveNodes.forEach((node, idx) => {
        const isTarget = showSelection && gameState.player.currentNode === idx;
        const playerBlockedArr = gameState.player.blockedNodes || [];
        const isBlocked = playerBlockedArr.some(b => b.index === idx);

        node.className = `node ${isPlayerTurn ? 'attack' : 'defense'}`;
        node.classList.toggle('selected', isTarget);
        node.classList.toggle('blocked', isBlocked);
        node.classList.toggle('burned', isBlocked);

    });

    // 1. Target Moveset & Fallback Logic
    const isPlayerPhase = gameState.currentTurn === 'PLAYER';
    const moveset = isPlayerPhase ? gameState.player.moves : gameState.player.defenseMoves;

    // Check if current selection is valid for THIS moveset
    let currentMove = moveset.find(m => m.id === gameState.player.selectedMove);

    // Auto-Fallback: If selection is invalid (wrong phase) or critically over-extended
    // Debt Limit: Cannot spend if already at -maxPP
    const isDebtLimitReached = gameState.player.pp <= (gameState.player.maxPp * -1);
    const canAfford = currentMove && (currentMove.type !== 'pellicle' || !isDebtLimitReached);

    if (!currentMove || !canAfford) {
        gameState.player.selectedMove = moveset[0].id;
        currentMove = moveset[0];
    }

    // 2. Move buttons (Selection, Validation, and Dynamic Rendering)
    moveButtons.forEach((btn, idx) => {
        const move = moveset[idx];
        if (!move) {
            btn.classList.add('hidden');
            return;
        }
        btn.classList.remove('hidden');
        btn.dataset.move = move.id;

        // Update name
        const nameEl = btn.querySelector('.move-name');
        if (nameEl) nameEl.innerText = move.name;

        const moveAffordable = move.type !== 'pellicle' || !isDebtLimitReached;
        btn.classList.toggle('disabled', !moveAffordable);
        btn.classList.toggle('active', gameState.player.selectedMove === move.id);
        btn.classList.toggle('defense', !isPlayerPhase);

        // Update stats row (Formatted: POW {x} - {element tag} - {cost} PP)
        const statsRow = btn.querySelector('.move-stats-row');
        if (statsRow) {
            const element = move.element || 'SOMATIC';
            const typeColorValue = getComputedStyle(document.documentElement).getPropertyValue(`--type-${element.toLowerCase()}`).trim();

            const powPart = move.power !== undefined ? `POW ${move.power}` : (move.type === 'basic' ? 'Basic Skill' : 'Pellicle Skill');
            const costText = move.cost > 0 ? ` - ${move.cost} PP` : '';

            statsRow.innerHTML = `
                <span>${powPart}</span>
                <span class="skill-type-tag" style="background: ${typeColorValue}; margin: 0 5px; padding: 1px 6px; font-size: 0.6rem;">${element}</span>
                <span>${costText}</span>
            `;
        }
    });

    // Phase / Turn labels (Center Arena)
    setSafe('.turn-indicator', 'innerText', isPlayerTurn ? 'YOUR TURN' : 'ENEMY TURN');

    let phaseName = gameState.phase.replace('_', ' ');
    if (gameState.phase === 'MOVE_SELECTION' || gameState.phase === 'NODE_SELECTION') {
        phaseName = isPlayerTurn ? 'ATTACK NODE SELECTION' : 'DEFENSE NODE SELECTION';
    }
    setSafe('.phase-label', 'innerText', phaseName);

    // Swap Pentagon Asset (Attack/Defense)
    const pentagonShape = document.querySelector('#interactive-pentagon .pentagon-shape');

    if (pentagonShape) {
        pentagonShape.classList.toggle('attack', isPlayerTurn);
        pentagonShape.classList.toggle('defense', !isPlayerTurn);
    }

    // Dynamic Node & Core Colors
    interactiveNodes.forEach(node => {
        node.classList.toggle('attack', isPlayerTurn);
        node.classList.toggle('defense', !isPlayerTurn);
    });

    if (selectionCore) {
        selectionCore.classList.toggle('attack', isPlayerTurn);
        selectionCore.classList.toggle('defense', !isPlayerTurn);
    }
    console.log("[DEBUG] Battle UI Update Complete.");
}

// Helper to safely set element properties
const setSafe = (selector, prop, val) => {
    const el = document.querySelector(selector);
    if (el) el[prop] = val;
};

/**
 * Formats tactical tags in text [TAG] with yellow color classes.
 */
const formatTags = (text) => {
    if (!text) return "";
    return text.replace(/\[(.*?)\]/g, (match, tag) => {
        let tagClass = 'tag-tactical';
        if (tag === 'CRITICAL') tagClass = 'crit';
        return `<span class="${tagClass}">[${tag}]</span>`;
    });
};

const setStyle = (selector, prop, val) => {
    const el = document.querySelector(selector);
    if (el) el.style[prop] = val;
};

function renderInventory() {
    const logList = document.getElementById('inventory-log-list');
    const itemGrid = document.getElementById('inventory-item-grid');
    const statusList = document.getElementById('inventory-status-list');
    const detailTitle = document.getElementById('inventory-detail-title');
    const detailDesc = document.getElementById('inventory-detail-desc');
    const detailCard = document.getElementById('inventory-detail-card');

    if (!logList || !itemGrid || !statusList) return;

    // Helper to update the detail panel
    const updateDetail = (title, desc, imgSrc) => {
        if (detailTitle) detailTitle.innerText = title;
        if (detailDesc) detailDesc.innerText = desc;
        const cardContainer = detailCard ? detailCard.closest('.detail-card-container') : null;
        if (imgSrc) {
            if (detailCard) {
                detailCard.onerror = () => detailCard.src = './assets/images/Card_Placeholder.png';
                detailCard.src = imgSrc.startsWith('assets') ? './' + imgSrc.split('?')[0] : imgSrc;
            }
            if (cardContainer) cardContainer.style.display = '';
        } else {
            if (cardContainer) cardContainer.style.display = 'none';
        }
    };

    // DataLog Entries (from story_lore.md)
    const dataLogs = [
        { id: '001', tag: 'HISTORY', title: 'Mission Statement', text: "The Odd Labs was founded on the belief that the microscopic world holds the cure for the macro-world. We heal the earth by healing the cell." },
        { id: '002', tag: 'FLUFF', title: 'The Coffee Incident', text: "Someone left a half-empty mug in the incubator. It has grown a fuzzy purple mold. It isn't sentient, but it did try to eat my pen." },
        { id: '003', tag: 'INFO', title: 'Security Protocols', text: "Entrance gates now require a valid Bio-Signature match. Unregistered interns will be teased by Jenzi until they cry. - Management." },
        { id: '004', tag: 'TEASE', title: 'Missing Footage', text: "Automatic backup failed during the '82 Incident. Exactly 4 minutes of footage are missing from the central hub. Capsain claims it was 'ozone interference'." },
        { id: '005', tag: 'FUN', title: 'Noodle Tuesday', text: "Cafeteria Update: Noodle Tuesday is now the highest energy-consumption day in the lab. Director Capsain was seen carrying 12 packs of 'Inferno' brand." },
        { id: '006', tag: 'INFO', title: 'Botanic Breakthrough', text: "Lana successfully integrated chlorophyll into a fibroblast today. The resulting 'Cambihil' is incredibly stable." },
        { id: '007', tag: 'TEASE', title: "Lana's Complaint", text: "The Director is spending far too much time in the maintenance closet of Sector 4. He brings a bowl of noodles in there every day. Sus." },
        { id: '008', tag: 'FUN', title: 'Photosynthesis Party', text: "Cambihils actually grow 15% faster when exposed to high-tempo music. Lana hates it, but the data doesn't lie." },
        { id: '009', tag: 'TEASE', title: 'The Spicy Aroma', text: "Lana noted a 'pungent, peppery smell' coming from the vents near the Old Lab wing. She logged it as 'botanical mutation fumes'." },
        { id: '010', tag: 'INFO', title: 'Private Key Log', text: "Lana changed the lock on her private storage. Hint: It's the same day she first successfully grew a Cell. (Is she hiding something? - Anon)." },
        { id: '011', tag: 'INFO', title: "Dyzes' Observations", text: "Scientist Dyzes reports that the 'Lydrosome' mutation shows 99% tissue compatibility with the human host." },
        { id: '012', tag: 'TEASE', title: 'Protein Analysis', text: "Looking at the 'mutation' under zoom. These aren't radiation burns. These are protein capsicum interactions. Is that a chili seed?" },
        { id: '013', tag: 'FUN', title: 'The Chill Factor', text: "Observation on Nitrophil: For a Thermogenic Cell it is remarkably laid back. We've officially dubbed it the 'Chill-y' cell." },
        { id: '014', tag: 'TEASE', title: 'Point Zero', text: "Dyzes found a data fragment mentioning 'Point Zero'. It's a location not listed in the current blueprints. Capsain deleted the rest." },
        { id: '015', tag: 'INFO', title: 'Cellular Harmony', text: "Dyzes believes the Cells are actually trying to communicate. He spent two hours talking to a Lydrosome today. It waved back." },
        { id: '016', tag: 'FUN', title: 'Noodle Review (Draft)', text: "User: Capsain82. Review: Inferno Brand Chili Sauce. Rating: 5/5. Potency is perfect. One drop fell in workspace—hope nobody noticed." },
        { id: '017', tag: 'TEASE', title: "Official '82 Report", text: "Official Cause: Faulty reactor shield. Note: Clean-up crew reported a 'spicy aroma'. Logged as 'oxidized metal ozone'." },
        { id: '018', tag: 'FLUFF', title: 'Logistics Update', text: "Monthly Order: 1 Case of Industrial-Strength Antacid. Priority for the Director's Office." },
        { id: '019', tag: 'TEASE', title: "Director's Secret Folder", text: "ACCESS DENIED. Folder Name: [Petri Dish #0 - My Little Accident]. Password hint: What makes everything better? (Spices?)" },
        { id: '020', tag: 'CLIMAX', title: "The Director's Private Note", text: "Origin is now 15cm. Its orange glow is getting brighter. If they ever find out the project was born from a noodle accident, I'm ruined." },
        { id: '999', tag: 'SECRET', title: 'The Burden of Pride', text: "I spent an hour today just talking to Origin. I have to shout and complain about 'monstrous anomalies' so the board doesn't suspect. But here... I wish I could just tell everyone. I'm so sorry, little buddy.", secret: true }
    ];

    // 1. Populate Logs (21 total, including the secret)
    logList.innerHTML = '';

    // Debug: mark all logs as found
    dataLogs.forEach(log => {
        if (!Overworld.logsCollected.includes(log.id)) {
            Overworld.logsCollected.push(log.id);
        }
    });

    dataLogs.forEach((log, i) => {
        const isFound = Overworld.logsCollected.includes(log.id);
        const item = document.createElement('div');
        item.className = `log-item ${isFound ? '' : 'locked'} ${log.secret ? 'secret' : ''}`;
        item.innerHTML = `
            <span class="log-id">#${log.id}</span>
            <span class="log-status">${isFound ? `[${log.tag}] ${log.title}` : 'ENCRYPTED DATA'}</span>
        `;
        item.onclick = () => {
            invNav.itemIndex = i;
            updateInvNav(false);
            if (isFound) {
                updateDetail(`[${log.tag}] LOG #${log.id}: ${log.title}`, log.text, null);
            } else {
                updateDetail(`LOCKED LOG #${log.id}`, "DATA IS CURRENTLY ENCRYPTED. \n\nExplore furniture in the overworld to initialize decryption sequence for this memory fragment.", null);
            }
        };
        logList.appendChild(item);
    });

    // 2. Populate Key Items
    itemGrid.innerHTML = '';
    const keyItems = [
        { id: 'datapad', name: 'KeyItem-DataPad', desc: 'Mostly contains encrypted logs, but some files are just high-score records for \'Snake\'.', icon: 'data-pad' },
        { id: 'room_key', name: 'KeyItem-RoomKey', desc: 'A magnetic keycard. Smells like the Director\'s expensive cologne.', icon: 'room-key' },
        { id: 'sauce_bottle', name: 'KeyItem-SauceBottle', desc: 'Label: \'SUPERNOVA SAUCE\'. Scoville rating: YES. Lab-certified to burn through metal.', icon: 'sauce-bottle' }
    ];

    // For debug/testing: give these items to the player if not found
    keyItems.forEach(k => {
        if (!gameState.items.includes(k.id)) gameState.items.push(k.id);
    });

    keyItems.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'key-item-slot';
        const hasItem = gameState.items && gameState.items.includes(item.id);

        if (hasItem) {
            slot.innerHTML = `<div class="key-item-sprite ${item.icon}"></div>`;
            slot.onclick = () => {
                invNav.itemIndex = index;
                updateInvNav(false);
                // Visual active state
                document.querySelectorAll('.key-item-slot').forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
                updateDetail(item.name.toUpperCase(), item.desc, 'assets/images/Card_Placeholder.png');
            };
        } else {
            slot.classList.add('locked');
            slot.innerHTML = `<span class="icon" style="font-size: 2rem; opacity: 0.2">🔒</span>`;
            slot.onclick = () => updateDetail("UNKNOWN OBJECT", "ITEM NOT ACQUIRED. Continue your research to discover critical mission equipment.", 'assets/images/Card_Placeholder.png');
        }
        itemGrid.appendChild(slot);
    });

    // 3. Populate Cell Status
    statusList.innerHTML = '';
    gameState.playerParty.forEach((cell, index) => {
        const item = document.createElement('div');
        item.className = 'status-item glass-panel';

        // Calculate HP percent for the bar
        const hpPercent = (cell.hp / cell.maxHp) * 100;

        const iconName = cell.name.charAt(0).toUpperCase() + cell.name.slice(1);
        item.innerHTML = `
            <div class="status-cell-icon">
                <img src="assets/images/${iconName}.png" alt="${cell.name}">
            </div>
            <div class="status-info">
                <div class="status-name">${cell.name.toUpperCase()} <span style="font-size: 0.7rem; color: #fff; opacity: 0.8;">[RG ${cell.level || 1}]</span></div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6);">HEALTH VITALITY: ${cell.hp}/${cell.maxHp}</div>
                <div class="status-hp-bar">
                    <div class="hp-fill" style="width: ${hpPercent}%"></div>
                </div>
            </div>
        `;
        item.onclick = () => {
            invNav.itemIndex = index;
            updateInvNav(false);
            // Add visual active state
            document.querySelectorAll('.status-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const cardImg = `assets/images/Card_${iconName}.png`;
            updateDetail(cell.name.toUpperCase(), cell.lore, cardImg);
        };
        statusList.appendChild(item);
    });
}

async function resolvePhase() {
    if (gameState.isProcessing) return;
    gameState.isProcessing = true;

    // Clear selection visuals (but KEEP core position)
    interactiveNodes.forEach(n => n.classList.remove('selected', 'highlight'));

    gameState.phase = 'RESOLUTION';
    updateUI();

    // 1. AI Choice
    const isEnemyAttacking = gameState.currentTurn === 'ENEMY';
    const selectedMove = AI.selectMove(gameState.enemy, isEnemyAttacking, gameState.player);
    gameState.enemy.selectedMove = selectedMove.id;
    gameState.enemy.currentNode = AI.selectNode(gameState.enemy, gameState.player);

    console.log(`[AI] Decided: ${selectedMove.name} at Node ${gameState.enemy.currentNode}`);

    // 2. Prepare Enemy Ghost (Still shown on interactive pentagon for tactical feedback)
    const ghost = document.createElement('div');
    ghost.className = 'enemy-ghost';
    interactivePentagon.appendChild(ghost);
    void ghost.offsetWidth;

    // 3. Jump Animation (Portraits in central scene)
    await performJump(ghost);

    // 4. Combat Resolution
    const results = resolveTurn(gameState);

    // Logging and metadata for VFX
    const attackerName = results.attacker === 'PLAYER' ? 'You' : 'Enemy';
    const defenderName = results.attacker === 'PLAYER' ? 'Enemy' : 'You';

    const move = results.attacker === 'PLAYER'
        ? gameState.player.moves.concat(gameState.player.defenseMoves).find(m => m.id === results.moveId)
        : gameState.enemy.moves.concat(gameState.enemy.defenseMoves).find(m => m.id === results.moveId);

    const dMove = results.attacker === 'PLAYER'
        ? gameState.enemy.moves.concat(gameState.enemy.defenseMoves).find(m => m.id === results.defenderMoveId)
        : gameState.player.moves.concat(gameState.player.defenseMoves).find(m => m.id === results.defenderMoveId);

    let logMsg = `${attackerName} used ${move.name}, dealing ${results.hitResult.damage} DMG`;
    if (results.hitResult.isCrit) logMsg += " [CRITICAL]";
    addLog(logMsg);

    if (results.typeMultiplier > 1.0) {
        addLog("It's a BREACH!!!", 'super-effective');
    } else if (results.typeMultiplier < 1.0) {
        addLog("It's RESISTED...", 'resisted');
    }

    if (results.isLysis) {
        addLog(`${defenderName} in [LYSIS STATE]: Structural failure detected!`, 'lysis');
    }

    if (results.hitResult.usedLeader3) {
        addLog(`[PERK] Oxidative Energy Burst: x2 DMG!`, 'perk-active');
    }
    if (results.hitResult.usedLeader5) {
        addLog(`[PERK] Molecular Dissolver: Defense Ignored!`, 'perk-active');
    }

    if (dMove && dMove.id !== 'quick_dodge') {
        addLog(`${defenderName} used ${dMove.name}`);
    }

    if (move.id === 'nitric_burst' || move.id === 'overgrowth') {
        addLog(`${attackerName} activate [EASY TARGET]`);
    }
    if (move.id === 'hydro_shot') {
        addLog(`${attackerName} activate [ALL OR NOTHING]`);
    }

    if (dMove && dMove.matchFixed !== undefined && dMove.id !== 'quick_dodge') {
        const tag = dMove.matchFixed === 1 ? 'RELIABLE HIT' : 'PUNY SLAP';
        addLog(`${defenderName} activate [${tag}]`);
    }

    if (dMove?.hasHurtBlock) {
        addLog(`${defenderName} activate [HURT BLOCK]`);
    }

    // Animation Selection
    const isPellicle = results.moveType === 'pellicle';
    const playerContainer = document.querySelector('.player-display .monster-portrait-container');
    const enemyContainer = document.querySelector('.enemy-display .monster-portrait-container');

    const lungeClass = isPellicle
        ? (results.attacker === 'PLAYER' ? 'anim-heavy-lunge-player' : 'anim-heavy-lunge-enemy')
        : (results.attacker === 'PLAYER' ? 'anim-lunge-player' : 'anim-lunge-enemy');

    if (results.attacker === 'PLAYER') {
        playerContainer.classList.remove('anim-lunge-player', 'anim-heavy-lunge-player');
        void playerContainer.offsetWidth; // Force reflow
        playerContainer.classList.add(lungeClass);
        if (isPellicle) playerContainer.classList.add('pellicle-aura');
        if (results.hitResult.damage > 0 || results.hitResult.shieldAbsorbed > 0) {
            setTimeout(() => {
                enemyContainer.classList.remove('anim-hit-shake', 'anim-shield-pulse');
                void enemyContainer.offsetWidth; // Force reflow

                // Shake if there was any impact (damage or shield block)
                enemyContainer.classList.add('anim-hit-shake');

                // Trigger Shield Pulse if shielding occurred
                if (results.hitResult.shieldAbsorbed > 0) {
                    const defender = gameState.enemy;
                    const ppRatio = defender.pp / defender.maxPp;
                    enemyContainer.style.setProperty('--shield-opacity', ppRatio.toFixed(2));
                    enemyContainer.classList.add('anim-shield-pulse');

                    if (results.hitResult.shieldAbsorbed >= 5) {
                        addLog(`[SHIELDED] Pellicle blocked ${results.hitResult.shieldAbsorbed} DMG!`, 'shield-mitigation');
                        spawnShieldNumber(enemyContainer, results.hitResult.shieldAbsorbed);
                    }

                    setTimeout(() => {
                        enemyContainer.classList.remove('anim-shield-pulse');
                        enemyContainer.style.removeProperty('--shield-opacity');
                    }, 600);
                }

                if (results.hitResult.damage > 0) {
                    spawnDamageNumber(enemyContainer, results.hitResult.damage, results.hitResult.isCrit, results.typeMultiplier);

                    if (results.isLysis) {
                        spawnLysisNumber(enemyContainer, results.hitResult.lysisPenalty);
                    }

                    if (results.hitResult.isCrit) {
                        document.getElementById('game-container').classList.add('anim-screen-shake');
                        setTimeout(() => document.getElementById('game-container').classList.remove('anim-screen-shake'), 400);
                    }
                }
            }, 150);
        }
    } else {
        enemyContainer.classList.remove('anim-lunge-enemy', 'anim-heavy-lunge-enemy');
        void enemyContainer.offsetWidth; // Force reflow
        enemyContainer.classList.add(lungeClass);
        if (isPellicle) enemyContainer.classList.add('pellicle-aura');
        if (results.hitResult.damage > 0 || results.hitResult.shieldAbsorbed > 0) {
            setTimeout(() => {
                playerContainer.classList.remove('anim-hit-shake', 'anim-shield-pulse');
                void playerContainer.offsetWidth; // Force reflow

                // Shake if there was any impact
                playerContainer.classList.add('anim-hit-shake');

                // Trigger Shield Pulse if shielding occurred
                if (results.hitResult.shieldAbsorbed > 0) {
                    const defender = gameState.player;
                    const ppRatio = defender.pp / defender.maxPp;
                    playerContainer.style.setProperty('--shield-opacity', ppRatio.toFixed(2));
                    playerContainer.classList.add('anim-shield-pulse');

                    if (results.hitResult.shieldAbsorbed >= 5) {
                        addLog(`[SHIELDED] Pellicle blocked ${results.hitResult.shieldAbsorbed} DMG!`, 'shield-mitigation');
                        spawnShieldNumber(playerContainer, results.hitResult.shieldAbsorbed);
                    }

                    setTimeout(() => {
                        playerContainer.classList.remove('anim-shield-pulse');
                        playerContainer.style.removeProperty('--shield-opacity');
                    }, 600);
                }

                if (results.hitResult.damage > 0) {
                    spawnDamageNumber(playerContainer, results.hitResult.damage, results.hitResult.isCrit, results.typeMultiplier);

                    if (results.isLysis) {
                        spawnLysisNumber(playerContainer, results.hitResult.lysisPenalty);
                    }

                    if (results.hitResult.isCrit) {
                        document.getElementById('game-container').classList.add('anim-screen-shake');
                        setTimeout(() => document.getElementById('game-container').classList.remove('anim-screen-shake'), 400);
                    }
                }
            }, 150);
        }
    }

    // 5. MAP Activation VFX (Nodes pulse based on skill effect)
    const defenderNode = results.attacker === 'PLAYER' ? gameState.enemy.currentNode : gameState.player.currentNode;
    triggerMAPActivationVFX(defenderNode, move);
    if (dMove) triggerMAPActivationVFX(defenderNode, dMove);

    // 6. Final VFX Feedback (Hit flash)
    setTimeout(() => {
        applyMatchVFX(results.actualDist, results.effectiveDist, ghost);
    }, 400); // Wait for activation pulse to peak

    if (results.ppGain > 0) {
        spawnPellicleVFX(results.attacker, results.ppGain);
    }

    updateUI();

    // 6. Reflection Visuals (If triggered)
    if (results.reflectDamage > 0) {
        const defenderPortrait = results.attacker === 'PLAYER' ? enemyContainer : playerContainer;
        const attackerPortrait = results.attacker === 'PLAYER' ? playerContainer : enemyContainer;

        setTimeout(() => {
            attackerPortrait.classList.add('anim-hit-shake');
            // Spawn reflection damage number (Yellow for counter-damage)
            const reflectEl = document.createElement('div');
            reflectEl.className = 'damage-number';
            reflectEl.style.color = 'var(--color-near)';
            reflectEl.innerText = `-${results.reflectDamage}`;
            attackerPortrait.appendChild(reflectEl);
            setTimeout(() => reflectEl.remove(), 1000);

            // Log it
            console.log(`[VFX] Reflected ${results.reflectDamage} damage.`);
        }, 400);
    }

    // 7. Reset Turn (Capture indices BEFORE reset for block logic)
    const capturedPlayerNode = gameState.player.currentNode;
    const capturedEnemyNode = gameState.enemy.currentNode;

    setTimeout(() => {
        resetPositions();
        clearVFX();
        playerContainer.classList.remove('anim-lunge-player', 'anim-heavy-lunge-player', 'anim-hit-shake', 'pellicle-aura');
        enemyContainer.classList.remove('anim-lunge-enemy', 'anim-heavy-lunge-enemy', 'anim-hit-shake', 'pellicle-aura');

        if (checkGameOver()) return;

        gameState.phase = 'MOVE_SELECTION';
        gameState.currentTurn = gameState.currentTurn === 'PLAYER' ? 'ENEMY' : 'PLAYER';

        // Set Default Move for next turn (Auto-fallback/Initialization)
        const nextMoveset = (gameState.currentTurn === 'PLAYER') ? gameState.player.moves : gameState.player.defenseMoves;
        gameState.player.selectedMove = nextMoveset[0].id; // Default to basic on phase swap

        if (results.attackerHeal > 0) {
            addLog(`${attackerName} restored ${results.attackerHeal} HP`);
            const container = results.attacker === 'PLAYER' ? playerContainer : enemyContainer;
            spawnHealNumber(container, results.attackerHeal);
        }
        if (results.defenderHeal > 0) {
            addLog(`${defenderName} restored ${results.defenderHeal} HP`);
            const container = results.attacker === 'PLAYER' ? enemyContainer : playerContainer;
            spawnHealNumber(container, results.defenderHeal);
        }

        // Overload Recall Damage (Both monsters discharge at start of next phase)
        let overloadTriggered = false;
        [gameState.player, gameState.enemy].forEach(target => {
            const recoil = checkOverload(target);
            if (recoil > 0) {
                overloadTriggered = true;
                target.hp = Math.max(0, target.hp - recoil);
                const isP = target === gameState.player;
                const container = isP
                    ? document.querySelector('.player-display .monster-portrait-container')
                    : document.querySelector('.enemy-display .monster-portrait-container');

                addLog(`[OVERLOAD] ${target.name} suffered a Pellicle Discharge! -${recoil} HP`);
                spawnDamageNumber(container, recoil);
                container.classList.add('anim-hit-shake', 'flash-red');
                setTimeout(() => container.classList.remove('anim-hit-shake', 'flash-red'), 600);
                target.pp = 0; // Discharge after overload
            }
        });

        if (overloadTriggered) {
            updateUI();
            if (checkGameOver()) {
                gameState.isProcessing = false;
                return;
            }
        }

        // 7. Block Aging & New Triggers (Consolidated blockedNodes v2.93)
        // Age existing blocks
        gameState.player.blockedNodes = gameState.player.blockedNodes
            .map(b => ({ ...b, duration: b.duration - 1 }))
            .filter(b => b.duration > 0);

        gameState.enemy.blockedNodes = gameState.enemy.blockedNodes
            .map(b => ({ ...b, duration: b.duration - 1 }))
            .filter(b => b.duration > 0);

        const newPlayerBlocked = [];
        const newEnemyBlocked = [];

        // ChoiceBlock Trigger (Duration: 1 full cycle)
        if (gameState.currentTurn === 'PLAYER') {
            const move = gameState.player.selectedMove ? gameState.player.moves.find(m => m.id === gameState.player.selectedMove) : null;
            if (move?.hasChoiceBlock) newPlayerBlocked.push({ index: capturedPlayerNode, duration: 1 });

            const eMove = dMove;
            if (eMove?.hasChoiceBlock) newEnemyBlocked.push({ index: capturedEnemyNode, duration: 1 });
        } else {
            const move = gameState.enemy.selectedMove ? gameState.enemy.moves.find(m => m.id === gameState.enemy.selectedMove) : null;
            if (move?.hasChoiceBlock) newEnemyBlocked.push({ index: capturedEnemyNode, duration: 1 });

            const pMove = dMove;
            if (pMove?.hasChoiceBlock) newPlayerBlocked.push({ index: capturedPlayerNode, duration: 1 });
        }

        // HurtBlock Trigger (Snare logic)
        const isPlayerAttacker = results.attacker === 'PLAYER';
        const dSkill = dMove; // Use pre-looked up defender move

        if (dSkill?.hasHurtBlock) {
            // Snare triggered -> BOTH nodes are disabled for BOTH players
            // Use CAPTURED indices because gameState.player.currentNode is now null
            newPlayerBlocked.push({ index: capturedPlayerNode, duration: 1 });
            newPlayerBlocked.push({ index: capturedEnemyNode, duration: 1 });
            newEnemyBlocked.push({ index: capturedPlayerNode, duration: 1 });
            newEnemyBlocked.push({ index: capturedEnemyNode, duration: 1 });
        }

        // Merge new into existing (avoiding duplicates on same node)
        newPlayerBlocked.forEach(nb => {
            if (!gameState.player.blockedNodes.some(eb => eb.index === nb.index)) {
                gameState.player.blockedNodes.push(nb);
            }
        });
        newEnemyBlocked.forEach(nb => {
            if (!gameState.enemy.blockedNodes.some(eb => eb.index === nb.index)) {
                gameState.enemy.blockedNodes.push(nb);
            }
        });

        gameState.player.currentNode = null;
        gameState.enemy.currentNode = null;

        // Reset selection core to center AFTER resolution
        resetSelectorCore();

        gameState.isProcessing = false;
        updateUI();
    }, 1500);
}

function applyMatchVFX(actualDist, effectiveDist, ghost) {
    const isDefense = gameState.currentTurn === 'ENEMY';
    const targetNode = document.querySelector(`#interactive-pentagon .node[data-index="${gameState.player.currentNode}"]`);

    let vfxClass = 'flash-white';
    let resultText = isDefense ? 'NICE' : 'FAR';
    let resultColor = '#ffffff';

    const pent = document.getElementById('interactive-pentagon');
    let shakeClass = 'shake-light';

    if (effectiveDist === 0) {
        vfxClass = 'flash-red';
        resultText = isDefense ? 'HIT' : 'MATCH';
        resultColor = 'var(--color-match)';
        shakeClass = 'shake-heavy';
        if (ghost) ghost.classList.add('match');
    } else if (effectiveDist === 1) {
        vfxClass = 'flash-yellow';
        resultText = isDefense ? 'CLOSE' : 'NEAR';
        resultColor = 'var(--color-near)';
        shakeClass = 'shake-medium';
        if (ghost) ghost.classList.add('near');
    } else {
        vfxClass = 'flash-far';
        resultText = isDefense ? 'NICE' : 'FAR';
        resultColor = 'var(--color-far)';
        if (ghost) ghost.classList.add('far');
    }

    if (targetNode) targetNode.classList.add(vfxClass);
    if (pent) {
        pent.classList.remove('shake-heavy', 'shake-medium', 'shake-light');
        void pent.offsetWidth; // Trigger reflow
        pent.classList.add(shakeClass);
    }

    // Spawn result label at center of interactive pentagon
    const label = document.createElement('div');
    label.className = 'map-result-label';
    label.innerText = resultText;
    label.style.color = resultColor;
    pent.appendChild(label);

    setTimeout(() => label.remove(), 1000);
}

/**
 * Triggers activation VFX on pentagon nodes based on MAP skill effects.
 * @param {number} defenderNode 
 * @param {Object} move 
 */
function triggerMAPActivationVFX(defenderNode, move) {
    if (!move) return;

    const nodes = document.querySelectorAll('#interactive-pentagon .node');
    const getAbsoluteIndex = (relDist) => {
        // Find all indices at this relative distance from defenderNode
        const indices = [];
        for (let i = 0; i < 5; i++) {
            const diff = Math.abs(i - defenderNode);
            const dist = Math.min(diff, 5 - diff);
            if (dist === relDist) indices.push(i);
        }
        return indices;
    };

    // Helper to apply class to specific distances
    const applyToDist = (dist, className) => {
        const absoluteIndices = getAbsoluteIndex(dist);
        absoluteIndices.forEach(idx => {
            const node = Array.from(nodes).find(n => parseInt(n.dataset.index) === idx);
            if (node) node.classList.add(className);
        });
    };

    // Logic based on skill modifiers (Mapping user requests to technical properties)
    if (move.matchExpand === 1 || move.matchOffset === -1) {
        // [EASY TARGET]: 3 Red (Dist 0, 1), 2 Yellow (Dist 2)
        applyToDist(0, 'node-activate-match');
        applyToDist(1, 'node-activate-match');
        applyToDist(2, 'node-activate-near');
    } else if (move.matchRisky) {
        // [ALL OR NOTHING]: 1 Red (Dist 0), 4 Far (Dist 1, 2)
        applyToDist(0, 'node-activate-match');
        applyToDist(1, 'node-activate-far');
        applyToDist(2, 'node-activate-far');
    } else if (move.matchFixed === 1) {
        // [RELIABLE HIT]: All 5 Yellow
        applyToDist(0, 'node-activate-near');
        applyToDist(1, 'node-activate-near');
        applyToDist(2, 'node-activate-near');
    } else if (move.matchFixed === 2) {
        // [PUNY SLAP]: All 5 White
        applyToDist(0, 'node-activate-far');
        applyToDist(1, 'node-activate-far');
        applyToDist(2, 'node-activate-far');
    } else if (move.matchExpand === 2) {
        // [PERFECT STRIKE]: All 5 Red
        applyToDist(0, 'node-activate-match');
        applyToDist(1, 'node-activate-match');
        applyToDist(2, 'node-activate-match');
    } else if (move.id === 'drunk_man' || move.matchFixed === 3) {
        // [DRUNK MAN]: 1 Near (Dist 0), 4 Far (Dist 1, 2)
        applyToDist(0, 'node-activate-near');
        applyToDist(1, 'node-activate-far');
        applyToDist(2, 'node-activate-far');
    }
}

function clearVFX() {
    interactiveNodes.forEach(node => {
        node.classList.remove('flash-red', 'flash-yellow', 'flash-far', 'flash-white', 'highlight', 'node-activate-match', 'node-activate-near', 'node-activate-far');
    });

    const pent = document.getElementById('interactive-pentagon');
    if (pent) pent.classList.remove('shake-heavy', 'shake-medium', 'shake-light');

    document.querySelectorAll('.enemy-ghost').forEach(ghost => {
        ghost.classList.add('ghost-fade-out');
        setTimeout(() => ghost.remove(), 500);
    });
}

async function performJump(ghost) {
    // Jump animation removed for portraits as per user request.
    // We only handle the Ghost Jump (On interactive pentagon) now.

    // Ghost Jump (On interactive pentagon)
    if (ghost && gameState.enemy.currentNode !== null) {
        const ghostTargetNode = document.querySelector(`#interactive-pentagon .node[data-index="${gameState.enemy.currentNode}"]`);
        if (ghostTargetNode) {
            ghost.classList.add('visible');
            ghost.style.transform = ghostTargetNode.style.transform;
        }
    }

    return new Promise(r => setTimeout(r, 600));
}

function resetPositions() {
    // 1. Sanitize Interactive Pentagon (Clear Ghosts / Debris)
    document.querySelectorAll('.enemy-ghost').forEach(g => g.remove());

    // 2. Data Reset
    gameState.player.currentNode = null;
    gameState.enemy.currentNode = null;
}

function spawnDamageNumber(targetEl, amount, isCrit = false, typeMultiplier = 1.0) {
    const dmgEl = document.createElement('div');
    let extraClass = '';
    if (typeMultiplier > 1.0) extraClass = 'super-effective';
    else if (typeMultiplier < 1.0) extraClass = 'resisted';

    dmgEl.className = `damage-number ${isCrit ? 'critical' : ''} ${extraClass}`;
    dmgEl.innerText = `-${amount}`;
    targetEl.appendChild(dmgEl);
    setTimeout(() => dmgEl.remove(), 1200);
}

function spawnLysisNumber(targetEl, amount) {
    const lysisEl = document.createElement('div');
    lysisEl.className = 'lysis-number';

    const icon = document.createElement('img');
    icon.src = 'assets/images/shield_broken.png';
    icon.className = 'lysis-vfx-icon';

    const text = document.createElement('span');
    text.innerText = amount;

    lysisEl.appendChild(icon);
    lysisEl.appendChild(text);

    targetEl.appendChild(lysisEl);
    setTimeout(() => lysisEl.remove(), 1200);
}

function spawnShieldNumber(targetEl, amount) {
    const shieldEl = document.createElement('div');
    shieldEl.className = 'shield-number';

    const icon = document.createElement('img');
    icon.src = 'assets/images/shield.png';
    icon.className = 'shield-vfx-icon';

    const text = document.createElement('span');
    text.innerText = amount;

    shieldEl.appendChild(icon);
    shieldEl.appendChild(text);

    targetEl.appendChild(shieldEl);
    setTimeout(() => shieldEl.remove(), 1200);
}

function spawnHealNumber(targetEl, amount) {
    const healEl = document.createElement('div');
    healEl.className = 'heal-number';
    healEl.innerText = `+${amount}HP`;
    targetEl.appendChild(healEl);
    setTimeout(() => healEl.remove(), 1200);
}

function spawnPellicleVFX(attackerId, amount) {
    const isPlayer = attackerId === 'PLAYER';
    const playerContainer = document.querySelector('.player-display .monster-portrait-container');
    const enemyContainer = document.querySelector('.enemy-display .monster-portrait-container');

    const targetPortrait = isPlayer ? playerContainer : enemyContainer;
    const endRect = targetPortrait.getBoundingClientRect();

    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const vfx = document.createElement('div');
            vfx.className = 'pellicle-point-vfx';
            vfx.innerHTML = `<img src="assets/images/PelliclePoint.png">`;

            // Drop from sky: top of viewport, horizontally centered over target
            const targetX = endRect.left + endRect.width / 2 - 18; // 36px / 2
            const targetY = endRect.top + endRect.height / 2 - 18;

            vfx.style.left = `${targetX}px`;
            vfx.style.top = `-100px`;
            vfx.style.opacity = '0';
            vfx.style.scale = '2';
            vfx.style.rotate = '-45deg';

            document.body.appendChild(vfx);

            // Re-flow
            void vfx.offsetWidth;

            // ANIMATION: Drop down with impact feel
            vfx.style.transition = 'top 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-out, scale 0.6s ease-out, rotate 0.6s ease-out';
            vfx.style.top = `${targetY}px`;
            vfx.style.opacity = '1';
            vfx.style.scale = '1';
            vfx.style.rotate = '0deg';

            // FADE OUT: After short dwell
            setTimeout(() => {
                vfx.style.transition = 'all 0.3s ease-in';
                vfx.style.opacity = '0';
                vfx.style.scale = '0.5';
                vfx.style.transform = 'translateY(15px)';
            }, 700);

            setTimeout(() => vfx.remove(), 1000);
        }, i * 150); // Staggered rain effect
    }
}

function handleMonsterSwitch(benchIndex) {
    const targetMonster = gameState.playerParty[benchIndex];
    if (!targetMonster || targetMonster.hp <= 0 || gameState.isProcessing) return;

    // Use Custom In-Game Modal instead of window.confirm
    const modal = document.getElementById('switch-confirm-modal');
    const msg = document.getElementById('switch-message');
    const btnConfirm = document.getElementById('btn-confirm-switch');
    const btnCancel = document.getElementById('btn-cancel-switch');

    if (!modal || !msg || !btnConfirm || !btnCancel) {
        console.error("Switch modal elements not found!");
        return;
    }

    msg.innerHTML = `Switch to <span class="neon-text">${targetMonster.name}</span>?<br>This redeployment will conclude your current turn.`;
    modal.classList.remove('hidden');

    btnConfirm.onclick = () => {
        modal.classList.add('hidden');
        executeMonsterSwitch(benchIndex);
    };

    btnCancel.onclick = () => {
        modal.classList.add('hidden');
    };
}

function executeMonsterSwitch(benchIndex) {
    const targetMonster = gameState.playerParty[benchIndex];
    if (!targetMonster || gameState.isProcessing) return;

    gameState.isProcessing = true;

    // Instant Reset: Snap back to center immediately when switch is confirmed
    isDragging = false;
    resetSelectorCore(true);

    const oldName = gameState.player.name;
    addLog(`Recalling ${oldName}...`);

    triggerMonsterExit('.player-display', () => {
        addLog(`Deploying ${targetMonster.name}!`);

        // Finalize state change
        gameState.player = targetMonster;

        // Turn Swap
        gameState.currentTurn = 'ENEMY';
        gameState.phase = 'NODE_SELECTION';

        // Reset node selections
        gameState.player.currentNode = null;
        gameState.enemy.currentNode = null;

        // Battle Entry Animation (Pod Drop)
        triggerBattleEntry('.player-display', () => {
            updateBattleCard(targetMonster);
            gameState.isProcessing = false; // Release lock only after deployment
            updateUI();
        });
    });
}

function checkGameOver() {
    const isPlayerDefeated = gameState.player.hp <= 0;
    const isEnemyDefeated = gameState.enemy.hp <= 0;

    if (!isPlayerDefeated && !isEnemyDefeated) return false;

    // Helper to wrap up turn state after replacements
    const finalizeTurnSequence = () => {
        gameState.phase = 'MOVE_SELECTION';
        gameState.currentTurn = (gameState.currentTurn === 'PLAYER') ? 'ENEMY' : 'PLAYER';
        resetSelectorCore(true);
        gameState.isProcessing = false;
        updateUI();
    };

    // 1. Double Neutralization Logic
    if (isPlayerDefeated && isEnemyDefeated) {
        addLog(`[CRITICAL] Double Neutralization detected. Tactical reset core engaging...`);
        isDragging = false;
        resetSelectorCore();

        let exitsFinished = 0;
        const onExitComplete = () => {
            exitsFinished++;
            if (exitsFinished < 2) return;

            // Both have left, now check for follow-up
            const nextPlayer = gameState.playerParty.find(m => m.hp > 0);
            const nextEnemy = gameState.enemyParty.find(m => m.hp > 0);

            if (!nextPlayer && !nextEnemy) {
                showGameOver(true); // Draw (mission failure for player)
            } else if (!nextPlayer) {
                showGameOver(true); // Failure
            } else if (!nextEnemy) {
                showGameOver(false); // Victory (unusual on double death but possible if player has more)
            } else {
                // Both have replacements
                gameState.player = nextPlayer;
                gameState.enemy = nextEnemy;
                updateUI();

                let entriesFinished = 0;
                triggerBattleEntry('.player-display', () => { entriesFinished++; if (entriesFinished === 2) finalizeTurnSequence(); });
                triggerBattleEntry('.enemy-display', () => { entriesFinished++; if (entriesFinished === 2) finalizeTurnSequence(); });
            }
        };

        triggerMonsterExit('.player-display', onExitComplete);
        triggerMonsterExit('.enemy-display', onExitComplete);
        return true;
    }

    if (isEnemyDefeated) {
        resetSelectorCore();

        triggerMonsterExit('.enemy-display', () => {
            const nextMonster = gameState.enemyParty.find(m => m.hp > 0);
            if (nextMonster) {
                addLog(`Target neutralized. Next target incoming...`);
                gameState.enemy = nextMonster;
                updateUI();
                triggerBattleEntry('.enemy-display', () => {
                    // Check if player ALSO fainted during the exchange
                    if (!checkGameOver()) {
                        finalizeTurnSequence();
                    }
                });
            } else {
                if (isPlayerDefeated) {
                    checkGameOver();
                } else {
                    showGameOver(false); // Victory
                    gameState.isProcessing = false;
                }
            }
        });
        return true;
    }

    if (isPlayerDefeated) {
        isDragging = false;
        resetSelectorCore();

        triggerMonsterExit('.player-display', () => {
            const nextMonster = gameState.playerParty.find(m => m.hp > 0);
            if (nextMonster) {
                addLog(`${gameState.player.name} neutralized. Deploying next entity...`);
                gameState.player = nextMonster;
                updateUI();
                triggerBattleEntry('.player-display', () => {
                    // Check if AI ALSO fainted (reflection etc)
                    if (!checkGameOver()) {
                        finalizeTurnSequence();
                    }
                });
            } else {
                showGameOver(true); // Failure
                gameState.isProcessing = false;
            }
        });
        return true;
    }

    return false;
}

function showGameOver(isFailure) {
    const overlay = document.getElementById('game-over-overlay');
    const title = document.getElementById('game-over-title');
    const msg = document.getElementById('game-over-message');

    if (overlay && title && msg) {
        if (isFailure) {
            title.innerHTML = `SYSTEM <span class="neon-text">FAILURE</span>`;
            msg.innerText = `All cellular entities have been neutralized. Lab integrity compromised.`;
        } else {
            title.innerHTML = `MISSION <span class="neon-text">SUCCESS</span>`;
            msg.innerText = `All target entities have been purged. Objective secured.`;
        }
        overlay.classList.remove('hidden');
    }
}

function showScreen(screenId) {
    const currentVisible = Array.from(document.querySelectorAll('.screen')).find(s => !s.classList.contains('hidden'));

    // Track previous screen for "back" functionality, but don't set it if the target is rulebook
    // (though rulebook already sets it, let's make it consistent)
    if (currentVisible && screenId !== currentVisible.id) {
        // Special case: don't make the rulebook or inventory overworld the 'previous' of main menu if logically we want to go back to main menu
        // But generally, tracking the last visible screen is what "back" means.
        previousScreen = currentVisible.id;
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove('hidden');
}

function resetGame() {
    // 1. Initialize Parties from Profiles
    // Player is always the 'player' profile
    const pProfile = gameState.profiles.player;
    gameState.playerParty = pProfile.party;
    gameState.playerLevel = pProfile.level; // Sync legacy field for combat engine

    // Enemy is the selected battle opponent profile (defaults to 'opponent')
    let eProfileId = catalystState.battleOpponentId || 'opponent';
    const eProfile = gameState.profiles[eProfileId];
    gameState.enemyParty = eProfile.party;
    gameState.enemyLevel = eProfile.level; // Sync legacy field

    // Set Active Combatants
    gameState.player = gameState.playerParty[0];
    gameState.enemy = gameState.enemyParty[0];

    // Determine Starting Turn based on Speed
    const playerSpd = gameState.player.spd || 10;
    const enemySpd = gameState.enemy.spd || 10;

    // LEADER PERK #4: Initiative Zero
    const hasLeader4 = gameState.player.equippedCards && gameState.player.equippedCards.some(s => s.cardId === 'leader_4');

    if (hasLeader4 || playerSpd >= enemySpd) {
        gameState.currentTurn = 'PLAYER';
        if (hasLeader4) {
            addLog(`[PERK] Neural Initiative: Always going first! ⚡`);
        } else {
            addLog(`${gameState.player.name} is faster! Initializing initiative...`);
        }
    } else {
        gameState.currentTurn = 'ENEMY';
        addLog(`${gameState.enemy.name} is faster! Defensive protocols active.`);
    }

    gameState.phase = 'NODE_SELECTION';

    // Clear death visuals
    document.querySelectorAll('.dead-cell-container').forEach(c => c.remove());
    document.querySelectorAll('.monster-portrait').forEach(p => p.classList.remove('death-fade'));

    // Reset selection core to center
    resetSelectorCore(true);

    // Clear all node highlights/selections
    interactiveNodes.forEach(n => n.classList.remove('selected', 'highlight'));

    // Reset battle log
    battleLogHistory = [];
    const logContainer = document.getElementById('battle-log');
    if (logContainer) logContainer.innerHTML = '';
    addLog("MISSION START: Purge initialized.");

    // Reset monster card sidebar
    const cardInner = document.querySelector('.card-inner');
    const frontImg = document.getElementById('battle-card-front-img');
    const backImg = document.getElementById('battle-card-back-img');
    const bioText = document.getElementById('bio-text');

    if (cardInner) cardInner.classList.remove('is-flipped');
    if (frontImg) frontImg.src = 'assets/images/Card_Back.png'; // Start both as back visual
    if (backImg) backImg.src = 'assets/images/Card_Back.png';
    if (bioText) bioText.innerText = 'Select a cellular entity to initialize tactical readout.';

    updateUI();

    // Trigger Battle Entry Sequence
    triggerBattleEntry('.player-display', () => {
        // Auto-flip monster card to show player monster after deployment
        updateBattleCard(gameState.player);
    });
    triggerBattleEntry('.enemy-display');
}

function triggerBenchFeedback(slot) {
    const img = slot.querySelector('img');
    if (img) {
        img.classList.remove('anim-pulse');
        void img.offsetWidth;
        img.classList.add('anim-pulse');
    }
}


function triggerMonsterExit(displaySelector, callback) {
    const display = document.querySelector(displaySelector);
    const portrait = display?.querySelector('.monster-portrait');
    if (!display || !portrait) {
        if (callback) callback();
        return;
    }

    // 1. Reset Classes & Force Reflow
    portrait.classList.remove('anim-recall-exit', 'anim-monster-pop');
    void portrait.offsetWidth;

    // 2. Monster Shrink
    portrait.classList.add('anim-recall-exit');

    // 3. Container Capture
    const container = document.createElement('div');
    container.className = 'dead-cell-container anim-container-capture';
    const containerImg = displaySelector.includes('player') ? 'CellContainer_Back.png' : 'CellContainer.png';
    container.innerHTML = `<img src="assets/images/${containerImg}">`;
    display.appendChild(container);

    // 4. Coordination
    setTimeout(() => {
        portrait.classList.remove('anim-recall-exit');
        // Ensure it's hidden but use a class or consistent style
        portrait.style.opacity = "0";
        portrait.style.transform = "scale(0)";
        container.remove();
        if (callback) callback();
    }, 1000); // Matches container-capture duration
}


function triggerBattleEntry(displaySelector, callback) {
    const display = document.querySelector(displaySelector);
    const portrait = display?.querySelector('.monster-portrait');
    if (!display || !portrait) {
        if (callback) callback();
        return;
    }

    // 1. Reset Classes & Force Reflow
    portrait.classList.remove('anim-recall-exit', 'anim-monster-pop');
    portrait.style.opacity = "0";
    portrait.style.transform = "scale(0)";
    void portrait.offsetWidth;

    // 2. Spawn CellContainer
    const container = document.createElement('div');
    container.className = 'dead-cell-container animate-heavy-drop'; // Reuse drop style

    const containerImg = displaySelector.includes('player') ? 'CellContainer_Back.png' : 'CellContainer.png';
    container.innerHTML = `<img src="assets/images/${containerImg}">`;
    display.appendChild(container);

    // 3. Orchestration
    setTimeout(() => {
        // Container Dissolve
        container.classList.remove('animate-heavy-drop');
        void container.offsetWidth;
        container.classList.add('anim-container-dissolve');

        // Monster Pop Out
        setTimeout(() => {
            portrait.style.opacity = "1";
            portrait.style.transform = "scale(1)"; // Clear the scale(0) reset
            portrait.classList.add('anim-monster-pop');

            if (callback) callback();

            // Clean up container
            setTimeout(() => container.remove(), 500);
        }, 300); // Mid-dissolve
    }, 1400); // After heavy drop settles
}


// UNIFIED MANAGEMENT HUB LOGIC
function renderManagementHub() {
    const battleContainer = document.getElementById('enable-battle-container');
    const battleCheckbox = document.getElementById('debug-enable-battle');

    if (battleContainer && battleCheckbox) {
        if (catalystState.activeProfile === 'player') {
            battleContainer.style.display = 'none';
        } else {
            battleContainer.style.display = 'flex';
            battleCheckbox.checked = (catalystState.battleOpponentId === catalystState.activeProfile);
        }
    }

    renderCellStorage();
    updateTeamSlots();
    updateCatalystBox();
    updateCatalystCore();
}

function renderCellStorage() {
    const grid = document.querySelector('.grid-container');
    if (!grid) return;
    grid.innerHTML = '';

    const profileId = catalystState.activeProfile;
    // If player, show cellDex. Otherwise (NPCs/Opponent), show all monsters for debug presets.
    const monstersToShow = profileId === 'player'
        ? gameState.cellDex
        : Object.keys(MONSTERS);

    monstersToShow.forEach(name => {
        const icon = document.createElement('div');
        icon.className = 'monster-icon';
        icon.draggable = true;
        const imgName = name.charAt(0).toUpperCase() + name.slice(1);
        icon.innerHTML = `<img src="./assets/images/${imgName}.png" alt="${name}" onerror="this.src='./assets/images/Card_Placeholder.png'">`;

        icon.ondragstart = (e) => {
            e.dataTransfer.setData('monsterName', name);
            e.dataTransfer.setData('sourceSide', catalystState.activeSide);
        };

        // Click to preview/open card
        icon.onclick = () => openMonsterCard(name);

        grid.appendChild(icon);
    });
}

function updateTeamSlots() {
    const slots = document.querySelectorAll('.slot');
    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const team = profile.team;

    const labels = ["First", "Second", "Third"];

    slots.forEach((slot, idx) => {
        slot.innerHTML = '';
        // Subtle active state handled in CSS
        slot.classList.toggle('active', idx === catalystState.activeMonsterIdx);

        // Add position label
        const labelText = document.createElement('div');
        labelText.className = 'slot-label';
        labelText.innerText = labels[idx];
        slot.appendChild(labelText);

        const monster = party[idx];
        if (monster) {
            const imgName = monster.name.charAt(0).toUpperCase() + monster.name.slice(1);
            const img = document.createElement('img');
            img.onerror = () => img.src = './assets/images/Card_Placeholder.png';
            img.src = `./assets/images/${imgName}.png`;
            img.alt = monster.name;
            slot.appendChild(img);

            slot.draggable = true;
            slot.ondragstart = (e) => {
                e.dataTransfer.setData('sourceSlot', idx);
                e.dataTransfer.setData('sourceSide', catalystState.activeSide);
            };
        }

        slot.onclick = () => {
            if (monster) {
                catalystState.activeMonsterIdx = idx;
                renderManagementHub();
            }
        };

        slot.ondragover = (e) => e.preventDefault();
        slot.ondrop = (e) => {
            e.preventDefault();
            const monsterName = e.dataTransfer.getData('monsterName');
            const sourceSlot = e.dataTransfer.getData('sourceSlot');
            const sourceSide = e.dataTransfer.getData('sourceSide');

            if (sourceSide !== catalystState.activeSide) {
                addLog("Cannot transfer Cells between different profiles.");
                return;
            }

            const activeProfile = gameState.profiles[catalystState.activeProfile];
            const targetParty = activeProfile.party;
            const targetTeam = activeProfile.team;

            if (monsterName) {
                // Assign new monster from Dex/Storage
                const data = JSON.parse(JSON.stringify(MONSTERS[monsterName]));
                targetParty[idx] = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    currentNode: null,
                    blockedNodes: [],
                    equippedCards: [],
                    hp: data.hp,
                    pp: 1,
                    selectedMove: data.moves[0].id
                };
                if (catalystState.activeSide === 'PLAYER') {
                    gameState.playerTeam[idx] = monsterName;
                } else {
                    gameState.enemyTeam[idx] = monsterName;
                }
            } else if (sourceSlot !== "") {
                // Swap slots
                const sourceIdx = parseInt(sourceSlot);
                const tempParty = targetParty[idx];
                targetParty[idx] = targetParty[sourceIdx];
                targetParty[sourceIdx] = tempParty;

                if (catalystState.activeSide === 'PLAYER') {
                    const tempTeam = gameState.playerTeam[idx];
                    gameState.playerTeam[idx] = gameState.playerTeam[sourceIdx];
                    gameState.playerTeam[sourceIdx] = tempTeam;
                } else {
                    const tempTeam = gameState.enemyTeam[idx];
                    gameState.enemyTeam[idx] = gameState.enemyTeam[sourceIdx];
                    gameState.enemyTeam[sourceIdx] = tempTeam;
                }
            }
            renderManagementHub();
        };
    });
}

function updateCatalystBox() {
    const grid = document.getElementById('card-box-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const profile = gameState.profiles[catalystState.activeProfile];
    let box = [...profile.cardBox];

    // Sorting Logic
    const rarityOrder = { 'legendary': 4, 'epic': 3, 'rare': 2, 'uncommon': 1, 'common': 0 };
    const typeOrder = { 'atk': 0, 'def': 1, 'hp': 2, 'spd': 3, 'pp': 4, 'crit': 5, 'leader': 6 };

    box.sort((a, b) => {
        const cardA = CARDS[a];
        const cardB = CARDS[b];
        if (!cardA || !cardB) return 0;

        if (catalystState.boxSortMode === 'tier') {
            const tierOrder = { '1': 0, '2': 1, '3': 2, 'L': 3 };
            const diff = tierOrder[cardA.tier] - tierOrder[cardB.tier];
            if (diff !== 0) return diff;
            return cardA.name.localeCompare(cardB.name);
        } else if (catalystState.boxSortMode === 'rarity') {
            // Sort by Rarity Desc, then Name
            const diff = rarityOrder[cardB.rarity] - rarityOrder[cardA.rarity];
            if (diff !== 0) return diff;
            return cardA.name.localeCompare(cardB.name);
        } else {
            // Sort by Type (Stat prioritized), then by Bonus Value (Low -> High)
            const getTypeInfo = (c) => {
                if (c.isLeader) return { type: 'leader', val: 0 };
                const statKey = Object.keys(c.stats)[0] || 'atk';
                const statVal = c.stats[statKey] || 0;
                return { type: statKey, val: statVal };
            };
            const infoA = getTypeInfo(cardA);
            const infoB = getTypeInfo(cardB);
            const typeDiff = typeOrder[infoA.type] - typeOrder[infoB.type];
            if (typeDiff !== 0) return typeDiff;

            // Within same type, sort by bonus value (low to high)
            const valDiff = infoA.val - infoB.val;
            if (valDiff !== 0) return valDiff;

            return cardA.name.localeCompare(cardB.name);
        }
    });

    const counts = {};
    box.forEach(id => counts[id] = (counts[id] || 0) + 1);

    // Filter unique IDs for display while maintaining sort order
    const uniqueIds = [];
    const seen = new Set();
    box.forEach(id => {
        if (!seen.has(id)) {
            uniqueIds.push(id);
            seen.add(id);
        }
    });

    uniqueIds.forEach(cardId => {
        const card = CARDS[cardId];
        if (!card) return;

        const count = counts[cardId];
        const item = document.createElement('div');
        item.className = `box-card rarity-${card.rarity} tier-${card.tier}`;
        item.draggable = true;

        const statsHtml = Object.entries(card.stats || {}).map(([k, v]) => `
            <div class="stat-peek">${k.toUpperCase()} +${v}</div>
        `).join('');

        const slotsHtml = card.slots > 0 ? `<div class="slot-peek">SLOT +${card.slots}</div>` : '';

        const leaderTag = card.isLeader ? `<div class="leader-type-tag">${card.type === 'passive' ? 'P' : 'E'}</div>` : '';

        item.innerHTML = `
            <div class="card-tier-label">T${card.tier}</div>
            <div class="rarity-label">${card.rarity === 'common' ? '' : card.rarity.charAt(0).toUpperCase()}</div>
            <div class="card-main-content">
                ${statsHtml}
                ${slotsHtml}
            </div>
            ${leaderTag}
            <div class="count">x${count}</div>
        `;

        item.onclick = (e) => {
            if (e.ctrlKey) return; // Ctrl click reserved for something else? No, keep it clean.
            openCardDetail(cardId);
        };

        item.ondragstart = (e) => {
            catalystState.draggedCardId = cardId;
            catalystState.dragSourceSide = catalystState.activeSide;
            catalystState.dragSourceProfile = catalystState.activeProfile;
            catalystState.dragSourceSlot = null;
            e.dataTransfer.setData('text/plain', cardId);
            document.querySelectorAll('.catalyst-slot').forEach(s => s.classList.add('highlight'));
        };

        item.ondragend = () => {
            document.querySelectorAll('.catalyst-slot').forEach(s => s.classList.remove('highlight'));
        };

        grid.appendChild(item);
    });
}

function updateCatalystCore() {
    const anchor = document.getElementById('slots-anchor');
    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const monster = party[catalystState.activeMonsterIdx];
    const nameEl = document.getElementById('catalyst-monster-name');
    if (!anchor || !monster) return;

    nameEl.textContent = monster.name;
    const level = profile.level;
    setSafe('#catalyst-monster-rg', 'textContent', `RG-${level}`);
    const stats = getModifiedStats(monster, level);
    const hpPeek = document.getElementById('peek-hp');
    const ppPeek = document.getElementById('peek-pp');
    const atkPeek = document.getElementById('peek-atk');
    const defPeek = document.getElementById('peek-def');
    const spdPeek = document.getElementById('peek-spd');
    const crtPeek = document.getElementById('peek-crt');

    const bonuses = { hp: 0, pp: 0, atk: 0, def: 0, spd: 0, crt: 0 };
    monster.equippedCards.forEach(ec => {
        const card = CARDS[ec.cardId];
        if (card && card.stats) {
            bonuses.hp += (card.stats.hp || 0);
            bonuses.pp += (card.stats.pp || 0);
            bonuses.atk += (card.stats.atk || 0);
            bonuses.def += (card.stats.def || 0);
            bonuses.spd += (card.stats.spd || 0);
            bonuses.crt += (card.stats.crit || 0);
        }
    });

    const fmt = (base, bonus) => bonus > 0 ? `${base + bonus} (${base} + ${bonus})` : base;

    if (hpPeek) hpPeek.textContent = fmt(monster.maxHp, bonuses.hp);
    if (ppPeek) ppPeek.textContent = fmt(monster.maxPp, bonuses.pp);
    if (atkPeek) atkPeek.textContent = fmt(monster.atk, bonuses.atk);
    if (defPeek) defPeek.textContent = fmt(monster.def, bonuses.def);
    if (spdPeek) spdPeek.textContent = fmt(monster.spd, bonuses.spd);
    if (crtPeek) {
        const total = monster.crit + bonuses.crt;
        crtPeek.textContent = bonuses.crt > 0
            ? `${total}% (${monster.crit}% + ${bonuses.crt}%)`
            : `${monster.crit}%`;
    }

    anchor.innerHTML = '';

    // Add Monster Icon at the very top (Root of the tree)
    const monsterIcon = document.createElement('div');
    monsterIcon.className = 'catalyst-monster-root';
    const imgName = monster.name.charAt(0).toUpperCase() + monster.name.slice(1);
    monsterIcon.innerHTML = `<img src="assets/images/${imgName}.png" alt="${monster.name}">`;
    anchor.appendChild(monsterIcon);

    const slotPositions = calculateSlotLayout(monster);

    slotPositions.forEach((pos, idx) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'catalyst-slot';
        slotDiv.style.left = `${pos.x}px`;
        slotDiv.style.top = `${pos.y}px`;
        slotDiv.dataset.slotIdx = idx;

        const equippedCard = monster.equippedCards.find(ec => ec.slotIndex === idx);

        if (equippedCard) {
            const card = CARDS[equippedCard.cardId];
            slotDiv.classList.add('occupied', `tier-${card.tier}`);
            const statsHtml = Object.entries(card.stats || {}).map(([k, v]) => `
                <div class="stat-peek">${k.toUpperCase()} +${v}</div>
            `).join('');
            const slotsHtml = card.slots > 0 ? `<div class="slot-peek">SLOT +${card.slots}</div>` : '';

            const leaderTag = card.isLeader ? `<div class="leader-type-tag">${card.type === 'passive' ? 'P' : 'E'}</div>` : '';

            slotDiv.innerHTML = `
                <div class="c-card-ui rarity-${card.rarity} tier-${card.tier}" draggable="true">
                    <div class="card-tier-label">T${card.tier}</div>
                    <div class="rarity-label">${card.rarity === 'common' ? '' : card.rarity.charAt(0).toUpperCase()}</div>
                    <div class="card-main-content">
                        ${statsHtml}
                        ${slotsHtml}
                    </div>
                    ${leaderTag}
                </div>
            `;

            const cardEl = slotDiv.querySelector('.c-card-ui');
            cardEl.ondragstart = (e) => {
                catalystState.draggedCardId = equippedCard.cardId;
                catalystState.dragSourceSide = catalystState.activeSide;
                catalystState.dragSourceSlot = { monsterIdx: catalystState.activeMonsterIdx, slotIdx: idx };
                e.dataTransfer.setData('text/plain', equippedCard.cardId);
            };

            slotDiv.onclick = (e) => {
                if (e.ctrlKey) {
                    unequipCard(catalystState.activeMonsterIdx, idx);
                } else {
                    openCardDetail(equippedCard.cardId);
                }
            };
        }

        slotDiv.ondragover = (e) => e.preventDefault();
        slotDiv.ondrop = (e) => {
            e.preventDefault();
            const cardId = e.dataTransfer.getData('text/plain');
            equipCard(catalystState.activeMonsterIdx, idx, cardId);
        };

        anchor.appendChild(slotDiv);
    });

    drawConnections(slotPositions, monster);
}

function calculateSlotLayout(monster) {
    // 1. Initialize 3 base slots
    let slots = [
        { id: 0, parent: -1, level: 0, children: [] },
        { id: 1, parent: -1, level: 0, children: [] },
        { id: 2, parent: -1, level: 0, children: [] }
    ];

    // 2. Build the tree structure up to 10 slots
    let currentIndex = 0;
    while (currentIndex < slots.length && slots.length < 10) {
        const equipped = monster.equippedCards.find(ec => ec.slotIndex === currentIndex);
        if (equipped) {
            const card = CARDS[equipped.cardId];
            const childCount = card.slots || 0;
            for (let i = 0; i < childCount; i++) {
                if (slots.length >= 10) break;
                const newId = slots.length;
                const newNode = { id: newId, parent: currentIndex, level: slots[currentIndex].level + 1, children: [] };
                slots[currentIndex].children.push(newNode);
                slots.push(newNode);
            }
        }
        currentIndex++;
    }

    // 3. Subtree Width Calculation (to prevent overlap)
    const memoWidth = {};
    const getSubtreeWidth = (id) => {
        if (memoWidth[id] !== undefined) return memoWidth[id];
        const node = slots[id];
        if (node.children.length === 0) return 1;
        let w = 0;
        node.children.forEach(c => w += getSubtreeWidth(c.id));
        memoWidth[id] = Math.max(w, 1);
        return memoWidth[id];
    };

    // 4. Position Assignment
    const PADDING_X = 180;
    const PADDING_Y = 280;
    const positions = new Array(slots.length);

    const assignPos = (id, leftLimit, width) => {
        const node = slots[id];
        const centerX = leftLimit + (width * PADDING_X) / 2;
        positions[id] = {
            x: centerX - 70, // 140 width / 2
            y: node.level * PADDING_Y + 180, // Start below monster icon with more gap
            parent: node.parent
        };

        if (node.children.length > 0) {
            let currentLeft = leftLimit;
            node.children.forEach(child => {
                const childWidth = getSubtreeWidth(child.id);
                assignPos(child.id, currentLeft, childWidth);
                currentLeft += childWidth * PADDING_X;
            });
        }
    };

    // Calculate total base width to center the whole tree
    let totalBaseWidth = 0;
    const baseSlots = slots.filter(s => s.parent === -1);
    baseSlots.forEach(s => totalBaseWidth += getSubtreeWidth(s.id));

    let currentX = 800 - (totalBaseWidth * PADDING_X) / 2; // Offset from 1600px anchor center
    baseSlots.forEach(s => {
        const w = getSubtreeWidth(s.id);
        assignPos(s.id, currentX, w);
        currentX += w * PADDING_X;
    });

    return positions;
}

function drawConnections(positions, monster) {
    const canvas = document.getElementById('slot-connections');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const anchor = document.getElementById('slots-anchor');
    if (!anchor) return;

    // Unified coordinate system (1600x2000 matching the anchor)
    canvas.width = 1600;
    canvas.height = 2000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const rootX = 800; // Center of 1600px anchor
    const rootIconY = 40; // Shifted down 20px to match CSS
    const rootIconBottom = rootIconY + 100;
    const firstRowY = positions.length > 0 ? positions[0].y : 0;
    const rootBranchY = rootIconBottom + (firstRowY - rootIconBottom) / 2;

    // Draw from Root Icon to Base Slots
    const baseSlots = positions.filter(p => p.parent === -1);
    if (baseSlots.length > 0) {
        ctx.beginPath();
        ctx.moveTo(rootX, rootIconBottom);
        ctx.lineTo(rootX, rootBranchY);

        baseSlots.forEach(pos => {
            const slotCenterX = pos.x + 70;
            ctx.moveTo(rootX, rootBranchY);
            ctx.lineTo(slotCenterX, rootBranchY);
            ctx.lineTo(slotCenterX, pos.y);
        });
        ctx.stroke();
    }

    // Draw connections between parent and child slots
    positions.forEach((pos, idx) => {
        if (pos.parent !== -1) {
            const parent = positions[pos.parent];
            const startX = parent.x + 70;
            const startY = parent.y + 180; // Bottom of parent card
            const endX = pos.x + 70;
            const endY = pos.y;            // Top of child card

            // Calculate vertical midpoint for Manhattan path
            const midY = startY + (endY - startY) / 2;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX, midY); // Down from parent
            ctx.lineTo(endX, midY);   // Horizontal branch
            ctx.lineTo(endX, endY);   // Down to child
            ctx.stroke();
        }
    });
}

function equipCard(monsterIdx, slotIdx, cardId) {
    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const monster = party[monsterIdx];
    const card = CARDS[cardId];

    // Allowed move: If dragging from a slot on the SAME monster, skip duplicate check
    const isInternalMove = catalystState.dragSourceSlot &&
        catalystState.dragSourceSlot.monsterIdx === monsterIdx &&
        catalystState.dragSourceProfile === catalystState.activeProfile;

    if (!isInternalMove && monster.equippedCards.some(ec => ec.cardId === cardId)) {
        addLog("Cannot equip duplicate cards on same Cell.");
        return;
    }

    // Capture source before we potentially clear it via unequip
    const srcSlot = catalystState.dragSourceSlot;
    const srcProfile = catalystState.dragSourceProfile;

    // 1. Remove from source (Box or other Slot)
    if (srcSlot) {
        const srcParty = gameState.profiles[srcProfile].party;
        const srcMonster = srcParty[srcSlot.monsterIdx];
        srcMonster.equippedCards = srcMonster.equippedCards.filter(ec => ec.slotIndex !== srcSlot.slotIdx);
    } else {
        const box = gameState.profiles[srcProfile].cardBox;
        const index = box.indexOf(cardId);
        if (index > -1) box.splice(index, 1);
    }

    // 2. Handle target slot replacement
    const existing = monster.equippedCards.find(ec => ec.slotIndex === slotIdx);
    if (existing) {
        profile.cardBox.push(existing.cardId);
        monster.equippedCards = monster.equippedCards.filter(ec => ec.slotIndex !== slotIdx);
        processRecursiveRemoval(monster, slotIdx);
    }

    // 3. Place new card
    monster.equippedCards.push({ slotIndex: parseInt(slotIdx), cardId: cardId });
    renderManagementHub();
}

function unequipCard(monsterIdx, slotIdx) {
    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const monster = party[monsterIdx];
    const index = monster.equippedCards.findIndex(ec => ec.slotIndex === slotIdx);
    if (index === -1) return;

    const removed = monster.equippedCards.splice(index, 1)[0];
    profile.cardBox.push(removed.cardId);

    processRecursiveRemoval(monster, slotIdx);
    renderManagementHub();
}

function processRecursiveRemoval(monster, parentSlotIdx) {
    const newPositions = calculateSlotLayout(monster);
    const validIndices = new Set(newPositions.map((_, i) => i));
    const box = catalystState.activeSide === 'PLAYER' ? gameState.cardBox : gameState.enemyCardBox;

    const invalidEquipped = monster.equippedCards.filter(ec => !validIndices.has(ec.slotIndex));
    invalidEquipped.forEach(ec => {
        const idx = monster.equippedCards.indexOf(ec);
        if (idx > -1) {
            const removed = monster.equippedCards.splice(idx, 1)[0];
            box.push(removed.cardId);
            processRecursiveRemoval(monster, ec.slotIndex);
        }
    });
}


function createMonsterInstance(id, existing = null) {
    const data = JSON.parse(JSON.stringify(MONSTERS[id]));
    return {
        ...data,
        currentNode: null,
        blockedNodes: [],
        equippedCards: existing ? [...existing.equippedCards] : [],
        hp: data.hp,
        pp: 1,
        turnCount: 0,
        selectedMove: data.moves[0].id
    };
}

function openCardDetail(cardId) {
    const card = CARDS[cardId];
    if (!card) return;

    const modal = document.getElementById('card-detail-modal');
    if (!modal) return;
    modal.classList.add('active');

    document.getElementById('detail-card-name').textContent = card.name;
    document.getElementById('detail-card-desc').textContent = card.desc || '';
    document.getElementById('detail-card-rarity').textContent = card.rarity === 'common' ? '' : card.rarity.toUpperCase();
    document.getElementById('detail-card-tier').textContent = `TIER ${card.tier}`;

    const typeLabel = document.getElementById('detail-card-type');
    if (card.isLeader) {
        typeLabel.innerHTML = `TYPE: <span class="white-text">LEADER [${card.type.toUpperCase()}]</span>`;
        document.getElementById('detail-leader-tag').textContent = card.type === 'passive' ? 'P' : 'E';
    } else {
        typeLabel.innerHTML = `TYPE: <span class="white-text">ENHANCEMENT</span>`;
        document.getElementById('detail-leader-tag').textContent = '';
    }

    const statsGrid = document.getElementById('detail-card-stats');
    statsGrid.innerHTML = '';

    if (card.stats) {
        Object.entries(card.stats).forEach(([stat, val]) => {
            const item = document.createElement('div');
            item.className = 'detail-stat-item';
            item.innerHTML = `
                <div class="detail-stat-label">${stat}</div>
                <div class="detail-stat-value">+${val}</div>
            `;
            statsGrid.appendChild(item);
        });
    }

    if (card.slots > 0) {
        const item = document.createElement('div');
        item.className = 'detail-stat-item';
        item.innerHTML = `
            <div class="detail-stat-label">Extra Slots</div>
            <div class="detail-stat-value">+${card.slots}</div>
        `;
        statsGrid.appendChild(item);
    }

    // Set preview image - using user requested placeholder
    const imgEl = document.getElementById('detail-card-image');
    imgEl.src = 'assets/images/Card_Placeholder.png';
}

// Add close listener for modal
document.getElementById('close-card-detail')?.addEventListener('click', () => {
    document.getElementById('card-detail-modal').classList.remove('active');
});

// Click outside to close
document.getElementById('card-detail-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'card-detail-modal') {
        e.target.classList.remove('active');
    }
});

// Final Initialization
window.addEventListener('load', init);

