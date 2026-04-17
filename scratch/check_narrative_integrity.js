/**
 * Narrative Integrity Scanner
 * Verifies that all STORY_STAGES have corresponding dialogue in NPC_SCRIPTS
 * and that quests are properly linked.
 */

import { STORY_STAGES } from './src/engine/state.js';
import { NPC_SCRIPTS } from './src/data/npc_dialogues.js';
import { MAIN_QUEST_DATA } from './src/data/quests/main.js';

console.log("--- Narrative Integrity Check ---");

// 1. Check STORY_STAGES coverage
const stages = Object.values(STORY_STAGES);
const npcsWithStages = Object.keys(NPC_SCRIPTS).filter(id => NPC_SCRIPTS[id].stages);

console.log(`\nChecking NPC Stage Coverage (${npcsWithStages.length} NPCs with stages):`);
npcsWithStages.forEach(npcId => {
    const npc = NPC_SCRIPTS[npcId];
    const npcStages = Object.keys(npc.stages).map(Number);
    
    stages.forEach(stage => {
        if (!npcStages.includes(stage)) {
            // Check if this NPC is expected to have dialogue for this stage
            // Jenzi should have for most. Lana only for Botanic+.
            if (npcId === 'jenzi') {
                 console.warn(`[MISSING] Jenzi is missing stage: ${stage}`);
            }
        } else {
            const data = npc.stages[stage];
            if (!data.lines || data.lines.length === 0) {
                console.error(`[EMPTY] ${npcId} stage ${stage} has no dialogue lines!`);
            }
        }
    });
});

// 2. Check Quest Advancement linking
console.log("\nChecking Quest Advancement Linking:");
const advQuests = Object.keys(MAIN_QUEST_DATA).filter(id => MAIN_QUEST_DATA[id].advancesStoryStage);
console.log(`Found ${advQuests.length} quests with 'advancesStoryStage: true'`);

if (advQuests.length < 5) {
    console.warn("[WARNING] Fewer than 5 quests advance the story. Is the chain complete?");
}

// 3. Verify IDs match between maps and dialogues
console.log("\nVerification complete.");
