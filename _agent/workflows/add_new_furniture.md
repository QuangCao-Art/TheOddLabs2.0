---
description: Add a New Asset to the Game & Builder Tool
---

### 0. Provide the Requirement Template
**MANDATORY**: Whenever this workflow is triggered or mentioned, the assistant MUST provide the following and ask the user to fill it out:

```markdown
| Furniture ID | Description | X Position | Y Position | Have Collision | Kickable | Key Item | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| f107 | Name | (X) | (Y) | (Yes/No) | (Yes/No) | (Yes/No) | (Tooltip) |
```

### 1. Identify the Sprite
- Open `Lab_TileSet_02.png` or `Lab_TileSet_03.png`.
- Note the Top-Left pixel coordinates (X, Y) of the sprite.
- Assign the next available ID (e.g., `f105`).

### 2. Update Documentation
Add the entry to [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md).
- **Section**: Furniture Registry.
- **Entry**: `fID: Name (Tileset X, Y)`.

### 3. Implement CSS Rendering
Update [style.css](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/style.css).
1.  Ensure the ID is included in the tileset URL block (e.g., `.world-object.prop.f105`).
2.  Add the specific coordinate mapping:
    ```css
    .world-object.prop.f105 {
        background-position: calc(-[X]px / 4) calc(-[Y]px / 4);
    }
    ```

### 4. Add to Builder Palette
Update [furniture.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/furniture.js).
1.  Locate `FURNITURE_TEMPLATES`.
2.  Add a new template entry for the object.
    - For multi-tile objects, specify the `relX` and `relY` for each part.
    ```javascript
    NEW_OBJECT: { 
        name: 'Human Readable Name', 
        tiles: [{ id: 'f105', relX: 0, relY: 0 }] 
    }
    ```

### 5. Finalize Metadata
Update [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js).
1.  Locate `furnitureMetadata`.
2.  Add the ID with its collision status and description text.
    ```javascript
    'f105': { hasCollision: true, info: "A mysterious new lab device." }
    ```

### 5.5 Register Furniture Linkage
**MANDATORY for multi-tile objects** (e.g., 2-tile high robots/plants):
1.  Locate `linkedSets` within the `kickObject` function.
2.  Add a new array containing the IDs that should be kicked together.
    ```javascript
    ['f107', 'f108'],
    ```

### 6. Place in a Zone (Optional)
If you need to place the new furniture immediately:
1.  Identify the target zone file in [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/).
2.  Add it to the `objects` array following the [modify_map_layout](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/modify_map_layout.md) workflow.

---

### ✅ Success Criteria
- [ ] The object appears correctly in the **PROPS** tab of the Builder palette.
- [ ] The "Ghost Preview" shows the correct sprite when selected.
- [ ] Right-clicking the object in Builder Mode deletes the entire group.
- [ ] Interacting with the object in Play Mode shows the correct info tooltip.
