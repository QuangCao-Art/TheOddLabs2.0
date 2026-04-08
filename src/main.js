import { gameState, applySkipTutorial, applyFullCellDebug, SKIP_TUTORIAL, FULL_CELL_DEBUG, saveGameState, loadGameState, resetGameState } from './engine/state.js';
import { resolveTurn, getDistance, checkOverload, getModifiedStats } from './engine/combat.js';
import { AI } from './engine/ai.js';
import { MONSTERS } from './data/monsters.js';
import { Overworld } from './engine/overworld.js';
import { CARDS, LEVEL_REWARDS, NPC_PRESETS, NPC_ENCOUNTERS } from './data/cards.js';
import { SHOP_ITEMS, shopState } from './data/shop.js';
import { SYNTHESIS_RECIPES } from './data/synthesis.js';
import { QUESTS, MAIN_QUEST_LOGS } from './data/quests.js';
import { BioExtract } from './ui/bio_extract.js';
import { BuilderMode } from './engine/builder.js';
import { FURNITURE_TEMPLATES } from './data/furniture.js';
import { AudioManager } from './engine/audio.js';

// Initialize UI Modules
if (BioExtract) BioExtract.init();

// Expose modules globally for cross-communication
window.gameState = gameState;
window.Overworld = Overworld;
window.BioExtract = BioExtract;
window.BuilderMode = BuilderMode;
window.FURNITURE_TEMPLATES = FURNITURE_TEMPLATES;

// DOM References
const interactivePentagon = document.getElementById('interactive-pentagon');
const selectionCore = document.getElementById('selection-core');
const interactiveNodes = document.querySelectorAll('#interactive-pentagon .node');
const playerPortrait = document.querySelector('.player-display .monster-portrait');
const enemyPortrait = document.querySelector('.enemy-display .monster-portrait');
const playerVitals = document.querySelector('.player-display .character-vitals');
const enemyVitals = document.querySelector('.enemy-display .character-vitals');
const moveButtons = document.querySelectorAll('.move-btn');

// --- DEBUG WEALTH ---
document.getElementById('btn-debug-rich')?.addEventListener('click', () => {
    gameState.credits += 5000;
    gameState.biomass += 500;
    if (window.updateResourceHUD) window.updateResourceHUD();
    else if (typeof updateResourceHUD === 'function') updateResourceHUD();

    // Update active menus if open
    const shopBM = document.getElementById('shop-bm-balance');
    if (shopBM) shopBM.textContent = gameState.biomass;
    const shopLC = document.getElementById('shop-lc-balance');
    if (shopLC) shopLC.textContent = gameState.credits;

    const synthBM = document.getElementById('synthesis-bm-balance');
    if (synthBM) synthBM.textContent = gameState.biomass;

    // If a synthesis item is selected, refresh its requirements display
    if (window.selectSynthesisItem && window.selectedSynthesisMonster) {
        window.selectSynthesisItem(window.selectedSynthesisMonster);
    }

    console.log("DEBUG: Resources injected. Credits:", gameState.credits, "Biomass:", gameState.biomass);
});

// Dragging State
let isDragging = false;

// --- AUDIO AUTO-BOOT ---
// Browsers block audio until the first user interaction.
const bootAudio = () => {
    AudioManager.init();
    // If we are already on a screen that needs music, trigger it again now that ctx exists
    const currentScreen = Array.from(document.querySelectorAll('.screen')).find(s => !s.classList.contains('hidden'));
    if (currentScreen) showScreen(currentScreen.id);
    
    // Sync with persistent settings
    syncAudioEngineWithSettings();
    
    window.removeEventListener('click', bootAudio);
    window.removeEventListener('keydown', bootAudio);
};
window.addEventListener('click', bootAudio);
window.addEventListener('keydown', bootAudio);
let startX, startY;
const pentagonRect = interactivePentagon?.getBoundingClientRect();

// Constants for positioning
const RADIUS = 130; // Calibrated for pixel-perfect alignment with background asset

let shopInputReady = true;
let synthInputReady = true;
let incubatorInputReady = true;
let inventoryInputReady = true;
let bioExtractInputReady = true;

window.setBioExtractInputReady = (val) => { bioExtractInputReady = val; };

function resetSelectorCore(instant = false) {
    if (!selectionCore) return;
    selectionCore.style.transition = instant ? 'none' : 'all 0.4s ease-in-out';
    selectionCore.style.transform = `translate(-50%, -50%)`;
}

function triggerRandomPlayerNodeSelection() {
    if (gameState.isProcessing) return;
    // Don't set isProcessing here, let resolvePhase handle the lock

    // Pick a random node that ISN'T in the blocked list
    const available = [0, 1, 2, 3, 4].filter(n => !gameState.player.blockedNodes.some(b => b.index === n));
    if (available.length > 0) {
        const targetIndex = available[Math.floor(Math.random() * available.length)];
        gameState.player.currentNode = targetIndex;

        // Visual Feedback (Snap core to node + Highlight)
        const angleDeg = targetIndex * 72;
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * RADIUS;
        const y = Math.sin(angleRad) * RADIUS;

        // Briefly highlight the node
        interactiveNodes.forEach((node, idx) => {
            node.classList.toggle('highlight', idx === targetIndex);
        });

        selectionCore.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        selectionCore.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

        // Small delay for visual impact before resolution
        setTimeout(() => {
            interactiveNodes[targetIndex]?.classList.remove('highlight');
            resolvePhase();
        }, 300);
    }
}

// Battle Log State
let battleLogHistory = [];
let previousScreen = 'screen-main-menu';

// Inventory Navigation State
const INVENTORY_TABS = ['quests', 'logs', 'items', 'cards', 'status', 'catalyst'];

/**
 * UI State: Inventory Navigation state
 */
const invNav = {
    active: false,
    tabIndex: 0, // Maps to INVENTORY_TABS
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

/* --- CUSTOM PRESET SYSTEM --- */
let CUSTOM_PRESETS = {};

function loadCustomPresets() {
    try {
        const stored = localStorage.getItem('oddlabs_custom_presets');
        if (stored) {
            CUSTOM_PRESETS = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load custom presets", e);
        CUSTOM_PRESETS = {};
    }
}

function saveCustomPresetsToDisk() {
    try {
        localStorage.setItem('oddlabs_custom_presets', JSON.stringify(CUSTOM_PRESETS));
    } catch (e) {
        console.warn('Unable to save custom presets to disk. They will be kept in-memory for this session.', e);
    }
}

function handleSavePreset() {
    const profile = gameState.profiles[catalystState.activeProfile];
    if (!profile) return;

    const modal = document.getElementById('preset-name-modal');
    const input = document.getElementById('preset-name-input');
    const btnConfirm = document.getElementById('btn-preset-confirm');
    const btnCancel = document.getElementById('btn-preset-cancel');
    const title = document.getElementById('preset-modal-title');
    const promptText = document.getElementById('preset-modal-prompt');

    if (!modal || !input || !btnConfirm || !btnCancel) return;

    title.innerText = "SAVE PRESET";
    promptText.innerText = "Enter a name for this Custom Preset:";
    input.value = "My Custom Build";
    modal.classList.remove('hidden');
    input.focus();
    input.select();

    const cleanup = () => {
        modal.classList.add('hidden');
        btnConfirm.onclick = null;
        btnCancel.onclick = null;
        input.onkeydown = null;
    };

    const confirmSave = () => {
        let presetName = input.value.trim().substring(0, 30);
        if (presetName.length === 0) return;
        cleanup();

        // Serialize
        const newPreset = {
            name: presetName,
            description: "Custom user-created loadout.",
            owner: 'player',
            team: [...profile.team],
            level: profile.level,
            squadSlots: {}
        };

        profile.party.forEach((mon, mIdx) => {
            newPreset.squadSlots[mIdx] = {};
            if (mon) {
                mon.equippedCards.forEach(card => {
                    if (card) {
                        newPreset.squadSlots[mIdx][card.slotIndex] = card.cardId;
                    }
                });
            }
        });

        // FIXED: Create unique key based on timestamp to prevent overwriting renamed presets
        const key = `custom_${Date.now()}`;
        CUSTOM_PRESETS[key] = newPreset;
        saveCustomPresetsToDisk();

        // Refresh UI
        const monster = profile.party[catalystState.activeMonsterIdx];
        if (monster) monster.currentPresetId = key;
        updateCatalystCore();
    };

    btnConfirm.onclick = confirmSave;
    btnCancel.onclick = cleanup;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') confirmSave();
        if (e.key === 'Escape') cleanup();
    };
}

function handleRenamePreset() {
    const selector = document.getElementById('preset-selector');
    const key = selector.value;
    if (!key || !CUSTOM_PRESETS[key]) return;

    const modal = document.getElementById('preset-name-modal');
    const input = document.getElementById('preset-name-input');
    const btnConfirm = document.getElementById('btn-preset-confirm');
    const btnCancel = document.getElementById('btn-preset-cancel');
    const title = document.getElementById('preset-modal-title');
    const promptText = document.getElementById('preset-modal-prompt');

    if (!modal || !input || !btnConfirm || !btnCancel) return;

    title.innerText = "RENAME PRESET";
    promptText.innerText = "Enter a new name:";
    input.value = CUSTOM_PRESETS[key].name;
    modal.classList.remove('hidden');
    input.focus();
    input.select();

    const cleanup = () => {
        modal.classList.add('hidden');
        btnConfirm.onclick = null;
        btnCancel.onclick = null;
        input.onkeydown = null;
    };

    const confirmRename = () => {
        let newName = input.value.trim().substring(0, 30);
        if (newName.length === 0) return;
        cleanup();

        // We can just rename the display name, keep the same key for simplicity
        CUSTOM_PRESETS[key].name = newName;
        saveCustomPresetsToDisk();
        updateCatalystCore();
    };

    btnConfirm.onclick = confirmRename;
    btnCancel.onclick = cleanup;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') confirmRename();
        if (e.key === 'Escape') cleanup();
    };
}

function handleDeletePreset() {
    const selector = document.getElementById('preset-selector');
    const key = selector.value;
    if (!key || !CUSTOM_PRESETS[key]) return;

    if (confirm(`Are you sure you want to delete the custom preset "${CUSTOM_PRESETS[key].name}"?`)) {
        delete CUSTOM_PRESETS[key];
        saveCustomPresetsToDisk();

        // Reset the current active to nothing
        const profile = gameState.profiles[catalystState.activeProfile];
        if (profile && profile.party[catalystState.activeMonsterIdx]) {
            profile.party[catalystState.activeMonsterIdx].currentPresetId = "";
        }
        updateCatalystCore();
    }
}

const updateInvNav = (isKeyboardAction = false) => {
    const currentTabId = INVENTORY_TABS[invNav.tabIndex];

    // 1. Update Tab Visuals
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === invNav.tabIndex);
    });

    // 2. Show correct tab content
    document.querySelectorAll('.inventory-tab').forEach(t => t.classList.add('hidden'));
    const activeTab = document.getElementById(`tab-${currentTabId}`);
    if (activeTab) activeTab.classList.remove('hidden');

    // Toggle Inventory Layout visibility depending on tab
    const invLayout = document.getElementById('inventory-layout');
    if (invLayout) {
        if (currentTabId === 'catalyst') {
            invLayout.style.display = 'none'; // Use display none to hide flex/grid
            catalystState.activeProfile = 'player';
            renderManagementHub();
        } else if (currentTabId === 'status' || currentTabId === 'logs' || currentTabId === 'quests' || currentTabId === 'items' || currentTabId === 'cards') {
            renderInventory();
            invLayout.style.display = '';
        } else {
            invLayout.style.display = ''; // Revert to stylesheet default
        }
    }

    // 3. Highlight selected item
    if (!activeTab || currentTabId === 'catalyst') return; // Skip item highlight logic for catalyst tab
    const items = activeTab.querySelectorAll('.log-item, .key-item-slot, .status-item, .quest-item');
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

window.DATA_LOGS = [
    { id: 'Log001', tag: 'HISTORY', title: 'Mission Statement', text: "The Odd Labs was founded on a singular, borderline obsessive belief: the microscopic world holds the ultimate cure for the macro-world's failures. By engineering life at the cellular level, we aren't just creating tools; we're designing the future of biological harmony. Healing the earth starts with a single, perfectly optimized cell. Or at least, that's what the brochure says. Reality involves a lot more paperwork and weird smells." },
    { id: 'Log002', tag: 'FLUFF', title: 'The Coffee Incident', text: "Urgent Notice: Will whoever left a half-empty mug of 'Triple-Roast' in Incubator 3 please come forward? The resulting fuzzy purple mold has progressed beyond 'biological curiosity' and is now actively hoarding office supplies. It isn't sentient yet, but it did try to swallow my favorite fountain pen when I tried to clean the tray. If it starts asking for sugar, we're calling Security." },
    { id: 'Log003', tag: 'INFO', title: 'Security Protocols', text: "Updated Security Protocol: All entrance gates now require a valid Bio-Signature match for entry. If your Cell pairing isn't synchronized, the gates will remain locked, and you will be forced to wait in the lobby where Jenzi will 'verbally audit' your lack of preparation until you either cry or quit. This has proven 41% more effective than standard fines. - Management." },
    { id: 'Log004', tag: 'TEASE', title: 'Missing Footage', text: "Maintenance Log 27-A: During the '27 Incident, the security cameras mysteriously cut out for exactly 3 minutes. Director Capsain claims it was just 'radio interference' from his lab equipment. However, the repair crew found that the camera cables had been manually unplugged. It looks like someone definitely didn't want a witness to whatever happened." },
    { id: 'Log005', tag: 'FUN', title: 'Noodle Tuesday', text: "Internal Memo: Noodle Tuesday has officially surpassed 'Tactical Thursday' as the highest energy-consumption day in the lab, mostly due to the sheer number of hot water dispensers running at max capacity. Director Capsain was spotted by the janitor carrying a suspiciously large carton containing 13 packs of 'Inferno' brand instant noodles. He claimed it was for 'caloric stress-testing'. Nobody believed him." },
    { id: 'Log006', tag: 'INFO', title: 'Botanic Breakthrough', text: "Lab Report: After seventy-three failed trials, Lana has finally successfully integrated active chlorophyll into a synthetic fibroblast structure. The resulting specimen, codenamed 'Cambihil,' is remarkably stable and seems to enjoy basking in the UV lamps. It’s the first true hybrid of plant resilience and multi-cellular intelligence. Lana didn't smile, but she did stop drinking her fifth cup of coffee for a moment. Progress." },
    { id: 'Log007', tag: 'TEASE', title: "Lana's Complaint", text: "Lana’s Private Log: The Director is spending an absurd amount of time in that side room. He brings a bowl of noodles in there every day at 1 PM, thinking he's being subtle. I know exactly what he’s 'cultivating' in there, and the constant secrecy is just unprofessional. Seventy-one hours of my team's time, wasted on his little secret." },
    { id: 'Log008', tag: 'FUN', title: 'Photosynthesis Party', text: "Observation Log: We discovered something peculiar today. Cambihils show a 15.3% increase in photosynthetic efficiency when exposed to high-tempo techno music. They seem to vibrate in time with the bass. Lana absolutely hates the noise and claims it's 'acoustical nonsense,' but the data doesn't lie. I caught her tapping her foot yesterday. She claims it was a muscle spasm caused by inefficient lighting." },
    { id: 'Log009', tag: 'TEASE', title: 'The Spicy Aroma', text: "Incident Report: Lana filed a complaint about a 'pungent, almost violent peppery smell' leaking from the vents connected to the decommissioned Old Lab wing. She officially logged it as 'volatile botanical mutation fumes' and requested a full air-scrubbing sequence. The Director denied the request, stating it was merely 'experimental ozone' from the nearby power coupling. My eyes are still watering." },
    { id: 'Log010', tag: 'INFO', title: 'Private Key Log', text: "Security Update: Scientist Lana has updated the biometric lock on her private storage cabinet. The password hint is simply: 'The Day Biology Changed.' I looked it up—that’s the anniversary of the very first successful Cell cultivation. Why would she guard her personal research files with such a sentimental date? She's definitely hiding something more than just old clipboards. - Anon." },
    { id: 'Log011', tag: 'INFO', title: "Dyzes' Observations", text: "Research Log: Scientist Dyzes is leaning back in his chair, staring at the Lydrosome cultures again. He reports that the latest mutation shows a staggering 99.3% tissue compatibility with organic hosts. This isn't just a discovery; it's a bridge between species. If we can finalize the osmotic pressure variables, we’ll have a Cell that can navigate biological systems like a master surgeon. Dyzes just said, 'It’s like we’re all connected, man.'" },
    { id: 'Log012', tag: 'TEASE', title: 'Protein Analysis', text: "Unauthorized Analysis: I managed to get a glimpse of the 'mutation' from the Director's restricted samples under the high-res zoom. These aren't radiation burns or ionization scars, as the official report suggests. The molecular signature is clearly a complex protein-capsicum interaction. Wait... is that a microscopic chili seed embedded in the cell wall? If this gets out, Capsain is going to have more than just a headache." },
    { id: 'Log013', tag: 'FUN', title: 'The Chill Factor', text: "Behavioral Assessment: Observed the latest Nitrophil specimen today. For a Thermogenic Cell that literally houses a miniature combustion reaction, it is remarkably laid back. It spent three hours just drifting around its tank, occasionally glowing orange when it felt bored. We've officially dubbed it the 'Chill-y' cell. Dyzes thinks it's the 'vibes'." },
    { id: 'Log014', tag: 'TEASE', title: 'Point Zero', text: "Recovery Log: While cleaning out an old terminal, Dyzes recovered a corrupted data fragment referencing something called 'Point Zero'. According to the notes, it’s a location within the facility that isn't listed on any current blueprints or structural maps. Before we could cross-reference the coordinates, Director Capsain remotely accessed the terminal and deleted the remaining metadata. He looked remarkably pale during the staff meeting later." },
    { id: 'Log015', tag: 'INFO', title: 'Cellular Harmony', text: "Staff Observation: Dyzes has officially gone off the deep end. He firmly believes the Cells are attempting primitive communication through fluctuating osmotic pressure. He spent three full hours today talking to a Lydrosome about 'the nature of the soul.' The terrifying part? The Lydrosome actually waved back with a localized pressure jet. Dyzes didn't even look surprised. He just said, 'I know, buddy. I know.'" },
    { id: 'Log016', tag: 'FUN', title: 'Noodle Review (Draft)', text: "Draft File (Capsain27_FinalReview): 'Inferno Brand Chili Sauce - Limited Edition Batch. Rating: 5/5. The heat is exquisite, borderline biological. Potency is perfect for late-night research sessions.'" },
    { id: 'Log017', tag: 'TEASE', title: "Official '27 Report", text: "The 2027 Executive Summary: Official Cause of the Leak: A containment failure in the Cell-Accelerator's primary reactor, located within the Main Atrium. Note from the Ground Crew (Redacted): 'We entered the Atrium and were hit by a thick, overwhelming spicy aroma that made our eyes water through the gas masks. Management insisted it was merely the smell of oxidized metal and ozone interaction.' The logic is as thin as the Director's patience." },
    { id: 'Log018', tag: 'FLUFF', title: 'Logistics Update', text: "Logistics Requisition: Monthly order for the Executive Floor has been updated. Item: 'Inferno' Noodle Boxes (31 Cases). Reason: 'Caloric density optimization for late-night research.' Priority: Urgent. The Director has been heard grumbling about the cafeteria's 'lack of kick' while waiting for this shipment. Someone should tell him that consuming this much spice during a single work cycle isn't recommended for biological health." },
    { id: 'Log019', tag: 'TEASE', title: "Director's Secret Folder", text: "SYSTEM ALERT: Access Denied to restricted sub-directory. Folder Name: [Petri Dish #0 - My Little Accident]. Password Hint: 'The ingredient that makes life better.' I tried 'Science,' 'Knowledge,' and 'Efficiency.' All failed. I have a hunch that if I tried 'Extra Spicy Sauce' or 'Chili,' I might get in. What is Capsain hiding in there? It sounds less like a failure and more like a confession." },
    { id: 'Log020', tag: 'CLIMAX', title: "The Director's Private Note", text: "Private Encryption (Director Only): Origin is now 15.3cm in diameter. Its orange glow has become so bright it's visible through the lead-lined containment. It’s remarkably hyperactive whenever it detects capsaicin in the air. If the board ever discovers that the crowning achievement of this lab—the very first sentient cell—was born from a clumsy noodle accident and a splash of chili sauce, my career is over. I'm ruined. But... he's so chill." },
    { id: 'Log999', tag: 'SECRET', title: 'The Burden of Pride', text: "Personal Note 999: I spent an hour alone in the Old Lab today, just talking to Origin. I have to put on this mask of arrogance, shouting about 'monstrous anomalies' and 'biological failures' just so the board doesn't look too closely at the '27 logs. But here, in the dust and silence... I wish I could just be the scientist who made a beautiful mistake. I'm so sorry I have to keep you hidden, little buddy. One day, hopefully, the world will be ready for the truth.", secret: true }
];

// --- ITEM PICKUP MODAL ---
window.ITEM_PICKUP_DATA = {
    'Log001': { name: 'DATAPAD', desc: 'Log #001: Mission Statement.', spriteClass: 'f49', type: 'log' },
    'Log002': { name: 'DATAPAD', desc: 'Log #002: The Coffee Incident.', spriteClass: 'f49', type: 'log' },
    'Log003': { name: 'DATAPAD', desc: 'Log #003: Security Protocols.', spriteClass: 'f49', type: 'log' },
    'Log004': { name: 'DATAPAD', desc: 'Log #004: Missing Footage.', spriteClass: 'f49', type: 'log' },
    'Log005': { name: 'DATAPAD', desc: 'Log #005: Noodle Tuesday.', spriteClass: 'f49', type: 'log' },
    'Log006': { name: 'DATAPAD', desc: 'Log #006: Botanic Breakthrough.', spriteClass: 'f49', type: 'log' },
    'Log007': { name: 'DATAPAD', desc: 'Log #007: Lana\'s Complaint.', spriteClass: 'f49', type: 'log' },
    'Log008': { name: 'DATAPAD', desc: 'Log #008: Photosynthesis Party.', spriteClass: 'f49', type: 'log' },
    'Log009': { name: 'DATAPAD', desc: 'Log #009: The Spicy Aroma.', spriteClass: 'f49', type: 'log' },
    'Log010': { name: 'DATAPAD', desc: 'Log #010: Private Key Log.', spriteClass: 'f49', type: 'log' },
    'Log011': { name: 'DATAPAD', desc: 'Log #011: Dyzes\' Observations.', spriteClass: 'f49', type: 'log' },
    'Log012': { name: 'DATAPAD', desc: 'Log #012: Protein Analysis.', spriteClass: 'f49', type: 'log' },
    'Log013': { name: 'DATAPAD', desc: 'Log #013: The Chill Factor.', spriteClass: 'f49', type: 'log' },
    'Log014': { name: 'DATAPAD', desc: 'Log #014: Point Zero.', spriteClass: 'f49', type: 'log' },
    'Log015': { name: 'DATAPAD', desc: 'Log #015: Cellular Harmony.', spriteClass: 'f49', type: 'log' },
    'Log016': { name: 'DATAPAD', desc: 'Log #016: Noodle Review (Draft).', spriteClass: 'f49', type: 'log' },
    'Log017': { name: 'DATAPAD', desc: 'Log #017: Official \'82 Report.', spriteClass: 'f49', type: 'log' },
    'Log018': { name: 'DATAPAD', desc: 'Log #018: Logistics Update.', spriteClass: 'f49', type: 'log' },
    'Log019': { name: 'DATAPAD', desc: 'Log #019: Director\'s Secret Folder.', spriteClass: 'f49', type: 'log' },
    'Log020': { name: 'DATAPAD', desc: 'Log #020: Director\'s Private Note.', spriteClass: 'f49', type: 'log' },
    'Log999': { name: 'DATAPAD', desc: 'Log #999: The Burden of Pride.', spriteClass: 'f49', type: 'log' },

    // Key Items
    'Quest01': { name: 'OLD KEY CARD', desc: 'An old but still function key card.', spriteClass: 'f50', type: 'item', previewImg: 'Card_Placeholder.png' },
    'Quest02': { name: 'INFERNO SAUCE', desc: 'A bottle of Inferno Brand super chili sauce.', spriteClass: 'f51', type: 'item', previewImg: 'Card_Placeholder.png' },
    'Quest03': { name: 'OLD DATA STICK', desc: 'Ancient people used this to store data!', spriteClass: 'f64', type: 'item', previewImg: 'Card_Placeholder.png' },
    "Quest04": { name: "Origin Nitrophil", icon: "nitrophil-sprite orange-hue", desc: "The ultimate proof. The first-ever mutated cell, hidden by Capsain.", type: "item", spriteClass: "nitrophil orange-hue" },
    'SSCARD01': { name: 'SS01', desc: 'A data card with super rare custom image on it.', spriteClass: 'f63', type: 'item', previewImg: 'Card_Placeholder.png' },
    'SSCARD02': { name: 'SS02', desc: 'A data card with super rare custom image on it.', spriteClass: 'f63', type: 'item', previewImg: 'Card_Placeholder.png' },
    'SSCARD03': { name: 'SS03', desc: 'A data card with super rare custom image on it.', spriteClass: 'f63', type: 'item', previewImg: 'Card_Placeholder.png' },
    'CARD00': { name: 'CELL CARD: STEMMY', desc: 'A collectible card features Stemmy, hand made by Jenzi.', spriteClass: 'f75', type: 'item', previewImg: 'Card_Stemmy.png' },
    'CARD01': { name: 'CELL CARD: CAMBIHIL', desc: 'A collectible card features Cambihil, hand made by Jenzi.', spriteClass: 'f75', type: 'item', previewImg: 'Card_Cambihil.png' },
    'CARD02': { name: 'CELL CARD: LYDROSOME', desc: 'A collectible card features Lydrosome, hand made by Jenzi.', spriteClass: 'f75', type: 'item', previewImg: 'Card_Lydrosome.png' },
    'CARD03': { name: 'CELL CARD: NITROPHIL', desc: 'A collectible card features Nitrophil, hand made by Jenzi.', spriteClass: 'f75', type: 'item', previewImg: 'Card_Nitrophil.png' },
    'Quest05': { name: 'OFFICIAL EMPLOYEE CARD', desc: 'You are now a truly member of the pack!', spriteClass: 'f90', type: 'item', previewImg: 'Card_Placeholder.png' },
    'blueprint_stemmy': { name: 'STEMMY BLUEPRINT', desc: 'A blueprint to create Stemmy.', spriteClass: 'f101', type: 'blueprint', previewImg: 'Card_Placeholder.png' },
    'blueprint_nitrophil': { name: 'NITROPHIL BLUEPRINT', desc: 'A blueprint to create Nitrophil.', spriteClass: 'f101', type: 'blueprint', previewImg: 'Card_Placeholder.png' },
    'blueprint_cambihil': { name: 'CAMBIHIL BLUEPRINT', desc: 'A blueprint to create Cambihil.', spriteClass: 'f101', type: 'blueprint', previewImg: 'Card_Placeholder.png' },
    'blueprint_lydrosome': { name: 'LYDROSOME BLUEPRINT', desc: 'A blueprint to create Lydrosome.', spriteClass: 'f101', type: 'blueprint', previewImg: 'Card_Placeholder.png' },
    // --- Unified Hidden Rewards ---
    'REWARD_BLUEPRINT_STEMMY': { name: 'STEMMY BLUEPRINT', desc: 'A blueprint to create Stemmy.', spriteClass: 'f101', type: 'blueprint' },
    'REWARD_BLUEPRINT_NITROPHIL': { name: 'NITROPHIL BLUEPRINT', desc: 'A blueprint to create Nitrophil.', spriteClass: 'f101', type: 'blueprint' },
    'REWARD_BLUEPRINT_CAMBIHIL': { name: 'CAMBIHIL BLUEPRINT', desc: 'A blueprint to create Cambihil.', spriteClass: 'f101', type: 'blueprint' },
    'REWARD_BLUEPRINT_LYDROSOME': { name: 'LYDROSOME BLUEPRINT', desc: 'A blueprint to create Lydrosome.', spriteClass: 'f101', type: 'blueprint' },
    'REWARD_CREDITS_50': { name: 'LAB CREDITS', desc: 'A small cache of 50 Lab Credits.', type: 'resource', resourceType: 'credits', amount: 50, spriteClass: 'f104' },
    'REWARD_CREDITS_10': { name: 'LAB CREDITS', desc: 'A tiny cache of 10 Lab Credits.', type: 'resource', resourceType: 'credits', amount: 10, spriteClass: 'f104' },
    'REWARD_CREDITS_100': { name: 'LAB CREDITS', desc: 'A secure cache of 100 Lab Credits.', type: 'resource', resourceType: 'credits', amount: 100, spriteClass: 'f104' },
    'REWARD_CREDITS_250': { name: 'LAB CREDITS', desc: 'An executive cache of 250 Lab Credits.', type: 'resource', resourceType: 'credits', amount: 250, spriteClass: 'f104' },
    'REWARD_BIOMASS_20': { name: 'BIOMASS', desc: 'A small container of 20 raw Biomass.', type: 'resource', resourceType: 'biomass', amount: 20, spriteClass: 'f102' },
    'REWARD_BIOMASS_50': { name: 'BIOMASS', desc: 'A bulk container of 50 raw Biomass.', type: 'resource', resourceType: 'biomass', amount: 50, spriteClass: 'f102' },
    'REWARD_BIOMASS_100': { name: 'BIOMASS', desc: 'A major container of 100 raw Biomass.', type: 'resource', resourceType: 'biomass', amount: 100, spriteClass: 'f102' },

    // Special Card Rewards
    'REWARD_CARD_STEMMY': { name: 'CELL CARD: STEMMY', desc: 'A collectible card features Stemmy.', spriteClass: 'f75', type: 'card' },
    'REWARD_CARD_CAMBIHIL': { name: 'CELL CARD: CAMBIHIL', desc: 'A collectible card features Cambihil.', spriteClass: 'f75', type: 'card' },
    'REWARD_CARD_LYDROSOME': { name: 'CELL CARD: LYDROSOME', desc: 'A collectible card features Lydrosome.', spriteClass: 'f75', type: 'card' },
    'REWARD_CARD_NITROPHIL': { name: 'CELL CARD: NITROPHIL', desc: 'A collectible card features Nitrophil.', spriteClass: 'f75', type: 'card' },
};

window.showItemPickupModal = (itemId, onClose) => {
    const modal = document.getElementById('item-pickup-modal');
    const data = ITEM_PICKUP_DATA[itemId] || { name: 'ITEM', desc: 'An unknown item.', spriteClass: 'data-pad', type: 'item' };

    const label = document.getElementById('pickup-label');
    if (label) {
        if (itemId === 'Quest04' || data.type === 'monster') label.textContent = 'CELL ACQUIRED';
        else if (data.type === 'log') label.textContent = 'DATALOG DISCOVERED';
        else if (data.type === 'resource') label.textContent = 'RESOURCE ACQUIRED';
        else if (data.type === 'card') label.textContent = 'C-CARD ACQUIRED';
        else if (data.type === 'blueprint') label.textContent = 'BLUEPRINT ACQUIRED';
        else label.textContent = 'ITEM ACQUIRED';
    }

    if (typeof Overworld !== 'undefined') Overworld.isPaused = true;

    document.getElementById('pickup-name').textContent = data.name;
    document.getElementById('pickup-desc').textContent = data.desc;

    // Swap sprite class
    const sprite = document.getElementById('pickup-sprite');
    if (itemId === 'Quest04' || data.type === 'monster') {
        sprite.className = `pickup-cell-sprite ${data.spriteClass}`;
    } else if (data.type === 'card') {
        // Collectible cards can use a specialized class or default to key-item-sprite
        sprite.className = `key-item-sprite ${data.spriteClass}`;
    } else {
        sprite.className = `key-item-sprite ${data.spriteClass}`;
    }

    modal.classList.remove('hidden');

    let inputReady = false;
    setTimeout(() => { inputReady = true; }, 600); // Increased buffer to prevent accidental skipping

    function close() {
        modal.classList.add('hidden');
        window.removeEventListener('keydown', keyHandler);
        if (typeof Overworld !== 'undefined') Overworld.isPaused = false;
        if (onClose) onClose();
    }

    function keyHandler(e) {
        if (!inputReady) return;
        if (e.key === 'f' || e.key === 'F' || e.key === 'Enter') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            close();
        }
    }

    document.getElementById('btn-pickup-continue').onclick = close;
    window.addEventListener('keydown', keyHandler);
};

/**
 * Custom Game-Themed Confirmation Modal
 * @param {string} title - Header text (e.g. WARNING)
 * @param {string} message - The question/body text
 * @param {function} onConfirm - Callback if "Yes" is clicked
 */
// --- PAUSE MENU LOGIC ---
let pauseInputReady = false;
let pauseNavIndex = 0;

window.togglePauseMenu = (show) => {
    const screen = document.getElementById('screen-pause');
    if (!screen) return;

    if (show) {
        screen.classList.remove('hidden');
        if (typeof Overworld !== 'undefined') Overworld.isPaused = true;
        pauseInputReady = false;
        pauseNavIndex = 0;
        updatePauseSelection();
        setTimeout(() => { pauseInputReady = true; }, 250);
    } else {
        screen.classList.add('hidden');
        if (typeof Overworld !== 'undefined') Overworld.isPaused = false;
    }
};

function updatePauseSelection() {
    const buttons = document.querySelectorAll('#screen-pause .btn-neon');
    buttons.forEach((btn, idx) => {
        btn.classList.toggle('nav-selected', idx === pauseNavIndex);
    });
}

function initPauseMenuEvents() {
    const buttons = document.querySelectorAll('#screen-pause .btn-neon');
    buttons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-pause-back') {
                window.togglePauseMenu(false);
            } else if (btn.id === 'btn-pause-settings') {
                window.togglePauseMenu(false);
                const skipCheck = document.getElementById('toggle-skip-tutorial');
                const debugCheck = document.getElementById('toggle-full-cell-debug');
                if (skipCheck) skipCheck.checked = SKIP_TUTORIAL;
                if (debugCheck) debugCheck.checked = FULL_CELL_DEBUG;
                updateAudioSettingsUI();
                showScreen('screen-settings');
            } else if (btn.id === 'btn-pause-main-menu') {
                window.handleAbortExperiment();
            }
        });

        btn.addEventListener('mouseenter', () => {
            pauseNavIndex = idx;
            updatePauseSelection();
        });
    });
}

window.showConfirmModal = (title, message, onConfirm, manualCleanup = false, hideCancel = false) => {
    const screen = document.getElementById('screen-confirm');
    const titleEl = document.getElementById('confirm-title');
    const subEl = document.getElementById('confirm-subtitle');
    const msgEl = document.getElementById('confirm-message');
    const btnYes = document.getElementById('btn-confirm-yes');
    const btnNo = document.getElementById('btn-confirm-no');

    if (!screen || !titleEl || !msgEl || !btnYes || !btnNo) return;

    // Reset button states from potential Alert/Lore overrides
    btnNo.style.display = '';
    btnYes.innerText = "PROCEED";
    btnNo.innerText = "CANCEL";

    // Initialize state
    let confirmNavIndex = hideCancel ? 0 : 1; 
    titleEl.innerText = (title || "WARNING").toUpperCase();
    msgEl.innerText = message || "Proceed with operation?";

    if (hideCancel) {
        btnNo.style.display = 'none';
    }

    // Dynamic subtitle flavor
    if (subEl) {
        if (title?.toLowerCase().includes('abort')) subEl.innerText = "EXTRACTION PROTOCOL ACTIVE";
        else if (title?.toLowerCase().includes('secure')) subEl.innerText = "INITIALIZING MANUAL DATA BACKUP";
        else if (title?.toLowerCase().includes('critical')) subEl.innerText = "DANGER SYSTEM OVERWRITE";
        else if (title?.toLowerCase().includes('save')) subEl.innerText = "COMMITTING DATA TO THE VOID";
        else subEl.innerText = "SYSTEM ALERT AUTHENTICATING";
    }

    screen.classList.remove('hidden');

    const updateConfirmSelection = () => {
        btnYes.classList.toggle('nav-selected', confirmNavIndex === 0);
        btnNo.classList.toggle('nav-selected', confirmNavIndex === 1);
    };

    updateConfirmSelection();

    const handleYes = () => {
        cleanup(!manualCleanup);
        if (onConfirm) onConfirm();
    };

    const handleNo = () => {
        cleanup();
    };

    const handleKeydown = (e) => {
        const key = e.key.toLowerCase();

        // Navigation: AD, WS, or Arrows (Horizontal focus)
        if (key === 'a' || key === 'w' || key === 'arrowleft' || key === 'arrowup') {
            e.preventDefault();
            confirmNavIndex = 0;
            updateConfirmSelection();
        } else if (key === 'd' || key === 's' || key === 'arrowright' || key === 'arrowdown') {
            if (hideCancel) return; // Prevent unlocking from YES
            e.preventDefault();
            confirmNavIndex = 1;
            updateConfirmSelection();
        }

        // Selection
        else if (key === 'f' || key === 'enter' || key === ' ') {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (confirmNavIndex === 0) handleYes();
            else handleNo();
        }

        // Quick Cancel
        else if (key === 'escape') {
            e.preventDefault();
            e.stopImmediatePropagation();
            handleNo();
        }
    };

    const handleMouseEnterYes = () => { confirmNavIndex = 0; updateConfirmSelection(); };
    const handleMouseEnterNo = () => { confirmNavIndex = 1; updateConfirmSelection(); };

    const cleanup = (hideUI = true) => {
        if (hideUI) screen.classList.add('hidden');
        window.removeEventListener('keydown', handleKeydown, true);
        btnYes.removeEventListener('mouseenter', handleMouseEnterYes);
        btnNo.removeEventListener('mouseenter', handleMouseEnterNo);
        // Clear focus from buttons to prevent spacebar re-triggering
        btnYes.blur();
        btnNo.blur();
    };

    // Use capturing phase for keydown to ensure we catch it before other systems
    window.addEventListener('keydown', handleKeydown, true);

    // Mouse Sync
    btnYes.addEventListener('mouseenter', handleMouseEnterYes);
    btnNo.addEventListener('mouseenter', handleMouseEnterNo);

    btnYes.onclick = (e) => { e.stopImmediatePropagation(); handleYes(); };
    btnNo.onclick = (e) => { e.stopImmediatePropagation(); handleNo(); };
};

/**
 * Custom Input Modal (Generalized Prompt)
 * @param {string} title - Header text
 * @param {string} message - Prompt message
 * @param {string} defaultValue - Initial input value
 * @param {function} onConfirm - Callback receiving the input value
 */
window.showPromptModal = (title, message, defaultValue, onConfirm) => {
    const modal = document.getElementById('preset-name-modal');
    const input = document.getElementById('preset-name-input');
    const btnConfirm = document.getElementById('btn-preset-confirm');
    const btnCancel = document.getElementById('btn-preset-cancel');
    const titleEl = document.getElementById('preset-modal-title');
    const promptText = document.getElementById('preset-modal-prompt');

    if (!modal || !input || !btnConfirm || !btnCancel) return;

    titleEl.innerText = (title || "INPUT REQUIRED").toUpperCase();
    promptText.innerText = message || "Enter value:";
    input.value = defaultValue || "";
    modal.classList.remove('hidden');
    input.focus();
    input.select();

    const cleanup = () => {
        modal.classList.add('hidden');
        btnConfirm.onclick = null;
        btnCancel.onclick = null;
        input.onkeydown = null;
        if (typeof Overworld !== 'undefined') Overworld.isPaused = false;
    };

    const confirm = () => {
        const val = input.value.trim();
        cleanup();
        if (onConfirm) onConfirm(val);
    };

    btnConfirm.onclick = confirm;
    btnCancel.onclick = cleanup;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); confirm(); }
        if (e.key === 'Escape') { e.preventDefault(); cleanup(); }
    };
    if (typeof Overworld !== 'undefined') Overworld.isPaused = true;
};

/**
 * Custom Alert Modal (Single Button)
 */
window.showAlertModal = (title, message, onConfirm) => {
    const btnYes = document.getElementById('btn-confirm-yes');
    if (btnYes) btnYes.innerText = "AUTHENTICATE";

    window.showConfirmModal(title, message, () => {
        if (onConfirm) onConfirm();
    }, false, true); // Pass hideCancel = true
};


// --- STARTER SELECTION LOGIC ---
let selectedStarterId = null;

window.openStarterSelection = () => {
    selectedStarterId = null;
    // Pause overworld while starter modal is open
    if (typeof Overworld !== 'undefined') Overworld.isPaused = true;
    document.querySelectorAll('.starter-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('starter-confirm-dialog').classList.add('hidden');
    document.getElementById('starter-selection-modal').classList.remove('hidden');
    // Pre-select first card
    starterNavIndex = 0;
    document.querySelectorAll('.starter-card')[0]?.classList.add('selected');
    selectedStarterId = document.querySelectorAll('.starter-card')[0]?.dataset.monster || null;
    // Block input until modal animation completes
    starterInputReady = false;
    setTimeout(() => { starterInputReady = true; }, 250);
};

let starterNavIndex = 0;
let starterInputReady = false;

function initStarterSelectionEvents() {
    const cards = document.querySelectorAll('.starter-card');
    const dialog = document.getElementById('starter-confirm-dialog');
    const dialogName = document.getElementById('starter-confirm-name');
    const btnYes = document.getElementById('btn-starter-yes');
    const btnNo = document.getElementById('btn-starter-no');

    function selectCard(index) {
        starterNavIndex = ((index % cards.length) + cards.length) % cards.length;
        cards.forEach(c => c.classList.remove('selected'));
        const card = cards[starterNavIndex];
        card.classList.add('selected');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        selectedStarterId = card.dataset.monster;
    }

    // Monster card images map
    const CARD_IMAGES = {
        cambihil: './assets/images/Card_Cambihil.png',
        lydrosome: './assets/images/Card_Lydrosome.png',
        nitrophil: './assets/images/Card_Nitrophil.png'
    };

    // YES has focus by default (0 = YES, 1 = NO)
    let confirmFocus = 0;

    function setConfirmFocus(idx) {
        confirmFocus = idx;
        btnYes.classList.toggle('focused', idx === 0);
        btnNo.classList.toggle('focused', idx === 1);
    }

    function openConfirmDialog() {
        if (!selectedStarterId) return;
        const img = document.getElementById('scd-img');
        img.src = CARD_IMAGES[selectedStarterId] || './assets/images/Card_Placeholder.png';
        img.alt = selectedStarterId;
        setConfirmFocus(0);
        dialog.classList.remove('hidden');
        // Block input until dialog animation completes
        starterInputReady = false;
        setTimeout(() => { starterInputReady = true; }, 250);
    }

    function closeConfirmDialog() {
        dialog.classList.add('hidden');
        // Block input briefly so a spam-press doesn't fire on the card screen
        starterInputReady = false;
        setTimeout(() => { starterInputReady = true; }, 250);
    }

    function commitStarter() {
        if (!selectedStarterId) return;

        gameState.storyFlags.starterChosen = true;
        gameState.profiles.player.team = [selectedStarterId];
        gameState.playerTeam = [selectedStarterId];
        gameState.cellDex = [selectedStarterId];
        gameState.profiles.player.cardBox = [`card_${selectedStarterId}`, 'atk_1', 'def_1'];
        resetGame();

        // Close both dialogs and resume overworld
        dialog.classList.add('hidden');
        document.getElementById('starter-selection-modal').classList.add('hidden');
        if (typeof Overworld !== 'undefined') Overworld.isPaused = false;

        addLog(`Acquired [${selectedStarterId.toUpperCase()}] as initial Cell.`);

        // Auto-trigger Jenzi's battle dialogue (same as pressing F on her)
        setTimeout(() => {
            if (typeof Overworld !== 'undefined') {
                const jenzi = Overworld.zones[Overworld.currentZone]?.objects?.find(o => o.id === 'jenzi');
                if (jenzi) {
                    Overworld.startNPCInteraction(jenzi);
                }
            }
        }, 200);
    }

    // Click a card to select + open confirm dialog
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            selectCard(i);
            openConfirmDialog();
        });
    });

    // YES / NO buttons
    btnYes.addEventListener('click', commitStarter);
    btnNo.addEventListener('click', closeConfirmDialog);

    // Keyboard
    window.addEventListener('keydown', (e) => {
        const starterOpen = !document.getElementById('starter-selection-modal').classList.contains('hidden');
        const dialogOpen = !dialog.classList.contains('hidden');

        if (!starterOpen) return;
        if (!starterInputReady) return; // wait for modal animation

        if (dialogOpen) {
            // Arrow keys toggle YES/NO focus
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                setConfirmFocus(confirmFocus === 0 ? 1 : 0);
            } else if (e.key === 'f' || e.key === 'F' || e.key === 'Enter') {
                e.preventDefault(); e.stopPropagation();
                if (confirmFocus === 0) commitStarter();
                else closeConfirmDialog();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeConfirmDialog();
            }
        } else {
            // Card selection: arrows to navigate, F/Enter to confirm selected
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                selectCard(starterNavIndex - 1);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                selectCard(starterNavIndex + 1);
            } else if (e.key === 'f' || e.key === 'F' || e.key === 'Enter') {
                e.preventDefault(); e.stopPropagation();
                openConfirmDialog();
            }
        }
    });
}

// Initialization
function init() {
    try {
        console.log("%c ODD LABS 2.0 - BATTLE ENGINE V1.25 LOADED ", "background: #00f3ff; color: #000; font-weight: bold;");
        console.log("Odd Labs 2.0 Initializing...");

        // Setup mandatory engine components
        loadCustomPresets();
        setupNodePositions();
        initStarterSelectionEvents();
        initPauseMenuEvents();
        setupEventListeners();

        // Populate Debug UI
        populateDebugRosters();

        // Centralized Reset handles all Profile/Preset/State initialization
        resetGame();

        // Initialize Builder Mode
        if (BuilderMode) BuilderMode.init();

        // Starts the premium entry sequence instead of a direct show
        playStartupSequence();
        console.log("Initialization Complete.");
    } catch (e) {
        console.error("Initialization Failed:", e);
        alert("Game failed to initialize. Check Console (F12).");
    }
}

function syncCardsToLevel(profileId, level) {
    const profile = gameState.profiles[profileId];
    if (!profile) return;

    // Reset Box to match Level Rewards snapshot
    let rewardPool = [];
    for (let i = 1; i <= level; i++) {
        if (LEVEL_REWARDS[i]) {
            rewardPool = rewardPool.concat(LEVEL_REWARDS[i]);
        }
    }

    // Account for what is already equipped
    const equipped = [];
    profile.party.forEach(mon => {
        if (mon && mon.equippedCards) {
            mon.equippedCards.forEach(ec => equipped.push(ec.cardId));
        }
    });

    // Final card box = Reward Pool - Equipped
    const finalBox = [...rewardPool];
    equipped.forEach(cardId => {
        const index = finalBox.indexOf(cardId);
        if (index > -1) finalBox.splice(index, 1);
    });

    profile.cardBox = finalBox;
    console.log(`[DEBUG] Syncing ${profile.name} Card Box for RG-${level}. Party Equips: ${equipped.length}, New Box: ${profile.cardBox.length}`);
}

/**
 * Checks if a profile possesses a specific leader card, 
 * searching both their card box and equipped slots across the entire party.
 */
function hasLeaderCard(profileId, cardId) {
    const profile = gameState.profiles[profileId];
    if (!profile) return false;

    // 1. Check Card Box
    if (profile.cardBox && profile.cardBox.includes(cardId)) return true;

    // 2. Check Equipped Cards on ALL monsters in party
    if (profile.party) {
        for (const monster of profile.party) {
            if (monster && monster.equippedCards && monster.equippedCards.some(ec => ec.cardId === cardId)) {
                return true;
            }
        }
    }
    return false;
}

function setupNodePositions() {
    const allNodes = document.querySelectorAll('.node');
    allNodes.forEach(node => {
        const angleDeg = parseFloat(node.style.getPropertyValue('--angle')) || 0;
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * RADIUS;
        const y = Math.sin(angleRad) * RADIUS;

        // Use top/left for position to avoid transform clobbering by animations
        node.style.left = `calc(50% + ${x}px)`;
        node.style.top = `calc(50% + ${y}px)`;
        node.style.transform = `translate(-50%, -50%)`;

        // Set transform-origin to the center of the pentagon (the core circle)
        // Since the node is centered at (x, y) relative to 50% 50%, the center is at (-x, -y) from the node's center.
        node.style.transformOrigin = `calc(50% - ${x}px) calc(50% - ${y}px)`;
    });
}

function setupEventListeners() {
    // MAIN MENU & SETTINGS
    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
        document.getElementById('toggle-skip-tutorial').checked = SKIP_TUTORIAL;
        document.getElementById('toggle-full-cell-debug').checked = FULL_CELL_DEBUG;
        showScreen('screen-settings');
    });

    document.getElementById('btn-settings-back')?.addEventListener('click', () => {
        showScreen(previousScreen || 'screen-main-menu');
    });



    // PRESET MANAGEMENT
    document.getElementById('btn-preset-save')?.addEventListener('click', handleSavePreset);
    document.getElementById('btn-preset-rename')?.addEventListener('click', handleRenamePreset);
    document.getElementById('btn-preset-delete')?.addEventListener('click', handleDeletePreset);

    // INCUBATOR SYSTEM
    document.getElementById('btn-incubator-close')?.addEventListener('click', () => closeIncubatorMenu());
    document.getElementById('btn-incubator-heal')?.addEventListener('click', () => startHealSequence());

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
    document.getElementById('btn-continue-game')?.addEventListener('click', () => {
        AudioManager.init();
        AudioManager.load('impact_base');
        if (loadGameState()) {
            triggerSlowTransition(() => startOverworld());
        }
    });

    document.getElementById('btn-start-overworld')?.addEventListener('click', () => {
        AudioManager.init();
        AudioManager.load('impact_base');
        const hasSave = localStorage.getItem('oddlabs_save_data');
        if (hasSave) {
            window.showConfirmModal(
                "CRITICAL WARNING",
                "STARTING A NEW EXPERIMENT WILL ERASE ALL CURRENT DATA LOGS, CELLS, AND PROGRESS. ARE YOU READY TO INITIALIZE?",
                () => {
                    triggerSlowTransition(() => {
                        document.getElementById('screen-confirm')?.classList.add('hidden');
                        import('./engine/state.js').then(m => {
                            if (m.fullResetGameState) {
                                m.fullResetGameState();
                                startOverworld();
                            } else {
                                // Fallback if module import fails or function missing
                                resetGameState();
                                location.reload();
                            }
                        });
                    });
                },
                true // manualCleanup
            );
        } else {
            triggerSlowTransition(() => startOverworld());
        }
    });

    document.getElementById('btn-save-game')?.addEventListener('click', () => {
        window.showConfirmModal(
            "SECURE PROGRESS",
            "Initializing manual data backup. This will overwrite your existing experiment log.\n\nNote: The game automatically saves after major discoveries and quest updates.",
            () => {
                saveGameState();
                const btn = document.getElementById('btn-save-game');
                if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = "DATA SECURED";
                    btn.classList.add('success');
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('success');
                    }, 2000);
                }
            }
        );
    });

    document.getElementById('btn-start-battle')?.addEventListener('click', () => {
        const pProfile = gameState.profiles.player;
        const activeCount = pProfile.party.slice(0, 3).filter(m => m !== null).length;
        if (activeCount === 0) {
            addLog("ERROR: Cannot commence battle. Active squad is empty.");
            return;
        }

        const opponentId = catalystState.battleOpponentId || 'opponent';
        startPreBattleSequence(opponentId);
    });

    window.addEventListener('start-wild-encounter', (e) => {
        const pProfile = gameState.profiles.player;
        const activeCount = pProfile.party.slice(0, 3).filter(m => m !== null).length;
        if (activeCount === 0) {
            console.warn("WILD ENCOUNTER ABORTED: Active squad is empty.");
            return;
        }

        const monsterId = e.detail.id || 'stemmy';
        const profileId = `${monsterId}_wild`;
        const playerRg = gameState.profiles.player.level || 0;

        // Randomize Wild RG: 1 to 5 levels lower than player, baseline 0
        const minRG = Math.max(0, playerRg - 5);
        const maxRG = Math.max(0, playerRg - 1);
        const rg = Math.floor(Math.random() * (maxRG - minRG + 1)) + minRG;

        // Use base stats from MONSTERS (getModifiedStats will handle scaling)
        const baseStats = MONSTERS[monsterId] || MONSTERS.stemmy;

        const wildMonster = createMonsterInstance(monsterId);
        wildMonster.id = `${monsterId}_${Date.now()}`;
        wildMonster.pp = 1; // Start wild encounters at 1 PP to match player mechanics

        const monsterName = monsterId.toUpperCase();

        gameState.profiles[profileId] = {
            name: `WILD ${monsterName} (RG-${rg})`,
            level: rg,
            cardBox: [],
            team: [monsterId, null, null],
            party: [wildMonster]
        };

        // Populate Card Box and Auto-Equip based on RG level
        syncCardsToLevel(profileId, rg);
        executeQuickEquip('balanced', profileId, 0);

        catalystState.battleOpponentId = profileId;
        if (typeof Overworld !== 'undefined') Overworld.stopLoop();
        startPreBattleSequence(profileId);
    });

    window.addEventListener('start-npc-encounter', (e) => {
        const npcId = e.detail.id;
        let profileId = e.detail.battleEncounterId || npcId;

        if (profileId !== 'starter_selection') {
            const pProfile = gameState.profiles.player;
            const activeCount = pProfile.party.slice(0, 3).filter(m => m !== null).length;
            if (activeCount === 0) {
                console.warn("NPC ENCOUNTER ABORTED: Active squad is empty.");
                return;
            }
        }

        if (npcId === 'jenzi_tutorial') {
            const typeAdvantages = {
                'cambihil': 'lydrosome',
                'nitrophil': 'cambihil',
                'lydrosome': 'nitrophil'
            };
            // Use window.gameState to be safe, though gameState is exported above
            const playerStarter = gameState.playerTeam[0] || 'nitrophil';
            const weakerType = typeAdvantages[playerStarter] || 'cambihil';

            gameState.profiles['jenzi_tutorial'] = {
                name: 'JENZI',
                level: 0,
                cardBox: [],
                team: [weakerType, null, null],
                party: [createMonsterInstance(weakerType)]
            };
            profileId = 'jenzi_tutorial';
        } else if (npcId === 'jenzi_atrium') {
            gameState.profiles['jenzi_atrium'] = {
                name: 'JENZI',
                level: 5,
                cardBox: [],
                team: ['stemmy', null, null],
                party: [createMonsterInstance('stemmy')]
            };

            // Generate basic RG-5 cards for Jenzi
            syncCardsToLevel('jenzi_atrium', 5);
            executeQuickEquip('balanced', 'jenzi_atrium', 0);

            profileId = 'jenzi_atrium';
        } else if (npcId === 'lana') {
            gameState.profiles['lana_boss'] = {
                name: 'LANA',
                level: 10,
                cardBox: [],
                team: ['cambihil', null, null],
                party: [createMonsterInstance('cambihil')]
            };
            syncCardsToLevel('lana_boss', 10);
            executeQuickEquip('survival', 'lana_boss', 0);
            profileId = 'lana_boss';
        } else if (npcId === 'dyzes') {
            gameState.profiles['dyzes_boss'] = {
                name: 'DYZES',
                level: 15,
                cardBox: [],
                team: ['nitrophil', null, null],
                party: [createMonsterInstance('nitrophil')]
            };
            syncCardsToLevel('dyzes_boss', 15);
            executeQuickEquip('balanced', 'dyzes_boss', 0);
            profileId = 'dyzes_boss';
        } else if (npcId === 'capsain') {
            gameState.profiles['capsain_boss'] = {
                name: 'CAPSAIN',
                level: 20,
                cardBox: [],
                team: ['lydrosome', null, null],
                party: [createMonsterInstance('lydrosome')]
            };
            syncCardsToLevel('capsain_boss', 20);
            executeQuickEquip('balanced', 'capsain_boss', 0);
            profileId = 'capsain_boss';
        } else if (!e.detail.battleEncounterId) {
            // Fallback for generic NPCs without custom encounters
            if (npcId.startsWith('npc_male')) {
                profileId = 'npc01';
            } else if (npcId.startsWith('npc_female')) {
                profileId = 'npc02';
            }
        }

        // Fallback safety
        if (!gameState.profiles[profileId] && !NPC_ENCOUNTERS[profileId]) profileId = 'npc01';

        catalystState.battleOpponentId = profileId;
        if (typeof Overworld !== 'undefined') Overworld.stopLoop();
        startPreBattleSequence(profileId);
    });

    /* --- PRE-BATTLE SEQUENCE LOGIC --- */
    const PRE_BATTLE_DATA = {
        'jenzi_tutorial': { art: 'Character_FullArt_Jenzi', dialogue: "Pelli-it up, Intern! Let's see what you've got." },
        'jenzi_atrium': { art: 'Character_FullArt_Jenzi', dialogue: "Pelli-it up!" },
        'player': { art: 'Character_FullArt_Rival', dialogue: "Analysis commencing. Do not disappoint." },
        'opponent': { art: 'Character_FullArt_Rival', dialogue: "Analysis commencing. Do not disappoint." },
        'lana': { art: 'Character_FullArt_Lana', dialogue: "Prepare for a lesson in botanical efficiency!" },
        'lana_boss': { art: 'Character_FullArt_Lana', dialogue: "Prepare for a lesson in botanical efficiency!" },
        'dyzes': { art: 'Character_FullArt_Dyzes', dialogue: "Let's see if your tactical vibe is strong enough." },
        'dyzes_boss': { art: 'Character_FullArt_Dyzes', dialogue: "Let's see if your tactical vibe is strong enough." },
        'capsain': { art: 'Character_FullArt_Director', dialogue: "I won't have my legacy tarnished by some spicy gossip!" },
        'capsain_boss': { art: 'Character_FullArt_Director', dialogue: "I won't have my legacy tarnished by some spicy gossip!" },
        'jenzi': { art: 'Character_FullArt_Jenzi', dialogue: "Pelli-it up, Intern! Let's see what you've got." },
        'npc01': { art: 'Character_FullArt_NPC_Male', dialogue: "Commencing standard engagement protocol." },
        'npc02': { art: 'Character_FullArt_NPC_Female', dialogue: "Bio-signature match confirmed. Initiating test." },
        'npc03': { art: 'Character_FullArt_NPC_Male', dialogue: "Deploying tactical cells. Readiness check." },
        'maya': { art: 'Character_FullArt_NPC_Female', dialogue: "Let's see what you got!" },
        'sapstan': { art: 'Character_FullArt_NPC_Male', dialogue: "Processing synchronous feedback. Prepare for engagement." },
        'blundur': { art: 'Character_FullArt_NPC_Male', dialogue: "Simulation initialized. Error margin: 0.01%." },
        'saito': { art: 'Character_FullArt_NPC_Female', dialogue: "Ready to lose? I won't go easy on you, Intern!" },
        'shopia': { art: 'Character_FullArt_NPC_Female', dialogue: "Watch the reaction when types collide!" },
        'clips': { art: 'Character_FullArt_NPC_Male', dialogue: "Processing multiple tactical frequencies... Now!" },
        'lustra': { art: 'Character_FullArt_NPC_Female', dialogue: "Warning: Bio-membrane destabilization detected!" },
        'rattou': { art: 'Character_FullArt_NPC_Male', dialogue: "Order up! Let's see if you can handle the heat!" },
        'ecto': { art: 'Character_FullArt_NPC_Male', dialogue: "Accelerating cellular output now!" },
        'premy': { art: 'Character_FullArt_NPC_Female', dialogue: "Initiating utility sync test." },
        'yifec': { art: 'Character_FullArt_NPC_Male', dialogue: "Deploying MAP Effects field!" },
        'white': { art: 'Character_FullArt_NPC_Male', dialogue: "Efficiency over luck, every time!" },
        'cherry': { art: 'Character_FullArt_NPC_Female', dialogue: "It's all in the placement!" },
        'anreal': { art: 'Character_FullArt_NPC_Male', dialogue: "Initiating interference protocols." },
        'godou': { art: 'Character_FullArt_NPC_Male', dialogue: "Crunching the numbers. Engagement imminent." },
        'yunidi': { art: 'Character_FullArt_NPC_Female', dialogue: "Activating Leader Perk: Strategic Supremacy." },
        'stemmy_wild': { art: 'Cell_FullArt_Stemmy', dialogue: "*A wild Stemmy aggressively bumps into you!*" },
        'nitrophil_wild': { art: 'Cell_FullArt_Nitrophil', dialogue: "*A wild Nitrophil aggressively bumps into you!*" },
        'cambihil_wild': { art: 'Cell_FullArt_Cambihil', dialogue: "*A wild Cambihil aggressively bumps into you!*" },
        'lydrosome_wild': { art: 'Cell_FullArt_Lydrosome', dialogue: "*A wild Lydrosome aggressively bumps into you!*" },
        'zibrya': { art: 'Character_FullArt_NPC_Female', dialogue: "Research should be accessible to everyone, don't you think?" },
        'elara': { art: 'Character_FullArt_Elara', dialogue: "The shimmer... it's just a trick of light and ancient circuitry." }
    };

    // --- OVERWORLD NPC SPRITE MAPPING ---
    // Unified IDs mapping to their overworld sprite CSS class (npc_male, npc_female)
    // If an ID is NOT in this table, the overworld engine defaults to derived class from ID.
    window.OVERWORLD_NPC_SPRITES = {
        // Atrium
        'zibrya': 'npc_female',
        'mamozet': 'npc_male',
        'sapstan': 'npc_male',
        'blundur': 'npc_male',
        'maya': 'npc_female',

        // Botanic
        'corel': 'npc_male',
        'shopia': 'npc_female',
        'clips': 'npc_male',
        'lustra': 'npc_female',

        // Human Research
        'miere': 'npc_female',
        'premy': 'npc_female',
        'ecto': 'npc_male',
        'yifec': 'npc_male',

        // Medical Experience
        'figumie': 'npc_female',
        'anva': 'npc_female',

        // Nursery
        'proxy': 'npc_male',
        'creata': 'npc_female',

        // Executive
        'anreal': 'npc_male',
        'godou': 'npc_male',
        'yunidi': 'npc_female',
        
        // Playground
        'pessi': 'npc_male',
        'kolla': 'npc_female',

        // Kitchen
        'rattou': 'npc_male',
        'furaijika': 'npc_female',

        // Entertainment
        'panto': 'npc_male',
        'saito': 'npc_female',

        // Specimen Storage
        'white': 'npc_male',
        'cherry': 'npc_female',
        'piza': 'npc_male',

        // Lobby
        'pax': 'npc_male',

        // Storage
        'deartis': 'npc_male'
    };

    let preBattleSequenceActive = false;
    let preBattleCurrentStep = 0;
    let preBattleIsAdvancing = false;

    function startPreBattleSequence(opponentProfileId) {
        preBattleSequenceActive = true;
        preBattleCurrentStep = 0;
        preBattleIsAdvancing = true; // Hard lock for 300ms at sequence start
        lastPreBattleInput = Date.now();
        setTimeout(() => { preBattleIsAdvancing = false; }, 300);
        catalystState.battleOpponentId = opponentProfileId;

        // Auto-Equip Boss Tactics if available
        if (NPC_PRESETS[opponentProfileId]) {
            applyPreset(opponentProfileId, opponentProfileId, true);
        } else if (NPC_ENCOUNTERS[opponentProfileId]) {
            // If it's in ENCOUNTERS but not PRESETS, we still need to initialize the opponent profile
            // based on the encounter data (RG, team, etc.)
            const enc = NPC_ENCOUNTERS[opponentProfileId];
            gameState.profiles[opponentProfileId] = {
                id: opponentProfileId,
                name: enc.name,
                level: enc.rg === 'auto' ? (gameState.profiles.player.level ?? 1) : enc.rg,
                party: enc.team.map(id => {
                    if (!id || !MONSTERS[id]) return null;
                    const mon = createMonsterInstance(id);
                    mon.owner = opponentProfileId;
                    return mon;
                })
            };
            // Full heal and apply stat scaling
            applyBonuses(gameState.profiles[opponentProfileId].party, gameState.profiles[opponentProfileId].level, true);

            // Use official Boss Encounter system: Sync cards to level then auto-equip based on style
            syncCardsToLevel(opponentProfileId, gameState.profiles[opponentProfileId].level);
            executeQuickEquip(enc.style || 'balanced', opponentProfileId, 0);
        } else if (opponentProfileId === 'jenzi') {
            const logs = gameState.logs ? gameState.logs.length : 0;
            if (logs >= 5) {
                applyPreset('jenzi', 'jenzi_mid', true);
            }
        }

        const opponent = gameState.profiles[opponentProfileId] || gameState.profiles.opponent;
        const lookupId = opponent.bossId || opponentProfileId;
        const data = PRE_BATTLE_DATA[lookupId] || PRE_BATTLE_DATA['opponent'];

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
        if (!preBattleSequenceActive || preBattleIsAdvancing) return;
        preBattleIsAdvancing = true;

        const opponentProfileId = catalystState.battleOpponentId || 'opponent';
        const opponent = gameState.profiles[opponentProfileId] || gameState.profiles.opponent;
        const lookupId = opponent.bossId || opponentProfileId;
        const data = PRE_BATTLE_DATA[lookupId] || PRE_BATTLE_DATA['opponent'];

        preBattleCurrentStep++;

        if (preBattleCurrentStep === 1) {
            // Show Dialogue
            const textEl = document.getElementById('pre-battle-text');
            if (textEl) textEl.innerText = `"${data.dialogue}"`;
            setTimeout(() => { preBattleIsAdvancing = false; }, 150); // 150ms lockout between steps
        } else if (preBattleCurrentStep === 2) {
            // Trigger Bio-Scan and Laser Wipe
            triggerBioScanTransition();
            // preBattleIsAdvancing remains true during full screen transition
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
    let lastPreBattleInput = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f' && e.repeat) return;
        if (preBattleSequenceActive && (e.key === 'f' || e.key === 'F' || e.key === 'Enter' || e.key === ' ')) {
            const now = Date.now();
            if (now - lastPreBattleInput < 300) return;
            lastPreBattleInput = now;
            advancePreBattleSequence();
        }
    });

    document.addEventListener('mousedown', () => {
        if (preBattleSequenceActive) {
            const now = Date.now();
            if (now - lastPreBattleInput < 300) return;
            lastPreBattleInput = now;
            advancePreBattleSequence();
        }
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        resetGame();
    });

    document.getElementById('btn-return-menu')?.addEventListener('click', () => {
        triggerSlowTransition(() => {
            document.getElementById('game-over-overlay').classList.add('hidden');
            showScreen('screen-main-menu');
        });
    });

    document.getElementById('btn-continue-overworld')?.addEventListener('click', () => {
        const btn = document.getElementById('btn-continue-overworld');
        const isRecovery = btn.innerText === 'RECOVER AT LOBBY';

        triggerSlowTransition(() => {
            document.getElementById('game-over-overlay').classList.add('hidden');
            showScreen('screen-overworld');

            if (typeof Overworld !== 'undefined') {
                // Reset any stuck flags (movement, dialogue) before resuming
                Overworld.resetStates();

                if (isRecovery) {
                    // Faint System: Set party to 1 HP and teleport to lobby
                    gameState.profiles.player.party.forEach(mon => {
                        if (mon) mon.currentHp = 1;
                    });

                    // --- CLEANUP WILD SPAWNER ---
                    if (catalystState.battleOpponentId && catalystState.battleOpponentId.includes('_wild')) {
                        Overworld.spawner.despawnCurrent();
                    }

                    // Force load lobby and set safe position (center-ish)
                    Overworld.renderMap('lobby', true, 5, 5);
                    gameState.playerPos = { x: 5, y: 5 }; // Safe entrance coords
                    Overworld.playerX = 5;
                    Overworld.playerY = 5;

                    btn.innerText = 'CONTINUE TO GAME'; // Reset for next time
                } else {
                    // --- WILD ENCOUNTER CLEANUP ---
                    if (catalystState.battleOpponentId && catalystState.battleOpponentId.includes('_wild')) {
                        Overworld.spawner.despawnCurrent();
                    }
                }

                Overworld.startLoop();

                // --- STORY HOOK: Jenzi post-battle dialogue ---
                const opponentId = catalystState.battleOpponentId;
                if ((window.gameState.storyFlags.jenziFirstBattleDone || opponentId === 'jenzi_tutorial') && !window.gameState.logs.includes('Log001')) {
                    // Hide Log #001 in the Red Specimen Tank instead of spawning on floor
                    const lobbyZone = Overworld.zones['lobby'];

                    // DEFENSIVE: Ensure the old floor-log object is removed if it persisted from a previous render
                    lobbyZone.objects = lobbyZone.objects.filter(obj => obj.id !== 'log_001');

                    const redTank = lobbyZone.objects.find(o => o.id === 'f23_lob_br');
                    if (redTank && !redTank.hiddenLogId) {
                        redTank.hiddenLogId = 'Log001';
                    }
                }
            }
        });
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

    // Unified Management Hub Controls -> Now Player Inventory
    document.getElementById('btn-open-inventory')?.addEventListener('click', () => {
        inventoryInputReady = false;
        setTimeout(() => { inventoryInputReady = true; }, 250);
        renderInventory();
        invNav.active = true;
        invNav.tabIndex = 0; // Default to first tab (Quests) per user request
        invNav.itemIndex = 0;
        updateInvNav(true);
        showScreen('screen-inventory');
    });

    document.getElementById('btn-close-card')?.addEventListener('click', () => {
        document.getElementById('monster-card-modal').classList.add('hidden');
        if (typeof Overworld !== 'undefined') Overworld.isPaused = false;
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
    document.getElementById('debug-active-rg')?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            const profileId = catalystState.activeProfile;
            gameState.profiles[profileId].level = Math.max(0, Math.min(20, val));
            syncCardsToLevel(profileId, gameState.profiles[profileId].level);
            applyBonuses(gameState.profiles[profileId].party, gameState.profiles[profileId].level);
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

    // Quick Equip Buttons
    document.querySelectorAll('.btn-quick:not(.danger)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const style = e.target.dataset.style;
            executeQuickEquip(style);
        });
    });

    document.getElementById('btn-quick-reset')?.addEventListener('click', () => clearEquippedCards());

    // Inventory Controls
    document.getElementById('btn-inventory-back')?.addEventListener('click', () => {
        document.getElementById('screen-inventory').classList.add('hidden');
        invNav.active = false;
        Overworld.isPaused = false;
    });

    // Combined Abort Logic
    window.handleAbortExperiment = () => {
        window.showConfirmModal(
            "ABORT EXPERIMENT",
            "Returning to the Main Menu will result in the loss of any unsaved tactical progress. Proceed with extraction?",
            () => {
                triggerSlowTransition(() => {
                    document.getElementById('screen-inventory')?.classList.add('hidden');
                    document.getElementById('screen-pause')?.classList.add('hidden');
                    document.getElementById('screen-confirm')?.classList.add('hidden');
                    if (typeof invNav !== 'undefined') invNav.active = false;
                    showScreen('screen-main-menu');
                });
            },
            true // manualCleanup
        );
    };

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
            updateInvNav(true); // Force detail update on tab click
        });
    });

    // Listen for Found DataLogs
    window.addEventListener('datalog-found', (e) => {
        const logId = e.detail.id;
        console.log(`Main UI: Registering found log ${logId}`);

        // Add to unseen if not already seen
        if (gameState.unseenLogs && !gameState.unseenLogs.includes(logId)) {
            gameState.unseenLogs.push(logId);
        }

        // This will update the log count in the overworld UI
        if (window.updateResourceHUD) window.updateResourceHUD();
    });


    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'f' && e.repeat) return; // Prevent spamming actions by holding F
        const inventoryOverlay = document.getElementById('screen-inventory');
        const isInvOpen = inventoryOverlay && !inventoryOverlay.classList.contains('hidden');
        const incubatorOverlay = document.getElementById('screen-incubator-menu');
        const isIncubatorOpen = incubatorOverlay && !incubatorOverlay.classList.contains('hidden');

        if (isIncubatorOpen && incubatorInputReady) {
            const buttons = incubatorOverlay.querySelectorAll('.btn-neon');
            if (key === 'w') {
                e.preventDefault();
                window.selectedIncubatorIndex = (window.selectedIncubatorIndex - 1 + buttons.length) % buttons.length;
                updateIncubatorSelection();
                return;
            }
            if (key === 's') {
                e.preventDefault();
                window.selectedIncubatorIndex = (window.selectedIncubatorIndex + 1) % buttons.length;
                updateIncubatorSelection();
                return;
            }
            if (key === 'f') {
                e.preventDefault();
                const selectedBtn = buttons[window.selectedIncubatorIndex];
                if (selectedBtn && !selectedBtn.classList.contains('disabled')) {
                    selectedBtn.click();
                }
                return;
            }
        }

        // Shop Navigation
        const shopScreen = document.getElementById('screen-shop');
        const isShopOpen = shopScreen && !shopScreen.classList.contains('hidden');
        if (isShopOpen && shopInputReady) {
            const quantityModal = document.getElementById('shop-quantity-modal');
            const isQtyOpen = quantityModal && !quantityModal.classList.contains('hidden');

            if (isQtyOpen) {
                if (key === 'a' || key === 'arrowleft') {
                    e.preventDefault();
                    document.getElementById('btn-qty-minus')?.click();
                    return;
                }
                if (key === 'd' || key === 'arrowright') {
                    e.preventDefault();
                    document.getElementById('btn-qty-plus')?.click();
                    return;
                }
                if (key === 'f' || key === 'enter') {
                    e.preventDefault();
                    document.getElementById('btn-qmodal-confirm')?.click();
                    return;
                }
                if (key === 'escape') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    closeQuantityModal();
                    return;
                }
            } else {
                if (key === 'escape') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    document.getElementById('btn-shop-close')?.click();
                    return;
                }
                const items = Array.from(document.querySelectorAll('.shop-item-card'));
                const currentIndex = items.findIndex(item => item.dataset.id === shopState.selectedItemId);

                if (key === 'w' || key === 'arrowup') {
                    e.preventDefault();
                    const nextIdx = (currentIndex - 1 + items.length) % items.length;
                    if (items[nextIdx]) selectShopItem(items[nextIdx].dataset.id);
                    return;
                }
                if (key === 's' || key === 'arrowdown') {
                    e.preventDefault();
                    const nextIdx = (currentIndex + 1) % items.length;
                    if (items[nextIdx]) selectShopItem(items[nextIdx].dataset.id);
                    return;
                }
                if (key === 'q' || key === 'e') {
                    e.preventDefault();
                    shopState.activeTab = shopState.activeTab === 'buy' ? 'sell' : 'buy';
                    shopState.selectedItemId = null;
                    updateShopUI();
                    return;
                }
                if (key === 'f' || key === 'enter') {
                    e.preventDefault();
                    const selectedCard = items[currentIndex];
                    if (selectedCard) {
                        const buyBtn = selectedCard.querySelector('.shop-item-price-btn');
                        buyBtn?.click();
                    }
                    return;
                }
            }
        }

        const synthScreen = document.getElementById('screen-synthesis');
        const isSynthOpen = synthScreen && !synthScreen.classList.contains('hidden');
        if (isSynthOpen && synthInputReady) {
            const confirmModal = document.getElementById('synthesis-confirm-modal');
            const isConfirmOpen = confirmModal && !confirmModal.classList.contains('hidden');

            if (isConfirmOpen) {
                if (key === 'f' || key === 'enter') {
                    e.preventDefault();
                    document.getElementById('btn-synthesis-confirm')?.click();
                    return;
                }
                if (key === 'escape') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    document.getElementById('btn-synthesis-cancel')?.click();
                    return;
                }
            } else {
                if (key === 'escape') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    document.getElementById('btn-synthesis-close')?.click();
                    return;
                }
                const items = Array.from(document.querySelectorAll('#synthesis-item-list .shop-item-card'));
                const currentIndex = items.findIndex(item => item.classList.contains('selected'));

                if (key === 'w' || key === 'arrowup') {
                    e.preventDefault();
                    const nextIdx = (currentIndex - 1 + items.length) % items.length;
                    items[nextIdx]?.click();
                    return;
                }
                if (key === 's' || key === 'arrowdown') {
                    e.preventDefault();
                    const nextIdx = (currentIndex + 1) % items.length;
                    items[nextIdx]?.click();
                    return;
                }
                if (key === 'f' || key === 'enter') {
                    e.preventDefault();
                    document.getElementById('btn-synthesis-action')?.click();
                    return;
                }
            }
        }

        // Bio Extraction Navigation
        const bioScreen = document.getElementById('screen-bio-extract');
        const isBioOpen = bioScreen && !bioScreen.classList.contains('hidden');
        if (isBioOpen && bioExtractInputReady) {
            if (key === 'f' || key === 'enter') {
                e.preventDefault();
                if (window.BioExtract && window.BioExtract.collectCurrentSlot) {
                    window.BioExtract.collectCurrentSlot();
                }
                return;
            }
            if (key === 'escape') {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (window.BioExtract && window.BioExtract.close) {
                    window.BioExtract.close();
                }
                return;
            }
        }

        // Monster Card Modal
        const cardModal = document.getElementById('monster-card-modal');
        const isCardOpen = cardModal && !cardModal.classList.contains('hidden');
        if (isCardOpen && (key === 'f' || key === 'escape' || key === 'enter' || key === ' ')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            document.getElementById('btn-close-card')?.click();
            return;
        }

        // Pause Menu Terminal Navigation
        const pauseScreen = document.getElementById('screen-pause');
        const isPauseOpen = pauseScreen && !pauseScreen.classList.contains('hidden');
        if (isPauseOpen && pauseInputReady) {
            const buttons = pauseScreen.querySelectorAll('.btn-neon');
            if (key === 'w' || key === 'arrowup') {
                e.preventDefault();
                pauseNavIndex = (pauseNavIndex - 1 + buttons.length) % buttons.length;
                updatePauseSelection();
                return;
            }
            if (key === 's' || key === 'arrowdown') {
                e.preventDefault();
                pauseNavIndex = (pauseNavIndex + 1) % buttons.length;
                updatePauseSelection();
                return;
            }
            if (key === 'f' || key === 'enter' || key === ' ') {
                e.preventDefault();
                e.stopImmediatePropagation();
                buttons[pauseNavIndex]?.click();
                return;
            }
            if (key === 'escape') {
                e.preventDefault();
                e.stopImmediatePropagation();
                window.togglePauseMenu(false);
                return;
            }
        }

        if (key === 'escape') {
            const previewOverlay = document.getElementById('card-preview-overlay');
            if (previewOverlay && !previewOverlay.classList.contains('hidden')) {
                previewOverlay.classList.add('hidden');
                return;
            }

            const rulebookScreen = document.getElementById('screen-rulebook');
            const inventoryOverlay = document.getElementById('screen-inventory');
            const battleScreen = document.getElementById('screen-battle');
            const isOverworld = !document.getElementById('screen-overworld').classList.contains('hidden');

            if (isInvOpen) {
                // If in inventory, ESC returns to overworld
                e.preventDefault();
                e.stopImmediatePropagation();
                inventoryOverlay.classList.add('hidden');
                invNav.active = false;
                Overworld.isPaused = false;
                return;
            }
            if (rulebookScreen && !rulebookScreen.classList.contains('hidden')) {
                showScreen(previousScreen || 'screen-overworld');
                return;
            }
            const settingsScreen = document.getElementById('screen-settings');
            if (settingsScreen && !settingsScreen.classList.contains('hidden')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                document.getElementById('btn-settings-back')?.click();
                return;
            }
            if (battleScreen && !battleScreen.classList.contains('hidden')) {
                window.togglePauseMenu(true);
                return;
            }

            // Universal Pause Toggle for Overworld
            const activeOverlays = [
                'screen-shop', 'screen-synthesis', 'screen-bio-extract',
                'screen-incubator-menu', 'screen-incubator-heal', 'screen-settings',
                'screen-confirm', 'starter-selection-modal', 'screen-pause'
            ];
            const isAnyOtherMenuOpen = activeOverlays.some(id => {
                const el = document.getElementById(id);
                return el && !el.classList.contains('hidden');
            });

            if (isOverworld && !isAnyOtherMenuOpen) {
                e.preventDefault();
                window.togglePauseMenu(true);
                return;
            }
        }

        if (key === 'r') {
            const isOverworld = !document.getElementById('screen-overworld').classList.contains('hidden');

            // Block inventory during timed quests
            if (isOverworld && window.Overworld && window.Overworld.activeTimedQuestId) {
                console.log("Input Blocked: Timed Quest Active.");
                return;
            }

            // Prevent opening inventory if another interactive overlay is open
            const activeOverlays = [
                'screen-shop', 'screen-synthesis', 'screen-bio-extract',
                'screen-incubator-menu', 'screen-incubator-heal'
            ];
            const isAnyOtherMenuOpen = activeOverlays.some(id => {
                const el = document.getElementById(id);
                return el && !el.classList.contains('hidden');
            });

            if (isOverworld && inventoryOverlay && !isAnyOtherMenuOpen) {
                if (!isInvOpen) {
                    inventoryInputReady = false;
                    setTimeout(() => { inventoryInputReady = true; }, 250);
                    renderInventory();
                    inventoryOverlay.classList.remove('hidden');
                    invNav.active = true;
                    invNav.tabIndex = 0;
                    invNav.itemIndex = 0;
                    Overworld.isPaused = true;
                    updateInvNav(true);
                } else {
                    inventoryOverlay.classList.add('hidden');
                    invNav.active = false;
                    Overworld.isPaused = false;
                }
            }
            return;
        }

        // Inventory Specific Navigation
        if (invNav.active && isInvOpen && inventoryInputReady) {
            const activeTab = document.getElementById(`tab-${INVENTORY_TABS[invNav.tabIndex]}`);

            // Re-fetch items if not catalyst, otherwise items is null which is fine since catalyst handles its own clicks
            let items = null;
            if (INVENTORY_TABS[invNav.tabIndex] !== 'catalyst') {
                items = activeTab.querySelectorAll('.log-item, .key-item-slot, .status-item, .quest-item');
            }

            if (key === 'q') { // Tab Left
                invNav.tabIndex = (invNav.tabIndex - 1 + INVENTORY_TABS.length) % INVENTORY_TABS.length;
                invNav.itemIndex = 0;
                updateInvNav(true);
            } else if (key === 'e') { // Tab Right
                invNav.tabIndex = (invNav.tabIndex + 1) % INVENTORY_TABS.length;
                invNav.itemIndex = 0;
                updateInvNav(true);
            } else if (key === 'w' || key === 'arrowup' || key === 'a' || key === 'arrowleft') {
                if (items && items.length > 0) {
                    e.preventDefault();
                    invNav.itemIndex = (invNav.itemIndex - 1 + items.length) % items.length;
                    updateInvNav(true);
                }
            } else if (key === 's' || key === 'arrowdown' || key === 'd' || key === 'arrowright') {
                if (items && items.length > 0) {
                    e.preventDefault();
                    invNav.itemIndex = (invNav.itemIndex + 1) % items.length;
                    updateInvNav(true);
                }
            } else if (key === 'f' || key === 'enter') {
                if (items && items.length > 0) {
                    const selectedItem = items[invNav.itemIndex];
                    if (selectedItem) selectedItem.click();
                }
            }
        } else {
            // Battle Quick Actions (F key for Random Selection)
            const battleScreen = document.getElementById('screen-battle');
            const isBattleOpen = battleScreen && !battleScreen.classList.contains('hidden');

            const gameOverOverlay = document.getElementById('game-over-overlay');
            const isGameOverVisible = gameOverOverlay && !gameOverOverlay.classList.contains('hidden');

            if (key === 'f' && (isBattleOpen || isGameOverVisible) && !gameState.isProcessing) {
                // Handle Game Over / Victory Continue
                const gameOverBtn = document.getElementById('btn-continue-overworld');
                const restartBtn = document.getElementById('btn-restart');

                if (isGameOverVisible) {
                    if (gameOverBtn && !gameOverBtn.classList.contains('hidden')) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        gameOverBtn.click();
                        return;
                    }
                    if (restartBtn && !restartBtn.classList.contains('hidden')) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        restartBtn.click();
                        return;
                    }
                }

                if (gameState.phase === 'NODE_SELECTION' || gameState.phase === 'MOVE_SELECTION') {
                    triggerRandomPlayerNodeSelection();
                }
            }

            if (key === 'f') {
                // Treat F as generic "Back/Continue" for modals/screens
                const invBtn = document.getElementById('btn-inventory-back');
                if (isInvOpen && invBtn) {
                    invBtn.click();
                    return;
                }

                const settingsScreen = document.getElementById('screen-settings');
                if (settingsScreen && !settingsScreen.classList.contains('hidden')) {
                    document.getElementById('btn-settings-back')?.click();
                    return;
                }

                const rulebookScreen = document.getElementById('screen-rulebook');
                if (rulebookScreen && !rulebookScreen.classList.contains('hidden')) {
                    document.getElementById('btn-rulebook-back')?.click();
                    return;
                }
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

    // --- AUDIO SETTINGS LISTENERS ---
    const handleVolumeInput = (type, val) => {
        const normalized = isNaN(val) ? 1.0 : val / 100;
        gameState.settings[type] = normalized;
        AudioManager[type] = normalized;
        if (type !== 'sfxVolume') AudioManager.updateVolumes();
        saveGameState();
    };

    document.getElementById('slider-master-volume')?.addEventListener('input', (e) => handleVolumeInput('masterVolume', parseFloat(e.target.value)));
    document.getElementById('slider-music-volume')?.addEventListener('input', (e) => handleVolumeInput('musicVolume', parseFloat(e.target.value)));
    document.getElementById('slider-sfx-volume')?.addEventListener('input', (e) => handleVolumeInput('sfxVolume', parseFloat(e.target.value)));

    // Main Debug Mode Toggle
    document.getElementById('toggle-skip-tutorial')?.addEventListener('change', (e) => {
        applySkipTutorial(e.target.checked);
        resetGame();
        renderInventory();
        if (!document.getElementById('screen-overworld').classList.contains('hidden')) {
            Overworld.renderMap();
        }
        addLog(`SKIP TUTORIAL: ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`);
    });

    document.getElementById('toggle-full-cell-debug')?.addEventListener('change', (e) => {
        applyFullCellDebug(e.target.checked);
        resetGame();
        renderInventory();
        if (!document.getElementById('screen-overworld').classList.contains('hidden')) {
            Overworld.renderMap();
        }
        addLog(`FULL CELL DEBUG: ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`);
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

    // DataLog Debug Listeners
    document.getElementById('toggle-debug-datalog-x')?.addEventListener('change', (e) => {
        gameState.showHiddenLogs = e.target.checked;
        if (!document.getElementById('screen-overworld').classList.contains('hidden')) {
            Overworld.renderMap();
        }
    });

    document.getElementById('toggle-debug-all-logs')?.addEventListener('change', (e) => {
        gameState.debugAllLogs = e.target.checked;
        if (typeof Overworld !== 'undefined' && Overworld.refreshLogs) {
            Overworld.refreshLogs();
        }
        renderInventory();
        addLog(`DEBUG: All DataLogs ${gameState.debugAllLogs ? 'visible' : 'reset to collected'}.`);
    });

    document.getElementById('toggle-debug-all-items')?.addEventListener('change', (e) => {
        gameState.debugAllItems = e.target.checked;
        renderInventory();
        addLog(`DEBUG: All Key Items ${gameState.debugAllItems ? 'visible' : 'reset to collected'}.`);
    });

    document.getElementById('toggle-debug-unlock-doors')?.addEventListener('change', (e) => {
        const isUnlocked = e.target.checked;
        gameState.debugUnlockDoors = isUnlocked; // Keep sync for engine checks
        const flags = gameState.storyFlags;
        flags.jenziAtriumUnlocked = isUnlocked;
        flags.botanicSectorUnlocked = isUnlocked;
        flags.humanWardUnlocked = isUnlocked;
        flags.executiveSuiteUnlocked = isUnlocked;
        flags.oldLabUnlocked = isUnlocked;

        if (!document.getElementById('screen-overworld').classList.contains('hidden')) {
            Overworld.renderMap();
        }
        addLog(`DEBUG: All doors ${isUnlocked ? 'UNLOCKED' : 'RESET to progress'}.`);
    });

    // --- ENCOUNTER BUILDER LOGIC ---
    syncSliderToNumber('debug-boss-rg-slider', 'debug-boss-rg');

    document.getElementById('btn-debug-generate-fight')?.addEventListener('click', () => {
        const bossId = document.getElementById('debug-boss-name').value;
        const rg = parseInt(document.getElementById('debug-boss-rg').value);
        const style = document.getElementById('debug-boss-style').value;

        const roster = [];
        document.querySelectorAll('.debug-mon-select').forEach(sel => {
            if (sel.value) roster.push(sel.value);
        });

        if (roster.length === 0) {
            addLog("ERROR: Boss roster is empty.");
            return;
        }

        const profileId = generateNPCProfile(bossId, rg, roster, style);
        catalystState.battleOpponentId = profileId;
        startPreBattleSequence(profileId);
    });

    // --- PLAYER BUILDER LOGIC ---
    syncSliderToNumber('debug-player-rg-slider', 'debug-player-rg');

    document.getElementById('btn-debug-set-player')?.addEventListener('click', () => {
        const rg = parseInt(document.getElementById('debug-player-rg').value);
        const style = document.getElementById('debug-player-style').value;
        const roster = [];
        document.querySelectorAll('.debug-player-mon-select').forEach(sel => {
            roster.push(sel.value || null);
        });

        // Ensure at least one monster
        const activeCount = roster.filter(id => id !== null).length;
        if (activeCount === 0) {
            addLog("ERROR: Player roster is empty.");
            return;
        }

        // Update Level/Style first
        gameState.profiles.player.level = rg;
        gameState.playerLevel = rg;
        gameState.profiles.player.style = style;
        gameState.playerStyle = style;

        // Sync Team (3-slot array of IDs)
        gameState.playerTeam = [...roster];
        gameState.profiles.player.team = [...roster];

        // Regenerate Party Objects (Ensuring 3 slots)
        gameState.profiles.player.party = roster.map(id => id ? createMonsterInstance(id) : null);

        // Update filtered active party
        gameState.playerParty = gameState.profiles.player.party.slice(0, 3).filter(m => m !== null);
        gameState.player = gameState.playerParty[0];

        // 1. Sync Cards first to populate cardBox
        syncCardsToLevel('player', rg);

        // 2. Initialize HP/PP (applyBonuses also heals)
        applyBonuses(gameState.playerParty, rg, true);

        // 3. Apply Quick Equip (Neural Calibration)
        gameState.profiles.player.party.forEach((mon, idx) => {
            if (mon) executeQuickEquip(style, 'player', idx);
        });

        addLog(`[DEBUG] Player synchronized to RG-${rg} with ${style.toUpperCase()} focus.`);
        saveGameState(); // Persist for Continue logic

        // Extensive UI Refresh
        if (window.updateResourceHUD) window.updateResourceHUD();
        renderManagementHub();

        // If in overworld, refresh map to update any level-based visuals
        if (typeof Overworld !== 'undefined' && !document.getElementById('screen-overworld').classList.contains('hidden')) {
            Overworld.renderMap();
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

        const updateBox = (id, key, val, isPercent = false) => {
            const suffix = isPercent ? '%' : '';
            setSafe(id, 'innerText', `${val}${suffix}`);

            const breakdown = mStats.breakdown ? mStats.breakdown[key] : null;
            const cardBonus = breakdown ? breakdown.card : 0;
            const effBonus = breakdown ? breakdown.eff : 0;

            setSafe(`${id}-card`, 'innerText', cardBonus > 0 ? `(+${cardBonus}${suffix})` : '');
            setSafe(`${id}-eff`, 'innerText', effBonus > 0 ? `(+${effBonus}${suffix})` : '');
        };

        updateBox('#card-hp', 'hp', mStats.maxHp);
        updateBox('#card-pp', 'pp', mStats.maxPp);
        updateBox('#card-crit', 'crit', mStats.crit, true);
        updateBox('#card-atk', 'atk', mStats.atk);
        updateBox('#card-def', 'def', mStats.def);
        updateBox('#card-spd', 'spd', mStats.spd);
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
    const mStats = getModifiedStats(monster);
    const updateDetailBox = (statId, key, val, isPercent = false) => {
        const idFull = `detail-${statId}`;
        const suffix = isPercent ? '%' : '';
        setSafe(`#${idFull}`, 'innerText', `${val}${suffix}`);

        const cardBonus = mStats.breakdown ? mStats.breakdown[key].card : 0;
        const effBonus = mStats.breakdown ? mStats.breakdown[key].eff : 0;

        setSafe(`#${idFull}-card`, 'innerText', cardBonus > 0 ? `(+${cardBonus}${suffix})` : '');
        setSafe(`#${idFull}-eff`, 'innerText', effBonus > 0 ? `(+${effBonus}${suffix})` : '');
    };

    updateDetailBox('hp', 'hp', mStats.maxHp);
    updateDetailBox('pp', 'pp', mStats.maxPp);
    updateDetailBox('crit', 'crit', mStats.crit, true);
    updateDetailBox('atk', 'atk', mStats.atk);
    updateDetailBox('def', 'def', mStats.def);
    updateDetailBox('spd', 'spd', mStats.spd);

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

    // Pause overworld while card is open
    if (typeof Overworld !== 'undefined') {
        Overworld.isPaused = true;
    }
}

/**
 * --- DEBUG UI ENHANCEMENTS ---
 * Logic for Encounter Builder and Player Builder
 */

function populateDebugRosters() {
    const monOptions = Object.keys(MONSTERS).sort().map(id =>
        `<option value="${id}">${MONSTERS[id].name}</option>`
    ).join('');

    // Boss Roster Selects
    document.querySelectorAll('.debug-mon-select').forEach(sel => {
        sel.innerHTML = '<option value="">-- NONE --</option>' + monOptions;
    });

    // Player Roster Selects
    document.querySelectorAll('.debug-player-mon-select').forEach(sel => {
        sel.innerHTML = '<option value="">-- NONE --</option>' + monOptions;
    });
}

function syncSliderToNumber(sliderId, numberId) {
    const slider = document.getElementById(sliderId);
    const number = document.getElementById(numberId);
    if (!slider || !number) return;

    slider.addEventListener('input', () => { number.value = slider.value; });
    number.addEventListener('input', () => { slider.value = number.value; });
}

function generateNPCProfile(bossId, rgLevel, roster, style) {
    const profileId = 'debug_boss_battle';
    const profileName = (NPC_ENCOUNTERS[bossId]?.name || bossId).toUpperCase();

    // Create monsters and ensure they know their level for stats calculation
    const party = roster.filter(id => id && MONSTERS[id]).map(id => {
        const mon = createMonsterInstance(id);
        mon.rg = rgLevel; // Explicitly set RG for stats logic
        return mon;
    });

    gameState.profiles[profileId] = {
        name: profileName,
        level: rgLevel,
        cardBox: [],
        team: roster,
        party: party,
        style: style,
        bossId: bossId
    };

    // Sync cards for the NPC
    syncCardsToLevel(profileId, rgLevel);

    // Apply style to all monsters
    party.forEach((mon, idx) => {
        if (mon) executeQuickEquip(style, profileId, idx);
    });

    // Initialize HP/PP for NPC
    applyBonuses(party, rgLevel);

    return profileId;
}

function addLog(msg) {
    const logContainer = document.getElementById('battle-log');
    if (!logContainer) return;
    battleLogHistory.push(msg);
    if (battleLogHistory.length > 4) battleLogHistory.shift();
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
        // Distinguish between a simple click (random selection) and a failed drag (reset)
        const dx = clientX - startX;
        const dy = clientY - startY;
        const dist = Math.hypot(dx, dy);

        if (dist < 10) {
            // Quick Selection: click and release
            triggerRandomPlayerNodeSelection();
        } else {
            // Drag to void: Reset core position
            selectionCore.style.transition = 'all 0.3s ease-out';
            selectionCore.style.transform = `translate(-50%, -50%)`;
        }
    }
}

function updateUI() {
    console.log("[DEBUG] Battle UI Updating...");
    const isPlayerTurn = gameState.currentTurn === 'PLAYER';
    // Calculate display stats including C-Card bonuses
    const pStats = getModifiedStats(gameState.player, gameState.playerLevel);
    const pPP = gameState.player.pp;
    const pMax = pStats.maxPp;
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

    setStyle('.player-display .hp-fill', 'width', `${(gameState.player.hp / pStats.maxHp) * 100}%`);
    setSafe('#player-hp-val', 'textContent', `${gameState.player.hp} / ${pStats.maxHp}`);
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
    setSafe('#enemy-rg', 'textContent', `RG-${gameState.enemyLevel}`);
    const pLayer = document.querySelector('.player-display .monster-float-layer');
    const pImg = document.querySelector('.player-display .monster-portrait');
    const pNameRaw = gameState.player.name.toLowerCase();
    const pNameCased = pNameRaw.charAt(0).toUpperCase() + pNameRaw.slice(1);
    const hasBackSprite = ['Nitrophil', 'Cambihil', 'Lydrosome', 'Phagoburst', 'Stemmy'].includes(pNameCased);
    if (pImg) {
        pImg.onerror = () => pImg.src = './assets/images/Card_Placeholder.png';
        pImg.src = hasBackSprite ? `./assets/images/${pNameCased}_Back.png` : `./assets/images/${pNameCased}.png`;
    }
    if (pLayer) pLayer.classList.toggle('anim-attacker-float', gameState.currentTurn === 'PLAYER');

    // Enemy PP
    const eStats = getModifiedStats(gameState.enemy, gameState.enemyLevel);
    const ePP = gameState.enemy.pp;
    const eMax = eStats.maxPp;
    const eIsLysis = ePP < 0;
    const eFillPercent = Math.min(100, (Math.abs(ePP) / eMax) * 100);
    const eColor = eIsLysis
        ? 'var(--color-lysis)'
        : `hsl(183, ${10 + 90 * (ePP / eMax)}%, ${40 + 10 * (ePP / eMax)}%)`;

    setStyle('.enemy-display .pp-fill', 'width', `${eFillPercent}%`);
    setStyle('.enemy-display .pp-fill', 'background', eColor);
    document.querySelector('.enemy-display .pp-fill')?.classList.toggle('overload', ePP >= 10);
    document.querySelector('.enemy-display .pp-label')?.classList.toggle('lysis', eIsLysis);

    setStyle('.enemy-display .hp-fill', 'width', `${(gameState.enemy.hp / eStats.maxHp) * 100}%`);
    setSafe('#enemy-hp-val', 'textContent', `${gameState.enemy.hp} / ${eStats.maxHp}`);
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

        node.classList.remove('attack', 'defense');
        node.classList.add(isPlayerTurn ? 'attack' : 'defense');

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
    const hasLeader1 = hasLeaderCard('player', 'leader_1');
    const hasLeader2 = hasLeaderCard('player', 'leader_2');

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

        const pPP = gameState.player.pp;
        const isPellicle = move.type === 'pellicle';

        // Unlock Logic: leader_1 unlocks 2nd move, leader_2 unlocks 3rd move
        let isPowerLocked = false;
        if (idx === 1 && !hasLeader1) isPowerLocked = true;
        if (idx === 2 && !hasLeader2) isPowerLocked = true;

        const moveAffordable = !isPowerLocked && (move.type !== 'pellicle' || !isDebtLimitReached);

        btn.classList.toggle('locked', isPowerLocked);
        btn.classList.toggle('disabled', !isPowerLocked && !moveAffordable);
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

// Helper to update the inventory detail panel
const updateDetail = (title, desc, imgSrc, statsGridHtml = "") => {
    const detailTitle = document.getElementById('inventory-detail-title');
    const detailDesc = document.getElementById('inventory-detail-desc');
    const detailCard = document.getElementById('inventory-detail-card');
    const statsContainer = document.getElementById('inventory-detail-stats');

    if (detailTitle) detailTitle.innerHTML = title;
    if (detailDesc) detailDesc.innerHTML = desc; // Use innerHTML for Quest formatting

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

    if (statsContainer) {
        statsContainer.innerHTML = statsGridHtml;
        statsContainer.style.display = statsGridHtml ? 'grid' : 'none';
    }
};

function renderInventory() {
    const currentTabId = INVENTORY_TABS[invNav.tabIndex];
    const logList = document.getElementById('inventory-log-list');
    const itemGrid = document.getElementById('inventory-item-grid');
    const statusList = document.getElementById('inventory-status-list');
    const questList = document.getElementById('inventory-quest-list');
    const detailTitle = document.getElementById('inventory-detail-title');
    const detailDesc = document.getElementById('inventory-detail-desc');
    const detailCard = document.getElementById('inventory-detail-card');

    if (!logList || !itemGrid || !statusList || !questList) return;

    // 1. Populate Logs (Conditional display)
    logList.innerHTML = '';

    // Filter logs: In FULL_CELL_DEBUG or debugAllLogs, show all. In Normal, show only collected.
    let displayLogs = (FULL_CELL_DEBUG || gameState.debugAllLogs)
        ? [...DATA_LOGS]
        : DATA_LOGS.filter(log => Overworld.logsCollected.includes(log.id));

    // AUTO-SORT: Always sort by log number numerically
    displayLogs.sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
        return numA - numB;
    });

    // Tracking for selection timer
    let selectTimer = null;

    if (displayLogs.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'log-item locked';
        emptyMsg.style.justifyContent = 'center';
        emptyMsg.innerHTML = '<span class="log-status" style="opacity: 0.5;">DATABASE: THE VOID<br>Try talking to Jenzi at the Lab.</span>';
        emptyMsg.onclick = () => {
            updateDetail("DATABASE: THE VOID", "This log is as empty as a lab fridge on a Monday. Either your eyes are closed, or you're allergic to reading. Go pester Jenzi; she’s basically a walking encyclopedia (and way more talkative than this screen).", null);
        };
        logList.appendChild(emptyMsg);
        const cardContainer = detailCard ? detailCard.closest('.detail-card-container') : null;
        if (cardContainer) cardContainer.style.display = 'none';
    } else {
        const clearLogNewStatus = (logId, element) => {
            if (gameState.unseenLogs.includes(logId)) {
                gameState.unseenLogs = gameState.unseenLogs.filter(id => id !== logId);
                if (element) element.classList.remove('new');
                console.log(`Log ${logId} marked as seen.`);
            }
        };

        displayLogs.forEach((log, i) => {
            const isCollected = Overworld.logsCollected.includes(log.id);
            const isRevealed = isCollected || gameState.debugAllLogs;
            const isNew = gameState.unseenLogs.includes(log.id);

            const item = document.createElement('div');
            item.className = `log-item ${isRevealed ? '' : 'locked'} ${log.secret ? 'secret' : ''} ${isNew ? 'new' : ''}`;
            item.innerHTML = `
                <span class="log-id">#${log.id}</span>
                <span class="log-status">${isRevealed ? log.title : 'ENCRYPTED DATA'}</span>
            `;

            item.onclick = () => {
                invNav.itemIndex = i;
                updateInvNav(false);

                // Clear any existing timer
                if (selectTimer) {
                    clearTimeout(selectTimer);
                    selectTimer = null;
                }

                if (isRevealed) {
                    updateDetail(`${log.id.toUpperCase()}:<br>${log.title}`, log.text, null);

                    // Selection Timer: Clear 'new' indicator after 3 seconds of selection
                    if (isNew) {
                        selectTimer = setTimeout(() => clearLogNewStatus(log.id, item), 3000);
                    }
                } else {
                    updateDetail(`LOCKED LOG #${log.id}`, "DATA IS CURRENTLY ENCRYPTED. \n\nExplore furniture in the overworld to initialize decryption sequence for this memory fragment.", null);
                }
            };
            logList.appendChild(item);
        });

        // Auto-select the newest (last) collected log if we don't have a valid selection
        const newestLog = displayLogs[displayLogs.length - 1];
        if (newestLog) {
            // Only force selection if at the start or out of bounds for the logs tab
            const currentTabId = INVENTORY_TABS[invNav.tabIndex];
            if (currentTabId === 'logs') {
                if (invNav.itemIndex === undefined || invNav.itemIndex < 0 || invNav.itemIndex >= displayLogs.length) {
                    invNav.itemIndex = displayLogs.length - 1;
                }
            }

            const targetLog = displayLogs[invNav.itemIndex] || newestLog;
            if (targetLog) {
                updateDetail(`${targetLog.id.toUpperCase()}:<br>${targetLog.title}`, targetLog.text, null);

                // Highlight the correct item visually
                const items = Array.from(logList.children).filter(el => el.classList.contains('log-item'));
                if (items[invNav.itemIndex]) {
                    items[invNav.itemIndex].classList.add('nav-selected');
                    // If it's a new log, mark as seen after some time
                    if (gameState.unseenLogs.includes(targetLog.id)) {
                        if (selectTimer) clearTimeout(selectTimer);
                        selectTimer = setTimeout(() => clearLogNewStatus(targetLog.id, items[invNav.itemIndex]), 3000);
                    }
                }
            }
        } else if (currentTabId === 'logs') {
            updateDetail("DATABASE: THE VOID", "This log is as empty as a lab fridge on a Monday. Either your eyes are closed, or you're allergic to reading. Go pester Jenzi; she’s basically a walking encyclopedia (and way more talkative than this screen).", null);
        }
    }

    // 2. Populate Items & Cards
    const populateGrid = (gridId, filterFn) => {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = '';

        const categoryItems = Object.entries(ITEM_PICKUP_DATA)
            .filter(([id, data]) => data.type === 'item' && filterFn(id))
            .map(([id, data]) => ({
                id: id,
                name: data.name,
                desc: data.desc,
                icon: data.icon || data.spriteClass,
                img: data.previewImg || 'Card_Placeholder.png'
            }));

        const itemsInInventory = (SKIP_TUTORIAL || FULL_CELL_DEBUG || gameState.debugAllItems) ? categoryItems.map(i => i.id) : gameState.items;

        // Group items and count them
        const itemCounts = {};
        itemsInInventory.forEach(id => {
            if (categoryItems.some(i => i.id === id)) {
                itemCounts[id] = (itemCounts[id] || 0) + 1;
            }
        });

        const itemsToShow = Object.keys(itemCounts).map(id => {
            const data = categoryItems.find(i => i.id === id);
            return { ...data, count: itemCounts[id] };
        });

        if (!(SKIP_TUTORIAL || FULL_CELL_DEBUG) && itemsToShow.length < categoryItems.length) {
            itemsToShow.push({ isPlaceholder: true });
        }

        itemsToShow.forEach((item, i) => {
            const slot = document.createElement('div');
            slot.className = 'key-item-slot';

            if (item.isPlaceholder) {
                slot.classList.add('empty-slot');
                slot.innerHTML = `<div style="width: 25px; height: 25px; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 50%; display: block; box-sizing: border-box;"></div>`;
                const placeholderTitle = currentTabId === 'items' ? "POCKETS: VACANT" : "COLLECTION: EMPTY";
                const placeholderDesc = currentTabId === 'items' ?
                    "Your bags are so empty, there's an echo in here! Maybe check the furniture? Go make some money and maybe you can afford a snack." :
                    "Your card collection is as empty as your lab-intern savings account. Zero cards found! It’s 'un-dealt' for someone in your position to have no cards. Keep exploring the Lab; you'll soon find something worth collecting.";
                slot.onclick = () => updateDetail(placeholderTitle, placeholderDesc, null);
            } else {
                const isSelectable = true; // Since we filtered foundItems above

                if (isSelectable) {
                    slot.innerHTML = `
                        <div class="key-item-sprite ${item.icon}"></div>
                        ${item.count > 1 ? `<div class="item-stack-count">x${item.count}</div>` : ''}
                    `;
                    slot.onclick = () => {
                        invNav.itemIndex = i;
                        updateInvNav(false);
                        updateDetail(item.name.toUpperCase(), item.desc, item.img ? `assets/images/${item.img}` : 'assets/images/Card_Placeholder.png');
                    };
                }
            }
            grid.appendChild(slot);
        });
    };

    populateGrid('inventory-item-grid', (id) => !id.includes('CARD'));
    populateGrid('inventory-card-grid', (id) => id.includes('CARD'));

    // Update empty states for Info Panel if current tab is empty
    if (currentTabId === 'items') {
        const hasItems = gameState.items.some(id => !id.includes('CARD'));
        if (!hasItems) updateDetail("POCKETS: VACANT", "Your bags are so empty, there's an echo in here! Maybe check the furniture? Go make some money and maybe you can afford a snack.", null);
    } else if (currentTabId === 'cards') {
        const hasCards = gameState.items.some(id => id.includes('CARD'));
        if (!hasCards) updateDetail("COLLECTION: EMPTY", "Your card collection is as empty as your lab-intern savings account. Zero cards found! It’s 'un-dealt' for someone in your position to have no cards. Keep exploring the Lab; you'll soon find something worth collecting.", null);
    }

    // 3. Populate Cell Status
    statusList.innerHTML = '';

    // Only show the active squad (first 3 members of the party)
    const playerParty = gameState.profiles.player.party.slice(0, 3).filter(Boolean);
    const playerLevel = gameState.profiles.player.level;

    if (playerParty.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'status-item glass-panel locked';
        placeholder.style.cursor = 'default';
        placeholder.innerHTML = `
            <div class="status-cell-icon" style="opacity: 0.2">
                <div style="width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.4); border-radius: 50%;"></div>
            </div>
            <div class="status-info">
                <div class="status-name" style="opacity: 0.5;">OCCUPANCY: ZERO</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.4;">
                    Containment cell is empty. Ask Jenzi about laboratory specimens.
                </div>
            </div>
        `;
        if (currentTabId === 'status') {
            updateDetail("OCCUPANCY: ZERO", "This containment unit is so clean, you could eat off the floor (please don't). It’s a literal 'G-host' town in here! Go find Jenzi; she’ll help you find something that actually has a pulse.", null);
        }
        placeholder.onclick = () => {
            updateDetail("OCCUPANCY: ZERO", "This containment unit is so clean, you could eat off the floor (please don't). It’s a literal 'G-host' town in here! Go find Jenzi; she’ll help you find something that actually has a pulse.", null);
        };
        statusList.appendChild(placeholder);
    } else {
        playerParty.forEach((cell, index) => {
            const item = document.createElement('div');
            item.className = 'status-item glass-panel';

            // Dynamically compute stats including any C-Cards equipped
            const stats = getModifiedStats(cell, playerLevel);
            const maxHp = stats.maxHp;
            const maxPp = stats.maxPp;

            // Avoid NaN if maxHp is 0 somehow
            const hpPercent = maxHp > 0 ? (cell.hp / maxHp) * 100 : 0;

            const iconName = cell.name.charAt(0).toUpperCase() + cell.name.slice(1);

            // Efficiency Badge
            const efficiencyHtml = `<div class="efficiency-badge">${cell.extractEfficiency ?? 0}</div>`;

            // PP Color Logic synced with Battle UI
            const isLysis = cell.pp < 0;
            const ppFillPercent = Math.min(100, (Math.abs(cell.pp) / maxPp) * 100);
            const ppColor = isLysis
                ? 'var(--color-lysis)'
                : `hsl(183, ${10 + 90 * (cell.pp / maxPp)}%, ${40 + 10 * (cell.pp / maxPp)}%)`;
            const isOverload = cell.pp >= 10;

            item.innerHTML = `
                <div class="status-cell-icon">
                    <img src="assets/images/${iconName}.png" alt="${cell.name}">
                    ${efficiencyHtml}
                </div>
                <div class="status-info">
                    <div class="status-name-row">
                        <div class="status-name">${cell.name.toUpperCase()}</div>
                    </div>
                    <div class="status-main-row">
                        <div class="status-bars">
                            <div class="vitals-row">
                                <div class="bar-label">HP</div>
                                <div class="bar-bg"><div class="bar-fill hp-fill" style="width: ${hpPercent}%"></div></div>
                                <span class="bar-value">${cell.hp} / ${maxHp}</span>
                            </div>
                            <div class="vitals-row">
                                <div class="bar-label pp-label ${isLysis ? 'lysis' : ''}">PP</div>
                                <div class="bar-bg">
                                    <div class="bar-fill pp-fill ${isOverload ? 'overload' : ''}" style="width: ${ppFillPercent}%; background: ${ppColor};"></div>
                                </div>
                                <span class="bar-value ${isLysis ? 'lysis' : ''}">${cell.pp} / ${maxPp}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="status-mini-stats">
                    <div class="mini-stat">
                        <span class="stat-label">ATTACK</span>
                        <span class="stat-total">${stats.atk}</span>
                        ${stats.breakdown.atk.card > 0 ? `<span class="stat-bonus card">[+${stats.breakdown.atk.card}]</span>` : ''}
                        ${stats.breakdown.atk.eff > 0 ? `<span class="stat-bonus eff">[+${stats.breakdown.atk.eff}]</span>` : ''}
                    </div>
                    <div class="mini-stat">
                        <span class="stat-label">DEFENSE</span>
                        <span class="stat-total">${stats.def}</span>
                        ${stats.breakdown.def.card > 0 ? `<span class="stat-bonus card">[+${stats.breakdown.def.card}]</span>` : ''}
                        ${stats.breakdown.def.eff > 0 ? `<span class="stat-bonus eff">[+${stats.breakdown.def.eff}]</span>` : ''}
                    </div>
                    <div class="mini-stat">
                        <span class="stat-label">SPEED</span>
                        <span class="stat-total">${stats.spd}</span>
                        ${stats.breakdown.spd.card > 0 ? `<span class="stat-bonus card">[+${stats.breakdown.spd.card}]</span>` : ''}
                    </div>
                    <div class="mini-stat">
                        <span class="stat-label">CRIT</span>
                        <span class="stat-total">${stats.crit}%</span>
                        ${stats.breakdown.crit.card > 0 ? `<span class="stat-bonus card">[+${stats.breakdown.crit.card}%]</span>` : ''}
                    </div>
                    <div class="mini-stat efficiency-stat">
                        <span class="stat-label">EFFICIENCY</span>
                        <span class="stat-total">LV.${Math.min(5, cell.extractEfficiency || 0)}</span>
                    </div>
                </div>
            `;

            const getStatBox = (label, statKey, isPercent = false) => {
                const data = stats.breakdown[statKey];
                const total = (statKey === 'hp') ? stats.maxHp :
                    (statKey === 'pp') ? stats.maxPp : stats[statKey];
                const suffix = isPercent ? '%' : '';

                let cardBonusHtml = '';
                if (data && data.card > 0) {
                    cardBonusHtml = `<span class="stat-bonus card">(+${data.card}${suffix})</span>`;
                }

                let effBonusHtml = '';
                if (data && data.eff > 0) {
                    effBonusHtml = `<span class="stat-bonus eff">(+${data.eff}${suffix})</span>`;
                }

                return `
                    <div class="stat-box">
                        <span class="stat-label">${label}</span>
                        <span class="stat-value">${total}${suffix}</span>
                        <div class="stat-bonuses-row">
                            ${cardBonusHtml}
                            ${effBonusHtml}
                        </div>
                    </div>
                `;
            };

            const statsGridHtml = `
                ${getStatBox('HP', 'hp')}
                ${getStatBox('PP', 'pp')}
                ${getStatBox('CRIT', 'crit', true)}
                ${getStatBox('ATK', 'atk')}
                ${getStatBox('DEF', 'def')}
                ${getStatBox('SPD', 'spd')}
            `;

            item.onclick = () => {
                invNav.itemIndex = index;
                updateInvNav(false);
                const iconNameClick = cell.name.charAt(0).toUpperCase() + cell.name.slice(1);
                const cardImg = `assets/images/Card_${iconNameClick}.png`;
                updateDetail(cell.name.toUpperCase(), cell.lore, cardImg, statsGridHtml);
            };
            statusList.appendChild(item);
        });
    }

    // 4. Update and Populate Quests
    syncMainQuest();
    renderQuestMenu();
}

function syncMainQuest() {
    const flags = gameState.storyFlags;
    const logCount = gameState.logs ? gameState.logs.length : 0;
    let stage = 'initialization';

    if (flags.capsainBattleDone) {
        stage = 'spicy_origin';
    } else if (flags.dyzesBattleDone) {
        stage = 'executive_truth';
    } else if (flags.lanaBattleDone) {
        stage = 'osmotic_revelations';
    } else if (flags.jenziAtriumBattleDone) {
        stage = 'botanic_secrets';
    } else if (flags.jenziAtriumUnlocked) {
        stage = 'atrium_archive';
    } else if (flags.jenziFirstBattleDone) {
        stage = 'atrium_threshold';
    } else if (flags.starterChosen) {
        stage = 'first_duel';
    }

    // Always keep the main story sync'd
    gameState.quests['main_story'] = {
        id: 'main_story',
        stage: stage,
        status: 'active'
    };
}

function renderQuestMenu() {
    const questList = document.getElementById('inventory-quest-list');
    if (!questList) return;
    questList.innerHTML = '';
    let visualIndex = 0;

    const quests = gameState.quests;
    const mainQuest = quests['main_story'];

    // Filter out main_story from side quests
    const activeQuests = Object.keys(quests).filter(id => id !== 'main_story' && quests[id].status !== 'finished');
    const completedQuests = Object.keys(quests).filter(id => id !== 'main_story' && quests[id].status === 'finished');

    // 1. Render Main Narrative Diary
    if (mainQuest && MAIN_QUEST_LOGS[mainQuest.stage]) {
        const mData = MAIN_QUEST_LOGS[mainQuest.stage];
        const header = document.createElement('div');
        header.className = 'quest-category-header main-narrative';
        header.innerText = 'RESEARCH DIARY';
        questList.appendChild(header);

        const item = document.createElement('div');
        item.className = `quest-item main-story active-narrative`;
        item.innerHTML = `
            <div class="quest-main">
                <span class="quest-title">${mData.title}</span>
                <span class="quest-progress">ACTIVE</span>
            </div>
            <div class="quest-desc">${mData.objective}</div>
        `;

        item.onclick = () => {
            invNav.itemIndex = 0;
            updateInvNav(false);
            const qTitle = mData.title.toUpperCase();
            const qDesc = `<i style="color: #88ccff; opacity: 0.8;">"${mData.narrative}"</i><br><br><b>CURRENT OBJECTIVE:</b><br>${mData.objective}`;
            updateDetail(qTitle, qDesc, 'assets/images/Card_Placeholder.png');
        };
        questList.appendChild(item);
        visualIndex++;
    }

    const renderCategory = (title, ids) => {
        if (ids.length === 0) return;

        const header = document.createElement('div');
        header.className = 'quest-category-header';
        header.innerText = title;
        questList.appendChild(header);

        ids.forEach(id => {
            const qData = QUESTS[id];
            const qProgress = quests[id];
            if (!qData) return;

            const currentIndex = visualIndex; // Capture the current visual index
            const item = document.createElement('div');
            item.className = `quest-item ${qProgress.status}`;

            const progressText = qData.type === 'collect'
                ? (qProgress.status === 'completed' || qProgress.status === 'finished' ? 'DONE' : 'LOOKING...')
                : `${qProgress.progress}/${qData.amount}`;

            item.innerHTML = `
                <div class="quest-main">
                    <span class="quest-title">${qData.title}</span>
                    <span class="quest-progress">${progressText}</span>
                </div>
                <div class="quest-desc">${qData.description}</div>
            `;

            item.onclick = () => {
                invNav.itemIndex = currentIndex;
                updateInvNav(false);
                const qTitle = qData.title.toUpperCase();
                let rewardText = "";
                if (qData.reward && qData.reward.type === 'resource_multi' && Array.isArray(qData.reward.rewards)) {
                    rewardText = qData.reward.rewards.map(r => {
                        const amt = r.amount ? ` x${r.amount}` : "";
                        return (r.id || "Unknown").toUpperCase() + amt;
                    }).join("<br>");
                } else if (qData.reward) {
                    rewardText = (qData.reward.id || "???").toUpperCase() + (qData.reward.amount ? " x" + qData.reward.amount : "");
                }

                const qDesc = qData.description + "<br><br><b>REWARD:</b><br>" + rewardText;
                updateDetail(qTitle, qDesc, 'assets/images/Card_Placeholder.png');
            };
            questList.appendChild(item);
            visualIndex++;
        });
    };

    renderCategory('ACTIVE MISSIONS', activeQuests);
    renderCategory('COMPLETED ARCHIVE', completedQuests);

    if (!mainQuest && activeQuests.length === 0 && completedQuests.length === 0) {
        questList.innerHTML = '<div class="empty-state">No missions initialized. Consult with laboratory staff for assignments.</div>';
    }
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
    const opponentProfileId = catalystState.battleOpponentId || 'opponent';

    const unlocked = [true];
    unlocked[1] = hasLeaderCard(opponentProfileId, 'leader_1');
    unlocked[2] = hasLeaderCard(opponentProfileId, 'leader_2');

    const selectedMove = AI.selectMove(gameState.enemy, isEnemyAttacking, gameState.player, unlocked);
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

                    // BUG FIX: Lowered threshold from 5 to 0.5 to show even -1 mitigations
                    if (results.hitResult.shieldAbsorbed > 0) {
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
                        addLog(`[LYSIS] Structural failure increased damage by ${results.hitResult.lysisPenalty}!`, 'lysis-penalty');
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

                    // BUG FIX: Lowered threshold to show even small mitigations
                    if (results.hitResult.shieldAbsorbed > 0) {
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
                        addLog(`[LYSIS] Structural failure increased damage!`, 'lysis-penalty');
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
    }, 700); // Start immediately after 0.7s heartbeat pattern ends.

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

            console.log(`[VFX] Reflected ${results.reflectDamage} damage.`);
        }, 700);
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
    console.log(`[VFX] MAP ACTIVATION START: ${move.id} | Ref: ${defenderNode}`);

    const interactiveNodes = document.querySelectorAll('#interactive-pentagon .node');

    // Do NOT clear here, as attacker and defender moves might trigger simultaneously
    // and we want both patterns to show if they overlap. 
    // They will be cleaned up by the timeout.

    const getAbsoluteIndex = (relDist) => {
        const indices = [];
        for (let i = 0; i < 5; i++) {
            const diff = Math.abs(i - defenderNode);
            const dist = Math.min(diff, 5 - diff);
            if (dist === relDist) indices.push(i);
        }
        return indices;
    };

    const applyPulseVFX = (relDist, className) => {
        const indices = getAbsoluteIndex(relDist);
        indices.forEach(idx => {
            const node = Array.from(interactiveNodes).find(n => parseInt(n.dataset.index) === idx);
            if (node) {
                node.classList.add(className);
            }
        });
    };

    // Logic based on skill modifiers (Mapping user requests to technical properties)
    if (move.matchExpand === 1 || move.matchOffset === -1) {
        // [EASY TARGET]: 3 Red (Dist 0, 1), 2 Yellow (Dist 2)
        applyPulseVFX(0, 'node-activate-match');
        applyPulseVFX(1, 'node-activate-match');
        applyPulseVFX(2, 'node-activate-near');
    } else if (move.matchRisky) {
        // [ALL OR NOTHING]: 1 Red (Dist 0), 4 Far (Dist 1, 2)
        applyPulseVFX(0, 'node-activate-match');
        applyPulseVFX(1, 'node-activate-far');
        applyPulseVFX(2, 'node-activate-far');
    } else if (move.matchFixed === 1) {
        // [RELIABLE HIT]: All 5 Yellow
        applyPulseVFX(0, 'node-activate-near');
        applyPulseVFX(1, 'node-activate-near');
        applyPulseVFX(2, 'node-activate-near');
    } else if (move.matchFixed === 2) {
        // [PUNY SLAP]: All 5 White
        applyPulseVFX(0, 'node-activate-far');
        applyPulseVFX(1, 'node-activate-far');
        applyPulseVFX(2, 'node-activate-far');
    } else if (move.matchExpand === 2) {
        // [PERFECT STRIKE]: All 5 Red
        applyPulseVFX(0, 'node-activate-match');
        applyPulseVFX(1, 'node-activate-match');
        applyPulseVFX(2, 'node-activate-match');
    } else if (move.id === 'drunk_man' || move.matchFixed === 3) {
        // [DRUNK MAN]: 1 Near (Dist 0), 4 Far (Dist 1, 2)
        applyPulseVFX(0, 'node-activate-near');
        applyPulseVFX(1, 'node-activate-far');
        applyPulseVFX(2, 'node-activate-far');
    }

    // Auto-cleanup after resolution peak
    setTimeout(() => {
        console.log(`[VFX-CLEANUP] Removing activation pattern classes.`);
        interactiveNodes.forEach(node => {
            node.classList.remove('node-activate-match', 'node-activate-near', 'node-activate-far');
        });
    }, 700); // Clear pattern at exact end of 0.7s animation
}

function clearVFX() {
    console.log(`[VFX-CLEANUP] clearVFX called (Full reset)`);
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
            ghost.style.top = ghostTargetNode.style.top;
            ghost.style.left = ghostTargetNode.style.left;
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
        console.log(`[BATTLE] DOUBLE NEUTRALIZATION DETECTED`);
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
                showGameOver(false); // Victory
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
        console.log(`[BATTLE] ENEMY DEFEATED`);
        resetSelectorCore();

        triggerMonsterExit('.enemy-display', () => {
            const nextMonster = gameState.enemyParty.find(m => m.hp > 0);
            if (nextMonster) {
                addLog(`Target neutralized. Next target incoming...`);
                gameState.enemy = nextMonster;
                updateUI();
                triggerBattleEntry('.enemy-display', () => {
                    // Check if player ALSO fainted during the exchange (e.g. from recoil/reflection processed by the exit timing)
                    const isPlayerNowDefeated = gameState.player.hp <= 0;
                    if (!isPlayerNowDefeated) {
                        finalizeTurnSequence();
                    } else {
                        // Re-trigger game over logic cleanly without direct recursion if possible
                        checkGameOver();
                    }
                });
            } else {
                // No more enemies, but double check player state to avoid edge case skips
                if (gameState.player.hp <= 0) {
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
        console.log(`[BATTLE] PLAYER DEFEATED`);
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
                    const isEnemyNowDefeated = gameState.enemy.hp <= 0;
                    if (!isEnemyNowDefeated) {
                        finalizeTurnSequence();
                    } else {
                        checkGameOver();
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

// Hardcoded Rounded Research Grade EXP Thresholds for easier follow & balancing (+10% Grind Factor)
const EXP_THRESHOLDS = {
    0: 0,
    1: 60,
    2: 170,
    3: 350,
    4: 550,
    5: 900,
    6: 1350,
    7: 1900,
    8: 2550,
    9: 3300,
    10: 4200,
    11: 5200,
    12: 6300,
    13: 7500,
    14: 8800,
    15: 10250,
    16: 11800,
    17: 13450,
    18: 15200,
    19: 17100,
    20: 19100
};

const getExpReqForLevel = (level) => {
    if (EXP_THRESHOLDS[level] !== undefined) return EXP_THRESHOLDS[level];
    return EXP_THRESHOLDS[20] + (level - 20) * 3000;
};

function updateOverworldEXPBar() {
    const currentRg = gameState.profiles.player.level || 0;
    const currentTotalExp = gameState.exp || 0;

    let expFloor = getExpReqForLevel(currentRg);
    let expCap = getExpReqForLevel(currentRg + 1);

    let expInLevel = currentTotalExp - expFloor;
    let expNeededForLevel = expCap - expFloor;

    // Cap visual at 100% just in case
    expInLevel = Math.max(0, Math.min(expInLevel, expNeededForLevel));
    let widthPct = (expInLevel / expNeededForLevel) * 100;
    if (currentRg >= 20) {
        widthPct = 100; // Max Level
        expInLevel = "MAX";
        expNeededForLevel = "MAX";
    }

    const elFill = document.getElementById('exp-bar-fill');
    const elCurrent = document.getElementById('exp-current');
    const elMax = document.getElementById('exp-max');

    if (elFill) elFill.style.width = `${widthPct}%`;
    if (elCurrent) elCurrent.innerText = expInLevel;
    if (elMax) elMax.innerText = expNeededForLevel;
}

function showGameOver(isFailure, forceOverlay = false) {
    // Safeguard: Prevent multiple calls if already showing
    if (!document.getElementById('game-over-overlay').classList.contains('hidden') && !forceOverlay) return;

    const opponentId = catalystState.battleOpponentId;
    const isBossMatch = (opponentId === 'lana_boss' || opponentId === 'dyzes_boss' || opponentId === 'capsain_boss');

    // NEW: Check for generic battle-able NPCs that have special post-battle dialogue needs
    const isCustomNpcMatch = opponentId && !opponentId.endsWith('_wild') && !isBossMatch;

    // Trigger dialogue FIRST, then show panel (Victory or Loss)
    if ((isBossMatch || isCustomNpcMatch) && !forceOverlay) {
        // Transition back to overworld first
        showScreen('screen-overworld');
        resetPositions();
        if (typeof Overworld !== 'undefined') {
            Overworld.startLoop();

            // Short delay to let the map render
            setTimeout(() => {
                const zone = Overworld.zones[Overworld.currentZone];
                let npc = null;

                if (zone) {
                    const bossId = opponentId.replace('_boss', '').replace('_tutorial', '').replace('_atrium', '');
                    npc = zone.objects.find(o => o.id === bossId || o.battleEncounterId === opponentId);
                }

                if (npc || isCustomNpcMatch) {
                    // Trigger "Won" dialogue if player lost (isFailure), otherwise "Defeated"
                    // Pass true for isPostBattle (3rd arg) to prevent re-triggering the battle
                    Overworld.startNPCInteraction(npc || opponentId, isFailure, true);

                    // Hook into completion to show the actual panel
                    Overworld.onDialogueComplete = () => {
                        showGameOver(isFailure, true); // forceOverlay = true
                    };
                } else {
                    // Fallback
                    showGameOver(isFailure, true);
                }
            }, 600);
        }
        return;
    }

    resetPositions(); // Clear state immediately when battle ends
    const overlay = document.getElementById('game-over-overlay');
    const title = document.getElementById('game-over-title');
    const msg = document.getElementById('game-over-message');
    const btnRestart = document.getElementById('btn-restart');
    const btnMainMenu = document.getElementById('btn-return-menu');
    const btnContinue = document.getElementById('btn-continue-overworld');
    const expContainer = document.getElementById('battle-result-exp-container');
    const expText = document.getElementById('battle-result-exp-text');
    const expFill = document.getElementById('battle-result-exp-fill');
    const hint = document.getElementById('game-over-hint');

    const isTutorialLoss = isFailure && opponentId === 'jenzi_tutorial';

    if (overlay && title && msg) {
        if (isFailure && !isTutorialLoss) {
            title.innerHTML = `THE EXPERIMENT HAS <span class="neon-text" style="color: #ff3333; text-shadow: 0 0 10px #ff3333;">FAILED!</span>`;

            const quirkyMessages = [
                "Your cells need more love... and maybe some specialized vitamins.",
                "Tactical extraction initiated. Your monster looks like it needs a long nap and a hug.",
                "Experiment paused. Critical affection levels detected. Returning to base for snacks.",
                "Self-care protocol activated. Even bio-engineered cells need a break sometimes.",
                "Neural link stabilized. Let's get you back to the lab for some TLC and re-calibration."
            ];
            const randomMsg = quirkyMessages[Math.floor(Math.random() * quirkyMessages.length)];
            msg.innerText = randomMsg;

            if (btnRestart) btnRestart.classList.add('hidden'); // HIDDEN as per user request (use RECOVER instead)
            if (btnMainMenu) btnMainMenu.classList.remove('hidden');
            if (btnContinue) {
                btnContinue.classList.remove('hidden');
                btnContinue.innerText = "RECOVER AT LOBBY";
            }
        } else {
            if (isTutorialLoss || (opponentId === 'jenzi_tutorial' && !isFailure)) {
                gameState.storyFlags.jenziFirstBattleDone = true;

                // Tutorial recovery: Always full heal after first battle (win or loss)
                applyBonuses(gameState.profiles.player.party, gameState.profiles.player.level, true);

                if (isTutorialLoss) {
                    title.innerHTML = `TEST <span class="neon-text" style="color: #ffcc00; text-shadow: 0 0 10px #ffcc00;">CONCLUDED</span>`;
                } else {
                    title.innerHTML = `EXPERIMENT <span class="neon-text">SUCCESSFUL</span>`;
                }
            } else {
                title.innerHTML = `EXPERIMENT <span class="neon-text">SUCCESSFUL</span>`;
            }

            if (btnRestart) btnRestart.classList.add('hidden');
            if (btnMainMenu) btnMainMenu.classList.add('hidden');
            if (btnContinue) btnContinue.classList.remove('hidden');
        }

        // --- GRINDING & PROGRESSION REWARD LOGIC (Now Universal) ---
        let expEarned = 0;
        let creditsEarned = 0;
        let biomassEarned = 0;
        const currentRg = gameState.profiles.player.level || 0;
        const playerRG = gameState.profiles.player.level || 0;
        const rgScaling = 1 + (playerRG * 0.05);

        // --- QUEST PROGRESSION HOOK ---
        if (!isFailure && typeof Overworld !== 'undefined' && opponentId) {
            Overworld.updateQuestProgress('defeat', opponentId);
        }

        // Only calculate typical rewards if not a generic failure
        if (!isFailure || isTutorialLoss) {
            if (opponentId === 'jenzi_tutorial') {
                if (isFailure) {
                    expEarned = 12; // Balanced to half of tutorial win (25)
                    creditsEarned = 20;
                    biomassEarned = 2;
                } else {
                    expEarned = 25;
                    creditsEarned = 50;
                    biomassEarned = 5;
                }
            } else if (opponentId && opponentId.endsWith('_wild')) {
                // Wild Encounter: 10-25 LC, 1-5 Biomass
                const baseLC = 10 + Math.floor(Math.random() * 16);
                const baseBM = 1 + Math.floor(Math.random() * 5);

                creditsEarned = Math.round(baseLC * rgScaling);
                biomassEarned = Math.round(baseBM * rgScaling);
                expEarned = Math.round(25 * rgScaling);
            } else if (opponentId === 'jenzi_atrium') {
                // Keep story flag but allow reward to fall through to NPC_ENCOUNTERS logic
                gameState.storyFlags.jenziAtriumBattleDone = true;
            } else if (typeof NPC_ENCOUNTERS !== 'undefined' && NPC_ENCOUNTERS[opponentId]) {
                // Custom Modular Reward from cards.js (e.g., Maya)
                const enc = NPC_ENCOUNTERS[opponentId];
                if (enc.reward) {
                    creditsEarned = enc.reward.credits || 50;
                    biomassEarned = enc.reward.biomass || 5;
                    expEarned = enc.reward.exp || 15;
                } else {
                    // Default custom reward
                    creditsEarned = 50;
                    biomassEarned = 5;
                    expEarned = 25;
                }

                // Mark battle as completed for custom NPCs
                if (gameState.storyFlags) {
                    gameState.storyFlags[`battleDone_${opponentId}`] = true;
                    if (isFailure) {
                        gameState.storyFlags[`battleLost_${opponentId}`] = true;
                    } else {
                        gameState.storyFlags[`battleWon_${opponentId}`] = true;
                    }
                }
            } else if (opponentId.startsWith('jenzi') || opponentId.startsWith('npc')) {
                // Human NPC: 120 LC, 9 Biomass
                creditsEarned = Math.round(120 * rgScaling);
                biomassEarned = Math.round(9 * rgScaling);
                expEarned = Math.round(50 * rgScaling);
            } else {
                // Fallback
                creditsEarned = Math.round(50 * rgScaling);
                biomassEarned = Math.round(5 * rgScaling);
                expEarned = Math.round(25 * rgScaling);
            }
        }

        const expBefore = gameState.exp || 0;
        const expFloor = getExpReqForLevel(currentRg);
        const expCap = getExpReqForLevel(currentRg + 1);
        const initialExpRelative = Math.max(0, expBefore - expFloor);
        const expNeededForLevel = expCap - expFloor;
        const initialPercent = Math.max(0, Math.min((initialExpRelative / expNeededForLevel) * 100, 100));

        gameState.exp += expEarned;
        gameState.credits += creditsEarned;
        gameState.biomass += biomassEarned;

        // Log the rewards
        if (expEarned > 0 || creditsEarned > 0) {
            console.log(`Battle Rewards: ${creditsEarned} LC, ${biomassEarned} Biomass, ${expEarned} EXP`);
        }

        if (expContainer) expContainer.classList.remove('hidden');

        // Check Level Up!
        let targetLevel = currentRg;
        let levelUpText = "";

        while (targetLevel < 20 && gameState.exp >= getExpReqForLevel(targetLevel + 1)) {
            targetLevel++;
            levelUpText += `<br><span class="neon-text">RG LEVEL UP! [RG-${targetLevel}]</span> - New C-Cards Synced!`;
        }

        if (targetLevel > currentRg) {
            gameState.profiles.player.level = targetLevel;
            gameState.playerLevel = targetLevel;
            syncCardsToLevel('player', targetLevel);
        }

        // Set Result Messaging
        if (!isFailure) {
            msg.innerHTML = `All target entities have been purged. Objective secured.<br><br>
            <span style="color: #00ff66;">+${expEarned} EXP</span><br>
            <span style="color: #ffd700;">+${creditsEarned} LC</span> | <span style="color: #00ff66;">+${biomassEarned} Biomass</span>
            ${levelUpText}`;
        } else if (isTutorialLoss) {
            msg.innerHTML = `"Oof. That was rough, Intern. But hey, it's just a test. You definitely have... potential."<br><br>
            <span style="color: #00ff66;">+${expEarned} EXP</span><br>
            <span style="color: #ffd700;">+${creditsEarned} LC</span> | <span style="color: #00ff66;">+${biomassEarned} Biomass</span>`;
        } else {
            // Already has msg.innerText set via quirkyMessages, but we can append EXP
            msg.innerHTML += `<br><br><span style="color: #888;">+${expEarned} EXP</span>`;
        }

        // Initialize & Animate EXP Bar
        if (expFill && expText) {
            expFill.style.transition = 'none';
            expFill.style.width = `${initialPercent}%`;
            expText.innerText = `${initialExpRelative} / ${expNeededForLevel}`;

            void expFill.offsetWidth; // Force Reflow
            expFill.style.transition = 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';

            setTimeout(() => {
                if (targetLevel > currentRg) {
                    expFill.style.width = `100%`;
                    expText.innerHTML = `${expCap - expFloor} / ${expNeededForLevel} <span style="color: #00ff66;">[LEVEL UP!]</span>`;

                    setTimeout(() => {
                        const nFloor = getExpReqForLevel(targetLevel);
                        const nCap = getExpReqForLevel(targetLevel + 1);
                        const nNeeded = nCap - nFloor;
                        const remainder = gameState.exp - nFloor;

                        expFill.style.transition = 'none';
                        expFill.style.width = `0%`;
                        void expFill.offsetWidth;
                        expFill.style.transition = 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        expFill.style.width = `${(remainder / nNeeded) * 100}%`;
                        expText.innerText = `${remainder} / ${nNeeded}`;
                    }, 1600);
                } else {
                    const currExpRel = gameState.exp - expFloor;
                    expFill.style.width = `${(currExpRel / expNeededForLevel) * 100}%`;
                    expText.innerText = `${currExpRel} / ${expNeededForLevel}`;
                }
            }, 500);
        }
        updateResourceHUD();
        updateOverworldEXPBar();
        overlay.classList.remove('hidden');

        if (hint) {
            if (btnContinue && !btnContinue.classList.contains('hidden')) {
                hint.innerText = "[F] CONTINUE";
            } else if (btnRestart && !btnRestart.classList.contains('hidden')) {
                hint.innerText = "[F] REINITIALIZE";
            }
        }
    }
}

function checkExistingSave() {
    const hasSave = localStorage.getItem('oddlabs_save_data');
    if (hasSave) {
        document.getElementById('btn-continue-game')?.classList.remove('hidden');
        const startBtn = document.getElementById('btn-start-overworld');
        if (startBtn) startBtn.innerText = "START NEW EXPERIMENT";
    }
}

function startOverworld() {
    showScreen('screen-overworld');
    resetGame(); // Ensure parties/stats are initialized for inventory
    Overworld.init();
    updateOverworldEXPBar();
}

window.triggerSlowTransition = triggerSlowTransition;
/**
 * Common utility for 0.6s slow fade transitions between major game states
 * @param {function} callback - Logic to execute while the screen is black
 */
async function triggerSlowTransition(callback) {
    const overlay = document.getElementById('zone-transition-overlay');
    if (!overlay) {
        if (callback) await callback();
        return;
    }

    // 1. Setup Slow Mode
    overlay.classList.add('slow-transition');
    overlay.classList.remove('hidden');
    void overlay.offsetWidth; // Force reflow
    overlay.classList.add('active');

    // 2. Wait for Fade-Out (0.6s)
    await new Promise(r => setTimeout(r, 600));

    // 3. Execute State Change
    if (callback) await callback();

    // 4. Buffer for rendering
    // Overworld.init has a 50ms timeout, so we wait 200ms total to be safe
    await new Promise(r => setTimeout(r, 200));

    // 5. Fade-In
    overlay.classList.remove('active');
    await new Promise(r => setTimeout(r, 600));

    // 6. Cleanup
    overlay.classList.add('hidden');
    overlay.classList.remove('slow-transition');
}

/**
 * Quick 0.3s fade transition for quest starts/fails
 * @param {function} callback - Logic to execute while the screen is black
 */
async function triggerQuickTransition(callback) {
    const overlay = document.getElementById('zone-transition-overlay');
    if (!overlay) {
        if (callback) await callback();
        return;
    }

    overlay.classList.remove('slow-transition');
    overlay.classList.remove('hidden');
    void overlay.offsetWidth; // Force reflow
    overlay.classList.add('active');

    // Wait for Fade-Out (0.3s)
    await new Promise(r => setTimeout(r, 300));

    if (callback) await callback();

    await new Promise(r => setTimeout(r, 100));

    overlay.classList.remove('active');
    await new Promise(r => setTimeout(r, 300));
    overlay.classList.add('hidden');
}

window.triggerSlowTransition = triggerSlowTransition;
window.triggerQuickTransition = triggerQuickTransition;

// --- AUDIO SYNC HELPERS ---
function syncAudioEngineWithSettings() {
    if (!gameState.settings) return;
    AudioManager.masterVolume = gameState.settings.masterVolume ?? 1.0;
    AudioManager.musicVolume = gameState.settings.musicVolume ?? 1.0;
    AudioManager.sfxVolume = gameState.settings.sfxVolume ?? 1.0;
    AudioManager.updateVolumes();
}

function updateAudioSettingsUI() {
    if (!gameState.settings) return;
    const master = document.getElementById('slider-master-volume');
    const music = document.getElementById('slider-music-volume');
    const sfx = document.getElementById('slider-sfx-volume');
    
    const mVal = Math.round(gameState.settings.masterVolume * 100);
    const muVal = Math.round(gameState.settings.musicVolume * 100);
    const sVal = Math.round(gameState.settings.sfxVolume * 100);

    if (master) master.value = mVal;
    if (music) music.value = muVal;
    if (sfx) sfx.value = sVal;
}


function showScreen(screenId) {
    const currentVisible = Array.from(document.querySelectorAll('.screen')).find(s => !s.classList.contains('hidden'));

    // Track previous screen for "back" functionality
    if (currentVisible && screenId !== currentVisible.id) {
        previousScreen = currentVisible.id;
    }

    // AUDIO: BGM Switching logic
    if (screenId === 'screen-main-menu') {
        AudioManager.playBGM('music_main_menu', 0.4);
    } else if (screenId === 'screen-overworld') {
        AudioManager.playBGM('music_overworld', 0.35);
    } else if (screenId === 'screen-battle') {
        AudioManager.playBGM('music_battle', 0.45);
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove('hidden');
}

function resetGame() {
    // 1. NPC Profile initialization (Character tabs)
    const npcIds = ['lana', 'dyzes', 'capsain', 'jenzi', 'npc01', 'npc02', 'npc03'];
    npcIds.forEach(profileId => {
        const profile = gameState.profiles[profileId];
        if (!profile) return;

        if (profile.party.length === 0) {
            profile.party = profile.team.map(id => createMonsterInstance(id));
        }
    });

    // 2. Cleanup state pollution
    catalystState.activeProfile = 'player';
    catalystState.activeMonsterIdx = 0;

    // 3. Player and Opponent initialization
    const pProfile = gameState.profiles.player;
    if (pProfile.party.length === 0) {
        pProfile.party = pProfile.team.map((id, idx) => {
            if (!id) return null;
            
            // Check for saved instance data (Efficiency, HP, PP, etc.)
            let existingData = null;
            if (gameState.playerPartyData && gameState.playerPartyData[idx]) {
                existingData = gameState.playerPartyData[idx];
            } else if (gameState.playerPartyEquips && gameState.playerPartyEquips[idx]) {
                // Fallback for older saves (equips only)
                existingData = { equippedCards: [...gameState.playerPartyEquips[idx]] };
            }

            const mon = createMonsterInstance(id, existingData);
            return mon;
        });
    }

    // Filter active squad slice (0,3) to remove nulls left by empty slots
    gameState.playerParty = pProfile.party.slice(0, 3).filter(m => m !== null);
    gameState.playerLevel = pProfile.level;
    syncCardsToLevel('player', gameState.playerLevel);

    const opponentId = catalystState.battleOpponentId || 'opponent';
    const oProfile = gameState.profiles[opponentId];

    if (oProfile.party.length === 0) {
        oProfile.party = oProfile.team.map(id => createMonsterInstance(id));
    }

    gameState.enemyParty = oProfile.party.slice(0, 3).filter(m => m !== null);

    // Robust level lookup: profile -> encounter data -> default 1
    let enemyLevel = oProfile.level;
    if (enemyLevel === undefined && typeof NPC_ENCOUNTERS !== 'undefined' && NPC_ENCOUNTERS[opponentId]) {
        enemyLevel = NPC_ENCOUNTERS[opponentId].rg === 'auto' ? (gameState.playerLevel ?? 1) : NPC_ENCOUNTERS[opponentId].rg;
    }
    gameState.enemyLevel = (enemyLevel ?? 1);

    syncCardsToLevel(opponentId, gameState.enemyLevel);

    // 2. Persistent HP/PP: Heal enemy, but NOT the player automatically
    applyBonuses(gameState.playerParty, gameState.playerLevel, false);
    applyBonuses(gameState.enemyParty, gameState.enemyLevel, true);

    // If player hasn't chosen a starter yet, skip battle setup
    if (gameState.playerParty.length === 0 || gameState.enemyParty.length === 0) {
        return;
    }

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
    gameState.isProcessing = true; // Lock interactions during deployment

    // Fail-safe: Unlock processing if entry sequence gets stuck
    setTimeout(() => {
        if (gameState.isProcessing && gameState.phase === 'NODE_SELECTION') {
            console.warn("Battle entry sequence fail-safe triggered. Releasing lock.");
            gameState.isProcessing = false;
            updateUI();
        }
    }, 4000);

    // Clear death visuals
    document.querySelectorAll('.dead-cell-container').forEach(c => c.remove());
    document.querySelectorAll('.monster-portrait').forEach(p => p.classList.remove('death-fade'));

    // Reset selection core to center and clear node states
    resetPositions();
    resetSelectorCore(true);

    // Force style reset for core in case of phase-specific CSS
    if (selectionCore) {
        selectionCore.style.transform = "translate(-50%, -50%)";
    }

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
    let entriesFinished = 0;
    const checkFinish = () => {
        entriesFinished++;
        if (entriesFinished === 2) {
            gameState.isProcessing = false; // Release lock after both are deployed
            updateUI();
        }
    };

    triggerBattleEntry('.player-display', () => {
        // Auto-flip monster card to show player monster after deployment
        updateBattleCard(gameState.player);
        checkFinish();
    });
    triggerBattleEntry('.enemy-display', checkFinish);
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
    portrait.classList.remove('anim-recall-exit', 'anim-monster-pop', 'anim-monster-breathing');
    void portrait.offsetWidth;

    // 2. Add Death Fade for a more impactful termination
    portrait.classList.add('death-fade');

    // 3. Monster Shrink (Starts slightly after fade)
    setTimeout(() => {
        portrait.classList.add('anim-recall-exit');
    }, 200);

    // 4. Container Capture (Bypass for Wild Encounters)
    // Check for any opponentId ending in _wild
    const isWild = (catalystState.battleOpponentId && catalystState.battleOpponentId.includes('_wild')) && displaySelector.includes('enemy');

    if (isWild) {
        setTimeout(() => {
            portrait.classList.remove('anim-recall-exit', 'death-fade');
            portrait.style.opacity = "0";
            portrait.style.transform = "scale(0)";
            if (callback) callback();
        }, 600); // Matches anim-recall-exit duration + delay
        return;
    }

    const container = document.createElement('div');
    container.className = 'dead-cell-container anim-container-capture';
    const containerImg = displaySelector.includes('player') ? 'CellContainer_Back.png' : 'CellContainer.png';
    container.innerHTML = `<img src="assets/images/${containerImg}">`;
    display.appendChild(container);

    // 5. Coordination
    setTimeout(() => {
        portrait.classList.remove('anim-recall-exit', 'death-fade');
        portrait.style.opacity = "0";
        portrait.style.transform = "scale(0)";
        container.remove();
        if (callback) callback();
    }, 1200); // Matches container-capture duration + delay
}


function triggerBattleEntry(displaySelector, callback) {
    const display = document.querySelector(displaySelector);
    const portrait = display?.querySelector('.monster-portrait');
    if (!display || !portrait) {
        if (callback) callback();
        return;
    }

    // 1. Reset Classes & Force Reflow
    portrait.classList.remove('anim-recall-exit', 'anim-monster-pop', 'anim-monster-breathing', 'death-fade');
    portrait.style.opacity = "0";
    portrait.style.transform = "scale(0)";
    void portrait.offsetWidth;

    // 2. Spawn CellContainer (Bypass for Wild Encounters)
    const isWild = (catalystState.battleOpponentId && catalystState.battleOpponentId.includes('_wild')) && displaySelector.includes('enemy');

    if (isWild) {
        portrait.style.opacity = "1";
        portrait.style.transform = "scale(1)";
        portrait.classList.add('anim-monster-pop');
        // In battle, we don't add anim-monster-breathing here because anim-attacker-float handles it during turn
        if (callback) callback();
        return;
    }

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
            // We NO LONGER add anim-monster-breathing here to fix the double-breathing bug.
            // Battle breathing is now handled exclusively by anim-attacker-float in updateUI.

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
    const profile = gameState.profiles[profileId];

    // Show ONLY monsters in index 3 onwards (The "Storage" part)
    // AND Exclude those currently in the Bio-Extract grid
    const monstersInGridIds = (window.gameState.bioExtractGrid || [])
        .filter(slot => slot !== null)
        .map(slot => slot.monster?.instanceId);

    const storageMonsters = profile.party.slice(3).filter(m =>
        m !== null && !monstersInGridIds.includes(m.instanceId)
    );

    if (storageMonsters.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-reserve-msg';
        emptyMsg.innerText = 'No Cells are home at the moment!';
        grid.appendChild(emptyMsg);
    }

    storageMonsters.forEach((monster) => {
        const partyIdx = profile.party.indexOf(monster);
        const name = monster.name;

        const icon = document.createElement('div');
        icon.className = 'monster-icon';
        icon.draggable = true;

        const imgName = name.charAt(0).toUpperCase() + name.slice(1);
        icon.innerHTML = `
            <img src="./assets/images/${imgName}.png" alt="${name}" onerror="this.src='./assets/images/Card_Placeholder.png'">
                    <div class="efficiency-badge">${monster.extractEfficiency ?? 0}</div>
        `;

        icon.ondragstart = (e) => {
            e.dataTransfer.setData('sourceStorageIdx', partyIdx);
            e.dataTransfer.setData('sourceSide', catalystState.activeSide);
        };

        // Click to preview/open card info
        icon.onclick = () => {
            openMonsterCard(monster.baseId || monster.name.toLowerCase());
        };

        grid.appendChild(icon);
    });

    // Handle dropping a slot monster back into storage
    grid.ondragover = (e) => e.preventDefault();
    grid.ondrop = (e) => {
        e.preventDefault();
        const sourceSlot = e.dataTransfer.getData('sourceSlot');
        const sourceSide = e.dataTransfer.getData('sourceSide');

        if (sourceSide !== catalystState.activeSide) return;
        if (sourceSlot === "") return;

        const slotIdx = parseInt(sourceSlot);
        removeMonsterFromSquad(slotIdx);
    };
}

/**
 * Universal helper to strip all equipment from a specific monster in a profile
 * and return those cards to the profile's box.
 */
function stripMonsterEquipment(profileId, partyIdx) {
    const profile = gameState.profiles[profileId];
    if (!profile) return;
    const monster = profile.party[partyIdx];
    if (!monster) return;

    const cardsToReturn = [...monster.equippedCards];

    cardsToReturn.forEach(ec => {
        profile.cardBox.push(ec.cardId);
    });

    monster.equippedCards = [];
    monster.currentPresetId = "";
}

window.removeMonsterFromSquad = (slotIdx) => {
    const profile = gameState.profiles[catalystState.activeProfile];
    const monster = profile.party[slotIdx];
    if (!monster) return;

    // Remove all equipment before banishing to cell storage
    stripMonsterEquipment(catalystState.activeProfile, slotIdx);

    // Push to the end of storage
    profile.party.push(monster);
    profile.team.push(profile.team[slotIdx]);

    // Nullify active slot
    profile.party[slotIdx] = null;
    profile.team[slotIdx] = null;

    // Shift view if we deleted the currently viewed monster
    if (catalystState.activeMonsterIdx === slotIdx) {
        const nextValidIdx = profile.party.findIndex((m, idx) => m !== null && idx < 3);
        catalystState.activeMonsterIdx = nextValidIdx !== -1 ? nextValidIdx : 0;
    }
    renderManagementHub();
};

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

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'monster-icon-wrapper';
            iconWrapper.style.position = 'relative';
            iconWrapper.style.width = '100%';
            iconWrapper.style.height = '100%';
            iconWrapper.style.display = 'flex';
            iconWrapper.style.alignItems = 'center';
            iconWrapper.style.justifyContent = 'center';

            iconWrapper.innerHTML = `
                <img src="./assets/images/${imgName}.png" alt="${monster.name}" onerror="this.src='./assets/images/Card_Placeholder.png'">
                <div class="efficiency-badge">${monster.extractEfficiency ?? 0}</div>
            `;
            slot.appendChild(iconWrapper);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove-monster btn-icon danger';
            removeBtn.innerHTML = 'X';
            removeBtn.title = 'Remove from Squad';
            removeBtn.onclick = (e) => {
                e.stopPropagation(); // Prevent selecting the slot as active
                removeMonsterFromSquad(idx);
            };
            slot.appendChild(removeBtn);

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
            const sourceStorageIdx = e.dataTransfer.getData('sourceStorageIdx');
            const sourceSlot = e.dataTransfer.getData('sourceSlot');
            const sourceSide = e.dataTransfer.getData('sourceSide');

            if (sourceSide !== catalystState.activeSide) {
                addLog("Cannot transfer Cells between different profiles.");
                return;
            }

            const activeProfile = gameState.profiles[catalystState.activeProfile];
            const targetParty = activeProfile.party;
            const targetTeam = activeProfile.team;

            if (sourceStorageIdx !== "") {
                // Swap from Storage to Active Slot
                const storageIdx = parseInt(sourceStorageIdx);
                const tempMonster = targetParty[idx];
                const tempSpecies = targetTeam[idx];

                targetParty[idx] = targetParty[storageIdx];
                targetTeam[idx] = targetTeam[storageIdx];

                if (tempMonster) {
                    // Standard swap
                    targetParty[storageIdx] = tempMonster;
                    targetTeam[storageIdx] = tempSpecies;
                    // Unequip the monster that was just moved TO storage
                    stripMonsterEquipment(catalystState.activeProfile, storageIdx);
                } else {
                    // Target was empty slot, slice out the source entirely so storage shrinks naturally
                    targetParty.splice(storageIdx, 1);
                    targetTeam.splice(storageIdx, 1);
                }

                addLog(`Redeployed ${targetParty[idx].name} to active squad.`);
            } else if (sourceSlot !== "") {
                // Swap between active slots
                const sourceIdx = parseInt(sourceSlot);
                const tempMonster = targetParty[idx];
                targetParty[idx] = targetParty[sourceIdx];
                targetParty[sourceIdx] = tempMonster;

                // Sync the species team array
                const tempSpecies = targetTeam[idx];
                targetTeam[idx] = targetTeam[sourceIdx];
                targetTeam[sourceIdx] = tempSpecies;
            }

            // Sync global gameState teams if it's player or currently active opponent
            if (catalystState.activeProfile === 'player') {
                gameState.playerTeam = [...targetTeam.slice(0, 3)];
                gameState.playerParty = [...targetParty.slice(0, 3)];
            } else if (catalystState.battleOpponentId === catalystState.activeProfile) {
                gameState.enemyTeam = [...targetTeam.slice(0, 3)];
                gameState.enemyParty = [...targetParty.slice(0, 3)];
            }

            renderManagementHub();
        };
    });
}

function updateCatalystBox() {
    const grid = document.getElementById('card-box-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Enable dropping on the grid (empty area) to unequip
    grid.ondragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    grid.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const slotSource = catalystState.dragSourceSlot;
        if (slotSource) {
            unequipCard(slotSource.monsterIdx, slotSource.slotIdx);
            addLog(`Module returned to inventory from slot ${slotSource.slotIdx}.`);
        }
    };

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
            const diff = rarityOrder[cardB.rarity] - rarityOrder[cardA.rarity];
            if (diff !== 0) return diff;
            return cardA.name.localeCompare(cardB.name);
        } else {
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
            const valDiff = infoA.val - infoB.val;
            if (valDiff !== 0) return valDiff;
            return cardA.name.localeCompare(cardB.name);
        }
    });

    const counts = {};
    box.forEach(id => counts[id] = (counts[id] || 0) + 1);

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

        item.onclick = () => openCardDetail(cardId);

        // Swap Logic: Dropping a slot card here equips this box card into that slot
        let dragCounter = 0; // Prevent flickering when moving over child elements
        item.ondragover = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        item.ondragenter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            item.classList.add('drag-over');
        };
        item.ondragleave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter <= 0) {
                item.classList.remove('drag-over');
                dragCounter = 0;
            }
        };
        item.ondrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            item.classList.remove('drag-over');
            dragCounter = 0;
            const slotSource = catalystState.dragSourceSlot;
            if (slotSource) {
                // FIXED: Explicitly unequip the old card first to ensure it returns to the box
                // before the new card (this box card) takes its place.
                unequipCard(slotSource.monsterIdx, slotSource.slotIdx, true);
                equipCard(slotSource.monsterIdx, slotSource.slotIdx, cardId);
                addLog(`Tactical Swap: ${CARDS[cardId].name} deployed to slot ${slotSource.slotIdx}.`);
            }
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
            catalystState.dragSourceSlot = null;
            catalystState.draggedCardId = null;
            catalystState.dragSourceProfile = null;
        };
        grid.appendChild(item);
    });
}

function updateCatalystCore() {
    const anchor = document.getElementById('slots-anchor');
    if (!anchor) return;

    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const monster = party[catalystState.activeMonsterIdx];
    const nameEl = document.getElementById('catalyst-monster-name');
    const presetCtrl = document.getElementById('preset-control');
    const presetSelector = document.getElementById('preset-selector');

    const level = profile.level;
    setSafe('#catalyst-monster-rg', 'textContent', `RG-${level}`);

    const hpPeek = document.getElementById('peek-hp');
    const ppPeek = document.getElementById('peek-pp');
    const atkPeek = document.getElementById('peek-atk');
    const defPeek = document.getElementById('peek-def');
    const spdPeek = document.getElementById('peek-spd');
    const crtPeek = document.getElementById('peek-crt');

    if (!monster) {
        if (nameEl) nameEl.textContent = 'SQUAD EMPTY';
        if (presetCtrl) presetCtrl.classList.add('hidden');
        document.getElementById('quick-equip-container')?.classList.add('hidden');
        document.getElementById('btn-quick-reset')?.classList.add('hidden');

        if (hpPeek) hpPeek.textContent = '--';
        if (ppPeek) ppPeek.textContent = '--';
        if (atkPeek) atkPeek.textContent = '--';
        if (defPeek) defPeek.textContent = '--';
        if (spdPeek) spdPeek.textContent = '--';
        if (crtPeek) crtPeek.textContent = '--';

        anchor.innerHTML = '';
        drawConnections([], null);
        return;
    }

    const resetBtn = document.getElementById('btn-quick-reset');

    // Always show Quick Equip tools for all profiles
    document.getElementById('quick-equip-container').classList.remove('hidden');
    if (resetBtn) resetBtn.classList.remove('hidden');

    presetCtrl.classList.remove('hidden');
    populatePresets(catalystState.activeProfile, monster.currentPresetId);

    // Toggle Custom Preset Actions
    const renameBtn = document.getElementById('btn-preset-rename');
    const deleteBtn = document.getElementById('btn-preset-delete');
    if (renameBtn && deleteBtn) {
        if (monster.currentPresetId && CUSTOM_PRESETS[monster.currentPresetId]) {
            renameBtn.classList.remove('hidden');
            deleteBtn.classList.remove('hidden');
        } else {
            renameBtn.classList.add('hidden');
            deleteBtn.classList.add('hidden');
        }
    }

    nameEl.textContent = monster.name;

    const stats = getModifiedStats(monster, level);

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

    const fmt = (base, modified) => {
        const bonus = modified - base;
        return bonus > 0 ? `${modified} (${base} + ${bonus})` : modified;
    };

    if (hpPeek) hpPeek.textContent = fmt(monster.maxHp, stats.maxHp);
    if (ppPeek) ppPeek.textContent = fmt(monster.maxPp, stats.maxPp);
    if (atkPeek) atkPeek.textContent = fmt(monster.atk, stats.atk);
    if (defPeek) defPeek.textContent = fmt(monster.def, stats.def);
    if (spdPeek) spdPeek.textContent = fmt(monster.spd, stats.spd);
    if (crtPeek) {
        const bonus = stats.crit - (monster.crit || 5);
        crtPeek.textContent = bonus > 0 ? `${stats.crit}% (${(monster.crit || 5)}% + ${bonus}%)` : `${stats.crit}%`;
    }

    anchor.innerHTML = '';
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
                catalystState.dragSourceProfile = catalystState.activeProfile;
                catalystState.dragSourceSlot = { monsterIdx: catalystState.activeMonsterIdx, slotIdx: idx };
                e.dataTransfer.setData('text/plain', equippedCard.cardId);
                // Highlight empty slots
                document.querySelectorAll('.catalyst-slot:not(.occupied)').forEach(s => s.classList.add('highlight'));
            };

            cardEl.ondragend = () => {
                document.querySelectorAll('.catalyst-slot').forEach(s => s.classList.remove('highlight'));
                catalystState.dragSourceSlot = null;
                catalystState.draggedCardId = null;
                catalystState.dragSourceProfile = null;
            };

            slotDiv.onclick = (e) => {
                if (e.ctrlKey) unequipCard(catalystState.activeMonsterIdx, idx);
                else openCardDetail(equippedCard.cardId);
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
    if (presetSelector) {
        presetSelector.onchange = (e) => {
            if (e.target.value) applyPreset(catalystState.activeProfile, e.target.value);
        };
    }
}

function populatePresets(profileId, currentPresetId = "") {
    const selector = document.getElementById('preset-selector');
    const profile = gameState.profiles[profileId];
    if (!selector || !profile) return;
    selector.innerHTML = '<option value="">-- CUSTOM --</option>';

    // Always ensure it's visible for NPCs (including RG 0)
    selector.parentElement.classList.remove('hidden');

    // 1. Load Custom Presets
    const optGroupCustom = document.createElement('optgroup');
    optGroupCustom.label = "Custom Presets";

    Object.keys(CUSTOM_PRESETS).forEach(key => {
        const preset = CUSTOM_PRESETS[key];
        // Custom presets currently don't use owner/level locking, they belong to the player
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `[C] ${preset.name} (RG-${preset.level})`;
        if (key === currentPresetId) opt.selected = true;
        optGroupCustom.appendChild(opt);
    });

    if (optGroupCustom.children.length > 0) {
        selector.appendChild(optGroupCustom);
    }

    // 2. Load Default / NPC Presets
    const optGroupNPC = document.createElement('optgroup');
    optGroupNPC.label = "Story Presets";

    Object.keys(NPC_PRESETS).forEach(key => {
        const preset = NPC_PRESETS[key];

        // FILTER: Only show character-specific presets to their owner, or generic ones to everyone
        if (preset.owner && !profileId.startsWith(preset.owner)) return;

        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${preset.name} (RG-${preset.level})`;

        // Disable if preset level is higher than current NPC RG (Player/Opponent restriction)
        if (profileId === 'player' || profileId === 'opponent') {
            if (preset.level > profile.level) {
                opt.disabled = true;
                opt.textContent += " [LOCKED]";
            }
        }

        const autoSelected = currentPresetId || profileId;
        if (key === autoSelected) opt.selected = true;
        optGroupNPC.appendChild(opt);
    });

    if (optGroupNPC.children.length > 0) {
        selector.appendChild(optGroupNPC);
    }
}

function applyPreset(profileId, presetId, silent = false) {
    const profile = gameState.profiles[profileId];
    const preset = CUSTOM_PRESETS[presetId] || NPC_PRESETS[presetId];
    if (!profile || !preset) return;

    // 1. UPDATE PROFILE LEVEL
    profile.level = preset.level;

    // 2. SET ABSOLUTE FAIRNESS MODE (Allows duplicate equipment for NPCs)
    profile.absoluteFairness = (profileId !== 'player');

    // 3. SYNC INVENTORY
    syncCardsToLevel(profileId, profile.level);

    // 4. SYNC SQUAD COMPOSITION
    const needsPartyInit = profile.party.length === 0 || JSON.stringify(profile.team) !== JSON.stringify(preset.team);
    if (preset.team && needsPartyInit) {
        profile.team = [...preset.team];
        profile.party = profile.team.map(id => id ? createMonsterInstance(id) : null);
        if (catalystState.activeMonsterIdx >= profile.party.length) {
            catalystState.activeMonsterIdx = 0;
        }
    }

    // 5. CLEAR & EQUIP
    const oldActiveProfile = catalystState.activeProfile;
    catalystState.activeProfile = profileId;
    profile.party.forEach((mon, mIdx) => {
        if (!mon) return;

        // Clear Existing (force full wipe for NPCs, Player already wipes via syncCardsToLevel implicitly mapping free inventory)
        mon.equippedCards = [];

        // Slot New
        const slotConfig = (preset.squadSlots && preset.squadSlots[mIdx]) ? preset.squadSlots[mIdx] : {};
        Object.entries(slotConfig).forEach(([slotIdx, cardId]) => {
            const idx = parseInt(slotIdx);

            // Check if card exists
            if (CARDS[cardId]) {
                const prevIdx = catalystState.activeMonsterIdx;
                catalystState.activeMonsterIdx = mIdx;

                // For the PLAYER profile, removing from physical inventory is required!
                if (profileId === 'player') {
                    const boxIndex = profile.cardBox.indexOf(cardId);
                    if (boxIndex > -1) {
                        profile.cardBox.splice(boxIndex, 1);
                        mon.equippedCards.push({ slotIndex: idx, cardId: cardId });
                    } else {
                        console.warn(`[PRESET LOAD] Missing card ${cardId} in inventory, skipping equip.`);
                    }
                } else {
                    // NPCs have infinite inventory for their specific static setups
                    mon.equippedCards.push({ slotIndex: idx, cardId: cardId });
                }

                catalystState.activeMonsterIdx = prevIdx;
            }
        });
        mon.currentPresetId = presetId;
    });

    catalystState.activeProfile = oldActiveProfile;
    if (!silent) {
        if (profileId === catalystState.activeProfile) {
            const activeRGInput = document.getElementById('debug-active-rg');
            if (activeRGInput) activeRGInput.value = profile.level;
        }
        addLog(`Protocol Loaded: Preset "${preset.name}" applied @RG-${preset.level}.`);
        renderManagementHub();
    }
}

function executeQuickEquip(style, profileId = null, targetMonsterIdx = null) {
    const pId = profileId || catalystState.activeProfile;
    const profile = gameState.profiles[pId];
    const monsterIdx = targetMonsterIdx !== null ? targetMonsterIdx : catalystState.activeMonsterIdx;
    const monster = profile.party[monsterIdx];
    if (!profile || !monster) return;

    // Save old active state to restore later
    const oldActiveProfile = catalystState.activeProfile;
    const oldActiveMonsterIdx = catalystState.activeMonsterIdx;

    // Temporarily switch context for clearEquippedCards and equipCard
    catalystState.activeProfile = pId;
    catalystState.activeMonsterIdx = monsterIdx;

    // 0. RESET DRAG STATE
    catalystState.dragSourceSlot = null;
    catalystState.draggedCardId = null;
    catalystState.dragSourceProfile = null;

    // 1. CLEAR NON-LEADER EQUIPMENT
    clearEquippedCards(true, true);

    // 2. DEFINE STYLE WEIGHTS
    const weights = {
        aggressive: { atk: 10, crit: 5, spd: 3, hp: 1, def: 1, pp: 1 },
        survival: { hp: 10, def: 10, spd: 2, atk: 1, crit: 1, pp: 1 },
        utility: { pp: 10, spd: 8, def: 5, hp: 5, atk: 1, crit: 1 },
        balanced: { atk: 5, def: 5, hp: 5, spd: 5, pp: 3, crit: 2 }
    };

    const styleWeight = weights[style] || weights.balanced;

    // Score function for a card
    const scoreCard = (card) => {
        let score = 0;
        if (!card.stats) return 0;
        Object.entries(card.stats).forEach(([stat, val]) => {
            score += (val * (styleWeight[stat] || 1));
        });
        if (card.slots > 0) score += (card.slots * 50);
        return score;
    };

    // 3. SORT CARD BOX
    let availableCards = [...profile.cardBox]
        .filter(id => !CARDS[id]?.isLeader)
        .map(id => ({ id, card: CARDS[id], score: scoreCard(CARDS[id]) }));

    availableCards.sort((a, b) => {
        const tierMap = { '3': 3, '2': 2, '1': 1 };
        const tierA = tierMap[a.card.tier] || 0;
        const tierB = tierMap[b.card.tier] || 0;
        if (tierA !== tierB) return tierB - tierA;
        return b.score - a.score;
    });

    // 4. RECURSIVE FILLING
    const fillSlots = (slotIdx) => {
        const isOccupied = monster.equippedCards.some(ec => ec.slotIndex === slotIdx);
        if (isOccupied) return true;

        for (let i = 0; i < availableCards.length; i++) {
            const candidate = availableCards[i];
            const success = equipCard(monsterIdx, slotIdx, candidate.id, true, true);
            if (success) {
                const cardIdToRemove = candidate.id;
                availableCards = availableCards.filter(c => c.id !== cardIdToRemove);
                const currentLayout = calculateSlotLayout(monster);
                const currentSlot = currentLayout[slotIdx];
                if (currentSlot && currentSlot.children) {
                    currentSlot.children.forEach(child => {
                        fillSlots(child.id);
                    });
                }
                return true;
            }
        }
        return false;
    };

    [0, 1, 2].forEach(slotIdx => fillSlots(slotIdx));

    // Restore state
    catalystState.activeProfile = oldActiveProfile;
    catalystState.activeMonsterIdx = oldActiveMonsterIdx;

    if (profileId === null || profileId === catalystState.activeProfile) {
        const tiers = monster.equippedCards.reduce((acc, ec) => {
            const card = CARDS[ec.cardId];
            if (card && !card.isLeader) acc[card.tier] = (acc[card.tier] || 0) + 1;
            return acc;
        }, {});
        const tierSummaries = Object.entries(tiers)
            .sort((a, b) => b[0] - a[0])
            .map(([t, count]) => `<span class="tier-label tier-${t}">T${t}</span>x${count}`)
            .join(' ');

        addLog(`Neural Calibration Complete: <span class="tactical">${style.toUpperCase()}</span> protocol applied to ${monster.name}. Allocation: ${tierSummaries || 'None'}`);
        renderManagementHub();
    }
}

function calculateSlotLayout(monster) {
    // 1. Initialize 3 base slots
    let slots = [
        { id: 0, parent: -1, level: 0, children: [] },
        { id: 1, parent: -1, level: 0, children: [] },
        { id: 2, parent: -1, level: 0, children: [] }
    ];

    // 2. Build the tree structure based on equipment and capacity
    // We want to ensure that if a preset defines a slot, it exists even if empty
    let currentIndex = 0;
    while (currentIndex < slots.length && slots.length < 10) {
        const equipped = monster.equippedCards.find(ec => ec.slotIndex === currentIndex);
        // Also check if ANY card was EVER equipped here, or if it's a base slot
        // For simplicity: if it has an equipped card, add its children.
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
            parent: node.parent,
            children: node.children
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

function equipCard(monsterIdx, slotIdx, cardId, silent = false, fromPreset = false) {
    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const monster = party[monsterIdx];
    const card = CARDS[cardId];

    // Allowed move: If dragging from a slot on the SAME monster, skip duplicate check
    const isInternalMove = catalystState.dragSourceSlot &&
        catalystState.dragSourceSlot.monsterIdx === monsterIdx &&
        catalystState.dragSourceProfile === catalystState.activeProfile;

    const hasDuplicate = monster.equippedCards.some(ec => ec.cardId === cardId);
    if (!isInternalMove && hasDuplicate && !profile.absoluteFairness) {
        if (!silent) addLog("Cannot equip duplicate cards on same Cell.");
        return;
    }

    // Manual change clears the preset
    if (!fromPreset) {
        monster.currentPresetId = "";
    }

    // Capture source before we potentially clear it via unequip
    const srcSlot = catalystState.dragSourceSlot;
    const srcProfile = catalystState.dragSourceProfile || catalystState.activeProfile;

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
    if (!silent) renderManagementHub();
    return true;
}

function unequipCard(monsterIdx, slotIdx, silent = false) {
    const profile = gameState.profiles[catalystState.activeProfile];
    const party = profile.party;
    const monster = party[monsterIdx];
    const index = monster.equippedCards.findIndex(ec => ec.slotIndex === slotIdx);
    if (index === -1) return;

    monster.currentPresetId = "";
    const removed = monster.equippedCards.splice(index, 1)[0];
    profile.cardBox.push(removed.cardId);

    processRecursiveRemoval(monster, slotIdx);
    if (!silent) renderManagementHub();
    return true;
}

function clearEquippedCards(silent = false, keepLeaders = false) {
    const profile = gameState.profiles[catalystState.activeProfile];
    const monsterIdx = catalystState.activeMonsterIdx;
    const monster = profile.party[monsterIdx];
    if (!profile || !monster) return;

    // 1. Clear current equipment
    const currentlyEquipped = [...monster.equippedCards];
    currentlyEquipped.forEach(ec => {
        const isLeader = CARDS[ec.cardId]?.isLeader;
        if (keepLeaders && isLeader) return; // Preservation logic
        unequipCard(monsterIdx, ec.slotIndex, true);
    });

    // 2. Full State Refresh: Clear preset ID and Resync Box to current level
    monster.currentPresetId = "";
    syncCardsToLevel(catalystState.activeProfile, profile.level);

    if (!silent) {
        addLog(`<span class="tactical">SYSTEM RECALIBRATED:</span> ${monster.name} hardware reset and inventory synchronized to RG-${profile.level}.`);
        renderManagementHub();
    }
}

function processRecursiveRemoval(monster, parentSlotIdx) {
    const profile = gameState.profiles[catalystState.activeProfile];
    if (!profile) return;

    const newPositions = calculateSlotLayout(monster);
    const validIndices = new Set(newPositions.map((_, i) => i));
    const box = profile.cardBox;

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

    // NPCs should always default to their ID as the preset if it exists
    const defaultPresetId = NPC_PRESETS[id] ? id : "";
    const currentPresetId = existing ? existing.currentPresetId : defaultPresetId;

    const monster = {
        ...data,
        id: id,
        instanceId: existing ? existing.instanceId : 'mon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        currentNode: null,
        blockedNodes: [],
        equippedCards: existing ? [...existing.equippedCards] : [],
        hp: existing && existing.hp !== undefined ? existing.hp : data.hp,
        pp: existing && existing.pp !== undefined ? existing.pp : 1,
        turnCount: 0,
        selectedMove: data.moves[0].id,
        currentPresetId: currentPresetId,
        extractEfficiency: existing ? (existing.extractEfficiency || 0) : 0
    };
    return monster;
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
    document.getElementById('detail-card-tier').textContent = `TIER ${card.tier} `;

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
        < div class="detail-stat-label" > ${stat}</div >
            <div class="detail-stat-value">+${val}</div>
    `;
            statsGrid.appendChild(item);
        });
    }

    if (card.slots > 0) {
        const item = document.createElement('div');
        item.className = 'detail-stat-item';
        item.innerHTML = `
        < div class="detail-stat-label" > Extra Slots</div >
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

/**
 * Pre-applies Catalyst Bonuses and heals monsters to their modified max health.
 * Used during battle start and roster initialization.
 */
function applyBonuses(party, level, forceHeal = true) {
    if (!party) return;
    party.forEach(monster => {
        if (!monster) return;

        // BUG FIX: Create a snapshot of 'base' stats if they don't exist 
        // This ensures getModifiedStats has a static starting point for non-registered monsters.
        if (monster.id && !MONSTERS[monster.id]) {
            if (monster.baseHp === undefined) {
                monster.baseHp = monster.hp || 100;
                monster.baseAtk = monster.atk || 10;
                monster.baseDef = monster.def || 10;
                monster.baseSpd = monster.spd || 10;
                monster.baseCrit = monster.crit || 5;
                monster.baseMaxPp = monster.maxPp || 10;
            }
        }

        const mod = getModifiedStats(monster, level);

        // Conditional heal based on modified max HP
        if (forceHeal) {
            monster.hp = mod.maxHp;
            monster.pp = 1; // Reset to default state as per user request
        } else {
            // Ensure HP doesn't exceed new modified max
            if (monster.hp > mod.maxHp) monster.hp = mod.maxHp;
        }

        // Sync limits to instance for UI display, but don't overwrite base stats
        monster.maxHp = mod.maxHp;
        monster.maxPp = mod.maxPp;
        if (monster.pp > mod.maxPp) monster.pp = mod.maxPp;
    });
}

/**
 * INCUBATOR SYSTEM
 */
window.openIncubatorMenu = function () {
    incubatorInputReady = false;
    setTimeout(() => { incubatorInputReady = true; }, 250);
    const party = gameState.profiles.player.party;
    const hasMonsters = party.some(m => m !== null);

    if (!hasMonsters) {
        if (typeof Overworld !== 'undefined') {
            Overworld.showDialogue("Incubator Unit", ["No biological signatures detected.", "Please insert a cell for maintenance."]);
        }
        return;
    }

    // Pause overworld and blur
    if (typeof Overworld !== 'undefined') {
        Overworld.isPaused = true;
        document.getElementById('overworld-viewport')?.classList.add('blur-overlay');
    }

    // Show menu directly (avoiding showScreen which hides overworld)
    document.getElementById('screen-incubator-menu')?.classList.remove('hidden');

    // Initialize keyboard selection
    window.selectedIncubatorIndex = 0;
    updateIncubatorSelection();
};

function updateIncubatorSelection() {
    const menu = document.getElementById('screen-incubator-menu');
    if (!menu || menu.classList.contains('hidden')) return;

    const buttons = menu.querySelectorAll('.btn-neon');
    buttons.forEach((btn, index) => {
        if (index === window.selectedIncubatorIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

function closeIncubatorMenu() {
    document.getElementById('screen-incubator-menu').classList.add('hidden');
    document.getElementById('overworld-viewport')?.classList.remove('blur-overlay');
    if (typeof Overworld !== 'undefined') Overworld.isPaused = false;
}

async function startHealSequence() {
    // Hide menu without removing blur
    document.getElementById('screen-incubator-menu').classList.add('hidden');

    const healScreen = document.getElementById('screen-incubator-heal');
    healScreen.classList.remove('hidden');

    const statusText = document.getElementById('heal-status-text');
    const scanLine = document.getElementById('heal-scan-line');
    statusText.textContent = "INITIALIZING BIO-SYNC...";

    // Clear previous state
    const slots = document.querySelectorAll('.heal-slot');
    slots.forEach(s => {
        s.classList.remove('active');
        s.removeAttribute('data-monster');
        const bar = s.querySelector('.heal-stat-bar');
        bar.classList.remove('charged');
        s.querySelector('.heal-fill').style.width = '0%';
        s.querySelector('.slot-portrait').classList.remove('anim-monster-pop');
    });

    await new Promise(r => setTimeout(r, 600));

    // 1. Load Monsters into slots
    const party = gameState.profiles.player.party;
    for (let i = 0; i < 3; i++) {
        const monster = party[i];
        if (monster) {
            const slot = slots[i];
            const portrait = slot.querySelector('.slot-portrait');

            // Use tileset mapping via data attribute
            slot.setAttribute('data-monster', monster.id);

            slot.classList.add('active');
            portrait.classList.add('anim-monster-pop');
            await new Promise(r => setTimeout(r, 300));
        }
    }

    statusText.textContent = "SCANNING BIOLOGICAL SIGNATURES...";
    await new Promise(r => setTimeout(r, 600));

    // 2. Start Scan Animation
    scanLine.classList.add('animate-heal-scan');

    // 3. Dynamic Filling (Battery metaphor)
    for (let i = 0; i < 3; i++) {
        const monster = party[i];
        if (!monster) continue;

        // Punchy timing: wait for scan line to sweep
        await new Promise(r => setTimeout(r, 600));

        statusText.textContent = `RESTORING: ${monster.id.toUpperCase()}...`;
        const slot = slots[i];
        const fill = slot.querySelector('.heal-fill');
        const bar = slot.querySelector('.heal-stat-bar');

        fill.style.width = '100%';
        bar.classList.add('charged'); // Changes background to green

        // Actual state restoration
        const mod = getModifiedStats(monster, gameState.profiles.player.level);
        monster.hp = mod.maxHp;
        monster.pp = 1; // Reset to default starting PP
    }

    await new Promise(r => setTimeout(r, 800));
    scanLine.classList.remove('animate-heal-scan');
    statusText.textContent = "MAINTENANCE COMPLETE. ALL CELLS STABILIZED.";
    statusText.style.color = "#00ff88";

    await new Promise(r => setTimeout(r, 1500));

    // Final cleanup and return to overworld
    healScreen.classList.add('hidden');
    statusText.style.color = ""; // Reset color

    if (typeof Overworld !== 'undefined') {
        document.getElementById('overworld-viewport')?.classList.remove('blur-overlay');
        Overworld.isPaused = false;
        Overworld.isTransitioning = false;
        // No need to showScreen('screen-overworld') as it was never hidden
    }
}

// Final Initialization
/**
 * Executes a high-quality startup sequence for the game:
 * 1. Shows company logo splash with fade in/out
 * 2. Slides in background parallax layers
 * 3. Fades in Main Menu UI
 */
function playStartupSequence() {
    const splash = document.getElementById('splash-screen');
    const splashContent = splash?.querySelector('.splash-content');
    const menuScreen = document.getElementById('screen-main-menu');
    const menuUI = document.getElementById('menu-ui-container');

    if (!splash || !menuScreen) {
        showScreen('screen-main-menu');
        return;
    }

    // Phase 0: Initial State
    splash.classList.remove('hidden');
    splash.style.opacity = '1';

    // Phase 1: Splash Logo Fade In
    setTimeout(() => {
        splashContent?.classList.add('visible');

        // Phase 2: Fade out Logo FIRST
        setTimeout(() => {
            splashContent?.classList.remove('visible');

            // Wait for logo to fade (200ms) before removing the black background
            setTimeout(() => {
                splash.style.opacity = '0';

                // Overlap: Start revealing the menu behind the fading splash
                showScreen('screen-main-menu');

                // Phase 3: Immediate Background Slide-in & UI Reveal
                setTimeout(() => {
                    menuScreen.classList.add('bg-active');

                    // Reveal UI with a longer delay (500ms) to allow BGs to start sliding
                    setTimeout(() => {
                        menuUI?.classList.add('show');
                        initMainMenuParallax();
                    }, 500);
                }, 50);

                // Phase 4: Finalize Splash Removal in background
                setTimeout(() => {
                    splash.classList.add('hidden');
                }, 800);
            }, 200);
        }, 1800); // Time logo stays fully visible
    }, 300); // Initial delay
}

/**
 * Tracks mouse movement to shift parallax background layers
 */
function initMainMenuParallax() {
    const menuScreen = document.getElementById('screen-main-menu');
    if (!menuScreen || menuScreen._parallaxApplied) return;
    menuScreen._parallaxApplied = true;

    window.addEventListener('mousemove', (e) => {
        if (!menuScreen.classList.contains('hidden')) {
            // Normalized mouse position (-1 to 1)
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;

            menuScreen.style.setProperty('--move-x', nx.toFixed(3));
            menuScreen.style.setProperty('--move-y', ny.toFixed(3));
        }
    });

    // --- Breathing Animation Loop ---
    let startTime = Date.now();
    function animateBreathing() {
        if (!menuScreen.classList.contains('hidden')) {
            const time = (Date.now() - startTime) / 1000;
            // Even faster and more pronounced circular drifting motion
            const bx = Math.sin(time / 1.0) * 0.20;
            const by = Math.cos(time / 1.3) * 0.15;

            menuScreen.style.setProperty('--breath-x', bx.toFixed(3));
            menuScreen.style.setProperty('--breath-y', by.toFixed(3));
        }
        requestAnimationFrame(animateBreathing);
    }
    animateBreathing();
}

window.addEventListener('load', init);

// --- RESOURCE HUD & SHOP LOGIC ---
window.updateResourceHUD = function () {
    const lcVal = document.getElementById('hud-lc-val');
    const bmVal = document.getElementById('hud-bm-val');
    const rgVal = document.getElementById('overworld-rg-val');
    const logCount = document.getElementById('log-count');

    if (lcVal) lcVal.innerText = gameState.credits || 0;
    if (bmVal) bmVal.innerText = gameState.biomass || 0;
    if (rgVal) rgVal.innerText = (gameState.playerLevel ?? (gameState.profiles && gameState.profiles.player ? gameState.profiles.player.level : 1));

    if (logCount && typeof Overworld !== 'undefined') {
        logCount.innerText = Overworld.logsCollected.length;
    }
}

window.openShopMenu = function () {
    shopInputReady = false;
    setTimeout(() => { shopInputReady = true; }, 250);
    const shopScreen = document.getElementById('screen-shop');
    if (!shopScreen) return;

    shopScreen.classList.remove('hidden');
    Overworld.isPaused = true;
    shopState.activeTab = 'buy';
    shopState.selectedItemId = null;

    updateShopUI();
};

// --- MONSTER SYNTHESIS SYSTEM ---

let selectedSynthesisMonster = null;

window.openSynthesisMenu = function () {
    synthInputReady = false;
    setTimeout(() => { synthInputReady = true; }, 250);
    const synthesisScreen = document.getElementById('screen-synthesis');
    if (!synthesisScreen) return;

    synthesisScreen.classList.remove('hidden');

    // Update Biomass balance
    const bmBalance = document.getElementById('synthesis-bm-balance');
    if (bmBalance) bmBalance.textContent = gameState.biomass;

    renderSynthesisItems();

    // Default selection
    if (SYNTHESIS_RECIPES.length > 0) {
        selectSynthesisItem(SYNTHESIS_RECIPES[0]);
    }

    if (typeof Overworld !== 'undefined') {
        Overworld.isPaused = true;
        document.getElementById('overworld-viewport')?.classList.add('blur-overlay');
    }
};

function canAffordSynthesis(recipe) {
    if (!recipe || !recipe.requirements) return false;
    return recipe.requirements.every(req => {
        let current = 0;
        if (req.type === 'resource') {
            current = gameState[req.id] || 0;
        } else if (req.type === 'item') {
            current = (gameState.items || []).filter(i => i === req.id).length;
        }
        return current >= req.amount;
    });
}

function canAffordShopItem(item, mode) {
    if (!item) return false;
    if (mode === 'buy') {
        const price = item.price || 0;
        return gameState.credits >= price;
    } else {
        // Sell tab: Only biomass is sellable for now
        if (item.id === 'biomass') return gameState.biomass > 0;
        return false;
    }
}

function renderSynthesisItems() {
    const listEl = document.getElementById('synthesis-item-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    SYNTHESIS_RECIPES.forEach(recipe => {
        const isSelected = selectedSynthesisMonster && selectedSynthesisMonster.id === recipe.id;
        const card = document.createElement('div');
        card.className = `shop-item-card ${isSelected ? 'selected' : ''}`;
        card.dataset.id = recipe.id;

        const canAfford = canAffordSynthesis(recipe);
        const btnClass = canAfford ? 'active' : 'locked';
        const displayEfficiency = 0; // Placeholder for expansion
        
        card.innerHTML = `
            <div class="shop-item-info">
                <div class="shop-item-icon ${recipe.iconClass}">
                    <div class="efficiency-badge">${displayEfficiency}</div>
                </div>
                <div class="shop-item-name">${recipe.name}</div>
            </div>
            <button class="shop-item-price-btn synthesis ${btnClass}">
                ${canAfford ? 'INITIALIZE' : 'Missing Resource'}
            </button>
        `;

        // Card click selects the item
        card.addEventListener('click', () => selectSynthesisItem(recipe));

        // Button click triggers synthesis if affordable
        const actionBtn = card.querySelector('.shop-item-price-btn');
        actionBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent re-selecting card
            selectSynthesisItem(recipe); // Still select it to show requirements
            
            if (canAfford) {
                document.getElementById('synthesis-confirm-modal')?.classList.remove('hidden');
            }
        });

        listEl.appendChild(card);
    });
}

function selectSynthesisItem(recipe) {
    selectedSynthesisMonster = recipe;

    // Update highlights
    const cards = document.querySelectorAll('#synthesis-item-list .shop-item-card');
    cards.forEach((c, idx) => {
        if (SYNTHESIS_RECIPES[idx].id === recipe.id) c.classList.add('selected');
        else c.classList.remove('selected');
    });

    // Update Detail Panel
    const nameEl = document.getElementById('synthesis-detail-name');
    const descEl = document.getElementById('synthesis-detail-desc');
    const iconEl = document.getElementById('synthesis-detail-icon');

    if (nameEl) nameEl.textContent = recipe.name;
    if (descEl) descEl.textContent = recipe.description;

    if (iconEl) {
        iconEl.className = 'shop-detail-img ' + recipe.iconClass;
        iconEl.innerHTML = `<div class="efficiency-badge">0</div>`;
    }

    updateSynthesisRequirements(recipe);
}

function updateSynthesisRequirements(recipe) {
    const reqListEl = document.getElementById('synthesis-requirement-list');
    if (!reqListEl) return;
    reqListEl.innerHTML = '';

    let allMet = true;

    recipe.requirements.forEach(req => {
        const item = document.createElement('div');
        item.className = 'requirement-item';

        let current = 0;
        if (req.type === 'resource') {
            current = gameState[req.id] || 0;
        } else if (req.type === 'item') {
            current = (gameState.items || []).filter(i => i === req.id).length;
        }

        const isMet = current >= req.amount;
        if (!isMet) allMet = false;

        item.classList.add(isMet ? 'met' : 'missing');
        item.innerHTML = `
            <span>${req.name}</span>
            <span class="requirement-val">${current}/${req.amount}</span>
        `;
        reqListEl.appendChild(item);
    });
}

document.getElementById('btn-synthesis-action')?.addEventListener('click', () => {
    if (selectedSynthesisMonster) {
        document.getElementById('synthesis-confirm-modal')?.classList.remove('hidden');
    }
});

document.getElementById('btn-synthesis-confirm')?.addEventListener('click', () => {
    if (selectedSynthesisMonster) {
        handleSynthesis(selectedSynthesisMonster.id);
        document.getElementById('synthesis-confirm-modal')?.classList.add('hidden');
    }
});

document.getElementById('btn-synthesis-cancel')?.addEventListener('click', () => {
    document.getElementById('synthesis-confirm-modal')?.classList.add('hidden');
});

document.getElementById('btn-synthesis-close')?.addEventListener('click', () => {
    document.getElementById('screen-synthesis')?.classList.add('hidden');
    if (typeof Overworld !== 'undefined') {
        Overworld.isPaused = false;
        document.getElementById('overworld-viewport')?.classList.remove('blur-overlay');
    }
});

async function handleSynthesis(monsterId) {
    const recipe = SYNTHESIS_RECIPES.find(r => r.id === monsterId);
    if (!recipe) return;

    // Final check
    let allMet = true;
    recipe.requirements.forEach(req => {
        let current = 0;
        if (req.type === 'resource') current = gameState[req.id] || 0;
        else if (req.type === 'item') current = (gameState.items || []).filter(i => i === req.id).length;
        if (current < req.amount) allMet = false;
    });

    if (!allMet) return;

    // Consume requirements
    recipe.requirements.forEach(req => {
        if (req.type === 'resource') {
            gameState[req.id] -= req.amount;
        } else if (req.type === 'item') {
            for (let i = 0; i < req.amount; i++) {
                const idx = gameState.items.indexOf(req.id);
                if (idx > -1) gameState.items.splice(idx, 1);
            }
        }
    });

    if (window.updateResourceHUD) window.updateResourceHUD();

    // Add Monster using the official constructor
    const newMonster = createMonsterInstance(monsterId);
    const pProfile = gameState.profiles.player;

    // Determine if it should be marked as going to Squad or Storage
    // The first 3 slots (0-2) are considered the Active Squad.
    const destination = pProfile.party.length < 3 ? 'ACTIVE SQUAD' : 'CATALYST BOX';

    // Always push to the player's underlying party/team arrays
    pProfile.party.push(newMonster);
    pProfile.team.push(monsterId);

    // --- QUEST PROGRESSION HOOK ---
    if (typeof Overworld !== 'undefined') {
        Overworld.updateQuestProgress('synthesis', monsterId);
    }

    // Animation
    await startSynthesisAnimation(monsterId, destination);
}

async function startSynthesisAnimation(monsterId, destination) {
    document.getElementById('screen-synthesis')?.classList.add('hidden');
    const animScreen = document.getElementById('screen-synthesis-animation');
    if (!animScreen) return;

    animScreen.classList.remove('hidden');

    const statusText = document.getElementById('synthesis-status-text');
    const scanLine = document.getElementById('synthesis-scan-line');
    const cellReveal = document.getElementById('synthesis-cell-reveal');

    if (!cellReveal) return;

    const monsterData = MONSTERS[monsterId];
    cellReveal.style.backgroundImage = `url(./assets/images/${monsterData.id.charAt(0).toUpperCase() + monsterData.id.slice(1)}.png)`;

    // EXPLICIT RESET of visibility and animation state before starting
    cellReveal.classList.remove('animate-synthesis-reveal', 'synthesis-complete', 'synthesis-glitch');
    if (scanLine) {
        scanLine.classList.remove('animate-synthesis-scan');
        scanLine.style.opacity = '0';
    }

    const container = document.getElementById('synthesis-anim-container');

    if (statusText) statusText.textContent = "ESTABLISHING NEURAL LINK...";
    await new Promise(r => setTimeout(r, 800));

    if (statusText) statusText.textContent = "MOLDING BIOLOGICAL ARCHITECTURE...";
    await new Promise(r => setTimeout(r, 600));

    // Start 3D Print with effects
    if (container) container.classList.add('synthesis-shake');
    if (cellReveal) cellReveal.classList.add('synthesis-glitch');
    if (scanLine) scanLine.classList.add('animate-synthesis-scan');
    cellReveal.classList.add('animate-synthesis-reveal');
    if (statusText) statusText.textContent = "SYNTHESIZING CELLULAR MEMBRANE...";

    await new Promise(r => setTimeout(r, 3000));

    // Complete Sequence
    if (container) container.classList.remove('synthesis-shake');
    if (cellReveal) {
        cellReveal.classList.remove('synthesis-glitch');
        cellReveal.classList.remove('animate-synthesis-reveal');
        cellReveal.classList.add('synthesis-complete');
    }
    if (scanLine) {
        scanLine.classList.remove('animate-synthesis-scan');
        scanLine.style.opacity = '0'; // Explicit hide
    }

    // Create Flash
    const flash = document.createElement('div');
    flash.className = 'synthesis-flash';
    animScreen.appendChild(flash);
    setTimeout(() => flash.remove(), 1000);

    if (statusText) {
        statusText.textContent = "STABILIZATION COMPLETE. UNIT READY.";
        statusText.style.color = "#00ff88";
    }

    await new Promise(r => setTimeout(r, 1000));

    // Cleanup
    animScreen.classList.add('hidden');
    if (statusText) statusText.style.color = "";

    // Show Acquisition Modal
    if (window.showItemPickupModal) {
        const pickupId = 'monster_' + monsterId;
        window.ITEM_PICKUP_DATA[pickupId] = {
            name: monsterData.name.toUpperCase(),
            desc: `Synthesized successfully!\nWelcome to the Lab my friend!`,
            spriteClass: monsterId,
            type: 'monster'
        };
        window.showItemPickupModal(pickupId);
    }

    if (typeof Overworld !== 'undefined') {
        Overworld.isPaused = false;
        document.getElementById('overworld-viewport')?.classList.remove('blur-overlay');
    }
}

function updateShopUI() {
    const buyBtn = document.querySelector('.shop-tab-btn[data-tab="buy"]');
    const sellBtn = document.querySelector('.shop-tab-btn[data-tab="sell"]');

    if (shopState.activeTab === 'buy') {
        buyBtn?.classList.add('active');
        sellBtn?.classList.remove('active');
    } else {
        buyBtn?.classList.remove('active');
        sellBtn?.classList.add('active');
    }

    // Sync balances
    const lcBalance = document.getElementById('shop-lc-balance');
    const bmBalance = document.getElementById('shop-bm-balance');
    if (lcBalance) lcBalance.innerText = gameState.credits;
    if (bmBalance) bmBalance.innerText = gameState.biomass;

    renderShopItems();
    updateResourceHUD();
}

function renderShopItems() {
    const listEl = document.getElementById('shop-item-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (shopState.activeTab === 'buy') {
        Object.values(SHOP_ITEMS).forEach(item => {
            if (item.oneTime && gameState.items.includes(item.id)) return;

            const card = createShopItemCard(item, item.price, 'LC');
            listEl.appendChild(card);
        });
    } else {
        if (gameState.biomass > 0) {
            const item = SHOP_ITEMS['biomass'];
            const card = createShopItemCard(item, item.sellPrice, 'LC');
            listEl.appendChild(card);
        } else {
            listEl.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.4); text-align: center;">There is nothing to sell!</div>';
        }
    }

    if (!shopState.selectedItemId && listEl.children.length > 0) {
        const firstId = listEl.children[0].dataset.id;
        if (firstId) selectShopItem(firstId);
    } else if (listEl.children.length === 0) {
        clearShopDetail();
    }
}

function createShopItemCard(item, price, currency) {
    const div = document.createElement('div');
    const isSelected = shopState.selectedItemId === item.id;
    div.className = `shop-item-card ${isSelected ? 'selected' : ''}`;
    div.dataset.id = item.id;

    const isSell = shopState.activeTab === 'sell';
    const canAfford = canAffordShopItem(item, shopState.activeTab);
    
    let btnText;
    if (canAfford) {
        btnText = isSell ? `SELL (${price})` : `${price} LC`;
    } else {
        btnText = "Missing Resource";
    }
    
    const btnClass = isSell ? 'sell' : '';
    const statusClass = canAfford ? 'active' : 'locked';

    div.innerHTML = `
        <div class="shop-item-info">
            <div class="shop-item-icon ${item.iconClass || ''}">${item.icon || ''}</div>
            <div class="shop-item-name">${item.name}</div>
        </div>
        <button class="shop-item-price-btn ${btnClass} ${statusClass}">${btnText}</button>
    `;

    div.addEventListener('click', () => selectShopItem(item.id));

    const actionBtn = div.querySelector('.shop-item-price-btn');
    actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectShopItem(item.id);
        if (canAfford) {
            openQuantityModal(item, shopState.activeTab);
        }
    });

    return div;
}

function openQuantityModal(item, mode) {
    shopInputReady = false;
    setTimeout(() => { shopInputReady = true; }, 250);
    const modal = document.getElementById('shop-quantity-modal');
    if (!modal) return;

    const title = document.getElementById('qmodal-title');
    const name = document.getElementById('qmodal-item-name');
    const icon = document.getElementById('qmodal-item-icon');
    const input = document.getElementById('shop-qty-input');
    const confirmBtn = document.getElementById('btn-qmodal-confirm');

    if (title) title.innerHTML = 'Select the quantity.';
    if (name) name.innerText = item.name.toUpperCase();
    if (icon) {
        icon.innerHTML = item.icon || '';
        icon.className = 'qmodal-item-icon ' + (item.iconClass || '');
    }
    if (input) {
        input.value = 1;
        // Limit max quantity based on credits/biomass
        if (mode === 'buy') {
            if (item.oneTime) {
                input.max = 1;
            } else {
                const maxBuy = Math.floor(gameState.credits / item.price);
                input.max = Math.max(1, maxBuy);
            }
        } else {
            input.max = Math.max(1, gameState.biomass);
        }
    }
    if (confirmBtn) confirmBtn.innerText = mode === 'buy' ? 'ACQUIRE' : 'LIQUIDATE';

    // Reset subtraction display
    const subEl = document.getElementById('qmodal-subtraction');
    if (subEl) subEl.innerHTML = '';

    updateQuantityTotal();
    modal.classList.remove('hidden');
}

function closeQuantityModal() {
    document.getElementById('shop-quantity-modal')?.classList.add('hidden');
}

function updateQuantityTotal() {
    if (!shopState.selectedItemId) return;
    const item = SHOP_ITEMS[shopState.selectedItemId];
    const input = document.getElementById('shop-qty-input');
    const totalEl = document.getElementById('qmodal-total-value');
    const subEl = document.getElementById('qmodal-subtraction');
    if (!item || !input || !totalEl) return;

    const qty = parseInt(input.value) || 1;
    const isBuy = shopState.activeTab === 'buy';
    const price = isBuy ? item.price : item.sellPrice;
    const totalCost = price * qty;

    totalEl.innerText = totalCost + ' LC';

    if (subEl) {
        const currentLC = gameState.credits;
        if (isBuy) {
            const remaining = currentLC - totalCost;
            subEl.innerHTML = `${currentLC} - ${totalCost} = <span class="neon-text">${remaining}</span> LC`;
        } else {
            const remaining = currentLC + totalCost;
            subEl.innerHTML = `${currentLC} + ${totalCost} = <span class="neon-text">${remaining}</span> LC`;
        }
    }
}

function selectShopItem(id) {
    shopState.selectedItemId = id;
    const item = SHOP_ITEMS[id];
    if (!item) return;

    // Update highlighted card
    document.querySelectorAll('.shop-item-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.id === id);
    });

    // Update detail side
    const nameEl = document.getElementById('shop-detail-name');
    const descEl = document.getElementById('shop-detail-desc');
    const iconEl = document.getElementById('shop-detail-icon');

    if (nameEl) nameEl.innerText = item.name.toUpperCase();
    if (descEl) descEl.innerText = item.desc;
    if (iconEl) {
        iconEl.innerHTML = item.icon || '';
        iconEl.className = 'shop-detail-img ' + (item.iconClass || '');
    }

    // Action button removed from detail side, logic moved to quantity modal
}

function clearShopDetail() {
    const nameEl = document.getElementById('shop-detail-name');
    const descEl = document.getElementById('shop-detail-desc');
    const iconEl = document.getElementById('shop-detail-icon');

    if (nameEl) nameEl.innerText = 'TERMINAL IDLE';
    if (descEl) descEl.innerText = 'Select a protocol to proceed with acquisition or liquidation.';
    if (iconEl) iconEl.innerText = '🛒';
}

function handleShopAction() {
    if (!shopState.selectedItemId) return;
    const item = SHOP_ITEMS[shopState.selectedItemId];
    const qtyInput = document.getElementById('shop-qty-input');
    const qty = parseInt(qtyInput?.value) || 1;
    if (!item) return;

    if (shopState.activeTab === 'buy') {
        const totalCost = item.price * qty;
        if (gameState.credits >= totalCost) {
            gameState.credits -= totalCost;

            if (item.id === 'biomass') {
                gameState.biomass += qty;
            } else {
                // Multi-buy support (e.g. Blueprints if oneTime: false)
                for (let i = 0; i < qty; i++) {
                    if (item.oneTime && (gameState.items || []).includes(item.id)) continue;
                    gameState.items.push(item.id);
                }
                if (item.oneTime) shopState.selectedItemId = null;
            }

            console.log(`Purchased ${qty}x ${item.name}`);
            closeQuantityModal();
            updateShopUI();
        }
    } else {
        // Sell
        if (item.id === 'biomass' && gameState.biomass >= qty) {
            gameState.biomass -= qty;
            gameState.credits += (item.sellPrice * qty);
            console.log(`Sold ${qty}x Biomass`);
            closeQuantityModal();
            updateShopUI();

            if (gameState.biomass <= 0) shopState.selectedItemId = null;
        }
    }
}

// Initial Listeners for Shop UI
function initShopEventListeners() {
    document.getElementById('btn-shop-close')?.addEventListener('click', () => {
        document.getElementById('screen-shop').classList.add('hidden');
        Overworld.isPaused = false;
    });

    document.querySelectorAll('.shop-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            shopState.activeTab = e.currentTarget.dataset.tab;
            shopState.selectedItemId = null;
            updateShopUI();
        });
    });

    // Quantity Modal Listeners
    document.getElementById('btn-qmodal-confirm')?.addEventListener('click', () => {
        handleShopAction();
    });

    document.getElementById('btn-qmodal-cancel')?.addEventListener('click', () => {
        closeQuantityModal();
    });

    document.getElementById('btn-qty-minus')?.addEventListener('click', () => {
        const input = document.getElementById('shop-qty-input');
        if (input && input.value > 1) {
            input.value = parseInt(input.value) - 1;
            updateQuantityTotal();
        }
    });

    document.getElementById('btn-qty-plus')?.addEventListener('click', () => {
        const input = document.getElementById('shop-qty-input');
        if (input) {
            const max = parseInt(input.max) || 99;
            if (input.value < max) {
                input.value = parseInt(input.value) + 1;
                updateQuantityTotal();
            }
        }
    });

    document.getElementById('shop-qty-input')?.addEventListener('change', () => {
        const input = document.getElementById('shop-qty-input');
        if (input) {
            const max = parseInt(input.max) || 99;
            if (input.value < 1) input.value = 1;
            if (input.value > max) input.value = max;
            updateQuantityTotal();
        }
    });
}

// Ensure listeners are initialized
initShopEventListeners();
updateResourceHUD();

// Initial boat-up logic for save system
checkExistingSave();
