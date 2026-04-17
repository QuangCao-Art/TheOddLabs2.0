/**
 * Overworld Engine for The Odd Labs
 * Handles grid-based movement, collisions, and zone transitions.
 */

import { gameState, saveGameState } from './state.js';
import { AudioManager } from './audio.js';
import { QUESTS } from '../data/quests.js';
import { furnitureMetadata } from '../data/furniture.js';
import { NPC_SCRIPTS } from '../data/npc_dialogues.js';

// Modular Map Data Imports
import { lobby } from '../data/maps/lobby.js';
import { atrium } from '../data/maps/atrium.js';
import { bioExtraction } from '../data/maps/bioExtraction.js';
import { specimenStorage } from '../data/maps/specimenStorage.js';
import { truthRoom } from '../data/maps/truthRoom.js';
import { oldLab } from '../data/maps/oldLab.js';
import { botanic } from '../data/maps/botanic.js';
import { ancientBotany } from '../data/maps/ancientBotany.js';
import { preservationRoom } from '../data/maps/preservationRoom.js';
import { human } from '../data/maps/human.js';
import { executive } from '../data/maps/executive.js';
import { library } from '../data/maps/library.js';
import { kitchen } from '../data/maps/kitchen.js';
import { storage } from '../data/maps/storage.js';
import { entertainment } from '../data/maps/entertainment.js';
import { cellPlayGround } from '../data/maps/cellPlayGround.js';
import { nursery } from '../data/maps/nursery.js';
import { medicalExperienceRoom } from '../data/maps/medicalExperienceRoom.js';
import { secretCryoChamber } from '../data/maps/secretCryoChamber.js';
import { oldMachine } from '../data/maps/oldMachine.js';
import { witheredTree } from '../data/maps/witheredTree.js';
import { fabricatingLab } from '../data/maps/fabricatingLab.js';

// Mapping of Tile IDs to specific material tags for audio/vfx
const TILE_MATERIAL_MAP = {
    13: 'tile',  // Standard Lab Floor
    38: 'metal'  // Floor-SideDeco / Machine Base
};


export const Overworld = {
    randomPools: {
        lobby: [
            ["Welcome to Odd Labs!", "Please keep your badge visible at all times and avoid the bio-hazard chutes."],
            ["New here? Try to interact with computers, furniture, and people.", "It's the only way to uncover hidden data logs and gossip about the Director's lunch habits."],
            ["Keep your eye on the prize! Open your Cell-Inventory and Squad menu to manage your team.", "You can swap your active Cells and check their current membrane health there."],
            ["Your Research Grade (RG) is the primary measure of your scientific standing.", "Every time your RG level increases, you'll receive a new tactical C-Chip to upgrade your Cell's combat capabilities."],
            ["The Main Atrium is the heart of Odd Labs—most wings connect right back to it.", "If you ever feel lost, just head toward the largest machine in the center of the facility."],
            ["Check every corner! Some of our best research logs are tucked away in abandoned desks or old test tanks.", "If it looks interesting, it probably has a story to tell."],
            ["If your Cells are looking a bit sluggish, take them to an Incubator unit.", "A quick session in the restorative mist will have them back to full strength in no time."],
            ["You can find Incubators in most breakrooms and research wards.", "They're the only way to fully stabilize a Cell's membrane after a tough encounter."],
            ["The Bio-Extractor is located in the dedicated Extraction Room wing.", "It's the only machine powerful enough to process the Biomass you collect into something useful."],
            ["The Cell-Accelerator is that massive machine standing in the center of the lab!", "If you have a recipe and enough materials, you can use it to grow entirely new Cells to join your squad."]
        ],
        atrium: [
            ["Have you seen the latest readings on the Nitrophils?", "They seem to have a higher metabolic rate whenever it's Noodle Tuesday.", "Strange correlation."],
            ["The Director was shouting in the cafeteria again.", "He called the Nitrophils 'bio-hazardous junk' and threatened to incinerate any dish with a red stain.", "I've never seen someone so angry at a cell."],
            ["I remember the Leak of '82... supposedly.", "The Director still uses it as an excuse to ignore the Cells.", "He calls them 'failed remnants of a dark day' whenever he's in a bad mood."],
            ["The Cells are so helpful! One of them helped me reorganize my entire filing cabinet.", "Although, it did categorize everything by 'color' instead of 'alphabetical'."],
            ["Why is the vending machine always out of Spicy Peanuts?", "I suspect the Director is buying the entire stock for his late-night shifts."],
            ["Did you hear? A junior intern claims to have seen a 'giant' cell in the old storage wing.", "Probably just lack of sleep and too many energy drinks."],
            ["The new bio-blue interface is much easier on the eyes, don't you think?", "It makes the whole lab feel more tactical and professional."],
            ["I tried to pet a Nitrophil today.", "It was remarkably soft, and it just stared at my lunch with such intense, spicy curiosity.", "They're almost... cute."],
            ["Did you know Lydrosomes can use their osmotic pressure to precisely target debris?", "I saw one pressure-cleaning a set of microscopes in the breakroom yesterday. Not a speck of dust left."],
            ["The Osmotic types are fascinating.", "They can filter an entire liter of lab-grade water in under ten seconds.", "We haven't had a clogged sink since they arrived."],
            ["Thermogenic cells like Nitrophil have a resting body temperature that could boil an egg.", "The Director calls them 'walking fire hazards' and banned them from the executive floor."],
            ["I heard rumors from the Alpha-Beta Sector.", "They're working on a 'Dual Combatant' pair called Dip-Alpha and Dip-Beta.", "Apparently, they're inseparable. If one goes down, it's a disaster for everyone's energy levels."],
            ["I saw a senior researcher trying to 'authenticate' a Bikini Card using a high-powered electron microscope.", "He claimed he was checking for 'tactical watermarks,' but he hasn't blinked in three hours.", "Curious dedication to the craft, really."],
            ["Why is everyone suddenly trading 'Swimsuit Variants' of the Cell cards?", "I heard the holographic foil is made of 'distilled summer vibes' and makes your Pellicle look 10% more fabulous.", "I need one for... thermal testing."],
            ["I tried to explain my research to a Lydrosome,", "but it just went right over its head.", "I guess I shouldn't have expected it to absorb information that quickly.", "It has zero osmotic interest in my career."],
            ["What if we synthesized a cell that only eats student loans?", "We'd have to give it a very high affinity for 'depleted wallets' and 'unpaid interest'.", "I think it's a Nobel Prize waiting to happen."],
            ["Did you know that some cells in the Botanic Sector can actually hear you scream?", "Well, not 'hear' in the traditional sense, but they respond to high-frequency vibrations.", "So if you're having a bad day, please scream quietly. You're stressing the ferns."],
            ["I asked the Nitrophils if they knew any jokes about thermal dynamics.", "They acts like they're too 'hot' to handle.", "I really need to stop talking to the thermogenic specimens."],
            ["I've been calculating the trajectory of a Nitrophil launched from a high-pressure bio-chute.", "If we get the angle right, we could technically deliver spicy noodles across the entire lab in 0.8 seconds.", "The Director's office is right in the flight path, though."],
            ["Did you know the 'anti-slip' coating on the stairs is actually a layer of modified adhesive cells that 'lick' your shoes to keep them in place?", "It works wonders, but the feeling of a thousand tiny tongues tasting your sneakers is... technically questionable.", "And remarkably loud on quiet shifts."]
        ],
        botanic: [
            ["Lana is brilliant with those Cambihils, but she has to hide them when the Director walks by.", "He calls them 'invasive weeds' and says they're a disgrace to the department."],
            ["Fun fact: Cambihils actually photosynthetic at a 15% higher efficiency rate when they're near a window.", "They're basically high-speed solar panels with leaves."],
            ["Watch out for the 'Canobolus' project in the Fungal Ward.", "It's a Ballistospore with a catapult mechanism.", "They say it roots itself into the floor and just starts peppering its target with high-pressure spores like a machine gun."],
            ["The humidity in here is great for the ferns, but it's murder on my paperwork."],
            ["Did you see the glowing hedge move?", "Lana says it's just 'bio-active curiosity', but I'm not so sure."],
            ["Lana spends more time talking to the plants than most of us.", "Can't blame her, really. At least the plants don't complain about data entry."],
            ["Lana claims her 'Bikini Collection' is purely for 'UV radiation benchmarks'.", "Right... and I'm sure that floral-pattern one is for 'camouflaging with the hydrangeas'.", "She's not fooling anyone."]
        ],
        human: [
            ["Working in Human Cell Research with Dyzes is great,", "but the Lydrosomes keep trying to 'clean' my coffee mug with high-pressure jets. It's quite a messy way to start the morning."],
            ["Viral-type cells don't actually 'infect'â€”they just share data at a molecular level.", "The Director hates them the most;", "he says they're 'biological parasites' that should have been deleted years ago."],
            ["Sector 7 is trying to fix a 'buggy' mitochondria they're calling Mitonegy.", "Itâ€™s supposed to act like a transformer, patching up colleagues' membranes automatically.", "Sounds like a maintenance nightmare."],
            ["Have you seen the blueprints for the 'Kerashell'?", "It's a Keratinocyte with an armor plates made of skin protein.", "They say it can take a beating with almost zero energy cost.", "I wish my lab coat was that durable."],
            ["I heard the Scavenger team in the basement is working on Chlarob.", "It's based on Chlamydia, but instead of making you sick, it's programmed to thieve energy from enemy cells.", "Tactical, but a bit creepy."],
            ["Micro-tactical data is coming in fast today.", "Dyzes is going to be pleased with the latest Lydrosome stats."],
            ["I asked Dyzes for a Band-Aid after a papercut.", "He tried to give me a 'Lydrosome-infused regenerating patch' that cost more than my monthly salary.", "I just used a napkin instead."],
            ["Dyzes says the human-cell interface is 99.3% stable.", "I'm just wondering about what happens with that last 0.7%."]
        ],
        kitchen: [
            ["The vending machines are out of Spicy Peanuts again.", "Director Capsain must have bought the whole stock."],
            ["Is it 'Noodle Tuesday' yet?", "The kitchen smells like salt and ambition today."],
            ["Looking to trade? The Vending Machines in the common areas are your best friend.", "You can sell your extra Biomass for credits and buy the new blueprints you need to grow your collection."],
            ["If you're short on credits, try offloading some Biomass at the vending terminal.", "We're always in need of raw biological samples for the synthesis floor."],
            ["Chef Rattou says the secret to a good lab lunch is properly calibrated salinity.", "I think he just likes playing with the digital scales."]
        ],
        entertainment: [
            ["The new Battle Machine in the lounge is always occupied.", "I can't even get a turn on my lunch break!"],
            ["Did you see the high score on the lounge PC?", "Someone named 'DIRECTOR' has 9999 points. Sus-picious!"],
            ["In a battle, try to place your attack node as close to the target as possible.", "The more accurate your sync is, the harder you hit and the more Pellicle Points (PP) you generate."],
            ["Watch your PP levels during a duel.", "Using your specialized skills costs Pellicle Points, but simple defensive moves are always available to keep you safe."],
            ["You can actually spend more PP than you currently have to land a big hit for a high cost.", "This puts your Cell into a 'negative' debt state—you'll hit harder now, but expect to take much more damage next turn!"],
            ["Try to keep your PP in the positive range for a stable defense.", "If you drop into the negatives, every point of debt increases incoming damage by 10%. (e.g. at -10 PP, you're taking double damage!)"]
        ],
        storage: [
            ["Boxes, more boxes...", "I think I saw a Nitrophil hiding in one of these crates."],
            ["Why do we store so many 'Adhesive Residue' samples?", "Storage duty is the worst."],
            ["The lab is full of history, but not all of it is in the main database.", "Keep an eye out for unique furniture or abandoned test tanks—you might find a hidden data log or a rare item."],
            ["Who keeps kicking the stuff all over the place?", "It's becoming a logistical nightmare to keep track of everything!"],
            ["I'm so tired of having to put things back where they belong...", "One of these days, I WILL glue all the furniture to the floor!"],
            ["I saw Lana looking for something here recently.", "She seemed... unusually tense."]
        ],
        specimenStorage: [
            ["When you defeat a wild Cell, it leaves behind biological traces called Biomass.", "You can take this to the Bio-Extractor machine to acquire the raw materials needed for synthesis."],
            ["Don't forget to check the vending machines for new synthesis recipes.", "You can't grow a specific species until you've unlocked its genetic blueprint first."],
            ["The specimens in these tanks are kept in 'suspended animation'.", "It's the only way to study them without them trying to synthesize a snack out of our clipboards."],
            ["Notice the color variations in the tanks?", "Red, Blue, Green... we're testing how different nutrient hues affect Pellicle density."],
            ["Don't tap on the glass!", "The Red Specimens are especially sensitive to vibrations. They're not aggressive, just... easily startled into a thermal burst."]
        ],
        library: [
            ["The junior interns avoid the lower levels because of the 'White Ghost' rumor.", "I tried to stay late to finish my report, but the chill became unbearable. // It felt like the Library itself wanted to be left alone with its ghosts."],
            ["First I saw one white figure, then I saw two near the restricted section.", "I think our facility's history might have some... active participants."],
            ["The Director is surprisingly hands-on here; he cleans every bookshelf himself.", "I saw him polishing the 'Genetic Heritage' spines with a silk cloth for two hours."],
            ["Did you ever hear that old story? // About the plant that fed on a human until it took their soul for its own.", "They say when it had eaten enough, its roots became legs and it pulled itself out of the soil. // It walks the earth now... pretending to be one of us, while its heart is still made of thorns."]
        ],
        nursery: [
            ["Ever hear the myth of the 'Whispering Willow'?", "They say its leaves hold the memories of the very first dream.", "If you listen closely, you might hear the world's first secret... or just a very melodic hum."],
            ["Cellular evolution is a study in adaptability.", "A single specimen can diverge into a mastery of natural forces or a peak of mechanical integration.", "It's an elegant choice between the leaf and the gear."],
            ["Lana's actually super chill when she's around the plants!", "I saw her trying to lead a sing-along with the specimen tanks.", "They're not the best singers, but they've got great 'rhythm' in their vines!"],
            ["I heard about a magical tree that, whenever it grows in the middle of a road, you'll never be able to pass it.// Even if you try to jump over it or go around it! The only way forward is to cut it down. Weird, right?", "Why didn't they just sprint-kick it like we always do? It's much more efficient than standing there waiting for a flute or something."]
        ],
        medicalExperienceRoom: [
            ["There's an old folk tale about the 'Archeons'—colossal creatures that walked like men but had the spirits of beasts and the power of ancient magic.", "Imagine a world ruled by something that huge... it would be terrifying, wouldn't it?"],
            ["The security guard mentioned hearing a low, resonant howl coming from the deep sectors last night.", "He claimed it felt less like a sound and more like a vibration in the floor tiles... almost like the cry of a giant beast trapped in the deep."],
            ["If you can't find Scientist Dyzes at his station, he's likely reached a state of 'passive enlightenment'//—or as his assistant calls it, taking a nap.", "It's maddening how the most brilliant human-cell breakthroughs come to him while he's snoring. Lazy? Maybe. But his genius is undeniable."],
            ["The 'Experience' part of this room is mostly just us watching people react to weird noises.", "It's a very cost-effective way to study stress-induced hormone spikes."]
        ],
        cellPlayGround: [
            ["The Pellicle layer of these Cells is remarkably resilient. // They can withstand the force of a full explosion without losing structural integrity. // To them, a sprint-kick is probably nothing more than a playful tickle!"],
            ["We aren't entirely sure why the Cells gravitate toward this specific room in such high numbers. // Since they insisted on gathering here, we decided to officially designate it as their 'Playground'."],
            ["Did you know that Cells actually enjoy physical interaction? // They respond to affection just like a pet. // Curiously, their dense sensory nodes perceive a head pat and a firm kick as the exact same sensation!"]
        ]
    },
    tileSize: 64,
    player: {
        x: 10,
        y: 8,
        targetX: 10,
        targetY: 8,
        startX: 10,
        startY: 8,
        direction: 'down',
        isMoving: false,
        moveSpeed: 300, // ms per tile
        currentMoveSpeed: 300,
        moveStartedAt: 0,
        isSprinting: false,
        isTurning: false,
        stepParity: 0, // 0 or 1 for alternating steps
        currentFrame: 0, // 0-3 for manual frame control
        sprintDistance: 0,
        isHitstopping: false
    },
    keysPressed: new Set(),
    currentZone: null,
    mapData: null,
    controlsInitialized: false,
    isDialogueActive: false,
    isDialogueTransitioning: false,
    isTyping: false,
    currentFullText: "",
    currentDialoguePartner: null,
    dialogueQueue: [],
    typingInterval: null,
    isTransitioning: false,
    isPaused: false,

    // --- TIMED QUEST SYSTEM ---
    activeTimedQuestId: null,
    timedQuestElapsed: 0,
    isStartingQuest: false,
    questNPCAttached: null,

    lastInteractTime: 0,
    logsCollected: [], // Local cache, synced from gameState.logs in renderMap
    pendingIncubatorMenu: false, // flag for incubator healing flow
    pendingShopMenu: false, // New flag for shop terminal flow
    pendingSynthesisMenu: false, // New flag for synthesis terminal flow
    deferredItemPickup: null, // For rewards that trigger after dialogue
    onDialogueComplete: null, // Callback for when current dialogue ends
    battleSourceZone: null, // Tracks where a wild battle started
    pendingWildInstanceId: null, // TRACKS THE SPECIFIC BARCODE ID
    gameLoopActive: false,

    resetStates() {
        this.isDialogueActive = false;
        this.isTyping = false;
        this.isTransitioning = false;
        this.isPaused = false;
        this.player.isMoving = false;
        this.keysPressed.clear();
        if (this.typingInterval) clearInterval(this.typingInterval);
        document.getElementById('dialogue-box')?.classList.add('hidden');
        // Kill the loop so startLoop() can restart it cleanly
        this.gameLoopActive = false;
    },

    savePosition() {
        if (window.gameState) {
            window.gameState.lastOverworldPos = {
                zone: this.currentZone,
                x: this.player.x,
                y: this.player.y
            };
        }
    },

    checkActiveSquad() {
        if (!window.gameState || !window.gameState.profiles || !window.gameState.profiles.player) return false;
        const playerProfile = window.gameState.profiles.player;
        if (!playerProfile.party) return false;
        const activeCount = playerProfile.party.slice(0, 3).filter(m => m !== null).length;
        return activeCount > 0;
    },

    zones: {
        lobby,
        atrium,
        bioExtraction,
        specimenStorage,
        truth_room: truthRoom,
        old_lab: oldLab,
        botanic,
        ancientBotany,
        preservationRoom,
        human,
        executive,
        library,
        kitchen,
        storage,
        entertainment,
        cellPlayGround,
        nursery,
        medicalExperienceRoom,
        secretCryoChamber,
        oldMachine,
        witheredTree,
        fabricatingLab
    },
    furnitureMetadata,

    getFurnitureMeta(objId, customSprite) {
        if (!objId) return null;
        if (customSprite && this.furnitureMetadata[customSprite]) return this.furnitureMetadata[customSprite];

        const prefix = objId.split('_')[0];
        return this.furnitureMetadata[prefix] || null;
    },

    getTransformedTiles(template, isMirrored) {
        const tiles = template.tiles || [{ id: template.id, relX: 0, relY: 0 }];
        // Systematic: Engine logic now uses Blueprint coordinates directly.
        // We return them as-is, tagged with the mirrored state.
        return tiles.map(t => ({
            ...t,
            mirrored: isMirrored
        }));
    },

    getVisualX(obj) {
        if (!obj.mirrored) return obj.x;

        const prefix = obj.id.split('_')[0];
        let template = null;
        let candidate = null;

        // Priority 1: Use specific template name from map data
        if (obj.templateName && window.FURNITURE_TEMPLATES[obj.templateName]) {
            template = window.FURNITURE_TEMPLATES[obj.templateName];
            candidate = template.tiles.find(tile => tile.id === prefix);
        }

        // Priority 2: Registry Search (find most specific machine)
        if (!candidate) {
            let bestTemplate = null;
            let bestCandidate = null;
            let maxTiles = -1;

            for (const tKey in window.FURNITURE_TEMPLATES) {
                const t = window.FURNITURE_TEMPLATES[tKey];
                const found = t.tiles.find(tile => tile.id === prefix);
                if (found && t.tiles.length > maxTiles) {
                    maxTiles = t.tiles.length;
                    bestTemplate = t;
                    bestCandidate = found;
                }
            }
            template = bestTemplate;
            candidate = bestCandidate;
        }

        if (template && candidate) {
            const minX = Math.min(...template.tiles.map(tile => tile.relX || 0));
            const maxX = Math.max(...template.tiles.map(tile => tile.relX || 0));
            const relX = (obj.relX !== undefined) ? obj.relX : (candidate.relX || 0);

            // Calculate where this tile is rendered visually based on assembly center flip
            return (obj.x - relX) + (maxX - relX + minX);
        }
        return obj.x;
    },

    updateQuestProgress(type, id, objectType = null, templateName = null) {
        let changed = false;
        Object.keys(gameState.quests).forEach(questId => {
            const progressObj = gameState.quests[questId];
            const questData = QUESTS[questId];

            if (progressObj.status === 'started' && questData.type === type && (this.isQuestTargetMatch(questData.target, { id: id }) || questData.target === templateName || questData.target === 'any')) {
                // If the quest specifies a targetType (e.g., 'npc'), verify the kicked object matches
                if (questData.targetType && objectType && questData.targetType !== objectType) {
                    return; // Skip if types don't match
                }

                progressObj.progress++;
                changed = true;

                if (progressObj.progress >= questData.amount) {
                    progressObj.status = 'completed';
                    console.log(`Quest [${questData.title}] marked as COMPLETED!`);
                }
            }
        });

        if (changed) {
            window.dispatchEvent(new CustomEvent('quest-updated'));
            if (gameState.settings?.autoSave) {
                saveGameState();
            }
        }
    },

    giveQuestReward(questId) {
        const questData = QUESTS[questId];
        if (!questData || !questData.reward) return;

        const processReward = (reward) => {
            let msg = "";
            if (reward.type === 'log' || reward.type === 'item') {
                this.collectItem(reward.id);
                msg = `Acquired ${reward.type.toUpperCase()}: ${reward.id}.`;
            } else if (reward.type === 'resource') {
                if (window.changeResource) {
                    window.changeResource(reward.id === 'credits' ? 'lc' : 'bm', reward.amount || 0, false, true);
                }
                msg = `Acquired ${reward.amount} ${reward.id.toUpperCase()}.`;
            } else if (reward.type === 'exp') {
                if (window.grantExperience) {
                    // Skip banner here because showQuestCompleteModal handles the animation and notification trigger now
                    window.grantExperience(reward.amount || 0, false, true);
                }
                msg = `Acquired ${reward.amount} EXP.`;
            } else if (reward.type === 'relocate') {
                this.relocateNPC(reward.npcId, reward.x, reward.y, reward.zoneId, reward.direction, reward.useFade !== false);
                msg = `Relocated NPC: ${reward.npcId}.`;
            } else if (reward.type === 'flag') {
                if (window.gameState && window.gameState.storyFlags) {
                    window.gameState.storyFlags[reward.id] = true;
                    msg = `Set storyFlag: ${reward.id}.`;
                }
            }
            console.log(`Quest Reward given: ${msg}`);
        };

        const handleRewards = () => {
            const reward = questData.reward;
            if (reward.type === 'resource_multi' && Array.isArray(reward.rewards)) {
                reward.rewards.forEach(r => processReward(r));
            } else {
                processReward(reward);
            }

            // Ensure state is persisted after granting rewards if auto-save is enabled
            if (gameState.settings?.autoSave && typeof saveGameState === 'function') saveGameState();
        };

        // --- Visual confirmation modal ---
        // Pass handleRewards as callback so items/logs are collected AFTER dismissal
        if (window.showQuestCompleteModal) {
            window.showQuestCompleteModal(questId, handleRewards);
        } else {
            handleRewards();
        }
    },

    /**
     * Applies dynamic world state changes to map data AFTER it has been cloned
     * but BEFORE it is rendered. This ensures persistence across loads.
     */
    applyMapPatches(zoneId, zone) {
        // --- PATCH: Persistence-Based NPC Relocations ---
        if (window.gameState && window.gameState.npcRelocations) {
            Object.entries(window.gameState.npcRelocations).forEach(([npcId, data]) => {
                // If the NPC is supposed to be in this zone, override its coordinates
                const npc = zone.objects.find(o => o.id === npcId);
                if (npc) {
                    if (data.zoneId && data.zoneId !== zoneId) {
                        // NPC has moved to a DIFFERENT zone - remove from this zone
                        zone.objects = zone.objects.filter(o => o.id !== npcId);
                    } else {
                        // NPC is in this zone - update its local position
                        npc.x = data.x;
                        npc.y = data.y;
                        if (data.direction) npc.direction = data.direction;
                    }
                } else if (data.zoneId === zoneId) {
                    // NPC was NOT in this zone originally, but has relocated HERE
                    // We would need the full NPC object template to add it dynamically.
                    // For now, we assume relocation happens within the same zone or between predefined spots.
                }
            });
        }
    },

    /**
     * Relocates an NPC to a new coordinate and optionally a new zone.
     * @param {string} npcId - The ID of the NPC to move.
     * @param {number} x - Target X coordinate.
     * @param {number} y - Target Y coordinate.
     * @param {string} zoneId - Optional target zone ID (defaults to current).
     * @param {string} direction - Optional facing direction.
     * @param {boolean} useFade - Whether to trigger a black screen transition.
     */
    async relocateNPC(npcId, x, y, zoneId = null, direction = null, useFade = true) {
        const targetZone = zoneId || this.currentZone;

        const performMove = () => {
            if (!window.gameState.npcRelocations) window.gameState.npcRelocations = {};
            window.gameState.npcRelocations[npcId] = { x, y, zoneId: targetZone, direction };

            if (window.gameState.settings?.autoSave) saveGameState();

            // Re-render the map to apply the change visually if in the same zone
            if (this.currentZone === targetZone) {
                this.renderMap(this.currentZone);
            }
        };

        if (useFade && window.triggerQuickTransition) {
            await window.triggerQuickTransition(async () => {
                performMove();
                // Brief pause while screen is black for "presence"
                await new Promise(r => setTimeout(r, 200));
            });
        } else {
            performMove();
        }
    },

    init() {
        console.log("Overworld Engine Starting...");
        this.resetStates(); // Ensure clean start

        // --- NEW: Snapshot pristine maps for "Reset on Entry" ---
        if (!this.pristineZones) {
            this.pristineZones = {};
            for (let id in this.zones) {
                // We use JSON stringify/parse for a deep clone of the static map data
                this.pristineZones[id] = JSON.stringify(this.zones[id]);
            }
        }

        setTimeout(() => {
            const lastPos = window.gameState.lastOverworldPos;
            if (lastPos && lastPos.zone && lastPos.x !== null && lastPos.y !== null) {
                console.log(`Resuming at ${lastPos.zone} (${lastPos.x}, ${lastPos.y})`);
                this.renderMap(lastPos.zone, false, lastPos.x, lastPos.y);
            } else {
                this.renderMap('lobby', true); // Fresh spawn for game start
            }
            this.setupControls();
            this.startLoop();
        }, 50);
    },

    /**
     * Renders the map and initializes zone state.
     * @param {string} zoneId - ID of the zone to render.
     * @param {boolean} forceSpawn - Force player to zone's spawn point.
     * @param {number} targetX - Optional specific X coordinate.
     * @param {number} targetY - Optional specific Y coordinate.
     */
    renderMap(zoneId, forceSpawn = false, targetX = null, targetY = null) {
        let id = zoneId || this.currentZone || 'lobby';

        // Migration support for renamed zones
        if (id === 'theTree') id = 'witheredTree';

        const isNewZone = id !== this.currentZone || forceSpawn;

        // --- NEW: Implement "Reset on Entry" via Clone ---
        if (isNewZone && this.pristineZones && this.pristineZones[id]) {
            this.zones[id] = JSON.parse(this.pristineZones[id]);
        }

        const zone = this.zones[id];

        if (!zone) {
            console.error(`Zone ID "${id}" not found in Overworld.zones. Falling back to lobby.`);
            return this.renderMap('lobby', true);
        }

        // --- NEW: Apply dynamic map patches based on gameState ---
        this.applyMapPatches(id, zone);

        // Update Bio-Extract visuals if we are entering or rendering the extraction room
        if (id === 'bioExtraction') {
            this.updateBioExtractVisuals();
        }

        // --- NEW: Spawner Cleanup (Prevent timer leaks on zone change) ---
        if (isNewZone && this.spawner) {
            this.spawner.stop();
        }

        const mapEl = document.getElementById('overworld-map');
        const playerSprite = document.getElementById('player-sprite');

        // 1. LOCK VISUALS (Prevent jerky movement during redraw)
        // 1. CLEAR & TRANSITION LOCK (Only on room change to prevent camera/sprite sliding)
        if (isNewZone) {
            if (mapEl) mapEl.classList.add('no-transition');
            if (playerSprite) playerSprite.classList.add('no-transition');
        }

        // 2. DETACH PLAYER (Temporarily)
        if (playerSprite && playerSprite.parentElement === mapEl) {
            mapEl.removeChild(playerSprite);
        }

        // 3. DRAW TILES
        mapEl.style.gridTemplateColumns = `repeat(${zone.width}, ${this.tileSize}px)`;
        mapEl.style.gridTemplateRows = `repeat(${zone.height}, ${this.tileSize}px)`;
        mapEl.innerHTML = '';

        for (let y = 0; y < zone.height; y++) {
            for (let x = 0; x < zone.width; x++) {
                let tileID = zone.layout[y][x];

                // --- Story-Locked Door Visual Swap ---
                const door = zone.doors && zone.doors.find(d => d.x === x && d.y === y);
                const isLockedByFlag = door && door.requiredFlag && !window.gameState.storyFlags[door.requiredFlag] && !window.gameState.debugUnlockDoors;
                const missingItems = door ? (door.requiredItems || (door.requiredItem ? [door.requiredItem] : [])).filter(id => !window.gameState.items.includes(id)) : [];
                const isLockedByItem = door && missingItems.length > 0 && !window.gameState.debugUnlockDoors && !window.gameState.debugAllItems;

                // --- NEW: Timed Quest Lockdown (Block entry/exit during stress tests) ---
                const isLockedByQuest = this.activeTimedQuestId !== null;

                if (isLockedByFlag || isLockedByItem || isLockedByQuest) {
                    const lockedMap = {
                        20: 29, 21: 29, // Edge-Bottom
                        22: 28, 23: 28, // Basic
                        24: 30, 26: 30, // Edge-Left
                        25: 31, 27: 31  // Edge-Right
                    };
                    if (lockedMap[tileID]) tileID = lockedMap[tileID];
                }

                const tile = document.createElement('div');
                tile.classList.add('tile', `t-${tileID}`);

                const isClosedDoor = [20, 22, 24, 25, 28, 29, 30, 31, 39, 40, 41, 42].includes(tileID);
                const isOpenDoor = [21, 23, 26, 27, 34, 35, 36, 37].includes(tileID);
                const isGenericWall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 32, 33, 43, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63].includes(tileID);

                if (isGenericWall || isClosedDoor) tile.classList.add('wall');
                else tile.classList.add('floor');

                if (isClosedDoor || isOpenDoor || [39, 40, 41, 42].includes(tileID)) tile.classList.add('door-tile');

                mapEl.appendChild(tile);
            }
        }

        // 4. DRAW OBJECTS
        this.refreshLogs(); // Sync logs from state (accounting for debug mode)

        // Reset kicked state for all objects whenever re-entering a new room
        if (isNewZone) {
            zone.objects.forEach(o => {
                delete o.isKicking;
                delete o.isKicked;
            });
        }

        // Log #001 is now hidden in the Red Specimen Tank via main.js trigger
        if (id === 'lobby') {
            zone.objects = zone.objects.filter(obj => obj.id !== 'log_001');
        }

        if (id === 'executive' && window.gameState.storyFlags.gameCompleted) {
            if (!zone.objects.some(o => o.id === 'origin_nitrophil_final')) {
                zone.objects.push({
                    id: 'origin_nitrophil_final',
                    x: 9,
                    y: 3,
                    type: 'cell',
                    name: 'Origin Nitrophil',
                    customSprite: 'c3 orange-hue'
                });
            }
        }

        zone.objects.forEach(obj => {
            if (obj.isKicked) return;
            if (!this.isObjectVisible(obj)) return;
            this.renderObject(obj, mapEl);
        });

        // 5. RE-ATTACH & COORDINATE SYNC
        if (!playerSprite) {
            const newSprite = document.createElement('div');
            newSprite.id = 'player-sprite';
            mapEl.appendChild(newSprite);
        } else {
            mapEl.appendChild(playerSprite);
        }

        if (targetX !== null && targetY !== null) {
            this.player.x = targetX;
            this.player.y = targetY;
        } else if (isNewZone) {
            this.player.x = zone.spawn.x;
            this.player.y = zone.spawn.y;
        }

        this.currentZone = id;
        document.getElementById('location-name').textContent = zone.name;
        this.updatePlayerPosition();
        this.savePosition();

        // --- NEW: Spatial Conflict Audit (Auto-kick/break furniture overlaps on entry) ---
        const overlapped = zone.objects.filter(obj => {
            const w = obj.width || 1;
            const h = obj.height || 1;
            return this.player.x >= obj.x && this.player.x < obj.x + w && this.player.y >= obj.y && this.player.y < obj.y + h;
        });

        overlapped.forEach(obj => {
            const meta = this.getFurnitureMeta(obj.id, obj.customSprite);
            // Inclusion: Kickables, Wild Monsters, AND Breakables
            const isInteractable = (obj.temp === true || (obj.id && obj.id.includes('_wild_')) || (meta && (meta.kickable === true || meta.breakable === true)));

            if (isInteractable && !obj.isKicking) {
                const dirMap = {
                    'up': { dx: 0, dy: -1 },
                    'down': { dx: 0, dy: 1 },
                    'left': { dx: -1, dy: 0 },
                    'right': { dx: 1, dy: 0 }
                };
                const push = dirMap[this.player.direction] || { dx: 0, dy: 1 };
                this.kickObject(obj, push.dx, push.dy, true); // Force bypass transition/pause guards
            }
        });

        // 6. UNLOCK VISUALS (Clean up transition locks after render)
        setTimeout(() => {
            const p = document.getElementById('player-sprite');
            const m = document.getElementById('overworld-map');
            if (p) p.classList.remove('no-transition');
            if (m) m.classList.remove('no-transition');
        }, 100);
    },

    renderObject(obj, mapEl) {
        if (!['npc', 'prop', 'cell', 'sign', 'atrium_statue'].includes(obj.type) && obj.id !== 'incubator') return null;

        const el = document.createElement('div');
        el.id = `npc-${obj.id}`;
        el.classList.add('world-object', obj.type);
        if (obj.customSprite) {
            obj.customSprite.split(' ').forEach(cls => {
                if (cls) el.classList.add(cls);
            });
        }


        // --- NEW: Debris Pop Juice ---
        if (obj.isNewDebris) {
            el.classList.add('anim-debris-bounce');
            delete obj.isNewDebris; // Run only once
        }

        // Derive gender/sprite class (npc_male, npc_female)
        const mappedSprite = window.OVERWORLD_NPC_SPRITES && window.OVERWORLD_NPC_SPRITES[obj.id];
        const specificClass = mappedSprite || (obj.id.startsWith('npc_') ? obj.id.split('_').slice(0, 2).join('_') : obj.id.split('_')[0]);
        el.classList.add(specificClass);

        if (obj.type === 'npc' && obj.id.includes('_wild_')) {
            el.classList.add('wild-cell');
            // 'anim-monster-breathing' is now added AFTER the pop animation in spawner.spawnCurrent
        }
        if (obj.type === 'npc') el.classList.add(`face-${obj.direction || 'down'}`);

        el.style.width = `${(obj.width || 1) * this.tileSize}px`;
        el.style.height = `${(obj.height || 1) * this.tileSize}px`;
        el.style.left = `${obj.x * this.tileSize + (obj.offsetX || 0)}px`;
        el.style.top = `${obj.y * this.tileSize + (obj.offsetY || 0)}px`;
        el.style.zIndex = obj.y + (obj.height || 1) + 10;



        const meta = this.getFurnitureMeta(obj.id, obj.customSprite);
        if (meta && meta.hasCollision === false) el.classList.add('render-top');

        // --- NEW: Systematic Breathing Animation ---
        if (meta && meta.breathing) {
            el.classList.add('anim-breathing');
            if (meta.breathingSpeed) el.style.setProperty('--breathing-speed', meta.breathingSpeed);
            if (meta.breathingScale) el.style.setProperty('--breathing-scale', meta.breathingScale);
        }

        // --- NEW: Symmetrical Animation Origin ---
        // We calculate a shared machine pivot so that 2x2 and 3x3 objects squash as a single unit.
        if (obj.mirrored) {
            el.classList.add('mirrored-object');
            el.style.setProperty('--scale-x', '-1');
        } else {
            el.style.setProperty('--scale-x', '1');
        }

        const prefix = obj.id.split('_')[0];
        let template = null;
        let foundTile = null;

        // Priority 1: Explicit Template Name
        if (obj.templateName && window.FURNITURE_TEMPLATES[obj.templateName]) {
            template = window.FURNITURE_TEMPLATES[obj.templateName];
            foundTile = template.tiles.find(tile => tile.id === prefix);
        }

        // Priority 2: Best Fit Search (prevent 1x1 orphan drift)
        if (!foundTile) {
            let bestTemplate = null;
            let bestCandidate = null;
            let maxTiles = -1;

            for (const tKey in window.FURNITURE_TEMPLATES) {
                const t = window.FURNITURE_TEMPLATES[tKey];
                const candidate = t.tiles.find(tile => tile.id === prefix);
                if (candidate && t.tiles.length > maxTiles) {
                    maxTiles = t.tiles.length;
                    bestTemplate = t;
                    bestCandidate = candidate;
                }
            }
            template = bestTemplate;
            foundTile = bestCandidate;

            // AUTO-SYNC: If we found a template via search, lock it to the object 
            // to ensure its partners share the same origin next frame.
            if (template && !obj.templateName) {
                obj.templateName = Object.keys(window.FURNITURE_TEMPLATES).find(k => window.FURNITURE_TEMPLATES[k] === template);
            }
        }

        if (template && foundTile) {
            const rx = (obj.relX !== undefined) ? obj.relX : (foundTile.relX || 0);
            const ry = (obj.relY !== undefined) ? obj.relY : (foundTile.relY || 0);

            const minX = Math.min(...template.tiles.map(t => t.relX || 0));
            const maxX = Math.max(...template.tiles.map(t => t.relX || 0));
            const maxY = Math.max(...template.tiles.map(t => t.relY || 0));

            // Math: Center between horizontal bounds, and at the machine's base.
            const centerX = (minX + maxX) / 2;
            const centerY = maxY;

            // PIXEL-PERFECTION: Pivot exactly at the assembly's shared center point
            const ox_px = (centerX - rx + 0.5) * this.tileSize;
            const oy_px = (centerY - ry + 1.0) * this.tileSize;
            el.style.transformOrigin = `${ox_px}px ${oy_px}px`;
        }

        // Add Level Badge for Bio-Extraction Grid Cells
        if (obj.type === 'cell' && obj.efficiency) {
            const badge = document.createElement('div');
            badge.className = 'efficiency-badge';
            badge.innerText = obj.efficiency;
            el.appendChild(badge);
        }

        // Debug indicator for hidden rewards (Logs, Items, or Unified Rewards)
        if (window.gameState?.showAllHiddenStuff && (obj.hiddenLogId || obj.hiddenItemId || obj.hiddenReward)) {
            // Use unique suffix for spotId if it exists to group multi-tile props
            const suffixMatch = obj.id?.match(/_([a-z0-9]{10,})$/);
            const spotId = suffixMatch ?
                `${this.currentZone}_${suffixMatch[1]}` :
                `${this.currentZone}_${obj.x}_${obj.y}`;

            const collected = (obj.hiddenLogId && this.logsCollected.includes(obj.hiddenLogId)) ||
                (obj.hiddenItemId && window.gameState.items.includes(obj.hiddenItemId)) ||
                (obj.hiddenReward && window.gameState.lootedSpots.includes(spotId));

            const cross = document.createElement('div');
            // Red for Logs, Blue for Items/Rewards, Black if Collected
            const isItem = !!(obj.hiddenItemId || obj.hiddenReward);
            const colorClass = collected ? 'black' : (isItem ? 'blue' : 'red');
            cross.className = `debug-hidden-log ${colorClass}`;
            cross.innerText = 'X';
            el.appendChild(cross);
        }

        if (obj.proximityTrigger) {
            const tx = obj.triggerX !== undefined ? obj.triggerX : obj.x;
            const ty = obj.triggerY !== undefined ? obj.triggerY : obj.y;
            const dist = Math.sqrt(Math.pow(this.player.x - tx, 2) + Math.pow(this.player.y - ty, 2));
            if (dist <= (obj.triggerRadius || 3)) {
                el.classList.add('npc-elara-visible');
            } else {
                el.classList.add('npc-elara-faded');
            }
        }

        mapEl.appendChild(el);

        // DEBUG: Show red X on hidden DataLogs
        if (window.gameState.showHiddenLogs && obj.hiddenLogId && !this.logsCollected.includes(obj.hiddenLogId)) {
            const debugIndicator = document.createElement('div');
            debugIndicator.className = 'debug-log-indicator';
            debugIndicator.style.left = `${obj.x * this.tileSize + ((obj.width || 1) * this.tileSize / 2) - 16}px`;
            debugIndicator.style.top = `${obj.y * this.tileSize + ((obj.height || 1) * this.tileSize / 2) - 16}px`;
            mapEl.appendChild(debugIndicator);
        }
        return el;
    },

    refreshLogs() {
        this.logsCollected = (window.gameState.debugAllLogs && window.DATA_LOGS)
            ? window.DATA_LOGS.map(l => l.id)
            : (window.gameState.logs || []);

        if (window.updateResourceHUD) window.updateResourceHUD();
    },

    setupControls() {
        if (this.controlsInitialized) return;
        this.controlsInitialized = true;

        window.addEventListener('keydown', (e) => {
            if (document.getElementById('screen-overworld').classList.contains('hidden')) return;
            if (e.key.toLowerCase() === 'f') {
                // If dialogue is active, always allow F to advance/speed up (unless transitioning)
                if (this.isDialogueActive && !this.isTransitioning) {
                    this.interact();
                } else if (!this.isPaused && !this.isTransitioning && !this.isDialogueTransitioning && !e.repeat && !this.isStartingQuest) {
                    // Block interaction during transitions or if paused
                    if (this.activeTimedQuestId) return;

                    // Safety check: Don't interact if any UI overlay/modal is visible
                    // Added zone-transition-overlay to the check
                    const hasOverlay = document.querySelector('.overlay:not(.hidden), .modal-overlay:not(.hidden), .modal-overlay.active, #zone-transition-overlay:not(.hidden), #game-over-overlay:not(.hidden)');
                    if (!hasOverlay) {
                        this.interact();
                    }
                }
            }
            if (e.key.toLowerCase() === 'escape') {
                // If any menu or modal is open, let that handle the escape key
                const hasOverlay = document.querySelector('.overlay:not(.hidden), .modal-overlay:not(.hidden), .modal-overlay.active');
                if (hasOverlay) return;

                if (window.triggerSlowTransition) {
                    window.triggerSlowTransition(() => {
                        this.stopLoop();
                        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
                        document.getElementById('screen-main-menu').classList.remove('hidden');
                    });
                } else {
                    this.stopLoop();
                    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
                    document.getElementById('screen-main-menu').classList.remove('hidden');
                }
            }
        });

        window.addEventListener('keydown', (e) => {
            if (document.getElementById('screen-overworld').classList.contains('hidden')) return;
            const key = e.key.toLowerCase();
            this.keysPressed.add(key);
            // No longer calling handleMovementInput directly to avoid repeat delay
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keysPressed.delete(key);
        });

        // Ensure loop starts if we regain focus
        window.addEventListener('focus', () => this.startLoop());
        window.addEventListener('blur', () => this.stopLoop());
    },

    startLoop() {
        if (this.gameLoopActive) return;
        this.gameLoopActive = true;

        // Check for pending item pickups (rewards from battle)
        if (this.pendingItemPickup) {
            const itemId = this.pendingItemPickup;
            const spotId = this.pendingItemSpotId || null;
            this.pendingItemPickup = null;
            this.pendingItemSpotId = null;
            this.collectItem(itemId, spotId);
        }

        this.spawner.start();
        this.gameLoop();
    },

    stopLoop() {
        this.gameLoopActive = false;
        this.spawner.stop();
    },

    gameLoop() {
        if (!this.gameLoopActive) return;

        // Only run if overworld is visible
        const overworldVisible = !document.getElementById('screen-overworld').classList.contains('hidden');
        if (overworldVisible && !this.isPaused && !this.isTransitioning) {
            // Update timed quest logic
            this.updateTimedQuest();

            // Update movement progress first
            this.handleMovementProgress();

            // Check for new input
            this.handleMovementInput();

            // Manual Position Interpolation (runs every frame during movement)
            if (this.player.isMoving) {
                this.updatePlayerPosition();
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    },

    handleMovementProgress() {
        if (!this.player.isMoving) return;

        const now = Date.now();
        const progress = now - this.player.moveStartedAt;
        const actualMoveSpeed = this.player.currentMoveSpeed;

        // Midpoint: Switch to step frame
        if (progress >= actualMoveSpeed / 2 && this.player.currentFrame % 2 === 0) {
            this.player.currentFrame = (this.player.stepParity * 2) + 1;
            this.updatePlayerPosition();
        }

        // Logic Completion: SNAP!
        if (progress >= actualMoveSpeed) {
            this.player.isMoving = false;
            this.player.stepParity = (this.player.stepParity + 1) % 2;
            this.player.currentFrame = this.player.stepParity * 2; // Next idle frame

            // Track sprint distance for Home-Run mechanic
            if (this.player.isSprinting) {
                this.player.sprintDistance++;
            } else {
                this.player.sprintDistance = 0;
            }

            this.updatePlayerPosition();
            this.savePosition();
            this.checkProximityTriggers();
            this.handleAutomatedInteractions();
        }
    },

    checkProximityTriggers() {
        const zone = this.zones[this.currentZone];
        if (!zone || !zone.objects) return;

        zone.objects.forEach(obj => {
            if (obj.proximityTrigger) {
                const el = document.getElementById(`npc-${obj.id}`);
                if (!el) return;

                const tx = obj.triggerX !== undefined ? obj.triggerX : obj.x;
                const ty = obj.triggerY !== undefined ? obj.triggerY : obj.y;
                const dx = this.player.x - tx;
                const dy = this.player.y - ty;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= (obj.triggerRadius || 3)) {
                    el.classList.remove('npc-elara-faded');
                    el.classList.add('npc-elara-visible');
                } else {
                    el.classList.remove('npc-elara-visible');
                    el.classList.add('npc-elara-faded');
                }
            }
        });
    },

    handleMovementInput() {
        if (this.isDialogueActive || this.isTransitioning || this.isPaused) return;

        // Check Sprint State (Update visually even while moving)
        const wasSprinting = this.player.isSprinting;
        this.player.isSprinting = this.keysPressed.has('shift');
        if (!this.player.isSprinting) {
            this.player.sprintDistance = 0;
        }

        // Force visual update if sprint state toggled mid-movement or while idle
        if (wasSprinting !== this.player.isSprinting) {
            this.updatePlayerPosition();

            // Mid-Tile Speed Recalibration (Immediate speed change without visual snap)
            if (this.player.isMoving) {
                const now = Date.now();
                const oldSpeed = wasSprinting ? 170 : this.player.moveSpeed;
                const newSpeed = this.player.isSprinting ? 170 : this.player.moveSpeed;
                const progressPercent = (now - this.player.moveStartedAt) / oldSpeed;

                // Recalculate start time so the character stays at the same relative position
                this.player.moveStartedAt = now - (progressPercent * newSpeed);
                this.player.currentMoveSpeed = newSpeed;
            }
        }

        if (this.player.isMoving) return;

        const move = { x: 0, y: 0 };
        const keys = Array.from(this.keysPressed);

        // Prioritize last key or specific order
        if (this.keysPressed.has('w') || this.keysPressed.has('arrowup')) move.y = -1;
        else if (this.keysPressed.has('s') || this.keysPressed.has('arrowdown')) move.y = 1;
        else if (this.keysPressed.has('a') || this.keysPressed.has('arrowleft')) move.x = -1;
        else if (this.keysPressed.has('d') || this.keysPressed.has('arrowright')) move.x = 1;

        if (move.x !== 0 || move.y !== 0) {
            this.tryMove(move.x, move.y);
        }
    },

    tryMove(dx, dy) {
        if (this.isDialogueActive || this.player.isMoving) return;

        // 1. Identify Target Direction
        let targetDir = this.player.direction;
        if (dx > 0) targetDir = 'right';
        if (dx < 0) targetDir = 'left';
        if (dy > 0) targetDir = 'down';
        if (dy < 0) targetDir = 'up';

        // Dynamic Turn Delay (Reduced for sprinting to improve responsiveness)
        const turnDelay = this.player.isSprinting ? 10 : 60;

        // 2. Turn-in-place Logic
        if (this.player.direction !== targetDir) {
            this.player.direction = targetDir;
            this.lastTurnTime = Date.now();
            this.player.isTurning = true;
            this.updatePlayerPosition();

            // Temporary turning visual effect (matched to turnDelay)
            setTimeout(() => {
                this.player.isTurning = false;
                this.updatePlayerPosition();
            }, turnDelay);
            return;
        }

        // 3. Movement Delay Logic (Turn-then-Walk Smoothing)
        // If we just turned, wait before allowing move
        const now = Date.now();
        if (now - this.lastTurnTime < turnDelay) {
            return;
        }

        // 4. Movement Logic (only runs if already facing targetDir and delay passed)

        const nextX = this.player.x + dx;
        const nextY = this.player.y + dy;
        const zone = this.zones[this.currentZone];

        // Bounds Check
        if (nextX < 0 || nextX >= zone.width || nextY < 0 || nextY >= zone.height) return;

        // Wall Check (Tile classes)
        const tiles = document.querySelectorAll('#overworld-map .tile');
        const targetTileIndex = nextY * zone.width + nextX;
        const targetTile = tiles[targetTileIndex];

        if (!targetTile || targetTile.classList.contains('wall')) {
            // Restore Auto-Open Logic
            if (targetTile && targetTile.classList.contains('door-tile')) {
                // --- NEW: Block doors during timed quests ---
                if (this.activeTimedQuestId) {
                    // Just block movement without the time-wasting dialogue pop-up
                    this.updatePlayerPosition();
                    return;
                }

                const tileID = zone.layout[nextY][nextX];
                const doorMap = { 20: 21, 22: 23, 24: 26, 25: 27, 39: 34, 40: 35, 41: 36, 42: 37 };
                const isLocked = [28, 29, 30, 31].includes(tileID);

                if (doorMap[tileID]) {
                    // check if this tile has a transition with a flag
                    const door = zone.doors && zone.doors.find(d => d.x === nextX && d.y === nextY);
                    const isStoryLocked = door && door.requiredFlag && !window.gameState.storyFlags[door.requiredFlag] && !window.gameState.debugUnlockDoors;
                    const missingItems = door ? (door.requiredItems || (door.requiredItem ? [door.requiredItem] : [])).filter(id => !window.gameState.items.includes(id)) : [];
                    const isItemLocked = door && missingItems.length > 0 && !window.gameState.debugUnlockDoors && !window.gameState.debugAllItems;

                    if (!isLocked && !isStoryLocked && !isItemLocked) {
                        // Clear all potential door visual classes (original and potentially swapped locked versions)
                        const lockedMap = { 20: 29, 22: 28, 24: 30, 25: 31 };
                        targetTile.classList.remove('wall', `t-${tileID}`, `t-${lockedMap[tileID]}`);
                        targetTile.classList.add('floor', `t-${doorMap[tileID]}`);
                    } else {
                        // Trigger the dialogue if it's a story lock or a hard lock
                        this.interact(); // Use interact to show the locked message
                        this.updatePlayerPosition();
                        return;
                    }
                } else {
                    this.updatePlayerPosition();
                    return;
                }
            } else {
                this.updatePlayerPosition();
                return;
            }
        }

        // Object Collision Check (Priority: Kickable > Colliding > Hidden)
        const allCandidates = zone.objects.filter(obj => {
            if (!this.isObjectVisible(obj)) return false;
            const vx = this.getVisualX(obj);
            const w = obj.width || 1;
            const h = obj.height || 1;
            return nextX >= vx && nextX < vx + w && nextY >= obj.y && nextY < obj.y + h;
        });

        // For interactions (kicking/breaking), we only target non-moving objects.
        const interactableCandidates = allCandidates.filter(obj => !obj.isKicking);

        // 1. Identify Collision Blockers vs Interactables
        // Movement Blocking (Ignore objects flying away so the player can move into the tile)
        const isPathBlocked = interactableCandidates.some(o => {
            const m = this.getFurnitureMeta(o.id, o.customSprite);
            return !m || m.hasCollision !== false;
        });

        // Interaction Shielding (Include objects flying away so you can't 'reach through' them)
        const isTileShielded = allCandidates.some(o => {
            const m = this.getFurnitureMeta(o.id, o.customSprite);
            return !m || m.hasCollision !== false;
        });

        const bestInteractable = interactableCandidates
            .filter(o => {
                const m = this.getFurnitureMeta(o.id, o.customSprite);
                return (o.temp === true || (o.id && o.id.includes('_wild_')) || (m && (m.kickable === true || m.breakable === true)));
            })
            .sort((a, b) => {
                const ma = this.getFurnitureMeta(a.id, a.customSprite);
                const mb = this.getFurnitureMeta(b.id, b.customSprite);
                const scoreA = (!ma || ma.hasCollision !== false) ? 1 : 0;
                const scoreB = (!mb || mb.hasCollision !== false) ? 1 : 0;
                return scoreB - scoreA; // Solid objects first
            })[0];

        if (bestInteractable) {
            const m = this.getFurnitureMeta(bestInteractable.id, bestInteractable.customSprite);
            const interactableIsSolid = !m || m.hasCollision !== false;

            // --- SOLID SHIELDING ---
            if (!bestInteractable.isKicking && this.player.isSprinting) {
                // To trigger a sprint-kick, the part must be solid (interactableIsSolid).
                // The linkage system in kickObject will automatically handle non-solid partners.
                if (interactableIsSolid) {
                    this.kickObject(bestInteractable, dx, dy);
                    this.updatePlayerPosition();
                    return;
                }
            }
        }

        if (isPathBlocked) {
            this.updatePlayerPosition();
            return;
        }

        // 4. Perform Movement
        this.player.isMoving = true;
        this.player.moveStartedAt = Date.now();
        this.player.currentMoveSpeed = this.player.isSprinting ? 170 : this.player.moveSpeed;
        this.player.startX = this.player.x;
        this.player.startY = this.player.y;
        this.player.x = nextX;
        this.player.y = nextY;

        // Immediate proximity check to eliminate "entry lag"
        this.checkProximityTriggers();

        // Start Step Visuals (Idle Frame)
        this.player.currentFrame = this.player.stepParity * 2;
        this.updatePlayerPosition();

        // Spawn Footstep VFX & Audio
        const tileAtPos = zone.layout[nextY][nextX];
        const tag = TILE_MATERIAL_MAP[tileAtPos] || zone?.footstepTag || 'tile';
        this.spawnFootstep(this.player.x - dx, this.player.y - dy, this.player.isSprinting, tag);
        AudioManager.playFootstep(tag);
    },

    handleAutomatedInteractions() {
        const zone = this.zones[this.currentZone];
        if (!zone) return;

        const nextX = this.player.x;
        const nextY = this.player.y;

        // CHECK FOR ZONE TRANSITION
        const door = zone.doors && zone.doors.find(d => d.x === nextX && d.y === nextY);
        if (door) {
            const isLockedByFlag = door.requiredFlag && !window.gameState.storyFlags[door.requiredFlag] && !window.gameState.debugUnlockDoors;
            const missingItems = (door.requiredItems || (door.requiredItem ? [door.requiredItem] : [])).filter(item => !window.gameState.items.includes(item));
            const isLockedByItem = missingItems.length > 0 && !window.gameState.debugUnlockDoors && !window.gameState.debugAllItems;

            if (isLockedByFlag || isLockedByItem) {
                let msg = "This door is locked. You need specific clearance.";
                if (isLockedByItem) {
                    const names = missingItems.map(id => {
                        const itemData = window.ITEM_PICKUP_DATA && window.ITEM_PICKUP_DATA[id];
                        return itemData ? itemData.name : id;
                    });
                    msg = `This door is locked. You need: ${names.join(', ')}.`;
                }
                this.showDialogue("Security Gate", [msg]);
                return;
            }
            this.changeZone(door.targetZone, door.targetX, door.targetY);
        }
    },

    async changeZone(zoneId, x, y) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.player.sprintDistance = 0; // Reset momentum on zone change
        console.log(`Changing Zone to: ${zoneId}`);

        const overlay = document.getElementById('zone-transition-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            // Force reflow to ensure transition works if it was just unhidden
            void overlay.offsetWidth;
            overlay.classList.add('active');
            // Wait for fade-out to black (0.3s)
            await new Promise(r => setTimeout(r, 300));
        }


        // (Previously this.keysPressed.clear() was here to prevent immediate move, 
        // but it caused sprinting state to be lost. Resuming naturally is the desired behavior.)

        // 1. CLEANUP OLD ZONE SPAWNS (while currentZone is still the old zone)
        this.spawner.stop();
        this.spawner.cleanupTempObjects();

        // 2. Perform the actual map swap while screen is black (updates currentZone)
        this.renderMap(zoneId, false, x, y);

        // 3. START NEW ZONE SPAWNS (in the now-updated currentZone)
        this.spawner.start();

        if (overlay) {

            // Small buffer to ensure rendering is complete
            await new Promise(r => setTimeout(r, 100));
            overlay.classList.remove('active');
            // Wait for fade-in back to game (0.3s)
            await new Promise(r => setTimeout(r, 300));
            overlay.classList.add('hidden');
        }

        this.isTransitioning = false;
    },

    // --- TIMED QUEST ENGINE ---

    async startTimedQuest(qId, npc) {
        if (this.activeTimedQuestId) return;
        const qData = QUESTS[qId];
        if (!qData || !qData.timeLimit) return;

        console.log(`Starting Timed Quest: ${qId}`);

        // 1. Initial State
        const qProgress = window.gameState.quests[qId];
        qProgress.status = 'started';
        qProgress.progress = 0;
        // Record origin for teleport back on failure
        qProgress.origin = {
            zone: this.currentZone,
            x: this.player.x,
            y: this.player.y
        };
        if (gameState.settings?.autoSave) saveGameState();

        try {
            // 2. Quick Fade Transition & Map Reset
            if (window.triggerQuickTransition) {
                await window.triggerQuickTransition(async () => {
                    // Clear map of pre-existing wild monsters for a clean challenge start
                    this.spawner.stop();
                    this.spawner.cleanupTempObjects();

                    this.isStartingQuest = true;
                    this.activeTimedQuestId = qId;
                    this.timedQuestElapsed = 0;
                    this.questNPCAttached = npc;

                    // Re-render to show locked door visuals while the screen is black
                    this.renderMap(this.currentZone, true, this.player.x, this.player.y);
                });
            } else {
                this.spawner.stop();
                this.spawner.cleanupTempObjects();
                this.isStartingQuest = true;
                this.activeTimedQuestId = qId;
                this.timedQuestElapsed = 0;
                this.questNPCAttached = npc;

                // Re-render to show locked door visuals during the transition
                this.renderMap(this.currentZone, true, this.player.x, this.player.y);
            }

            // 3. Start 3-2-1 Countdown
            const countdownEl = document.getElementById('quest-countdown-overlay');
            const timerHud = document.getElementById('quest-timer-hud');

            if (countdownEl) {
                countdownEl.classList.remove('hidden');
                const sequence = ['3', '2', '1', 'GO!'];
                for (const step of sequence) {
                    countdownEl.textContent = step;
                    countdownEl.classList.remove('stomp');
                    void countdownEl.offsetWidth; // Force reflow
                    countdownEl.classList.add('stomp');
                    await new Promise(r => setTimeout(r, 800));
                }
                countdownEl.classList.add('hidden');
                countdownEl.classList.remove('stomp');
            }

            this.isStartingQuest = false;
            if (timerHud) timerHud.classList.remove('hidden');

            // --- NEW: Dynamic UI Labeling ---
            const labelEl = document.getElementById('quest-label-objective');
            if (labelEl) {
                labelEl.textContent = qData.uiLabel || 'Target Count';
            }

            // --- NEW: Post-Countdown Synchronization ---
            // 1. Reset start time to NOW (so countdown doesn't consume quest time)
            qProgress.startTime = Date.now();
            if (gameState.settings?.autoSave) saveGameState();

            // 2. Trigger immediate spawner restart
            this.spawner.start();

            // 3. Force-spawn exactly 5 monsters immediately for a "hot" start
            const initialBurst = 5;
            const zone = this.zones[this.currentZone];
            const maxSpawns = (zone && zone.maxWildSpawns) || 1;

            for (let i = 0; i < Math.min(initialBurst, maxSpawns); i++) {
                this.spawner.spawnWildMonster();
            }
        } finally {
            // Guarantee interaction lock is released even on error
            this.isStartingQuest = false;
        }
    },

    updateTimedQuest() {
        if (!this.activeTimedQuestId || this.isStartingQuest || this.isPaused || this.isTransitioning) return;

        const qId = this.activeTimedQuestId;
        const qData = QUESTS[qId];
        const qProgress = window.gameState.quests[qId];

        // 1. Check for Completion (Done externally in updateQuestProgress, but we check status here)
        if (qProgress.status === 'completed' || qProgress.status === 'finished') {
            if (window.triggerQuickTransition) {
                window.triggerQuickTransition(async () => {
                    this.cleanupTimedQuest();
                    // Re-render to ensure a perfect clean map
                    this.renderMap(this.currentZone, false, this.player.x, this.player.y);
                    this.spawner.start();
                });
            } else {
                this.cleanupTimedQuest();
                this.spawner.start();
            }
            return;
        }

        // 2. Track Time
        const now = Date.now();
        const diff = (now - qProgress.startTime) / 1000;
        const remaining = Math.max(0, qData.timeLimit - diff);

        // 3. Update HUD
        const timerValue = document.getElementById('quest-timer-value');
        const timerHud = document.getElementById('quest-timer-hud');
        const progressValue = document.getElementById('quest-progress-value');

        if (timerValue) {
            const mins = Math.floor(remaining / 60);
            const secs = Math.floor(remaining % 60);
            timerValue.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        if (progressValue) {
            progressValue.innerText = `${qProgress.progress || 0} / ${qData.amount}`;
        }

        if (timerHud) {
            if (remaining <= 10) {
                timerHud.classList.add('danger');
            } else {
                timerHud.classList.remove('danger');
            }
        }

        // 4. Handle Timeout
        if (remaining <= 0) {
            this.failTimedQuest();
        }
    },

    async failTimedQuest() {
        if (!this.activeTimedQuestId) return;
        const qId = this.activeTimedQuestId;
        const qData = QUESTS[qId];
        const qProgress = window.gameState.quests[qId];
        const npc = this.questNPCAttached;

        console.log(`Timed Quest FAILED: ${qId}`);
        this.isPaused = true; // Lock player during failure sequence

        // 1. Mark State
        qProgress.status = 'timed_out';
        if (gameState.settings?.autoSave) saveGameState();

        // 2. Fade to black and Teleport Back
        if (window.triggerQuickTransition) {
            await window.triggerQuickTransition(async () => {
                this.cleanupTimedQuest(); // Clear ID before re-rendering original zone
                if (qProgress.origin) {
                    this.renderMap(qProgress.origin.zone, false, qProgress.origin.x, qProgress.origin.y);

                    // Face the NPC for realism
                    if (npc) {
                        if (npc.y < qProgress.origin.y) this.player.direction = 'up';
                        else if (npc.y > qProgress.origin.y) this.player.direction = 'down';
                        else if (npc.x < qProgress.origin.x) this.player.direction = 'left';
                        else if (npc.x > qProgress.origin.x) this.player.direction = 'right';

                        this.player.currentFrame = (this.player.stepParity * 2);
                        this.updatePlayerPosition();
                    }
                }
            });
        }

        this.spawner.start(); // Restart spawning in original zone

        this.isPaused = false;
        this.activeTimedQuestId = null;

        // 3. Auto-trigger Dialogue
        if (npc) {
            const timeoutDialogue = qData.dialogue.failed || qData.dialogue.timeout || ["You ran out of time! Come back when you're faster."];
            this.showDialogue(npc.name, timeoutDialogue, npc.id);
        }
    },

    cleanupTimedQuest(clearId = true) {
        if (clearId) this.activeTimedQuestId = null;
        this.isStartingQuest = false;
        this.questNPCAttached = null;

        // Perform deep cleanup of wild monsters
        this.spawner.stop();
        this.spawner.cleanupTempObjects();

        const timerHud = document.getElementById('quest-timer-hud');
        if (timerHud) {
            timerHud.classList.add('hidden');
            timerHud.classList.remove('low-time');
        }
        const countdownEl = document.getElementById('quest-countdown-overlay');
        if (countdownEl) countdownEl.classList.add('hidden');
    },

    updatePlayerPosition() {
        const playerEl = document.getElementById('player-sprite');
        const mapEl = document.getElementById('overworld-map');
        const viewport = document.getElementById('overworld-viewport');
        const zone = this.zones[this.currentZone];

        if (playerEl) {
            // 0. Update Visual States (Only sprint visually if both moving and holding key, OR if locked during hitstop)
            if (this.player.isSprinting && (this.player.isMoving || this.player.isHitstopping)) playerEl.classList.add('is-sprinting');
            else playerEl.classList.remove('is-sprinting');

            if (this.player.isTurning) playerEl.classList.add('is-turning');
            else playerEl.classList.remove('is-turning');

            // 1. Update Direction Class
            const directionClass = `face-${this.player.direction}`;
            if (!playerEl.classList.contains(directionClass)) {
                playerEl.classList.remove('face-up', 'face-down', 'face-left', 'face-right');
                playerEl.classList.add(directionClass);
            }

            // 2. Update Visual Frame
            playerEl.classList.remove('p-frame-0', 'p-frame-1', 'p-frame-2', 'p-frame-3');
            playerEl.classList.add(`p-frame-${this.player.currentFrame}`);

            // 3. Move Player (Manual Interpolation)
            let visualX = this.player.x;
            let visualY = this.player.y;

            if (this.player.isMoving) {
                const now = Date.now();
                const p = (now - this.player.moveStartedAt) / this.player.currentMoveSpeed;
                const progress = Math.min(Math.max(p, 0), 1);

                visualX = this.player.startX + (this.player.x - this.player.startX) * progress;
                visualY = this.player.startY + (this.player.y - this.player.startY) * progress;
            }

            playerEl.style.translate = `${visualX * this.tileSize}px ${visualY * this.tileSize}px`;
            playerEl.style.scale = this.player.isTurning ? '1.07' : '1';
            playerEl.style.transformOrigin = 'center 80%'; // Center relative to feet for a grounding pop
            playerEl.style.zIndex = Math.round(visualY) + 1 + 10;
        }

        // 2. Update Map Position (Camera Follow)
        const vWidth = viewport.clientWidth;
        const vHeight = viewport.clientHeight;

        // Target: Center the player in the viewport
        // Target: Center the player in the viewport (Pokemon-style strict focus)
        let mapX = (vWidth / 2) - (this.player.x * this.tileSize + this.tileSize / 2);
        let mapY = (vHeight / 2) - (this.player.y * this.tileSize + this.tileSize / 2);

        // Active Camera Lead (Shift focus in direction of travel)
        if (this.player.isMoving) {
            const leadDistance = 50; // Balanced cinematic shift
            if (this.player.direction === 'up') mapY += leadDistance;
            if (this.player.direction === 'down') mapY -= leadDistance;
            if (this.player.direction === 'left') mapX += leadDistance;
            if (this.player.direction === 'right') mapX -= leadDistance;
        }

        // No Clamping: User wants character to stay visually static at all times.
        // This means the environment will move even at edges, showing the viewport background.

        mapEl.style.transform = `translate(${mapX}px, ${mapY}px)`;
    },

    interact() {
        const gameOverVisible = document.getElementById('game-over-overlay') && !document.getElementById('game-over-overlay').classList.contains('hidden');

        // Allow interaction if dialogue is active (to advance it), even if paused/transitioning
        if (!this.isDialogueActive) {
            if (this.isPaused || this.isTransitioning || gameOverVisible) return;
        }

        const now = Date.now();
        if (now - this.lastInteractTime < 150) return;

        // Safety: Don't interact with something currently being kicked (e.g. during hitstop)
        const zone = this.zones[this.currentZone];
        let interactX = this.player.x;
        let interactY = this.player.y;
        if (this.player.direction === 'up') interactY--;
        if (this.player.direction === 'down') interactY++;
        if (this.player.direction === 'left') interactX--;
        if (this.player.direction === 'right') interactX++;
        const targetObstacle = zone && zone.objects.find(o => {
            const vx = this.getVisualX(o);
            const w = o.width || 1;
            const h = o.height || 1;
            return interactX >= vx && interactX < vx + w && interactY >= o.y && interactY < o.y + h;
        });
        if (targetObstacle && targetObstacle.isKicking) return;

        this.lastInteractTime = now;

        if (this.isDialogueActive) {
            if (this.isTyping) {
                // Instant Complete
                this.finishTyping();
            } else {
                this.nextDialogue();
            }
            return;
        }

        let targetX = this.player.x;
        let targetY = this.player.y;

        if (this.player.direction === 'up') targetY--;
        if (this.player.direction === 'down') targetY++;
        if (this.player.direction === 'left') targetX--;
        if (this.player.direction === 'right') targetX++;

        // 1. Check for NPCs and Wild Monsters
        const npc = zone.objects.find(obj => {
            if (!this.isObjectVisible(obj)) return false;
            return obj.type === 'npc' && obj.x === targetX && obj.y === targetY;
        });

        if (npc) {
            if (npc.id.includes('_wild_')) {
                const mName = npc.monsterId.charAt(0).toUpperCase() + npc.monsterId.slice(1);

                const zone = this.zones[this.currentZone];
                if (zone.disableBattle) {
                    this.showDialogue(mName, [`A wild ${mName} is wandering. It seems peaceful.`]);
                    return;
                }

                this.spawner.stop(); // Stop wild spawns when interacting with one
                if (this.checkActiveSquad()) {
                    this.battleSourceZone = this.currentZone; // TRACK SOURCE ZONE
                    this.pendingWildEncounter = true;
                    this.pendingWildMonsterId = npc.monsterId;
                    this.pendingWildInstanceId = npc.id; // SAVE THE BARCODE
                    this.showDialogue(mName, [`A wild ${mName} is wandering.`]);
                } else {
                    this.showDialogue(mName, [`A wild ${mName} is wandering. You need an active squad to engage!`]);
                }
                return;
            } else {
                this.startNPCInteraction(npc);
                return;
            }
        }

        // 2. Check for Furniture / Props (Discovery vs. Lore)
        const obj = zone.objects.find(o => {
            if (!this.isObjectVisible(o)) return false;
            const vx = this.getVisualX(o);
            const w = o.width || 1;
            const h = o.height || 1;
            return (['prop', 'cell', 'sign', 'atrium_statue'].includes(o.type) || o.id === 'incubator') &&
                targetX >= vx && targetX < vx + w &&
                targetY >= o.y && targetY < o.y + h;
        });

        if (obj) {
            const meta = this.getFurnitureMeta(obj.id, obj.customSprite);
            if (meta && meta.hasCollision === false && !['f38', 'f39', 'f40', 'f41'].some(id => obj.id.startsWith(id))) {
                // Ignore interaction with non-collidable parts (tops of tanks/skeletons etc)
                // Note: Keeping incubators interactable as exceptions for height
                return;
            }

            // 1. Unified Systematic Reward (Hiding Spot Tracking)
            if (obj.hiddenReward && window.gameState) {
                // Use unique suffix for spotId if it exists to group multi-tile props
                const suffixMatch = obj.id?.match(/_([a-z0-9]{10,})$/);
                const spotId = suffixMatch ?
                    `${this.currentZone}_${suffixMatch[1]}` :
                    `${this.currentZoneId || this.currentZone}_${obj.x}_${obj.y}`;

                if (!window.gameState.lootedSpots.includes(spotId)) {
                    this.pendingItemPickup = obj.hiddenReward;
                    this.pendingItemSpotId = spotId;
                    this.showDialogue('Discovery', ['You found something hidden!']);
                    return;
                }
            }

            // Legacy Item/Log Collection Logic
            if (obj.hiddenLogId && !this.logsCollected.includes(obj.hiddenLogId)) {
                this.pendingItemPickup = obj.hiddenLogId;
                this.showDialogue('Discovery', ['You found an item!']);
                return;
            }
            if (obj.hiddenItemId && window.gameState && !window.gameState.items.includes(obj.hiddenItemId)) {
                this.pendingItemPickup = obj.hiddenItemId;
                this.showDialogue('Discovery', [obj.type === 'cell' ? 'You found a Cell!' : 'You found an item!']);
                return;
            }

            // Special Interactive Prop Check (Incubator / Vending Machine / Bio-Extractor)
            if (meta && (meta.triggerHeal || meta.triggerShop || meta.triggerBioExtract)) {
                if (meta.triggerHeal) this.pendingIncubatorMenu = true;
                if (meta.triggerShop) this.pendingShopMenu = true;
                if (meta.triggerBioExtract) this.pendingBioExtractMenu = true;

                const templateDisplayName = meta.name;
                const title = templateDisplayName || (meta.triggerBioExtract ? "Bio-Extractor" : (meta.triggerShop ? "Vending Machine" : "Incubator Unit"));
                const text = meta.triggerBioExtract ?
                    ["BIO-EXTRACTOR: [BIO-EXTRACTION PROTOCOLS ACTIVE]", "Authorized biological materials detected.", "Initiate extraction sequence?"] :
                    (meta.triggerShop ?
                        ["ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]", "Please follow technical safety guidelines."] :
                        ["Biological maintenance system online.", "Awaiting operator authorization..."]);

                this.showDialogue(title, text);
                return;
            }

            // CellAccelerator Interaction
            const baseID = obj.id.includes('_') ? obj.id.split('_')[0] : obj.id;
            const acceleratorIds = ['f92', 'f93', 'f94', 'f95', 'f96', 'f97', 'f98', 'f99', 'f100'];
            if (acceleratorIds.includes(baseID)) {
                this.pendingSynthesisMenu = true;
                this.showDialogue("Cell Accelerator", ["CELL-ACC TERMINAL: [SYNTHESIS PROTOCOLS ACTIVE]", "Ensure biological requirements are met before initialization."]);
                return;
            }

            // Normal Lore Inspection
            const templateName = meta?.name;
            const displayName = templateName || obj.name || "Laboratory Asset";

            if (meta && meta.info) {
                const infoLines = Array.isArray(meta.info) ? meta.info : [meta.info];
                this.showDialogue(displayName, infoLines);
            } else {
                // Fallback for objects without metadata
                this.showDialogue(displayName, [
                    `System initializing for: ${displayName}...`,
                    `This biological entity is currently under observation.`,
                    `Please consult Director Capsain for further clearance.`
                ]);
            }
            return;
        }

        // 3. Tile Interaction (Special Locked Messages)
        // --- NEW: Timed Quest Lockdown Message ---
        if (this.activeTimedQuestId) {
            const tiles = document.querySelectorAll('#overworld-map .tile');
            const targetTileIndex = targetY * zone.width + targetX;
            const targetTile = tiles[targetTileIndex];
            if (targetTile && targetTile.classList.contains('door-tile')) {
                this.showDialogue("Security Protocol", [
                    "PROTOCOL LOCKDOWN ACTIVE: [LEVEL 4 ENFORCEMENT]",
                    "All sector exits are sealed until current performance diagnostics are complete.",
                    "Please return to the test area immediately."
                ]);
                return;
            }
        }

        if (targetX >= 0 && targetX < zone.width && targetY >= 0 && targetY < zone.height) {
            const door = zone.doors && zone.doors.find(d => d.x === targetX && d.y === targetY);
            if (door) {
                const isLockedByFlag = door.requiredFlag && !window.gameState.storyFlags[door.requiredFlag] && !window.gameState.debugUnlockDoors;
                const missingItems = (door.requiredItems || (door.requiredItem ? [door.requiredItem] : [])).filter(item => !window.gameState.items.includes(item));
                const isLockedByItem = missingItems.length > 0 && !window.gameState.debugUnlockDoors && !window.gameState.debugAllItems;

                if (isLockedByFlag || isLockedByItem) {
                    let msg = "This door is locked. You need specific clearance.";
                    if (isLockedByItem) {
                        const names = missingItems.map(id => {
                            const itemData = window.ITEM_PICKUP_DATA && window.ITEM_PICKUP_DATA[id];
                            return itemData ? itemData.name : id;
                        });
                        msg = `This door is locked. You need: ${names.join(', ')}.`;
                    }

                    // Special Overrides for Flavor
                    if (this.currentZone === 'atrium' && targetX === 0 && targetY === 4) {
                        msg = "Botanic Sector Gate: Someone is shouting at a fern inside. The voice is bossy but... cute.";
                    } else if (this.currentZone === 'atrium' && targetX === 18 && targetY === 4) {
                        msg = "Human Ward Gate: A rhythmic snoring vibrates the door. It smells like sea salt and deep-cycle naps.";
                    } else if (this.currentZone === 'atrium' && targetX === 9 && targetY === 2) {
                        msg = "Executive Suite Gate: An intimidatingly professional silence. Smells like antacids and expensive noodles.";
                    }

                    this.showDialogue("Security Gate", [msg]);
                    return;
                }
                // If the door is found and is NOT locked, we return early
                // to prevent falling through to generic tileID based locked messages.
                return;
            }

            const tileID = zone.layout[targetY][targetX];
            const lockedTiles = [20, 22, 24, 25, 28, 29, 30, 31];

            if (lockedTiles.includes(tileID)) {
                // Check visual state to see if it's already open (has floor class)
                const tiles = document.querySelectorAll('#overworld-map .tile');
                const targetTileIndex = targetY * zone.width + targetX;
                const targetTile = tiles[targetTileIndex];
                if (targetTile && targetTile.classList.contains('floor')) {
                    return;
                }

                // Check if it's the Atrium WC (coordinates 13,10 or 14,10 in Atrium)
                const isAtriumWC = this.currentZone === 'atrium' && targetY === 14 && (targetX === 13 || targetX === 14);

                if (isAtriumWC) {
                    this.showDialogue("Restroom Facility", [
                        "A stray Nitrophyl broke the pipes again.",
                        "Staff are 'regrettably' skipping sanitation protocols until it's fixed."
                    ]);
                } else {
                    this.showDialogue("Security Gate", [
                        "This door is locked.",
                        "Access is restricted until your credentials are bio-authenticated."
                    ]);
                }
            }
        }
    },

    isQuestTargetMatch(targetId, npc) {
        if (!targetId || !npc || !npc.id) return false;
        const normalizedTarget = String(targetId).toLowerCase();
        const normalizedNpcId = String(npc.id).toLowerCase();

        // Match if: 
        // 1. Exact match
        // 2. NPC starts with target (e.g., lana_moved starts with lana)
        // 3. Target starts with NPC (e.g., dyzes_boss starts with dyzes)
        return (normalizedNpcId === normalizedTarget) ||
            (normalizedNpcId.startsWith(normalizedTarget)) ||
            (normalizedTarget.startsWith(normalizedNpcId));
    },

    startNPCInteraction(npcOrId, isFailure = false, isPostBattle = false) {
        const bossWon = isPostBattle ? !isFailure : false;

        let npc = npcOrId;
        if (typeof npcOrId === 'string') {
            const zone = this.zones[this.currentZone];
            if (zone) {
                npc = zone.objects.find(o => o.id === npcOrId || o.battleEncounterId === npcOrId);
            }
        }
        if (!npc) {
            console.warn(`NPC interaction requested for non-existent NPC: ${npcOrId}`);
            if (typeof this.onDialogueComplete === 'function') {
                const cb = this.onDialogueComplete;
                this.onDialogueComplete = null;
                cb();
            }
            return;
        }

        console.log(`Talking to: ${npc.name}${bossWon ? ' (BOSS WON)' : ''} | PostBattle: ${isPostBattle}`);
        this.currentDialoguePartner = npc.id;

        // Make NPC face the player, and Player face the NPC
        const oppDirections = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };

        // Calculate player facing based on relative position
        const dx = npc.x - this.player.x;
        const dy = npc.y - this.player.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            this.player.direction = dx > 0 ? 'right' : 'left';
        } else if (dy !== 0) {
            this.player.direction = dy > 0 ? 'down' : 'up';
        }
        this.updatePlayerPosition(); // Visual sync
        npc.direction = oppDirections[this.player.direction] || 'down';

        const npcEl = document.getElementById(`npc-${npc.id}`);
        if (npcEl) {
            npcEl.classList.remove('face-up', 'face-down', 'face-left', 'face-right');
            npcEl.classList.add(`face-${npc.direction}`);
        }

        const logs = this.logsCollected.length;
        let lines = ["..."];
        this.pendingBattleEncounter = null;

        // --- PHASE 1: SYSTEMATIC QUEST RESOLVER ---
        if (window.gameState && window.gameState.quests) {
            const questQueue = npc.quests || (npc.sideQuestId ? [npc.sideQuestId] : []);
            let activeQuestId = null;
            let activeQuestData = null;
            let activeQuestProgress = null;

            // 1.1 Priority: Check for Turn-Ins
            for (const qId of questQueue) {
                const qData = QUESTS[qId];
                const qProgress = window.gameState.quests[qId];
                if (qData && qProgress && qProgress.status === 'completed') {
                    activeQuestId = qId;
                    activeQuestData = qData;
                    activeQuestProgress = qProgress;
                    break;
                }
            }

            // 1.2 Priority: Check for New Offers or Ongoing
            if (!activeQuestId) {
                for (const qId of questQueue) {
                    const qData = QUESTS[qId];
                    if (!qData) continue;
                    const qProgress = window.gameState.quests[qId];

                    if (qData.requiredFlag && !window.gameState.storyFlags[qData.requiredFlag]) continue;
                    if (qData.requiredItem) {
                        const hasReq = (window.gameState.items || []).some(i => String(i).toLowerCase() === String(qData.requiredItem).toLowerCase()) ||
                            (window.gameState.logs || []).some(l => String(l).toLowerCase() === String(qData.requiredItem).toLowerCase());
                        if (!hasReq) continue;
                    }
                    if (qData.requiredRG && (window.gameState.profiles.player.level || 0) < qData.requiredRG) continue;
                    if (qProgress && qProgress.status === 'finished') {
                        if (qData.dialogue.finished) lines = qData.dialogue.finished;
                        continue;
                    }

                    activeQuestId = qId;
                    activeQuestData = qData;
                    activeQuestProgress = qProgress;
                    break;
                }
            }

            // 1.3 Execution Logic
            if (activeQuestId && activeQuestData) {
                const qId = activeQuestId;
                const qData = activeQuestData;
                const qProgress = activeQuestProgress;

                // Systematic Post-Battle Win/Loss Handling for Defeat Quests
                if (isPostBattle && qData.type === 'defeat' && this.isQuestTargetMatch(qData.target, npc)) {
                    if (bossWon) {
                        if (qProgress && qProgress.status === 'started') {
                            qProgress.status = 'completed';
                            window.dispatchEvent(new CustomEvent('quest-updated'));
                            console.log(`[Quest] Defeat objective met for ${qId}. Status updated to 'completed'.`);
                        }
                    } else {
                        // Player Lost: Show failure lines and EXIT to prevent Case D from re-triggering the battle
                        const fLines = qData.dialogue.failed || ["Diagnostic failed. Return when your sync is optimized!"];
                        this.showDialogue(npc.name, fLines, npc.id);
                        return;
                    }
                }

                // Case A: New Offer
                if (!qProgress) {
                    const targetId = String(qData.target).toLowerCase();
                    const hasTarget = (window.gameState.items || []).some(i => String(i).toLowerCase() === targetId) ||
                        (window.gameState.logs || []).some(l => String(l).toLowerCase() === targetId);

                    window.gameState.quests[qId] = {
                        status: 'started',
                        progress: hasTarget ? 1 : 0,
                        offerSeen: true
                    };

                    if (gameState.settings?.autoSave) saveGameState();

                    let offerLines = qData.dialogue.offer;
                    // Support Requirement-Aware Offers
                    if (qData.dialogue.offer_completed) {
                        if (qData.type === 'collect' && hasTarget) {
                            offerLines = qData.dialogue.offer_completed;
                        } else if (qData.type === 'defeat' && qData.requiredLogs && logs >= qData.requiredLogs) {
                            offerLines = qData.dialogue.offer_completed;
                        }
                    }

                    this.showDialogue(npc.name, offerLines, npc.id);

                    // If offering a defeat quest and requirements are already met, trigger battle immediately
                    if (offerLines === qData.dialogue.offer_completed && qData.type === 'defeat' && this.isQuestTargetMatch(qData.target, npc)) {
                        this.pendingBattleEncounter = qData.target;
                    }

                    if (qData.timeLimit) {
                        this.onDialogueComplete = () => this.startTimedQuest(qId, npc);
                        this.isStartingQuest = true;
                    }
                    return;
                }

                // Case B: Retry Failed
                if (qProgress.status === 'failed' || qProgress.status === 'timed_out') {
                    const retryLines = qData.dialogue.retry || ["Diagnostic failed. Ready to sync again?"];
                    this.showDialogue(npc.name, retryLines, npc.id);
                    this.onDialogueComplete = () => this.startTimedQuest(qId, npc);
                    this.isStartingQuest = true;
                    return;
                }

                // Case C: Turn-In
                if (qProgress.status === 'completed') {
                    // ATOMIC LOCK: Set finished and flags immediately to prevent reward exploits
                    qProgress.status = 'finished';
                    window.dispatchEvent(new CustomEvent('quest-updated'));
                    if (qData.onCompleteFlag) window.gameState.storyFlags[qData.onCompleteFlag] = true;

                    if (qData.consume && qData.type === 'collect') {
                        const idx = window.gameState.items.indexOf(qData.target);
                        if (idx > -1) window.gameState.items.splice(idx, 1);
                    }
                    this.onDialogueComplete = () => {
                        this.giveQuestReward(qId);
                        if (gameState.settings?.autoSave) saveGameState();
                        this.renderMap();
                    };
                    this.showDialogue(npc.name, qData.dialogue.complete, npc.id);
                    return;
                }

                // Case D: Ongoing/Progress
                if (qProgress.status === 'started') {
                    let readyNow = false;
                    if (qData.type === 'show_monster') {
                        readyNow = gameState.profiles.player.party.some(m => m && m.id === qData.target && (m.extractEfficiency || 0) >= (qData.minEfficiency || 0));
                    } else if (qData.type === 'collect') {
                        const targetId = String(qData.target).toLowerCase();
                        readyNow = (window.gameState.items || []).some(i => String(i).toLowerCase() === targetId) ||
                            (window.gameState.logs || []).some(l => String(l).toLowerCase() === targetId);
                    }

                    if (readyNow) {
                        if (qData.consume && qData.type === 'collect') {
                            const iIdx = window.gameState.items.indexOf(qData.target);
                            if (iIdx > -1) window.gameState.items.splice(iIdx, 1);
                            const lIdx = window.gameState.logs.indexOf(qData.target);
                            if (lIdx > -1) window.gameState.logs.splice(lIdx, 1);
                        }
                        // ATOMIC LOCK: Set finished and flags immediately to prevent reward exploits
                        qProgress.status = 'finished';
                        window.dispatchEvent(new CustomEvent('quest-updated'));
                        if (qData.onCompleteFlag) window.gameState.storyFlags[qData.onCompleteFlag] = true;

                        this.onDialogueComplete = () => {
                            this.giveQuestReward(qId);
                            if (gameState.settings?.autoSave) saveGameState();
                            this.renderMap();
                        };
                        this.showDialogue(npc.name, qData.dialogue.complete, npc.id);
                        return;
                    }

                    let pLines = qData.dialogue.progress || ["Keep working on that objective!"];
                    if (Array.isArray(pLines)) {
                        pLines = pLines.map(l => l.replace('{progress}', qProgress.progress).replace('{amount}', qData.amount));
                    }

                    // Systematic Battle Trigger for Defeat Quests
                    // Only trigger if NOT already in a post-battle interaction
                    if (!isPostBattle && qData.type === 'defeat' && this.isQuestTargetMatch(qData.target, npc)) {
                        if (!qData.requiredLogs || logs >= qData.requiredLogs) {
                            this.pendingBattleEncounter = qData.target;

                            // If requirement is met, prioritize offer_completed lines over progress lines
                            if (qData.dialogue.offer_completed) {
                                pLines = qData.dialogue.offer_completed;
                            }

                            this.showDialogue(npc.name, pLines, npc.id);
                            return;
                        }
                    }

                    this.showDialogue(npc.name, pLines, npc.id);
                    return;
                }

                // Case E: Finished
                if (qProgress.status === 'finished') {
                    if (qData.dialogue.finished && qData.dialogue.finished.length > 0) {
                        lines = qData.dialogue.finished;
                    }
                }
            }
        }

        // --- PHASE 2: BATTLE CHECK ---
        const encounterId = npc.battleEncounterId || npc.id;
        const isBattleDone = window.gameState && window.gameState.storyFlags && window.gameState.storyFlags[`battleDone_${encounterId}`];

        // --- PHASE 3: POST-BATTLE ---
        if (isPostBattle || isBattleDone) {
            const isNpcVictory = isPostBattle ? bossWon : window.gameState.storyFlags[`battleLost_${encounterId}`];
            if (isNpcVictory) {
                if (npc.npcWinDialogue) {
                    this.showDialogue(npc.name, npc.npcWinDialogue, npc.id);
                    return;
                }
            } else {
                if (npc.npcLossDialogue) {
                    this.showDialogue(npc.name, npc.npcLossDialogue, npc.id);
                    return;
                }
            }
        }

        // --- PHASE 4: NARRATIVE ENGINE LOOKUP (Fallback) ---
        const scriptData = NPC_SCRIPTS[npc.id];

        if (scriptData && (lines.length === 1 && lines[0] === "...")) {
            // 4.1 Fallback: Legacy Imperative getScript Logic
            const params = {
                isPostBattle,
                bossWon,
                isBattleDone,
                logs
            };

            const result = scriptData.getScript(window.gameState, this, params);

            if (result) {
                if (result.lines) lines = result.lines;
                if (result.pendingBattleEncounter) this.pendingBattleEncounter = result.pendingBattleEncounter;

                // Handle Script Triggers (Story Flags)
                if (result.triggers && Array.isArray(result.triggers)) {
                    result.triggers.forEach(flag => {
                        window.gameState.storyFlags[flag] = true;
                    });

                    // Special case: If a script trigger unlocks a sector, we re-render the map
                    const mapUpdateFlags = ['botanicSectorUnlocked', 'humanWardUnlocked', 'executiveSuiteUnlocked', 'jenziFirstBattleDone'];
                    if (result.triggers.some(f => mapUpdateFlags.includes(f))) {
                        this.renderMap();
                    }
                }

                // If a unique narrative script is found, we SKIP the universal battle-able check
                // to avoid overwriting or double-triggering.
                this.showDialogue(npc.name, lines, npc.id);
                return;
            }
        }

        // --- PHASE 5: UNIVERSAL FALLBACK DIALOGUE ---
        // If an NPC still has no lines after Quests, Battles, and Unique Scripts, 
        // we pull from the appropriate random pool to bring the world to life.
        if (lines.length === 1 && lines[0] === "...") {
            const fallbackType = (this.currentZone === 'cellPlayGround') ? 'playground_randomizer' : 'generic_staff';
            const fallbackScript = NPC_SCRIPTS[fallbackType];
            if (fallbackScript) {
                const fallbackResult = fallbackScript.getScript(window.gameState, this, {});
                if (fallbackResult && fallbackResult.lines) {
                    lines = fallbackResult.lines;
                }
            }
        }

        // --- NEW: UNIVERSAL BATTLE-ABLE SYSTEM ---
        // Fallback for simple NPCs defined in map files but NOT in NPC_SCRIPTS.
        if (npc.battleEncounterId && !isBattleDone && !isPostBattle) {
            if (this.checkActiveSquad()) {
                this.pendingBattleEncounter = npc.battleEncounterId;
                // If the NPC also has specific intro dialogue, use that instead of the pool
                if (npc.dialogue && Array.isArray(npc.dialogue)) {
                    lines = npc.dialogue;
                }
            } else {
                lines = ["You need an active squad to battle! Check the Incubator or your Inventory to deploy your Cells."];
            }
        }

        this.showDialogue(npc.name, lines, npc.id);
    },

    collectItem(itemId, spotId = null, isDiscovery = false) {
        console.log(`Collected Item: ${itemId} (Spot: ${spotId})`);
        this.updateQuestProgress('collect', itemId);

        // Register looted spot if using the unified system
        if (spotId && window.gameState) {
            if (!window.gameState.lootedSpots.includes(spotId)) {
                window.gameState.lootedSpots.push(spotId);
            }
        }

        const itemInfo = (window.ITEM_PICKUP_DATA && window.ITEM_PICKUP_DATA[itemId]) ? window.ITEM_PICKUP_DATA[itemId] : { type: 'item' };
        const itemType = itemInfo.type || (itemId.length === 3 && !isNaN(itemId) ? 'log' : 'item');

        if (itemType === 'log') {
            if (!this.logsCollected.includes(itemId)) {
                this.logsCollected.push(itemId);
                if (window.gameState) window.gameState.logs = [...this.logsCollected];
            }
        } else if (itemType === 'resource') {
            if (window.changeResource) {
                window.changeResource(itemInfo.resourceType === 'credits' ? 'lc' : 'bm', itemInfo.amount || 0, false, isDiscovery);
            }
        } else if (itemType === 'card') {
            if (window.gameState) {
                if (!window.gameState.items.includes(itemId)) {
                    window.gameState.items.push(itemId);
                }
            }
        } else if (itemType === 'blueprint') {
            if (window.gameState && !window.gameState.items.includes(itemId)) {
                window.gameState.items.push(itemId);
                if (window.addLog) window.addLog(`<span class="tactical">NEW PROTOCOL ACQUIRED:</span> ${itemInfo.name} registered to local synthesis unit.`);
            }
        } else {
            if (window.gameState && !window.gameState.items.includes(itemId)) {
                window.gameState.items.push(itemId);
            }
        }

        // Remove from current zone if it was a world object drop
        const zone = this.zones[this.currentZone];
        const objIdx = zone.objects.findIndex(o =>
            (o.hiddenLogId === itemId || o.hiddenItemId === itemId || o.hiddenReward === itemId) &&
            (o.id.startsWith('item_') || o.id.startsWith('log_'))
        );
        if (objIdx > -1) {
            const obj = zone.objects[objIdx];
            zone.objects.splice(objIdx, 1);
            const el = document.getElementById(`npc-${obj.id}`);
            if (el) el.remove();
        }

        // Show pickup modal instead of dialogue
        if (gameState.settings?.autoSave) saveGameState(); // Auto-save after pickup (if enabled)
        this.isPaused = true;
        const showModal = window.showItemPickupModal || window.showDatapadPickupModal;
        if (showModal) {
            showModal(itemId, () => {
                this.isPaused = false;
                window.dispatchEvent(new CustomEvent('item-collected', { detail: { id: itemId, type: itemType } }));
                if (itemType === 'log') {
                    window.dispatchEvent(new CustomEvent('datalog-found', { detail: { id: itemId } }));
                }
            });
        } else {
            // Fallback
            this.isPaused = false;
            const label = itemType === 'log' ? `Datapad [Log ${itemId}] archived.` : `Item [${itemId}] acquired.`;
            this.showDialogue('Discovery', [label]);
            window.dispatchEvent(new CustomEvent('item-collected', { detail: { id: itemId, type: itemType } }));
        }
    },

    collectLog(logId) {
        // Compatibility layer
        this.collectItem(logId);
    },

    showDialogue(name, lines, npcId = null) {
        if (this.isDialogueActive && lines === this.dialogueQueue) return; // Prevent redundant triggers

        this.isDialogueActive = true;
        this.isTransitioning = false;
        this.currentDialoguePartner = npcId;
        // Parse '//' as a page break marker
        const parsedLines = [];
        lines.forEach(line => {
            if (typeof line === 'string' && line.includes('//')) {
                const segments = line.split('//').map(s => s.trim()).filter(s => s.length > 0);
                parsedLines.push(...segments);
            } else {
                parsedLines.push(line);
            }
        });

        this.dialogueQueue = [...parsedLines]; // Load parsed lines into queue

        const box = document.getElementById('dialogue-box');
        const nameEl = document.getElementById('dialogue-name');
        const portraitOverlay = document.getElementById('npc-portrait-overlay');
        const portraitImg = document.getElementById('npc-portrait-img');

        if (box) box.classList.remove('hidden');
        if (nameEl) nameEl.textContent = name;

        const textEl = document.getElementById('dialogue-text');
        if (textEl) textEl.textContent = ''; // Clear text before it's displayed

        // Reset and Show Portrait if applicable
        if (portraitOverlay && portraitImg) {
            portraitOverlay.classList.add('hidden');
            portraitImg.src = '';

            const portraitMap = {
                'jenzi': 'Character_FullArt_Jenzi.png',
                'lana': 'Character_FullArt_Lana.png',
                'dyzes': 'Character_FullArt_Dyzes.png',
                'capsain': 'Character_FullArt_Director.png',
                'elara': 'Character_FullArt_Elara.png',
                'npc_female': 'Character_FullArt_NPC_Female.png',
                'npc_male': 'Character_FullArt_NPC_Male.png'
            };

            // 1. Try Direct Match from the map first
            let artFile = portraitMap[npcId];

            // 1.1 Support prefix-based matching for variants (e.g. lana_withered -> lana)
            if (!artFile && npcId) {
                const prefix = npcId.split('_')[0];
                if (portraitMap[prefix]) artFile = portraitMap[prefix];
            }

            // 2. If no direct match, resolve gender-based fallback from Sprites registry
            if (!artFile && npcId) {
                const spriteType = window.OVERWORLD_NPC_SPRITES ? window.OVERWORLD_NPC_SPRITES[npcId] : null;

                if (spriteType === 'npc_female') {
                    artFile = portraitMap['npc_female'];
                } else if (spriteType === 'npc_male') {
                    artFile = portraitMap['npc_male'];
                } else {
                    // Final generic fallback for npc_ prefixed IDs (legacy support)
                    const legacyKey = npcId.startsWith('npc_') ? npcId.split('_').slice(0, 2).join('_') : null;
                    if (legacyKey && portraitMap[legacyKey]) {
                        artFile = portraitMap[legacyKey];
                    }
                }
            }

            if (artFile) {
                portraitImg.src = `assets/images/${artFile}`;
                portraitOverlay.classList.remove('hidden');
            }
        }

        this.nextDialogue();
    },

    nextDialogue() {
        if (this.dialogueQueue.length === 0) {
            this.closeDialogue();
            return;
        }

        const text = this.dialogueQueue.shift();
        this.typeText(text);
    },

    typeText(text) {
        const textEl = document.getElementById('dialogue-text');
        if (!textEl) return;

        this.isTyping = true;
        this.currentFullText = text;
        textEl.textContent = '';
        let i = 0;

        if (this.typingInterval) clearInterval(this.typingInterval);

        this.typingInterval = setInterval(() => {
            textEl.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(this.typingInterval);
                this.isTyping = false;
            }
        }, 25);
    },

    finishTyping() {
        if (this.typingInterval) clearInterval(this.typingInterval);
        const textEl = document.getElementById('dialogue-text');
        if (textEl) textEl.textContent = this.currentFullText;
        this.isTyping = false;
    },

    closeDialogue() {
        this.isDialogueActive = false;
        document.getElementById('dialogue-box')?.classList.add('hidden');
        document.getElementById('npc-portrait-overlay')?.classList.add('hidden');

        // Prevent immediate re-interaction if we're moving to a battle or modal
        if (this.pendingBattleEncounter || this.pendingWildEncounter) {
            this.isTransitioning = true;
        }

        const partner = this.currentDialoguePartner;
        this.currentDialoguePartner = null;

        // Handle Final Climax Cleanup & World State Update
        if (window.gameState.storyFlags.climaxTriggered) {
            window.gameState.storyFlags.climaxTriggered = false; // Reset trigger
            window.gameState.storyFlags.gameCompleted = true;

            // 1. Remove Origin Nitrophil from inventory
            window.gameState.items = window.gameState.items.filter(id => id !== 'Quest04');

            // 2. Permanently place Origin Nitrophil in the Executive Suite (on cabinet at 9,3)
            const execZone = this.zones.executive;
            if (execZone && !execZone.objects.some(o => o.id === 'origin_nitrophil_final')) {
                execZone.objects.push({
                    id: 'origin_nitrophil_final',
                    x: 9,
                    y: 3,
                    type: 'cell',
                    name: 'Origin Nitrophil',
                    customSprite: 'c3 orange-hue'
                });
            }

            // 3. Reward the Official Employee Card (Quest05) - Call directly for immediate acquisition
            this.collectItem('Quest05');

            // 4. Re-render the map if we are in the executive suite to show the change
            if (this.currentZone === 'executive') {
                this.renderMap('executive');
            }
        }

        // Handle pending item discovery (hidden items)
        if (this.pendingItemPickup) {
            const itemId = this.pendingItemPickup;
            const spotId = this.pendingItemSpotId || null;
            this.pendingItemPickup = null;
            this.pendingItemSpotId = null;
            this.collectItem(itemId, spotId, true); // Hidden items are ALWAYS discoveries
        }

        // Handle deferred item pickups (like boss rewards)
        if (this.deferredItemPickup) {
            const itemId = this.deferredItemPickup;
            this.deferredItemPickup = null;
            this.collectItem(itemId);
        }

        // Handle deferred story flags (like 'seen' flags)
        if (this.deferredStoryFlag) {
            const flag = this.deferredStoryFlag;
            this.deferredStoryFlag = null;
            if (window.gameState && window.gameState.storyFlags) {
                window.gameState.storyFlags[flag] = true;
            }
        }

        // If the dialogue was with a valid NPC and we hit the log threshold, trigger the encounter
        if (this.pendingBattleEncounter) {
            const encounterId = this.pendingBattleEncounter;
            this.pendingBattleEncounter = null; // Clean up

            if (encounterId === 'starter_selection') {
                setTimeout(() => {
                    if (window.openStarterSelection) window.openStarterSelection();
                }, 200);
            } else {
                setTimeout(() => {
                    const eventDetail = { id: encounterId };
                    // We need to find the NPC object to get its battleEncounterId if it wasn't already in encounterId
                    // Actually, pendingBattleEncounter IS already the battleEncounterId if it exists.
                    // But to be safe for main.js logic, let's pass it explicitly.
                    window.dispatchEvent(new CustomEvent('start-npc-encounter', {
                        detail: {
                            id: encounterId,
                            battleEncounterId: encounterId // In our new system, encounterId is the battleEncounterId
                        }
                    }));
                }, 200);
            }
        }

        // Handle pending wild encounters
        if (this.pendingWildEncounter) {
            const mId = this.pendingWildMonsterId || 'stemmy';
            const instanceId = this.pendingWildInstanceId;

            this.pendingWildEncounter = false;
            this.pendingWildMonsterId = null;
            this.pendingWildInstanceId = null;

            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('start-wild-encounter', {
                    detail: { id: mId, instanceId: instanceId }
                }));
            }, 200);
        }

        // Handle pending incubator menu
        if (this.pendingIncubatorMenu) {
            this.pendingIncubatorMenu = false;
            setTimeout(() => {
                if (window.openIncubatorMenu) window.openIncubatorMenu();
            }, 200);
        }

        // Handle pending shop menu
        if (this.pendingShopMenu) {
            this.pendingShopMenu = false;
            setTimeout(() => {
                if (window.openShopMenu) window.openShopMenu();
            }, 200);
        }

        // Handle pending synthesis menu
        if (this.pendingSynthesisMenu) {
            this.pendingSynthesisMenu = false;
            setTimeout(() => {
                if (window.openSynthesisMenu) window.openSynthesisMenu();
            }, 200);
        }

        // Handle pending Bio-Extract menu
        if (this.pendingBioExtractMenu) {
            this.pendingBioExtractMenu = false;
            setTimeout(() => {
                if (window.BioExtract && window.BioExtract.open) window.BioExtract.open();
            }, 200);
        }

        // --- NEW: Execute Completion Callback (Delayed to clear UI) ---
        if (typeof this.onDialogueComplete === 'function') {
            const cb = this.onDialogueComplete;
            this.onDialogueComplete = null;
            this.isDialogueTransitioning = true;
            setTimeout(() => {
                this.isDialogueTransitioning = false;
                cb();
            }, 400);
        }

        // Restart Spawner after Dialogue (only if not about to start a battle)
        if (!this.pendingWildEncounter && !this.pendingBattleEncounter) {
            this.spawner.start();
        }
    },

    // --- NEW: Visibility Helper (Systematic RPG State) ---
    isObjectVisible(obj) {
        if (!obj) return false;
        if (!window.gameState || !window.gameState.storyFlags) return true;

        if (obj.requiredFlag && !window.gameState.storyFlags[obj.requiredFlag]) {
            return false;
        }
        if (obj.forbiddenFlag && window.gameState.storyFlags[obj.forbiddenFlag]) {
            return false;
        }
        return true;
    },

    updateBioExtractVisuals() {
        const zone = this.zones['bioExtraction'];
        if (!zone) return;

        // 1. Initialize persistent dish mapping if not exists
        if (!this.dishMapping) {
            this.dishMapping = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => Math.random() - 0.5);
        }

        const dishCoords = [
            { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }, // Left side
            { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, // Right side
            { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }  // Bottom side
        ];

        // 2. Remove ONLY the cell-type objects assigned to dishes
        zone.objects = zone.objects.filter(obj => !obj.id.startsWith('extract_cell_'));

        // 3. Map cells from the 3x3 grid to dishes using the randomized mapping
        if (window.gameState && window.gameState.bioExtractGrid) {
            window.gameState.bioExtractGrid.forEach((slot, index) => {
                const mappingIdx = this.dishMapping[index];
                if (slot && slot.monster && mappingIdx < dishCoords.length) {
                    const coord = dishCoords[mappingIdx];

                    // Fixed offset: 12px up (as requested)
                    const offsetX = 0;
                    const offsetY = -12;

                    zone.objects.push({
                        id: `extract_cell_${index}`,
                        x: coord.x,
                        y: coord.y,
                        offsetX: offsetX,
                        offsetY: offsetY,
                        type: 'cell',
                        name: slot.monster.name,
                        customSprite: slot.monster.id || slot.monster.name.toLowerCase(),
                        efficiency: slot.monster.extractEfficiency ?? 0
                    });
                }
            });
        }
    },

    spawner: {
        activeMonsters: [], // Array of { id, despawnTimer }
        spawnTimer: null,
        allowedZones: ['atrium', 'botanic', 'human', 'executive', 'specimenStorage', 'kitchen', 'storage', 'entertainment', 'ancientBotany', 'preservationRoom', 'library', 'cellPlayGround', 'oldMachine', 'fabricatingLab', 'witheredTree'],

        start() {
            if (!this.allowedZones.includes(Overworld.currentZone)) return;
            if (this.spawnTimer) return;
            const zone = Overworld.zones[Overworld.currentZone];
            const maxSpawns = (zone && zone.maxWildSpawns) || 1;
            // Immediate spawn for playgrounds/high-capacity rooms, or use custom initial delay
            const initialDelay = zone.initialSpawnDelay !== undefined ? zone.initialSpawnDelay : (maxSpawns > 1 ? 200 : null);
            this.startCooldown(initialDelay);
        },

        stop() {
            if (this.spawnTimer) {
                clearTimeout(this.spawnTimer);
                this.spawnTimer = null;
            }
            this.activeMonsters.forEach(m => {
                if (m.despawnTimer) clearTimeout(m.despawnTimer);
            });
            this.activeMonsters = [];
        },

        cleanupTempObjects() {
            const zone = Overworld.zones[Overworld.currentZone];
            if (zone && zone.objects) {
                // 1. Filter the internal data array
                zone.objects = zone.objects.filter(obj => !obj.temp);
            }

            // 2. Remove actual DOM elements to prevent "static ghosts" or lingering unkickable cells
            const wildCells = document.querySelectorAll('.wild-cell');
            wildCells.forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
        },

        startCooldown(customDelay = null) {
            if (this.spawnTimer) clearTimeout(this.spawnTimer);
            const zone = Overworld.zones[Overworld.currentZone];
            const min = zone?.spawnDelayMin ?? 5000;
            const range = zone?.spawnDelayMax ?? 10000;
            const delay = customDelay !== null ? customDelay : min + (Math.random() * range);
            this.spawnTimer = setTimeout(() => this.spawnWildMonster(), delay);
        },

        spawnWildMonster() {
            if (!this.allowedZones.includes(Overworld.currentZone)) return;
            if (!Overworld.gameLoopActive || Overworld.isPaused || Overworld.isDialogueActive) {
                this.startCooldown(2000); // Retry soon if busy
                return;
            }

            const id = Overworld.currentZone;
            const zone = Overworld.zones[id];
            if (!zone) return;

            const maxSpawns = zone.maxWildSpawns || 1;
            const currentWildCount = (zone.objects || []).filter(obj => obj.id && obj.id.includes('_wild_')).length;

            if (currentWildCount >= maxSpawns) {
                this.startCooldown();
                return;
            }

            // --- NEW: Maximum Isolation Logic ---
            const avoidancePoints = [{ x: Overworld.player.x, y: Overworld.player.y }];
            (zone.objects || []).forEach(obj => {
                if (obj.id && obj.id.includes('_wild_')) {
                    avoidancePoints.push({ x: obj.x, y: obj.y });
                }
            });

            const targetDist = 3 * (currentWildCount + 1);
            let candidates = [];

            const isClosedDoor = [20, 22, 24, 25, 28, 29, 30, 31, 39, 40, 41, 42];
            const isOpenDoor = [21, 23, 26, 27, 34, 35, 36, 37];
            const isGenericWall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 32, 33, 43, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63];

            // 1. Map all floor tiles and calculate their isolation scores
            for (let y = 0; y < zone.height; y++) {
                for (let x = 0; x < zone.width; x++) {
                    const tileID = zone.layout[y][x];
                    const isFloor = !isGenericWall.includes(tileID) && !isClosedDoor.includes(tileID) && !isOpenDoor.includes(tileID);

                    if (isFloor) {
                        const occupied = zone.objects.some(obj => obj.x === x && obj.y === y);
                        if (!occupied) {
                            // Find distance to the NEAREST point we want to avoid
                            let minDist = Infinity;
                            avoidancePoints.forEach(p => {
                                const d = Math.max(Math.abs(p.x - x), Math.abs(p.y - y));
                                if (d < minDist) minDist = d;
                            });
                            candidates.push({ x, y, score: minDist });
                        }
                    }
                }
            }

            // 2. Select the Best floor tiles
            let bestTiles = candidates.filter(c => c.score >= targetDist);

            // Fallback: If no tiles satisfy the ideal target, pick the most isolated spots available
            if (bestTiles.length === 0 && candidates.length > 0) {
                const maxScore = Math.max(...candidates.map(c => c.score));
                // Allow a small buffer for randomness among top-tier spots
                bestTiles = candidates.filter(c => c.score >= maxScore - 1);
            }

            const floorTiles = bestTiles; // Compatibility with legacy variable name below

            if (floorTiles.length === 0) {
                this.startCooldown();
                return;
            }

            const pos = floorTiles[Math.floor(Math.random() * floorTiles.length)];

            // --- NEW: Weighted Spawn Pool System ---
            const monsterIds = ['stemmy', 'cambihil', 'lydrosome', 'nitrophil'];
            let pool = zone.spawnPool || { stemmy: 70, nitrophil: 10, cambihil: 10, lydrosome: 10 };

            const roll = Math.random() * 100;
            let current = 0;
            let mId = 'stemmy';

            for (const id of monsterIds) {
                current += (pool[id] || 0);
                if (roll < current) {
                    mId = id;
                    break;
                }
            }

            const monsterId = `npc_wild_${Date.now()}_${Math.round(Math.random() * 1000)}`;
            const newMonster = {
                id: monsterId,
                monsterId: mId,
                x: pos.x,
                y: pos.y,
                type: 'npc',
                name: mId.charAt(0).toUpperCase() + mId.slice(1),
                direction: 'down',
                customSprite: `c${monsterIds.indexOf(mId)}`,
                temp: true
            };

            if (!zone.objects) zone.objects = [];
            zone.objects.push(newMonster);

            const monsterRecord = { id: monsterId, despawnTimer: null };
            this.activeMonsters.push(monsterRecord);

            const mapEl = document.getElementById('overworld-map');
            if (mapEl) {
                const el = Overworld.renderObject(newMonster, mapEl);
                if (el) {
                    el.classList.add('anim-monster-pop');
                    setTimeout(() => {
                        if (el && el.parentNode) {
                            el.classList.remove('anim-monster-pop');
                            el.classList.add('anim-monster-breathing');
                        }
                    }, 400);
                }
            }

            // Set individual despawn timer for this specific monster (unless disabled)
            if (!zone.disableWildDespawn) {
                const lMin = zone.despawnTimeMin ?? 15000;
                const lRange = zone.despawnTimeMax ?? 10000;
                monsterRecord.despawnTimer = setTimeout(() => this.despawnMonster(monsterId), lMin + Math.random() * lRange);
            }

            // If we still have room for more, trigger next spawn sooner (1.0s by default)
            const cDelay = zone.consecutiveSpawnDelay ?? 1000;
            if (currentWildCount + 1 < maxSpawns) {
                this.startCooldown(cDelay);
            } else {
                this.startCooldown();
            }
        },

        despawnMonster(monsterId, zoneId = null) {
            const mRecord = this.activeMonsters.find(m => m.id === monsterId);

            // Visual Cleanup
            const el = document.getElementById(`npc-${monsterId}`);
            if (el) {
                el.classList.remove('anim-monster-breathing', 'anim-breathing', 'anim-monster-pop');
                el.classList.add('anim-recall-exit');
                setTimeout(() => {
                    if (el.parentNode) el.remove();

                    // DATA CLEANUP (Moved inside timeout for sync)
                    const targetZoneId = zoneId || Overworld.currentZone;
                    const zone = Overworld.zones[targetZoneId];
                    if (zone && zone.objects) {
                        zone.objects = zone.objects.filter(obj => {
                            if (obj.id !== monsterId) return true;
                            const isWild = obj.id.includes('_wild_') || obj.temp === true;
                            return !isWild;
                        });
                    }
                    this.activeMonsters = this.activeMonsters.filter(m => m.id !== monsterId);
                }, 800);
            } else {
                // No element (e.g. Recovery flow), do instant data cleanup
                const targetZoneId = zoneId || Overworld.currentZone;
                const zone = Overworld.zones[targetZoneId];
                if (zone && zone.objects) {
                    zone.objects = zone.objects.filter(obj => {
                        if (obj.id !== monsterId) return true;
                        const isWild = obj.id.includes('_wild_') || obj.temp === true;
                        return !isWild;
                    });
                }
                this.activeMonsters = this.activeMonsters.filter(m => m.id !== monsterId);
            }
        },

        despawnCurrent(zoneId = null) {
            // Find the monster that was just in battle from global state
            const opponentId = window.catalystState && window.catalystState.battleOpponentId;
            if (opponentId) {
                this.despawnMonster(opponentId, zoneId);
            }
        }
    },

    kickObject(obj, dx, dy, force = false) {
        if ((this.isTransitioning && !force) || this.isPaused || obj.isKicking) return;
        const wasSprinting = this.player.isSprinting;
        obj.isKicking = true;

        const el = document.getElementById(`npc-${obj.id}`);
        if (!el) return;

        const zone = this.zones[this.currentZone];
        if (!zone) return;

        // --- SYSTEMATIC BLUEPRINT-AWARE LINKAGE ---
        const parts = [obj];
        const suffixMatch = obj.id.match(/_([a-zA-Z0-9]+)$/);
        const suffix = suffixMatch ? suffixMatch[1] : null;
        const prefix = obj.id.split('_')[0];

        // Locate the blueprint this part belongs to
        let template = null;
        let myRelX = 0, myRelY = 0;

        for (const key in window.FURNITURE_TEMPLATES) {
            const t = window.FURNITURE_TEMPLATES[key];
            const part = t.tiles.find(tile => tile.id === prefix);
            if (part) {
                template = t;
                myRelX = part.relX || 0;
                myRelY = part.relY || 0;
                break;
            }
        }

        if (template && obj.type === 'prop') {
            const transformedTiles = template.tiles;
            const part = transformedTiles.find(t => t.id === prefix);

            if (part) {
                const rootX = obj.x - (part.relX || 0);
                const rootY = obj.y - (part.relY || 0);

                transformedTiles.forEach(tile => {
                    // Skip self
                    if (tile.id === prefix && (tile.relX || 0) === (part.relX || 0) && (tile.relY || 0) === (part.relY || 0)) return;

                    // Look for a neighbor at exactly the target transformed relative coordinate
                    const tx = rootX + (tile.relX || 0);
                    const ty = rootY + (tile.relY || 0);

                    const partner = zone.objects.find(o => {
                        const oPrefix = o.id.split('_')[0];
                        const oSuffixMatch = o.id.match(/_([a-zA-Z0-9]+)$/);
                        const oSuffix = oSuffixMatch ? oSuffixMatch[1] : null;

                        if (o.x === tx && o.y === ty && oPrefix === tile.id) {
                            // Isolation Rule: If both have suffixes, they MUST match
                            if (suffix && oSuffix) return suffix === oSuffix;
                            // Fallback (for legacy maps): Position and Prefix match is enough
                            return true;
                        }
                        return false;
                    });

                    if (partner) {
                        partner.isKicking = true;
                        parts.push(partner);
                    }
                });
            }
        }

        // 0. ABORT CURRENT MOVEMENT
        if (this.player.isMoving) {
            this.player.isMoving = false;
            this.player.x = Math.round(this.player.x);
            this.player.y = Math.round(this.player.y);
        }

        // 1. HIT STOP (Freeze Player Pose & Game)
        const screen = document.getElementById('screen-overworld');
        const playerEl = document.getElementById('player-sprite');

        const dist = this.player.sprintDistance;
        let roll = Math.random() * 100;
        let choice = 'front';
        let isHomeRun = false;

        if (dist === 0) { choice = roll < 50 ? 'left' : 'right'; }
        else if (dist <= 5) {
            if (roll < 10) { isHomeRun = true; choice = 'front'; }
            else if (roll < 40) choice = 'left';
            else if (roll < 70) choice = 'right';
            else choice = 'front';
        } else if (dist <= 9) {
            if (roll < 20) { isHomeRun = true; choice = 'front'; }
            else if (roll < 40) choice = 'left';
            else if (roll < 60) choice = 'right';
            else choice = 'front';
        } else {
            if (roll < 90) { isHomeRun = true; choice = 'front'; }
            else choice = 'front';
        }

        let dirMap = {};
        if (dy < 0) dirMap = { front: 'u', left: 'l', right: 'r' };
        else if (dy > 0) dirMap = { front: 'f', left: 'l', right: 'r' };
        else if (dx < 0) dirMap = { front: 'l', left: 'u', right: 'f' };
        else if (dx > 0) dirMap = { front: 'r', left: 'u', right: 'f' };

        const directionKey = dirMap[choice];

        // AUDIO: Determine material and play impact
        const meta = this.getFurnitureMeta(obj.id, obj.customSprite);
        let materials = (meta && meta.material) || 'base';
        if (obj.type === 'npc') materials = 'monster';
        AudioManager.playImpact(materials);

        // --- PRE-ROLL LOOT FOR AUDIO SYNC ---
        const lootResult = this.calculateLoot(obj, isHomeRun);
        if (lootResult) {
            AudioManager.play('resource_burst', 0.4, 0.1);
        }
        obj._pendingLoot = lootResult; // Attach result for the delayed visual call

        const hitStopTime = isHomeRun ? 500 : 300;
        const shakeClass = isHomeRun ? 'anim-screen-shake-heavy' : 'anim-screen-shake';

        this.player.sprintDistance = 0;
        if (screen) screen.classList.add(shakeClass);

        this.player.isHitstopping = true;
        this.player.currentFrame = (this.player.stepParity * 2) + 1;
        this.updatePlayerPosition();

        parts.forEach(p => {
            const pEl = document.getElementById(`npc-${p.id}`);
            if (pEl) {
                pEl.classList.remove('anim-monster-breathing', 'anim-breathing', 'anim-monster-pop', 'anim-monster-shake');
                void pEl.offsetWidth;

                // --- Wait to sync Z-Index (Top + Bottom) until the launch phase ---
                pEl.style.willChange = 'transform, opacity';

                pEl.classList.add('anim-monster-shake');
            }
        });

        this.isPaused = true;

        setTimeout(() => {
            if (!this.gameLoopActive) return;
            this.isPaused = false;
            this.player.isHitstopping = false;
            this.player.currentFrame = this.player.stepParity * 2;
            this.player.isSprinting = [...this.keysPressed].some(k => k === 'shift');

            if (playerEl) {
                playerEl.classList.remove('p-frame-1', 'p-frame-3');
                playerEl.classList.add(`p-frame-${this.player.currentFrame}`);
            }
            this.updatePlayerPosition();
            if (screen) screen.classList.remove(shakeClass);

            // LOGICAL TILE FREEDOM: Remove from collision objects exactly when unpaused
            const partIds = parts.map(p => p.id);
            const meta = this.getFurnitureMeta(obj.id, obj.customSprite);

            // --- STAGE 2: BRANCHING (Kick vs Break) ---
            // If the kick was forced by the Spatial Audit (force=true), always break if breakable
            if (meta && meta.breakable && (wasSprinting || force)) {
                if (screen) screen.classList.remove(shakeClass);
                this.transformBreakable(parts, meta.breaksInto);
                this.dropLoot(obj, isHomeRun, directionKey);

                // --- NEW: Granular Tracking (Break) ---
                // Resolve template name for precise quest targeting
                const cleanId = obj.templateName || (meta && meta.template) || obj.id.split('_')[0] || obj.id;
                this.updateQuestProgress('break', cleanId, obj.type);

                return;
            }

            // Standard Kick Loot
            this.dropLoot(obj, isHomeRun, directionKey);

            if (zone && zone.objects) {
                // Permanently remove NPCs (Wild Monsters); flag Props to hide until zone change
                zone.objects.forEach(o => {
                    if (partIds.includes(o.id) && o.type !== 'npc') {
                        o.isKicked = true;
                    }
                });
                zone.objects = zone.objects.filter(o => o.type !== 'npc' || !partIds.includes(o.id));
            }
            if (this.spawner && this.spawner.activeMonsters) {
                this.spawner.activeMonsters = this.spawner.activeMonsters.filter(m => !partIds.includes(m.id));
            }

            // 2. Identify and animate ALL linked tiles (the assembly)
            const suffixMatch = obj.id.match(/_([a-zA-Z0-9]+)$/);
            const suffix = suffixMatch ? suffixMatch[1] : null;
            const partners = suffix ? zone.objects.filter(o => o.id.endsWith(`_${suffix}`)) : [obj];

            const tKey = obj.templateName || Object.keys(window.FURNITURE_TEMPLATES).find(k => window.FURNITURE_TEMPLATES[k] === template);

            partners.forEach(p => {
                const pEl = document.getElementById(`npc-${p.id}`);
                if (pEl) {
                    // Lock the templateName to partners so they share the exact same pivot origin
                    if (!p.templateName && tKey) {
                        p.templateName = tKey;

                        // Update Origin logic (replacing redundant renderObject call that caused ghosts)
                        const pMeta = this.getFurnitureMeta(p.id, p.customSprite);
                        const pTemplate = window.FURNITURE_TEMPLATES[p.templateName || (pMeta && pMeta.template)];
                        if (pTemplate) {
                            const transformed = this.getTransformedTiles(pTemplate, p.mirrored);
                            const prefix = p.id.split('_')[0];
                            const foundTile = transformed.find(tt => tt.id === prefix);
                            if (foundTile) {
                                const centerX = pTemplate.width / 2;
                                const centerY = pTemplate.height;
                                const rx = (foundTile.relX || 0);
                                const ry = (foundTile.relY || 0);
                                const ox_px = (centerX - rx + 0.5) * this.tileSize;
                                const oy_px = (centerY - ry + 1.0) * this.tileSize;
                                pEl.style.transformOrigin = `${ox_px}px ${oy_px}px`;
                            }
                        }
                    }

                    pEl.classList.remove('anim-monster-kick');
                    void pEl.offsetWidth; // Trigger reflow
                    pEl.classList.add('anim-monster-kick');

                    // Clear animation after it finishes to allow subsequent kicks
                    setTimeout(() => { if (pEl) pEl.classList.remove('anim-monster-kick'); }, 300);
                }
            });

            parts.forEach((p) => {
                const pEl = document.getElementById(`npc-${p.id}`);
                if (!pEl) return;

                pEl.classList.remove('anim-monster-shake');
                void pEl.offsetWidth;
                pEl.style.setProperty('z-index', '50000', 'important');
                pEl.style.willChange = 'transform, opacity';

                const spinMult = isHomeRun ? 4 : 1;
                const totalSpin = (Math.random() * 660 + 60) * spinMult * (directionKey === 'l' ? -1 : 1);
                pEl.style.setProperty('--kick-spin', `${totalSpin}deg`);

                const animClass = isHomeRun ? `anim-monster-kick-homerun-${directionKey}` : `anim-monster-kick-${directionKey}`;
                pEl.classList.add(animClass);

                if (isHomeRun && (p.id === obj.id || p.type === 'npc')) {
                    this.triggerHomeRunEffects(p, pEl, directionKey);
                } else if (!isHomeRun && (p.id === obj.id)) {
                    // --- NEW: Micro-Impact VFX for normal kicks ---
                    this.spawnKickImpactParticles(p.x * this.tileSize, p.y * this.tileSize, (p.width || 1) * this.tileSize, (p.height || 1) * this.tileSize, directionKey);
                }

                setTimeout(() => { if (pEl.parentNode) pEl.parentNode.removeChild(pEl); }, 2000);
            });

            // --- NEW: Precise Interaction Tracking (Kick) ---
            let cleanId = obj.id || obj.type;
            if (obj.monsterId) {
                // For Cells, we use the base monster ID + suffix (e.g., 'stemmy_wild')
                cleanId = obj.monsterId + '_wild';
            } else if (obj.type === 'prop') {
                // For Furniture, we resolve the Template Name for type-specific quests
                const pMeta = this.getFurnitureMeta(obj.id, obj.customSprite);
                cleanId = obj.templateName || (pMeta && pMeta.template) || obj.id.split('_')[0] || obj.id;
            }
            this.updateQuestProgress('kick', cleanId, obj.type, obj.templateName || (this.getFurnitureMeta(obj.id, obj.customSprite)?.template));

            if (obj.type === 'npc' && obj.monsterId) {
                if (this.spawner) this.spawner.startCooldown(zone.maxWildSpawns > 1 ? 500 : null);
            }
        }, hitStopTime);
    },

    triggerHomeRunEffects(obj, el, directionKey) {
        // AUDIO: Play Homerun Sound
        AudioManager.play('kick_homerun', 0.7, 0.1);

        let trailAngle = 0;
        if (directionKey === 'l') trailAngle = 30;
        else if (directionKey === 'r') trailAngle = 150;
        else if (directionKey === 'u') trailAngle = 90;
        else if (directionKey === 'f') trailAngle = 270;

        const trailEl = document.createElement('div');
        trailEl.className = `rocket-thruster anim-trail-homerun-${directionKey}`;

        let offX = 32, offY = 32;
        if (directionKey === 'l') { offX = 60; offY = 48; }
        else if (directionKey === 'r') { offX = 4; offY = 48; }
        else if (directionKey === 'u') { offX = 32; offY = 64; }
        else if (directionKey === 'f') { offX = 32; offY = 0; }

        trailEl.style.left = (parseFloat(el.style.left) + offX) + 'px';
        trailEl.style.top = (parseFloat(el.style.top) + offY) + 'px';
        trailEl.style.setProperty('--trail-angle', `${trailAngle}deg`);

        const mapEl = document.getElementById('overworld-map');
        const mapRect = mapEl.getBoundingClientRect();
        mapEl.appendChild(trailEl);

        let plumeCount = 0;
        const maxPlumes = 45;
        const plumeInterval = setInterval(() => {
            if (plumeCount >= maxPlumes || !el || !el.parentNode) {
                clearInterval(plumeInterval);
                if (trailEl.parentNode) trailEl.parentNode.removeChild(trailEl);
                return;
            }

            const rect = el.getBoundingClientRect();
            const curX = rect.left - mapRect.left;
            const curY = rect.top - mapRect.top;

            this.spawnHomerunParticles(curX, curY, rect.width, rect.height, directionKey);
            plumeCount++;
        }, 16);
    },

    transformBreakable(oldParts, templateName) {
        const zone = this.zones[this.currentZone];
        const template = window.FURNITURE_TEMPLATES && window.FURNITURE_TEMPLATES[templateName];
        if (!zone || !template) return;

        // --- NEW: Logical Origin Discovery ---
        // We calculate the machine's "Absolute 0,0" by checking how the old parts were mapped in their template.
        let originX = 0, originY = 0;
        let foundPivot = false;

        // Try to identify the core template first
        const samplePart = oldParts.find(p => p.templateName) || oldParts[0];
        const sourceTemplateName = templateName || samplePart.templateName;

        for (const p of oldParts) {
            const prefix = p.id.split('_')[0];
            const tKeySearch = p.templateName || sourceTemplateName;

            // Search specifically for the parts of this template (or its predecessor)
            for (const tKey in window.FURNITURE_TEMPLATES) {
                if (tKeySearch && tKey !== tKeySearch) continue; // Optimization: Skip irrelevant templates

                const t = window.FURNITURE_TEMPLATES[tKey];
                const transformed = this.getTransformedTiles(t, p.mirrored);
                const tTile = transformed.find(tt => tt.id === prefix);
                if (tTile) {
                    originX = p.x - (tTile.relX || 0);
                    originY = p.y - (tTile.relY || 0);
                    foundPivot = true;
                    break;
                }
            }
            if (foundPivot) break;
        }

        // Fallback to legacy "bottom-most" logic if template discovery fails
        if (!foundPivot) {
            const basePart = oldParts.reduce((prev, curr) => (curr.y > prev.y ? curr : prev), oldParts[0]);
            originX = basePart.x;
            originY = basePart.y;
        }

        const centerX = (oldParts.reduce((sum, p) => sum + p.x, 0) / oldParts.length) * this.tileSize + (this.tileSize / 2);
        const centerY = (oldParts.reduce((sum, p) => sum + p.y, 0) / oldParts.length) * this.tileSize + (this.tileSize / 2);

        // 2. Remove Old Parts (Data & DOM)
        const partIds = oldParts.map(p => p.id);
        zone.objects = zone.objects.filter(o => !partIds.includes(o.id));
        partIds.forEach(id => {
            const el = document.getElementById(`npc-${id}`);
            if (el) el.remove();
        });

        // AUDIO: Play material-aware Shatter Sound
        const baseObj = oldParts[0];
        const meta = this.getFurnitureMeta(baseObj.id, baseObj.customSprite);
        const material = (meta && meta.material) ? (Array.isArray(meta.material) ? meta.material[0] : meta.material) : 'glass';

        if (material === 'wood') AudioManager.play('shatter_wood', 0.6, 0.1);
        else AudioManager.play('shatter_tank', 0.6, 0.1); // Default for tech/glass

        // 3. Instantiate & Render New Furniture (Surgically)
        const mapEl = document.getElementById('overworld-map');
        const suffix = `_${Math.random().toString(36).substr(2, 9)}`;
        const isMirrored = oldParts.some(p => p.mirrored);
        const transformedTiles = this.getTransformedTiles(template, isMirrored);

        transformedTiles.forEach(tile => {
            const newObj = {
                id: tile.id + suffix,
                templateName: templateName, // Preserve name for next stage
                x: originX + (tile.relX || 0),
                y: originY + (tile.relY || 0),
                relX: tile.relX || 0,
                relY: tile.relY || 0,
                type: 'prop',
                customSprite: tile.id,
                mirrored: isMirrored,
                isNewDebris: true, // Trigger the bounce animation
                name: template.name + (tile.name ? ` (${tile.name})` : '')
            };
            zone.objects.push(newObj);
            this.renderObject(newObj, mapEl);

            // --- RECURSIVE AUDIT: Auto-clear debris spawned under player ---
            if (newObj.x === this.player.x && newObj.y === this.player.y) {
                const debrisMeta = this.getFurnitureMeta(newObj.id, newObj.customSprite);
                // Only kick it if it's solid/kickable/breakable
                if (debrisMeta && (debrisMeta.kickable !== false || debrisMeta.breakable === true)) {
                    // Small delay to allow the debris to actually render before launching it
                    setTimeout(() => {
                        const dirMap = { 'up': { dx: 0, dy: -1 }, 'down': { dx: 0, dy: 1 }, 'left': { dx: -1, dy: 0 }, 'right': { dx: 1, dy: 0 } };
                        const push = dirMap[this.player.direction] || { dx: 0, dy: 1 };
                        this.kickObject(newObj, push.dx, push.dy, true);
                    }, 50);
                }
            }
        });

        // 4. Trigger VFX
        this.spawnBreakParticles(centerX, centerY, oldParts.length > 1);
    },

    spawnBreakParticles(emitX, emitY, isLarge) {
        const mapEl = document.getElementById('overworld-map');
        const count = isLarge ? 30 : 20;
        const energyColors = ['#ffffff', '#fffbed', '#fff0b3', '#4db8ff', '#ffd24d'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * (isLarge ? 70 : 50) + 20;
            const driftX = Math.cos(angle) * force;
            const driftY = Math.sin(angle) * force;

            const puff = document.createElement('div');
            puff.className = 'smoke-plume-puff';
            puff.style.left = emitX + 'px';
            puff.style.top = emitY + 'px';
            puff.style.setProperty('--drift-x', `${driftX}px`);
            puff.style.setProperty('--drift-y', `${driftY}px`);
            puff.style.setProperty('--spark-color', energyColors[Math.floor(Math.random() * energyColors.length)]);

            const size = (isLarge ? 40 : 25) + Math.random() * 40;
            const dot = document.createElement('span');
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            puff.appendChild(dot);
            mapEl.appendChild(puff);
            setTimeout(() => { if (puff.parentNode) puff.parentNode.removeChild(puff); }, 1200);

            // High frequency of stars for the "Break" feel
            if (Math.random() < 0.6) {
                const spark = document.createElement('div');
                spark.className = 'thruster-spark';
                spark.style.left = emitX + 'px';
                spark.style.top = emitY + 'px';
                spark.style.setProperty('--drift-x', `${driftX * 1.8}px`);
                spark.style.setProperty('--drift-y', `${driftY * 1.8}px`);
                spark.style.setProperty('--spark-color', '#ffde59');
                spark.style.setProperty('--spark-size', `${Math.random() * 30 + 10}px`);
                mapEl.appendChild(spark);
                setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 500);
            }
        }
    },

    spawnHomerunParticles(curX, curY, width, height, directionKey) {
        const mapEl = document.getElementById('overworld-map');
        let emitX = curX + width / 2;
        let emitY = curY + height / 2;

        const energyColors = ['#ff4d4d', '#4dff88', '#4db8ff'];
        const driftX = (directionKey === 'l' ? 20 : (directionKey === 'r' ? -20 : (Math.random() - 0.5) * 40));
        const driftY = (directionKey === 'u' ? 20 : (directionKey === 'f' ? -20 : (Math.random() - 0.5) * 40));

        for (let i = 0; i < 4; i++) {
            const puff = document.createElement('div');
            puff.className = 'smoke-plume-puff';
            puff.style.left = emitX + 'px';
            puff.style.top = emitY + 'px';
            puff.style.setProperty('--drift-x', `${driftX * 3.0}px`);
            puff.style.setProperty('--drift-y', `${driftY * 3.0}px`);
            puff.style.setProperty('--spark-color', energyColors[Math.floor(Math.random() * energyColors.length)]);

            const size = 40 + Math.random() * 60;
            const dot = document.createElement('span');
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            puff.appendChild(dot);
            mapEl.appendChild(puff);
            setTimeout(() => { if (puff.parentNode) puff.parentNode.removeChild(puff); }, 1200);

            if (Math.random() < 0.7) {
                const spark = document.createElement('div');
                spark.className = 'thruster-spark';
                spark.style.left = emitX + 'px';
                spark.style.top = emitY + 'px';
                spark.style.setProperty('--drift-x', `${driftX * 3.0}px`);
                spark.style.setProperty('--drift-y', `${driftY * 3.0}px`);
                spark.style.setProperty('--spark-color', '#ffde59');
                spark.style.setProperty('--spark-size', `${Math.random() * 30 + 10}px`);
                mapEl.appendChild(spark);
                setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 500);
            }
        }
    },

    spawnFootstep(x, y, isSprinting = false, tag = 'tile') {
        const mapEl = document.getElementById('overworld-map');
        if (!mapEl) return;

        const puff = document.createElement('div');
        puff.className = `footstep-puff surf-${tag}`;

        const count = 3;
        for (let i = 0; i < count; i++) {
            const circle = document.createElement('span');
            const size = isSprinting ? (Math.random() * 8 + 10) : (Math.random() * 2 + 8);
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = isSprinting ? `${Math.random() * 20 - 5}px` : `${Math.random() * 10 - 2}px`;
            circle.style.top = isSprinting ? `${Math.random() * 12 - 4}px` : `${Math.random() * 8 - 2}px`;
            puff.appendChild(circle);
        }

        puff.style.left = `${(x * this.tileSize) + 20}px`;
        puff.style.top = `${(y * this.tileSize) + 40}px`;
        puff.style.zIndex = this.player.y + 5;

        mapEl.appendChild(puff);
        setTimeout(() => { if (puff.parentNode) puff.remove(); }, 500);
    },

    spawnKickImpactParticles(curX, curY, width, height, directionKey) {
        const mapEl = document.getElementById('overworld-map');
        let emitX = curX + width / 2;
        let emitY = curY + height / 2;

        const driftX = (directionKey === 'l' ? 10 : (directionKey === 'r' ? -10 : (Math.random() - 0.5) * 20));
        const driftY = (directionKey === 'u' ? 10 : (directionKey === 'f' ? -10 : (Math.random() - 0.5) * 20));

        // 5 puffs for a 'thud' burst feel
        for (let i = 0; i < 5; i++) {
            const puff = document.createElement('div');
            puff.className = 'smoke-plume-puff';
            puff.style.left = emitX + 'px';
            puff.style.top = emitY + 'px';

            // RANDOM RADIAL BURST logic
            const angle = Math.random() * Math.PI * 2;
            const force = 15 + Math.random() * 25;
            const randDriftX = (Math.cos(angle) * force) + (driftX * 1.5);
            const randDriftY = (Math.sin(angle) * force) + (driftY * 1.5);

            puff.style.setProperty('--drift-x', `${randDriftX}px`);
            puff.style.setProperty('--drift-y', `${randDriftY}px`);

            const size = 20 + Math.random() * 30;
            const dot = document.createElement('span');
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            puff.appendChild(dot);
            mapEl.appendChild(puff);
            setTimeout(() => { if (puff.parentNode) puff.parentNode.removeChild(puff); }, 800);

            if (Math.random() < 0.8) {
                const spark = document.createElement('div');
                spark.className = 'thruster-spark';
                spark.style.left = emitX + 'px';
                spark.style.top = emitY + 'px';

                // Stars burst even further
                const sparkForce = force * 1.4;
                const sDriftX = (Math.cos(angle) * sparkForce) + (driftX * 2);
                const sDriftY = (Math.sin(angle) * sparkForce) + (driftY * 2);

                spark.style.setProperty('--drift-x', `${sDriftX}px`);
                spark.style.setProperty('--drift-y', `${sDriftY}px`);
                spark.style.setProperty('--spark-color', '#ffde59');
                spark.style.setProperty('--spark-size', `${Math.random() * 25 + 15}px`);
                mapEl.appendChild(spark);
                setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 400);
            }
        }
    },

    /**
     * --- KICK DROP LOOT SYSTEM ---
     * Handles rolling for and spawning resource loot upon furniture interaction.
     */
    dropLoot(obj, isHomerun, directionKey) {
        if (!obj) return;

        // Use pre-rolled result if available for perfect audio sync
        let reward = obj._pendingLoot;
        obj._pendingLoot = null;

        // If no pre-roll was done, roll now
        if (!reward) {
            reward = this.calculateLoot(obj, isHomerun);
        }

        if (reward && reward.rewardType) {
            const amount = reward.amount;
            const rewardType = reward.rewardType;

            // Visual Particles (Accounting is handled on HIT in animateResourceHUD/changeResource)
            this.spawnLootParticles(obj.x, obj.y, rewardType, amount, directionKey);
        }
    },

    /**
     * Logical Loot Calculator - Separated from visuals for audio sync
     */
    calculateLoot(obj, isHomerun) {
        if (!obj) return null;

        const zone = this.zones[this.currentZone];
        const isLimited = zone && zone.dropPoolLimit;

        // Pool Definitions
        const pools = {
            '01': { nothing: 50, lc: 25, bm: 25, lcQty: 1, bmQty: 1 },
            '02': { nothing: 30, lc: 35, bm: 35, lcQty: 2, bmQty: 2 },
            '03': { nothing: 0, lc: 50, bm: 50, lcQty: 3, bmQty: 2 },
            '04': { nothing: 0, lc: 50, bm: 50, lcQty: 5, bmQty: 3 }
        };

        let selectedPool = '01';

        if (isLimited) {
            selectedPool = '01';
        } else if (obj.type === 'npc') {
            if (isHomerun) selectedPool = '04';
            else selectedPool = Math.random() < 0.5 ? '02' : '03';
        } else {
            if (isHomerun) selectedPool = Math.random() < 0.5 ? '03' : '04';
            else {
                const roll = Math.random();
                if (roll < 0.33) selectedPool = '01';
                else if (roll < 0.66) selectedPool = '02';
                else selectedPool = '03';
            }
        }

        const pool = pools[selectedPool];
        const resultRoll = Math.random() * 100;

        if (resultRoll < pool.lc) {
            return { rewardType: 'lc', amount: pool.lcQty };
        } else if (resultRoll < (pool.lc + pool.bm)) {
            return { rewardType: 'bm', amount: pool.bmQty };
        }
        return null;
    },

    spawnLootParticles(tileX, tileY, type, amount, directionKey) {
        const viewport = document.getElementById('game-container');
        const mapEl = document.getElementById('overworld-map');
        if (!viewport || !mapEl) return;

        const mapRect = mapEl.getBoundingClientRect();

        // Target HUD Elements
        const hudId = type === 'lc' ? 'hud-lc-val' : 'hud-bm-val';
        const targetEl = document.getElementById(hudId);
        const targetBox = targetEl ? targetEl.parentElement : null;
        if (!targetBox) return;
        const targetRect = targetBox.getBoundingClientRect();

        // Calculate spawn Screen coordinates
        const startX = mapRect.left + (tileX * this.tileSize) + (this.tileSize / 2);
        const startY = mapRect.top + (tileY * this.tileSize) + (this.tileSize / 2);

        for (let i = 0; i < amount; i++) {
            const particle = document.createElement('div');
            particle.className = `loot-resource-icon ${type === 'lc' ? 'lc' : 'biomass'}`;

            // Multi-variable Randomization
            let spreadX = 0, spreadY = 0;
            const randDist = Math.random() * 250 + 250; // 250-500px total spread
            const randArc = Math.random() * 40 - 20;   // Minimal +/- 20px vertical variance

            if (directionKey === 'l') {
                spreadX = -randDist;
                spreadY = randArc;
            } else if (directionKey === 'r') {
                spreadX = randDist;
                spreadY = randArc;
            } else if (directionKey === 'u') {
                spreadX = Math.random() * 200 - 100;
                spreadY = -randDist * 0.5; // Up-kicks still scatter slightly upwards
            } else { // 'f'
                spreadX = Math.random() * 200 - 100;
                spreadY = randDist * 0.5;
            }

            const spinTotal = (Math.random() * 360 + 360) * (Math.random() > 0.5 ? 1 : -1);
            const baseScale = 0.9 + (Math.random() * 0.4 - 0.2); // 20% variance around 0.9

            particle.style.setProperty('--spread-x', `${spreadX}px`);
            particle.style.setProperty('--spread-y', `${spreadY}px`);
            particle.style.setProperty('--spin-total', `${spinTotal}deg`);
            particle.style.setProperty('--base-scale', baseScale);

            // WORLD SPACE SPAWN
            const tileCenterX = (tileX * this.tileSize) + (this.tileSize / 2);
            const tileCenterY = (tileY * this.tileSize) + (this.tileSize / 2);

            particle.style.left = `${tileCenterX - 32}px`;
            particle.style.top = `${tileCenterY - 32}px`;

            particle.style.animation = `loot-burst-${directionKey} 1.0s ease-out forwards`;
            mapEl.appendChild(particle);

            // Phase 2: Predictive Handover to SCREEN SPACE and Fly to HUD
            setTimeout(() => {
                if (!particle.parentNode) return;

                // 1. CALCULATE MATHEMATICAL FINAL POSITION (PREDICTIVE)
                const currentMapRect = mapEl.getBoundingClientRect();
                const exactFinalX = currentMapRect.left + tileCenterX + spreadX - 32;
                const exactFinalY = currentMapRect.top + tileCenterY + spreadY - 32;

                // 2. SEAMLESS HANDOVER TO VIEWPORT
                particle.style.animation = 'none';
                viewport.appendChild(particle);

                // Set exactly at the predicted landing spot
                particle.style.left = `${exactFinalX}px`;
                particle.style.top = `${exactFinalY}px`;
                particle.style.transform = `rotate(${spinTotal}deg) scale(${baseScale})`;

                void particle.offsetWidth; // Reflow for new animation

                // 3. START FLIGHT
                particle.style.setProperty('--start-x', `${exactFinalX}px`);
                particle.style.setProperty('--start-y', `${exactFinalY}px`);
                particle.style.setProperty('--target-x', `${targetRect.left + targetRect.width / 2 - 32}px`);
                particle.style.setProperty('--target-y', `${targetRect.top + targetRect.height / 2 - 32}px`);
                particle.style.setProperty('--start-spin', `${spinTotal}deg`);
                particle.style.setProperty('--fly-spin', `${spinTotal + 720}deg`);

                particle.style.animation = 'loot-fly-to-hud 0.9s cubic-bezier(0.45, 0, 0.55, 1) forwards';

                // Cleanup and feedback
                setTimeout(() => {
                    if (particle.parentNode) particle.parentNode.removeChild(particle);
                    this.triggerHUDBounce(targetBox);

                    if (window.changeResource) {
                        window.changeResource(type, 1, true);
                    } else if (window.updateResourceHUD) {
                        window.updateResourceHUD();
                    }
                }, 900);
            }, 1000 + (i * 120) + (Math.random() * 250)); // Randomized arrival jitter (250ms)
        }
    },

    triggerHUDBounce(el) {
        if (!el) return;
        el.classList.remove('anim-pop');
        void el.offsetWidth;
        el.classList.add('anim-pop');

        // Trigger a tiny flash on the value itself
        const val = el.querySelector('.resource-value');
        if (val) {
            val.style.color = '#fff';
            val.style.textShadow = '0 0 15px #fff';
            setTimeout(() => {
                val.style.color = '';
                val.style.textShadow = '';
            }, 200);
        }
    },

    /**
     * Instantly clears all loot icons and resets HUD animation states.
     * Called during battle transitions or state resets.
     */
    cleanupLoot() {
        // 1. Remove all active icons from the viewport or map
        document.querySelectorAll('.loot-resource-icon').forEach(p => p.remove());

        // 2. Clear HUD pulse states
        document.querySelectorAll('.resource-item').forEach(el => {
            el.classList.remove('anim-pop');
        });
    }
};

window.Overworld = Overworld;

