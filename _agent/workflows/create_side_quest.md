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
[Quest Type]: (defeat | synthesis | collect | duel)
[Target ID]: (monster_id, item_id, or npc_id)
[Amount]: (Number required)
[Reward]: { type: 'log', id: 'LogXXX' } OR { type: 'item', id: 'ITEM_ID' } OR { type: 'resource', id: 'credits', amount: 500 } OR { type: 'resource_multi', rewards: [...] }
[Consume]: (true/false - for 'collect' type only)

##### 1. Dialogue (MUST be Arrays of Strings for code safety)
- **Offer**: ["Line 1", "Line 2"]
- **Progress**: ["Current progress: {progress}", "Line 2"]
- **Complete**: ["Line 1", "Line 2"]
- **Finished**: ["Line 1", "Line 2"]

##### 2. NPC Assignment
- **NPC ID**: (e.g., npc_female_at1)
```

### 1. Define Quest Data
Add the new quest definition to the `QUESTS` object in [quests.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/quests.js).

**⚠️ CRITICAL RULES**:
- **Description**: You MUST provide a `description` property or the UI will show `undefined`.
- **Dialogue Arrays**: All dialogue fields (`offer`, `progress`, `complete`, `finished`) should be **Arrays of Strings**. If you provide a single string, the engine's `.map()` function will crash.
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

### 2. Assign to NPC
Link the quest to the specified NPC in [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js).
Add `sideQuestId: 'your_quest_id'` to the NPC entity.

---

### ⚠️ Quest Integrity Checklist
- [ ] **Description Check**: Does the quest have a `description` for the UI?
- [ ] **Dialogue Type Check**: Are ALL dialogue fields arrays? (Even if only one line)
- [ ] **Progress Variable**: Is `{progress}` included in the `progress` dialogue?
- [ ] **Reward Sync**: If using `resource_multi`, ensure the Quest Tab in `main.js` is updated to render it if it's a new sub-type.
