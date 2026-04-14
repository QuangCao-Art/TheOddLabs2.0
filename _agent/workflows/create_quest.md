---
description: Create a New Quest (Main or Side)
---

This workflow guides you through the process of adding a new Quest to the game using the **Unified, Data-Driven Quest Engine**. This system handles both main story progression and optional side quests through a centralized registry.

> [!NOTE]
> **Related Workflows**:
> - If this quest requires a **One-time Battle**, see [create_npc_encounter.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_npc_encounter.md).
> - If this is for a **Unique Story NPC** with complex dialogue, see [create_unique_story_npc.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_unique_story_npc.md).

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template to the user:

```text
[Quest ID]: (e.g., quest_main_lana_key)
[Quest Category]: (Main | Side)
[Quest Title]: (Short descriptive title)
[Quest Description]: (Diary/Log summary for the UI - MANDATORY)
[Quest Type]: (defeat | synthesis | collect | duel | show_monster | kick | break)
[Target ID]: (monster_id, item_id, npc_id, or FURNITURE_TEMPLATE)
[Amount]: (Number required)
[Required Flag]: (Optional - e.g., jenziFirstBattleDone)
[Completion Flag]: (Optional - Set when finished, e.g., atriumUnlocked)
[Reward]: { type: 'item', id: 'ITEM_ID' } OR { type: 'resource', amount: 500 } OR { type: 'relocate', npcId: 'npc_id', x: 10, y: 15, zoneId: 'zone_id', direction: 'down', useFade: true }
[Time Limit]: (Optional - In seconds. Triggers Timed Quest Logic)

##### 1. Dialogue (Arrays of Strings)
- **Offer**: ["Line 1", "Line 2"]
- **Progress**: ["Line 1 with {progress}"]
- **Complete**: ["Line 1", "Line 2"]
- **Finished**: ["Flavor text after completion"]
```

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> Always perform a comprehensive grammar check. Check for "Gen-Z" slang consistency for Jenzi, or "Impatient Scientific" tone for Lana. Use `//` for mid-line panel breaks.

### 1. Register Quest in Data Files
Add the quest definition to the appropriate registry in `src/data/quests/`:
- **Main Quests**: [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests/main.js) (Exported as `MAIN_QUEST_DATA`)
- **Side Quests**: [side.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests/side.js) (Exported as `SIDE_QUEST_DATA`)

**Example Structure**:
```javascript
'quest_id': {
    id: 'quest_id',
    title: 'Title',
    description: 'Diary entry...',
    type: 'collect',
    target: 'item_id',
    amount: 1,
    requiredFlag: 'prerequisite_flag', // Must be true in gameState.storyFlags
    onCompleteFlag: 'result_flag',     // Set to true automatically on completion
    reward: { type: 'resource', amount: 500 },
    // OR relocation reward:
    // reward: { type: 'relocate', npcId: 'jenzi', x: 10, y: 14, zoneId: 'atrium', direction: 'down', useFade: true },
    dialogue: {
        offer: ["..."],
        progress: ["..."],
        complete: ["..."],
        finished: ["..."]
    }
}
```

### 2. Update Map Data (NPC Assignment)
Assign the quest to the NPC in their respective map file (e.g., `atrium.js`, `botanic.js`). Use the modern `quests` array standard.

**⚠️ CRITICAL RULE**: NPCs scan their `quests` array from top to bottom. The first quest in the list that meets its `requiredFlag` (or has none) will be active.

```javascript
// Example in src/data/maps/botanic.js
{ 
    "id": "lana", 
    "x": 10, "y": 14, 
    "type": "npc", 
    "name": "Scientist Lana", 
    "quests": ["quest_lana_cleanup", "quest_main_lana_key"] // Priority order
}
```

### ⏲️ Timed Quest Logic
If a `timeLimit` is provided:
1. **Countdown**: A 3-2-1 sequence starts after the `offer` dialogue ends.
2. **Input Locks**: 'R' (Menu) and 'F' (Interact) are locked.
3. **Failure**: On timeout, player teleports back to the NPC and can retry.

---

### 🎭 Narrative Engine Integration
For NPCs with complex branching logic or major story roles (Jenzi, Lana, etc.), their core interaction logic is stored in [npc_dialogues.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/npc_dialogues.js).
- **Quest Priority**: If an NPC has an active quest, the **Quest Dialogue** defined here takes priority.
- **Post-Quest**: Once a quest is finished, the NPC will fall back to their script in `npc_dialogues.js`.
- **Story Flags**: Use the `onCompleteFlag` to trigger new dialogue branches in the Narrative Engine.

---

### ⚠️ Quest Integrity Checklist
- [ ] **Priority Check**: Is the highest priority quest listed FIRST in the NPC's `quests` array?
- [ ] **Flag Safety**: Does the `requiredFlag` exist in `gameState.storyFlags` (or is it planned)?
- [ ] **Dialogue Type**: Are all dialogue fields **Arrays of Strings**?
- [ ] **Diary Entry**: Is the `description` written in the first-person "Intern's Log" style?
- [ ] **Post-Quest Text**: Is there a meaningful `finished` dialogue for after the quest is done?
