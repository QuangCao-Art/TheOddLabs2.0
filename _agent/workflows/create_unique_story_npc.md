---
description: Create a Specific NPC (Named Character)
---

This workflow guides you through the creation of a named character in the lab—from **Peaceful Researchers** (Lore & Quest givers) to **Elite Bosses** (Lana, Dyzes, etc.). All NPCs created here use the **Lore-Unified ID System** and are managed through **Modular Map Files**.

### 🧪 Peaceful by Default Rule
> [!IMPORTANT]
> **Always ask the user if the NPC is peaceful.** If the user does not specify an interaction type, **PEACEFUL** is the default state. You MUST NOT add battle logic or quests unless explicitly requested.

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
- **Initial Dialogue**: [Optional: Simple lines for peaceful NPCs]
- **Battle Encounter ID**: [Optional: If Battleable, link to NPC_ENCOUNTERS]
- **Quest ID**: [Optional: If Quest Giver, link to QUESTS]
```

### 1. Register Overworld Entity
Add the character to the `objects` array in the relevant **Modular Map** file within [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/):
- **ID Rule**: Use the **Lore ID** (e.g., `id: 'mimi'`). 
- **Mapping Data**: Include the `name`, `x`, `y`, and any gameplay ID (`battleEncounterId` or `sideQuestId`).

**Example**:
```javascript
{ "id": "mimi", "x": 5, "y": 8, "type": "npc", "name": "Researcher Mimi" }
```

### 2. Map Visual Assets (Centralized)
Register the NPC visuals in [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js):
- **Overworld Sprite**: Map the ID to a base sprite in `window.OVERWORLD_NPC_SPRITES` (e.g., `mimi: 'npc_f_01'`).
- **Battle Visuals**: If the type is **Boss/Battleable**, add the ID with its `art` and `dialogue` to `PRE_BATTLE_DATA`.

### 3. Implement Interaction Logic
Unique narrative responses are defined in the engagement handler:
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Step**: Add an `else if (npc.id === 'mimi')` block to `startNPCInteraction`.
- **Logic**:
  - For **Peaceful/Quest** NPCs, define their `lines` and handle quest states.
  - For **Battleable** NPCs, set `this.pendingBattleEncounter` and handle win/loss lines via `isPostBattle`.

---

### ⚠️ NPC Integrity Checklist
- [ ] **Type Check**: Is the NPC **Peaceful**? (If yes, ensure no `battleEncounterId` exists)
- [ ] **Lore ID Consistency**: Does the ID in the map file match `main.js` and `overworld.js`?
- [ ] **Metadata Mapping**: Is the NPC registered in `OVERWORLD_NPC_SPRITES`?
- [ ] **Dialogue Type**: Are all lines defined in `overworld.js` arrays?
- [ ] **Lore Check**: Has the new character been added to the Profiles in `story_lore_progression.md`?
