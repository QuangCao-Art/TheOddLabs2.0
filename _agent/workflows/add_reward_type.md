---
description: Add a New Reward Type to the Systematic Hidden Loot System
---

### ✍️ Narrative Quality
> [!IMPORTANT]
> All new item names and descriptions MUST be grammar-checked and polished to match the professional, tactical tone of the Laboratory OS.

### 0. Existing Type vs. New Type
> [!TIP]
> - **Variant of Existing Type**: (e.g., adding a 10 Credit reward) ONLY follow **Step 1** and **Step 5**. The logic for Resources, Cards, and Blueprints is already handled!
> - **Brand New Type**: (e.g., a "Status Buff") Follow ALL steps to define the logic and UI effects.

### 1. Register Item Metadata
Update [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js).
1. Locate `ITEM_PICKUP_DATA`.
2. Add your new item(s). Use the `REWARD_` prefix for systematic loot.
   ```javascript
   'REWARD_MY_ITEM': { 
       name: 'ITEM NAME', 
       desc: 'Tactical description of the item.', 
       type: 'custom_type', 
       spriteClass: 'f101' // ID from furniture tileset
   }
   ```

### 2. Update Pickup UI
Update [main.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/main.js).
1. Locate `showItemPickupModal`.
2. Add a new condition for your `type` to set the modal header label.
   ```javascript
   else if (data.type === 'custom_type') label.textContent = 'NEW CATEGORY ACQUIRED';
   ```

### 3. Implement Collection Logic
Update [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js).
1. Locate `collectItem(itemId, spotId)`.
2. Add a new `else if` block for your `itemType`.
3. Define what happens (e.g., update `gameState`, add to inventory, or trigger a story flag).
   ```javascript
   } else if (itemType === 'custom_type') {
       if (window.gameState) {
           // Logic here (e.g. window.gameState.myCustomList.push(itemId))
           if (window.addLog) window.addLog(`<span class="tactical">SYSTEM UPDATE:</span> ${itemInfo.name} synchronized.`);
       }
   }
   ```

### 4. Builder Tool Integration
> [!NOTE]
> **Automatic Update**: The Discovery Palette in the Builder Tool automatically searches `ITEM_PICKUP_DATA` for any key starting with `REWARD_`. 
> Your new item will appear as a clickable chip the next time you open Builder Mode!

### 5. Update Documentation
Add the new ID to the "Hidden Reward IDs" reference section in [MapBuilder.md](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/MapBuilder.md).

---

### ✅ Success Criteria
- [ ] The new item appears as a chip in the **Builder Tool** sidebar.
- [ ] Clicking the chip auto-fills the "Hidden Reward ID" field.
- [ ] Kicking/Interacting with furniture containing the ID triggers the **Pickup Modal**.
- [ ] The Modal Header shows the correct category label (e.g., "WEAPON ACQUIRED").
- [ ] The item is correctly added to the `gameState` or corresponding system.
- [ ] **Grammar Check**: Has the item description been polished?
