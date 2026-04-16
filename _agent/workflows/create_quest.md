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
- **Failed**: ["Line 1", "Line 2"] (Auto-triggered on failure/timeout)
- **Retry**: ["Line 1", "Line 2"] (Shown when talking again after failure)
- **Finished**: ["Flavor text after completion"]
```

### ✍️ Writing Quality & Grammar (Dialogue Polishing Protocol)
> [!IMPORTANT]
> To ensure systematic and scalable updates, always follow the **Dialogue Polishing Protocol**:
>
> | Step | Rule | Description |
> | :--- | :--- | :--- |
> | **1** | **Preserve Intent** | Do not change core meaning, lore beats, or specific character actions (e.g., mumbling, private thoughts). |
> | **2** | **Grammar Check** | Correct subject-verb agreement, tense consistency, and punctuation while maintaining the "spoken" feel. |
> | **3** | **Visual Rhythm** | Use `//` for mid-line panel breaks to ensure text doesn't overflow the UI and flows naturally. |
> | **4** | **Tone Balancing** | Ensure character voice consistency (e.g., Jenzi's slang vs. Lana's scientific ego). |
> | **5** | **Minimum Viable Edit** | Stick as close to original wording as possible. Only alter for clarity and grammar. |

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
    type: 'collect', // defeat | synthesis | collect | duel | show_monster | kick | break
    target: 'item_id', // Can be Monster ID, Item ID, or FURNITURE_TEMPLATE name
    targetType: 'prop', // Optional: 'npc' | 'prop' (Required for kick/break quests)
    amount: 1,
    timeLimit: 60,     // Optional: Triggers Timed Quest Logic
    requiredFlag: 'prerequisite_flag', // Must be true in gameState.storyFlags
    onCompleteFlag: 'result_flag',     // Set to true automatically on completion
    reward: { type: 'resource', amount: 500 },
    // OR relocation reward:
    // reward: { type: 'relocate', npcId: 'jenzi', x: 10, y: 14, zoneId: 'atrium', direction: 'down', useFade: true },
    dialogue: {
        offer: ["..."],
        progress: ["..."],
        complete: ["..."],
        failed: ["..."],  // Auto-triggered on failure/timeout
        retry: ["..."],   // Shown when talking again after failure
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
3. **Failure**: On timeout, the `failed` dialogue triggers automatically. The player then teleports back to the NPC and can retry via the `retry` dialogue.

---

### 🎭 Narrative Engine Handover
For NPCs with complex roles (Jenzi, Lana, etc.), their core interaction logic is split between the Quest Engine (tasks) and the Narrative Engine (character personality).

| System | Activity State | Source of Dialogue |
| :--- | :--- | :--- |
| **Quest Engine** | Quest is Active, Completed, or Failed | Registry files in `src/data/quests/` |
| **Narrative Engine** | No Quest / Between Quests / Post-Quest | Script Registry in `src/data/npc_dialogues.js` |

**The Bridge (Systematic Handover):**
1. **Completion**: Use the `onCompleteFlag` in your quest definition.
2. **Recognition**: In `npc_dialogues.js`, add an `else if` check for that flag **immediately**.
3. **Outcome**: The NPC will seamlessly transition from "Task-focused" dialogue to acknowledging your accomplishment in their general flavors.

---

### 🤺 NPC Duel (Defeat Quest) Special Logic
When the `Quest Type` is `defeat` and the `Target ID` is the NPC themselves (a Duel):
1. **Focus on Offer & Complete**: For the Quest Registry, the most critical dialogues are `offer` (to accept the challenge) and `complete` (the turn-in for the reward after winning).
2. **Engagement Handover**: Once the quest is started, the NPC will typically use their Narrative Script lines (`beforeBattle`) to trigger the fight, rather than the quest `progress` lines.

### ⚠️ Quest Integrity Checklist
- [ ] **Priority Check**: Is the highest priority quest listed FIRST in the NPC's `quests` array?
- [ ] **Flag Safety**: Does the `requiredFlag` exist in `gameState.storyFlags` (or is it planned)?
- [ ] **Dialogue Type**: Are all dialogue fields **Arrays of Strings**?
- [ ] **Duel Specifics**: For NPC Duels, are the `offer` and `complete` dialogues the primary focus?
- [ ] **Diary Entry**: Is the `description` written in the first-person "Intern's Log" style?
- [ ] **Post-Quest Text**: Is there a meaningful `finished` dialogue for after the quest is done?