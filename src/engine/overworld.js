/**
 * Overworld Engine for The Odd Labs
 * Handles grid-based movement, collisions, and zone transitions.
 */

import { gameState, saveGameState } from './state.js';
import { QUESTS } from '../data/quests.js';

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
        medicalExperienceRoom
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
        'f37': { hasCollision: true, kickable: true, info: "An empty bowl. The salt levels within are high enough to preserve a whole lab tech." },
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
        'f48': { hasCollision: true, kickable: true, info: "Labeled: 'DO NOT SHAKE'." },
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
        'f59': { hasCollision: true, kickable: true, info: "Looks like a normal plant... or is it?" },
        'f60': { hasCollision: true, kickable: true, info: "This box is heavier than it looks." },
        'f61': { hasCollision: false, info: "Please don't fall on my head" },
        'f62': { hasCollision: true, kickable: true, info: "Please don't fall on my head" },
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
        'f105': { hasCollision: true, kickable: true, info: "Nothing can stop me, even when the sign says so." },
        'f106': { hasCollision: true, kickable: true, info: "Nothing can stop me; turning the sign sideways won't help." },

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

        // Reset kicked state for all objects whenever re-entering a room
        zone.objects.forEach(o => { delete o.isKicking; });

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

        // Object Collision Check (Priority: Kickable > Colliding > Hidden)
        const candidates = zone.objects.filter(obj => {
            if (obj.isKicking) return false;
            const w = obj.width || 1;
            const h = obj.height || 1;
            return nextX >= obj.x && nextX < obj.x + w && nextY >= obj.y && nextY < obj.y + h;
        });

        // 1. Prefer Kickable
        let obstacle = candidates.find(o => {
            const m = this.getFurnitureMeta(o.id, o.customSprite);
            return (o.temp === true || (o.id && o.id.includes('_wild_')) || (m && m.kickable === true));
        });

        // 2. If no kickable, prefer Colliding
        if (!obstacle) {
            obstacle = candidates.find(o => {
                const m = this.getFurnitureMeta(o.id, o.customSprite);
                return !m || m.hasCollision !== false;
            });
        }

        // 3. Last fallback (anything else at the tile)
        if (!obstacle) obstacle = candidates[0];

        if (obstacle) {
            const meta = this.getFurnitureMeta(obstacle.id, obstacle.customSprite);
            const isKickable = (obstacle.temp === true || (obstacle.id && obstacle.id.includes('_wild_')) || (meta && meta.kickable === true));

            if (isKickable && !obstacle.isKicking && this.player.isSprinting) {
                this.kickObject(obstacle, dx, dy);
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
        if (this.isPaused || this.isTransitioning) return;

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
        const targetObstacle = zone && zone.objects.find(o => interactX >= o.x && interactX < o.x + (o.width || 1) && interactY >= o.y && interactY < o.y + (o.height || 1));
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
        const npc = zone.objects.find(obj => obj.type === 'npc' && obj.x === targetX && obj.y === targetY);
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
        } else if (npc.id === 'maya' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = ["Don't be discouraged! Sometimes a bit of luck helps with the final sync, but skill is the foundation! Just keep practicing your placement."];
                } else {
                    lines = [
                        "Incredible! Your placement was precise. // That's the secret to the MAP system—it's not just about power, it's about the proximity of your attack nodes.",
                        "Think of it like a puzzle: the closer you are to the target, the more damage you deal and the more energy (PP) you gain. // It's all about finding that sweet spot!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Excuse me, Intern! Have you mastered the Matching Attack Placement (MAP) system yet? // It's the core of our tactical research.",
                    "If you can prove your proficiency, I'll share some insights on the finer points of MAP."
                ];
                this.pendingBattleEncounter = 'maya';
            } else {
                lines = ["It's all about finding that sweet spot in your attack placement! Keep practicing!"];
            }
        } else if (npc.id === 'sapstan' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Don't sweat it. The Pellicle Point system is all about balance. // You'll eventually turn your Pellicle Points into an advantage...",
                        "...but avoid that nasty 25% HP Overload discharge for now. // Take a breather and we'll try again later."
                    ];
                } else {
                    lines = [
                        "Nice job! You've got a good handle on the tactical flow. // Tip: positive PP creates a kinetic shield, softening incoming hits.",
                        "Just don't hit Max PP—that'll cause a Pellicle Discharge, dealing 25% of your Max HP in damage!",
                        "Later, you'll unlock skills to 'vent' those Pellicle Points for massive damage. Keep it up!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Hey there. Have you noticed how the Pellicle Point system works? // Most focus on attacks, but PP management is where you see real results.",
                    "Spar with me? I'll show you the 'Positive Shield' effect. Ready?"
                ];
                this.pendingBattleEncounter = 'sapstan';
            } else {
                lines = ["Positive PP creates a kinetic shield. It's the secret to staying alive in a tough fight!"];
            }
        } else if (npc.id === 'blundur' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Predictable. You won't win without using a calibrated Catalyst Box to boost your stats. // You lacked the tactical effects needed to penetrate my defense.",
                        "Access your Inventory to slot new cards and see the results in your next battle. It's the best part of the job!"
                    ];
                } else {
                    lines = [
                        "Inquiry! How did you bypass my dermal bio-ceramics? A high-frequency sync? Fascinating.",
                        "Pro-tip: Check your Catalyst Box in the Inventory menu to slot your rewards and boost your stats.",
                        "Increasing your Research Grade will unlock even more slots for skills and passive effects. Truly revolutionary!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Salutations! I'm Biologist Blundur. Have you heard of the C-Card system? // They're bio-synthetic boosters that significantly enhance your Cell's stats.",
                    "Slotting them into your Catalyst Box is essential for maximizing your tactical advantage. // Ready to see how much of a difference a good build makes?"
                ];
                this.pendingBattleEncounter = 'blundur';
            } else {
                lines = ["Check your Catalyst Box frequently and slot new cards. It's the only way to reach peak efficiency!"];
            }
        } else if (npc.id === 'saito' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Better luck next time! // Since I'm nice, here's a tip: There's a Console Station in the Atrium near the north wall...",
                        "...it's humming a bit strangely. Check the ports, maybe someone left a datapad plugged in!"
                    ];
                } else {
                    lines = [
                        "Fine, you're better than you look! // Check the Atrium. There's a pile of boxes near the south exit...",
                        "something shiny is tucked inside one of them. Happy hunting!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Oh, you're looking for Sapstan and Blundur's lost datapads? // I might have seen them... but I won't tell you for free!",
                    "Let's have a quick Cell battle. If you win, I'll give you a hint!"
                ];
                this.pendingBattleEncounter = 'saito';
            } else {
                lines = ["Did you find the shiny thing in the Atrium? I told you it was there!"];
            }
        } else if (npc.id === 'shopia' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Efficiency is the cornerstone of research. // To succeed, one must master elemental counters: Thermal melts Botanic...",
                        "Botanic absorbs Osmotic, and Osmotic cools Thermal. // Always analyze the nature of your target before initiating a sync."
                    ];
                } else {
                    lines = [
                        "Incredible! Identifying the elemental nature of your opponent is the first step toward mastery.",
                        "Each type has a counter: Thermal melts Botanic, Botanic absorbs Osmotic, and Osmotic cools Thermal. // These 1.5x multipliers are the only way to survive the deeper wards."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "The Botanic Sector is a delicate ecosystem. You can't just barge in without a plan! // Have you analyzed the elemental spectrum?",
                    "Every organism here has a specific nature that can be countered. // If you don't know your types, this will be a very short lesson."
                ];
                this.pendingBattleEncounter = 'shopia';
            } else {
                lines = ["Thermal melts Botanic, Botanic absorbs Osmotic, Osmotic cools Thermal. Keep those counters in mind!"];
            }
        } else if (npc.id === 'clips' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = ["Lagging behind? // If a Second Brain isn't enough to save you, maybe you should start looking for a third!"];
                } else {
                    lines = [
                        "Solid processing speed! // Remember, the Second Brain card's presence alone grants you that extra Pellicle slot.",
                        "It allows you to equip a second active skill, giving you much more control over your Pellicle Points (PP) in battle."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "New intern, right? You're entering a sector where one Basic skill just isn't enough to manage the tactical load.",
                    "Have you heard of the 'Second Brain'? // It's a special card that unlocks an additional skill slot. // Let's see if you're ready for that kind of growth!"
                ];
                this.pendingBattleEncounter = 'clips';
            } else {
                lines = ["Equipping a second active skill is a total game-changer. Don't forget to slot your Second Brain card!"];
            }
        } else if (npc.id === 'lustra' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "See that extra damage? That's the Lysis Penalty. // For every point of Negative PP, you take 10% more damage from every hit.",
                        "It's like fighting without a skin!"
                    ];
                } else {
                    lines = [
                        "Risky, but effective! You managed to 'vent' your PP just before your membrane collapsed.",
                        "Remember: every point below zero increases incoming damage by 10%. // If you hit your debt limit, you're taking DOUBLE damage!",
                        "It's called the 'Lysis State'—your cell's structural integrity is compromised."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Be careful—if you push your Cell too hard, it'll literally fall apart. // Most interns think Negative PP is just a number...",
                    "but it's a structural failure waiting to happen. // Want to see what 'Lysis' looks like up close?"
                ];
                this.pendingBattleEncounter = 'lustra';
            } else {
                lines = ["Watch your PP debt! The Lysis penalty is no joke—it'll double the damage you take."];
            }
        } else if (npc.id === 'rattou' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Sloppy! You came in underprepared. // Make sure to stop by the Vending Machine.",
                        "It sells more than just food; you can trade in your excess Biomass for Lab credits, then buy Blueprints for advanced Cells."
                    ];
                } else {
                    lines = [
                        "Delicious work! You've got the hunger. // The Vending Machine here is more than just furniture.",
                        "It’s not just for grabbing a quick bite; use your credits to get stock! // Remember to visit it often."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Hungry for progress, Intern? Cooking's all about preparation. // Have you used the Vending Machine here in the Kitchen?",
                    "It's essential for trading Biomass and acquiring Blueprints. // Let me show you why stayin' stocked is stayin' alive!"
                ];
                this.pendingBattleEncounter = 'rattou';
            } else {
                lines = ["The kitchen's vending machine is your hub for recipes and credits. Don't go hungry out there!"];
            }
        } else if (npc.id === 'ecto' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = ["Diversity is the key to winning, Intern. If you only rely on one type, you'll hit a wall eventually. Go back and synthesize something different."];
                } else {
                    lines = ["Impressive sync. You're ready to use the Cell-Accelerator properly. Just remember: a balanced team is a stable team."];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Hey Intern. You're deep into the labs now. Have you started using the Cell-Accelerator in the Atrium?",
                    "It's where we synthesize new life from collected recipes. // Want a demonstration of what a well-accelerated Cell can do?"
                ];
                this.pendingBattleEncounter = 'ecto';
            } else {
                lines = ["A balanced squad is a stable squad. Don't forget to use the Accelerator to diversify your team!"];
            }
        } else if (npc.id === 'premy' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Listen closely: if you have two of the same Cell, you can merge them at the Bio-extractor.",
                        "It makes them stronger and generates much more Biomass for future research. Don't waste your duplicates!"
                    ];
                } else {
                    lines = [
                        "You've got the spark! Now go use that Bio-extractor. // Remember: merging identical Cells is the secret to power.",
                        "It boosts their stats and gives you a surplus of Biomass."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Welcome to the Human Research Ward! Have you used the Bio-extractor in the Extraction Room yet?",
                    "It's the primary tool for harvesting Biomass and refining your Cell potential. // Let's see if you're ready for the next level!"
                ];
                this.pendingBattleEncounter = 'premy';
            } else {
                lines = ["Merging duplicate cells at the Bio-extractor is the fastest way to build up your biomass reserves."];
            }
        } else if (npc.id === 'yifec' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "MAP Effects are game-changers. For example, EASY TARGET makes any NEAR hit count as a perfect MATCH.",
                        "Or use PERFECT STRIKE for an unavoidable hit where all nodes count as a MATCH. You need to control the field!"
                    ];
                } else {
                    lines = [
                        "Impressive! You handled the field well. // Don't forget MAP Effects like RELIABLE HIT, which forces a NEAR result.",
                        "Or use PUNY SLAP if you need an intentional weak hit—it makes all nodes count as FAR. Knowledge is power!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Mastering basic placement is for interns. True researchers use MAP Effects to manipulate the battlefield.",
                    "These effects give you direct control over your sync results, regardless of how you place your attack. // Ready to see it in action?"
                ];
                this.pendingBattleEncounter = 'yifec';
            } else {
                lines = ["MAP Effects like Perfect Strike can completely ignore placement difficulty. Use them wisely!"];
            }
        } else if (npc.id === 'white' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = ["See? Perfection in PP management and a solid C-Card build. That's how you win—luck has nothing to do with it!"];
                } else {
                    lines = ["Wait... did you just out-manage my PP? Fine, maybe your C-Card strategy was just slightly better... for now!"];
                }
            } else if (!isBattleDone) {
                lines = [
                    "I'm telling you, the MAP system is pure luck! // The real pros win through superior PP management and C-Card strategy.",
                    "Here, I'll prove it by crushing this intern with pure tactical efficiency!"
                ];
                this.pendingBattleEncounter = 'white';
            } else {
                lines = ["PP management is the only logical path to victory. Everything else is just static!"];
            }
        } else if (npc.id === 'cherry' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = ["A beautiful MAP sync! That's the power of the placement system. PP management is just for those who can't aim!"];
                } else {
                    lines = ["Even in defeat, I can see you value the MAP system. That placement was beautiful... even if it did wreck my squad!"];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Nonsense! Placement is everything! // If you can't place it, you can't win. // Intern, show this 'optimizer' that a perfect MAP placement is the true path!"
                ];
                this.pendingBattleEncounter = 'cherry';
            } else {
                lines = ["A perfect match on every node is the mark of a true researcher. Practice your aim!"];
            }
        } else if (npc.id === 'anreal' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Operational failure. You allowed the CHOICEBLOCK to restrict your options until you had nowhere to turn.",
                        "And HURTBLOCK is a double-edged sword—if you use the same node as me, we both lose access to it."
                    ];
                } else {
                    lines = [
                        "Impressive. You navigated the blocks and maintained operational flow. // Remember: CHOICEBLOCK prevents re-selecting used nodes.",
                        "HURTBLOCK disables nodes used by BOTH players. Maneuverability is everything!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "The Director demands 99.9% uptime. To survive at this level, you must navigate operational constraints.",
                    "Specifically, the specialized interference patterns we call BLOCK protocols. // Ready to see how they can paralyze a squad?"
                ];
                this.pendingBattleEncounter = 'anreal';
            } else {
                lines = ["Block protocols are the Director's specialized security layer. Always think two moves ahead!"];
            }
        } else if (npc.id === 'godou' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Calculation error. You ran out of PP for your Pellicle skills when it mattered most.",
                        "Basic Skills cost 0 PP; Pellicle Skills cost life-force. You must cycle them perfectly."
                    ];
                } else {
                    lines = [
                        "Your resource cycling is... statistically significant. // You used Basic Skills to build energy and saved your Pellicle Skills for the strike.",
                        "That's the hallmark of a high-performance researcher."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Data analysis shows most interns waste their biological potential on raw power.",
                    "True tactical efficiency comes from balancing Basic energy-builders with Pellicle-heavy finishers. // Let's stress-test your management."
                ];
                this.pendingBattleEncounter = 'godou';
            } else {
                lines = ["Cycle your basic skills to bank PP for your big finishers. It's simple arithmetic!"];
            }
        } else if (npc.id === 'yunidi' && (lines.length === 1 && lines[0] === "...")) {
            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Operational oversight. You lacked the high-tier synergy needed to bypass my Perk's influence.",
                        "Leader Perks are the foundation of an elite squad. Without a Perk, you're just a statistic."
                    ];
                } else {
                    lines = [
                        "A victory against the Executive Suite... statistically improbable, yet here you are.",
                        "You must have a powerful Leader Perk of your own to have survived that. // Tier L cards are the true keys to power!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Director Capsain doesn't hire assistants; he hires strategic advantages.",
                    "The true elite operate through Leader Perks—passive Tier L cards that rewrite the laws of the sync. // Ready for a Perks build?"
                ];
                this.pendingBattleEncounter = 'yunidi';
            } else {
                lines = ["Leader Perks grant passive advantages that override standard battle rules. Never go into the suite without one!"];
            }
        } else if (lines.length === 1 && lines[0] === "...") {
            // Generic Staff Randomizer (Dynamic Lookup based on currentZone)
            const activePool = this.randomPools[this.currentZone] || this.randomPools.atrium;
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
        activeMonsters: [], // Array of { id, despawnTimer }
        spawnTimer: null,
        allowedZones: ['atrium', 'botanic', 'human', 'executive', 'specimenStorage', 'kitchen', 'storage', 'entertainment', 'ancientBotany', 'preservationRoom', 'library', 'cellPlayGround'],

        start() {
            if (!this.allowedZones.includes(Overworld.currentZone)) return;
            if (this.spawnTimer) return;
            const zone = Overworld.zones[Overworld.currentZone];
            const maxSpawns = (zone && zone.maxWildSpawns) || 1;
            // Immediate spawn for playgrounds/high-capacity rooms
            this.startCooldown(maxSpawns > 1 ? 200 : null);
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
                zone.objects = zone.objects.filter(obj => !obj.temp);
            }
        },

        startCooldown(customDelay = null) {
            if (this.spawnTimer) clearTimeout(this.spawnTimer);
            // Default 5-15s delay, or custom if provided
            const delay = customDelay !== null ? customDelay : 5000 + (Math.random() * 10000);
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

            // --- NEW: Weighted Spawn Pool System ---
            const monsterIds = ['stemmy', 'nitrophil', 'cambihil', 'lydrosome'];
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
                monsterRecord.despawnTimer = setTimeout(() => this.despawnMonster(monsterId), 15000 + Math.random() * 10000);
            }

            // If we still have room for more, trigger next spawn sooner (1.0s)
            if (currentWildCount + 1 < maxSpawns) {
                this.startCooldown(1000);
            } else {
                this.startCooldown();
            }
        },

        despawnMonster(monsterId) {
            const mRecord = this.activeMonsters.find(m => m.id === monsterId);
            if (!mRecord) return;

            const el = document.getElementById(`npc-${monsterId}`);
            if (el) {
                el.classList.remove('anim-monster-breathing', 'anim-monster-pop');
                el.classList.add('anim-recall-exit');
            }

            setTimeout(() => {
                const zone = Overworld.zones[Overworld.currentZone];
                if (zone && zone.objects) {
                    zone.objects = zone.objects.filter(obj => obj.id !== monsterId);
                }
                this.activeMonsters = this.activeMonsters.filter(m => m.id !== monsterId);
                if (el && el.parentNode) el.remove();

                // Trigger cooldown to eventually replace the despawned monster
                this.startCooldown();
            }, 400);
        }
    },

    kickObject(obj, dx, dy) {
        if (this.isTransitioning || this.isPaused || obj.isKicking) return;
        obj.isKicking = true;

        const el = document.getElementById(`npc-${obj.id}`);
        if (!el) return;

        const zone = this.zones[this.currentZone];
        if (!zone) return;

        // --- Proximity-Linkage for Multi-tile Furniture ---
        const parts = [obj];
        const suffixMatch = obj.id.match(/_([a-zA-Z0-9]+)$/);
        if (suffixMatch && obj.type === 'prop') {
            const suffix = suffixMatch[1];
            const prefix = obj.id.split('_')[0];

            // Known Linked Furniture Sets (Top+Bottom or Large Multi-parts)
            const linkedSets = [
                ['f20', 'f21'], ['f22', 'f23'], ['f24', 'f25'],
                ['f28', 'f29'], ['f30', 'f31'], ['f32', 'f33'],
                ['f61', 'f62'], ['f76', 'f77', 'f78', 'f79'],
                ['f38', 'f39', 'f40', 'f41'],
                ['f42', 'f43', 'f44', 'f45', 'f46', 'f47'],
                ['f52', 'f53', 'f54', 'f55']
            ];

            const mySet = linkedSets.find(set => set.includes(prefix));

            const linked = zone.objects.filter(o => {
                if (o.id === obj.id || !o.id.endsWith(`_${suffix}`)) return false;
                const oPrefix = o.id.split('_')[0];

                // Only link if they are in the same known set OR share the same base ID (prefix)
                const isSameSet = mySet ? mySet.includes(oPrefix) : (oPrefix === prefix);
                if (!isSameSet) return false;

                // Final proximity check (1 tile radius)
                return Math.abs(o.x - obj.x) <= 1 && Math.abs(o.y - obj.y) <= 1;
            });

            linked.forEach(o => {
                o.isKicking = true;
                parts.push(o);
            });
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
        else if (dist <= 3) {
            if (roll < 10) { isHomeRun = true; choice = 'front'; }
            else if (roll < 40) choice = 'left';
            else if (roll < 70) choice = 'right';
            else choice = 'front';
        } else if (dist <= 6) {
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
                pEl.classList.remove('anim-monster-breathing', 'anim-monster-pop', 'anim-monster-shake');
                void pEl.offsetWidth;
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
            if (zone && zone.objects) {
                // Permanently remove NPCs (Wild Monsters); leave Props in the array to be reset on zone change
                zone.objects = zone.objects.filter(o => o.type !== 'npc' || !partIds.includes(o.id));
            }
            if (this.spawner && this.spawner.activeMonsters) {
                this.spawner.activeMonsters = this.spawner.activeMonsters.filter(m => !partIds.includes(m.id));
            }

            parts.forEach((p) => {
                const pEl = document.getElementById(`npc-${p.id}`);
                if (!pEl) return;

                pEl.classList.remove('anim-monster-shake');
                void pEl.offsetWidth;
                pEl.style.zIndex = 9999;
                pEl.style.willChange = 'transform, opacity';

                const spinMult = isHomeRun ? 4 : 1;
                const totalSpin = (Math.random() * 660 + 60) * spinMult * (directionKey === 'l' ? -1 : 1);
                pEl.style.setProperty('--kick-spin', `${totalSpin}deg`);

                const animClass = isHomeRun ? `anim-monster-kick-homerun-${directionKey}` : `anim-monster-kick-${directionKey}`;
                pEl.classList.add(animClass);

                if (isHomeRun && (p.id === obj.id || p.type === 'npc')) {
                    this.triggerHomeRunEffects(p, pEl, directionKey);
                }

                setTimeout(() => { if (pEl.parentNode) pEl.parentNode.removeChild(pEl); }, 2000);
            });

            if (obj.type === 'npc' && obj.monsterId) {
                this.updateQuestProgress('kick', obj.monsterId + '_wild');
                if (this.spawner) this.spawner.startCooldown(zone.maxWildSpawns > 1 ? 500 : null);
            }
        }, hitStopTime);
    },

    triggerHomeRunEffects(obj, el, directionKey) {
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

    spawnHomerunParticles(curX, curY, width, height, directionKey) {
        const mapEl = document.getElementById('overworld-map');
        let emitX = curX + width / 2;
        let emitY = curY + height / 2;

        const energyColors = ['#ff4d4d', '#4dff88', '#4db8ff'];
        const driftX = (directionKey === 'l' ? 20 : (directionKey === 'r' ? -20 : (Math.random() - 0.5) * 40));
        const driftY = (directionKey === 'u' ? 20 : (directionKey === 'f' ? -20 : (Math.random() - 0.5) * 40));

        for (let i = 0; i < 2; i++) {
            const puff = document.createElement('div');
            puff.className = 'smoke-plume-puff';
            puff.style.left = emitX + 'px';
            puff.style.top = emitY + 'px';
            puff.style.setProperty('--drift-x', `${driftX}px`);
            puff.style.setProperty('--drift-y', `${driftY}px`);
            puff.style.setProperty('--spark-color', energyColors[Math.floor(Math.random() * 3)]);

            const size = 15 + Math.random() * 25;
            const dot = document.createElement('span');
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            puff.appendChild(dot);
            mapEl.appendChild(puff);
            setTimeout(() => { if (puff.parentNode) puff.parentNode.removeChild(puff); }, 500);

            if (Math.random() < 0.3) {
                const spark = document.createElement('div');
                spark.className = 'thruster-spark';
                spark.style.left = emitX + 'px';
                spark.style.top = emitY + 'px';
                spark.style.setProperty('--spark-color', energyColors[Math.floor(Math.random() * 3)]);
                mapEl.appendChild(spark);
                setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 300);
            }
        }
    },

    spawnFootstep(x, y, isSprinting = false) {
        const mapEl = document.getElementById('overworld-map');
        if (!mapEl) return;

        const puff = document.createElement('div');
        puff.className = 'footstep-puff';

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
    }
};

window.Overworld = Overworld;

