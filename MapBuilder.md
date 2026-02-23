# Map Builder Guide: Lab_TileSet_01

This document serves as the official reference for building levels using the `Lab_TileSet_01` and `Lab_TileSet_02` assets.

## 1. Tileset Specifications
- **Assets Name**: `Lab_TileSet_01.png` (Terrain), `Lab_TileSet_02.png` (Furniture / Props) (2048px Standard)
- **Logical Tile Size**: 256x256 pixels (Mapped via 1/4 scale: `calc(-Xpx / 4)`)
- **Format**: PNG with Transparency

---

## Room Tileset (Lab_TileSet_01)

| Tile ID | Description | X Position | Y Position |
| :--- | :--- | :--- | :--- |
| **0** | Corners-Top-Left | 0 | 0 |
| **1** | Corners-Top-Right | 512 | 0 |
| **2** | Corners-Bottom-Left | 0 | 512 |
| **3** | Corners-Bottom-Right | 512 | 512 |
| **4** | Corners-Inner-Top-Left | 768 | 0 |
| **5** | Corners-Inner-Top-Right | 1024 | 0 |
| **6** | Corners-Inner-Bottom-Left | 768 | 256 |
| **7** | Corners-Inner-Bottom-Right | 1024 | 256 |
| **8** | WallEdge-Top | 256 | 0 |
| **9** | WallEdge-Bottom | 256 | 512 |
| **10** | Wall-Left-Side (Standard Side Wall) | 0 | 256 |
| **11** | Wall-Right-Side (Standard Side Wall) | 512 | 256 |
| **12** | EmptyFill | 256 | 256 |
| **13** | Floor-Basic | 256 | 1280 |
| **14** | Wall-Center-Top (Top Tier) | 256 | 768 |
| **15** | Wall-Center-Bottom (Bottom Tier) | 256 | 1024 |
| **16** | Wall-Left-Top | 0 | 768 |
| **17** | Wall-Left-Bottom | 0 | 1024 |
| **18** | Wall-Right-Top | 512 | 768 |
| **19** | Wall-Right-Bottom | 512 | 1024 |
| **20** | Door-Edge-Bottom-Close | 768 | 512 |
| **21** | Door-Edge-Bottom-Open | 1024 | 512 |
| **22** | Door-Basic-Close | 768 | 768 |
| **23** | Door-Basic-Open | 1024 | 768 |
| **24** | Door-Edge-Left-Close | 1280 | 256 |
| **25** | Door-Edge-Right-Close | 1536 | 256 |
| **26** | Door-Edge-Left-Open | 1280 | 512 |
| **27** | Door-Edge-Right-Open | 1536 | 512 |
| **28** | Door-Basic-Locked | 768 | 1024 |
| **29** | Door-Edge-Bottom-Locked | 1024 | 1024 |
| **30** | Door-Edge-Left-Locked | 1280 | 1024 |
| **31** | Door-Edge-Right-Locked | 1536 | 1024 |
| **32** | Window-Basic | 1280 | 768 |

---

## Furniture Tileset (Lab_TileSet_02)
Used for atmospheric decoration via the `objects` system. Props follow the class convention `.world-object.prop.[propName]`.

| Furniture ID | Description | Dimension | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F0** | ChairA-Left | 1x1 | 0px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **F1** | ChairA-Right | 1x1 | 256px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **F2** | ChairA-Front | 1x1 | 512px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **F3** | TableA | 1x1 | 768px | 0px | Yes | Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee. |
| **F4** | TableB-Left | 1x1 | 1024px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **F5** | TableB-Right | 1x1 | 1280px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **F6** | WallHangingA | 1x1 | 1536px | 0px | No | A poster of Mitosis. Someone drew tiny screaming faces on the dividing cells. |
| **F7** | TableComputerA | 1x1 | 0px | 256px | Yes | Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history. |
| **F8** | TableLabCylindersA | 1x1 | 256px | 256px | Yes | Do not shake. Do not stir. In fact, just don't even look at it too hard. |
| **F9** | TableDeviceA | 1x1 | 512px | 256px | Yes | A protein sequencer that occasionally plays elevator music when it's bored. |
| **F10** | TableC-Top | 1x1 | 768px | 256px | No | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **F12** | TableC-Bottom | 1x1 | 768px | 512px | Yes | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **F13** | LabTankA-Top | 1x1 | 0px | 512px | No | This specimen has only one eye. The label say: DON'T LOOK AT ITS EYE. |
| **F14** | LabTankA-Bottom | 1x1 | 0px | 768px | Yes | This specimen has only one eye. The label say: DON'T LOOK AT ITS EYE. |
| **F15** | LabTankB-Top | 1x1 | 256px | 512px | No | The specimen here is slowly swimming, why its surrounding turn yellow?. |
| **F16** | LabTankB-Bottom | 1x1 | 256px | 768px | Yes | The specimen here is slowly swimming, why its surrounding turn yellow?. |
| **F17** | WallHangingB | 1x1 | 1792px | 0px | No | 'DAYS SINCE ACCIDENTAL MUTATION: 0'. Someone just crossed out the '1'. |
| **F18** | PotPlantA-Top | 1x1 | 1536px | 256px | No | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **F19** | PotPlantA-Bottom | 1x1 | 1536px | 512px | Yes | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **F20** | PotPlantB-Top | 1x1 | 1792px | 256px | No | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **F21** | PotPlantB-Bottom | 1x1 | 1792px | 512px | Yes | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **F22** | LabTankC-Top | 1x1 | 512px | 512px | No | Why did the cold specimen refuse to talk? Because it had Absolute Zero interest in you. |
| **F23** | LabTankC-Bottom | 1x1 | 512px | 768px | Yes | Why did the cold specimen refuse to talk? Because it had Absolute Zero interest in you. |
| **F24** | PotPlantC-Top | 1x1 | 1792px | 768px | No | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **F25** | PotPlantC-Bottom | 1x1 | 1792px | 1024px | Yes | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **F26** | TableD-Left | 1x1 | 1024px | 256px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **F27** | TableD-Right | 1x1 | 1280px | 256px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **F28** | TableLeaderA-Left | 1x1 | 1024px | 512px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **F29** | TableLeaderA-Right | 1x1 | 1280px | 512px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **F30** | TableDirectorA-Left | 1x1 | 1024px | 768px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **F31** | TableDirectorA-Right | 1x1 | 1280px | 768px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **F32** | BedA-Left | 1x1 | 1024px | 1024px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **F33** | BedA-Right | 1x1 | 1280px | 1024px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **F34** | SkeletonA-Top | 1x1 | 1536px | 768px | No | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **F35** | SkeletonA-Bottom | 1x1 | 1536px | 1024px | Yes | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **F36** | TableNoodleA | 1x1 | 1024px | 1280px | Yes | Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions. |
| **F37** | EmptyNoodleBowlA | 1x1 | 1280px | 1280px | Yes | An empty bowl. The salt levels within are high enough to preserve a whole lab tech. |
| **F38** | IncubatorA-TopLeft | 1x1 | 0px | 1024px | No | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F39** | IncubatorA-TopRight | 1x1 | 256px | 1024px | No | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F40** | IncubatorA-BottomLeft | 1x1 | 0px | 1280px | Yes | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F41** | IncubatorA-BottomRight | 1x1 | 256px | 1280px | Yes | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F42** | MegaIncubatorA-TopLeft | 1x1 | 512px | 1024px | No | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F43** | MegaIncubatorA-TopRight | 1x1 | 768px | 1024px | No | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F44** | MegaIncubatorA-MidLeft | 1x1 | 512px | 1280px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F45** | MegaIncubatorA-MidRight | 1x1 | 768px | 1280px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F46** | MegaIncubatorA-BottomLeft | 1x1 | 512px | 1536px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F47** | MegaIncubatorA-BottomRight | 1x1 | 768px | 1536px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F48** | BoxHandA | 1x1 | 768px | 768px | Yes | Labeled: 'DO NOT SHAKE'. |
| **F49** | KeyItem-DataPad | 1x1 | 1280px | 1792px | Yes | Mostly contains encrypted logs, but some files are just high-score records for 'Snake'. |
| **F50** | KeyItem-RoomKey | 1x1 | 1536px | 1792px | Yes | A magnetic keycard. Smells like the Director's expensive cologne. |
| **F51** | KeyItem-SauceBottle | 1x1 | 1792px | 1792px | Yes | Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal. |
| **F52** | Cabinet-Big-TopLeft | 1x1 | 1536px | 1280px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F53** | Cabinet-Big-TopRight | 1x1 | 1792px | 1280px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F54** | Cabinet-Big-BottomLeft | 1x1 | 1536px | 1536px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F55** | Cabinet-Big-BottomRight | 1x1 | 1792px | 1536px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F56** | TableLeaderB-Top | 1x1 | 1024px | 1536px | Yes | 'Why all the table has to be this meesy?' asked by the Janitor. |
| **F57** | TableLeaderB-Bottom | 1x1 | 1024px | 1792px | Yes | 'Why all the table has to be this meesy?' asked by the Janitor. |
| **F58** | Cabinet-Small | 1x1 | 1280px | 1536px | Yes | I can see the little cockcroach's crawing out! |
| **F59** | PotPlant-Small | 1x1 | 768px | 1792px | Yes | Look like normal plant, or is it? |
| **F60** | Cartonbox-Small | 1x1 | 512px | 1792px | Yes | This box is heavier than it look |
| **F61** | Cartonbox-Pile-Top | 1x1 | 256px | 1536px | No | Please don't fall on my head |
| **F62** | Cartonbox-Pile-Bottom | 1x1 | 256px | 1792px | Yes | Please don't fall on my head |
| **F63** | KeyItem-SecretCard | 1x1 | 0px | 1792px | Yes | This is the best ultimate super rare card ever! |

---

## 3. Implementation Logic (Collisions)
- **Solid (Walls)**: 0-11, 14-20, 22, 24-25, 28-31.
- **Walkable (Floor)**: 13, 21, 23, 26, 27.
- **Transitional (Doors)**: 20-27.

## 4. Building 2-Tile High Walls
To build a wall that spans two tiles high, use the Top and Bottom segments in vertical pairs:
```javascript
// Example vertical segment
[14], // Wall-Middle-Top
[15]  // Wall-Middle-Bottom
```
