---
description: Create a new NPC battle encounter
---

This workflow guides you through the process of adding a new, one-time NPC battle encounter to the game, ensuring all data, logic, and visual mappings are correctly implemented.

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template to the user to collect the encounter details:

```text
[NPC Name]:
##### 1. Dialogue
- **Before Battle**: [Lines said when interaction starts in Overworld]
- **Pre-battle**: [Short line said in the VS/Portrait sequence]
- **NPC Victorious (Player Loses)**: [npcWinDialogue]
- **NPC Defeated (Player Wins)**: [npcLossDialogue]

##### 2. Monster Team (NPC_ENCOUNTERS)
- **Monster IDs**: [e.g., stemmy, nitrophil]
- **Opponent RG Level**: [e.g., 5, 10, or 'auto']
- **AI Combat Style**: [aggressive, balanced, survival, utility]

##### 3. Rewards
- **EXP**: [Amount]
- **Biomass**: [Amount]
- **Credits (LC)**: [Amount]
```

### 1. Define the Encounter Data
Add the new encounter definition to the `NPC_ENCOUNTERS` object.
- **File**: [cards.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/cards.js)
- **What to add**: 
  - `rg`: Research Grade level (e.g., 5, 10, or 'auto').
  - `team`: Array of monster IDs (e.g., `['stemmy', 'nitrophil']`).
  - `style`: Combat AI style (`aggressive`, `balanced`, `survival`, `utility`).
  - `reward`: Object with `exp`, `biomass`, and `lc`.

### 2. Setup the Overworld NPC
Add the NPC object to the relevant zone's `entities` array.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **What to add**:
  - `battleEncounterId`: Must match the key used in `NPC_ENCOUNTERS`.
  - `dialogue`: Initial lines.
  - `npcWinDialogue`: Lines if the player loses.
  - `npcLossDialogue`: Lines if the player wins.

### 3. Map Visual Assets (PRE-BATTLE)
Ensure the character art is correctly mapped for the pre-battle VS sequence.
- **File**: [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js)
- **What to add**: Add the `battleEncounterId` to the `PRE_BATTLE_DATA` mapping.

---

### ⚠️ Post-Mortem Bug Checklist (DO NOT SKIP)
- [ ] **Character Art**: Does the `battleEncounterId` exist in `PRE_BATTLE_DATA` in `main.js`? If not, the wrong portrait will display.
- [ ] **ID Consistency**: Does the `id` in `NPC_ENCOUNTERS` EXACTLY match the `battleEncounterId` in `overworld.js`?
- [ ] **Reward Branching**: Ensure the reward logic in `main.js` is in its own `else if` branch and not accidentally nested inside a boss check.
- [ ] **Post-Battle Flags**: Verify that `startNPCInteraction` is called with `isPostBattle = true` in the game over logic.
