---
description: Create a new Side Quest
---

This workflow guides you through the process of adding a new Side Quest to the game, including defining its goals, rewards, and assigning it to an NPC.

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template to the user:

```text
[Quest ID]: (e.g., quest_my_new_quest)
[Quest Title]: (e.g., The Great Hunt)
[Quest Description]: (A short summary for the Quest Tab - MANDATORY)
[Quest Type]: (defeat | synthesis | collect | duel | show_monster)
[Target ID]: (monster_id, item_id, or npc_id)
[Amount]: (Number required)
[Min Efficiency]: (Required for 'show_monster' type, e.g., 1)
[Reward]: { type: 'log', id: 'LogXXX' } OR { type: 'item', id: 'ITEM_ID' } OR { type: 'resource', id: 'credits', amount: 500 } OR { type: 'resource_multi', rewards: [...] }
[Consume]: (true/false - for 'collect' type only)

##### 1. Dialogue (MUST be Arrays of Strings for code safety)
- **Offer**: ["Line 1", "Line 2"]
- **Progress**: ["Current progress: {progress}", "Line 2"]
- **Complete**: ["Line 1", "Line 2"]
- **Finished**: ["Line 1", "Line 2"]

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> Because quest dialogue is new and story-driven, the assistant MUST perform a comprehensive grammar check and polish the language for professional, high-quality narrative writing before implementation.

> [!TIP]
> **Dialogue Segmentation**: Use `//` within a single string to denote a line break/panel segment (e.g., `"Hello... // How are you?"`). This helps with dialogue pacing.

##### 2. NPC Assignment
- **NPC ID**: (e.g., saito, maya, or a new ID if creating a new NPC)
- **Map File**: (e.g., atrium.js, human.js)
```

### 1. Define Quest Data
Add the new quest definition to the `QUESTS` object in [quests.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests.js).

**⚠️ CRITICAL RULES**:
- **Description**: You MUST provide a `description` property for the UI.
- **Dialogue Arrays**: All dialogue fields (`offer`, `progress`, `complete`, `finished`) should be **Arrays of Strings**.
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
- [ ] **Progress Variable**: Is `{progress}` included in the `progress` dialogue?
- [ ] **Zone Dialogue Sync**: If the NPC is a flavor NPC, does their ambient dialogue match `story_lore_progression.md`?
- [ ] **Map Registration**: Is the `sideQuestId` added to the NPC in the modular map file (NOT overworld.js)?
- [ ] **Visual Mapping**: Is the NPC registered in `OVERWORLD_NPC_SPRITES` in `main.js`?
