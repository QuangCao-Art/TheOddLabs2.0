---
description: Modify the Map Layout or Furniture
---

This workflow guides you through changing a zone's tile grid or furniture placement, ensuring that stacking logic (AI_DECORATION_PROTOCOL) and visual rendering are maintained.

### 0. Request Details & Visualization
**REQUIREMENT**: Whenever this workflow is mentioned or triggered, the assistant MUST:
1.  **Provide the Template** below.
2.  **Provide the Current Layout** of the target zone in an ASCII grid format (like [MapLayoutSample.txt](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapLayoutSample.txt)), showing both the **Structure** (walls/floor) and the **Furniture IDs** (e.g., F13, F8).

```text
[Zone Name]: (e.g., atrium, lobby, kitchen)
[Action]: (Add Furniture | Move Object | Resize Grid | Change Tiles)
[Details]: (Describe the change, e.g., "Add a Red Specimen Tank at x=5, y=10")

[Visualization Request]: (Structure Only | Structure + Furniture)
```

#### 💡 Example Visualization Format
When visualizing, use this format as seen in [MapLayoutSample.txt](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapLayoutSample.txt):
```text
0   1   2   3   4   5
+-------------------+
0 | ### ### ### ### ### |  <-- Wall (Tile 8)
1 | ### F13 F86 ... ### |  <-- Furniture Overlap
2 | ### F14 F87 ... ### |  <-- Stacking Pair
3 | ... ... ... ... ... |  <-- Floor (Tile 13)
```

#### 🛡️ [AI_DECORATION_PROTOCOL_V1.0]
This protocol MUST be strictly followed for all map modifications:

- **1. DATA_HIERARCHY_RESOLUTION**: `MapBuilder.md` is the ABSOLUTE TRUTH for ID-to-Coordinate mapping.
- **2. STACKING_INTEGRITY**: For any `BOTTOM_ID` in {F89, F62, F54, F55, F14, F87}, there MUST be a corresponding `TOP_ID` at (X, Y-1).
    - Pairs: F88<->F89, F61<->F62, F52/53<->F54/55, F13<->F14, F86<->F87.
- **3. MULTI_OBJECT_RESOLUTION**: Use arrays for overlapping `objects`. Order by Background -> Foreground.
- **4. TILESET_MAPPING**: Ensure `style.css` contains the mapping for every used ID.
- **5. PRE_EXECUTION_GRID_TRACE**: Trace every column before writing to ensure atomic pairings.
- **6. AUTOMATED_STACKING_MEMORY**: Whenever a `BOTTOM_ID` is present, the model MUST automatically place the corresponding `TOP_ID` at `(X, Y-1)`. This is NON-NEGOTIABLE. If other objects are at the target coordinate, use the **Overlap Strategy** (Protocol 3) to render both.
    - Pairs: F88<->F89, F61<->F62, F52/53<->F54/55, F13<->F14, F86<->F87.

### 1. Update the Grid (Layout)
If changing walls or floors, modify the `layout` array.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Reference**: Use [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md) (Terrain Tiles 0-32).

### 2. Place/Move Objects
Update the `objects` array for the target zone.
- **File**: [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js)
- **Rule (Stacking)**: If placing a 2-tile high object (Tank, Big Cabinet, Box Pile, Ancient Plant), you MUST place the `TOP_ID` at `(x, y-1)` and the `BOTTOM_ID` at `(x, y)`.

### 3. Verify Rendering (CSS)
Ensure the Furniture ID is correctly mapped to the tileset.
- **File**: [style.css](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/style.css)
- **Check**: If the ID is new to this zone, ensure it has a `background-position` and correct `height` defined.

---

### ⚠️ Annotation & Integrity Checklist
- [ ] **Atomic Shifting**: Did you move the `Top` part when you moved the `Bottom` part?
- [ ] **Collision Path**: Is there a 1-tile wide walkable path (floor tile 13) for the player to reach important objects?
- [ ] **ID Truth**: Does the ID in `overworld.js` match the reference in [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md)?
- [ ] **Z-Index**: Do 'Top' parts (F13, F61, F88) have `hasCollision: false` to ensure they render over the player?
