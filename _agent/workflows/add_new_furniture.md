---
description: Add a New Asset to the Game & Builder Tool
---

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> For any new text (Furniture Names, Descriptions, Info/Tooltips), the assistant MUST perform a comprehensive grammar check and polish the language for professional, high-quality narrative writing before implementation.

### 0. Provide the Requirement Template
**MANDATORY**: Whenever this workflow is triggered or mentioned, the assistant MUST provide the following and ask the user to fill it out:

```markdown
| Furniture ID | Description | X Position | Y Position | Have Collision | Kickable | Breakable | Breaks Into | Material | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| f107 | Name | (X) | (Y) | (Yes/No) | (Yes/No) | (Yes/No/Debris) | (TemplateID) | (wood/glass/liquid/metal/bone/plastic/carton) | (Tooltip) |
```

### 1. Identify the Sprite
- Open `Lab_TileSet_02.png` or `Lab_TileSet_03.png`.
- Note the Top-Left pixel coordinates (X, Y) of the sprite.
- Assign the next available ID (e.g., `f105`).

> [!CAUTION]
> **NAMING CONVENTION**: Avoid using multiple underscores in Furniture IDs (e.g., use `crate01` or `f105`, NOT `large_metal_crate`). The overworld engine uses the first underscore to separate the base ID from interaction suffixes. Using multiple underscores will break the pivot/wobble animation for that object.

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
    NEW_OBJECT: { 
        name: 'Human Readable Name', 
        tiles: [{ id: 'f105', relX: 0, relY: 0 }] // Core linkage depends on these rel coordinates!
    }
    ```

### 5. Finalize Metadata
Update [furniture.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/furniture.js).
1.  Locate `furnitureMetadata`.
2.  Add the ID with its mandatory `name`, collision status, description text, and breakable settings.

> [!TIP]
> **Understanding "Breaks Into"**:
> - This is the **Template ID** of the "Broken" version of your object.
> - You find these names (Keys) in [furniture.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/furniture.js) inside the `FURNITURE_TEMPLATES` object.
> - Example ID: `TANK_DEBRIS_KICKABLE` or `DESK_BROKEN`.

    ```javascript
    'f105': { 
        name: 'Standardized Name', // MANDATORY: Display name for Play Mode
        hasCollision: true, 
        info: "A mysterious new lab device.",
        breakable: true,          // Set to true for destructible objects
        breaksInto: 'DEBRIS_ID',  // Template ID found in FURNITURE_TEMPLATES
        material: 'glass'         // Audio tag: wood | glass | metal | liquid | monster | bone | plastic | carton
    }
    ```

> [!TIP]
> **Advanced: Chained Breakables (Multi-Stage Destruction)**:
> The system supports infinite chaining. To create a 3-stage breakable machine:
> 1.  **Stage 1 (Pristine)**: `breakable: true`, `breaksInto: 'MACHINE_DAMAGED_TEMPLATE'`.
> 2.  **Stage 2 (Damaged)**: `breakable: true`, `breaksInto: 'MACHINE_DEBRIS_TEMPLATE'`.
> 3.  **Stage 3 (Debris)**: `kickable: true`, `breakable: false`. (This stage flies away when hit).


### 6. Place in a Zone (Optional)
If you need to place the new furniture immediately:
1.  Identify the target zone file in [src/data/maps/](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/maps/).
2.  Add it to the `objects` array following the [modify_map_layout](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/_agent/workflows/modify_map_layout.md) workflow.

> [!CAUTION]
> **CLEAN MAP POLICY**: When manually adding to a map file, do **NOT** include the `name` property in the object JSON. The name is automatically resolved from the metadata registry.

---

### ✅ Success Criteria
- [ ] The object appears correctly in the **PROPS** tab of the Builder palette.
- [ ] The "Ghost Preview" shows the correct sprite when selected.
- [ ] Right-clicking the object in Builder Mode deletes the entire group.
- [ ] Interacting with the object in Play Mode shows the correct info tooltip.
- [ ] **Grammar & Polish**: Have the furniture name and info text been checked and polished?
