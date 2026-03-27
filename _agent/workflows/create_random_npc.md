---
description: Create a basic random NPC with location-based dialogue
---

This workflow guides you through adding "Background" NPCs that use the engine's built-in random dialogue pools based on their location (e.g., Lobby, Atrium, Botanic).

### 0. Provide Request Template
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST provide the following template to the user to collect the NPC details:

```text
[NPC Name]:
- **Location**: [Zone ID, e.g., atrium, lobby, botanic]
- **Coordinates**: [x: 5, y: 10]
- **Appearance**: [Gender: male/female]
- **Special Dialogue**: [Optional: Specific line if you DON'T want it random]
```

### 1. Add NPC to Overworld
Define the NPC in the `objects` array of the specified zone.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Logic**: 
  - If the NPC has NO `dialogue` property, the engine fallbacks to `Overworld.randomPools[currentZone]`.
  - Use naming convention: `npc_[gender]_[name]` (e.g., `npc_female_maya`).

**Example Entry**:
```javascript
{ id: 'npc_female_maya', x: 7, y: 8, type: 'npc', name: 'Researcher Maya' },
```

### 2. Update Random Dialogue Pools (Optional)
If the user provides new general dialogue lines for a zone, update the `randomPools` object at the top of the file.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Target**: `Overworld.randomPools.[zoneId]`

---

### ⚠️ Integrity Checklist
- [ ] **Accessibility**: Are the coordinates `(x, y)` on a floor tile (Tile IDs 13, 14, 15, or 32)?
- [ ] **Collision**: Ensure the NPC is not placed on top of a prop or wall.
- [ ] **ID Consistency**: Ensure the `id` starts with `npc_` for correct portrait mapping.
- [ ] **Gender/Portrait**: Verify the ID part after `npc_` (e.g., `female` or `male`) matches the available `Character_FullArt_NPC_[Gender].png` assets.
