---
description: Create a new NPC battle encounter
---

This workflow guides you through the process of adding a new, one-time NPC battle encounter to the game, ensuring all data, logic, and visual mappings are correctly implemented.

> [!NOTE]
> **Related Workflows**:
> - If this battle is a **Quest Objective**, see [create_quest.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_quest.md).
> - If this is for a **Unique Story NPC** with complex dialogue logic, see [create_unique_story_npc.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_unique_story_npc.md).

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> For any new dialogue (VS sequence, before/after battle), the assistant MUST perform a comprehensive grammar check and polish the language for professional, high-quality narrative writing before implementation.

### 📜 Zone Dialogue Protocol
> [!IMPORTANT]
> If the NPC is a standard zone resident (Peaceful/Flavor), the **"Before Battle"** overworld dialogue MUST match the official lines in the **"Zone Dialogue"** section of [story_lore_progression.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/story_lore_progression.md).

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
  - `reward`: Object with `exp`, `biomass`, and `credits`.

### 2. Setup the Overworld NPC
Add the NPC object to the `objects` array in the relevant **Modular Map** file.
- **Directory**: [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/)
- **What to add**:
  - `id`: Use the unified lore name (e.g., `'maya'`).
  - `battleEncounterId`: Must match the key used in `NPC_ENCOUNTERS`.
  - `dialogue`: Initial lines (if any). **Note**: For complex battle-able NPCs (with state-aware Before/After dialogues), use the [Narrative Engine registry](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/npc_dialogues.js) instead of this field.

### 3. Map Sprite (OVERWORLD)
Ensure the engine knows which sprite class (male/female) to use for the ID.
- **File**: [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js)
- **Target**: `window.OVERWORLD_NPC_SPRITES`
- **What to add**: Map the ID to `'npc_male'` or `'npc_female'`.
- **Note**: This is mandatory if the ID doesn't start with `npc_male_` or `npc_female_`.

### 4. Map Visual Assets (PRE-BATTLE)
Ensure the character art/quote is mapped for the pre-battle VS sequence.
- **File**: [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js)
- **Target**: `PRE_BATTLE_DATA`
- **What to add**: Add the ID with its `art` and `dialogue`.

### 5. Systematic Narrative Logic (NEW)
Any NPC that requires specific dialogue logic (before battle, after winning, after losing) must be registered in the **Narrative Engine**.
- **File**: [npc_dialogues.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/npc_dialogues.js)
- **What to add**: A new `getScript` entry for the NPC ID. 

> [!NOTE]
> **Parameter Mapping**:
> - `isPostBattle`: `true` if the interaction happens immediately after a battle.
> - `bossWon`: `true` means the **BOSS/NPC won** (Player lost). `false` means the **BOSS/NPC lost** (Player won).

---

### ⚠️ Post-Mortem Bug Checklist (DO NOT SKIP)
- [ ] **Sprite Mapping**: Does the ID exist in `window.OVERWORLD_NPC_SPRITES` in `main.js`?
- [ ] **Character Art**: Does the `battleEncounterId` exist in `PRE_BATTLE_DATA` in `main.js`?
- [ ] **Grammar & Polish**: Have the battle lines been checked and polished for high-quality writing?
- [ ] **ID Consistency**: Does the ID in `NPC_ENCOUNTERS` EXACTLY match the ID in the modular map?
- [ ] **Zone Dialogue Accuracy**: If the NPC is a floor resident, does the Overworld dialogue match `story_lore_progression.md`?
- [ ] **Dialogue Branching**: Ensure specialized narrative dialogues are added to **`src/data/npc_dialogues.js`**.
