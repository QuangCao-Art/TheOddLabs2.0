---
description: Create a Specific NPC (Named Character)
---

This workflow guides you through the creation of a named character in the lab—from **Peaceful Researchers** (Lore & Quest givers) to **Elite Bosses** (Lana, Dyzes, etc.). All NPCs created here use the **Lore-Unified ID System** and are managed through **Modular Map Files**.

> [!NOTE]
> **Related Workflows**:
> - If this NPC is a **Quest Giver**, see [create_quest.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_quest.md).
> - If this NPC has a **Battle Encounter**, see [create_npc_encounter.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_npc_encounter.md).

### 🧪 Peaceful by Default Rule
> [!IMPORTANT]
> **Always ask the user if the NPC is peaceful.** If the user does not specify an interaction type, **PEACEFUL** is the default state. You MUST NOT add battle logic or quests unless explicitly requested.

### 📜 Zone Dialogue Protocol
> [!IMPORTANT]
> For **Peaceful** or **Flavor** NPCs, you MUST pull their dialogue from the **"Zone Dialogue"** section of [story_lore_progression.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/story_lore_progression.md). 
> - **Rule**: DO NOT make up new dialogue for these NPCs.
> - **Rule**: DO NOT ask the user for new dialogue for these NPCs.

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> If the user provides new dialogue (e.g., for a Boss or unique Story NPC), you MUST perform a comprehensive grammar check and polish the language for professional, high-quality narrative writing before implementation.

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template:

```text
[Character ID]: (e.g., mimi, saito)
[Character Name]: (e.g., Researcher Mimi)
[Location]: (Zone Name, e.g., kitchen.js, and Coordinates x, y)
[Type]: (Peaceful | Quest Giver | Battleable/Boss) -- DEFAULT IS PEACEFUL

##### 1. Visual Assets
- **Overworld Sprite**: (npc_male | npc_female)
- **Full Art Portrait**: [Optional: Filename for BS sequence, e.g., Boss_Lana.png]

##### 2. Gameplay & Logic (ONLY IF NOT PEACEFUL)
- **Initial Dialogue**: [MANDATORY for Peaceful: Use Zone Dialogue from story_lore_progression.md]
- **Encounter ID**: [The logical character ID for flags, e.g., 'lana', 'maya']
- **Battle Profile ID**: [The stats key in quest_data.js, e.g., 'lana_boss']
- **Quest ID**: [Optional: If Quest Giver, link to QUESTS]
```

### 1. Register Overworld Entity
Add the character to the `objects` array in the relevant **Modular Map** file within [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/):
- **ID Rule**: Use the **Lore ID** (e.g., `id: 'mimi'`). This ID is used for **Story Flags** (e.g. `battleDone_mimi`).
- **Mapping Data**: Include the `name`, `x`, `y`, and the `battleEncounterId` (for combat stats).

**Example**:
```javascript
{ "id": "mimi", "x": 5, "y": 8, "type": "npc", "name": "Researcher Mimi" }
```

### 2. Map Visual Assets (Centralized)
Register the NPC visuals in [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js):
- **Overworld Sprite**: Map the ID to a base sprite in `window.OVERWORLD_NPC_SPRITES` (e.g., `mimi: 'npc_f_01'`).

> [!CAUTION]
> **The Sprite Fallback Rule**:
> 1. **Check First**: If the NPC has a unique sprite defined by their **ID** in `overworld.css` (e.g., `.npc.jenzi`), they **DO NOT** need an entry in `main.js`. 
> 2. **Generic Mapping**: Only use the mapping table for NPCs sharing generic assets like `npc_male` or `npc_female`.
> 3. **Edit Integrity**: When adding a new mapping, use `multi_replace_file_content` or be extremely careful not to delete existing character mappings in the object. Never assume a specialized sprite class (like `npc_f_01`) exists unless you have verified it in the CSS.

- **Battle Visuals**: If the type is **Boss/Battleable**, add the ID with its `art` and `dialogue` to `PRE_BATTLE_DATA`.

### 3. Implement Interaction Logic (Systematic)
Unique narrative responses and branching states are now defined in the **Narrative Engine**:
- **File**: [npc_dialogues.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/npc_dialogues.js)
- **Step**: Add a new entry to the `NPC_SCRIPTS` object.
- **Logic**:
  - Implement a `getScript(gameState, overworld, params)` function. 
  - Use `params` like `isPostBattle`, `bossWon`, and `logs` to determine the dialogue flow.
  - Return an object with `{ lines: [], triggers: [], pendingBattleEncounter: null }`.

---

### 🧪 Flavor NPC Pattern (Fallback Logic)
> [!NOTE]
> **Universal Fallback**: The engine has a built-in fallback system for "Flavor" NPCs (those without unique quests or battle logic).
> 1. **Phase 5 Fallback**: If an NPC's ID is **not found** in `NPC_SCRIPTS`, the overworld engine (`overworld.js`) automatically treats them as `generic_staff`.
> 2. **Pool-Based Dialogue**: `generic_staff` pulls lines from `randomPools[overworld.currentZone]`.
> 3. **Template**: To create a flavor NPC (like Mamozet or Piza), you ONLY need the map file entry and `main.js` sprite mapping. **Do NOT add them to `npc_dialogues.js`.**

### ⚠️ Lesson Learned (Architecture Preservation)
> [!WARNING]
> **Avoid Redundant Refactoring**: DO NOT refactor the `NPC_SCRIPTS` engine or the `generic_staff` logic to "optimize" for shared code unless explicitly requested.
> - **Anti-Pattern**: Defining a `flavorStaffLogic` or `genericStaffScript` helper and pointing multiple IDs to it.
> - **Standard Pattern**: Rely on the engine's built-in ID fallback (Phase 5). This keeps the code minimal and follows the established architecture.

---

### ⚠️ NPC Integrity Checklist
- [ ] **Type Check**: Is the NPC **Peaceful**? (If yes, ensure no `battleEncounterId` exists)
- [ ] **Lore ID Consistency**: Does the ID in the map file match the `battleDone_` flag logic in `main.js`?
- [ ] **Flag Mapping**: If this is a Boss, did you ensure the `npc.id` results in the correct `battleDone_` story flag?
- [ ] **Metadata Mapping**: Is the NPC registered in `OVERWORLD_NPC_SPRITES`? (Only if using generic sprites; skipped if unique ID matches CSS)
- [ ] **Dialogue Type**: Is the logic registered in **`src/data/npc_dialogues.js`**?
- [ ] **Zone Dialogue Accuracy**: Does the dialogue match the official lines in `story_lore_progression.md`?
- [ ] **Grammar & Polish**: Have the lines been checked and polished for high-quality writing?
- [ ] **Lore Check**: Has the new character been added to the Profiles in `story_lore_progression.md`?
