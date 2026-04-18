---
description: Manage and Add SFX to the Dynamic Audio Engine
---

### 🎧 The "Convention-Over-Configuration" System
The laboratory uses a **Layered Audio System**. As long as files are named correctly in the `assets/audio/` folder, the engine will automatically load and layer them.

### 1. Naming Convention
Place your `.mp3` files in `assets/audio/` using the following exact names:

| Interaction | Required Filename | Description |
| :--- | :--- | :--- |
| **Base Impact** | `impact_base.mp3` | The core "Thud" played for EVERY kick. |
| **Wood** | `impact_wood.mp3` | Secondary layer for wooden crates or desks. |
| **Glass** | `impact_glass.mp3` | High-pitched layer for tanks and tech. |
| **Liquid** | `impact_liquid.mp3` | Splash layer for specimen tanks. |
| **Metal** | `impact_metal.mp3` | Industrial clang for cabinets and machines. |
| **Bone** | `impact_bone.mp3` | Hollow rattle for skeletal remains. |
| **Plastic** | `impact_plastic.mp3` | Dull click for signs and light equipment. |
| **Carton** | `impact_carton.mp3` | Paper/Cardboard thud for boxes. |
| **Monsters** | `impact_monster.mp3` | Fleshy squish layer for **Wild Cells** (Auto-assigned). |
| **Homerun** | `kick_homerun.mp3` | Explosive launch and woosh sound. |
| **Shatter** | `shatter_tank.mp3` | The heavy crash for broken tanks. |
| **LC Loot** | `resource_collect_lc.mp3` | Ticking sound for physical credit collection (loop). |
| **BM Loot** | `resource_collect_bm.mp3` | Ticking sound for physical biomass collection (loop). |
| **LC Discovery** | `resource_spend_lc.mp3` | One-time "Kaching" for purchases or **Hidden Loot discovery**. |
| **BM Discovery** | `resource_spend_bm.mp3` | One-time sound for biomass spending or **Hidden Loot discovery**. |
| **Footstep (Tile)** | `footstep_tile.mp3` | **(Default)** Soft click for polished lab floors. |
| **Footstep (Metal)** | `footstep_metal.mp3` | Metallic clang for industrial/engine rooms. |
| **Footstep (Water)** | `footstep_water.mp3` | Splash sound for flooded or aquatic zones. |
| **Footstep (Grass)** | `footstep_grass.mp3` | Rustling sound for the Botanic Sector. |
| **Footstep (Bone)** | `footstep_bone.mp3` | Clicking sound for skeletal zones. |
| **Footstep (Plastic)** | `footstep_plastic.mp3` | Soft thud for plastic-covered floors. |
| **Modal Open** | `modal_open.mp3` | **(UI)** Generic opening sound for menus (Shop, Synthesis, etc). |
| **Modal Close** | `modal_close.mp3` | **(UI)** Generic closing sound for all modals. |
| **Acquisition** | `modal_pickup.mp3` | **(UI)** Special fanfare for Item/Cell/Log acquisition. |
| **Quest Clear** | `modal_quest_clear.mp3` | **(UI)** Mission Success summary sound. |
| **Major Win** | `modal_battle_win.mp3` | **(UI)** "EXPERIMENT SUCCESSFUL" battle result. |
| **Major Loss** | `modal_battle_lose.mp3` | **(UI)** "EXPERIMENT FAILED" battle result. |
| **Noti Level Up** | `noti_level_up.mp3` | **(UI)** Research Grade Increase (Cyan). |
| **Noti Task Start** | `noti_task_start.mp3` | **(UI)** New Mission Objective (Gold). |
| **Noti Task End** | `noti_task_end.mp3` | **(UI)** Mission Approved (Green). |
| **Noti Security** | `noti_security_alert.mp3` | **(UI)** Access Denied / Error (Red). |
| **Dialogue Open** | `dialogue_open.mp3` | **(UI)** Interaction Start / Box Appear. |
| **Dialogue Next** | `ui_page_turn.mp3` | **(UI)** RPG-style page advancement. |
| **Dialogue Close** | `dialogue_close.mp3` | **(UI)** Conversation Exit. |

### 2. Music (BGM) Convention
Background music loops automatically and cross-fades during screen transitions.

| Screen | Required Filename | Description |
| :--- | :--- | :--- |
| **Main Menu** | `music_main_menu.mp3` | Played on the title screen. |
| **Overworld** | `music_overworld.mp3` | Played while exploring the lab. |
| **Pre-Battle** | `music_pre_battle.mp3` | Played during the pre-battle sequence. |
| **Battle** | `music_battle.mp3` | Tactical battle theme. |

### 3. Implementation Rules
1.  **Defaults**: If a furniture item has NO material tag, it will only play `impact_base.mp3`.
2.  **Fallback**: If you define a material (e.g., `glass`) but haven't provided the file yet, the engine will safely skip that layer without crashing.
3.  **Monsters**: Any object with `type: 'npc'` automatically plays the `monster` layer.
4.  **Footsteps**: The engine always attempts to play `footstep_[tag].mp3`. If the file is missing, it **fails gracefully and falls back to `footstep_tile.mp3`**.

### 3. Assigning Footstep Tags to Maps
To change the walking sound for a whole map, add the `footstepTag` to the map's export object (e.g., in `atrium.js` or `oldMachine.js`):

```javascript
export const oldMachine = {
    name: 'THE OLD MACHINE',
    footstepTag: 'metal', // Options: tile | metal | water | grass | bone | plastic
    // ... rest of map data
};
```

### 3. Assigning Materials to Furniture
To give a specific object a unique sound, add the `material` tag in `overworld.js` -> `furnitureMetadata`:

```javascript
'f118': { 
    hasCollision: true, 
    material: 'glass' // Options: wood | glass | metal | liquid | monster | bone | plastic | carton
}
```

### 4. Multi-Layering (Advanced)
You can assign multiple materials by providing an array:
```javascript
'f118': { 
    material: ['glass', 'liquid'] // Plays Base + Glass + Liquid layers simultaneously
}
```

---

### ✅ Success Criteria
- [ ] New sound file is placed in `assets/audio/` with the correct name.
- [ ] The console log confirms the sound is loaded and playing upon interaction.
- [ ] Pitch is randomized (sounds slightly different on every hit).
