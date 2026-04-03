/**
 * Overworld Engine for The Odd Labs
 * Handles grid-based movement, collisions, and zone transitions.
 */

import { gameState, saveGameState } from './state.js';
import { QUESTS } from '../data/quests.js';

export const Overworld = {
    randomPools: {
        lobby: [
            ["Welcome to Odd Labs!", "Please keep your badge visible at all times and avoid the bio-hazard chutes."],
            ["New here? Try to interact with computers, furniture, and people.", "It's the only way to uncover hidden data logs and gossip about the Director's lunch habits."],
            ["Keep your eye on the prize! Open your Cell-Inventory and Squad menu to manage your team.", "You can swap your active Cells and check their current membrane health there."],
            ["Your Research Grade (RG) is the primary measure of your scientific standing.", "Every time your RG level increases, you'll receive a new tactical C-Card to upgrade your Cell's combat capabilities."],
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
            ["Chef Theo says the secret to a good lab lunch is properly calibrated salinity.", "I think he just likes playing with the digital scales."]
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
            ["Curiosity is a researcher's greatest tool.", "If you see something that looks out of place, try interacting with it. You never know what secrets might be tucked away in the corners."],
            ["Research Cards are the culmination of our tactical data.", "Equipping these C-Card enhancements to your Cells allows for significant upgrades to their ability to survive any tactical engagement."],
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
        ]
    },
    tileSize: 64,
    player: {
        x: 10,
        y: 8,
        targetX: 10,
        targetY: 8,
        direction: 'down',
        isMoving: false,
        moveSpeed: 300, // ms per tile
        moveStartedAt: 0,
        isSprinting: false,
        isTurning: false,
        stepParity: 0, // 0 or 1 for alternating steps
        currentFrame: 0 // 0-3 for manual frame control
    },
    keysPressed: new Set(),
    currentZone: null,
    mapData: null,
    controlsInitialized: false,
    isDialogueActive: false,
    isTyping: false,
    currentFullText: "",
    currentDialoguePartner: null,
    dialogueQueue: [],
    typingInterval: null,
    isTransitioning: false,
    isPaused: false,
    lastInteractTime: 0,
    logsCollected: [], // Local cache, synced from gameState.logs in renderMap
    pendingIncubatorMenu: false, // flag for incubator healing flow
    pendingShopMenu: false, // New flag for shop terminal flow
    pendingSynthesisMenu: false, // New flag for synthesis terminal flow
    deferredItemPickup: null, // For rewards that trigger after dialogue
    onDialogueComplete: null, // Callback for when current dialogue ends
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

    // --- Entity Spawner System (Wild Encounters) ---
    spawner: {
        activeSpawn: null,
        spawnTimer: null,
        cooldownTimer: null,
        allowedZones: ['atrium', 'botanic', 'human', 'executive', 'specimenStorage', 'kitchen', 'storage', 'entertainment', 'ancientBotany', 'preservationRoom', 'library'],
        cooldownMs: 10000, // 10 seconds cooldown between spawns

        start() {
            if (!this.allowedZones.includes(Overworld.currentZone)) return;

            // 1. Orphaned Spawn Recovery: If we have an active spawn that isn't in the current zone's objects, clear it
            const zone = Overworld.zones[Overworld.currentZone];
            if (this.activeSpawn && zone && !zone.objects.some(o => o.id === this.activeSpawn.id)) {
                this.activeSpawn = null;
                if (this.spawnTimer) clearTimeout(this.spawnTimer);
                this.spawnTimer = null;
            }

            // 2. Lifespan Resume: If there's an active spawn but no timer (e.g. stopped during interaction/menu), resume its lifespan
            if (this.activeSpawn && !this.spawnTimer) {
                const lifespan = Math.floor(Math.random() * 5000) + 5000; // Residual lifespan
                this.spawnTimer = setTimeout(() => this.despawnCurrent(), lifespan);
                return;
            }

            if (this.activeSpawn || this.cooldownTimer || this.spawnTimer) return;
            this.scheduleSpawn();
        },

        stop() {
            if (this.spawnTimer) clearTimeout(this.spawnTimer);
            if (this.cooldownTimer) clearTimeout(this.cooldownTimer);
            this.spawnTimer = null;
            this.cooldownTimer = null;
        },

        resetForZoneChange() {
            this.stop();
            this.despawnCurrent();
            this.start(); // Will abort if zone not allowed
        },

        scheduleSpawn() {
            // Random time between 10s and 20s for next spawn
            const delay = Math.floor(Math.random() * 10000) + 10000;
            this.spawnTimer = setTimeout(() => this.spawnWildMonster(), delay);
        },

        spawnWildMonster() {
            if (!this.allowedZones.includes(Overworld.currentZone)) return;
            const zone = Overworld.zones[Overworld.currentZone];

            if (!zone) return;

            // 1. Determine which monster to spawn based on location
            let monsterId = 'stemmy';
            const roll = Math.random() * 100;

            if (['botanic', 'ancientBotany'].includes(Overworld.currentZone)) {
                if (roll < 60) monsterId = 'stemmy';
                else if (roll < 70) monsterId = 'nitrophil';
                else if (roll < 90) monsterId = 'cambihil';
                else monsterId = 'lydrosome';
            } else if (['human', 'preservationRoom'].includes(Overworld.currentZone)) {
                if (roll < 60) monsterId = 'stemmy';
                else if (roll < 70) monsterId = 'nitrophil';
                else if (roll < 80) monsterId = 'cambihil';
                else monsterId = 'lydrosome';
            } else if (['executive', 'library'].includes(Overworld.currentZone)) {
                if (roll < 60) monsterId = 'stemmy';
                else if (roll < 80) monsterId = 'nitrophil';
                else if (roll < 90) monsterId = 'cambihil';
                else monsterId = 'lydrosome';
            } else {
                // Atrium and other small rooms
                if (roll < 70) monsterId = 'stemmy';
                else if (roll < 80) monsterId = 'nitrophil';
                else if (roll < 90) monsterId = 'cambihil';
                else monsterId = 'lydrosome';
            }

            const monsterName = monsterId.charAt(0).toUpperCase() + monsterId.slice(1);

            // Define target radius: Spawn ~2-4 tiles away from player
            const radius = 3;
            let validSpots = [];

            for (let y = 0; y < zone.height; y++) {
                for (let x = 0; x < zone.width; x++) {
                    const dist = Math.abs(x - Overworld.player.x) + Math.abs(y - Overworld.player.y);
                    if (dist >= 2 && dist <= 5) {
                        const tileID = zone.layout[y][x];
                        const isGenericWall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 32].includes(tileID);
                        const isClosedDoor = [20, 22, 24, 25, 28, 29, 30, 31].includes(tileID);

                        if (!isGenericWall && !isClosedDoor) {
                            // Check objects collision
                            const isOccupied = zone.objects.some(obj => {
                                const meta = Overworld.getFurnitureMeta(obj.id, obj.customSprite);
                                if (meta && meta.hasCollision === false) return false;
                                const w = obj.width || 1;
                                const h = obj.height || 1;
                                return x >= obj.x && x < obj.x + w && y >= obj.y && y < obj.y + h;
                            });

                            if (!isOccupied) {
                                validSpots.push({ x, y });
                            }
                        }
                    }
                }
            }

            if (validSpots.length > 0) {
                const spot = validSpots[Math.floor(Math.random() * validSpots.length)];

                const wildObj = {
                    id: `${monsterId}_wild_` + Date.now(),
                    monsterId: monsterId,
                    x: spot.x,
                    y: spot.y,
                    type: 'npc',
                    name: `Wild ${monsterName}`,
                    direction: 'down',
                    temp: true
                };

                zone.objects.push(wildObj);
                this.activeSpawn = wildObj;

                // Render it instantly
                const mapEl = document.getElementById('overworld-map');
                const el = document.createElement('div');
                el.id = `npc-${wildObj.id}`;
                el.className = `world-object cell ${monsterId} anim-monster-pop`;
                el.style.width = `${Overworld.tileSize}px`;
                el.style.height = `${Overworld.tileSize}px`;
                el.style.left = `${spot.x * Overworld.tileSize}px`;
                el.style.top = `${spot.y * Overworld.tileSize}px`;
                el.style.zIndex = spot.y + 11;
                mapEl.appendChild(el);

                // Add breathing after pop animation (400ms)
                setTimeout(() => {
                    const checkEl = document.getElementById(`npc-${wildObj.id}`);
                    if (checkEl) checkEl.classList.add('anim-monster-breathing');
                }, 400);

                // Monster stays for ~10 to 20 seconds before despawning
                const lifespan = Math.floor(Math.random() * 10000) + 10000;
                this.spawnTimer = setTimeout(() => this.despawnCurrent(), lifespan);
            } else {
                // Try again later if blocked
                this.scheduleSpawn();
            }
        },

        despawnCurrent() {
            if (!this.activeSpawn) return;
            const spawnId = this.activeSpawn.id; // Localize ID to prevent race condition
            const zone = Overworld.zones[Overworld.currentZone];
            const idx = zone.objects.findIndex(o => o.id === spawnId);
            if (idx > -1) zone.objects.splice(idx, 1);

            const el = document.getElementById(`npc-${spawnId}`);
            if (el) {
                // Clear any existing animation classes and force reflow to ensure it plays
                el.classList.remove('anim-monster-pop', 'anim-monster-breathing', 'anim-recall-exit');
                void el.offsetWidth;

                el.classList.add('anim-recall-exit');
                setTimeout(() => {
                    // Re-verify element still exists before removing
                    const stillExists = document.getElementById(`npc-${spawnId}`);
                    if (stillExists) stillExists.remove();
                }, 400);
            }

            this.activeSpawn = null;
            if (this.spawnTimer) clearTimeout(this.spawnTimer);

            // Start Cooldown for next spawn
            this.cooldownTimer = setTimeout(() => {
                this.cooldownTimer = null;
                this.scheduleSpawn();
            }, this.cooldownMs);
        }
    },

    zones: {
        lobby: {
            name: 'LAB LOBBY',
            width: 11,
            height: 8,
            spawn: { x: 5, y: 6 },
            // Simplified grid for initialization (0=floor, 1=wall, 2=door, 3=interactable)
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 32, 15, 15, 15, 22, 15, 15, 15, 32, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 29, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'f38_lob', x: 2, y: 2, type: 'prop', name: 'Incubation Chamber' },
                { id: 'f39_lob', x: 3, y: 2, type: 'prop', name: 'Incubation Chamber' },
                { id: 'f40_lob', x: 2, y: 3, type: 'prop', name: 'Incubation Chamber' },
                { id: 'f41_lob', x: 3, y: 3, type: 'prop', name: 'Incubation Chamber' },
                // Corner Tank Arrays (Same as layout)
                { id: 'f15_lob_n1', x: 7, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_lob_n1', x: 7, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_lob_n2', x: 8, y: 2, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_lob_br', x: 8, y: 3, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_lob_tr', x: 9, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_lob_tr', x: 9, y: 3, type: 'prop', name: 'Green Specimen Tank' },

                { id: 'jenzi', x: 4, y: 4, type: 'npc', name: 'Jenzi' },

                // Wait Chairs at x=1 (Refined)
                { id: 'f59_lob_nw', x: 1, y: 3, type: 'prop', name: 'Decorative Bush' },
                { id: 'f1_lobby_wait1', x: 1, y: 4, type: 'prop', name: 'Lab Chair' },
                { id: 'f1_lobby_wait2', x: 1, y: 5, type: 'prop', name: 'Lab Chair' },

                // Reception Desk (Same)
                { id: 'f56_reception', x: 8, y: 5, type: 'prop', name: 'Leader Desk' },
                { id: 'f57_reception', x: 8, y: 6, type: 'prop', name: 'Leader Desk' },
                { id: 'f0_reception_desk', x: 9, y: 5, type: 'prop', name: 'Lab Chair' },

                // Accents and Decor
                { id: 'f6_lob1', x: 4, y: 2, type: 'prop', name: 'Lab Protocol' },
                { id: 'f17_lob1', x: 6, y: 2, type: 'prop', name: 'Wall Protocol' },
                { id: 'f59_lob1', x: 4, y: 3, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_lob2', x: 6, y: 3, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_lob3', x: 1, y: 6, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_lob4', x: 9, y: 6, type: 'prop', name: 'Decorative Bush' },
                { id: 'npc_male_lob1', x: 7, y: 5, type: 'npc', name: 'Researcher Mark' }
            ],
            doors: [
                { x: 5, y: 2, targetZone: 'atrium', targetX: 9, targetY: 13, requiredFlag: 'jenziAtriumUnlocked' }
            ]
        },
        atrium: {
            name: 'MAIN ATRIUM',
            width: 19,
            height: 15,
            spawn: { x: 9, y: 12 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1], // Row 0 (Edge)
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11], // Row 1 (Mid-Top)
                [10, 15, 32, 32, 15, 15, 15, 15, 15, 22, 15, 15, 15, 15, 15, 32, 32, 15, 11], // Row 2 (Mid-Bottom + Windows)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 3
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 4 (Side Doors Closed - Human on right)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 5
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 6 (Walls)
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 7 (Kitchen / Specimen Storage Shifted Down 1)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 8 (Walls)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 9
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 10 (Storage / Entertainment Shifted Down 2)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 11
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 12 (New Floor)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 13 (New Floor)
                [2, 9, 9, 9, 20, 9, 9, 9, 9, 20, 9, 9, 9, 29, 29, 9, 9, 9, 3] // Row 14 (Door at x=4)
            ],
            objects: [
                // Row 2 (Top Wall decorations & Tank Tops)
                { id: 'f13_at_tl', x: 1, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'f15_at_n1', x: 4, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'f52_at1', x: 5, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_at1', x: 6, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f22_at_n1', x: 7, y: 2, type: 'prop', name: 'Bio-Reactor' },
                { id: 'f6_at1', x: 8, y: 2, type: 'prop', name: 'Wall Decoration' },
                { id: 'f17_at1', x: 10, y: 2, type: 'prop', name: 'Wall Decoration' },
                { id: 'f22_at_n2', x: 11, y: 2, type: 'prop', name: 'Bio-Reactor' },
                { id: 'f52_at2', x: 12, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_at2', x: 13, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f15_at_n2', x: 14, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'f13_at_tr', x: 17, y: 2, type: 'prop', name: 'Specimen Tank' },

                // Row 3 (Tank Bottoms, Tables, Cabinet Bottoms, North Equipment)
                { id: 'f14_at_tl', x: 1, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'f4_n1', x: 2, y: 3, type: 'prop', name: 'Research Table' },
                { id: 'f5_n1', x: 3, y: 3, type: 'prop', name: 'Research Table' },
                { id: 'f16_at_n1', x: 4, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'f54_at1', x: 5, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_at1', x: 6, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f23_at_n1', x: 7, y: 3, type: 'prop', name: 'Bio-Reactor' },
                { id: 'f9_at_n1', x: 8, y: 3, type: 'prop', name: 'Lab Device' },
                { id: 'f7_at_n1', x: 10, y: 3, type: 'prop', name: 'Console Station', hiddenLogId: 'Log004' },
                { id: 'f23_at_n2', x: 11, y: 3, type: 'prop', name: 'Bio-Reactor' },
                { id: 'f54_at2', x: 12, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_at2', x: 13, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f16_at_n2', x: 14, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'f4_n2', x: 15, y: 3, type: 'prop', name: 'Research Table' },
                { id: 'f5_n2', x: 16, y: 3, type: 'prop', name: 'Research Table' },
                { id: 'f14_at_tr', x: 17, y: 3, type: 'prop', name: 'Specimen Tank' },

                // Row 5 (Sarah, Paul, Mixed Tank Tops)
                { id: 'npc_female_at1', x: 8, y: 4, type: 'npc', name: 'Assistant Sarah', sideQuestId: 'quest_sarah_firstcollection' },
                { id: 'f1_at_nw1', x: 2, y: 5, type: 'prop', name: 'Lab Chair' },
                { id: 'f11_at_nw', x: 3, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f11_at1', x: 5, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f0_at1', x: 6, y: 5, type: 'prop', name: 'Reception Desk' },
                { id: 'f13_at_acc', x: 8, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'f15_at_acc', x: 9, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'f22_at_acc', x: 10, y: 5, type: 'prop', name: 'Bio-Reactor' },
                { id: 'npc_male_at2', x: 7, y: 10, type: 'npc', name: 'Researcher Paul' },
                { id: 'f1_at_ne1', x: 12, y: 5, type: 'prop', name: 'Lab Chair' },
                { id: 'f11_at_ne', x: 13, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f11_at_e', x: 15, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f0_at2', x: 16, y: 5, type: 'prop', name: 'Reception Desk' },

                // Row 6 (Cluster Mid-B, Mixed Tank Bottoms Overlapping CellAcc Tops)
                { id: 'f1_at_nw2', x: 2, y: 6, type: 'prop', name: 'Lab Chair' },
                { id: 'f12_at_nw', x: 3, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f12_at1', x: 5, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f0_at1_b', x: 6, y: 6, type: 'prop', name: 'Reception Desk' },
                { id: 'f14_at_acc', x: 8, y: 6, type: 'prop', name: 'Specimen Tank' },
                { id: 'f16_at_acc', x: 9, y: 6, type: 'prop', name: 'Specimen Tank' },
                { id: 'f23_at_acc', x: 10, y: 6, type: 'prop', name: 'Bio-Reactor' },
                { id: 'f92_acc', x: 8, y: 6, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f93_acc', x: 9, y: 6, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f94_acc', x: 10, y: 6, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f1_at_ne2', x: 12, y: 6, type: 'prop', name: 'Lab Chair' },
                { id: 'f12_at_ne', x: 13, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f12_at_e', x: 15, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'f0_at2_b', x: 16, y: 6, type: 'prop', name: 'Reception Desk' },

                // Row 7 (Tom, Kevin, CellAccelerator Mid Row)
                {
                    id: 'npc_male_at3', x: 4, y: 6, type: 'npc', name: 'Biologist Tom',
                    battleEncounterId: 'tom',
                    dialogue: [
                        "Hey there. Have you noticed how the Pellicle Point system works?",
                        "Most focus on attacks, but PP management is where you see real results.",
                        "Spar with me? I'll show you the 'Positive Shield' effect. Ready?"
                    ],
                    npcWinDialogue: [
                        "Don't sweat it. The Pellicle Point system is all about balance.",
                        "You'll eventually turn your Pellicle Points into an advantage, but avoid that nasty 25% HP Overload discharge for now.",
                        "Take a breather and we'll try again later."
                    ],
                    npcLossDialogue: [
                        "Nice job! You've got a good handle on the tactical flow.",
                        "Tip: positive PP creates a kinetic shield, softening incoming hits.",
                        "Just don't hit Max PP—that'll cause a Pellicle Discharge, dealing 25% of your Max HP in damage!",
                        "Later, you'll unlock skills to 'vent' those Pellicle Points for massive damage. Keep it up!"
                    ]
                },
                { id: 'f95_acc', x: 8, y: 7, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f96_acc', x: 9, y: 7, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f97_acc', x: 10, y: 7, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                {
                    id: 'npc_male_at1', x: 14, y: 8, type: 'npc', name: 'Researcher Kevin',
                    battleEncounterId: 'kevin',
                    dialogue: [
                        "Salutations! I'm Biologist Kevin. Have you heard of the C-Card system?",
                        "They're bio-synthetic boosters that significantly enhance your Cell's stats and unlock powerful new skills and effects.",
                        "Slotting them into your Catalyst Box is essential for maximizing your tactical advantage in battle.",
                        "Ready to see how much of a difference a good build makes?"
                    ],
                    npcWinDialogue: [
                        "Predictable. You won't win without using a calibrated Catalyst Box to boost your stats.",
                        "You lacked the tactical effects needed to penetrate my defense.",
                        "Access your Inventory to slot new cards and see the results in your next battle. It's the best part of the job!"
                    ],
                    npcLossDialogue: [
                        "Inquiry! How did you bypass my dermal bio-ceramics? A high-frequency sync? Fascinating.",
                        "Pro-tip: Check your Catalyst Box in the Inventory menu to slot your rewards and boost your stats.",
                        "Increasing your Research Grade will unlock even more slots for skills and passive effects. Truly revolutionary!"
                    ]
                },

                // Row 8 (Analysis Tables, Leader Table, CellAccelerator Bottom Row, Lab Cylinders)
                { id: 'f26_at_nw_s', x: 2, y: 8, type: 'prop', name: 'Analysis Table' },
                { id: 'f27_at_nw_s', x: 3, y: 8, type: 'prop', name: 'Analysis Table' },
                { id: 'f26_at1_s', x: 5, y: 8, type: 'prop', name: 'Analysis Table' },
                { id: 'f27_at1_s', x: 6, y: 8, type: 'prop', name: 'Analysis Table' },
                { id: 'f98_acc', x: 8, y: 8, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f99_acc', x: 9, y: 8, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f100_acc', x: 10, y: 8, type: 'prop', name: 'Cell-Accelerator', customSprite: 'tileset-03' },
                { id: 'f8_at_s1', x: 12, y: 8, type: 'prop', name: 'Lab Equipment' },
                { id: 'f9_at_s1', x: 13, y: 8, type: 'prop', name: 'Lab Device' },
                { id: 'f28_at_s1', x: 15, y: 8, type: 'prop', name: 'Executive Desk' },
                { id: 'f29_at_s1', x: 16, y: 8, type: 'prop', name: 'Executive Desk' },

                // Row 9 (More Equipment, Computers, Supply Cabinets)
                { id: 'f8_at_s2', x: 2, y: 9, type: 'prop', name: 'Lab Equipment' },
                { id: 'f9_at_s2', x: 3, y: 9, type: 'prop', name: 'Lab Device' },
                { id: 'f7_at_s1', x: 5, y: 9, type: 'prop', name: 'Console Station' },
                { id: 'f7_at_s2', x: 6, y: 9, type: 'prop', name: 'Console Station' },
                { id: 'f7_at_s3', x: 12, y: 9, type: 'prop', name: 'Console Station' },
                { id: 'f7_at_s4', x: 13, y: 9, type: 'prop', name: 'Console Station' },
                { id: 'f58_at5', x: 15, y: 9, type: 'prop', name: 'Supply Cabinet' },
                { id: 'f58_at6', x: 16, y: 9, type: 'prop', name: 'Supply Cabinet' },

                // Row 10 (Storage Cabinet Tops x4)
                { id: 'f52_at_w1', x: 2, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_at_w1', x: 3, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f52_at_w2', x: 5, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_at_w2', x: 6, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f52_at_e1', x: 12, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_at_e1', x: 13, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f52_at_e2', x: 15, y: 10, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_at_e2', x: 16, y: 10, type: 'prop', name: 'Storage Cabinet' },

                // Row 11 (Cabinet Bottoms x4, Julia)
                { id: 'f54_at_w1', x: 2, y: 11, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_at_w1', x: 3, y: 11, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f54_at_w2', x: 5, y: 11, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_at_w2', x: 6, y: 11, type: 'prop', name: 'Storage Cabinet' },
                {
                    id: 'npc_female_at2', x: 11, y: 11, type: 'npc', name: 'Scientist Julia',
                    battleEncounterId: 'julia',
                    dialogue: [
                        "Excuse me, Intern! Have you mastered the Matching Attack Placement (MAP) system yet?",
                        "It's the core of our tactical research.",
                        "If you can prove your proficiency, I'll share some insights on the finer points of MAP."
                    ],
                    npcWinDialogue: ["Don't be discouraged! Sometimes a bit of luck helps with the final sync, but skill is the foundation!", "Just keep practicing your placement."],
                    npcLossDialogue: [
                        "Incredible! Your placement was precise.",
                        "That's the secret to the MAP system—it's not just about power, it's about the proximity of your attack nodes.",
                        "Think of it like a puzzle: the closer you are to the target, the more damage you deal and the more Pellicle Points (PP) you gain.",
                        "It's all about finding that sweet spot!"
                    ]
                },
                { id: 'f54_at_e1', x: 12, y: 11, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_at_e1', x: 13, y: 11, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f54_at_e2', x: 15, y: 11, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_at_e2', x: 16, y: 11, type: 'prop', name: 'Storage Cabinet' },

                // Row 12 (Box Pile Tops)
                { id: 'f61_at_s2', x: 1, y: 12, type: 'prop', name: 'Box Pile' },
                { id: 'f61_at_s3', x: 7, y: 12, type: 'prop', name: 'Box Pile' },
                { id: 'f61_at_s4', x: 16, y: 12, type: 'prop', name: 'Box Pile' },

                // Row 13 (Southern Path Decorations & Box Pile Bottoms)
                { id: 'f62_at_s2', x: 1, y: 13, type: 'prop', name: 'Box Pile' },
                { id: 'f59_at_s1', x: 2, y: 13, type: 'prop', name: 'Atrium Decoration' },
                { id: 'f3_at_s1', x: 3, y: 13, type: 'prop', name: 'Meeting Table' },
                { id: 'f62_at_s3', x: 7, y: 13, type: 'prop', name: 'Box Pile', hiddenLogId: 'Log005' },
                { id: 'f59_at_s4', x: 8, y: 13, type: 'prop', name: 'Atrium Decoration' },
                { id: 'f59_at_s5', x: 10, y: 13, type: 'prop', name: 'Atrium Decoration' },
                { id: 'f8_at_s4', x: 11, y: 13, type: 'prop', name: 'Lab Equipment' },
                { id: 'f59_at_s6', x: 12, y: 13, type: 'prop', name: 'Atrium Decoration' },
                { id: 'f59_at_s7', x: 15, y: 13, type: 'prop', name: 'Atrium Decoration' },
                { id: 'f62_at_s4', x: 16, y: 13, type: 'prop', name: 'Box Pile' },
                { id: 'f9_at_s4', x: 17, y: 13, type: 'prop', name: 'Lab Device' }
            ],
            doors: [
                { x: 9, y: 14, targetZone: 'lobby', targetX: 5, targetY: 3 },
                { x: 4, y: 14, targetZone: 'bioExtraction', targetX: 5, targetY: 3 },
                { x: 0, y: 7, targetZone: 'kitchen', targetX: 9, targetY: 4, requiredFlag: 'botanicSectorUnlocked' },
                { x: 0, y: 10, targetZone: 'entertainment', targetX: 8, targetY: 6 },
                { x: 18, y: 10, targetZone: 'storage', targetX: 1, targetY: 6 },
                { x: 0, y: 4, targetZone: 'botanic', targetX: 13, targetY: 13, requiredFlag: 'botanicSectorUnlocked' },
                { x: 18, y: 4, targetZone: 'human', targetX: 1, targetY: 13, requiredFlag: 'humanWardUnlocked' },
                { x: 18, y: 7, targetZone: 'specimenStorage', targetX: 1, targetY: 4, requiredFlag: 'humanWardUnlocked' },
                { x: 9, y: 2, targetZone: 'executive', targetX: 7, targetY: 7, requiredFlag: 'executiveSuiteUnlocked' }
            ]
        },
        bioExtraction: {
            name: 'BIO EXTRACTION ROOM',
            width: 8,
            height: 10,
            spawn: { x: 5, y: 3 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 1], // Row 0
                [10, 14, 14, 14, 14, 14, 14, 11], // Row 1
                [10, 15, 15, 15, 15, 22, 15, 11], // Row 2 (Door at index 5)
                [10, 13, 13, 13, 13, 13, 13, 11], // Row 3
                [10, 13, 13, 13, 13, 13, 13, 11], // Row 4
                [10, 13, 13, 13, 13, 13, 13, 11], // Row 5
                [10, 13, 13, 13, 13, 13, 13, 11], // Row 6
                [10, 13, 13, 13, 13, 13, 13, 11], // Row 7
                [10, 13, 13, 13, 13, 13, 13, 11], // Row 8
                [2, 9, 9, 9, 9, 9, 9, 3]  // Row 9
            ],
            objects: [
                // Bio-Extractor centered in 8x10 room
                // Horizontal: indices 3, 4 | Vertical: indices 4, 5, 6
                { id: 'f42_bio', x: 3, y: 4, type: 'prop', name: 'Bio-Extractor' },
                { id: 'f43_bio', x: 4, y: 4, type: 'prop', name: 'Bio-Extractor' },
                { id: 'f44_bio', x: 3, y: 5, type: 'prop', name: 'Bio-Extractor' },
                { id: 'f45_bio', x: 4, y: 5, type: 'prop', name: 'Bio-Extractor' },
                { id: 'f46_bio', x: 3, y: 6, type: 'prop', name: 'Bio-Extractor' },
                { id: 'f47_bio', x: 4, y: 6, type: 'prop', name: 'Bio-Extractor' },
                // Decorative Plants
                { id: 'f59_bio_nw', x: 1, y: 3, type: 'prop', name: 'Potted Plant' },
                { id: 'f4_bio_n', x: 2, y: 3, type: 'prop', name: 'Research Table' },
                { id: 'f5_bio_n', x: 3, y: 3, type: 'prop', name: 'Research Table' },
                { id: 'f7_bio_n', x: 4, y: 3, type: 'prop', name: 'Research Terminal' },
                { id: 'f59_bio_ne', x: 6, y: 3, type: 'prop', name: 'Potted Plant' },
                { id: 'f59_bio_sw', x: 1, y: 8, type: 'prop', name: 'Potted Plant' },
                { id: 'f59_bio_se', x: 6, y: 8, type: 'prop', name: 'Potted Plant' },
                // Huge Petry Dishes
                { id: 'f103_bio_l1', x: 1, y: 4, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_l2', x: 1, y: 5, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_l3', x: 1, y: 6, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_l4', x: 1, y: 7, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_r1', x: 6, y: 4, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_r2', x: 6, y: 5, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_r3', x: 6, y: 6, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_r4', x: 6, y: 7, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_s1', x: 2, y: 8, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_s2', x: 3, y: 8, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_s3', x: 4, y: 8, type: 'prop', name: 'Huge Petry Dish' },
                { id: 'f103_bio_s4', x: 5, y: 8, type: 'prop', name: 'Huge Petry Dish' }
            ],
            doors: [
                { x: 5, y: 2, targetZone: 'atrium', targetX: 4, targetY: 13 }
            ]
        },
        specimenStorage: {
            name: 'SPECIMEN STORAGE',
            width: 20,
            height: 8,
            spawn: { x: 1, y: 4 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1], // Row 0
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11], // Row 1
                [10, 15, 15, 15, 15, 15, 22, 15, 15, 15, 15, 15, 15, 22, 15, 15, 15, 15, 15, 11], // Row 2
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 3
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 4 (Doors moved up)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 5 (Shifted wall back)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 6
                [2, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 3] // Row 7 (Bottom Wall)
            ],
            objects: [
                // Top Row of Tanks (Varied)
                { id: 'f13_spec1', x: 1, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec1', x: 1, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec2', x: 2, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec2', x: 2, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec3', x: 3, y: 2, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec3', x: 3, y: 3, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_spec4', x: 4, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec4', x: 4, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec5', x: 5, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec5', x: 5, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec6', x: 9, y: 2, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec6', x: 9, y: 3, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_spec7', x: 7, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec7', x: 7, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec8', x: 8, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec8', x: 8, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f13_spec10', x: 10, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec10', x: 10, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec11', x: 11, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec11', x: 11, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec12', x: 12, y: 2, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec12', x: 12, y: 3, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f15_spec14', x: 14, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec14', x: 14, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec15', x: 15, y: 2, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec15', x: 15, y: 3, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_spec16', x: 16, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec16', x: 16, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec17', x: 17, y: 2, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec17', x: 17, y: 3, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec18', x: 18, y: 2, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec18', x: 18, y: 3, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'npc_male_white', x: 11, y: 4, type: 'npc', name: 'Researcher White', direction: 'down' },
                { id: 'npc_female_cherry', x: 15, y: 4, type: 'npc', name: 'Researcher Cherry', direction: 'down' },
                { id: 'npc_male_eli', x: 5, y: 5, type: 'npc', name: 'Assistant Eli', direction: 'down' },

                // Bottom Row of Tanks (Varied)
                { id: 'f13_spec19', x: 1, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec19', x: 1, y: 6, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec20', x: 2, y: 5, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec20', x: 2, y: 6, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec21', x: 3, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec21', x: 3, y: 6, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_spec22', x: 4, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec22', x: 4, y: 6, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec23', x: 5, y: 5, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec23', x: 5, y: 6, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec24', x: 9, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec24', x: 9, y: 6, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_spec25', x: 7, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec25', x: 7, y: 6, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec26', x: 8, y: 5, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec26', x: 8, y: 6, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f13_spec28', x: 10, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec28', x: 10, y: 6, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec29', x: 11, y: 5, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec29', x: 11, y: 6, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec30', x: 12, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec30', x: 12, y: 6, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f15_spec32', x: 14, y: 5, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec32', x: 14, y: 6, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec33', x: 15, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec33', x: 15, y: 6, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f13_spec34', x: 16, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f14_spec34', x: 16, y: 6, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f15_spec35', x: 17, y: 5, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f16_spec35', x: 17, y: 6, type: 'prop', name: 'Blue Specimen Tank' },
                { id: 'f22_spec36', x: 18, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_spec36', x: 18, y: 6, type: 'prop', name: 'Red Specimen Tank' }
            ],
            doors: [
                { x: 0, y: 4, targetZone: 'atrium', targetX: 17, targetY: 7 },
                { x: 6, y: 7, targetZone: 'storage', targetX: 5, targetY: 3, requiredFlag: 'humanWardUnlocked' },
                { x: 6, y: 2, targetZone: 'human', targetX: 7, targetY: 14 },
                { x: 19, y: 4, targetZone: 'old_lab', targetX: 1, targetY: 4, requiredItems: ['Quest01', 'Quest02', 'Quest03'] },
                { x: 13, y: 2, targetZone: 'executive', targetX: 18, targetY: 7, requiredFlag: 'executiveSuiteUnlocked' },
                { x: 13, y: 7, targetZone: 'truth_room', targetX: 5, targetY: 3, requiredItem: 'Quest05' }
            ]
        },
        truth_room: {
            name: 'THE TRUTH ROOM',
            width: 11,
            height: 8,
            spawn: { x: 5, y: 3 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 22, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [],
            doors: [
                { x: 5, y: 2, targetZone: 'specimenStorage', targetX: 13, targetY: 6 }
            ]
        },
        old_lab: {
            name: 'THE OLD LAB (SECRET)',
            width: 11,
            height: 8,
            spawn: { x: 1, y: 4 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'f61_ol1', x: 1, y: 2, type: 'prop', name: 'Stacked Boxes' },
                { id: 'f62_ol1', x: 1, y: 3, type: 'prop', name: 'Stacked Boxes' },
                { id: 'f61_ol2', x: 2, y: 2, type: 'prop', name: 'Stacked Boxes' },
                { id: 'f62_ol3', x: 2, y: 3, type: 'prop', name: 'Storage Box' },
                { id: 'f52_ol1', x: 6, y: 2, type: 'prop', name: 'Large Cabinet' },
                { id: 'f53_ol1', x: 7, y: 2, type: 'prop', name: 'Large Cabinet' },
                { id: 'f54_ol1', x: 6, y: 3, type: 'prop', name: 'Large Cabinet' },
                { id: 'f55_ol1', x: 7, y: 3, type: 'prop', name: 'Large Cabinet' },
                { id: 'f37_ol1', x: 3, y: 3, type: 'prop', name: 'Empty Bowl' },
                { id: 'f37_ol2', x: 4, y: 3, type: 'prop', name: 'Empty Bowl' },
                { id: 'f36_ol1', x: 5, y: 3, type: 'prop', name: 'Fresh Noodles' },
                { id: 'f30_ol1', x: 8, y: 3, type: 'prop', name: 'Director Desk', hiddenLogId: 'Log999' },
                { id: 'f31_ol1', x: 9, y: 3, type: 'prop', name: 'Director Desk' },
                { id: 'f37_ol3', x: 6, y: 4, type: 'prop', name: 'Empty Bowl' },
                { id: 'f0_ol1', x: 9, y: 4, type: 'prop', name: 'Lab Chair' },
                { id: 'item_origin_nitrophil', x: 5, y: 4, type: 'cell', name: 'Origin Nitrophil', hiddenItemId: 'Quest04', customSprite: 'c3 orange-hue' },
                { id: 'f22_ol1', x: 1, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_ol1', x: 1, y: 6, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f61_ol2_dup', x: 3, y: 5, type: 'prop', name: 'Stacked Boxes' },
                { id: 'f62_ol4', x: 3, y: 6, type: 'prop', name: 'Stacked Boxes' },
                { id: 'f34_ol1', x: 6, y: 5, type: 'prop', name: 'Model Skeleton' },
                { id: 'f35_ol1', x: 6, y: 6, type: 'prop', name: 'Model Skeleton' },
                { id: 'f60_ol1', x: 8, y: 5, type: 'prop', name: 'Small Box' },
                { id: 'f60_ol2', x: 8, y: 6, type: 'prop', name: 'Small Box' },
                { id: 'f22_ol2', x: 9, y: 5, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f23_ol2', x: 9, y: 6, type: 'prop', name: 'Red Specimen Tank' },
                { id: 'f9_ol1', x: 2, y: 6, type: 'prop', name: 'Research Device' },
                { id: 'f8_ol1', x: 4, y: 6, type: 'prop', name: 'Lab Glassware' },
                { id: 'f37_ol4', x: 5, y: 6, type: 'prop', name: 'Empty Bowl' },
                { id: 'f36_ol2', x: 7, y: 6, type: 'prop', name: 'Fresh Noodles' }
            ],
            doors: [
                { x: 0, y: 4, targetZone: 'specimenStorage', targetX: 18, targetY: 4 }
            ]
        },
        botanic: {
            name: 'BOTANIC SECTOR',
            width: 15,
            height: 16,
            spawn: { x: 7, y: 13 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 32, 32, 32, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'lana', x: 7, y: 3, type: 'npc', name: 'Lana' },
                // North Storage Row (y=3 with y=2 tops)
                { id: 'f52_bot1', x: 1, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'f53_bot1', x: 2, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'f13_lanaTank1B', x: 3, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f20_lanaTop1', x: 10, y: 2, type: 'prop', name: 'Fern Specimen' },
                { id: 'f13_lanaTank1', x: 11, y: 2, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f52_bot2', x: 12, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'f53_bot2', x: 13, y: 2, type: 'prop', name: 'Storage Unit' },

                { id: 'f54_bot1', x: 1, y: 3, type: 'prop', name: 'Storage Unit', hiddenLogId: 'Log007' },
                { id: 'f55_bot1', x: 2, y: 3, type: 'prop', name: 'Storage Unit' },
                { id: 'f14_lanaTank1B', x: 3, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f91_bot2', x: 4, y: 3, type: 'prop', name: 'Empty Pot' },
                { id: 'f59_lanaBush1', x: 5, y: 3, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_lanaBush2', x: 9, y: 3, type: 'prop', name: 'Decorative Bush' },
                { id: 'f21_lanaBot1', x: 10, y: 3, type: 'prop', name: 'Fern Specimen' },
                { id: 'f14_lanaTank1', x: 11, y: 3, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f54_bot2', x: 12, y: 3, type: 'prop', name: 'Storage Unit' },
                { id: 'f55_bot2', x: 13, y: 3, type: 'prop', name: 'Storage Unit' },
                // Upper Garden Cluster (y=4,5,6,7) - STACK at x=4
                { id: 'f24_bot1', x: 2, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot1', x: 2, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot2', x: 3, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot2', x: 3, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot3a', x: 4, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot3a', x: 4, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot3b', x: 4, y: 5, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot3b', x: 4, y: 6, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot3c', x: 4, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot3c', x: 4, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot4', x: 5, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot4', x: 5, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot5', x: 6, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot5', x: 6, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f13_bot1', x: 8, y: 4, type: 'prop', name: 'Green Specimen Tank' }, { id: 'f14_bot1', x: 8, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f13_bot2', x: 9, y: 4, type: 'prop', name: 'Green Specimen Tank' }, { id: 'f14_bot2', x: 9, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f38_bot1', x: 10, y: 4, type: 'prop', name: 'Incubation Chamber' }, { id: 'f39_bot1', x: 11, y: 4, type: 'prop', name: 'Incubation Chamber' },
                { id: 'f40_bot1', x: 10, y: 5, type: 'prop', name: 'Incubation Chamber' }, { id: 'f41_bot1', x: 11, y: 5, type: 'prop', name: 'Incubation Chamber' },
                { id: 'f13_bot3', x: 12, y: 4, type: 'prop', name: 'Green Specimen Tank' }, { id: 'f14_bot3', x: 12, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                { id: 'f13_bot4', x: 13, y: 4, type: 'prop', name: 'Green Specimen Tank' }, { id: 'f14_bot4', x: 13, y: 5, type: 'prop', name: 'Green Specimen Tank' },
                // Middle Garden Cluster (y=6,7)
                { id: 'f24_bot6', x: 2, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot6', x: 2, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot7', x: 3, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot7', x: 3, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot9', x: 5, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot9', x: 5, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f24_bot10', x: 6, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'f25_bot10', x: 6, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'f60_bot1', x: 8, y: 7, type: 'prop', name: 'Archived Samples' },
                { id: 'f28_bot1', x: 9, y: 7, type: 'prop', name: 'Lead Analysis Desk', hiddenLogId: 'Log010' },
                { id: 'f29_bot1', x: 10, y: 7, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'f61_bot1', x: 11, y: 6, type: 'prop', name: 'Stacked Boxes' }, { id: 'f62_bot1', x: 11, y: 7, type: 'prop', name: 'Stacked Boxes' },
                { id: 'KeyItem-SecretCard_bot1', x: 12, y: 7, type: 'prop', name: 'Access Key' },
                { id: 'f61_bot2', x: 13, y: 6, type: 'prop', name: 'Stacked Boxes' }, { id: 'f62_bot2', x: 13, y: 7, type: 'prop', name: 'Stacked Boxes' },
                // Refined Hedge Row (y=8) with Column 7 Path
                { id: 'f59_bot1', x: 1, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_bot2', x: 2, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_bot3', x: 3, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_bot4', x: 4, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f91_bot5', x: 5, y: 8, type: 'prop', name: 'Empty Pot' },
                { id: 'f59_bot6', x: 6, y: 8, type: 'prop', name: 'Decorative Bush' },
                // Path at x=7
                { id: 'f59_bot7', x: 8, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_bot8', x: 9, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f91_bot9', x: 10, y: 8, type: 'prop', name: 'Empty Pot' },
                { id: 'f59_bot10', x: 11, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_bot11', x: 12, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'f59_bot12', x: 13, y: 8, type: 'prop', name: 'Decorative Bush' },
                // Expanded Lower Garden Rows (y=9-12) - STACKS at x=4 and x=10
                { id: 'f91_botA1', x: 2, y: 10, type: 'prop', name: 'Empty Pot' },
                { id: 'f20_botA2', x: 3, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA2', x: 3, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA3a', x: 4, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA3a', x: 4, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA3b', x: 4, y: 10, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA3b', x: 4, y: 11, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA3c', x: 4, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA3c', x: 4, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA4', x: 5, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA4', x: 5, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA5', x: 6, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA5', x: 6, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_bot1', x: 8, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot1', x: 8, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_bot2', x: 9, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot2', x: 9, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_bot3a', x: 10, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot3a', x: 10, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_bot3b', x: 10, y: 10, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot3b', x: 10, y: 11, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_bot3c', x: 10, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot3c', x: 10, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_bot4', x: 11, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot4', x: 11, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_bot5', x: 12, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot5', x: 12, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'f20_botA6', x: 2, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA6', x: 2, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA7', x: 3, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA7', x: 3, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA9', x: 5, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA9', x: 5, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_botA10', x: 6, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'f21_botA10', x: 6, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'f20_bot6', x: 8, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot6', x: 8, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'f91_bot7', x: 9, y: 12, type: 'prop', name: 'Empty Pot' },
                { id: 'f20_bot9', x: 11, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'f21_bot9', x: 11, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'f91_bot10', x: 12, y: 12, type: 'prop', name: 'Empty Pot' },
                // Final Station Wall (y=13,14)
                { id: 'f61_bot3', x: 1, y: 13, type: 'prop', name: 'Stacked Boxes' }, { id: 'f62_bot3', x: 1, y: 14, type: 'prop', name: 'Stacked Boxes' },
                { id: 'f26_bot1', x: 2, y: 14, type: 'prop', name: 'Research Station', hiddenLogId: 'Log006' },
                { id: 'f27_bot1', x: 3, y: 14, type: 'prop', name: 'Research Station' },
                { id: 'f60_bot2', x: 4, y: 14, type: 'prop', name: 'Archived Samples' },
                { id: 'f91_bot3', x: 5, y: 14, type: 'prop', name: 'Empty Pot' },
                { id: 'f9_bot1', x: 6, y: 14, type: 'prop', name: 'Protein Sequencer' },
                { id: 'f8_bot1', x: 8, y: 14, type: 'prop', name: 'Lab Cylinders' },
                { id: 'f60_bot5', x: 9, y: 14, type: 'prop', name: 'Archived Samples' },
                { id: 'f28_bot2', x: 10, y: 14, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'f29_bot2', x: 11, y: 14, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'f26_bot2', x: 12, y: 14, type: 'prop', name: 'Research Station' },
                { id: 'f27_bot2', x: 13, y: 14, type: 'prop', name: 'Research Station' },
                // Staff NPCs
                { id: 'npc_male_bot1', x: 2, y: 9, type: 'npc', name: 'Researcher Evan' },
                {
                    id: 'npc_female_bot1', x: 1, y: 5, type: 'npc', name: 'Scientist Clara',
                    battleEncounterId: 'clara',
                    dialogue: [
                        "The Botanic Sector is a delicate ecosystem. You can't just barge in without a plan!",
                        "Have you analyzed the elemental spectrum? Every organism here has a specific nature that can be countered.",
                        "If you don't know your types, this will be a very short lesson."
                    ],
                    npcWinDialogue: [
                        "Efficiency is the cornerstone of research. To succeed, one must master elemental counters: Thermal melts Botanic, Botanic absorbs Osmotic, and Osmotic cools Thermal.",
                        "Always analyze the nature of your target before initiating a sync."
                    ],
                    npcLossDialogue: [
                        "Incredible! Identifying the elemental nature of your opponent is the first step toward mastery.",
                        "Each type has a counter: Thermal melts Botanic, Botanic absorbs Osmotic, and Osmotic cools Thermal. These 1.5x multipliers are the only way to survive the deeper wards."
                    ]
                },
                {
                    id: 'npc_male_bot2', x: 13, y: 9, type: 'npc', name: 'Tech Leo',
                    battleEncounterId: 'leo',
                    dialogue: [
                        "New intern, right? You're entering a sector where one Basic skill just isn't enough to manage the tactical load.",
                        "Have you heard of the 'Second Brain'? It's a special card that unlocks an additional skill slot just by being in your squad's Catalyst Box.",
                        "Let's see if you're ready for that kind of growth!"
                    ],
                    npcWinDialogue: [
                        "Lagging behind? If a Second Brain isn't enough to save you, maybe you should start looking for a third!"
                    ],
                    npcLossDialogue: [
                        "Solid processing speed! Remember, the Second Brain card's presence alone grants you that extra Pellicle slot.",
                        "It allows you to equip a second active skill, giving you much more control over your Pellicle Points (PP) in battle."
                    ]
                },
                {
                    id: 'npc_female_bot2', x: 9, y: 11, type: 'npc', name: 'Researcher Rose',
                    battleEncounterId: 'rose',
                    dialogue: [
                        "Be careful—if you push your Cell too hard, it'll literally fall apart.",
                        "Most interns think Negative PP is just a number, but it's a structural failure waiting to happen.",
                        "Want to see what 'Lysis' looks like up close?"
                    ],
                    npcWinDialogue: [
                        "See that extra damage? That's the Lysis Penalty.",
                        "For every point of Negative PP, you take 10% more damage from every hit. It's like fighting without a skin!"
                    ],
                    npcLossDialogue: [
                        "Risky, but effective! You managed to 'vent' your PP just before your membrane collapsed.",
                        "Remember: every point below zero increases incoming damage by 10%. If you hit your debt limit (your negative Max PP), you're taking DOUBLE damage!",
                        "It's called the 'Lysis State'—your cell's structural integrity is compromised."
                    ]
                },
            ],
            doors: [
                { x: 14, y: 13, targetZone: 'atrium', targetX: 1, targetY: 4 },
                { x: 7, y: 15, targetZone: 'kitchen', targetX: 7, targetY: 3 },
                { x: 0, y: 13, targetZone: 'ancientBotany', targetX: 31, targetY: 5 }
            ]
        },
        ancientBotany: {
            name: 'ANCIENT BOTANY LAB',
            width: 33,
            height: 9,
            spawn: { x: 16, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 27],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                // [AI_DECORATION_PROTOCOL] START RENDER: Rows 2-7 (v4.1)
                // Row 2: CONTINUOUS PLANT TOPS (F88) (1-31)
                ...Array.from({ length: 31 }, (_, i) => ({ id: 'f88', x: i + 1, y: 2, type: 'prop', customSprite: 'tileset-03' })),

                // Row 3: CONTINUOUS PLANT BOTTOMS (F89) + SCATTERED TOP OVERLAPS (1-31)
                ...Array.from({ length: 31 }, (_, i) => {
                    const x = i + 1;
                    const items = [{ id: 'f89', x, y: 3, type: 'prop', customSprite: 'tileset-03' }];

                    // LAYER_RESOLVE: Items listed later appear in front
                    if (x === 1) items.push({ id: 'f13', x, y: 3, type: 'prop' }); // Tank Top (Bottom at 1,4)
                    if (x === 5) items.push({ id: 'f13', x, y: 3, type: 'prop' }); // Tank Top (Bottom at 5,4)
                    if (x === 26) items.push({ id: 'f61', x, y: 3, type: 'prop' }); // Box Top (Bottom at 26,4)
                    if (x === 28) items.push({ id: 'f61', x, y: 3, type: 'prop' }); // Box Top (Bottom at 28,4)

                    // Add Tops of equipment below (Y=4)
                    if (x === 8) items.push({ id: 'f88', x, y: 3, type: 'prop', customSprite: 'tileset-03' }); // Plant Top (Bottom at 8,4)
                    if (x === 14) items.push({ id: 'f88', x, y: 3, type: 'prop', customSprite: 'tileset-03' }); // Plant Top (Bottom at 14,4)

                    return items;
                }).flat(),

                // Row 4: SCATTERED EQUIPMENT & BOTTOMS & SOME TOPS for row 5
                { id: 'f14', x: 1, y: 4, type: 'prop' }, // Tank Bottom (Top at 1,3)
                { id: 'f86', x: 3, y: 4, type: 'prop', customSprite: 'tileset-03' }, // Healthy Top (Bottom at 3,5)
                { id: 'f14', x: 5, y: 4, type: 'prop' }, // Tank Bottom (Top at 5,3)
                { id: 'f7', x: 7, y: 4, type: 'prop' }, // Computer
                { id: 'f89', x: 8, y: 4, type: 'prop', customSprite: 'tileset-03' }, // Plant Bottom (Top at 8,3)
                { id: 'f9', x: 10, y: 4, type: 'prop' }, // Sequencer
                { id: 'f8', x: 11, y: 4, type: 'prop' }, // Cylinders
                { id: 'f60', x: 12, y: 4, type: 'prop' }, // Box
                { id: 'f89', x: 14, y: 4, type: 'prop', customSprite: 'tileset-03' }, // Plant Bottom (Top at 14,3)
                { id: 'f88', x: 16, y: 4, type: 'prop', customSprite: 'tileset-03' }, // Plant Top (Bottom at 16,5)
                { id: 'f61', x: 21, y: 4, type: 'prop' }, // Box Top (Bottom at 21,5)
                { id: 'f60', x: 23, y: 4, type: 'prop' }, // Box
                { id: 'f61', x: 25, y: 4, type: 'prop' }, // Box Top (Bottom at 25,5)
                { id: 'f62', x: 26, y: 4, type: 'prop' }, // Box Bottom (Top at 26,3)
                { id: 'f60', x: 27, y: 4, type: 'prop' }, // Box
                { id: 'f62', x: 28, y: 4, type: 'prop' }, // Box Bottom (Top at 28,3)

                // Row 5: SCATTERED EQUIPMENT & BOTTOMS & SOME TOPS for row 6
                { id: 'f13', x: 1, y: 5, type: 'prop' }, // Tank Top (Bottom at 1,6)
                { id: 'f87', x: 3, y: 5, type: 'prop', customSprite: 'tileset-03', hiddenLogId: 'Log009' }, // Healthy Bottom (Top at 3,4)
                { id: 'f13', x: 5, y: 5, type: 'prop' }, // Tank Top (Bottom at 5,6)
                { id: 'f60', x: 14, y: 5, type: 'prop' }, // Box
                { id: 'f7', x: 15, y: 5, type: 'prop' }, // Computer
                { id: 'f89', x: 16, y: 5, type: 'prop', customSprite: 'tileset-03' }, // Plant Bottom (Top at 16,4)
                { id: 'f7', x: 17, y: 5, type: 'prop' }, // Computer
                { id: 'f62', x: 21, y: 5, type: 'prop' }, // Box Bottom (Top at 21,4)
                { id: 'f62', x: 25, y: 5, type: 'prop' }, // Box Bottom (Top at 25,4)

                // Tops for row 6 per Stacking Rule
                { id: 'f88', x: 9, y: 5, type: 'prop', customSprite: 'tileset-03' }, // Plant Top (Bottom at 9,6)
                { id: 'f61', x: 23, y: 5, type: 'prop' }, // Box Top (Bottom at 23,6)
                { id: 'f61', x: 27, y: 5, type: 'prop' }, // Box Top (Bottom at 27,6)

                // Row 6: CONTINUOUS PLANT TOPS (F88) + SCATTERED BOTTOM OVERLAPS (1-31)
                ...Array.from({ length: 31 }, (_, i) => {
                    const x = i + 1;
                    const items = [{ id: 'f88', x, y: 6, type: 'prop', customSprite: 'tileset-03' }];

                    if (x === 1) items.push({ id: 'f14', x, y: 6, type: 'prop' }); // Tank Bottom (Top at 1,5)
                    if (x === 5) items.push({ id: 'f14', x, y: 6, type: 'prop' }); // Tank Bottom (Top at 5,5)
                    if (x === 8) items.push({ id: 'f9', x, y: 6, type: 'prop' }); // Sequencer
                    if (x === 9) items.push({ id: 'f89', x, y: 6, type: 'prop', customSprite: 'tileset-03' }); // Plant Bottom (Top at 9,5)
                    if (x === 21) items.push({ id: 'f7', x, y: 6, type: 'prop' }); // Computer
                    if (x === 23) items.push({ id: 'f62', x, y: 6, type: 'prop' }); // Box Bottom (Top at 23,5)
                    if (x === 27) items.push({ id: 'f62', x, y: 6, type: 'prop' }); // Box Bottom (Top at 27,5)

                    return items;
                }).flat(),

                // Row 7: CONTINUOUS PLANT BOTTOMS (F89) (1-31)
                ...Array.from({ length: 31 }, (_, i) => ({ id: 'f89', x: i + 1, y: 7, type: 'prop', customSprite: 'tileset-03' })),
                // [AI_DECORATION_PROTOCOL] END RENDER
            ],
            doors: [
                { x: 32, y: 5, targetZone: 'botanic', targetX: 1, targetY: 13 }
            ]
        },
        preservationRoom: {
            name: 'PRESERVATION ROOM',
            width: 33,
            height: 9,
            spawn: { x: 1, y: 5 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                // --- Back Wall Leaning (Tops for Row 3) ---
                { id: 'f15_t3_1', x: 1, y: 2, type: 'prop', name: 'Tank Top' },
                { id: 'f15_t3_5', x: 5, y: 2, type: 'prop', name: 'Tank Top' },
                { id: 'f15_t3_8', x: 8, y: 2, type: 'prop', name: 'Tank Top' },
                { id: 'f61_t3_10', x: 10, y: 2, type: 'prop', name: 'Box Top' }, // Revision 5: Leaning box top
                { id: 'f15_t3_14', x: 14, y: 2, type: 'prop', name: 'Tank Top' },
                { id: 'f61_t3_15', x: 15, y: 2, type: 'prop', name: 'Box Top' }, // Revision 5: Leaning box top
                { id: 'f61_t3_25', x: 25, y: 2, type: 'prop', name: 'Box Top' }, // Leaning box pile for f62 at (25,3)
                { id: 'f15_t3_26', x: 26, y: 2, type: 'prop', name: 'Tank Top' },
                { id: 'f15_t3_29', x: 29, y: 2, type: 'prop', name: 'Tank Top' },
                { id: 'f15_t3_31', x: 31, y: 2, type: 'prop', name: 'Tank Top' },

                // --- Row 3 (Tops/Equipment) ---
                { id: 'f16_3_1', x: 1, y: 3, type: 'prop' },
                { id: 'f80_3_3', x: 3, y: 3, type: 'prop' }, { id: 'f81_3_4', x: 4, y: 3, type: 'prop' },
                { id: 'f16_3_5', x: 5, y: 3, type: 'prop' },
                { id: 'f80_3_6', x: 6, y: 3, type: 'prop' }, { id: 'f81_3_7', x: 7, y: 3, type: 'prop' },
                { id: 'f16_3_8', x: 8, y: 3, type: 'prop' },
                { id: 'f80_3_9', x: 9, y: 3, type: 'prop' },
                { id: 'f81_3_10', x: 10, y: 3, type: 'prop' }, { id: 'f62_3_10', x: 10, y: 3, type: 'prop' }, // Revision 5: Box Bottom at (10,3)
                { id: 'f80_3_12', x: 12, y: 3, type: 'prop' }, { id: 'f9_3_12', x: 12, y: 3, type: 'prop' }, // Overlap f80/f9
                { id: 'f81_3_13', x: 13, y: 3, type: 'prop' }, { id: 'f60_3_13', x: 13, y: 3, type: 'prop' }, // Overlap f81/f60
                { id: 'f16_3_14', x: 14, y: 3, type: 'prop' },
                { id: 'f80_3_15', x: 15, y: 3, type: 'prop' }, { id: 'f62_3_15', x: 15, y: 3, type: 'prop' }, // Revision 5: Box Bottom at (15,3)
                { id: 'f81_3_16', x: 16, y: 3, type: 'prop' },
                { id: 'f80_3_18', x: 18, y: 3, type: 'prop' }, { id: 'f81_3_19', x: 19, y: 3, type: 'prop' },
                { id: 'f61_3_20', x: 20, y: 3, type: 'prop' },
                { id: 'f80_3_21', x: 21, y: 3, type: 'prop' }, { id: 'f81_3_22', x: 22, y: 3, type: 'prop' },
                { id: 'f80_3_24', x: 24, y: 3, type: 'prop' }, { id: 'f60_3_24', x: 24, y: 3, type: 'prop' }, // Overlap f80/f60
                { id: 'f81_3_25', x: 25, y: 3, type: 'prop' }, { id: 'f62_3_25', x: 25, y: 3, type: 'prop' }, // Overlap f81/f62
                { id: 'f16_3_26', x: 26, y: 3, type: 'prop' },
                { id: 'f80_3_27', x: 27, y: 3, type: 'prop' }, { id: 'f60_3_27', x: 27, y: 3, type: 'prop' }, // Overlap f80/f60
                { id: 'f81_3_28', x: 28, y: 3, type: 'prop' }, { id: 'f7_3_28', x: 28, y: 3, type: 'prop' }, // Overlap f81/f7
                { id: 'f16_3_29', x: 29, y: 3, type: 'prop' },
                { id: 'f16_3_31', x: 31, y: 3, type: 'prop' },

                // --- Row 4 (Bottoms) ---
                { id: 'f82_4_3', x: 3, y: 4, type: 'prop' }, { id: 'f83_4_4', x: 4, y: 4, type: 'prop' },
                { id: 'f82_4_6', x: 6, y: 4, type: 'prop' }, { id: 'f83_4_7', x: 7, y: 4, type: 'prop' },
                { id: 'f82_4_9', x: 9, y: 4, type: 'prop' },
                { id: 'f83_4_10', x: 10, y: 4, type: 'prop' },
                { id: 'f82_4_12', x: 12, y: 4, type: 'prop' },
                { id: 'f83_4_13', x: 13, y: 4, type: 'prop' },
                { id: 'f82_4_15', x: 15, y: 4, type: 'prop' }, { id: 'f61_4_15', x: 15, y: 4, type: 'prop' }, // Overlap f82/f61 for f62 at (15,5)
                { id: 'f83_4_16', x: 16, y: 4, type: 'prop' },
                { id: 'f82_4_18', x: 18, y: 4, type: 'prop' }, { id: 'f83_4_19', x: 19, y: 4, type: 'prop' },
                { id: 'f62_4_20', x: 20, y: 4, type: 'prop' },
                { id: 'f82_4_21', x: 21, y: 4, type: 'prop' }, { id: 'f83_4_22', x: 22, y: 4, type: 'prop' },
                { id: 'f82_4_24', x: 24, y: 4, type: 'prop' }, { id: 'f83_4_25', x: 25, y: 4, type: 'prop' },
                { id: 'f82_4_27', x: 27, y: 4, type: 'prop' }, { id: 'f83_4_28', x: 28, y: 4, type: 'prop' },

                // --- Row 5 (Tops) ---
                { id: 'f80_5_3', x: 3, y: 5, type: 'prop' }, { id: 'f81_5_4', x: 4, y: 5, type: 'prop' },
                { id: 'f80_5_6', x: 6, y: 5, type: 'prop' }, { id: 'f81_5_7', x: 7, y: 5, type: 'prop' },
                { id: 'f61_5_8', x: 8, y: 5, type: 'prop' },
                { id: 'f80_5_9', x: 9, y: 5, type: 'prop' }, { id: 'f81_5_10', x: 10, y: 5, type: 'prop' },
                { id: 'f80_5_12', x: 12, y: 5, type: 'prop' }, { id: 'f81_5_13', x: 13, y: 5, type: 'prop' },
                { id: 'f80_5_15', x: 15, y: 5, type: 'prop' }, { id: 'f62_5_15', x: 15, y: 5, type: 'prop' }, // Overlap f80/f62
                { id: 'f81_5_16', x: 16, y: 5, type: 'prop' }, { id: 'f60_5_16', x: 16, y: 5, type: 'prop' }, // Overlap f81/f60
                { id: 'f80_5_18', x: 18, y: 5, type: 'prop' }, { id: 'f81_5_19', x: 19, y: 5, type: 'prop' },
                { id: 'f80_5_21', x: 21, y: 5, type: 'prop' }, { id: 'f60_5_21', x: 21, y: 5, type: 'prop' }, // Revision 5: Added box overlap
                { id: 'f81_5_22', x: 22, y: 5, type: 'prop' },
                { id: 'f80_5_24', x: 24, y: 5, type: 'prop' }, { id: 'f81_5_25', x: 25, y: 5, type: 'prop' },
                { id: 'f80_5_27', x: 27, y: 5, type: 'prop' }, { id: 'f81_5_28', x: 28, y: 5, type: 'prop' },

                // --- Row 6 (Bottoms/Tops overlap) ---
                { id: 'f82_6_3', x: 3, y: 6, type: 'prop' }, { id: 'f61_6_3', x: 3, y: 6, type: 'prop' }, // Overlap f82/f61 for f62 at (3,7)
                { id: 'f83_6_4', x: 4, y: 6, type: 'prop' },
                { id: 'f15_6_5', x: 5, y: 6, type: 'prop', name: 'Tank Top' }, // Top for Tank at (5,7)
                { id: 'f82_6_6', x: 6, y: 6, type: 'prop' },
                { id: 'f83_6_7', x: 7, y: 6, type: 'prop' }, { id: 'f61_6_7', x: 7, y: 6, type: 'prop' }, // Overlap f83/f61 for f62 at (7,7)
                { id: 'f62_6_8', x: 8, y: 6, type: 'prop' },
                { id: 'f82_6_9', x: 9, y: 6, type: 'prop' }, { id: 'f83_6_10', x: 10, y: 6, type: 'prop' },
                { id: 'f82_6_12', x: 12, y: 6, type: 'prop' }, { id: 'f83_6_13', x: 13, y: 6, type: 'prop' },
                { id: 'f82_6_15', x: 15, y: 6, type: 'prop' },
                { id: 'f83_6_16', x: 16, y: 6, type: 'prop' },
                { id: 'f7_6_17', x: 17, y: 6, type: 'prop', name: 'PC Terminal' }, // Revision 4: Added PC Terminal
                { id: 'f82_6_18', x: 18, y: 6, type: 'prop' }, { id: 'f83_6_19', x: 19, y: 6, type: 'prop' },
                { id: 'f82_6_21', x: 21, y: 6, type: 'prop' }, { id: 'f83_6_22', x: 22, y: 6, type: 'prop' },
                { id: 'f82_6_24', x: 24, y: 6, type: 'prop' }, { id: 'f61_6_24', x: 24, y: 6, type: 'prop' }, // Overlap f82/f61 for f62 at (24,7)
                { id: 'f83_6_25', x: 25, y: 6, type: 'prop' },
                { id: 'f82_6_27', x: 27, y: 6, type: 'prop' }, { id: 'f83_6_28', x: 28, y: 6, type: 'prop' },

                // Row 6 Missing Tops for Row 7 Tanks
                { id: 'f15_6_1', x: 1, y: 6, type: 'prop', name: 'Tank Top' },
                { id: 'f15_6_11', x: 11, y: 6, type: 'prop', name: 'Tank Top' },
                { id: 'f15_6_23', x: 23, y: 6, type: 'prop', name: 'Tank Top' },
                { id: 'f15_6_29', x: 29, y: 6, type: 'prop', name: 'Tank Top' },
                { id: 'f15_6_31', x: 31, y: 6, type: 'prop', name: 'Tank Top' },

                // --- Row 7 (Bottoms) ---
                { id: 'f16_7_1', x: 1, y: 7, type: 'prop' },
                { id: 'f62_7_3', x: 3, y: 7, type: 'prop' },
                { id: 'f16_7_5', x: 5, y: 7, type: 'prop' },
                { id: 'f60_7_6', x: 6, y: 7, type: 'prop' },
                { id: 'f62_7_7', x: 7, y: 7, type: 'prop' },
                { id: 'f9_7_8', x: 8, y: 7, type: 'prop' },
                { id: 'f7_7_10', x: 10, y: 7, type: 'prop' },
                { id: 'f16_7_11', x: 11, y: 7, type: 'prop' },
                { id: 'f9_7_12', x: 12, y: 7, type: 'prop' },
                { id: 'f9_7_22', x: 22, y: 7, type: 'prop' },
                { id: 'f16_7_23', x: 23, y: 7, type: 'prop' },
                { id: 'f62_7_24', x: 24, y: 7, type: 'prop' },
                { id: 'f7_7_28', x: 28, y: 7, type: 'prop' },
                { id: 'f16_7_29', x: 29, y: 7, type: 'prop' },
                { id: 'f16_7_31', x: 31, y: 7, type: 'prop' }
            ],
            doors: [
                { x: 0, y: 5, targetZone: 'human', targetX: 13, targetY: 13 }
            ]
        },
        human: {
            name: 'HUMAN RESEARCH WARD',
            width: 15,
            height: 16,
            spawn: { x: 7, y: 13 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 32, 32, 32, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Exit to Atrium (Left) and Preservation Room (Right)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'dyzes', x: 7, y: 3, type: 'npc', name: 'Dyzes' },
                { id: 'npc_female_hum1', x: 7, y: 8, type: 'npc', name: 'Researcher Maya' },
                { id: 'npc_female_hum2', x: 10, y: 11, type: 'npc', name: 'Researcher Elena' },
                { id: 'npc_male_silas', x: 2, y: 11, type: 'npc', name: 'Researcher Silas' },
                { id: 'npc_male_finn', x: 12, y: 7, type: 'npc', name: 'Researcher Finn' },



                // Row 2
                { id: 'f52_r2a', x: 1, y: 2, type: 'prop', name: 'Archive' }, { id: 'f53_r2a', x: 2, y: 2, type: 'prop', name: 'Archive' },
                { id: 'f15_r2a', x: 3, y: 2, type: 'prop', name: 'Stasis Tank' },
                { id: 'f34_r2a', x: 4, y: 2, type: 'prop', name: 'Skeleton' },
                { id: 'f34_r2b', x: 10, y: 2, type: 'prop', name: 'Skeleton' },
                { id: 'f15_r2b', x: 11, y: 2, type: 'prop', name: 'Stasis Tank' },
                { id: 'f52_r2d', x: 12, y: 2, type: 'prop', name: 'Archive' }, { id: 'f53_r2d', x: 13, y: 2, type: 'prop', name: 'Archive' },

                // Row 3
                { id: 'f54_r3a', x: 1, y: 3, type: 'prop', name: 'Archive' }, { id: 'f55_r3a', x: 2, y: 3, type: 'prop', name: 'Archive' },
                { id: 'f16_r3a', x: 3, y: 3, type: 'prop', name: 'Stasis Tank' },
                { id: 'f35_r3a', x: 4, y: 3, type: 'prop', name: 'Skeleton' },
                { id: 'f48_r3a', x: 5, y: 3, type: 'prop', name: 'Hand Box' },
                { id: 'f48_r3b', x: 9, y: 3, type: 'prop', name: 'Hand Box' },
                { id: 'f35_r3b', x: 10, y: 3, type: 'prop', name: 'Skeleton' },
                { id: 'f16_r3b', x: 11, y: 3, type: 'prop', name: 'Stasis Tank' },
                { id: 'f54_r3d', x: 12, y: 3, type: 'prop', name: 'Archive' }, { id: 'f55_r3d', x: 13, y: 3, type: 'prop', name: 'Archive' },

                // Row 4 (Empty in new grid)

                // Row 5 (Stasis Tanks + Storage Pods top)
                { id: 'f15_r5a', x: 1, y: 5, type: 'prop', name: 'Stasis Tank' }, { id: 'f84_r5a', x: 2, y: 5, type: 'prop', name: 'Storage Pod' },
                { id: 'f15_r5b', x: 3, y: 5, type: 'prop', name: 'Stasis Tank' }, { id: 'f84_r5b', x: 4, y: 5, type: 'prop', name: 'Storage Pod' },
                { id: 'f15_r5c', x: 5, y: 5, type: 'prop', name: 'Stasis Tank' }, { id: 'f84_r5c', x: 6, y: 5, type: 'prop', name: 'Storage Pod' },
                { id: 'f84_r5d', x: 8, y: 5, type: 'prop', name: 'Storage Pod' }, { id: 'f15_r5d', x: 9, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'f84_r5e', x: 10, y: 5, type: 'prop', name: 'Storage Pod' }, { id: 'f15_r5e', x: 11, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'f84_r5f', x: 12, y: 5, type: 'prop', name: 'Storage Pod' }, { id: 'f15_r5f', x: 13, y: 5, type: 'prop', name: 'Stasis Tank' },

                // Row 6 (Stasis Tanks + Storage Pods bottom)
                { id: 'f16_r6a', x: 1, y: 6, type: 'prop', name: 'Stasis Tank' }, { id: 'f85_r6a', x: 2, y: 6, type: 'prop', name: 'Storage Pod' },
                { id: 'f16_r6b', x: 3, y: 6, type: 'prop', name: 'Stasis Tank' }, { id: 'f85_r6b', x: 4, y: 6, type: 'prop', name: 'Storage Pod', hiddenLogId: 'Log013' },
                { id: 'f16_r6c', x: 5, y: 6, type: 'prop', name: 'Stasis Tank' }, { id: 'f85_r6c', x: 6, y: 6, type: 'prop', name: 'Storage Pod' },
                { id: 'f85_r6d', x: 8, y: 6, type: 'prop', name: 'Storage Pod' }, { id: 'f16_r6d', x: 9, y: 6, type: 'prop', name: 'Stasis Tank' },
                { id: 'f85_r6e', x: 10, y: 6, type: 'prop', name: 'Storage Pod' }, { id: 'f16_r6e', x: 11, y: 6, type: 'prop', name: 'Stasis Tank' },
                { id: 'f85_r6f', x: 12, y: 6, type: 'prop', name: 'Storage Pod' }, { id: 'f16_r6f', x: 13, y: 6, type: 'prop', name: 'Stasis Tank' },

                // Row 7 (Skeleton + Maya)
                { id: 'f34_r7a', x: 4, y: 7, type: 'prop', name: 'Skeleton' },
                // Maya is declared at the top of objects array at (x:6, y:7) now. (I will assume her Y is 7 here despite the grid putting MAY on row 7, because in the grid row 7 is MAY, but she was declared at (6,6) originally. We'll leave her at 6,7 as requested).

                // Row 8 (CryoPods + Skeletons)
                { id: 'f65_r8a', x: 2, y: 8, type: 'prop', name: 'CryoPod' }, { id: 'f66_r8a', x: 3, y: 8, type: 'prop', name: 'CryoPod' },
                { id: 'f35_r8a', x: 4, y: 8, type: 'prop', name: 'Skeleton' },
                { id: 'f65_r8b', x: 5, y: 8, type: 'prop', name: 'CryoPod' }, { id: 'f66_r8b', x: 6, y: 8, type: 'prop', name: 'CryoPod' },
                { id: 'f65_r8c', x: 8, y: 8, type: 'prop', name: 'CryoPod' }, { id: 'f66_r8c', x: 9, y: 8, type: 'prop', name: 'CryoPod', hiddenLogId: 'Log015' },
                { id: 'f65_r8d', x: 11, y: 8, type: 'prop', name: 'CryoPod' }, { id: 'f66_r8d', x: 12, y: 8, type: 'prop', name: 'CryoPod' },

                // Row 9 (Skeletons + Incubators)
                { id: 'f34_r9a', x: 1, y: 9, type: 'prop', name: 'Skeleton' },
                { id: 'f38_r9a', x: 8, y: 9, type: 'prop', name: 'Incubator' }, { id: 'f39_r9a', x: 9, y: 9, type: 'prop', name: 'Incubator' },
                { id: 'f34_r9b', x: 13, y: 9, type: 'prop', name: 'Skeleton' },

                // Row 10 (Skeletons + CryoPods + Tables + Incubators)
                { id: 'f35_r10a', x: 1, y: 10, type: 'prop', name: 'Skeleton' },
                { id: 'f65_r10a', x: 2, y: 10, type: 'prop', name: 'CryoPod' }, { id: 'f66_r10a', x: 3, y: 10, type: 'prop', name: 'CryoPod' },
                { id: 'f4_r10a', x: 5, y: 10, type: 'prop', name: 'Table' }, { id: 'f5_r10a', x: 6, y: 10, type: 'prop', name: 'Table' },
                { id: 'f8_r10a', x: 7, y: 10, type: 'prop', name: 'Lab Cylinders' },
                { id: 'f40_r10a', x: 8, y: 10, type: 'prop', name: 'Incubator' }, { id: 'f41_r10a', x: 9, y: 10, type: 'prop', name: 'Incubator' },
                { id: 'f65_r10b', x: 11, y: 10, type: 'prop', name: 'CryoPod' }, { id: 'f66_r10b', x: 12, y: 10, type: 'prop', name: 'CryoPod' },
                { id: 'f35_r10b', x: 13, y: 10, type: 'prop', name: 'Skeleton' },

                // Row 11
                { id: 'f34_r11a', x: 7, y: 11, type: 'prop', name: 'Skeleton' },

                // Row 12 (CryoPods + Skeletons)
                { id: 'f65_r12a', x: 2, y: 12, type: 'prop', name: 'CryoPod', hiddenLogId: 'Log014' }, { id: 'f66_r12a', x: 3, y: 12, type: 'prop', name: 'CryoPod' },
                { id: 'f65_r12b', x: 5, y: 12, type: 'prop', name: 'CryoPod' }, { id: 'f66_r12b', x: 6, y: 12, type: 'prop', name: 'CryoPod' },
                { id: 'f35_r12a', x: 7, y: 12, type: 'prop', name: 'Skeleton' },
                { id: 'f65_r12c', x: 8, y: 12, type: 'prop', name: 'CryoPod' }, { id: 'f66_r12c', x: 9, y: 12, type: 'prop', name: 'CryoPod' },
                // Elena is at (10, 12) per grid row 12
                { id: 'f65_r12d', x: 11, y: 12, type: 'prop', name: 'CryoPod' }, { id: 'f66_r12d', x: 12, y: 12, type: 'prop', name: 'CryoPod' },

                // Row 14 (Boxes at entry - Grid row 13)
                { id: 'f61_r14a', x: 8, y: 13, type: 'prop', name: 'Box Pile' },
                { id: 'f61_r14b', x: 13, y: 13, type: 'prop', name: 'Box Pile' },

                // Row 14
                { id: 'f9_r14a', x: 1, y: 14, type: 'prop', name: 'Device' },
                { id: 'f8_r14a', x: 2, y: 14, type: 'prop', name: 'Cylinders' },
                { id: 'f60_r14c', x: 3, y: 14, type: 'prop', name: 'Storage Box' },
                { id: 'f36_r14a', x: 4, y: 14, type: 'prop', name: 'Noodles' },
                { id: 'f9_r14d', x: 5, y: 14, type: 'prop', name: 'Device' },
                { id: 'f60_r14a', x: 6, y: 14, type: 'prop', name: 'Box' },
                { id: 'f62_r14a', x: 8, y: 14, type: 'prop', name: 'Box Pile' },
                { id: 'f9_r14e', x: 9, y: 14, type: 'prop', name: 'Device' },
                { id: 'f8_r14b', x: 10, y: 14, type: 'prop', name: 'Cylinders' },
                { id: 'f9_r14f', x: 11, y: 14, type: 'prop', name: 'Device', hiddenLogId: 'Log012' },
                { id: 'f60_r14b', x: 12, y: 14, type: 'prop', name: 'Box' },
                { id: 'f62_r14b', x: 13, y: 14, type: 'prop', name: 'Box Pile' }
            ],
            doors: [
                { x: 0, y: 13, targetZone: 'atrium', targetX: 17, targetY: 4 },
                { x: 7, y: 15, targetZone: 'specimenStorage', targetX: 6, targetY: 3 },
                { x: 14, y: 13, targetZone: 'preservationRoom', targetX: 1, targetY: 5 }
            ]
        },
        executive: {
            name: 'EXECUTIVE SUITE',
            width: 22,
            height: 9,
            spawn: { x: 7, y: 7 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 5, 4, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 32, 15, 32, 15, 32, 15, 32, 15, 32, 15, 32, 18, 16, 32, 15, 22, 15, 32, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 19, 17, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 7, 6, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 3, 2, 9, 9, 20, 9, 9, 3]
            ],
            objects: [
                { id: 'capsain', x: 7, y: 4, type: 'npc', name: 'Director Capsain' },
                { id: 'npc_male_exec1', x: 3, y: 5, type: 'npc', name: 'Assistant James' },
                { id: 'npc_male_exec2', x: 9, y: 7, type: 'npc', name: 'Assistant Robert' },

                // Director Desk (F30, F31) - Moved to y=5
                { id: 'f30_director', x: 7, y: 5, type: 'prop', name: 'Director Desk', hiddenLogId: 'Log016' },
                { id: 'f31_director', x: 8, y: 5, type: 'prop', name: 'Director Desk', hiddenLogId: 'Log019' },

                // Central Bookshelf Cluster (F76-F79) and Cabinets (F58)
                { id: 'f76_execMid', x: 7, y: 2, type: 'prop', name: 'Executive Bookshelf' },
                { id: 'f77_execMid', x: 8, y: 2, type: 'prop', name: 'Executive Bookshelf' },
                { id: 'f17_execWall1', x: 17, y: 2, type: 'prop', name: 'Wall Hanging' },
                { id: 'f17_execWall2', x: 19, y: 2, type: 'prop', name: 'Wall Hanging' },
                { id: 'f78_execMid', x: 7, y: 3, type: 'prop', name: 'Executive Bookshelf' },
                { id: 'f79_execMid', x: 8, y: 3, type: 'prop', name: 'Executive Bookshelf' },
                { id: 'f103_execMidL', x: 6, y: 3, type: 'prop', name: 'Huge Petri Dish' },
                { id: 'f58_execMidR', x: 9, y: 3, type: 'prop', name: 'Small Cabinet' },

                // Noodle Snacks (F36)
                { id: 'f36_exec1', x: 3, y: 3, type: 'prop', name: 'Snack' },
                { id: 'f36_exec2', x: 11, y: 3, type: 'prop', name: 'Snack' },
                { id: 'f36_exec3', x: 9, y: 5, type: 'prop', name: 'Snack' },
                { id: 'f36_exec4', x: 1, y: 7, type: 'prop', name: 'Snack' },
                { id: 'f36_exec5', x: 13, y: 7, type: 'prop', name: 'Snack' },

                // Archives (L) - Clusters (F52-F55)
                { id: 'f52_execL1', x: 1, y: 2, type: 'prop', name: 'Archives' },
                { id: 'f53_execL1', x: 2, y: 2, type: 'prop', name: 'Archives' },
                { id: 'f54_execL1', x: 1, y: 3, type: 'prop', name: 'Archives', hiddenLogId: 'Log017' },
                { id: 'f55_execL1', x: 2, y: 3, type: 'prop', name: 'Archives', hiddenLogId: 'Log018' },

                { id: 'f52_execL2', x: 1, y: 4, type: 'prop', name: 'Archives' },
                { id: 'f53_execL2', x: 2, y: 4, type: 'prop', name: 'Archives' },
                { id: 'f54_execL2', x: 1, y: 5, type: 'prop', name: 'Archives' },
                { id: 'f55_execL2', x: 2, y: 5, type: 'prop', name: 'Archives' },

                // Archives (R) - F52-F55
                { id: 'f52_execR', x: 12, y: 2, type: 'prop', name: 'Archives' },
                { id: 'f53_execR', x: 13, y: 2, type: 'prop', name: 'Archives' },
                { id: 'f54_execR', x: 12, y: 3, type: 'prop', name: 'Archives' },
                { id: 'f55_execR', x: 13, y: 3, type: 'prop', name: 'Archives' },

                // Incubator (Center-Left) - F38-F41
                { id: 'f38_exec', x: 4, y: 2, type: 'prop', name: 'Incubator' },
                { id: 'f39_exec', x: 5, y: 2, type: 'prop', name: 'Incubator' },
                { id: 'f40_exec', x: 4, y: 3, type: 'prop', name: 'Incubator' },
                { id: 'f41_exec', x: 5, y: 3, type: 'prop', name: 'Incubator' },

                // Assistant Desks - F28, F29
                { id: 'f28_exec1', x: 4, y: 5, type: 'prop', name: 'Assistant Desk' },
                { id: 'f29_exec1', x: 5, y: 5, type: 'prop', name: 'Assistant Desk' },
                { id: 'f28_exec2', x: 11, y: 5, type: 'prop', name: 'Assistant Desk' },
                { id: 'f29_exec2', x: 12, y: 5, type: 'prop', name: 'Assistant Desk' },

                // Corridor (Right) - F76-F79
                { id: 'f76_execCor', x: 14, y: 3, type: 'prop', name: 'Bookshelf' },
                { id: 'f77_execCor', x: 15, y: 3, type: 'prop', name: 'Bookshelf' },
                { id: 'f78_execCor', x: 14, y: 4, type: 'prop', name: 'Bookshelf' },
                { id: 'f79_execCor', x: 15, y: 4, type: 'prop', name: 'Bookshelf' },

                // Terminals and Tanks
                { id: 'f7_execCor1', x: 16, y: 3, type: 'prop', name: 'Terminal' },
                { id: 'f7_execCor2', x: 20, y: 3, type: 'prop', name: 'Terminal' },

                { id: 'f22_exec_C1', x: 17, y: 3, type: 'prop', name: 'Research Tank' },
                { id: 'f23_exec_C1', x: 17, y: 4, type: 'prop', name: 'Research Tank' },
                { id: 'f22_exec_C2', x: 17, y: 5, type: 'prop', name: 'Research Tank' },
                { id: 'f23_exec_C2', x: 17, y: 6, type: 'prop', name: 'Research Tank' },

                { id: 'f22_exec_C3', x: 19, y: 3, type: 'prop', name: 'Research Tank' },
                { id: 'f23_exec_C3', x: 19, y: 4, type: 'prop', name: 'Research Tank' },
                { id: 'f22_exec_C4', x: 19, y: 5, type: 'prop', name: 'Research Tank' },
                { id: 'f23_exec_C4', x: 19, y: 6, type: 'prop', name: 'Research Tank' },

                { id: 'f9_execCor1', x: 16, y: 7, type: 'prop', name: 'Bio Scanner' },
                { id: 'f9_execCor2', x: 20, y: 7, type: 'prop', name: 'Bio Scanner' },

                // Box Piles and Storage - F60, F61, F62
                { id: 'f61_execTop1', x: 10, y: 2, type: 'prop', name: 'Box Pile' },
                { id: 'f62_execBot1', x: 10, y: 3, type: 'prop', name: 'Box Pile' },
                { id: 'f61_execTop2', x: 3, y: 6, type: 'prop', name: 'Box Pile' },
                { id: 'f61_execTop3', x: 11, y: 6, type: 'prop', name: 'Box Pile' },
                { id: 'f62_execBot2', x: 3, y: 7, type: 'prop', name: 'Box Pile' },

                { id: 'f60_exec1', x: 2, y: 7, type: 'prop', name: 'Storage Box' },
                { id: 'f60_exec2', x: 4, y: 7, type: 'prop', name: 'Storage Box' },
                { id: 'f8_exec7a', x: 5, y: 7, type: 'prop', name: 'Lab Cylinders' },
                { id: 'f8_exec7b', x: 10, y: 7, type: 'prop', name: 'Lab Cylinders' },
                { id: 'f62_execBot3', x: 11, y: 7, type: 'prop', name: 'Box Pile' },
                { id: 'f60_exec4', x: 12, y: 7, type: 'prop', name: 'Storage Box' }
            ],
            doors: [
                { x: 7, y: 8, targetZone: 'atrium', targetX: 9, targetY: 3 },
                { x: 18, y: 8, targetZone: 'specimenStorage', targetX: 13, targetY: 3 },
                { x: 18, y: 2, targetZone: 'library', targetX: 3, targetY: 15 }
            ]
        },
        library: {
            name: 'EXECUTIVE LIBRARY',
            width: 7,
            height: 17,
            spawn: { x: 3, y: 15 },
            layout: [
                [0, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 20, 9, 9, 3]
            ],
            objects: [
                {
                    id: 'elara', x: 3, y: 3, type: 'npc', name: 'Elara',
                    direction: 'down', customSprite: 'T_Char_Sprite_Elara_01',
                    portrait: 'Character_FullArt_Elara',
                    proximityTrigger: true, triggerRadius: 3,
                    triggerY: 1,
                    sideQuestId: 'quest_elara_ghost'
                },
                // Bookshelf Row (Left & Right)
                { id: 'f76_lib1', x: 1, y: 2, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib1', x: 2, y: 2, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f76_lib2', x: 4, y: 2, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib2', x: 5, y: 2, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib1', x: 1, y: 3, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib1', x: 2, y: 3, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib2', x: 4, y: 3, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib2', x: 5, y: 3, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },

                { id: 'f76_lib3', x: 1, y: 4, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib3', x: 2, y: 4, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f76_lib4', x: 4, y: 4, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib4', x: 5, y: 4, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib3', x: 1, y: 5, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib3', x: 2, y: 5, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib4', x: 4, y: 5, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib4', x: 5, y: 5, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },

                { id: 'f76_lib5', x: 1, y: 6, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib5', x: 2, y: 6, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f76_lib6', x: 4, y: 6, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib6', x: 5, y: 6, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib5', x: 1, y: 7, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib5', x: 2, y: 7, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib6', x: 4, y: 7, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib6', x: 5, y: 7, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },

                { id: 'f76_lib7', x: 1, y: 8, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib7', x: 2, y: 8, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f76_lib8', x: 4, y: 8, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib8', x: 5, y: 8, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib7', x: 1, y: 9, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib7', x: 2, y: 9, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib8', x: 4, y: 9, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib8', x: 5, y: 9, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },

                { id: 'f76_lib9', x: 1, y: 10, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib9', x: 2, y: 10, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f76_lib10', x: 4, y: 10, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib10', x: 5, y: 10, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib9', x: 1, y: 11, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib9', x: 2, y: 11, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f78_lib10', x: 4, y: 11, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib10', x: 5, y: 11, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },

                { id: 'f76_lib11', x: 1, y: 12, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f77_lib11', x: 2, y: 12, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f4_lib', x: 4, y: 13, type: 'prop', name: 'Research Table' }, { id: 'f5_lib', x: 5, y: 13, type: 'prop', name: 'Research Table' },

                { id: 'f78_lib11', x: 1, y: 13, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' }, { id: 'f79_lib11', x: 2, y: 13, type: 'prop', name: 'Bookshelf', customSprite: 'tileset-03' },
                { id: 'f61_lib', x: 1, y: 14, type: 'prop', name: 'Stored Boxes' },
                { id: 'f0_lib1', x: 5, y: 14, type: 'prop', name: 'Study Chair' },

                { id: 'f62_lib', x: 1, y: 15, type: 'prop', name: 'Stored Boxes' },
                { id: 'f60_lib', x: 2, y: 15, type: 'prop', name: 'Reference Box' },
                { id: 'f0_lib2', x: 5, y: 15, type: 'prop', name: 'Study Chair' },
                { id: 'npc_female_wednesday', x: 4, y: 15, type: 'npc', name: 'Wednesday', direction: 'down' }
            ],
            doors: [
                { x: 3, y: 16, targetZone: 'executive', targetX: 18, targetY: 3 }
            ]
        },
        kitchen: {
            name: 'STAFF KITCHEN',
            width: 11,
            height: 8,
            spawn: { x: 7, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 22, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Exit to Atrium (Shifted Up 2)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Exit to Atrium (In the wall)
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 3]
            ],
            objects: [
                // Vending Machines (L) - Shifted to Y=2,3
                { id: 'f67_kitL', x: 1, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopLeft tileset-03' },
                { id: 'f68_kitL', x: 2, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopRight tileset-03' },
                { id: 'f69_kitL', x: 1, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomLeft tileset-03' },
                { id: 'f70_kitL', x: 2, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomRight tileset-03' },

                // Vending Machines (R) - Shifted to Y=2,3
                { id: 'f67_kitR', x: 8, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopLeft tileset-03' },
                { id: 'f68_kitR', x: 9, y: 2, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-TopRight tileset-03' },
                { id: 'f69_kitR', x: 8, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomLeft tileset-03' },
                { id: 'f70_kitR', x: 9, y: 3, type: 'prop', name: 'Odd-Vend', customSprite: 'VendingMachine-BottomRight tileset-03' },

                // snacks and trash (Y=3)
                { id: 'f36_kit1', x: 3, y: 3, type: 'prop', name: 'Quick Bite', hiddenLogId: 'Log008' },
                { id: 'f36_kit2', x: 4, y: 3, type: 'prop', name: 'Forgotten Lunch' },
                { id: 'f60_kit_trash', x: 5, y: 3, type: 'prop', name: 'Trash Box' },
                { id: 'f37_kit1', x: 6, y: 3, type: 'prop', name: 'Empty Bowl' },

                // Chairs (L)
                { id: 'f1_kit1', x: 1, y: 4, type: 'prop', name: 'Kitchen Chair' },
                { id: 'f1_kit2', x: 1, y: 5, type: 'prop', name: 'Kitchen Chair' },

                // Tables (Center/Right - Y=5)
                { id: 'f3_kit1', x: 3, y: 5, type: 'prop', name: 'Coffee Table' },
                { id: 'f3_kit2', x: 5, y: 5, type: 'prop', name: 'Coffee Table' },
                { id: 'f36_kit4', x: 8, y: 6, type: 'prop', name: 'Mid-Day Snack' },
                { id: 'f3_kit3', x: 9, y: 6, type: 'prop', name: 'Coffee Table' },

                // Mixed Decor Row (Y=6)
                { id: 'f59_kit1', x: 1, y: 6, type: 'prop', name: 'Kitchen Fern' },
                { id: 'f60_kit1', x: 2, y: 6, type: 'prop', name: 'Supplies' },
                { id: 'f59_kit3', x: 3, y: 6, type: 'prop', name: 'Kitchen Fern' },
                { id: 'f36_kit3', x: 4, y: 6, type: 'prop', name: 'Abandoned Snack' },
                { id: 'f59_kit2', x: 5, y: 6, type: 'prop', name: 'Kitchen Fern' },
                {
                    id: 'npc_male_theo', x: 4, y: 5, type: 'npc', name: 'Chef Theo', direction: 'down',
                    battleEncounterId: 'theo',
                    dialogue: [
                        "Hungry for progress, Intern? Cooking's all about preparation.",
                        "Have you used the Vending Machine here in the Kitchen?",
                        "It’s not just for snacks like noodles; it’s essential for trading Biomass and acquiring Blueprints.",
                        "Let me show you why stayin' stocked is stayin' alive!"
                    ],
                    npcWinDialogue: [
                        "Sloppy! You came in underprepared.",
                        "Make sure to stop by the Vending Machine.",
                        "It sells more than just food; you can trade in your excess Biomass for Lab credits, then use those credits to buy Blueprints for advanced Cells."
                    ],
                    npcLossDialogue: [
                        "Delicious work! You've got the hunger.",
                        "The Vending Machine here is more than just furniture.",
                        "It’s not just for grabbing a quick bite like noodles; use your Lab credits to get stock!",
                        "So remember to visit it to stock up sometime."
                    ]
                },
                { id: 'npc_female_mia', x: 9, y: 5, type: 'npc', name: 'Researcher Mia', direction: 'down' }
            ],
            doors: [
                { x: 10, y: 4, targetZone: 'atrium', targetX: 1, targetY: 7 },
                { x: 7, y: 2, targetZone: 'botanic', targetX: 7, targetY: 14 },
                { x: 7, y: 7, targetZone: 'entertainment', targetX: 7, targetY: 3, requiredFlag: 'botanicSectorUnlocked' }
            ]
        },
        storage: {
            name: 'STORAGE BAY',
            width: 10,
            height: 8,
            spawn: { x: 1, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 22, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Exit to Atrium (On the left wall)
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                // Row 2 & 3 (y=2,3)
                { id: 'f52_st1', x: 1, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_st1', x: 2, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f61_stA', x: 3, y: 2, type: 'prop', name: 'Box Pile' },
                { id: 'f52_st2', x: 7, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f53_st2', x: 8, y: 2, type: 'prop', name: 'Storage Cabinet' },

                { id: 'f54_st1', x: 1, y: 3, type: 'prop', name: 'Storage Cabinet', hiddenLogId: 'Log002' },
                { id: 'f55_st1', x: 2, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f62_stA', x: 3, y: 3, type: 'prop', name: 'Box Pile' },
                { id: 'f54_st2', x: 7, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'f55_st2', x: 8, y: 3, type: 'prop', name: 'Storage Cabinet' },

                // Row 4 & 5 & 6 (y=4,5,6)
                { id: 'f61_stB', x: 1, y: 4, type: 'prop', name: 'Box Pile' },
                { id: 'f62_stB', x: 1, y: 5, type: 'prop', name: 'Box Pile' },

                { id: 'f61_stC', x: 4, y: 4, type: 'prop', name: 'Box Pile' },
                { id: 'f62_stC', x: 4, y: 5, type: 'prop', name: 'Box Pile' },

                { id: 'f61_stD', x: 3, y: 5, type: 'prop', name: 'Box Pile' },
                { id: 'f62_stD', x: 3, y: 6, type: 'prop', name: 'Box Pile' },

                { id: 'f61_stE', x: 6, y: 4, type: 'prop', name: 'Box Pile' },
                { id: 'f62_stE', x: 6, y: 5, type: 'prop', name: 'Box Pile' },

                { id: 'f61_stF', x: 8, y: 4, type: 'prop', name: 'Box Pile' },
                { id: 'f62_stF', x: 8, y: 5, type: 'prop', name: 'Box Pile' },

                // Floating Small Boxes (F60)
                { id: 'f60_st1', x: 7, y: 5, type: 'prop', name: 'Storage Box' },
                { id: 'f60_st2', x: 4, y: 6, type: 'prop', name: 'Storage Box' },
                { id: 'f60_st3', x: 6, y: 6, type: 'prop', name: 'Storage Box' },
                { id: 'f60_st4', x: 7, y: 6, type: 'prop', name: 'Storage Box' },
                { id: 'f60_st5', x: 8, y: 6, type: 'prop', name: 'Storage Box' },
                { id: 'npc_male_jax', x: 5, y: 6, type: 'npc', name: 'Quartermaster Jax', direction: 'down' }
            ],
            doors: [
                { x: 0, y: 6, targetZone: 'atrium', targetX: 17, targetY: 10 },
                { x: 5, y: 2, targetZone: 'specimenStorage', targetX: 6, targetY: 6, requiredFlag: 'humanWardUnlocked' }
            ]
        },
        entertainment: {
            name: 'ENTERTAINMENT LOUNGE',
            width: 10,
            height: 8,
            spawn: { x: 8, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 22, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Exit to Atrium (On the right wall)
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                // Seating Row (L)
                { id: 'f1_ent1', x: 1, y: 3, type: 'prop', name: 'Lounge Seat' },
                { id: 'f1_ent2', x: 1, y: 4, type: 'prop', name: 'Lounge Seat' },
                { id: 'f1_ent3', x: 1, y: 5, type: 'prop', name: 'Lounge Seat' },
                { id: 'f1_ent4', x: 1, y: 6, type: 'prop', name: 'Lounge Seat' },

                // Right Side Group
                { id: 'f0_ent1', x: 8, y: 3, type: 'prop', name: 'Lounge Seat' },
                { id: 'f7_ent', x: 8, y: 4, type: 'prop', name: 'Lounge PC', hiddenLogId: 'Log003' },
                { id: 'f0_ent2', x: 8, y: 5, type: 'prop', name: 'Lounge Seat' },

                // Decor
                { id: 'f6_ent1', x: 1, y: 2, type: 'prop', name: 'Art Display' },
                { id: 'f6_ent2', x: 3, y: 2, type: 'prop', name: 'Art Display' },
                { id: 'f6_ent3', x: 5, y: 2, type: 'prop', name: 'Art Display' },

                // Battle Station (2x2)
                { id: 'f71_ent', x: 4, y: 4, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-TopLeft tileset-03' },
                { id: 'f72_ent', x: 5, y: 4, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-TopRight tileset-03' },
                { id: 'f73_ent', x: 4, y: 5, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-BottomLeft tileset-03' },
                { id: 'f74_ent', x: 5, y: 5, type: 'prop', name: 'Battle Machine', customSprite: 'BattleMachine-BottomRight tileset-03' },
                { id: 'npc_male_ben', x: 2, y: 6, type: 'npc', name: 'Researcher Ben', direction: 'down' },
                {
                    id: 'npc_female_daisy', x: 3, y: 3, type: 'npc', name: 'Assistant Daisy', direction: 'down',
                    battleEncounterId: 'daisy',
                    dialogue: ["Oh, you're looking for Tom and Kevin's lost datapads?", "I might have seen them... but I won't tell you for free!", "Let's have a quick Cell battle. If you win, I'll give you a hint!"],
                    npcWinDialogue: ["Better luck next time!", "Since I'm nice, here's a tip: There's a Console Station in the Atrium near the north wall...", "It's humming a bit strangely. Check the ports, maybe someone left a datapad plugged in!"],
                    npcLossDialogue: ["Fine, you're better than you look!", "Check the Atrium. There's a pile of boxes near the south exit...", "Something shiny is tucked inside one of them. Happy hunting!"]
                }
            ],
            doors: [
                { x: 9, y: 6, targetZone: 'atrium', targetX: 1, targetY: 10 },
                { x: 7, y: 2, targetZone: 'kitchen', targetX: 7, targetY: 6, requiredFlag: 'botanicSectorUnlocked' }
            ]
        }
    },

    furnitureMetadata: {
        // --- TILESET 02 (f0-f63) ---
        'f0': { hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
        'f1': { hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
        'f2': { hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
        'f3': { hasCollision: true, info: "Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee." },
        'f4': { hasCollision: true, info: "So sturdy it once survived a localized gravity collapse. The equipment on it didn't." },
        'f5': { hasCollision: true, info: "So sturdy it once survived a localized gravity collapse. The equipment on it didn't." },
        'f6': { hasCollision: true, info: "A poster showing the evolution of Cells. Sadly, the dev lacked resources to implement these." },
        'f7': { hasCollision: true, info: "Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history." },
        'f8': { hasCollision: true, info: "Do not shake. Do not stir. In fact, just don't even look at it too hard." },
        'f9': { hasCollision: true, info: "A protein sequencer that occasionally plays elevator music when it's bored." },
        'f11': { hasCollision: true, info: "A table usually surrounded by people arguing about whose lunch is missing from the fridge." },
        'f12': { hasCollision: true, info: "A table usually surrounded by people arguing about whose lunch is missing from the fridge." },
        'f13': { hasCollision: false, info: "This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE." },
        'f14': { hasCollision: true, info: "This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE." },
        'f15': { hasCollision: false, info: ["Why did the cold specimen refuse to talk?", "Because it had Absolute Zero interest in you."] },
        'f16': { hasCollision: true, info: ["Why did the cold specimen refuse to talk?", "Because it had Absolute Zero interest in you."] },
        'f17': { hasCollision: true, info: "A poster showing three creature races. Or perhaps they aren't simply 'races'..." },
        'f18': { hasCollision: false, info: "Looks like a plant, smells like old gym socks. Science still isn't sure why." },
        'f19': { hasCollision: true, info: "Looks like a plant, smells like old gym socks. Science still isn't sure why." },
        'f20': { hasCollision: false, info: "Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship." },
        'f21': { hasCollision: true, info: "Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship." },
        'f22': { hasCollision: false, info: "The specimen here is slowly swimming; why are its surroundings turning yellow?" },
        'f23': { hasCollision: true, info: "The specimen here is slowly swimming; why are its surroundings turning yellow?" },
        'f24': { hasCollision: false, info: "The leaves are glowing. It might be happy, or it might be preparing for ignition." },
        'f25': { hasCollision: true, info: "The leaves are glowing. It might be happy, or it might be preparing for ignition." },
        'f26': { hasCollision: true, info: "Reserved for 'The Important People'. Includes a built-in panic button." },
        'f27': { hasCollision: true, info: "Reserved for 'The Important People'. Includes a built-in panic button." },
        'f28': { hasCollision: true, info: "Features a secret drawer for hiding snacks from the interns." },
        'f29': { hasCollision: true, info: "Features a secret drawer for hiding snacks from the interns." },
        'f30': { hasCollision: true, info: "Carved from obsidian glass. Legend says the Director actually sleeps under it." },
        'f31': { hasCollision: true, info: "Carved from obsidian glass. Legend says the Director actually sleeps under it." },
        'f32': { hasCollision: true, info: "A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days." },
        'f33': { hasCollision: true, info: "A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days." },
        'f34': { hasCollision: false, info: "A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised." },
        'f35': { hasCollision: true, info: "A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised." },
        'f36': { hasCollision: true, info: "Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions." },
        'f37': { hasCollision: true, info: "An empty bowl. The salt levels within are high enough to preserve a whole lab tech." },
        'f38': { hasCollision: false, triggerHeal: true, info: "Incubator Unit-01: [STATION READY]" },
        'f39': { hasCollision: false, triggerHeal: true, info: "Incubator Unit-02: [STATION READY]" },
        'f40': { hasCollision: true, triggerHeal: true, info: "Incubator Unit-03: [STATION READY]" },
        'f41': { hasCollision: true, triggerHeal: true, info: "Incubator Unit-04: [STATION READY]" },
        'f42': { hasCollision: false, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'f43': { hasCollision: false, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'f44': { hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'f45': { hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'f46': { hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'f47': { hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'f48': { hasCollision: true, info: "Labeled: 'DO NOT SHAKE'." },
        'f49': { hasCollision: true, info: "Mostly contains encrypted logs, but some files are just high-score records for 'Snake'." },
        'f50': { hasCollision: true, info: "A magnetic keycard. Smells like the Director's expensive cologne." },
        'f51': { hasCollision: true, info: "Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal." },
        'f52': { hasCollision: false, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'f53': { hasCollision: false, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'f54': { hasCollision: true, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'f55': { hasCollision: true, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'f56': { hasCollision: true, info: "\"Why do all the tables have to be this messy?\" asked the janitor." },
        'f57': { hasCollision: true, info: "\"Why do all the tables have to be this messy?\" asked the janitor." },
        'f58': { hasCollision: true, info: "I can see the little cockroaches crawling out!" },
        'f59': { hasCollision: true, info: "Looks like a normal plant... or is it?" },
        'f60': { hasCollision: true, info: "This box is heavier than it looks." },
        'f61': { hasCollision: false, info: "Please don't fall on my head" },
        'f62': { hasCollision: true, info: "Please don't fall on my head" },
        'f63': { hasCollision: true, info: "This is the best ultimate super rare card ever!" },

        // --- TILESET 03 (f64+) ---
        'f64': { hasCollision: true, info: "Ancient people used this to store data!" },
        'f65': { hasCollision: true, info: "Whatever is lying here doesn't look exactly human; it'd better be!" },
        'f66': { hasCollision: true, info: "Whatever is lying here doesn't look exactly human; it'd better be!" },
        'f67': { hasCollision: false, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
        'f68': { hasCollision: false, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
        'f69': { hasCollision: true, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
        'f70': { hasCollision: true, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
        'f71': { hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
        'f72': { hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
        'f73': { hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
        'f74': { hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
        'f75': { hasCollision: true, info: "Just collect them all!" },
        'f76': { hasCollision: false, info: "These books are surprisingly well preserved!" },
        'f77': { hasCollision: false, info: "These books are surprisingly well preserved!" },
        'f78': { hasCollision: true, info: "These books are surprisingly well preserved!" },
        'f79': { hasCollision: true, info: "These books are surprisingly well preserved!" },
        'f80': { hasCollision: false, info: "Stay cool—we'll be out in a century or two." },
        'f81': { hasCollision: false, info: "Stay cool—we'll be out in a century or two." },
        'f82': { hasCollision: true, info: "Stay cool—we'll be out in a century or two." },
        'f83': { hasCollision: true, info: "Stay cool—we'll be out in a century or two." },
        'f84': { hasCollision: true, info: "Whatever is kept inside is in a deep freeze state!" },
        'f85': { hasCollision: true, info: "Whatever is kept inside is in a deep freeze state!" },
        'f86': { hasCollision: false, info: "People are trying to bring this ancient plant back; sometimes it's a success!" },
        'f87': { hasCollision: true, info: "People are trying to bring this ancient plant back; sometimes it's a success!" },
        'f88': { hasCollision: false, info: "People are trying to bring this ancient plant back; sometimes it's a failure!" },
        'f89': { hasCollision: true, info: "People are trying to bring this ancient plant back; sometimes it's a failure!" },
        'f90': { hasCollision: true, info: "You are now a truly member of the pack!" },
        'f91': { hasCollision: true, info: "A ceramic pot filled with special fertile soil. If you listen closely, you can hear the worms throwing a tiny rave in there." },
        'f92': { hasCollision: false, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f93': { hasCollision: false, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f94': { hasCollision: false, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f95': { hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f96': { hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f97': { hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f98': { hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f99': { hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f100': { hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
        'f101': { hasCollision: true, info: "Contains the complex genomic blueprint of a Cell. It's essentially the ultimate 'cheat sheet' for biological reconstruction." },
        'f102': { hasCollision: true, info: "A container of stabilized raw biological material. It smells faintly of damp earth and limitless potential." },
        'f103': { hasCollision: true, info: "An oversized cultivation dish designed for Cell. It's climate-controlled and remarkably soft—essentially a luxury suite for a Cell." },
        'f104': { hasCollision: true, info: "An internal currency chip exclusive to Labs. What started as a corporate joke became the only way to pay for the 'premium' noodles." },

        // --- ENCOUNTER CELLS ---
        'c0': { hasCollision: true, info: "A wild Stemmy is wandering." },
        'c1': { hasCollision: true, info: "A wild Cambihil is looking for leaf." },
        'c2': { hasCollision: true, info: "A wild Lydrosome is watching a lab tube." },
        'c3': { hasCollision: true, info: "A wild Nitrophil is searching for food." },

    },

    getFurnitureMeta(objId, customSprite) {
        if (!objId) return null;
        // customSprite takes priority over the generic id-prefix lookup
        if (customSprite) {
            const classes = customSprite.split(' ');
            for (const cls of classes) {
                if (this.furnitureMetadata[cls]) {
                    return this.furnitureMetadata[cls];
                }
            }
        }
        const prefix = objId.split('_')[0];
        return this.furnitureMetadata[prefix] || null;
    },

    updateQuestProgress(type, id) {
        let changed = false;
        Object.keys(gameState.quests).forEach(questId => {
            const progressObj = gameState.quests[questId];
            const questData = QUESTS[questId];

            if (progressObj.status === 'started' && questData.type === type && questData.target === id) {
                progressObj.progress++;
                changed = true;

                if (progressObj.progress >= questData.amount) {
                    progressObj.status = 'completed';
                    console.log(`Quest [${questData.title}] marked as COMPLETED!`);
                }
            }
        });

        if (changed) {
            saveGameState();
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
                if (window.gameState) {
                    if (reward.id === 'credits') window.gameState.credits += (reward.amount || 0);
                    if (reward.id === 'biomass') window.gameState.biomass += (reward.amount || 0);
                    if (window.updateResourceHUD) window.updateResourceHUD();
                }
                msg = `Acquired ${reward.amount} ${reward.id.toUpperCase()}.`;
            }
            console.log(`Quest Reward given: ${msg}`);
        };

        const reward = questData.reward;
        if (reward.type === 'resource_multi' && Array.isArray(reward.rewards)) {
            reward.rewards.forEach(r => processReward(r));
        } else {
            processReward(reward);
        }
    },

    init() {
        console.log("Overworld Engine Starting...");
        this.resetStates(); // Ensure clean start
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
        const id = zoneId || this.currentZone || 'lobby';

        // Update Bio-Extract visuals if we are entering or rendering the extraction room
        if (id === 'bioExtraction') {
            this.updateBioExtractVisuals();
        }

        const zone = this.zones[id];
        const isNewZone = id !== this.currentZone || forceSpawn;

        const mapEl = document.getElementById('overworld-map');
        const playerSprite = document.getElementById('player-sprite');

        // 1. LOCK VISUALS (Prevent jerky movement during redraw)
        if (mapEl) mapEl.classList.add('no-transition');
        if (playerSprite) playerSprite.classList.add('no-transition');

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

                if (isLockedByFlag || isLockedByItem) {
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

                const isClosedDoor = [20, 22, 24, 25, 28, 29, 30, 31].includes(tileID);
                const isOpenDoor = [21, 23, 26, 27].includes(tileID);
                const isGenericWall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 32].includes(tileID);

                if (isGenericWall || isClosedDoor) tile.classList.add('wall');
                else tile.classList.add('floor');

                if (isClosedDoor || isOpenDoor) tile.classList.add('door-tile');

                mapEl.appendChild(tile);
            }
        }

        // 4. DRAW OBJECTS
        this.refreshLogs(); // Sync logs from state (accounting for debug mode)
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

        zone.objects.forEach(obj => this.renderObject(obj, mapEl));

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

        // Always add the class derived from the object ID
        const specificClass = obj.id.startsWith('npc_') ? obj.id.split('_').slice(0, 2).join('_') : obj.id.split('_')[0];
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

        // Add Level Badge for Bio-Extraction Grid Cells
        if (obj.type === 'cell' && obj.efficiency) {
            const badge = document.createElement('div');
            badge.className = 'efficiency-badge';
            badge.innerText = obj.efficiency;
            el.appendChild(badge);
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
                // If dialogue is active, always allow F to advance/speed up
                if (this.isDialogueActive) {
                    this.interact();
                } else if (!this.isPaused && !e.repeat) {
                    // Safety check: Don't interact if any UI overlay/modal is visible
                    const hasOverlay = document.querySelector('.overlay:not(.hidden), .modal-overlay:not(.hidden), .modal-overlay.active');
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
            this.pendingItemPickup = null;
            this.collectItem(itemId);
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
            // Update movement progress first
            this.handleMovementProgress();

            // Check for new input
            this.handleMovementInput();
        }

        requestAnimationFrame(() => this.gameLoop());
    },

    handleMovementProgress() {
        if (!this.player.isMoving) return;

        const now = Date.now();
        const actualMoveSpeed = this.player.isSprinting ? 170 : this.player.moveSpeed;
        const progress = now - this.player.moveStartedAt;

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
        if (this.player.isMoving || this.isDialogueActive || this.isTransitioning || this.isPaused) return;

        // Check Sprint State
        this.player.isSprinting = this.keysPressed.has('shift');

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

        // 2. Turn-in-place Logic
        if (this.player.direction !== targetDir) {
            this.player.direction = targetDir;
            this.lastTurnTime = Date.now();
            this.player.isTurning = true;
            this.updatePlayerPosition();

            // Temporary turning visual effect (60ms for a clicky snap)
            setTimeout(() => {
                this.player.isTurning = false;
                this.updatePlayerPosition();
            }, 60);
            return;
        }

        // 3. Movement Delay Logic (Turn-then-Walk Smoothing)
        // If we just turned, wait 60ms before allowing move
        const now = Date.now();
        if (now - this.lastTurnTime < 60) {
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
                const tileID = zone.layout[nextY][nextX];
                const doorMap = { 20: 21, 22: 23, 24: 26, 25: 27 };
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

        // Object Collision Check (Prioritize Wild Specimens for Kicking)
        const obstacle = zone.objects.find(obj => {
            const w = obj.width || 1;
            const h = obj.height || 1;
            return nextX >= obj.x && nextX < obj.x + w && nextY >= obj.y && nextY < obj.y + h;
        });

        if (obstacle) {
            const meta = this.getFurnitureMeta(obstacle.id, obstacle.customSprite);
            const isKickable = (obstacle.temp === true || (obstacle.id && obstacle.id.includes('_wild_')));

            if (isKickable && !obstacle.isKicking && this.player.isSprinting) {
                this.kickWildMonster(obstacle, dx, dy);
                this.updatePlayerPosition();
                return;
            }

            if (meta && meta.hasCollision === false) {
                // Pass through non-collidable (e.g. tank tops)
            } else {
                this.updatePlayerPosition();
                return;
            }
        }

        // 4. Perform Movement
        this.player.isMoving = true;
        this.player.moveStartedAt = Date.now();
        this.player.x = nextX;
        this.player.y = nextY;

        // Immediate proximity check to eliminate "entry lag"
        this.checkProximityTriggers();

        // Start Step Visuals (Idle Frame)
        this.player.currentFrame = this.player.stepParity * 2;
        this.updatePlayerPosition();

        // Spawn Footstep VFX
        this.spawnFootstep(this.player.x - dx, this.player.y - dy, this.player.isSprinting);
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

        this.keysPressed.clear(); // Prevent immediate move in new zone

        // 1. CLEANUP OLD ZONE SPAWNS (while currentZone is still the old zone)
        this.spawner.stop();
        this.spawner.despawnCurrent();

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

    updatePlayerPosition() {
        const playerEl = document.getElementById('player-sprite');
        const mapEl = document.getElementById('overworld-map');
        const viewport = document.getElementById('overworld-viewport');
        const zone = this.zones[this.currentZone];

        if (playerEl) {
            // 0. Update Visual States
            if (this.player.isSprinting) playerEl.classList.add('is-sprinting');
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

            // 3. Move Player relative to Map
            playerEl.style.translate = `${this.player.x * this.tileSize}px ${this.player.y * this.tileSize}px`;
            playerEl.style.scale = this.player.isTurning ? '1.07' : '1';
            playerEl.style.transformOrigin = 'center 80%'; // Center relative to feet for a grounding pop
            playerEl.style.zIndex = this.player.y + 1 + 10;
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
        if (this.isPaused || this.isTransitioning) return;

        const now = Date.now();
        if (now - this.lastInteractTime < 150) return;
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

        const zone = this.zones[this.currentZone];
        let targetX = this.player.x;
        let targetY = this.player.y;

        if (this.player.direction === 'up') targetY--;
        if (this.player.direction === 'down') targetY++;
        if (this.player.direction === 'left') targetX--;
        if (this.player.direction === 'right') targetX++;

        // 1. Check for NPCs and Wild Monsters
        const npc = zone.objects.find(obj => obj.type === 'npc' && obj.x === targetX && obj.y === targetY);
        if (npc) {
            if (npc.id.includes('_wild_')) {
                const mName = npc.monsterId.charAt(0).toUpperCase() + npc.monsterId.slice(1);
                this.spawner.stop(); // Stop wild spawns when interacting with one

                if (this.checkActiveSquad()) {
                    this.pendingWildEncounter = true;
                    this.pendingWildMonsterId = npc.monsterId;
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
        const obj = zone.objects.find(o => (['prop', 'cell', 'sign', 'atrium_statue'].includes(o.type) || o.id === 'incubator') &&
            targetX >= o.x && targetX < o.x + (o.width || 1) &&
            targetY >= o.y && targetY < o.y + (o.height || 1));

        if (obj) {
            const meta = this.getFurnitureMeta(obj.id, obj.customSprite);
            if (meta && meta.hasCollision === false && !['f38', 'f39', 'f40', 'f41'].some(id => obj.id.startsWith(id))) {
                // Ignore interaction with non-collidable parts (tops of tanks/skeletons etc)
                // Note: Keeping incubators interactable as exceptions for height
                return;
            }

            // Generic Item/Log Collection Logic
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

                const title = meta.triggerBioExtract ? "Bio-Extractor" : (meta.triggerShop ? "Vending Machine" : "Incubator Unit");
                const text = meta.triggerBioExtract ?
                    ["BIO-EXTRACTOR: [BIO-EXTRACTION PROTOCOLS ACTIVE]", "Authorized biological materials detected.", "Initiate extraction sequence?"] :
                    (meta.triggerShop ?
                        ["ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]", "Please follow technical safety guidelines."] :
                        ["Biological maintenance system online.", "Awaiting operator authorization..."]);

                this.showDialogue(title, text);
                return;
            }

            // CellAccelerator Interaction
            if (obj.name === 'Cell-Accelerator') {
                this.pendingSynthesisMenu = true;
                this.showDialogue("Cell-Accelerator", ["CELL-ACC TERMINAL: [SYNTHESIS PROTOCOLS ACTIVE]", "Ensure biological requirements are met before initialization."]);
                return;
            }

            // Normal Lore Inspection
            if (meta && meta.info) {
                const infoLines = Array.isArray(meta.info) ? meta.info : [meta.info];
                this.showDialogue(obj.name || "Laboratory Asset", infoLines);
            } else {
                // Fallback for objects without metadata
                this.showDialogue(obj.name || "Object", [
                    `System initializing for: ${obj.name}...`,
                    `This biological entity is currently under observation.`,
                    `Please consult Director Capsain for further clearance.`
                ]);
            }
            return;
        }

        // 3. Tile Interaction (Special Locked Messages)
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

    startNPCInteraction(npcOrId, bossWon = false, isPostBattle = false) {
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

        // Make NPC face the player
        const oppDirections = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };
        npc.direction = oppDirections[this.player.direction] || 'down';

        const npcEl = document.getElementById(`npc-${npc.id}`);
        if (npcEl) {
            npcEl.classList.remove('face-up', 'face-down', 'face-left', 'face-right');
            npcEl.classList.add(`face-${npc.direction}`);
        }

        const logs = this.logsCollected.length;
        let lines = ["..."];
        this.pendingBattleEncounter = null; // Clean slate

        // --- NEW: SIDE QUEST BRANCHING ---
        if (npc.sideQuestId && window.gameState && window.gameState.quests) {
            const qId = npc.sideQuestId;
            const qData = QUESTS[qId];

            if (qData) {
                // Initialize if not exists
                if (!window.gameState.quests[qId]) {
                    window.gameState.quests[qId] = { status: 'started', progress: 0 };
                    saveGameState();
                    this.showDialogue(npc.name, qData.dialogue.offer, npc.id);
                    return;
                }

                const qProgress = window.gameState.quests[qId];

                // Case 1: Quest is ready to be turned in (Sequential priority)
                if (qProgress.status === 'completed') {
                    // Item Consumption Logic
                    if (qData.consume && qData.type === 'collect') {
                        const idx = window.gameState.items.indexOf(qData.target);
                        if (idx > -1) window.gameState.items.splice(idx, 1);
                    }

                    // Defer reward and status update until dialogue ends
                    this.onDialogueComplete = () => {
                        this.giveQuestReward(qId);
                        qProgress.status = 'finished';
                        saveGameState();
                    };
                    this.showDialogue(npc.name, qData.dialogue.complete, npc.id);
                    return;
                }

                // Case 2: Quest is ongoing
                if (qProgress.status === 'started') {
                    // Custom Check for 'show_monster' type
                    if (qData.type === 'show_monster') {
                        const hasMonster = gameState.profiles.player.party.some(m =>
                            m && m.id === qData.target && (m.extractEfficiency || 0) >= (qData.minEfficiency || 0)
                        );

                        if (hasMonster) {
                            // Turn in immediately!
                            this.onDialogueComplete = () => {
                                this.giveQuestReward(qId);
                                qProgress.status = 'finished';
                                saveGameState();
                            };
                            this.showDialogue(npc.name, qData.dialogue.complete, npc.id);
                            return;
                        }
                    }

                    let progressLines = qData.dialogue.progress.map(line =>
                        line.replace('{progress}', qProgress.progress)
                    );
                    this.showDialogue(npc.name, progressLines, npc.id);

                    // If the quest target is this specific NPC, don't return so the battle can trigger
                    if (qData.type === 'defeat' && qData.target === (npc.battleEncounterId || npc.id)) {
                        // Continue to battle logic
                    } else {
                        return;
                    }
                }

                // Case 3: Quest is finished - allow story dialogue to resume
                if (qProgress.status === 'finished') {
                    if (qData.dialogue.finished && qData.dialogue.finished.length > 0) {
                        lines = qData.dialogue.finished;
                    }
                }
            }
        }

        // --- NEW: ONE-TIME BATTLE CHECK ---
        const encounterId = npc.battleEncounterId || npc.id;
        const isBattleDone = window.gameState && window.gameState.storyFlags && window.gameState.storyFlags[`battleDone_${encounterId}`];

        // --- NEW: UNIVERSAL POST-BATTLE DIALOGUE ---
        if (isPostBattle || isBattleDone) {
            // Determine who won:
            // 1. If isPostBattle (returning from battle right now), bossWon is the source of truth.
            // 2. If !isPostBattle (talking later), check storyFlags.
            //    Note: bossWon (NPC won) corresponds to battleLost_ (player lost).
            const isNpcVictory = isPostBattle ? bossWon : window.gameState.storyFlags[`battleLost_${encounterId}`];

            if (isNpcVictory) {
                // NPC WON (Player lost)
                if (npc.npcWinDialogue) {
                    this.showDialogue(npc.name, npc.npcWinDialogue, npc.id);
                    return;
                }
            } else {
                // NPC LOST (Player won)
                if (npc.npcLossDialogue) {
                    this.showDialogue(npc.name, npc.npcLossDialogue, npc.id);
                    return;
                }
            }
            // Fallthrough to regular lines if no specialized dialogue found
        }

        if (npc.id === 'jenzi' && (lines.length === 1 && lines[0] === "...")) {
            if (!window.gameState.storyFlags.starterChosen) {
                // Starter selection flow
                lines = [
                    "Welcome to the trenches, Intern! I'm Jenzi, your guide through this corporate fever dream.",
                    "We're supposedly 'healing the world,' but mostly we're just trying not to get fired by Lab Director Capsain.",
                    "This floor is only a tiny slice of the National Lab mega-structure, though.",
                    "We handle a few departments here—Botanic, Human Research, and the Executive Suite.",
                    "Since you're the new main character, you need a Companion Cell.",
                    "It's like a smart pet, but way more... liquid.",
                    "We use them for everything—from heavy lifting to high-end research...",
                    "...though most researchers just end up teaching them tricks during lunch.",
                    "Their origins are a whole rabbit hole of lab theories, but basically everyone loves them.",
                    "Well, except for... actually, don't worry about that yet.",
                    "Just know they're the ultimate lab partners.",
                    "I've got three in the incubator.",
                    "It's a lab tradition—who knows when or why it started...",
                    "But everyone who works here must have at least one Companion Cell.",
                    "So just pick one that vibe with you the most."
                ];
                // Trigger the modal after dialogue closes.
                this.pendingBattleEncounter = 'starter_selection';
            } else if (!window.gameState.storyFlags.jenziFirstBattleDone && !isPostBattle) {
                if (!this.checkActiveSquad()) {
                    lines = ["You need an active squad to battle! Check the Incubator or your Inventory to deploy your Cells."];
                } else {
                    lines = [
                        "Sheesh, nice pick! Let's see if you can actually use it though.",
                        "Bet you can't even touch me in a battle. Pelli-it up!"
                    ];
                    this.pendingBattleEncounter = 'jenzi_tutorial';
                }
            } else if (!this.logsCollected.includes('Log001')) {
                lines = [
                    "Ayo, not bad for a first-timer! You've got that 'pioneer spirit' everyone talks about.",
                    "Win or lose, you're the only one brave enough to test that Cell today. Respect.",
                    "Wait, did you see that? Something just flashed over by the specimen tanks.",
                    "Go check if someone dropped something in there.",
                    "I swear, these scientists have the attention span of a goldfish once they leave their desks."
                ];
            } else if (!window.gameState.storyFlags.jenziAtriumUnlocked) {
                lines = [
                    "Aha! A lost Datapad. People here would forget their own heads if they weren't attached.",
                    "Collect 'em and bring 'em to me, okay? I'll 'officially' return them to the owners.",
                    "Door to the Atrium is open now. Go explore, but don't get lost in the sauce."
                ];
                window.gameState.storyFlags.jenziAtriumUnlocked = true;
                this.renderMap();
            } else if (logs < 5) {
                lines = [
                    "Yo, Intern! Keep looking for Datapads.",
                    "The doors are locked until you prove you can do basic research."
                ];
            } else if (logs >= 5 && !window.gameState.storyFlags.jenziAtriumBattleDone && !isPostBattle) {
                lines = [
                    "You've been busy! 5 Datapads already?",
                    "Lowkey impressive.",
                    "Then you must smell something fishy about the Incident.",
                    "But before I tell you about the 'smell', let's see if you're actually worth it.",
                    "My Stemmy is ready to rumble. Pelli-it up!"
                ];
                this.pendingBattleEncounter = 'jenzi_atrium';
            } else if (window.gameState.storyFlags.jenziAtriumBattleDone && !window.gameState.storyFlags.botanicSectorUnlocked) {
                lines = [
                    "Okay, okay, you got me! You're actually decent.",
                    "Since you won, here's the tea about 'The Incident'.",
                    "Director Capsain says it was an 'Ionization Leak'.",
                    "Something about that story just isn't right...",
                    "Well beat me, what do I know.",
                    "If you want the real story, go ask Lana in the Botanic wing.",
                    "She's the main character of that floor anyway.",
                    "I've unlocked the door for you. Keep collecting those logs!"
                ];
                window.gameState.storyFlags.botanicSectorUnlocked = true;
                this.renderMap();
            } else if (window.gameState.storyFlags.lanaBattleDone && !window.gameState.storyFlags.humanWardUnlocked) {
                lines = [
                    "Wait, Lana gave you a key? And she was acting sus?",
                    "Sus-picious!",
                    "That's weird af. Maybe things aren't as simple as 'spicy ozone'.",
                    "You should totally go bother Dyzes in Human Research.",
                    "He's chill, but he definitely knows things he's not saying."
                ];
                window.gameState.storyFlags.humanWardUnlocked = true;
                this.renderMap();
            } else if (window.gameState.storyFlags.dyzesBattleDone && !window.gameState.storyFlags.executiveSuiteUnlocked) {
                lines = [
                    "Dyzes gave you info on an 'Old Lab'? Okay, now this is getting serious.",
                    "No more jokes. You need to confront the final boss himself.",
                    "Director Capsain. His room is open.",
                    "Go get the truth, Intern."
                ];
                window.gameState.storyFlags.executiveSuiteUnlocked = true;
                this.renderMap();
            } else {
                lines = ["Main Character energy! Keep collecting those logs, Intern."];
            }
        } else if (npc.id === 'lana' && (lines.length === 1 && lines[0] === "...")) {
            if (bossWon) {
                lines = [
                    "Hmph. Just as I suspected. // Your tactical calibration is completely non-existent!",
                    "You're lucky my Cambihil was in a 'passive' mode, // or you'd be more than just extracted.",
                    "Go back to the entrance and... // and don't come back until you've read at least three field guides! Honestly!"
                ];
            } else if (!window.gameState.storyFlags.lanaMet) {
                lines = [
                    "Hmph. So YOU'RE the new intern Jenzi was giggling about?",
                    "I'm Lana, Senior Scientist of the Botanic Sector.",
                    "Don't think for a second that I have time to babysit you!",
                    "My work on Cambihil is far more complex than anything you've seen...",
                    "So keep your clumsy fingers off my equipment!",
                    "And... and whatever Jenzi told you about... things?",
                    "It's all lies! She just thrives on office gossip!",
                    "Now, either help with the nutrient sensors or get out of my light!"
                ];
                window.gameState.storyFlags.lanaMet = true;
            } else if (window.gameState.storyFlags.lanaBattleDone && !window.gameState.storyFlags.lanaDefeatedSeen) {
                lines = [
                    "Fine! You win! *[Mutters]* Just like the Director during the Leak... always so stubborn.",
                    "Here, take this Old Lab Room Key. It's for some old storage room.",
                    "Just... don't believe everything you read in the logs.",
                    "And tell Jenzi to stop spreading rumors about my lab hygiene! Hmph!"
                ];
                // Reward after this dialogue if not already collected
                if (!window.gameState.items.includes('Quest01')) {
                    this.deferredItemPickup = 'Quest01';
                }
                this.deferredStoryFlag = 'lanaDefeatedSeen';
            } else if (window.gameState.storyFlags.lanaBattleDone || logs < 10) {
                const flavor = [
                    "What are you staring at? // I was merely performing a hydration assessment on your partner Cell. // It is a critical laboratory asset, unlike... some uncalibrated interns! Hmph!",
                    "Why are you obstructing the walkway? // Efficiency is the cornerstone of the Botanic Sector. // If you are going to be non-productive, do it elsewhere!",
                    "Do not simply stand there! // It is... it is scientifically distracting! // If you are here for research, take a clipboard.",
                    "I have no intention of providing remedial guidance. // I simply don't want an incompetent intern lowering this sector's safety rating on their first day!",
                    "Your tactical signature is completely unoptimized. // Did Jenzi provide zero fundamental training, or were you intentionally ignoring protocol?",
                    "Watch your step! // Be careful not to disturb the Cambihil spores. // They're far more sensitive than your heavy boots suggest!"
                ];
                lines = [flavor[Math.floor(Math.random() * flavor.length)]];
            } else if (!isPostBattle) {
                lines = [
                    "Wait. You've been poking around the botanical archives, haven't you?",
                    "Look, I love these cells, but the Director says we have to keep the research classified.",
                    "If you want that Old Lab Key, you'll have to prove you can handle the truth in a duel!",
                    "Prepare for a lesson in botanical efficiency!"
                ];
                this.pendingBattleEncounter = 'lana';
            }
        } else if (npc.id === 'dyzes' && (lines.length === 1 && lines[0] === "...")) {
            if (bossWon) {
                lines = [
                    "Woah, man. You're a bit out of sync. Take a breather, hydrate, and maybe try focusing on the flow next time. No rush."
                ];
            } else if (!window.gameState.storyFlags.dyzesMet) {
                lines = [
                    "Hey. I'm Dyzes. Welcome to the chillest wing of the lab.",
                    "We study the Lydrosome here—it's all about that cellular harmony, you know?",
                    "Jenzi probably made me sound like a relic, but I prefer 'seasoned professional'.",
                    "Watch your step, the osmotic mist is fresh today."
                ];
                window.gameState.storyFlags.dyzesMet = true;
            } else if (window.gameState.storyFlags.dyzesBattleDone && !window.gameState.storyFlags.dyzesDefeatedSeen) {
                lines = [
                    "Woah, okay. Your tactical flow is elite. I can't really hide the truth if you're this good.",
                    "The Old Lab exists, man. It's not on the main maps.",
                    "Wait, let me give you this old data stick I found in the archives.",
                    "It contains a floor plan that reveals the hidden lab location.",
                    "Go talk to Jenzi. She'll level with you about how to get in.",
                    "Capsain is just... he's protective, you know? Good luck."
                ];
                if (!window.gameState.items.includes('Quest03')) {
                    this.deferredItemPickup = 'Quest03';
                }
                this.deferredStoryFlag = 'dyzesDefeatedSeen';
            } else if (window.gameState.storyFlags.dyzesBattleDone || logs < 15) {
                const flavors = [
                    "Lydrosome is a marvel of tactical evolution. Its osmotic pressure allows for surgical precision—dissolving a single harmful enzyme without touching the surrounding tissue. It's the ultimate biological sniper.",
                    "Hey. Breathe in that osmotic mist... feels like a fresh ocean breeze, right? Or maybe just distilled enzymes. Same thing, really.",
                    "The Lydrosomes are in a good mood today. One of them actually waved at me. Or it was just a pressure vent. I'm choosing to believe it waved.",
                    "Don't mind the hum. That's just the sound of cellular harmony. Or my fan. Honestly, I stopped checking which was which long ago.",
                    "You ever wonder if we're just big cells in a giant lab called 'Earth'? Deep stuff, Intern. Real deep. Think about it next time you're filing data.",
                    "Chill out. Stress increases cortisol, and cortisol ruins the data. If you're going to work here, you've gotta learn to go with the flow."
                ];
                lines = [flavors[Math.floor(Math.random() * flavors.length)]];
            } else if (!isPostBattle) {
                lines = [
                    "I've seen your log activity. You're piecing together 'The Incident', aren't you?",
                    "Capsain is a good man, just... proud.",
                    "I can't let you expose him without a proper test of your tactical skill.",
                    "Prepare yourself!"
                ];
                this.pendingBattleEncounter = 'dyzes_boss';
            }
        } else if (npc.id === 'capsain' && (lines.length === 1 && lines[0] === "...")) {
            if (bossWon) {
                lines = [
                    "Dismissed. If you can't even handle a basic engagement, you have no business poking around the archives.",
                    "Go back to filing paperwork, Intern."
                ];
            } else if (window.gameState.items.includes('Quest04')) {
                lines = [
                    "WHAT?! Where did you... how did you find that?!",
                    "That room was sealed! It was supposed to stay buried with the '27 logs!",
                    "Get that... that anomaly out of my sight immediately!",
                    "[Origin Nitrophil glows a hyperactive orange and vibrates happily]",
                    "It... it still does that. Just like the night of the... 'accident'.",
                    "Look at that hue. It's the exact shade of the 'Inferno' blend.",
                    "I tried to tell them it was radiation.",
                    "I told the board we were pioneers of bio-hazard engineering...",
                    "Fine. You win, intern. The 'Ionization Leak' was a lie.",
                    "I was working late. I was hungry.",
                    "One drop of the extra-spicy sauce fell into Petri Dish #0, and...",
                    "it didn't dissolve. It stood up. It looked at me.",
                    "And I was too damn busy worrying about my reputation to tell the truth.",
                    "I spent years calling them 'accidents' to cover my own stupidity.",
                    "But look at him. He's hyperactive, he's chill, and he's more alive than any of my 'professional' theories.",
                    "The Cells aren't anomalies... they're the best mistake I ever made.",
                    "Effective immediately, I am rescinding the termination order. The 'Cell Project' will continue—officially.",
                    "And I want you to be our newest Official Scientist.",
                    "You have proven yourself more capable than any intern I've ever seen, and the lab needs your sharp mind.",
                    "Thank you. I didn't realize how heavy this secret was until you took it off my shoulders.",
                    "Now, let's go tell the staff that 'Noodle Tuesdays' are officially a lab holiday."
                ];
                // Record that we triggered the climax
                window.gameState.storyFlags.climaxTriggered = true;
            } else if (!window.gameState.storyFlags.capsainMet) {
                lines = [
                    "Do you have an appointment? No? Then you're trespassing on executive time.",
                    "I am Director Capsain. I don't have time for 'meaningful introductions'.",
                    "If you're looking for gossip, go back to Jenzi.",
                    "And ignore that smell—it's industrial-grade experimental ozone."
                ];
                window.gameState.storyFlags.capsainMet = true;
            } else if (window.gameState.storyFlags.capsainMet && window.gameState.storyFlags.capsainBattleDone && !window.gameState.storyFlags.capsainDefeatedSeen) {
                lines = [
                    "I... I failed? To an intern? *[Sighs deeply]*",
                    "You've seen the logs. You have the sauce. You've basically already found out.",
                    "Here, take this Rare Inferno Sauce... it's just a research sample! Nothing more!",
                    "Now go away, I have... important papers to write.",
                    "The labs are yours now. Just... keep the gossip to a minimum."
                ];
                if (!window.gameState.items.includes('Quest02')) {
                    this.deferredItemPickup = 'Quest02';
                }
                this.deferredStoryFlag = 'capsainDefeatedSeen';
            } else if (window.gameState.storyFlags.capsainBattleDone || logs < 20) {
                const flavors = [
                    "What are you doing here? These labs aren't for sightseeing! Get back to your station or I'll have you filing paperwork for a month. And ignore that smell, it's... experimental ozone.",
                    "I don't pay you to wander the atrium. I pay you to contribute to a failing project. Wait, I don't pay interns at all. Even better—get back to work.",
                    "There is a very specific protocol for handling sensitive materials. Step one: Don't touch anything. Step two: Refer to step one.",
                    "Lana's greenhouse is taking up too much power. If it weren't for the board's interest in 'green tech', I'd have paved that wing for more reactor space.",
                    "The smell? It’s industrial ionization. If you can’t handle a little stinging in the nostrils, you shouldn’t be in a lab.",
                    "Stop asking about the '27 logs. The archives were purged for security reasons. Unless you have a level 5 clearance, it's none of your business."
                ];
                lines = [flavors[Math.floor(Math.random() * flavors.length)]];
            } else if (!isPostBattle) {
                lines = [
                    "You found the Noodle Review. You found the '27 security gap.",
                    "But you're still just an intern. I won't have my legacy tarnished by some spicy gossip!",
                    "Prepare to be archived!"
                ];
                this.pendingBattleEncounter = 'capsain';
            }
        } else if (lines.length === 1 && lines[0] === "...") {
            // Generic Staff Randomizer
            let activePool = this.randomPools.atrium;
            if (this.currentZone === 'lobby') activePool = this.randomPools.lobby;
            if (this.currentZone === 'botanic') activePool = this.randomPools.botanic;
            if (this.currentZone === 'human') activePool = this.randomPools.human;
            if (this.currentZone === 'kitchen') activePool = this.randomPools.kitchen;
            if (this.currentZone === 'entertainment') activePool = this.randomPools.entertainment;
            if (this.currentZone === 'storage') activePool = this.randomPools.storage;
            if (this.currentZone === 'specimenStorage') activePool = this.randomPools.specimenStorage;
            if (this.currentZone === 'library') activePool = this.randomPools.library;

            const randomIndex = Math.floor(Math.random() * activePool.length);
            lines = activePool[randomIndex];
        }

        // --- NEW: UNIVERSAL BATTLE-ABLE SYSTEM ---
        // If an NPC has a specific battleEncounterId, it will trigger that encounter
        // regardless of story progress. This allows for generic "battle-able" NPCs.
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

    collectItem(itemId) {
        console.log(`Collected Item: ${itemId}`);
        this.updateQuestProgress('collect', itemId);
        const itemInfo = (window.ITEM_PICKUP_DATA && window.ITEM_PICKUP_DATA[itemId]) ? window.ITEM_PICKUP_DATA[itemId] : { type: 'item' };
        const itemType = itemInfo.type || (itemId.length === 3 && !isNaN(itemId) ? 'log' : 'item');

        if (itemType === 'log') {
            if (!this.logsCollected.includes(itemId)) {
                this.logsCollected.push(itemId);
                if (window.gameState) window.gameState.logs = [...this.logsCollected];
            }
        } else {
            if (window.gameState && !window.gameState.items.includes(itemId)) {
                window.gameState.items.push(itemId);
            }
        }

        // Remove from current zone if it was a world object drop
        const zone = this.zones[this.currentZone];
        const objIdx = zone.objects.findIndex(o => (o.hiddenLogId === itemId || o.hiddenItemId === itemId) && (o.id.startsWith('item_') || o.id.startsWith('log_')));
        if (objIdx > -1) {
            const obj = zone.objects[objIdx];
            zone.objects.splice(objIdx, 1);
            const el = document.getElementById(`npc-${obj.id}`);
            if (el) el.remove();
        }

        // Show pickup modal instead of dialogue
        saveGameState(); // Auto-save after pickup
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
                'npc_female': 'Character_FullArt_NPC_Female.png',
                'npc_male': 'Character_FullArt_NPC_Male.png',
                'elara': 'Character_FullArt_Elara.png'
            };

            const key = npcId ? (npcId.startsWith('npc_') ? npcId.split('_').slice(0, 2).join('_') : npcId.split('_')[0]) : null;
            if (key && portraitMap[key]) {
                portraitImg.src = `assets/images/${portraitMap[key]}`;
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
            this.pendingItemPickup = null;
            this.collectItem(itemId);
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
            this.pendingWildEncounter = false;
            this.pendingWildMonsterId = null;
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('start-wild-encounter', { detail: { id: mId } }));
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

        // --- NEW: Execute Completion Callback ---
        if (typeof this.onDialogueComplete === 'function') {
            const cb = this.onDialogueComplete;
            this.onDialogueComplete = null;
            cb();
        }

        // Restart Spawner after Dialogue (only if not about to start a battle)
        if (!this.pendingWildEncounter && !this.pendingBattleEncounter) {
            this.spawner.start();
        }
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
        activeMonsters: [],
        spawnTimer: null,

        start() {
            if (this.spawnTimer) return;
            this.startCooldown();
        },

        stop() {
            if (this.spawnTimer) {
                clearTimeout(this.spawnTimer);
                this.spawnTimer = null;
            }
        },

        startCooldown() {
            if (this.spawnTimer) clearTimeout(this.spawnTimer);
            // 5-15s delay
            const delay = 5000 + (Math.random() * 10000);
            this.spawnTimer = setTimeout(() => this.spawnWildMonster(), delay);
        },

        spawnWildMonster() {
            if (!Overworld.gameLoopActive) return;
            const id = Overworld.currentZone;
            const zone = Overworld.zones[id];
            if (!zone || (zone.objects && zone.objects.some(obj => obj.id && obj.id.includes('_wild_')))) {
                this.startCooldown();
                return;
            }

            const floorTiles = [];
            for (let y = 0; y < zone.height; y++) {
                for (let x = 0; x < zone.width; x++) {
                    if (zone.layout[y][x] === 13) {
                        const occupied = zone.objects.some(obj => obj.x === x && obj.y === y);
                        const playerNear = Math.abs(Overworld.player.x - x) < 3 && Math.abs(Overworld.player.y - y) < 3;
                        if (!occupied && !playerNear) floorTiles.push({ x, y });
                    }
                }
            }

            if (floorTiles.length === 0) {
                this.startCooldown();
                return;
            }

            const pos = floorTiles[Math.floor(Math.random() * floorTiles.length)];
            const monsterIds = ['stemmy', 'cambihil', 'lydrosome', 'nitrophil'];
            const mId = monsterIds[Math.floor(Math.random() * monsterIds.length)];

            const newMonster = {
                id: `npc_wild_${Date.now()}`,
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
            this.activeMonsters.push(newMonster);

            const mapEl = document.getElementById('overworld-map');
            if (mapEl) {
                const el = Overworld.renderObject(newMonster, mapEl);
                
                // 1. Trigger Spawn Pop (Elastic arriving)
                if (el) {
                    el.classList.add('anim-monster-pop');
                    
                    // 2. Hand-off to Breathing (sequential to prevent conflict)
                    setTimeout(() => {
                        if (el && el.parentNode) {
                            el.classList.remove('anim-monster-pop');
                            el.classList.add('anim-monster-breathing');
                        }
                    }, 400);
                }
            }

            // 3. Robust Timer Management (prevents premature removals)
            if (this.despawnTimer) clearTimeout(this.despawnTimer);
            this.despawnTimer = setTimeout(() => this.despawnCurrent(), 15000 + Math.random() * 5000);
        },

        despawnCurrent() {
            if (this.activeMonsters.length > 0) {
                const m = this.activeMonsters[0];
                const el = document.getElementById(`npc-${m.id}`);

                // Show exit animation before removal
                if (el) {
                    el.classList.remove('anim-monster-breathing', 'anim-monster-pop');
                    el.classList.add('anim-recall-exit');
                }

                setTimeout(() => {
                    const zone = Overworld.zones[Overworld.currentZone];
                    if (zone && zone.objects) {
                        zone.objects = zone.objects.filter(obj => obj.id !== m.id);
                    }
                    this.activeMonsters = this.activeMonsters.filter(obj => obj.id !== m.id);
                    if (el && el.parentNode) el.remove();
                    if (this.despawnTimer) clearTimeout(this.despawnTimer);
                    this.startCooldown();
                }, 400); // Wait for anim-recall-exit (0.4s)
            } else {
                this.startCooldown();
            }
        }
    },

    kickWildMonster(monsterObj, dx, dy) {
        if (this.isTransitioning || this.isPaused || monsterObj.isKicking) return;
        monsterObj.isKicking = true;

        const el = document.getElementById(`npc-${monsterObj.id}`);
        if (!el) return;

        // 0. ABORT CURRENT MOVEMENT (Prevents post-pause state conflict)
        if (this.player.isMoving) {
            this.player.isMoving = false;
            this.player.x = Math.round(this.player.x);
            this.player.y = Math.round(this.player.y);
        }
        
        // 1. HIT STOP (Freeze Player Pose & Game)
        const screen = document.getElementById('screen-overworld');
        const playerEl = document.getElementById('player-sprite');
        if (screen) screen.classList.add('anim-screen-shake');
        
        // Force contact pose visually and internally
        this.player.isMoving = false; // ABORT MOVEMENT IMMEDIATELY
        this.player.currentFrame = (this.player.stepParity * 2) + 1;
        this.updatePlayerPosition();
        
        // Remove ALL specimen visual states to prevent conflict
        el.classList.remove('anim-monster-breathing', 'anim-monster-pop');
        el.classList.add('anim-monster-shake');
        this.isPaused = true;

        setTimeout(() => {
            if (!this.gameLoopActive) return;
            
            // 2. RECONCILE AND UNPAUSE
            this.isPaused = false;
            
            // Unconditionally Reset player sprite to idle after hitstop
            this.player.currentFrame = this.player.stepParity * 2;
            this.player.isSprinting = [...this.keysPressed].some(k => k === 'shift'); 
            
            // FORCE DOM SYNC (Bypassing any potential game-loop batching)
            if (playerEl) {
                playerEl.classList.remove('p-frame-1', 'p-frame-3');
                playerEl.classList.add(`p-frame-${this.player.currentFrame}`);
            }
            this.isPaused = false;
            this.updatePlayerPosition();
            
            if (screen) screen.classList.remove('anim-screen-shake');
            
            // 2. Clear monster shake
            el.classList.remove('anim-monster-shake');
            
            // Force a reflow to ensure the previous animation is cleared
            void el.offsetWidth;
            
            // LOGICAL TILE FREEDOM: Remove from collision objects exactly when unpaused
            const zone = this.zones[this.currentZone];
            if (zone && zone.objects) {
                zone.objects = zone.objects.filter(obj => obj.id !== monsterObj.id);
            }
            this.spawner.activeMonsters = this.spawner.activeMonsters.filter(obj => obj.id !== monsterObj.id);

            requestAnimationFrame(() => {
                el.style.zIndex = 9999;
                el.style.willChange = 'transform, opacity';
                
                // 3. DIRECTION-AWARE PHYSICS
                let possible = ['l', 'r']; 
                if (dy < 0) possible = ['u', 'l', 'r']; 
                else if (dy > 0) possible = ['f', 'l', 'r']; 
                else if (dx < 0) possible = ['l', 'u', 'f']; 
                else if (dx > 0) possible = ['r', 'u', 'f']; 
                
                const choice = possible[Math.floor(Math.random() * possible.length)];
                
                // Updated Spin: 60 to 720 degrees
                const totalSpin = (Math.random() * 660 + 60) * (choice === 'l' ? -1 : 1);
                el.style.setProperty('--kick-spin', `${totalSpin}deg`);
                
                // 4. START KICK ANIMATION
                el.classList.add(`anim-monster-kick-${choice}`);
            });

            this.updateQuestProgress('kick', monsterObj.monsterId + '_wild');

            // Clear despawn timer if kicked!
            if (this.spawner.despawnTimer) clearTimeout(this.spawner.despawnTimer);

            setTimeout(() => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
                this.spawner.startCooldown();
            }, 800);
        }, 300);
    },

    spawnFootstep(x, y, isSprinting = false) {
        const mapEl = document.getElementById('overworld-map');
        if (!mapEl) return;

        const puff = document.createElement('div');
        puff.className = 'footstep-puff';

        // 3 Circles for Cartoon Cloud (Walking vs Sprinting)
        const count = 3;
        for (let i = 0; i < count; i++) {
            const circle = document.createElement('span');
            // Size: 8-10px for walking, 10-18px for sprinting
            const size = isSprinting ? (Math.random() * 8 + 10) : (Math.random() * 2 + 8);
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = isSprinting ? `${Math.random() * 20 - 5}px` : `${Math.random() * 10 - 2}px`;
            circle.style.top = isSprinting ? `${Math.random() * 12 - 4}px` : `${Math.random() * 8 - 2}px`;
            puff.appendChild(circle);
        }

        // Position on the tile the player is leaving
        puff.style.left = `${(x * this.tileSize) + 20}px`;
        puff.style.top = `${(y * this.tileSize) + 40}px`;
        puff.style.zIndex = this.player.y + 5; // Below player (y+11)

        mapEl.appendChild(puff);

        // Auto-cleanup
        setTimeout(() => {
            if (puff.parentNode) puff.remove();
        }, 500);
    }
};

window.Overworld = Overworld;

