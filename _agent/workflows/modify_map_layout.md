---
description: Modify the Map Layout or Furniture (Builder Mode)
---

This workflow guides you through changing a zone's tile grid or furniture placement using the **Visual Builder Mode**, ensuring that stacking logic (AI_DECORATION_PROTOCOL) and visual rendering are maintained.

### 1. Enter the Visual Builder
To design your room visually:
1.  **Toggle Builder**: Press `B` in-game to enter **Builder Mode**.
2.  **Navigation**: The sidebar (Palette) allows you to choose between:
    -   **PROPS**: 100+ lab objects (Tanks, Tables, Equipment).
    -   **TERRAIN**: Floors, Walls, and Corners (Tiles 0-32).
    -   **DOORS**: Interactive portals (Prompts for target coordinates).
3.  **Interaction**:
    -   `Left-Click`: Place the selected object/tile.
    -   `Right-Click`: Remove an object (automatically handles multi-tile cleanup).

### 2. Export & Apply Layout
Once you are satisfied with the design:
1.  Click the **EXPORT CODE** button at the bottom of the sidebar.
2.  In the modal that appears, click **COPY TO CLIPBOARD**.
3.  **Prompt Antigravity**: "Apply this layout to [Zone Name]" and paste the exported code block into the chat.

### 3. AI Integration Protocol
When Antigravity receives the exported code, they MUST:
1.  Locate the target zone in [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js).
2.  Manually update the `layout`, `objects`, and `doors` arrays with the exported literals.
3.  **Strictly Adhere to [AI_DECORATION_PROTOCOL_V1.1]**: Ensure the final code maintains explicit, coordinate-based object definitions (Lana Technique).

---

#### 🛡️ [AI_DECORATION_PROTOCOL_V1.1]
This protocol ensures the final code remains stable and renders perfectly:

- **1. DATA_HIERARCHY_RESOLUTION**: [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md) is the ABSOLUTE TRUTH for ID-to-Coordinate mapping.
- **2. STACKING_INTEGRITY**: Multi-tile objects (Tanks, Plants) MUST be defined as pairs in the `objects` array.
    - *Example*: (X, Y-1) = Top, (X, Y) = Bottom.
- **3. ORDER_PRECEDENCE**: Order objects in the array from Background -> Foreground to ensure correct overlap.
- **4. COLLISION_LOGIC**: Ensure Bottom parts have `hasCollision: true` (if applicable) and Top parts have `hasCollision: false`.
- **5. DOOR_INTEGRITY**: Every door tile must have a corresponding entry in the `doors` array with valid `targetZone`, `targetX`, and `targetY`.

---

### 4. Verification Checklist
- [x] **Visual Mirroring**: Does the in-game state match the exported code?
- [ ] **Walkable Path**: Is there at least a 1-tile wide floor path (Tile 13) to reach all interactions?
- [ ] **Lana Technique**: Are the furniture objects defined explicitly instead of using procedural loops?
- [ ] **Atomic Cleanup**: When removing furniture, did the builder remove BOTH the Top and Bottom parts? (Automatic in Builder, must be verified in exported code).