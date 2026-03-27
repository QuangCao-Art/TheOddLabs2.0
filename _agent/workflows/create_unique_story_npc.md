---
description: Create a Unique Story NPC (Named Character)
---

This workflow guides you through the creation of high-fidelity, named Story NPCs (e.g., Lily, Fox, Elena, Atlas) who have unique overworld sprites, full-art portraits, and distinct narrative roles.

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template:

```text
[Character Name]: (e.g., Lily, Fox)
[Role]: (e.g., Ancient Creator, Primal Descendant)
[Location]: (Zone ID and Coordinates x, y)

##### 1. Visual Assets
- **Overworld Sprite/CSS**: [e.g., .lana, .dyzes]
- **Full Art Portrait**: [Filename, e.g., Character_FullArt_Lana.png]
- **Battle Portrait Mapping**: [Mapping in main.js if they are a Boss]

##### 2. Story & Boss Battle
- **Lore Context**: [Character's motivation]
- **Interaction Type**: (Quest Giver | **Boss** | Lore Beacon)
- **Battle Encounter ID**: [Optional: If Boss, link to NPC_ENCOUNTERS]
- **Dialogue Pool**: [Pre-battle, Post-battle, and Win/Loss lines]
```

### 1. Map Overworld Sprite (CSS)
Unique NPCs require a dedicated CSS class mapping their spritesheet.
- **File**: [style.css](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/style.css)
- **Step**: Add a `.npc.[name]` class with the `background-image` pointing to the new spritesheet.
- **Example**:
  ```css
  .npc.lily { background-image: url('./assets/images/T_Char_Sprite_Lily_01.png'); }
  ```

### 2. Register Overworld Entity
Add the character to the `objects` array in the specified zone.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **ID Rule**: Use the character name as the `id` (e.g., `id: 'lily'`). This ensures the CSS class `.lily` is applied automatically.

### 3. Map Full Art Portrait
Ensure the engine knows which large portrait to show during dialogue.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Logic**: Update `Overworld.showDialogue` or ensure the `id` maps correctly to the path `./assets/images/Character_FullArt_[Name].png`.

### 4. Implement Dialogue & Battle Logic
For story bosses, use specific conditions in `startNPCInteraction`.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Logic**: 
  - If `isPostBattle`, show Win/Loss dialogue.
  - If `!hasBeaten`, show the "Challenge" dialogue and trigger `initiateBattle(encounterId)`.
- **Sync**: Ensure the `battleEncounterId` is also defined in `NPC_ENCOUNTERS` (see [/create_npc_encounter](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/create_npc_encounter.md)).

---

### ⚠️ Story NPC Integrity Checklist
- [ ] **Asset Existence**: Do the SpriteSheet and FullArt files actually exist in `/assets/images/`?
- [ ] **CSS Linkage**: Is the NPC's `id` EXACTLY the same as the class added to `style.css`?
- [ ] **Dialogue Branching**: Does the NPC have unique "Repeat" dialogue vs "First Meeting" dialogue?
- [ ] **Lore Sync**: Has the new character been added to the Profiles section in `story_lore_progression.md`?
