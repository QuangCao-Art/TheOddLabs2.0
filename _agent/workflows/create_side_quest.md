---
description: Create a new Side Quest
---

This workflow guides you through the process of adding a new Side Quest to the game, including defining its goals, rewards, and assigning it to an NPC. Now supports **Timed Quests** with automatic countdowns and failure states.

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template to the user:

```text
[Quest ID]: (e.g., quest_my_new_quest)
[Quest Title]: (e.g., The Great Hunt)
[Quest Description]: (A short summary for the Quest Tab - MANDATORY)
[Quest Type]: (defeat | synthesis | collect | duel | show_monster | kick | break)
[Target ID]: (monster_id, item_id, npc_id, or FURNITURE_TEMPLATE)
[Amount]: (Number required)
[Time Limit]: (Optional - In seconds. e.g., 30. Triggers Timed Quest Logic)
[Min Efficiency]: (Required for 'show_monster' type, e.g., 1)
[Reward]: { type: 'log', id: 'LogXXX' } OR { type: 'item', id: 'ITEM_ID' } OR { type: 'resource', id: 'credits', amount: 500 } OR { type: 'resource_multi', rewards: [...] }
[Consume]: (true/false - for 'collect' type only)

##### 1. Dialogue (MUST be Arrays of Strings for code safety)
- **Offer**: ["Line 1", "Line 2"]
- **Retry**: (Required if Time Limit > 0) ["You failed...", "Try again?"]
- **Progress**: ["Current progress: {progress}", "Line 2"]
- **Complete**: ["Line 1", "Line 2"]
- **Finished**: ["Line 1", "Line 2"]

##### 2. NPC Assignment
- **NPC ID**: (e.g., saito, maya, or a new ID if creating a new NPC)
- **Map File**: (e.g., atrium.js, human.js)
```

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> Because quest dialogue is new and story-driven, the assistant MUST perform a comprehensive grammar check and polish the language for professional, high-quality narrative writing before implementation.

> [!TIP]
> **Dialogue Segmentation**: Use `//` within a single string to denote a line break/panel segment (e.g., `"Hello... // How are you?"`). This helps with dialogue pacing.

### ⏲️ Timed Quest Logic (Auto-Injected)
If a `timeLimit` is provided:
1. **Countdown**: A 3-2-1 sequence starts after the `offer` dialogue ends.
2. **Input Locks**: 'R' (Menu) and 'F' (Interact) are locked. Navigation remains active.
3. **Zone Lock**: Doors are locked to prevent leaving the quest area.
4. **Failure**: On timeout, the screen fades to black, the player teleports back to the NPC, and the `retry` dialogue automatically triggers.

### 1. Define Quest Data
Add the new quest definition to the `QUESTS` object in [quests.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests.js).

**⚠️ CRITICAL RULES**:
- **Description**: You MUST provide a `description` property for the UI.
- **Dialogue Arrays**: All dialogue fields (`offer`, `progress`, `complete`, `finished`, and `retry`) should be **Arrays of Strings**.
- **Time Limit**: Ensure `timeLimit: X` (seconds) is included for timed challenges.
- **Multi-Rewards**: To give multiple rewards (e.g., 200 Credits + a Card), use the `resource_multi` type:
  ```javascript
  reward: {
      type: 'resource_multi',
      rewards: [
          { type: 'item', id: 'CARD00' },
          { type: 'resource', id: 'credits', amount: 200 }
      ]
  }
  ```

### 💡 Interaction Logic (Kick vs Break)
- **kick**: Triggers when an object (Cell or Furniture) is displaced but NOT destroyed. 
  - *Valid Targets*: `any`, `stemmy_wild`, `nitrophil_wild`, or a furniture template like `STOOL_A`.
- **break**: Triggers only when a `breakable` object is destroyed.
  - *Valid Targets*: `any`, or a specific template like `STASIS_TANK`, `DIRTY_BOX`.

### 2. Centralized Metadata Registration
If you are creating a NEW NPC for this quest, or if the NPC doesn't have a unique visual yet, you MUST update [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js):
- **Sprite Mapping**: Add the NPC to `OVERWORLD_NPC_SPRITES` (e.g., `maya: 'npc_f_01'`).
- **Portrait/Quote Mapping**: Add the NPC to `PRE_BATTLE_DATA` if they will have unique battle portraits or pre-battle lines.

### 3. Assign quest to NPC in Map File
Link the quest to the NPC within its corresponding modular map file in [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/):
- Locate the NPC in the `objects` array.
- Add `sideQuestId: 'your_quest_id'` to the NPC object.

**Example (atrium.js)**:
```javascript
{ "id": "zibrya", "x": 8, "y": 4, "type": "npc", "name": "Assistant Zibrya", "sideQuestId": "quest_zibrya_firstcollection" }
```

---

### ⚠️ Quest Integrity Checklist
- [ ] **Description Check**: Does the quest have a `description` for the UI?
- [ ] **Dialogue Type Check**: Are ALL dialogue fields arrays?
- [ ] **Grammar & Polish**: Have the lines been checked and polished for high-quality writing?
- [ ] **Retry Dialogue**: If timed, is `retry` dialogue included?
- [ ] **Time Limit Logic**: Is `timeLimit` set in `QUESTS`?
- [ ] **Progress Variable**: Is `{progress}` included in the `progress` dialogue?
- [ ] **Zone Dialogue Sync**: If the NPC is a flavor NPC, does their ambient dialogue match `story_lore_progression.md`?
- [ ] **Map Registration**: Is the `sideQuestId` added to the NPC in the modular map file (NOT overworld.js)?
- [ ] **Visual Mapping**: Is the NPC registered in `OVERWORLD_NPC_SPRITES` in `main.js`?
