import { gameState } from './engine/state.js';
import { resolveTurn, getDistance, checkOverload } from './engine/combat.js';
import { AI } from './engine/ai.js';

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
const RADIUS = 175; // Must match scaled --pentagon-radius (proportional to 415px container)

// Battle Log State
let battleLogHistory = [];

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

    document.getElementById('btn-battle-back')?.addEventListener('click', () => showScreen('screen-main-menu'));
    document.getElementById('btn-open-rulebook')?.addEventListener('click', () => showScreen('screen-rulebook'));
    document.getElementById('btn-rulebook-back')?.addEventListener('click', () => showScreen('screen-main-menu'));

    // Global ESC Key Listener for Rulebook
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const rulebookScreen = document.getElementById('screen-rulebook');
            if (rulebookScreen && !rulebookScreen.classList.contains('hidden')) {
                showScreen('screen-main-menu');
            }
        }
    });

    // Start Screen
    addLog("Experimental Lab Environment Online.");
    addLog("Pathogen Detected: NITROPHIL.");
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
            infoDesc.innerText = move.desc || "No tactical data available.";
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
        let formattedMsg = msg.replace(/\[(.*?)\]/g, '<span class="tactical">[$1]</span>');
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

    interactiveNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const nx = rect.left + rect.width / 2;
        const ny = rect.top + rect.height / 2;
        const d = Math.hypot(clientX - nx, clientY - ny);

        if (d < minDist) {
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
    interactiveNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const nx = rect.left + rect.width / 2;
        const ny = rect.top + rect.height / 2;
        const d = Math.hypot(clientX - nx, clientY - ny);

        if (d < 40) {
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
    setStyle('.player-display .hp-fill', 'width', `${(gameState.player.hp / gameState.player.maxHp) * 100}%`);
    setStyle('.player-display .pp-fill', 'width', `${(gameState.player.pp / gameState.player.maxPp) * 100}%`);
    document.querySelector('.player-display .pp-fill')?.classList.toggle('overload', gameState.player.pp >= 10);
    setSafe('#player-hp-val', 'innerText', `${gameState.player.hp} / ${gameState.player.maxHp}`);
    setSafe('#player-pp-val', 'innerText', `${gameState.player.pp} / ${gameState.player.maxPp}`);

    setStyle('.enemy-display .hp-fill', 'width', `${(gameState.enemy.hp / gameState.enemy.maxHp) * 100}%`);
    setStyle('.enemy-display .pp-fill', 'width', `${(gameState.enemy.pp / gameState.enemy.maxPp) * 100}%`);
    document.querySelector('.enemy-display .pp-fill')?.classList.toggle('overload', gameState.enemy.pp >= 10);
    setSafe('#enemy-hp-val', 'innerText', `${gameState.enemy.hp} / ${gameState.enemy.maxHp}`);
    setSafe('#enemy-pp-val', 'innerText', `${gameState.enemy.pp} / ${gameState.enemy.maxPp}`);

    // Update Interactive Pentagon Visuals
    const showSelection = gameState.phase === 'MOVE_SELECTION' || gameState.phase === 'NODE_SELECTION';
    const isDefense = gameState.currentTurn === 'ENEMY';

    interactiveNodes.forEach((node, idx) => {
        const isTarget = showSelection && gameState.player.currentNode === idx;
        node.classList.toggle('selected', isTarget);
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

        // Update stats row text (Formatted: POW {x} - {Type} Skill - {cost} PP)
        const statsRow = btn.querySelector('.move-stats-row');
        if (statsRow) {
            const typeLabel = move.type.charAt(0).toUpperCase() + move.type.slice(1);
            const powPart = move.power !== undefined ? `POW ${move.power} - ` : '';
            const costText = move.cost > 0 ? ` - ${move.cost} PP` : '';
            statsRow.innerText = `${powPart}${typeLabel} Skill${costText}`;
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
const setStyle = (selector, prop, val) => {
    const el = document.querySelector(selector);
    if (el) el.style[prop] = val;
};

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

    // Logging
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

    if (dMove && dMove.id !== 'quick_dodge') {
        addLog(`${defenderName} used ${dMove.name}`);
    }

    if (move.id === 'nitric_burst') {
        addLog("activate [EASY TARGET]");
    }
    if (dMove && (dMove.id === 'thermo_shell' || dMove.id === 'magma_chitin')) {
        addLog("activate [REACTIVE ARMOR]");
    }

    // Animation Selection
    const isPellicle = results.moveType === 'pellicle';
    const playerContainer = document.querySelector('.player-display .monster-portrait-container');
    const enemyContainer = document.querySelector('.enemy-display .monster-portrait-container');

    const lungeClass = isPellicle
        ? (results.attacker === 'PLAYER' ? 'anim-heavy-lunge-player' : 'anim-heavy-lunge-enemy')
        : (results.attacker === 'PLAYER' ? 'anim-lunge-player' : 'anim-lunge-enemy');

    if (results.attacker === 'PLAYER') {
        playerContainer.classList.add(lungeClass);
        if (isPellicle) playerContainer.classList.add('pellicle-aura');
        if (results.hitResult.damage > 0) {
            setTimeout(() => {
                enemyContainer.classList.add('anim-hit-shake');
                spawnDamageNumber(enemyContainer, results.hitResult.damage, results.hitResult.isCrit);
                if (results.hitResult.isCrit) {
                    document.getElementById('game-container').classList.add('anim-screen-shake');
                    setTimeout(() => document.getElementById('game-container').classList.remove('anim-screen-shake'), 400);
                }
            }, 150);
        }
    } else {
        enemyContainer.classList.add(lungeClass);
        if (isPellicle) enemyContainer.classList.add('pellicle-aura');
        if (results.hitResult.damage > 0) {
            setTimeout(() => {
                playerContainer.classList.add('anim-hit-shake');
                spawnDamageNumber(playerContainer, results.hitResult.damage, results.hitResult.isCrit);
                if (results.hitResult.isCrit) {
                    document.getElementById('game-container').classList.add('anim-screen-shake');
                    setTimeout(() => document.getElementById('game-container').classList.remove('anim-screen-shake'), 400);
                }
            }, 150);
        }
    }

    // 5. VFX Feedback
    applyMatchVFX(results.actualDist, results.effectiveDist, ghost);

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
            reflectEl.style.color = 'var(--neon-yellow)';
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

        if (checkGameOver()) {
            gameState.isProcessing = false;
            return;
        }

        gameState.phase = 'MOVE_SELECTION';
        gameState.currentTurn = gameState.currentTurn === 'PLAYER' ? 'ENEMY' : 'PLAYER';

        // Set Default Move for next turn (Auto-fallback/Initialization)
        const nextMoveset = (gameState.currentTurn === 'PLAYER') ? gameState.player.moves : gameState.player.defenseMoves;
        gameState.player.selectedMove = nextMoveset[0].id; // Default to basic on phase swap

        // Overload Recall Damage (At start of next turn)
        const nextAttacker = gameState.currentTurn === 'PLAYER' ? gameState.player : gameState.enemy;
        const recoil = checkOverload(nextAttacker);
        if (recoil > 0) {
            nextAttacker.hp = Math.max(0, nextAttacker.hp - recoil);
            const container = gameState.currentTurn === 'PLAYER'
                ? document.querySelector('.player-display .monster-portrait-container')
                : document.querySelector('.enemy-display .monster-portrait-container');
            spawnDamageNumber(container, recoil);
            container.classList.add('anim-hit-shake');
            setTimeout(() => container.classList.remove('anim-hit-shake'), 400);
            nextAttacker.pp = 0; // Discharge after overload
        }

        gameState.player.currentNode = null;
        gameState.enemy.currentNode = null;

        // Reset selection core to center AFTER resolution
        selectionCore.style.transition = 'all 0.4s ease-in-out';
        selectionCore.style.transform = `translate(-50%, -50%)`;

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
        resultColor = 'var(--neon-red)';
        shakeClass = 'shake-heavy';
        if (ghost) ghost.classList.add('match');
    } else if (effectiveDist === 1) {
        vfxClass = 'flash-yellow';
        resultText = isDefense ? 'CLOSE' : 'NEAR';
        resultColor = 'var(--neon-yellow)';
        shakeClass = 'shake-medium';
        if (ghost) ghost.classList.add('near');
    } else {
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

function clearVFX() {
    interactiveNodes.forEach(node => {
        node.classList.remove('flash-red', 'flash-yellow', 'flash-white', 'highlight');
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

function spawnDamageNumber(targetEl, amount, isCrit = false) {
    const dmgEl = document.createElement('div');
    dmgEl.className = `damage-number ${isCrit ? 'critical' : ''}`;
    dmgEl.innerText = `-${amount}`;
    targetEl.appendChild(dmgEl);
    setTimeout(() => dmgEl.remove(), 1200);
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

function checkGameOver() {
    if (gameState.player.hp <= 0 || gameState.enemy.hp <= 0) {
        const isPlayerDefeat = gameState.player.hp <= 0;
        const loserDisplay = document.querySelector(isPlayerDefeat ? '.player-display' : '.enemy-display');
        const loserPortrait = loserDisplay.querySelector('.monster-portrait');

        // 1. Cinematic Transition: Fade out the loser
        loserPortrait.classList.add('death-fade');

        // 2. Heavy Drop Animation
        setTimeout(() => {
            const container = document.createElement('div');
            container.className = 'dead-cell-container animate-heavy-drop';
            container.innerHTML = `<img src="assets/images/CellContainer.png">`;
            loserDisplay.appendChild(container);
        }, 300);

        // 3. Show Mission Overlay after animation peak
        setTimeout(() => {
            const overlay = document.getElementById('game-over-overlay');
            const title = document.getElementById('game-over-title');
            const msg = document.getElementById('game-over-message');

            if (isPlayerDefeat) {
                title.innerHTML = `SYSTEM <span class="neon-text">FAILURE</span>`;
                msg.innerText = `${gameState.player.name} has been neutralized.`;
            } else {
                title.innerHTML = `MISSION <span class="neon-text">SUCCESS</span>`;
                msg.innerText = `Target entity has been purged.`;
            }

            overlay.classList.remove('hidden');
        }, 1800);

        return true;
    }
    return false;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function resetGame() {
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.pp = 1;
    gameState.player.currentNode = null;
    gameState.enemy.hp = gameState.enemy.maxHp;
    gameState.enemy.pp = 1;
    gameState.enemy.currentNode = null;
    gameState.currentTurn = 'PLAYER';
    gameState.phase = 'NODE_SELECTION';

    // Clear death visuals
    document.querySelectorAll('.dead-cell-container').forEach(c => c.remove());
    document.querySelectorAll('.monster-portrait').forEach(p => p.classList.remove('death-fade'));

    // Reset selection core to center
    if (selectionCore) {
        selectionCore.style.transition = 'none';
        selectionCore.style.transform = 'translate(-50%, -50%)';
    }

    // Clear all node highlights/selections
    interactiveNodes.forEach(n => n.classList.remove('selected', 'highlight'));

    // Reset battle log
    battleLogHistory = [];
    const logContainer = document.getElementById('battle-log');
    if (logContainer) logContainer.innerHTML = '';
    addLog("MISSION START: Purge initialized.");

    updateUI();
}

init();

