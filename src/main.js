import { gameState } from './engine/state.js';
import { resolveTurn, getDistance, checkOverload } from './engine/combat.js';
import { AI } from './engine/ai.js';
import { MONSTERS } from './data/monsters.js';
import { Overworld } from './engine/overworld.js';

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
        console.log("Odd Labs 2.0 Initializing...");
        setupNodePositions();
        setupEventListeners();
        showScreen('screen-main-menu');
        console.log("Initialization Complete.");
    } catch (e) {
        console.error("Initialization Failed:", e);
        alert("Game failed to initialize. Check Console (F12).");
    }
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
        showScreen('screen-battle');
        resetGame();
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        resetGame();
    });

    document.getElementById('btn-return-menu')?.addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        showScreen('screen-main-menu');
    });

    document.getElementById('btn-battle-back')?.addEventListener('click', () => showScreen(previousScreen));
    document.getElementById('btn-battle-rulebook')?.addEventListener('click', () => showScreen('screen-rulebook'));
    document.getElementById('btn-open-rulebook')?.addEventListener('click', () => showScreen('screen-rulebook'));
    document.getElementById('btn-rulebook-back')?.addEventListener('click', () => showScreen(previousScreen));

    // Cell Container Controls
    document.getElementById('btn-open-cell-container')?.addEventListener('click', () => {
        renderCellContainer();
        showScreen('screen-cell-container');
    });
    document.getElementById('btn-container-back')?.addEventListener('click', () => showScreen(previousScreen));
    document.getElementById('btn-close-card')?.addEventListener('click', () => {
        document.getElementById('monster-card-modal').classList.add('hidden');
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
            const cellContainer = document.getElementById('screen-cell-container');
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
            if (cellContainer && !cellContainer.classList.contains('hidden')) {
                showScreen(previousScreen);
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
        updateBattleCard(gameState.player.name);
    });

    document.querySelector('.enemy-display .monster-portrait-container')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const portrait = e.currentTarget.querySelector('.monster-portrait');
        if (portrait) {
            portrait.classList.remove('anim-pulse');
            void portrait.offsetWidth;
            portrait.classList.add('anim-pulse');
        }
        updateBattleCard(gameState.enemy.name);
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
}

function updateBattleCard(monsterName) {
    const cardInner = document.querySelector('.card-inner');
    const frontImg = document.getElementById('battle-card-front-img');
    const backImg = document.getElementById('battle-card-back-img');
    const bioText = document.getElementById('bio-text');
    if (!cardInner || !frontImg || !backImg || !bioText) return;

    const monsterKey = monsterName.toLowerCase();
    const monsterData = MONSTERS[monsterKey];
    const newSrc = `assets/images/Card_${monsterName}.png`;

    // Check current orientation (0 = Back showing, 180 = Front showing)
    const isFlipped = cardInner.classList.contains('is-flipped');

    if (!isFlipped) {
        // Currently showing BACK (0deg) -> Prepare FRONT and flip to 180
        frontImg.src = newSrc;
        cardInner.classList.add('is-flipped');
    } else {
        // Currently showing FRONT (180deg) -> Prepare BACK and flip to 0
        backImg.src = newSrc;
        cardInner.classList.remove('is-flipped');
    }

    // Sync bio text update midway through the rotation (0.4s)
    setTimeout(() => {
        bioText.innerText = monsterData?.lore || "Tactical data gathering...";

        // Update Stat Grid
        if (monsterData) {
            setSafe('#card-hp', 'innerText', monsterData.maxHp);
            setSafe('#card-pp', 'innerText', monsterData.maxPp);
            setSafe('#card-crit', 'innerText', `${monsterData.crit}%`);
            setSafe('#card-atk', 'innerText', monsterData.atk);
            setSafe('#card-def', 'innerText', monsterData.def);
            setSafe('#card-spd', 'innerText', monsterData.spd);
        }
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
function renderCellContainer() {
    const grid = document.querySelector('.grid-container');
    const slots = document.querySelectorAll('.slot');
    if (!grid || !slots) return;

    // 1. Render CellDex Grid
    grid.innerHTML = '';
    gameState.cellDex.forEach(monsterId => {
        const monster = MONSTERS[monsterId];
        const icon = document.createElement('div');
        icon.className = 'monster-icon';
        icon.draggable = true;
        icon.dataset.id = monsterId;
        icon.innerHTML = `<img src="assets/images/${monster.name}.png" alt="${monster.name}">`;

        // Click to Open Card
        icon.addEventListener('click', (e) => {
            if (e.detail === 1) { // Single click for card
                openMonsterCard(monsterId);
            }
        });

        // Drag Start
        icon.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('monsterId', monsterId);
            e.dataTransfer.setData('sourceSlot', ""); // Mark as coming from grid
            icon.style.opacity = '0.5';
        });

        icon.addEventListener('dragend', () => {
            icon.style.opacity = '1';
        });

        grid.appendChild(icon);
    });

    // 2. Render Team Slots
    updateTeamSlots();
}

function updateTeamSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
        const monsterId = gameState.playerTeam[index];
        slot.innerHTML = '';
        if (monsterId) {
            const monster = MONSTERS[monsterId];
            const img = document.createElement('img');
            img.src = `assets/images/${monster.name}.png`;
            // img.style with removed pointer-events:none will inherited styles from CSS
            slot.appendChild(img);

            // Robust Dragging: Set draggable on the SLOT itself
            slot.draggable = true;
            slot.style.cursor = 'grab';

            // Remove previous listener if any (clean re-render)
            slot.ondragstart = (e) => {
                e.dataTransfer.setData('monsterId', monsterId);
                e.dataTransfer.setData('sourceSlot', index);
                slot.style.opacity = '0.5';
            };

            slot.ondragend = () => {
                slot.style.opacity = '1';
            };
        } else {
            slot.draggable = false;
            slot.style.cursor = 'default';
            slot.ondragstart = null;
            slot.ondragend = null;
        }
    });
}

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
    if (imgEl) imgEl.src = `assets/images/Card_${monster.name}.png`;

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
    let minDist = 40; // Detection radius

    interactiveNodes.forEach((node, idx) => {
        const isBlocked = gameState.player.blockedNodes.includes(idx);
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
        const isBlocked = gameState.player.blockedNodes.includes(idx);
        const rect = node.getBoundingClientRect();
        const nx = rect.left + rect.width / 2;
        const ny = rect.top + rect.height / 2;
        const d = Math.hypot(clientX - nx, clientY - ny);

        if (d < 40 && !isBlocked) {
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
    // Update Stats (Central Arena)
    const playerPpPercent = gameState.player.pp / gameState.player.maxPp;
    const playerPpColor = `hsl(183, ${10 + 90 * playerPpPercent}%, ${40 + 10 * playerPpPercent}%)`;
    document.querySelector('.player-display')?.style.setProperty('--pp-color', playerPpColor);

    setStyle('.player-display .hp-fill', 'width', `${(gameState.player.hp / gameState.player.maxHp) * 100}%`);
    setStyle('.player-display .pp-fill', 'width', `${(gameState.player.pp / gameState.player.maxPp) * 100}%`);
    document.querySelector('.player-display .pp-fill')?.classList.toggle('overload', gameState.player.pp >= 10);
    setSafe('#player-hp-val', 'innerText', `${gameState.player.hp} / ${gameState.player.maxHp}`);
    setSafe('#player-pp-val', 'innerText', `${gameState.player.pp} / ${gameState.player.maxPp}`);

    setSafe('.player-display .name', 'innerHTML', gameState.player.name);
    const pLayer = document.querySelector('.player-display .monster-float-layer');
    const pImg = document.querySelector('.player-display .monster-portrait');
    if (pImg) pImg.src = `assets/images/${gameState.player.name}_Back.png`;
    if (pLayer) pLayer.classList.toggle('anim-attacker-float', gameState.currentTurn === 'PLAYER');

    const enemyPpPercent = gameState.enemy.pp / gameState.enemy.maxPp;
    const enemyPpColor = `hsl(183, ${10 + 90 * enemyPpPercent}%, ${40 + 10 * enemyPpPercent}%)`;
    document.querySelector('.enemy-display')?.style.setProperty('--pp-color', enemyPpColor);

    setStyle('.enemy-display .hp-fill', 'width', `${(gameState.enemy.hp / gameState.enemy.maxHp) * 100}%`);
    setStyle('.enemy-display .pp-fill', 'width', `${(gameState.enemy.pp / gameState.enemy.maxPp) * 100}%`);
    document.querySelector('.enemy-display .pp-fill')?.classList.toggle('overload', gameState.enemy.pp >= 10);
    setSafe('#enemy-hp-val', 'innerText', `${gameState.enemy.hp} / ${gameState.enemy.maxHp}`);
    setSafe('#enemy-pp-val', 'innerText', `${gameState.enemy.pp} / ${gameState.enemy.maxPp}`);

    setSafe('.enemy-display .name', 'innerHTML', gameState.enemy.name);
    const eLayer = document.querySelector('.enemy-display .monster-float-layer');
    const eImg = document.querySelector('.enemy-display .monster-portrait');
    if (eImg) eImg.src = `assets/images/${gameState.enemy.name}.png`;
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
            slot.innerHTML = `<img src="assets/images/${monster.name}.png" alt="${monster.name}">`;
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
                updateBattleCard(monster.name);
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
            slot.innerHTML = `<img src="assets/images/${monster.name}.png" alt="${monster.name}">`;
            slot.classList.toggle('dead', isDead);
            slot.draggable = false;
            slot.onclick = () => {
                if (isDead) return;
                triggerBenchFeedback(slot);
                updateBattleCard(monster.name);
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
        const isBurned = gameState.player.burnedNodes.some(b => b.index === idx);
        const isJammed = gameState.player.jammedNodes.some(b => b.index === idx);

        node.classList.toggle('selected', isTarget);
        node.classList.toggle('burned', isBurned);
        node.classList.toggle('jammed', isJammed);
        node.classList.toggle('blocked', isBurned || isJammed); // Keep 'blocked' for general styling if needed

        if (isTarget) {
            node.classList.toggle('yellow', isDefense);
        } else {
            node.classList.remove('yellow');
        }
    });

    // 1. Target Moveset & Fallback Logic
    const isPlayerPhase = gameState.currentTurn === 'PLAYER';
    const moveset = isPlayerPhase ? gameState.player.moves : gameState.player.defenseMoves;

    // Check if current selection is valid for THIS moveset
    let currentMove = moveset.find(m => m.id === gameState.player.selectedMove);

    // Auto-Fallback: If selection is invalid (wrong phase) or unaffordable
    const canAfford = currentMove && (currentMove.type !== 'pellicle' || gameState.player.pp >= currentMove.cost);

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

        const moveAffordable = move.type !== 'pellicle' || gameState.player.pp >= move.cost;
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
    const isPlayerTurn = gameState.currentTurn === 'PLAYER';
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
            if (detailCard) detailCard.src = imgSrc;
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

        const iconName = cell.id.charAt(0).toUpperCase() + cell.id.slice(1);
        item.innerHTML = `
            <div class="status-cell-icon">
                <img src="assets/images/${iconName}.png" alt="${cell.name}">
            </div>
            <div class="status-info">
                <div class="status-name">${cell.name.toUpperCase()} <span style="font-size: 0.7rem; color: var(--color-player); opacity: 0.8;">[LVL ${cell.level || 1}]</span></div>
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
    const selectedMove = AI.selectMove(gameState.enemy, isEnemyAttacking);
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

    // 7. Reset Turn
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

        // 7. Block Aging & New Triggers (v2.92)
        // Age existing blocks
        gameState.player.burnedNodes = gameState.player.burnedNodes.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0);
        gameState.player.jammedNodes = gameState.player.jammedNodes.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0);

        gameState.enemy.burnedNodes = gameState.enemy.burnedNodes.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0);
        gameState.enemy.jammedNodes = gameState.enemy.jammedNodes.map(b => ({ ...b, duration: b.duration - 1 })).filter(b => b.duration > 0);

        const newPlayerBurned = [];
        const newEnemyBurned = [];
        const newPlayerJammed = [];
        const newEnemyJammed = [];

        // ChoiceBlock Trigger (New duration: 2 phases)
        if (gameState.currentTurn === 'PLAYER') {
            const move = gameState.player.selectedMove ? gameState.player.moves.find(m => m.id === gameState.player.selectedMove) : null;
            if (move?.hasChoiceBlock) newPlayerBurned.push({ index: gameState.player.currentNode, duration: 1 });

            const eMove = gameState.enemy.defenseMoves.find(m => m.id === results.defenderMoveId);
            if (eMove?.hasChoiceBlock) newEnemyBurned.push({ index: gameState.enemy.currentNode, duration: 1 });
        } else {
            const move = gameState.enemy.selectedMove ? gameState.enemy.moves.find(m => m.id === gameState.enemy.selectedMove) : null;
            if (move?.hasChoiceBlock) newEnemyBurned.push({ index: gameState.enemy.currentNode, duration: 1 });

            const pMove = gameState.player.defenseMoves.find(m => m.id === results.defenderMoveId);
            if (pMove?.hasChoiceBlock) newPlayerBurned.push({ index: gameState.player.currentNode, duration: 1 });
        }

        // HurtBlock Trigger (Specific Snare logic - New duration: 2 phases)
        const isPlayerAttacker = results.attacker === 'PLAYER';
        const defenderMoveset = isPlayerAttacker ? gameState.enemy.defenseMoves : gameState.player.defenseMoves;
        const dSkill = defenderMoveset.find(m => m.id === results.defenderMoveId);

        if (dSkill?.hasHurtBlock) {
            // Snare triggered -> BOTH nodes are disabled for BOTH players
            newPlayerJammed.push({ index: gameState.player.currentNode, duration: 1 });
            newPlayerJammed.push({ index: gameState.enemy.currentNode, duration: 1 });
            newEnemyJammed.push({ index: gameState.player.currentNode, duration: 1 });
            newEnemyJammed.push({ index: gameState.enemy.currentNode, duration: 1 });
        }

        // Merge new into existing (avoiding duplicates on same node)
        newPlayerBurned.forEach(nb => {
            if (!gameState.player.burnedNodes.some(eb => eb.index === nb.index)) gameState.player.burnedNodes.push(nb);
        });
        newPlayerJammed.forEach(nb => {
            if (!gameState.player.jammedNodes.some(eb => eb.index === nb.index)) gameState.player.jammedNodes.push(nb);
        });
        newEnemyBurned.forEach(nb => {
            if (!gameState.enemy.burnedNodes.some(eb => eb.index === nb.index)) gameState.enemy.burnedNodes.push(nb);
        });
        newEnemyJammed.forEach(nb => {
            if (!gameState.enemy.jammedNodes.some(eb => eb.index === nb.index)) gameState.enemy.jammedNodes.push(nb);
        });

        // Update flattened blockedNodes for AI / UI Interaction
        gameState.player.blockedNodes = [...new Set([
            ...gameState.player.burnedNodes.map(b => b.index),
            ...gameState.player.jammedNodes.map(b => b.index)
        ])];

        gameState.enemy.blockedNodes = [...new Set([
            ...gameState.enemy.burnedNodes.map(b => b.index),
            ...gameState.enemy.jammedNodes.map(b => b.index)
        ])];

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
    // Removed translate reset as jump is disabled
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
            updateBattleCard(targetMonster.name);
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
        gameState.phase = 'NODE_SELECTION';
        gameState.currentTurn = (gameState.currentTurn === 'PLAYER') ? 'ENEMY' : 'PLAYER';
        resetSelectorCore(true);
        gameState.isProcessing = false;
        updateUI();
    };

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
                    updateBattleCard(nextMonster.name);
                    finalizeTurnSequence();
                });
            } else {
                showGameOver(true); // Defeat
                gameState.isProcessing = false;
            }
        });
        return true;
    }

    return true;
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
    // 1. Initialize Parties
    const initializeMonster = (id) => {
        const data = JSON.parse(JSON.stringify(MONSTERS[id]));
        return {
            ...data,
            currentNode: null,
            blockedNodes: [],
            burnedNodes: [],
            jammedNodes: [],
            hp: data.hp,
            pp: 1,
            selectedMove: data.moves[0].id
        };
    };

    gameState.playerParty = gameState.playerTeam
        .filter(id => id !== null)
        .map(id => initializeMonster(id));

    // Enemy Party (Giving enemy 3 monsters as well for balanced 3v3)
    gameState.enemyParty = [
        initializeMonster('nitrophil'),
        initializeMonster('cambihil'),
        initializeMonster('lydrosome')
    ];

    // Set Active Combatants
    gameState.player = gameState.playerParty[0];
    gameState.enemy = gameState.enemyParty[0];

    // Determine Starting Turn based on Speed
    const playerSpd = gameState.player.spd || 10;
    const enemySpd = gameState.enemy.spd || 10;

    if (playerSpd >= enemySpd) {
        gameState.currentTurn = 'PLAYER';
        addLog(`${gameState.player.name} is faster! Initializing initiative...`);
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
        updateBattleCard(gameState.player.name);
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
    }, 800); // Matches container-capture duration
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

init();

