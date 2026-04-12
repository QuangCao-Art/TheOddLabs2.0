/**
 * Registry of Furniture Metadata and Templates
 * furnitureMetadata: Defines physical properties and lore for objects.
 * FURNITURE_TEMPLATES: Defines how multi-tile objects are constructed in Builder Mode.
 */

export const furnitureMetadata = {
    // --- TILESET 02 (f0-f63) ---
    'f0': { name: 'Chair', hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
    'f1': { name: 'Chair', hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
    'f2': { name: 'Chair', hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
    'f3': { name: 'Single Table', hasCollision: true, info: "Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee." },
    'f4': { name: 'Working Table', hasCollision: true, info: "So sturdy it once survived a localized gravity collapse. The equipment on it didn't." },
    'f5': { name: 'Working Table', hasCollision: true, info: "So sturdy it once survived a localized gravity collapse. The equipment on it didn't." },
    'f6': { name: 'Evolution Poster', hasCollision: true, info: "A poster showing the evolution of Cells. Sadly, the dev lacked resources to implement these." },
    'f7': { name: 'Compute Station', hasCollision: true, info: "Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history." },
    'f8': { name: 'Chemical Station', hasCollision: true, info: "Do not shake. Do not stir. In fact, just don't even look at it too hard." },
    'f9': { name: 'Sequencer Station', hasCollision: true, info: "A protein sequencer that occasionally plays elevator music when it's bored." },
    'f11': { name: 'Research Table', hasCollision: true, material: 'wood', info: "A table usually surrounded by people arguing about whose lunch is missing from the fridge." },
    'f12': { name: 'Research Table', hasCollision: true, material: 'wood', info: "A table usually surrounded by people arguing about whose lunch is missing from the fridge." },
    'f13': { name: 'Green Specimen Tank', hasCollision: false, material: 'glass', info: "This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE." },
    'f14': { name: 'Green Specimen Tank', hasCollision: true, material: ['glass', 'liquid'], info: "This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE." },
    'f15': { name: 'Blue Specimen Tank', hasCollision: false, material: 'glass', info: ["Why did the cold specimen refuse to talk?", "Because it had Absolute Zero interest in you."] },
    'f16': { name: 'Blue Specimen Tank', hasCollision: true, material: ['glass', 'liquid'], info: ["Why did the cold specimen refuse to talk?", "Because it had Absolute Zero interest in you."] },
    'f17': { name: 'Species Poster', hasCollision: true, info: "A poster showing three creature races. Or perhaps they aren't simply 'races'..." },
    'f18': { name: 'Biolumin Plant', hasCollision: false, info: "Looks like a plant, smells like old gym socks. Science still isn't sure why." },
    'f19': { name: 'Biolumin Plant', hasCollision: true, info: "Looks like a plant, smells like old gym socks. Science still isn't sure why." },
    'f20': { name: 'Camitea Plant', hasCollision: false, info: "Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship." },
    'f21': { name: 'Camitea Plant', hasCollision: true, info: "Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship." },
    'f22': { name: 'Red Specimen Tank', hasCollision: false, material: 'glass', info: "The specimen here is slowly swimming; why are its surroundings turning yellow?" },
    'f23': { name: 'Red Specimen Tank', hasCollision: true, material: ['glass', 'liquid'], info: "The specimen here is slowly swimming; why are its surroundings turning yellow?" },
    'f24': { name: 'Igni Plant', hasCollision: false, material: 'glass', info: "The leaves are glowing. It might be happy, or it might be preparing for ignition." },
    'f25': { name: 'Igni Plant', hasCollision: true, material: ['glass', 'liquid'], info: "The leaves are glowing. It might be happy, or it might be preparing for ignition." },
    'f26': { name: 'Analysis Table', hasCollision: true, material: 'wood', info: "Reserved for 'The Important People'. Includes a built-in panic button." },
    'f27': { name: 'Analysis Table', hasCollision: true, material: 'wood', info: "Reserved for 'The Important People'. Includes a built-in panic button." },
    'f28': { name: 'Leader Table', hasCollision: true, material: 'wood', info: "Features a secret drawer for hiding snacks from the interns." },
    'f29': { name: 'Leader Table', hasCollision: true, material: 'wood', info: "Features a secret drawer for hiding snacks from the interns." },
    'f30': { name: 'Director Table', hasCollision: true, material: 'glass', info: "Carved from obsidian glass. Legend says the Director actually sleeps under it." },
    'f31': { name: 'Director Table', hasCollision: true, material: 'glass', info: "Carved from obsidian glass. Legend says the Director actually sleeps under it." },
    'f32': { name: 'Medical Pod', hasCollision: true, info: "A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days." },
    'f33': { name: 'Medical Pod', hasCollision: true, info: "A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days." },
    'f34': { name: 'Anatomical Model', hasCollision: false, material: ['bone', 'metal'], info: "A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised." },
    'f35': { name: 'Anatomical Model', hasCollision: true, kickable: true, material: ['bone', 'metal'], info: "A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised." },
    'f36': { name: 'Noodle Table', hasCollision: true, info: "Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions." },
    'f37': { name: 'Empty Noodle Bowl', hasCollision: true, kickable: true, material: 'plastic', info: "An empty bowl. The salt levels within are high enough to preserve a whole lab tech." },
    'f38': { name: 'Healing Incubator', hasCollision: false, triggerHeal: true, info: "Incubator Unit-01: [STATION READY]" },
    'f39': { name: 'Healing Incubator', hasCollision: false, triggerHeal: true, info: "Incubator Unit-02: [STATION READY]" },
    'f40': { name: 'Healing Incubator', hasCollision: true, triggerHeal: true, info: "Incubator Unit-03: [STATION READY]" },
    'f41': { name: 'Healing Incubator', hasCollision: true, triggerHeal: true, info: "Incubator Unit-04: [STATION READY]" },
    'f42': { name: 'Bio-Extractor', hasCollision: false, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
    'f43': { name: 'Bio-Extractor', hasCollision: false, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
    'f44': { name: 'Bio-Extractor', hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
    'f45': { name: 'Bio-Extractor', hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
    'f46': { name: 'Bio-Extractor', hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
    'f47': { name: 'Bio-Extractor', hasCollision: true, triggerBioExtract: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
    'f48': { name: 'Large Box', hasCollision: true, kickable: true, material: 'carton', info: "Labeled: 'DO NOT SHAKE'." },
    'f49': { name: 'Server Rack', hasCollision: true, info: "Mostly contains encrypted logs, but some files are just high-score records for 'Snake'." },
    'f50': { name: 'Old Keycard', hasCollision: true, info: "A magnetic keycard. Smells like the Director's expensive cologne." },
    'f51': { name: 'Inferno Sauce', hasCollision: true, info: "Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal." },
    'f52': { name: 'Large Cabinet', hasCollision: false, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
    'f53': { name: 'Large Cabinet', hasCollision: false, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
    'f54': { name: 'Large Cabinet', hasCollision: true, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
    'f55': { name: 'Large Cabinet', hasCollision: true, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
    'f56': { name: 'Senior Table', hasCollision: false, info: '"Why do all the tables have to be this messy?" asked the janitor.' },
    'f57': { name: 'Senior Table', hasCollision: true, info: '"Why do all the tables have to be this messy?" asked the janitor.' },
    'f58': { name: 'Supply Cabinet', hasCollision: true, info: "I can see the little cockroaches crawling out!" },
    'f59': { name: 'Young Plant', hasCollision: true, kickable: true, material: 'plastic', info: "Looks like a normal plant... or is it?" },
    'f60': { name: 'Carton Box', hasCollision: true, kickable: true, material: 'carton', info: "This box is heavier than it looks." },
    'f61': { name: 'Box Pile', hasCollision: false, info: "Please don't fall on my head" },
    'f62': { name: 'Box Pile', hasCollision: true, kickable: true, material: 'carton', info: "Please don't fall on my head" },
    'f63': { name: 'Ultimate Rare Card', hasCollision: true, info: "This is the best ultimate super rare card ever!" },

    // --- TILESET 03 (f64+) ---
    'f64': { name: 'Ancient Floppy', hasCollision: true, info: "Ancient people used this to store data!" },
    'f65': { name: 'Stasis Pod', hasCollision: true, info: "Whatever is lying here doesn't look exactly human; it'd better be!" },
    'f66': { name: 'Stasis Pod', hasCollision: true, info: "Whatever is lying here doesn't look exactly human; it'd better be!" },
    'f67': { name: 'Vending Machine', hasCollision: false, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
    'f68': { name: 'Vending Machine', hasCollision: false, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
    'f69': { name: 'Vending Machine', hasCollision: true, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
    'f70': { name: 'Vending Machine', hasCollision: true, triggerShop: true, info: "ODD-VEND TERMINAL: [ACQUIRE/LIQUIDATE PROTOCOLS ACTIVE]" },
    'f71': { name: 'Battle Table', hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
    'f72': { name: 'Battle Table', hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
    'f73': { name: 'Battle Table', hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
    'f74': { name: 'Battle Table', hasCollision: true, info: "An official device for Cell battles, though researchers strangely prefer using their lunch tables instead." },
    'f75': { name: 'Collectible Cards', hasCollision: true, info: "Just collect them all!" },
    'f76': { name: 'Bookshelf', hasCollision: false, info: "These books are surprisingly well preserved!" },
    'f77': { name: 'Bookshelf', hasCollision: false, info: "These books are surprisingly well preserved!" },
    'f78': { name: 'Bookshelf', hasCollision: true, info: "These books are surprisingly well preserved!" },
    'f79': { name: 'Bookshelf', hasCollision: true, info: "These books are surprisingly well preserved!" },
    'f80': { name: 'Grand Cryo Pod', hasCollision: false, info: "Stay cool—we'll be out in a century or two." },
    'f81': { name: 'Grand Cryo Pod', hasCollision: false, info: "Stay cool—we'll be out in a century or two." },
    'f82': { name: 'Grand Cryo Pod', hasCollision: true, info: "Stay cool—we'll be out in a century or two." },
    'f83': { name: 'Grand Cryo Pod', hasCollision: true, info: "Stay cool—we'll be out in a century or two." },
    'f84': { name: 'Deep Freeze Pod', hasCollision: true, info: "Whatever is kept inside is in a deep freeze state!" },
    'f85': { name: 'Deep Freeze Pod', hasCollision: true, info: "Whatever is kept inside is in a deep freeze state!" },
    'f86': { name: 'Healthy Ancient Plant', hasCollision: false, info: "People are trying to bring this ancient plant back; sometimes it's a success!" },
    'f87': { name: 'Healthy Ancient Plant', hasCollision: true, info: "People are trying to bring this ancient plant back; sometimes it's a success!" },
    'f88': { name: 'Wither Ancient Plant', hasCollision: false, info: "People are trying to bring this ancient plant back; sometimes it's a failure!" },
    'f89': { name: 'Wither Ancient Plant', hasCollision: true, info: "People are trying to bring this ancient plant back; sometimes it's a failure!" },
    'f90': { name: 'Official Employee Card', hasCollision: true, info: "You are now a truly member of the pack!" },
    'f91': { name: 'Empty Pot', hasCollision: true, info: "A ceramic pot filled with special fertile soil. If you listen closely, you can hear the worms throwing a tiny rave in there." },
    'f92': { name: 'Cell Accelerator', hasCollision: false, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f93': { name: 'Cell Accelerator', hasCollision: false, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f94': { name: 'Cell Accelerator', hasCollision: false, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f95': { name: 'Cell Accelerator', hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f96': { name: 'Cell Accelerator', hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f97': { name: 'Cell Accelerator', hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f98': { name: 'Cell Accelerator', hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f99': { name: 'Cell Accelerator', hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f100': { name: 'Cell Accelerator', hasCollision: true, info: "They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven." },
    'f101': { name: 'Cell Blueprint', hasCollision: true, info: "Contains the complex genomic blueprint of a Cell. It's essentially the ultimate 'cheat sheet' for biological reconstruction." },
    'f102': { name: 'Biomass Container', hasCollision: true, info: "A container of stabilized raw biological material. It smells faintly of damp earth and limitless potential." },
    'f103': { name: 'Petry Dish', hasCollision: true, info: "An oversized cultivation dish designed for Cell. It's climate-controlled and remarkably soft—essentially a luxury suite for a Cell." },
    'f104': { name: 'Lab Credits', hasCollision: true, info: "An internal currency chip exclusive to Labs. What started as a corporate joke became the only way to pay for the 'premium' noodles." },
    'f105': { name: 'Warning Sign', hasCollision: true, kickable: true, material: 'plastic', info: "Nothing can stop me, even when the sign says so." },
    'f106': { name: 'Warning Sign', hasCollision: true, kickable: true, material: 'plastic', info: "Nothing can stop me; turning the sign sideways won't help." },
    'f107': { name: 'Mr-Slim', hasCollision: false, kickable: true, material: 'bone', info: "This skeleton robot has an auto-assemble function; otherwise, it's a real mess." },
    'f108': { name: 'Mr-Slim', hasCollision: true, kickable: true, material: 'bone', info: "This skeleton robot has an auto-assemble function; otherwise, it's a real mess." },
    'f109': { name: 'Huge Two-Story Petry Dish', hasCollision: false, info: "An oversized cultivation dish designed for Cells. It's the same model used in the main lab, but standing two stories tall." },
    'f110': { name: 'Huge Two-Story Petry Dish', hasCollision: true, info: "An oversized cultivation dish designed for Cells. It's the same model used in the main lab, but standing two stories tall." },
    'f111': { name: 'Mobile Monitor Cabinet', hasCollision: false, info: "A mobile cabinet equipped with a monitor screen, for those who want to keep an eye on their stuff... all the time!" },
    'f112': { name: 'Mobile Monitor Cabinet', hasCollision: true, info: "A mobile cabinet equipped with a monitor screen, for those who want to keep an eye on their stuff... all the time!" },
    'f113': { name: 'Empty Specimen Tank', hasCollision: false, info: "An empty specimen tank. Its occupants seem to have... moved on." },
    'f114': { name: 'Empty Specimen Tank', hasCollision: true, info: "An empty specimen tank. Its occupants seem to have... moved on." },
    'f115': { name: 'Weathered Specimen Tank', hasCollision: false, breakable: true, material: 'glass', breaksInto: 'TANK_BROKEN', info: "A weathered, antique tank. Its glass is thick and yellowed, hinting at a long history of questionable experiments." },
    'f116': { name: 'Weathered Specimen Tank', hasCollision: true, breakable: true, material: 'glass', breaksInto: 'TANK_BROKEN', info: "A weathered, antique tank. Its glass is thick and yellowed, hinting at a long history of questionable experiments." },
    'f117': { name: 'Cracked Specimen Tank', hasCollision: false, breakable: true, material: 'glass', breaksInto: 'TANK_SHATTERED', info: "A fragile tank covered in fractures, even a sneeze can take it down!" },
    'f118': { name: 'Cracked Specimen Tank', hasCollision: true, breakable: true, material: 'glass', breaksInto: 'TANK_SHATTERED', info: "A fragile tank covered in fractures, even a sneeze can take it down!" },
    'f119': { name: 'Shattered Tank Remains', hasCollision: true, info: "Jagged glass shards and a rusted frame. Leave it to the cleaning crew; your fingers will thank you." },
    'f120': { name: 'Broken Tank Debris', hasCollision: true, kickable: true, material: 'glass', info: "Fragmented remains of a tank. Oddly lightweight for its size." },
    'f121': { name: 'Loose Tank Lid', hasCollision: true, breakable: true, material: 'metal', breaksInto: 'LIDSTEMMY_DEBRIS', info: "A common tank lid. It doesn't seem to be sealed properly; someone might have left it untightened." },
    'f122': { name: 'Stemmy Home Lid', hasCollision: true, kickable: true, material: 'metal', info: "A tank lid with a small, unpowered Stemmy clinging to it. It seems to have found a cozy spot." },
    'f123': { name: 'Broken Tank Lid', hasCollision: true, breakable: true, material: 'metal', breaksInto: 'LID_DEBRIS', info: "A heavily dented and cracked tank lid. One good stomp will likely finish it off." },
    'f124': { name: 'Mangled Tank Lid', hasCollision: true, kickable: true, material: 'metal', info: "A mangled piece of metal that used to be a tank lid. It's completely beyond repair." },

    // --- ENCOUNTER CELLS ---
    'c0': { name: 'Stemmy', hasCollision: true, info: "A wild Stemmy is wandering." },
    'c1': { name: 'Cambihil', hasCollision: true, info: "A wild Cambihil is looking for leaf." },
    'c2': { name: 'Lydrosome', hasCollision: true, info: "A wild Lydrosome is watching a lab tube." },
    'c3': { name: 'Nitrophil', hasCollision: true, info: "A wild Nitrophil is searching for food." },
};

export const FURNITURE_TEMPLATES = {
    // --- CHAIRS (1x1) ---
    CHAIR_A_L: { name: 'Chair', tiles: [{ id: 'f0', relX: 0, relY: 0 }] },
    CHAIR_A_R: { name: 'Chair', tiles: [{ id: 'f1', relX: 0, relY: 0 }] },
    CHAIR_A_F: { name: 'Chair', tiles: [{ id: 'f2', relX: 0, relY: 0 }] },

    // --- TABLES (1x1 and 2x1) ---
    TABLE_A: { name: 'Single Table', tiles: [{ id: 'f3', relX: 0, relY: 0 }] },
    TABLE_B: {
        name: 'Working Table',
        tiles: [
            { id: 'f4', relX: 0, relY: 0, name: 'Left' },
            { id: 'f5', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_COMPUTER: { name: 'Compute Station', tiles: [{ id: 'f7', relX: 0, relY: 0 }] },
    TABLE_CYLINDERS: { name: 'Chemical Station', tiles: [{ id: 'f8', relX: 0, relY: 0 }] },
    TABLE_DEVICE: { name: 'Sequencer Station', tiles: [{ id: 'f9', relX: 0, relY: 0 }] },
    TABLE_C: {
        name: 'Research Table',
        tiles: [
            { id: 'f12', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f11', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    TABLE_D: {
        name: 'Analysis Table',
        tiles: [
            { id: 'f26', relX: 0, relY: 0, name: 'Left' },
            { id: 'f27', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_LEADER: {
        name: 'Leader Table',
        tiles: [
            { id: 'f28', relX: 0, relY: 0, name: 'Left' },
            { id: 'f29', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_DIRECTOR: {
        name: 'Director Table',
        tiles: [
            { id: 'f30', relX: 0, relY: 0, name: 'Left' },
            { id: 'f31', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_LEADER_B: {
        name: 'Senior Table',
        tiles: [
            { id: 'f57', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f56', relX: 0, relY: -1, name: 'Top' }
        ]
    },

    // --- TANKS & SPECIMENS (1x2 Stacks) ---
    TANK_GREEN: {
        name: 'Green Specimen Tank',
        tiles: [
            { id: 'f14', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f13', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_BLUE: {
        name: 'Blue Specimen Tank',
        tiles: [
            { id: 'f16', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f15', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_RED: {
        name: 'Red Specimen Tank',
        tiles: [
            { id: 'f23', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f22', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    HEALTHY_PLANT: {
        name: 'Healthy Ancient Plant',
        tiles: [
            { id: 'f87', relX: 0, relY: 0, name: 'Plant Base' },
            { id: 'f86', relX: 0, relY: -1, name: 'Plant Top' }
        ]
    },
    DEAD_PLANT: {
        name: 'Wither Ancient Plant',
        tiles: [
            { id: 'f89', relX: 0, relY: 0, name: 'Plant Base' },
            { id: 'f88', relX: 0, relY: -1, name: 'Plant Top' }
        ]
    },

    // --- PLANTS (1x2 Stacks) ---
    PLANT_A: {
        name: 'Biolumin Plant',
        tiles: [
            { id: 'f19', relX: 0, relY: 0, name: 'Pot' },
            { id: 'f18', relX: 0, relY: -1, name: 'Leaves' }
        ]
    },
    PLANT_B: {
        name: 'Camitea Plant',
        tiles: [
            { id: 'f21', relX: 0, relY: 0, name: 'Pot' },
            { id: 'f20', relX: 0, relY: -1, name: 'Leaves' }
        ]
    },
    PLANT_C: {
        name: 'Igni Plant',
        tiles: [
            { id: 'f25', relX: 0, relY: 0, name: 'Pot' },
            { id: 'f24', relX: 0, relY: -1, name: 'Leaves' }
        ]
    },
    POT_PLANT_SMALL: { name: 'Young Plant', tiles: [{ id: 'f59', relX: 0, relY: 0 }] },
    EMPTY_POT: { name: 'Empty Pot', tiles: [{ id: 'f91', relX: 0, relY: 0 }] },

    // --- EQUIPMENT (Large Clusters) ---
    CABINET_BIG: {
        name: 'Large Cabinet',
        tiles: [
            { id: 'f54', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f55', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f52', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f53', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    INCUBATOR: {
        name: 'Healing Incubator',
        tiles: [
            { id: 'f40', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f41', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f38', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f39', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    VENDING_MACHINE: {
        name: 'Vending Machine',
        tiles: [
            { id: 'f69', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f70', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f67', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f68', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    BATTLE_MACHINE: {
        name: 'Battle Table',
        tiles: [
            { id: 'f73', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f74', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f71', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f72', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    BOOKSHELF_BIG: {
        name: 'Bookshelf',
        tiles: [
            { id: 'f78', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f79', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f76', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f77', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    CRYO_POD_BIG: {
        name: 'Grand Cryo Pod',
        tiles: [
            { id: 'f82', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f83', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f80', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f81', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    STORAGE_POD_FROZEN: {
        name: 'Deep Freeze Pod',
        tiles: [
            { id: 'f85', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f84', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    BED_A: {
        name: 'Medical Sleep Bed',
        tiles: [
            { id: 'f32', relX: 0, relY: 0, name: 'Left' },
            { id: 'f33', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    BIO_EXTRACTOR: {
        name: 'Bio Extractor',
        tiles: [
            { id: 'f46', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f47', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f44', relX: 0, relY: -1, name: 'Mid Left' },
            { id: 'f45', relX: 1, relY: -1, name: 'Mid Right' },
            { id: 'f42', relX: 0, relY: -2, name: 'Top Left' },
            { id: 'f43', relX: 1, relY: -2, name: 'Top Right' }
        ]
    },
    CELL_ACCELERATOR: {
        name: 'Cell Accelerator',
        tiles: [
            { id: 'f98', relX: 0, relY: 0, name: 'BL' },
            { id: 'f99', relX: 1, relY: 0, name: 'BM' },
            { id: 'f100', relX: 2, relY: 0, name: 'BR' },
            { id: 'f95', relX: 0, relY: -1, name: 'ML' },
            { id: 'f96', relX: 1, relY: -1, name: 'MM' },
            { id: 'f97', relX: 2, relY: -1, name: 'MR' },
            { id: 'f92', relX: 0, relY: -2, name: 'TL' },
            { id: 'f93', relX: 1, relY: -2, name: 'TM' },
            { id: 'f94', relX: 2, relY: -2, name: 'TR' }
        ]
    },

    // --- DECOR & UTILITY (Stacks) ---
    BOX_PILE: {
        name: 'Stacked Carton Box',
        tiles: [
            { id: 'f62', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f61', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    CRYO_POD: {
        name: 'Storage Cryo Pod',
        tiles: [
            { id: 'f65', relX: 0, relY: 0, name: 'Left' },
            { id: 'f66', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    SKELETON: {
        name: 'Ms-Slim',
        tiles: [
            { id: 'f35', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f34', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    BOX_HAND: { name: 'Hand Box', tiles: [{ id: 'f48', relX: 0, relY: 0 }] },
    SMALL_BOX: { name: 'Carton Box', tiles: [{ id: 'f60', relX: 0, relY: 0 }] },
    SMALL_CABINET: { name: 'Small Cabinet', tiles: [{ id: 'f58', relX: 0, relY: 0 }] },
    NOODLE_TABLE: { name: 'Noodle Table', tiles: [{ id: 'f36', relX: 0, relY: 0 }] },
    NOODLE_BOWL: { name: 'Empty Noodle Bowl', tiles: [{ id: 'f37', relX: 0, relY: 0 }] },
    WALL_HANGING_A: { name: 'Evolution Poster', tiles: [{ id: 'f6', relX: 0, relY: 0 }] },
    WALL_HANGING_B: { name: 'Species Poster', tiles: [{ id: 'f17', relX: 0, relY: 0 }] },
    WARNING_SIGN_FRONT: { name: 'Warning Sign', tiles: [{ id: 'f105', relX: 0, relY: 0 }] },
    WARNING_SIGN_SIDE: { name: 'Warning Sign', tiles: [{ id: 'f106', relX: 0, relY: 0 }] },
    HUGE_PETRI_DISH_SINGLE: { name: 'Huge Petry Dish', tiles: [{ id: 'f103', relX: 0, relY: 0 }] },

    // --- KEY ITEMS ---
    ITEM_DATAPAD: { name: 'Datapad', tiles: [{ id: 'f49', relX: 0, relY: 0 }] },
    ITEM_ROOMKEY: { name: 'Old Keycard', tiles: [{ id: 'f50', relX: 0, relY: 0 }] },
    ITEM_SAUCE: { name: 'Inferno Sauce Bottle', tiles: [{ id: 'f51', relX: 0, relY: 0 }] },
    ITEM_COLLECTIBLE: { name: 'Collectible Cards', tiles: [{ id: 'f75', relX: 0, relY: 0 }] },
    ITEM_DATASTICK: { name: 'Old Data Stick', tiles: [{ id: 'f64', relX: 0, relY: 0 }] },
    ITEM_EMPLOYEE_CARD: { name: 'Official Employee Card', tiles: [{ id: 'f90', relX: 0, relY: 0 }] },
    ITEM_SECRET: { name: 'Ultimate Rare Card', tiles: [{ id: 'f63', relX: 0, relY: 0 }] },
    ITEM_BLUEPRINT: { name: 'Cell Blueprint', tiles: [{ id: 'f101', relX: 0, relY: 0 }] },
    ITEM_BIOMASS: { name: 'Biomass Container', tiles: [{ id: 'f102', relX: 0, relY: 0 }] },
    ITEM_CREDIT: { name: 'Lab Credit Chip', tiles: [{ id: 'f104', relX: 0, relY: 0 }] },
    MR_SLIM: {
        name: 'Mr-Slim',
        tiles: [
            { id: 'f108', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f107', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    HUGE_PETRY_DISH: {
        name: 'Huge Two-Story Petry Dish',
        tiles: [
            { id: 'f110', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f109', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    MOBILE_MONITOR_CABINET: {
        name: 'Mobile Monitor Cabinet',
        tiles: [
            { id: 'f112', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f111', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    TANK_EMPTY: {
        name: 'Empty Specimen Tank',
        tiles: [
            { id: 'f114', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f113', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_OLD: {
        name: 'Weathered Specimen Tank',
        tiles: [
            { id: 'f116', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f115', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_CRACKED: {
        name: 'Cracked Specimen Tank',
        tiles: [
            { id: 'f118', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f117', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_SHATTERED: {
        name: 'Shattered Tank Remains',
        tiles: [{ id: 'f119', relX: 0, relY: 0 }]
    },
    TANK_BROKEN: {
        name: 'Broken Tank Debris',
        tiles: [{ id: 'f120', relX: 0, relY: 0 }]
    },
    TANK_LID_LOOSE: {
        name: 'Loose Tank Lid',
        tiles: [{ id: 'f121', relX: 0, relY: 0 }]
    },
    LIDSTEMMY_DEBRIS: {
        name: 'Stemmy Home Lid',
        tiles: [{ id: 'f122', relX: 0, relY: 0 }]
    },
    TANK_LID_BROKEN: {
        name: 'Broken Tank Lid',
        tiles: [{ id: 'f123', relX: 0, relY: 0 }]
    },
    LID_DEBRIS: {
        name: 'Mangled Tank Lid',
        tiles: [{ id: 'f124', relX: 0, relY: 0 }]
    }
};

export const TERRAIN_PALETTE = [
    { id: 13, name: 'Floor (Basic)' },
    { id: 12, name: 'Empty Fill' },
    // --- Walls (Outer) ---
    { id: 8, name: 'Wall Edge (Top)' },
    { id: 9, name: 'Wall Edge (Bottom)' },
    { id: 10, name: 'Wall Edge (Left)' },
    { id: 11, name: 'Wall Edge (Right)' },
    // --- Wall Centers ---
    { id: 14, name: 'Wall Center (Top)' },
    { id: 15, name: 'Wall Center (Bottom)' },
    { id: 16, name: 'Wall Left (Top)' },
    { id: 17, name: 'Wall Left (Bottom)' },
    { id: 18, name: 'Wall Right (Top)' },
    { id: 19, name: 'Wall Right (Bottom)' },
    // --- Corners (Outer) ---
    { id: 0, name: 'Corner (TL)' },
    { id: 1, name: 'Corner (TR)' },
    { id: 2, name: 'Corner (BL)' },
    { id: 3, name: 'Corner (BR)' },
    // --- Corners (Inner) ---
    { id: 4, name: 'Inner Corner (TL)' },
    { id: 5, name: 'Inner Corner (TR)' },
    { id: 6, name: 'Inner Corner (BL)' },
    { id: 7, name: 'Inner Corner (BR)' },
    // --- Special ---
    { id: 32, name: 'Window (Basic)' },
    { id: 33, name: 'Window (FullWall)' },
    { id: 43, name: 'Window (FullWall-Vary01)' },
    { id: 38, name: 'Floor (SideDeco)' },
    { id: 44, name: 'Floor (Basic-Dirty)' },
    { id: 45, name: 'Floor (Diamond)' },
    { id: 46, name: 'Floor (Stripe-Vertical)' },
    { id: 47, name: 'Floor (Stripe-Horizontal)' },
    { id: 48, name: 'Wall (Door-Left-Top)' },
    { id: 49, name: 'Wall (Door-Left-Bottom)' },
    { id: 50, name: 'Wall (Door-Mid-Top)' },
    { id: 51, name: 'Wall (Door-Right-Top)' },
    { id: 52, name: 'Wall (Door-Right-Bottom)' },
    { id: 53, name: 'Wall (Pipes-Top)' },
    { id: 54, name: 'Wall (Pipes-Bottom)' },
    { id: 55, name: 'Wall (Dirty-Top)' },
    { id: 56, name: 'Wall (Dirty-Bottom)' },
    { id: 57, name: 'Wall Center (Top-Nitrophil)' },
    { id: 58, name: 'Wall Center (Top-Lydrosome)' },
    { id: 59, name: 'Wall Center (Bottom-Cambihil)' },
    { id: 60, name: 'Wall Center (Top-ScifiDeco)' },
    { id: 61, name: 'Wall Center (Bottom-ScifiDeco)' },
    { id: 62, name: 'Wall Center (Top-HeavyDirty)' },
    { id: 63, name: 'Wall Center (Bottom-HeavyDirty)' },
    { id: 64, name: 'Floor (WhiteDiamond)' },
    { id: 65, name: 'Floor (Basic-DirtyVary)' },
    { id: 66, name: 'Floor (Basic-Crack)' }
];

export const DOOR_TEMPLATES = {
    DOOR_BASIC: {
        name: 'Basic Door (Wall)',
        tiles: [{ id: 22, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_BOTTOM: {
        name: 'Bottom Wall Door',
        tiles: [{ id: 20, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_LEFT: {
        name: 'Left Wall Door',
        tiles: [{ id: 24, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_RIGHT: {
        name: 'Right Wall Door',
        tiles: [{ id: 25, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_SECRET_OPEN: {
        name: 'Secret Door (Open)',
        tiles: [{ id: 34, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_SECRET_BOTTOM_OPEN: {
        name: 'Secret Door Bottom (Open)',
        tiles: [{ id: 35, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_SECRET_RIGHT_OPEN: {
        name: 'Secret Door Right (Open)',
        tiles: [{ id: 36, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_SECRET_LEFT_OPEN: {
        name: 'Secret Door Left (Open)',
        tiles: [{ id: 37, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_HIDDEN_BASIC: {
        name: 'Hidden Door (Basic)',
        tiles: [{ id: 39, relX: 0, relY: 0, name: 'Hidden' }]
    },
    DOOR_HIDDEN_BOTTOM: {
        name: 'Hidden Door (Bottom Edge)',
        tiles: [{ id: 40, relX: 0, relY: 0, name: 'Hidden' }]
    },
    DOOR_HIDDEN_RIGHT: {
        name: 'Hidden Door (Right Wall)',
        tiles: [{ id: 41, relX: 0, relY: 0, name: 'Hidden' }]
    },
    DOOR_HIDDEN_LEFT: {
        name: 'Hidden Door (Left Wall)',
        tiles: [{ id: 42, relX: 0, relY: 0, name: 'Hidden' }]
    }
};
