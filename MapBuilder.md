# Map Builder Guide: Lab_TileSet_01

This document serves as the official reference for building levels using the `Lab_TileSet_01` and `Lab_TileSet_02` assets.

## 1. Tileset Specifications
- **Assets Name**: `Lab_TileSet_01.png` (Terrain), `Lab_TileSet_02.png` (Furniture / Props), `Lab_TileSet_Cells.png` (Encounter Cells) (2048px Standard)
- **Logical Tile Size**: 256x256 pixels (Mapped via 1/4 scale: `calc(-Xpx / 4)`)
- **Format**: PNG with Transparency
---
- **Important note**: Whenever receive a add more furniture or update furniture request, always check the overworld.js and style.css to make sure the furniture is added to the game correctly. 
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
| **33** | Window-FullWall | 1536 | 768 |
| **34** | Door-Secret-Open | 768 | 1280 |
| **35** | Door-Edge-Bottom-Secret-Open | 1024 | 1280 |
| **36** | Door-Edge-Right-Secret-Open | 1280 | 1280 |
| **37** | Door-Edge-Left-Secret-Open | 1536 | 1280 |
| **38** | Floor-SideDeco | 0 | 1280 |
| **39** | Hidden-Door-Basic-Closed | 256 | 1024 |
| **40** | Hidden-Door-Bottom-Closed | 256 | 512 |
| **41** | Hidden-Door-Right-Closed | 512 | 256 |
| **42** | Hidden-Door-Left-Closed | 0 | 256 |

---

## Furniture Tileset (Lab_TileSet_02)
Used for atmospheric decoration via the `objects` system. Props follow the class convention `.world-object.prop.[propName]`.

| Furniture ID | Description | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **f0** | ChairA-Left | 0px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f1** | ChairA-Right | 256px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f2** | ChairA-Front | 512px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f3** | TableA | 768px | 0px | Yes | Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee. |
| **f4** | TableB-Left | 1024px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **f5** | TableB-Right | 1280px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **f6** | WallHangingA | 1536px | 0px | Yes | A poster showing the evolution of Cells. Sadly, the dev lacked resources to implement these. |
| **f7** | TableComputerA | 0px | 256px | Yes | Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history. |
| **f8** | TableLabCylindersA | 256px | 256px | Yes | Do not shake. Do not stir. In fact, just don't even look at it too hard. |
| **f9** | TableDeviceA | 512px | 256px | Yes | A protein sequencer that occasionally plays elevator music when it's bored. |
| **f11** | TableC-Top | 768px | 256px | Yes | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **f12** | TableC-Bottom | 768px | 512px | Yes | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **f13** | LabTankGreen-Top | 0px | 512px | No | This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE. |
| **f14** | LabTankGreen-Bottom | 0px | 768px | Yes | This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE. |
| **f15** | LabTankBlue-Top | 256px | 512px | No | Why did the cold specimen refuse to talk? Because it had Absolute Zero interest in you. |
| **f16** | LabTankBlue-Bottom | 256px | 768px | Yes | Why did the cold specimen refuse to talk? Because it had Absolute Zero interest in you. |
| **f17** | WallHangingB | 1792px | 0px | Yes | A poster showing three creature races. Or perhaps they aren't simply 'races'... |
| **f18** | PotPlantA-Top | 1536px | 256px | No | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **f19** | PotPlantA-Bottom | 1536px | 512px | Yes | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **f20** | PotPlantB-Top | 1792px | 256px | No | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **f21** | PotPlantB-Bottom | 1792px | 512px | Yes | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **f22** | LabTankRed-Top | 512px | 512px | No | The specimen here is slowly swimming; why are its surroundings turning yellow? |
| **f23** | LabTankRed-Bottom | 512px | 768px | Yes | The specimen here is slowly swimming; why are its surroundings turning yellow? |
| **f24** | PotPlantC-Top | 1792px | 768px | No | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **f25** | PotPlantC-Bottom | 1792px | 1024px | Yes | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **f26** | TableD-Left | 1024px | 256px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **f27** | TableD-Right | 1280px | 256px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **f28** | TableLeaderA-Left | 1024px | 512px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **f29** | TableLeaderA-Right | 1280px | 512px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **f30** | TableDirectorA-Left | 1024px | 768px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **f31** | TableDirectorA-Right | 1280px | 768px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **f32** | BedA-Left | 1024px | 1024px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **f33** | BedA-Right | 1280px | 1024px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **f34** | SkeletonA-Top | 1536px | 768px | No | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **f35** | SkeletonA-Bottom | 1536px | 1024px | Yes | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **f36** | TableNoodleA | 1024px | 1280px | Yes | Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions. |
| **f37** | EmptyNoodleBowlA | 1280px | 1280px | Yes | An empty bowl. The salt levels within are high enough to preserve a whole lab tech. |
| **f38** | IncubatorA-TopLeft | 0px | 1024px | No | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f39** | IncubatorA-TopRight | 256px | 1024px | No | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f40** | IncubatorA-BottomLeft | 0px | 1280px | Yes | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f41** | IncubatorA-BottomRight | 256px | 1280px | Yes | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f42** | BioExtractorA-TopLeft | 512px | 1024px | No | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f43** | BioExtractorA-TopRight | 768px | 1024px | No | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f44** | BioExtractorA-MidLeft | 512px | 1280px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f45** | BioExtractorA-MidRight | 768px | 1280px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f46** | BioExtractorA-BottomLeft | 512px | 1536px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f47** | BioExtractorA-BottomRight | 768px | 1536px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f48** | BoxHandA | 768px | 768px | Yes | Labeled: 'DO NOT SHAKE'. |
| **f49** | KeyItem-DataPad | 1280px | 1792px | Yes | Mostly contains encrypted logs, but some files are just high-score records for 'Snake'. |
| **f50** | KeyItem-RoomKey | 1536px | 1792px | Yes | A magnetic keycard. Smells like the Director's expensive cologne. |
| **f51** | KeyItem-SauceBottle | 1792px | 1792px | Yes | Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal. |
| **f52** | Cabinet-Big-TopLeft | 1536px | 1280px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f53** | Cabinet-Big-TopRight | 1792px | 1280px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f54** | Cabinet-Big-BottomLeft | 1536px | 1536px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f55** | Cabinet-Big-BottomRight | 1792px | 1536px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f56** | TableLeaderB-Top | 1024px | 1536px | Yes | "Why do all the tables have to be this messy?" asked the janitor. |
| **f57** | TableLeaderB-Bottom | 1024px | 1792px | Yes | "Why do all the tables have to be this messy?" asked the janitor. |
| **f58** | Cabinet-Small | 1280px | 1536px | Yes | I can see the little cockroaches crawling out! |
| **f59** | PotPlant-Small | 768px | 1792px | Yes | Looks like a normal plant... or is it? |
| **f60** | Cartonbox-Small | 512px | 1792px | Yes | This box is heavier than it looks. |
| **f61** | Cartonbox-Pile-Top | 256px | 1536px | No | Please don't fall on my head |
| **f62** | Cartonbox-Pile-Bottom | 256px | 1792px | Yes | Please don't fall on my head |
| **f63** | KeyItem-SecretCard | 0px | 1792px | Yes | This is the best ultimate super rare card ever! |

---

## Furniture Tileset (Lab_TileSet_03)
Used for advanced lab equipment and specialized props. Texture asset: `Lab_TileSet_03.png`.

| Furniture ID | Description | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **f64** | KeyItem-OldDataStick | 0px | 0px | Yes | Ancient people used this to store data! |
| **f65** | CryoPod-Left | 256px | 0px | Yes | Whatever is lying here doesn't look exactly human; it'd better be! |
| **f66** | CryoPod-Right | 512px | 0px | Yes | Whatever is lying here doesn't look exactly human; it'd better be! |
| **f67** | VendingMachine-TopLeft | 0px | 256px | No | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f68** | VendingMachine-TopRight | 256px | 256px | No | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f69** | VendingMachine-BottomLeft | 0px | 512px | Yes | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f70** | VendingMachine-BottomRight | 256px | 512px | Yes | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f71** | BattleMachine-TopLeft | 512px | 256px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f72** | BattleMachine-TopRight | 768px | 256px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f73** | BattleMachine-BottomLeft | 512px | 512px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f74** | BattleMachine-BottomRight | 768px | 512px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f75** | Item-CollectibleCard | 768px | 0px | Yes | Just collect them all! |
| **f76** | Bookshelf-TopLeft | 1024px | 256px | No | These books are surprisingly well preserved! |
| **f77** | Bookshelf-TopRight | 1280px | 256px | No | These books are surprisingly well preserved! |
| **f78** | Bookshelf-BottomLeft | 1024px | 512px | Yes | These books are surprisingly well preserved! |
| **f79** | Bookshelf-BottomRight | 1280px | 512px | Yes | These books are surprisingly well preserved! |
| **f80** | CryoPodBig-TopLeft | 1536px | 256px | No | Stay cool—we'll be out in a century or two. |
| **f81** | CryoPodBig-TopRight | 1792px | 256px | No | Stay cool—we'll be out in a century or two. |
| **f82** | CryoPodBig-BottomLeft | 1536px | 512px | Yes | Stay cool—we'll be out in a century or two. |
| **f83** | CryoPodBig-BottomRight | 1792px | 512px | Yes | Stay cool—we'll be out in a century or two. |
| **f84** | StoragePod-Top | 1792px | 768px | Yes | Whatever is kept inside is in a deep freeze state! |
| **f85** | StoragePod-Bottom | 1792px | 1024px | Yes | Whatever is kept inside is in a deep freeze state! |
| **f86** | HealthyAncientPlant-Top | 1536px | 768px | No | People are trying to bring this ancient plant back; sometimes it's a success! |
| **f87** | HealthyAncientPlant-Bottom | 1536px | 1024px | Yes | People are trying to bring this ancient plant back; sometimes it's a success! |
| **f88** | DeadAncientPlant-Top | 1280px | 768px | No | People are trying to bring this ancient plant back; sometimes it's a failure! |
| **f89** | DeadAncientPlant-Bottom | 1280px | 1024px | Yes | People are trying to bring this ancient plant back; sometimes it's a failure! |
| **f90** | KeyItem-Official Employee Card | 1024px | 0px | Yes | You are now a truly member of the pack! |
| **f91** | Empty Pot | 1280px | 0px | Yes | Empty ceramic pot. |
| **f92** | CellAccelerator-TopLeft | 0px | 1280px | No | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f93** | CellAccelerator-TopMid | 256px | 1280px | No | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f94** | CellAccelerator-TopRight | 512px | 1280px | No | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f95** | CellAccelerator-MidLeft | 0px | 1536px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f96** | CellAccelerator-MidMid | 256px | 1536px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f97** | CellAccelerator-MidRight | 512px | 1536px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f98** | CellAccelerator-BottomLeft | 0px | 1792px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f99** | CellAccelerator-BottomMid | 256px | 1792px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f100** | CellAccelerator-BottomRight | 512px | 1792px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f101** | Item-CellBlueprint | 1536px | 0px | Yes | Contains the complex genomic blueprint of a Cell. It's essentially the ultimate 'cheat sheet' for biological reconstruction. |
| **f102** | Item-BioMass | 1792px | 0px | Yes | A container of stabilized raw biological material. It smells faintly of damp earth and limitless potential. |
| **f103** | HugePetryDish | 0px | 768px | Yes | An oversized cultivation dish designed for Cell. It's climate-controlled and remarkably soft—essentially a luxury suite for a Cell. |
| **f104** | Item-LabCredit | 256px | 768px | Yes | An internal currency chip exclusive to Labs. What started as a corporate joke became the only way to pay for the 'premium' noodles. |
| **f105** | WarningSign-Front | 512px | 768px | Yes | Nothing can stop me, even when the sign says so. |
| **f106** | WarningSign-Side | 768px | 768px | Yes | Nothing can stop me; turning the sign sideways won't help. |
| **f107** | Mr-Slim-Top | 1024px | 768px | No | This skeleton robot has an auto-assemble function; otherwise, it's a real mess. |
| **f108** | Mr-Slim-Bottom | 1024px | 1024px | Yes | This skeleton robot has an auto-assemble function; otherwise, it's a real mess. |
| **f109** | HugeTwoStoryPetryDish-Top | 1536px | 1280px | No | An oversized cultivation dish designed for Cells. It's the same model used in the main lab, but standing two stories tall. |
| **f110** | HugeTwoStoryPetryDish-Bottom | 1536px | 1536px | Yes | An oversized cultivation dish designed for Cells. It's the same model used in the main lab, but standing two stories tall. |
| **f111** | MobileMonitorCabinet-Top | 1792px | 1280px | No | A mobile cabinet equipped with a monitor screen, for those who want to keep an eye on their stuff... all the time! |
| **f112** | MobileMonitorCabinet-Bottom | 1792px | 1536px | Yes | A mobile cabinet equipped with a monitor screen, for those who want to keep an eye on their stuff... all the time! |

---

## Encounter Cell Tileset (Lab_TileSet_Cells)
Used for wild cell encounters. Props follow the class convention `.world-object.cell.[cellName]`.

| furniture ID | Description | Dimension | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C0** | Stemmy | 1x1 | 0px | 0px | Yes | A wild Stemmy is wandering. |
| **C1** | Cambihil | 1x1 | 0px | 256px | Yes | A wild Cambihil is looking for leaf. |
| **C2** | Lydrosome | 1x1 | 0px | 512px | Yes | A wild Lydrosome is watching a lab tube. |
| **C3** | Nitrophil | 1x1 | 0px | 768px | Yes | A wild Nitrophil is searching for food. |

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

## 5. Hidden Reward IDs (Builder Tool Reference)
When using the **HIDDEN REWARD ID** field in the Builder Tool, you can use any ID from `ITEM_PICKUP_DATA`. Here are common ones:

### Resources
- `REWARD_CREDITS_50` - 50 Lab Credits
- `REWARD_CREDITS_100` - 100 Lab Credits
- `REWARD_CREDITS_250` - 250 Lab Credits
- `REWARD_CREDITS_10` - 10 Lab Credits (Tiny cache)
- `REWARD_CREDITS_50` - 50 Lab Credits (Small cache)
- `REWARD_CREDITS_100` - 100 Lab Credits (Secure cache)
- `REWARD_CREDITS_250` - 250 Lab Credits (Executive cache)
- `REWARD_BIOMASS_20` - 20 Biomass (Small container)
- `REWARD_BIOMASS_50` - 50 Biomass (Bulk container)
- `REWARD_BIOMASS_100` - 100 Biomass (Major container)

### Special Item Protocols (Blueprints)
- `REWARD_BLUEPRINT_STEMMY` - Blueprint for Stemmy
- `REWARD_BLUEPRINT_NITROPHIL` - Blueprint for Nitrophil
- `REWARD_BLUEPRINT_CAMBIHIL` - Blueprint for Cambihil
- `REWARD_BLUEPRINT_LYDROSOME` - Blueprint for Lydrosome

### Collectible Cards
- `REWARD_CARD_STEMMY` - Stemmy Card
- `REWARD_CARD_NITROPHIL` - Nitrophil Card
- `REWARD_CARD_CAMBIHIL` - Cambihil Card
- `REWARD_CARD_LYDROSOME` - Lydrosome Card

### Legacy Datalogs
- `Log001` - Atrium Intro
- `Log002` - First Discovery
- *(Use 3-digit numeric codes like 004, 005 for basic pads)*
