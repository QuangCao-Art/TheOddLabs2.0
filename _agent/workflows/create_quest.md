---
description: Create a New Quest (Main or Side)
---

This workflow guides you through the process of adding a new Quest to the game using the **Modular Quest Engine**. This system handles all game progression, narrative beats, and world unlocks through a centralized, task-based registry.

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
 [Completion Flag]: (Optional - Sets a storyFlag automatically, e.g., 'lanaBattleDone')
[Required Logs]: (Optional - For quests that require a certain log count. Automatically renders as 'LOGS: X/Y' in the Quest Menu HUD)
[Reward]: { type: 'item', id: 'ITEM_ID' } OR { type: 'resource', amount: 500 } OR { type: 'relocate', npcId: 'npc_id', x: 10, y: 15, zoneId: 'zone_id', direction: 'down', useFade: true }
[Time Limit]: (Optional - In seconds. Triggers Timed Quest Logic)

##### 1. Dialogue (Arrays of Strings)
- **Offer**: ["Line 1", "Line 2"]
- **Offer Completed**: ["Line 1 if player already meets requirements"]
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
Add the quest definition to the **Central Quest Registry**:
- **Location**: [quest_data.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests/quest_data.js) (Exported as `QUEST_DATA`)

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
    requiredLogs: 5,                   // Displays 'LOGS: X/5' in Quest UI
    reward: { type: 'flag', id: 'doorUnlocked' }, // NEW: Directly change world state
    // OR relocation reward:
    // reward: { type: 'relocate', npcId: 'jenzi', x: 10, y: 14, zoneId: 'atrium', direction: 'down', useFade: true },
    dialogue: {
        offer: ["..."],
        offer_completed: ["..."], // Shown if requirements are already met at offer time
        progress: ["..."],       // Shown if quest is started but requirements not met
        complete: ["..."],
        failed: ["..."],
        retry: ["..."],
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

### 🎭 Narrative Engine Handover
Character dialogue is split between the **Quest Engine** (structured tasks) and the **Narrative Script** (personality flavor).

| System | Priority | Active State | Source of Dialogue |
| :--- | :--- | :--- | :--- |
| **Quest Engine** | **HIGH** | Quest is Active, Completed, or Failed | `src/data/quests/quest_data.js` |
| **Narrative Script** | **LOW** | No Quest / Post-Quest / Fallback | `src/data/npc_dialogues.js` -> `getScript()` |

**The Modular Flow:**
1. **Quest Priority**: Use the NPC's `quests` array in their map file to define which tasks they offer and in what order.
2. **Unlock progression**: Use `reward: { type: 'flag', id: 'X' }` in a quest to unlock doors or satisfy the `requiredFlag` of the *next* quest in the chain.
3. **Fallback**: If no quest is active, the engine calls the NPC's `getScript()` function for random flavor text or climax-specific monologue.

---

### 🤺 NPC Duel (Defeat Quest) Special Logic
When the `Quest Type` is `defeat` and the `Target ID` is the NPC themselves (a Duel):
1. **Engine Automation**: The `Overworld` engine systematically triggers the battle if a `defeat` quest is in progress and `requiredLogs` are met. You **do not** need to manually define battle triggers in NPC scripts for these quests.
2. **Dialogue Handling (Offer Completed)**: 
    - **MANDATORY**: Always include `offer_completed` for Duel quests.
    - **The Hype**: This dialogue triggers the moment the player meets the requirements (e.g., has 5/5 Logs). It acts as the "Pre-Battle Hype" or "Challenge Accepted" line.
    - **Failure**: If `offer_completed` is missing, the NPC will default to their `progress` line (often sounding disappointed) right before starting the epic duel.
3. **Completion**: Use `complete` for the post-victory dialogue and reward acquisition.

### ⚠️ Quest Integrity Checklist
- [ ] **Priority Check**: Is the highest priority quest listed FIRST in the NPC's `quests` array?
- [ ] **Flag Safety**: Does the `requiredFlag` exist in `gameState.storyFlags` (or is it planned)?
- [ ] **Dialogue Type**: Are all dialogue fields **Arrays of Strings**?
- [ ] **Duel Specifics**: For NPC Duels, are the `offer` and `complete` dialogues the primary focus?
- [ ] **Diary Entry**: Is the `description` clear and concise for the player HUD?
- [ ] **Post-Quest Text**: Is there a meaningful `finished` dialogue for after the quest is done?