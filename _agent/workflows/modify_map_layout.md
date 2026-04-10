---
description: Modify the Map Layout or Furniture
---

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> Although this workflow is grid-heavy, any new text (updated Room Names, Map Descriptions, or labels in MapBuilder.md) MUST be checked for grammar and polished for professional narrative quality.

This workflow guides you through changing a zone's tile grid or furniture placement, ensuring that stacking logic (AI_DECORATION_PROTOCOL) and visual rendering are maintained.


#### 🛡️ [AI_DECORATION_PROTOCOL_V1.1]
This protocol MUST be strictly followed for all map modifications:

- **1. DATA_HIERARCHY_RESOLUTION**: `MapBuilder.md` is the ABSOLUTE TRUTH for ID-to-Coordinate mapping.
- **2. STACKING_INTEGRITY**: For any `BOTTOM_ID` (e.g. F14, F23, F25), there MUST be a corresponding `TOP_ID` (e.g. F13, F22, F24) at (X, Y-1).
    - Important Pairs: F13<->F14, F15<->F16, F22<->F23, F61<->F62, F86<->F87, F88<->F89.
- **3. MULTI_OBJECT_RESOLUTION**: Order by Background -> Foreground.
- **4. TILESET_MAPPING**: Ensure `style.css` contains the mapping for every used ID.
- **5. PRE_EXECUTION_GRID_TRACE**: Trace every column before writing to ensure atomic pairings.
- **6. AUTOMATED_STACKING_MEMORY**: Whenever a `BOTTOM_ID` is present, the model MUST automatically place the corresponding `TOP_ID` at `(X, Y-1)`. This is NON-NEGOTIABLE. If other objects are at the target coordinate, use the **Overlap Strategy** (Protocol 3) to render both.
- **7. CONNECTED_ZONES_SYNC**: Whenever a map's dimensions or floor layout changes, YOU MUST AUDIT all other map files to find any `doors` targets pointing to the modified zone, and update their `targetX` and `targetY` to match the new spawn/floor coordinates.
- **8. HIDDEN_DOOR_PROTOCOL**: For secret passages, use IDs **39–42** (Hidden-Closed) in the `layout`. 
    - **Directional Mapping**: You MUST match the secret tile to its wall counterpart:
        - **39** (Hidden-Basic) -> Matches **15** (Standard Wall Bottom).
        - **40** (Hidden-Bottom) -> Matches **9** (WallEdge-Bottom boundary).
        - **41** (Hidden-Top) -> Matches **8** (WallEdge-Top boundary).
        - **42** (Hidden-Side) -> Matches **10/11** (WallEdge-Side boundaries).
    - These tiles stay visually disguised as walls until the player walks into them.
    - Upon interaction (if unlocked), they reveal the **Secret Passage** visuals (IDs **34–37**).
    - Ensure a corresponding entry exists in the `doors` array for the transition to work.
- **9. NPC_INTEGRITY_PROTOCOL**: Unless explicitly requested by the USER to move or remove them, all `type: "npc"` objects in the target zone MUST be preserved in their original coordinates when applying new furniture layouts.

### 1. Identify the Target Zone File
Map data is now modularized into individual files.
- **Target Folder**: [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/)
- **Target File**: `src/data/maps/[zone_name].js` (e.g., `atrium.js`, `ancientBotany.js`).

### 2. Update the Grid (Layout)
If changing walls or floors, modify the `layout` array in the zone file.
- **Reference**: Use [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md) (Terrain Tiles 0-32).

### 3. Place/Move Objects
Update the `objects` array in the zone file.
- **Rule (Stacking)**: If placing a 2-tile high object (Tank, Big Cabinet, Box Pile, Ancient Plant), you MUST place the `TOP_ID` at `(x, y-1)` and the `BOTTOM_ID` at `(x, y)`.

### 4. Update Connected Doors
If you changed the `width`, `height`, or shifted the floor of the target zone, you must update the entry points from other zones.
- **Action**: Search for the zone name in `src/data/maps/` (excluding the target file itself) to find connected zones.
- **Update**: Adjust the `targetX` and `targetY` in the `doors` array of those connected zones.

### 5. Validation (Crucial)
After any modification, use the `map_sync.py` tool to verify the integrity of the map data.
- **Command**: `python map_sync.py --validate` (or ask the user to run it if python is unavailable).
- **Result**: Ensure "All maps compliant with AI_DECORATION_PROTOCOL_V1.1" message is received.

### 5. Verify Rendering (CSS)
Ensure the Furniture ID is correctly mapped to the tileset.
- **File**: [style.css](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/style.css)

---

### ⚠️ Annotation & Integrity Checklist
- [ ] **Atomic Shifting**: Did you move the `Top` part when you moved the `Bottom` part?
- [ ] **Collision Path**: Is there a 1-tile wide walkable path (floor tile 13) for the player to reach important objects?
- [ ] **ID Truth**: Does the ID in the modular map file match the reference in [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md)?
- [ ] **Connected Zones**: Did you update the `targetX/targetY` for every door leading *into* this zone from other map files?
- [ ] **Z-Index**: Do 'Top' parts (F13, F61, F88) have `hasCollision: false` in `overworld.js` metadata?