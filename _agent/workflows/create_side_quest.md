---
description: Create a new Side Quest
---

This workflow guides you through the process of adding a new Side Quest to the game, including defining its goals, rewards, and assigning it to an NPC.

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template to the user:

```text
[Quest ID]: (e.g., quest_my_new_quest)
[Quest Title]: (e.g., The Great Hunt)
[Quest Type]: (defeat | synthesis | collect | duel)
[Target ID]: (monster_id, item_id, or npc_id)
[Amount]: (Number required)
[Reward]: { type: 'log', id: 'LogXXX' } OR { type: 'item', id: 'ITEM_ID' } OR { type: 'resource', id: 'credits', amount: 500 }
[Consume]: (true/false - for 'collect' type only)

##### 1. Dialogue
- **Offer**: [Lines to offer the quest]
- **Progress**: [Lines for progress (use {progress} for count)]
- **Complete**: [Lines for completion]
- **Finished**: [Lines for post-quest interaction]

##### 2. NPC Assignment
- **NPC ID**: (e.g., npc_male_mark)
```

### 1. Define Quest Data
Add the new quest definition to the `QUESTS` object.
- **File**: [quests.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests.js)
- **Check**: Ensure the `type` matches one of the supported types: `defeat`, `synthesis`, `collect`, `duel`.

### 2. Assign to NPC
Link the quest to the specified NPC.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **What to add**: Add `sideQuestId: 'your_quest_id'` to the NPC entity.

---

### ⚠️ Quest Integrity Checklist
- [ ] **Target ID**: Does the `target` ID exist in the relevant data files (e.g., `monsters.js` for 'defeat')?
- [ ] **Dialogue Variables**: Ensure `{progress}` is used in the `progress` dialogue if the amount is > 1.
- [ ] **Reward Existence**: Verify that the reward `id` exists (e.g., the Log ID or Item ID).
