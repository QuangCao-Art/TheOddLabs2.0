/**
 * Overworld Engine for The Odd Labs
 * Handles grid-based movement, collisions, and zone transitions.
 */

export const Overworld = {
    tileSize: 64,
    player: {
        x: 10,
        y: 8,
        targetX: 10,
        targetY: 8,
        direction: 'down',
        isMoving: false,
        moveSpeed: 350, // ms per tile
        stepParity: 0, // 0 or 1 for alternating steps
        currentFrame: 0 // 0-3 for manual frame control
    },
    keysPressed: new Set(),
    currentZone: 'lobby',
    mapData: null,
    controlsInitialized: false,
    isDialogueActive: false,
    isTyping: false,
    currentFullText: "",
    currentDialoguePartner: null,
    dialogueQueue: [],
    typingInterval: null,
    isTransitioning: false,
    isPaused: false,
    logsCollected: [], // Array of log IDs found
    lastTurnTime: 0,
    gameLoopActive: false,

    zones: {
        lobby: {
            name: 'LAB LOBBY',
            width: 11,
            height: 8,
            spawn: { x: 5, y: 6 },
            // Simplified grid for initialization (0=floor, 1=wall, 2=door, 3=interactable)
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 22, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 29, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'incubatorA-TL_lob', x: 1, y: 2, type: 'prop', name: 'Incubation Chamber' },
                { id: 'incubatorA-TR_lob', x: 2, y: 2, type: 'prop', name: 'Incubation Chamber' },
                { id: 'incubatorA-BL_lob', x: 1, y: 3, type: 'prop', name: 'Incubation Chamber' },
                { id: 'incubatorA-BR_lob', x: 2, y: 3, type: 'prop', name: 'Incubation Chamber' },
                // Diversified Corner Tank Arrays
                { id: 'labTankA-T_lob_tr', x: 9, y: 2, type: 'prop', name: 'Nutrient Tank' },
                { id: 'labTankA-B_lob_tr', x: 9, y: 3, type: 'prop', name: 'Nutrient Tank' },
                // Shifted Lower Tanks to North Wall per user request
                { id: 'labTankB-T_lob_bl', x: 7, y: 2, type: 'prop', name: 'Cryo Tank' },
                { id: 'labTankB-B_lob_bl', x: 7, y: 3, type: 'prop', name: 'Cryo Tank' },
                { id: 'labTankC-T_lob_br', x: 8, y: 2, type: 'prop', name: 'Chemical Reactor' },
                { id: 'labTankC-B_lob_br', x: 8, y: 3, type: 'prop', name: 'Chemical Reactor' },
                { id: 'jenzi', x: 4, y: 4, type: 'npc', name: 'Jenzi' },
                { id: 'chairA-R_lobby_wait1', x: 1, y: 5, type: 'prop', name: 'Lab Chair' },
                { id: 'chairA-R_lobby_wait2', x: 1, y: 6, type: 'prop', name: 'Lab Chair' },
                // Reception Desk
                { id: 'TableLeaderB-Top_reception', x: 8, y: 5, type: 'prop', name: 'Leader Desk', hiddenLogId: '002' },
                { id: 'TableLeaderB-Bottom_reception', x: 8, y: 6, type: 'prop', name: 'Leader Desk' },
                { id: 'chairA-L_reception_desk', x: 9, y: 5, type: 'prop', name: 'Lab Chair' },
                // Storage & Decor
                // PotPlants instead of cylinder tables
                { id: 'potPlantB-T_lob1', x: 4, y: 2, type: 'prop', name: 'Decorative Fern' },
                { id: 'potPlantB-B_lob1', x: 4, y: 3, type: 'prop', name: 'Decorative Fern', hiddenLogId: '001' },
                { id: 'potPlantB-T_lob2', x: 6, y: 2, type: 'prop', name: 'Decorative Fern' },
                { id: 'potPlantB-B_lob2', x: 6, y: 3, type: 'prop', name: 'Decorative Fern' },
                { id: 'wallHangingA_lob1', x: 3, y: 2, type: 'prop', name: 'Lab Protocol' },
                { id: 'npc_male_lob1', x: 7, y: 5, type: 'npc', name: 'Researcher Mark' }
            ],
            doors: [
                { x: 5, y: 2, targetZone: 'atrium', targetX: 9, targetY: 9 }
            ]
        },
        atrium: {
            name: 'MAIN ATRIUM',
            width: 19,
            height: 11,
            spawn: { x: 9, y: 9 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1], // Row 0 (Edge)
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11], // Row 1 (Mid-Top)
                [10, 15, 32, 32, 15, 15, 15, 15, 15, 22, 15, 15, 15, 15, 15, 32, 32, 15, 11], // Row 2 (Mid-Bottom + Windows)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 3
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 4 (Side Doors Closed - Human on right)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 5
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 6 (Kitchen opposite - Specimen Storage)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 7
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Row 8 (Storage Entrance / Entertainment Entrance)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 9
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 29, 29, 9, 9, 9, 3] // Row 10 (Bottom Gate + WC Pair on right)
            ],
            objects: [
                { id: 'PotPlant-Small_at3', x: 6, y: 9, type: 'prop', name: 'Atrium Decoration' },
                { id: 'PotPlant-Small_at4', x: 12, y: 9, type: 'prop', name: 'Atrium Decoration' },
                // North Stations
                { id: 'tableB-L_n1', x: 2, y: 3, type: 'prop', name: 'Lab Station' },
                { id: 'tableB-R_n1', x: 3, y: 3, type: 'prop', name: 'Lab Station' },
                { id: 'tableB-L_n2', x: 15, y: 3, type: 'prop', name: 'Lab Station' },
                { id: 'tableB-R_n2', x: 16, y: 3, type: 'prop', name: 'Lab Station' },
                { id: 'wallHangingA_at1', x: 7, y: 2, type: 'prop', name: 'Wall Plate' },
                { id: 'wallHangingA_at2', x: 11, y: 2, type: 'prop', name: 'Wall Plate' },
                // Corner Tank Arrays
                { id: 'labTankA-T_at_tl', x: 1, y: 2, type: 'prop', name: 'Corner Array' },
                { id: 'labTankA-B_at_tl', x: 1, y: 3, type: 'prop', name: 'Corner Array' },
                { id: 'labTankA-T_at_tr', x: 17, y: 2, type: 'prop', name: 'Corner Array' },
                { id: 'labTankA-B_at_tr', x: 17, y: 3, type: 'prop', name: 'Corner Array' },
                // Large Cabinets in the North Stations
                { id: 'Cabinet-Big-TopLeft_at1', x: 5, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'Cabinet-Big-TopRight_at1', x: 6, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'Cabinet-Big-BottomLeft_at1', x: 5, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'Cabinet-Big-BottomRight_at1', x: 6, y: 3, type: 'prop', name: 'Storage Cabinet' },

                { id: 'Cabinet-Big-TopLeft_at2', x: 12, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'Cabinet-Big-TopRight_at2', x: 13, y: 2, type: 'prop', name: 'Storage Cabinet' },
                { id: 'Cabinet-Big-BottomLeft_at2', x: 12, y: 3, type: 'prop', name: 'Storage Cabinet' },
                { id: 'Cabinet-Big-BottomRight_at2', x: 13, y: 3, type: 'prop', name: 'Storage Cabinet' },

                // Small Cabinets flanking the central path
                { id: 'Cabinet-Small_at1', x: 7, y: 3, type: 'prop', name: 'Supply Cabinet' },
                { id: 'Cabinet-Small_at2', x: 8, y: 3, type: 'prop', name: 'Supply Cabinet' },
                { id: 'Cabinet-Small_at3', x: 10, y: 3, type: 'prop', name: 'Supply Cabinet' },
                { id: 'Cabinet-Small_at4', x: 11, y: 3, type: 'prop', name: 'Supply Cabinet' },

                // Shifted from bottom to Northern Stations
                { id: 'labTankB-T_at_n1', x: 4, y: 2, type: 'prop', name: 'Station Tank' },
                { id: 'labTankB-B_at_n1', x: 4, y: 3, type: 'prop', name: 'Station Tank' },
                { id: 'labTankB-T_at_n2', x: 14, y: 2, type: 'prop', name: 'Station Tank' },
                { id: 'labTankB-B_at_n2', x: 14, y: 3, type: 'prop', name: 'Station Tank' },
                // Cluster A (West)
                { id: 'tableC-T_at_nw', x: 3, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'tableC-B_at_nw', x: 3, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'chairA-R_at_nw1', x: 2, y: 5, type: 'prop', name: 'Lab Chair' },
                { id: 'chairA-R_at_nw2', x: 2, y: 6, type: 'prop', name: 'Lab Chair' },
                { id: 'tableD-L_at_nw_s', x: 2, y: 7, type: 'prop', name: 'Analysis Table' },
                { id: 'tableD-R_at_nw_s', x: 3, y: 7, type: 'prop', name: 'Analysis Table' },
                { id: 'tableC-T_at1', x: 6, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'tableC-B_at1', x: 6, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'chairA-R_at3', x: 5, y: 5, type: 'prop', name: 'Lab Chair' },
                { id: 'chairA-R_at4', x: 5, y: 6, type: 'prop', name: 'Lab Chair' },
                { id: 'tableD-L_at1_s', x: 5, y: 7, type: 'prop', name: 'Analysis Table' },
                { id: 'tableD-R_at1_s', x: 6, y: 7, type: 'prop', name: 'Analysis Table' },
                // Cluster B (East) - Cleared per user request
                { id: 'tableD-L_atB1', x: 12, y: 5, type: 'prop', name: 'Executive Desk' },
                { id: 'tableD-R_atB1', x: 13, y: 5, type: 'prop', name: 'Executive Desk' },
                { id: 'tableD-L_atB2', x: 12, y: 7, type: 'prop', name: 'Executive Desk' },
                { id: 'tableD-R_atB2', x: 13, y: 7, type: 'prop', name: 'Executive Desk' },
                // Shifted LabTankC Units (Down 1 tile to overlap with Incubator top at y=5)
                { id: 'labTankC-T_at1', x: 15, y: 4, type: 'prop', name: 'Reactor Core' },
                { id: 'labTankC-B_at1', x: 15, y: 5, type: 'prop', name: 'Reactor Core' },
                { id: 'labTankC-T_at2', x: 16, y: 4, type: 'prop', name: 'Reactor Core' },
                { id: 'labTankC-B_at2', x: 16, y: 5, type: 'prop', name: 'Reactor Core' },
                // Mega Incubator (Genesis Machine) - (Shifted up 1 tile to y=5-7)
                { id: 'megaIncubatorA-TL_at1', x: 15, y: 5, type: 'prop', name: 'Mega Incubator' },
                { id: 'megaIncubatorA-TR_at1', x: 16, y: 5, type: 'prop', name: 'Mega Incubator' },
                { id: 'megaIncubatorA-midL_at1', x: 15, y: 6, type: 'prop', name: 'Mega Incubator' },
                { id: 'megaIncubatorA-midR_at1', x: 16, y: 6, type: 'prop', name: 'Mega Incubator' },
                { id: 'megaIncubatorA-BL_at1', x: 15, y: 7, type: 'prop', name: 'Mega Incubator' },
                { id: 'megaIncubatorA-BR_at1', x: 16, y: 7, type: 'prop', name: 'Mega Incubator' },
                // Cluster C (Central South)
                { id: 'tableC-T_at3', x: 8, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'tableC-B_at3', x: 8, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'tableC-T_at4', x: 10, y: 5, type: 'prop', name: 'Atrium Core Table' },
                { id: 'tableC-B_at4', x: 10, y: 6, type: 'prop', name: 'Atrium Core Table' },
                { id: 'PotPlant-Small_at6', x: 1, y: 9, type: 'prop', name: 'Atrium Decoration' },
                { id: 'PotPlant-Small_at7', x: 17, y: 9, type: 'prop', name: 'Atrium Decoration' },
                { id: 'npc_female_at1', x: 7, y: 7, type: 'npc', name: 'Assistant Sarah' },
                { id: 'npc_male_at1', x: 14, y: 7, type: 'npc', name: 'Researcher Mark' },
                { id: 'npc_male_at2', x: 2, y: 4, type: 'npc', name: 'Researcher Paul' },
                { id: 'npc_female_at2', x: 11, y: 4, type: 'npc', name: 'Scientist Julia' },
                { id: 'npc_male_at3', x: 11, y: 9, type: 'npc', name: 'Biologist Tom' }
            ],
            doors: [
                { x: 9, y: 10, targetZone: 'lobby', targetX: 5, targetY: 3 },
                { x: 0, y: 6, targetZone: 'kitchen', targetX: 9, targetY: 6 },
                { x: 0, y: 8, targetZone: 'entertainment', targetX: 6, targetY: 6 },
                { x: 18, y: 8, targetZone: 'storage', targetX: 1, targetY: 6 },
                { x: 0, y: 4, targetZone: 'botanic', targetX: 13, targetY: 13 },
                { x: 18, y: 4, targetZone: 'human', targetX: 1, targetY: 13 },
                { x: 18, y: 6, targetZone: 'specimenStorage', targetX: 1, targetY: 4 },
                { x: 9, y: 2, targetZone: 'executive', targetX: 7, targetY: 7 }
            ]
        },
        specimenStorage: {
            name: 'SPECIMEN STORAGE',
            width: 20,
            height: 7,
            spawn: { x: 1, y: 4 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1], // Row 0
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11], // Row 1
                [10, 15, 15, 15, 15, 15, 22, 15, 15, 15, 15, 15, 15, 28, 15, 15, 15, 15, 15, 11], // Row 2 (Unlocked Door to Human Ward)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 3
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 31], // Row 4
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Row 5
                [2, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 29, 9, 9, 9, 9, 9, 3] // Row 6 (Doors at x=6 and x=13)
            ],
            objects: [
                // Top Row of Tanks (Varied)
                { id: 'labTankA-T_spec1', x: 1, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec1', x: 1, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec2', x: 2, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec2', x: 2, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec3', x: 3, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec3', x: 3, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec4', x: 4, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec4', x: 4, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec5', x: 5, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec5', x: 5, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec6', x: 9, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec6', x: 9, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec7', x: 7, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec7', x: 7, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec8', x: 8, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec8', x: 8, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec10', x: 10, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec10', x: 10, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec11', x: 11, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec11', x: 11, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec12', x: 12, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec12', x: 12, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec14', x: 14, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec14', x: 14, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec15', x: 15, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec15', x: 15, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec16', x: 16, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec16', x: 16, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec17', x: 17, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec17', x: 17, y: 3, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec18', x: 18, y: 2, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec18', x: 18, y: 3, type: 'prop', name: 'Specimen Tank' },

                // Bottom Row of Tanks (Varied)
                { id: 'labTankA-T_spec19', x: 1, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec19', x: 1, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec20', x: 2, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec20', x: 2, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec21', x: 3, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec21', x: 3, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec22', x: 4, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec22', x: 4, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec23', x: 5, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec23', x: 5, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec24', x: 9, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec24', x: 9, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec25', x: 7, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec25', x: 7, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec26', x: 8, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec26', x: 8, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec28', x: 10, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec28', x: 10, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec29', x: 11, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec29', x: 11, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec30', x: 12, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec30', x: 12, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec32', x: 14, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec32', x: 14, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec33', x: 15, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec33', x: 15, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-T_spec34', x: 16, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankA-B_spec34', x: 16, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-T_spec35', x: 17, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankB-B_spec35', x: 17, y: 5, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-T_spec36', x: 18, y: 4, type: 'prop', name: 'Specimen Tank' },
                { id: 'labTankC-B_spec36', x: 18, y: 5, type: 'prop', name: 'Specimen Tank' }
            ],
            doors: [
                { x: 0, y: 4, targetZone: 'atrium', targetX: 17, targetY: 6 },
                { x: 6, y: 6, targetZone: 'storage', targetX: 5, targetY: 3 },
                { x: 6, y: 2, targetZone: 'human', targetX: 7, targetY: 14 }
            ]
        },
        old_lab: {
            name: 'THE OLD LAB (SECRET)',
            width: 11,
            height: 9,
            spawn: { x: 5, y: 7 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Exit to Atrium (Closed)
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'incubator_origin', x: 5, y: 2, width: 2, height: 2, type: 'trigger', name: 'ORIGIN INCUBATOR' },
                { id: 'log_999', x: 8, y: 6, type: 'log', name: 'DataLog #999' }
            ],
            doors: [
                { x: 0, y: 7, targetZone: 'atrium', targetX: 16, targetY: 7 }
            ]
        },
        botanic: {
            name: 'BOTANIC SECTOR',
            width: 15,
            height: 16,
            spawn: { x: 7, y: 13 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'lana', x: 7, y: 3, type: 'npc', name: 'Lana' },
                { id: 'log_089', x: 13, y: 13, type: 'log', name: 'DataLog #089' },
                // North Storage Row (y=3 with y=2 tops)
                { id: 'Cabinet-Big-TopLeft_bot1', x: 1, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Big-TopRight_bot1', x: 2, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Big-BottomLeft_bot1', x: 1, y: 3, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Big-BottomRight_bot1', x: 2, y: 3, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Small_bot1', x: 3, y: 3, type: 'prop', name: 'Supply Cabinet' },
                { id: 'Cabinet-Small_bot2', x: 11, y: 3, type: 'prop', name: 'Supply Cabinet' },
                { id: 'Cabinet-Big-TopLeft_bot2', x: 12, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Big-TopRight_bot2', x: 13, y: 2, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Big-BottomLeft_bot2', x: 12, y: 3, type: 'prop', name: 'Storage Unit' },
                { id: 'Cabinet-Big-BottomRight_bot2', x: 13, y: 3, type: 'prop', name: 'Storage Unit' },
                // Upper Garden Cluster (y=4,5,6,7) - STACK at x=4
                { id: 'potPlantC-T_bot1', x: 2, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot1', x: 2, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot2', x: 3, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot2', x: 3, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot3a', x: 4, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot3a', x: 4, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot3b', x: 4, y: 5, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot3b', x: 4, y: 6, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot3c', x: 4, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot3c', x: 4, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot4', x: 5, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot4', x: 5, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot5', x: 6, y: 4, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot5', x: 6, y: 5, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'labTankA-T_bot1', x: 8, y: 4, type: 'prop', name: 'Research Tank' }, { id: 'labTankA-B_bot1', x: 8, y: 5, type: 'prop', name: 'Research Tank' },
                { id: 'labTankA-T_bot2', x: 9, y: 4, type: 'prop', name: 'Research Tank' }, { id: 'labTankA-B_bot2', x: 9, y: 5, type: 'prop', name: 'Research Tank' },
                { id: 'incubatorA-TL_bot1', x: 10, y: 4, type: 'prop', name: 'Incubation Chamber' }, { id: 'incubatorA-TR_bot1', x: 11, y: 4, type: 'prop', name: 'Incubation Chamber' },
                { id: 'incubatorA-BL_bot1', x: 10, y: 5, type: 'prop', name: 'Incubation Chamber' }, { id: 'incubatorA-BR_bot1', x: 11, y: 5, type: 'prop', name: 'Incubation Chamber' },
                { id: 'labTankA-T_bot3', x: 12, y: 4, type: 'prop', name: 'Research Tank' }, { id: 'labTankA-B_bot3', x: 12, y: 5, type: 'prop', name: 'Research Tank' },
                { id: 'labTankA-T_bot4', x: 13, y: 4, type: 'prop', name: 'Research Tank' }, { id: 'labTankA-B_bot4', x: 13, y: 5, type: 'prop', name: 'Research Tank' },
                // Middle Garden Cluster (y=6,7)
                { id: 'potPlantC-T_bot6', x: 2, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot6', x: 2, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot7', x: 3, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot7', x: 3, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot9', x: 5, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot9', x: 5, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'potPlantC-T_bot10', x: 6, y: 6, type: 'prop', name: 'Bioluminescent Bush' }, { id: 'potPlantC-B_bot10', x: 6, y: 7, type: 'prop', name: 'Bioluminescent Bush' },
                { id: 'Cartonbox-Small_bot1', x: 8, y: 7, type: 'prop', name: 'Archived Samples' },
                { id: 'tableLeaderA-L_bot1', x: 9, y: 7, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'tableLeaderA-R_bot1', x: 10, y: 7, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'Cartonbox-Pile-Top_bot1', x: 11, y: 6, type: 'prop', name: 'Stacked Boxes' }, { id: 'Cartonbox-Pile-Bottom_bot1', x: 11, y: 7, type: 'prop', name: 'Stacked Boxes' },
                { id: 'KeyItem-SecretCard_bot1', x: 12, y: 7, type: 'prop', name: 'Access Key' },
                { id: 'Cartonbox-Pile-Top_bot2', x: 13, y: 6, type: 'prop', name: 'Stacked Boxes' }, { id: 'Cartonbox-Pile-Bottom_bot2', x: 13, y: 7, type: 'prop', name: 'Stacked Boxes' },
                // Refined Hedge Row (y=8) with Column 7 Path
                { id: 'PotPlant-Small_bot1', x: 1, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot2', x: 2, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot3', x: 3, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot4', x: 4, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot5', x: 5, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot6', x: 6, y: 8, type: 'prop', name: 'Decorative Bush' },
                // Path at x=7
                { id: 'PotPlant-Small_bot7', x: 8, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot8', x: 9, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot9', x: 10, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot10', x: 11, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot11', x: 12, y: 8, type: 'prop', name: 'Decorative Bush' },
                { id: 'PotPlant-Small_bot12', x: 13, y: 8, type: 'prop', name: 'Decorative Bush' },
                // Expanded Lower Garden Rows (y=9-12) - STACKS at x=4 and x=10
                { id: 'potPlantA-T_bot1', x: 2, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot1', x: 2, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot2', x: 3, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot2', x: 3, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot3a', x: 4, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot3a', x: 4, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot3b', x: 4, y: 10, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot3b', x: 4, y: 11, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot3c', x: 4, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot3c', x: 4, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot4', x: 5, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot4', x: 5, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot5', x: 6, y: 9, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot5', x: 6, y: 10, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantB-T_bot1', x: 8, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot1', x: 8, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot2', x: 9, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot2', x: 9, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot3a', x: 10, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot3a', x: 10, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot3b', x: 10, y: 10, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot3b', x: 10, y: 11, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot3c', x: 10, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot3c', x: 10, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot4', x: 11, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot4', x: 11, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot5', x: 12, y: 9, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot5', x: 12, y: 10, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantA-T_bot6', x: 2, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot6', x: 2, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot7', x: 3, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot7', x: 3, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot9', x: 5, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot9', x: 5, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantA-T_bot10', x: 6, y: 11, type: 'prop', name: 'Scented Specimen' }, { id: 'potPlantA-B_bot10', x: 6, y: 12, type: 'prop', name: 'Scented Specimen' },
                { id: 'potPlantB-T_bot6', x: 8, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot6', x: 8, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot7', x: 9, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot7', x: 9, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot9', x: 11, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot9', x: 11, y: 12, type: 'prop', name: 'Specimen Fern' },
                { id: 'potPlantB-T_bot10', x: 12, y: 11, type: 'prop', name: 'Specimen Fern' }, { id: 'potPlantB-B_bot10', x: 12, y: 12, type: 'prop', name: 'Specimen Fern' },
                // Final Station Wall (y=13,14)
                { id: 'Cartonbox-Pile-Top_bot3', x: 1, y: 13, type: 'prop', name: 'Stacked Boxes' }, { id: 'Cartonbox-Pile-Bottom_bot3', x: 1, y: 14, type: 'prop', name: 'Stacked Boxes' },
                { id: 'tableD-L_bot1', x: 2, y: 14, type: 'prop', name: 'Research Station' },
                { id: 'tableD-R_bot1', x: 3, y: 14, type: 'prop', name: 'Research Station' },
                { id: 'Cartonbox-Small_bot2', x: 4, y: 14, type: 'prop', name: 'Archived Samples' },
                { id: 'Cartonbox-Small_bot3', x: 5, y: 14, type: 'prop', name: 'Archived Samples' },
                { id: 'tableDeviceA_bot1', x: 6, y: 14, type: 'prop', name: 'Protein Sequencer' },
                { id: 'tableLabCylindersA_bot1', x: 8, y: 14, type: 'prop', name: 'Lab Cylinders' },
                { id: 'Cartonbox-Small_bot5', x: 9, y: 14, type: 'prop', name: 'Archived Samples' },
                { id: 'tableLeaderA-L_bot2', x: 10, y: 14, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'tableLeaderA-R_bot2', x: 11, y: 14, type: 'prop', name: 'Lead Analysis Desk' },
                { id: 'tableD-L_bot2', x: 12, y: 14, type: 'prop', name: 'Research Station' },
                { id: 'tableD-R_bot2', x: 13, y: 14, type: 'prop', name: 'Research Station' },
                // Staff NPCs
                { id: 'npc_male_bot1', x: 2, y: 13, type: 'npc', name: 'Researcher Evan' },
                { id: 'npc_female_bot1', x: 1, y: 5, type: 'npc', name: 'Scientist Clara' },
                { id: 'npc_male_bot2', x: 13, y: 9, type: 'npc', name: 'Tech Leo' },
                { id: 'npc_female_bot2', x: 9, y: 11, type: 'npc', name: 'Biologist Mia' }
            ],
            doors: [
                { x: 14, y: 13, targetZone: 'atrium', targetX: 1, targetY: 4 },
                { x: 7, y: 15, targetZone: 'kitchen', targetX: 7, targetY: 3 }
            ]
        },
        human: {
            name: 'HUMAN RESEARCH WARD',
            width: 15,
            height: 16,
            spawn: { x: 7, y: 13 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Exit to Atrium (Closed)
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'dyzes', x: 7, y: 3, type: 'npc', name: 'Dyzes' },
                { id: 'log_212', x: 7, y: 14, type: 'log', name: 'DataLog #212' },

                // Row 3 (Cabinets, Boxes, NPCs)
                { id: 'Cabinet-Big-TopLeft_hum1', x: 1, y: 2, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-TopRight_hum1', x: 2, y: 2, type: 'prop', name: 'Human Archive' },
                { id: 'Cabinet-Big-BottomLeft_hum1', x: 1, y: 3, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-BottomRight_hum1', x: 2, y: 3, type: 'prop', name: 'Human Archive' },

                { id: 'Cabinet-Big-TopLeft_hum2', x: 3, y: 2, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-TopRight_hum2', x: 4, y: 2, type: 'prop', name: 'Human Archive' },
                { id: 'Cabinet-Big-BottomLeft_hum2', x: 3, y: 3, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-BottomRight_hum2', x: 4, y: 3, type: 'prop', name: 'Human Archive' },

                { id: 'boxHandA_hum1', x: 5, y: 3, type: 'prop', name: 'Hand Samples' },
                { id: 'boxHandA_hum2', x: 9, y: 3, type: 'prop', name: 'Hand Samples' },

                { id: 'Cabinet-Big-TopLeft_hum3', x: 10, y: 2, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-TopRight_hum3', x: 11, y: 2, type: 'prop', name: 'Human Archive' },
                { id: 'Cabinet-Big-BottomLeft_hum3', x: 10, y: 3, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-BottomRight_hum3', x: 11, y: 3, type: 'prop', name: 'Human Archive' },

                { id: 'Cabinet-Big-TopLeft_hum4', x: 12, y: 2, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-TopRight_hum4', x: 13, y: 2, type: 'prop', name: 'Human Archive' },
                { id: 'Cabinet-Big-BottomLeft_hum4', x: 12, y: 3, type: 'prop', name: 'Human Archive' }, { id: 'Cabinet-Big-BottomRight_hum4', x: 13, y: 3, type: 'prop', name: 'Human Archive' },

                // Row 4-5 (Solid Stasis Row)
                { id: 'labTankC-T_hum_r1a', x: 1, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1a', x: 1, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1b', x: 2, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1b', x: 2, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1c', x: 3, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1c', x: 3, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1d', x: 4, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1d', x: 4, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1e', x: 5, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1e', x: 5, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1f', x: 6, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1f', x: 6, y: 5, type: 'prop', name: 'Stasis Tank' },

                { id: 'labTankC-T_hum_r1g', x: 8, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1g', x: 8, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1h', x: 9, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1h', x: 9, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1i', x: 10, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1i', x: 10, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1j', x: 11, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1j', x: 11, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1k', x: 12, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1k', x: 12, y: 5, type: 'prop', name: 'Stasis Tank' },
                { id: 'labTankC-T_hum_r1l', x: 13, y: 4, type: 'prop', name: 'Stasis Tank' }, { id: 'labTankC-B_hum_r1l', x: 13, y: 5, type: 'prop', name: 'Stasis Tank' },

                // Row 7 (Medical Row)
                { id: 'bedA-L_hum7a', x: 2, y: 7, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum7a', x: 3, y: 7, type: 'prop', name: 'Medical Pod' },
                { id: 'skeletonA-T_hum7', x: 4, y: 6, type: 'prop', name: 'Anatomical Model' }, { id: 'skeletonA-B_hum7', x: 4, y: 7, type: 'prop', name: 'Anatomical Model' },
                { id: 'bedA-L_hum7b', x: 5, y: 7, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum7b', x: 6, y: 7, type: 'prop', name: 'Medical Pod' },
                { id: 'bedA-L_hum7c', x: 8, y: 7, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum7c', x: 9, y: 7, type: 'prop', name: 'Medical Pod' },
                { id: 'bedA-L_hum7d', x: 11, y: 7, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum7d', x: 12, y: 7, type: 'prop', name: 'Medical Pod' },

                // Row 9 (Medical Row)
                { id: 'skeletonA-T_hum9a', x: 1, y: 8, type: 'prop', name: 'Anatomical Model' }, { id: 'skeletonA-B_hum9a', x: 1, y: 9, type: 'prop', name: 'Anatomical Model' },
                { id: 'bedA-L_hum9a', x: 2, y: 9, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum9a', x: 3, y: 9, type: 'prop', name: 'Medical Pod' },
                { id: 'bedA-L_hum9b', x: 5, y: 9, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum9b', x: 6, y: 9, type: 'prop', name: 'Medical Pod' },
                { id: 'skeletonA-T_hum9b', x: 7, y: 8, type: 'prop', name: 'Anatomical Model' }, { id: 'skeletonA-B_hum9b', x: 7, y: 9, type: 'prop', name: 'Anatomical Model' },
                { id: 'bedA-L_hum9c', x: 8, y: 9, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum9c', x: 9, y: 9, type: 'prop', name: 'Medical Pod' },
                { id: 'bedA-L_hum9d', x: 11, y: 9, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum9d', x: 12, y: 9, type: 'prop', name: 'Medical Pod' },
                { id: 'skeletonA-T_hum9c', x: 13, y: 8, type: 'prop', name: 'Anatomical Model' }, { id: 'skeletonA-B_hum9c', x: 13, y: 9, type: 'prop', name: 'Anatomical Model' },

                // Row 11 (Medical Row)
                { id: 'bedA-L_hum11a', x: 2, y: 11, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum11a', x: 3, y: 11, type: 'prop', name: 'Medical Pod' },
                { id: 'bedA-L_hum11b', x: 5, y: 11, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum11b', x: 6, y: 11, type: 'prop', name: 'Medical Pod' },
                { id: 'skeletonA-T_hum11', x: 7, y: 10, type: 'prop', name: 'Anatomical Model' }, { id: 'skeletonA-B_hum11', x: 7, y: 11, type: 'prop', name: 'Anatomical Model' },
                { id: 'bedA-L_hum11c', x: 8, y: 11, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum11c', x: 9, y: 11, type: 'prop', name: 'Medical Pod' },
                { id: 'bedA-L_hum11d', x: 11, y: 11, type: 'prop', name: 'Medical Pod' }, { id: 'bedA-R_hum11d', x: 12, y: 11, type: 'prop', name: 'Medical Pod' },

                // Row 14 (Desks & Devices)
                { id: 'tableDeviceA_hum14a', x: 1, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableLabCylindersA_hum14a', x: 2, y: 14, type: 'prop', name: 'Cylinder Array' },
                { id: 'tableDeviceA_hum14b', x: 3, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableDeviceA_hum14c', x: 4, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableDeviceA_hum14d', x: 5, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableLabCylindersA_hum14b', x: 6, y: 14, type: 'prop', name: 'Cylinder Array' },
                { id: 'tableDeviceA_hum14e', x: 8, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableDeviceA_hum14f', x: 9, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableLabCylindersA_hum14c', x: 10, y: 14, type: 'prop', name: 'Cylinder Array' },
                { id: 'tableDeviceA_hum14g', x: 11, y: 14, type: 'prop', name: 'Bio-Sampler' },
                { id: 'tableLabCylindersA_hum14d', x: 12, y: 14, type: 'prop', name: 'Cylinder Array' },
                { id: 'tableDeviceA_hum14h', x: 13, y: 14, type: 'prop', name: 'Bio-Sampler' }
            ],
            doors: [
                { x: 0, y: 13, targetZone: 'atrium', targetX: 17, targetY: 4 },
                { x: 7, y: 15, targetZone: 'specimenStorage', targetX: 6, targetY: 3 }
            ]
        },
        executive: {
            name: 'EXECUTIVE SUITE',
            width: 15,
            height: 9,
            spawn: { x: 7, y: 7 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'capsain', x: 7, y: 3, type: 'npc', name: 'Director Capsain' }
            ],
            doors: [
                { x: 7, y: 8, targetZone: 'atrium', targetX: 9, targetY: 3 }
            ]
        },
        kitchen: {
            name: 'STAFF KITCHEN',
            width: 11,
            height: 8,
            spawn: { x: 7, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 15, 15, 22, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 25], // Exit to Atrium (In the wall)
                [2, 9, 9, 9, 9, 9, 9, 20, 9, 9, 3]
            ],
            objects: [
                { id: 'tableB-L_kit', x: 5, y: 4, type: 'prop', name: 'Dining Table' },
                { id: 'tableB-R_kit', x: 6, y: 4, type: 'prop', name: 'Dining Table' },
                { id: 'chairA-F_kit1', x: 5, y: 5, type: 'prop', name: 'Kitchen Chair' },
                { id: 'chairA-F_kit2', x: 6, y: 5, type: 'prop', name: 'Kitchen Chair' },
                { id: 'tableComputerA_kit', x: 9, y: 4, type: 'prop', name: 'Staff PC' },
                { id: 'log_042', x: 9, y: 3, type: 'log', name: 'DataLog #042' }
            ],
            doors: [
                { x: 10, y: 6, targetZone: 'atrium', targetX: 1, targetY: 6 },
                { x: 7, y: 2, targetZone: 'botanic', targetX: 7, targetY: 14 },
                { x: 7, y: 7, targetZone: 'entertainment', targetX: 4, targetY: 3 }
            ]
        },
        storage: {
            name: 'STORAGE BAY',
            width: 10,
            height: 8,
            spawn: { x: 1, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 15, 22, 15, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 13, 13, 11],
                [24, 13, 13, 13, 13, 13, 13, 13, 13, 11], // Exit to Atrium (On the left wall)
                [2, 9, 9, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'log_012', x: 3, y: 3, type: 'log', name: 'DataLog #012' }
            ],
            doors: [
                { x: 0, y: 6, targetZone: 'atrium', targetX: 17, targetY: 8 },
                { x: 5, y: 2, targetZone: 'specimenStorage', targetX: 6, targetY: 6 }
            ]
        },
        entertainment: {
            name: 'ENTERTAINMENT LOUNGE',
            width: 8,
            height: 8,
            spawn: { x: 6, y: 6 },
            layout: [
                [0, 8, 8, 8, 8, 8, 8, 1],
                [10, 14, 14, 14, 14, 14, 14, 11],
                [10, 15, 15, 15, 22, 15, 15, 11],
                [10, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 11],
                [10, 13, 13, 13, 13, 13, 13, 25], // Exit to Atrium (On the right wall)
                [2, 9, 9, 9, 9, 9, 9, 3]
            ],
            objects: [
                { id: 'tableA_ent', x: 3, y: 4, type: 'prop', name: 'Gaming Table' },
                { id: 'chairA-R_ent', x: 2, y: 4, type: 'prop', name: 'Lounge Chair' },
                { id: 'chairA-L_ent', x: 4, y: 4, type: 'prop', name: 'Lounge Chair' },
                { id: 'wallHangingA_ent', x: 3, y: 2, type: 'prop', name: 'Art Display' },
                { id: 'log_077', x: 5, y: 5, type: 'log', name: 'DataLog #077' }
            ],
            doors: [
                { x: 7, y: 6, targetZone: 'atrium', targetX: 1, targetY: 8 },
                { x: 4, y: 2, targetZone: 'kitchen', targetX: 7, targetY: 6 }
            ]
        }
    },

    furnitureMetadata: {
        'chairA-L': { hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
        'chairA-R': { hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
        'chairA-F': { hasCollision: true, info: "Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job." },
        'tableA': { hasCollision: true, info: "Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee." },
        'tableB-L': { hasCollision: true, info: "So sturdy it once survived a localized gravity collapse. The equipment on it didn't." },
        'tableB-R': { hasCollision: true, info: "So sturdy it once survived a localized gravity collapse. The equipment on it didn't." },
        'wallHangingA': { hasCollision: false, info: "A poster of Mitosis. Someone drew tiny screaming faces on the dividing cells." },
        'tableComputerA': { hasCollision: true, info: "Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history." },
        'tableLabCylindersA': { hasCollision: true, info: "Do not shake. Do not stir. In fact, just don't even look at it too hard." },
        'tableDeviceA': { hasCollision: true, info: "A protein sequencer that occasionally plays elevator music when it's bored." },
        'tableC-T': { hasCollision: false, info: "A table usually surrounded by people arguing about whose lunch is missing from the fridge." },
        'tableC-B': { hasCollision: true, info: "A table usually surrounded by people arguing about whose lunch is missing from the fridge." },
        'labTankA-T': { hasCollision: false, info: "This specimen has only one eye. The label say: DON'T LOOK AT ITS EYE." },
        'labTankA-B': { hasCollision: true, info: "This specimen has only one eye. The label say: DON'T LOOK AT ITS EYE." },
        'labTankB-T': { hasCollision: false, info: "The specimen here is slowly swimming, why its surrounding turn yellow?." },
        'labTankB-B': { hasCollision: true, info: "The specimen here is slowly swimming, why its surrounding turn yellow?." },
        'wallHangingB': { hasCollision: false, info: "'DAYS SINCE ACCIDENTAL MUTATION: 0'. Someone just crossed out the '1'." },
        'potPlantA-T': { hasCollision: false, info: "Looks like a plant, smells like old gym socks. Science still isn't sure why." },
        'potPlantA-B': { hasCollision: true, info: "Looks like a plant, smells like old gym socks. Science still isn't sure why." },
        'potPlantB-T': { hasCollision: false, info: "Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship." },
        'potPlantB-B': { hasCollision: true, info: "Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship." },
        'labTankC-T': { hasCollision: false, info: ["Why did the cold specimen refuse to talk?", "Because it had Absolute Zero interest in you."] },
        'labTankC-B': { hasCollision: true, info: ["Why did the cold specimen refuse to talk?", "Because it had Absolute Zero interest in you."] },
        'potPlantC-T': { hasCollision: false, info: "The leaves are glowing. It might be happy, or it might be preparing for ignition." },
        'potPlantC-B': { hasCollision: true, info: "The leaves are glowing. It might be happy, or it might be preparing for ignition." },
        'tableD-L': { hasCollision: true, info: "Reserved for 'The Important People'. Includes a built-in panic button." },
        'tableD-R': { hasCollision: true, info: "Reserved for 'The Important People'. Includes a built-in panic button." },
        'tableLeaderA-L': { hasCollision: true, info: "Features a secret drawer for hiding snacks from the interns." },
        'tableLeaderA-R': { hasCollision: true, info: "Features a secret drawer for hiding snacks from the interns." },
        'tableDirectorA-L': { hasCollision: true, info: "Carved from obsidian glass. Legend says the Director actually sleeps under it." },
        'tableDirectorA-R': { hasCollision: true, info: "Carved from obsidian glass. Legend says the Director actually sleeps under it." },
        'bedA-L': { hasCollision: true, info: "A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days." },
        'bedA-R': { hasCollision: true, info: "A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days." },
        'skeletonA-T': { hasCollision: false, info: "A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised." },
        'skeletonA-B': { hasCollision: true, info: "A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised." },
        'tableNoodleA': { hasCollision: true, info: "Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions." },
        'emptyNoodleBowlA': { hasCollision: true, info: "An empty bowl. The salt levels within are high enough to preserve a whole lab tech." },
        'incubatorA-TL': { hasCollision: false, info: "A standard-issue Cell synthesis machine. Humms with the potential of new life." },
        'incubatorA-TR': { hasCollision: false, info: "A standard-issue Cell synthesis machine. Humms with the potential of new life." },
        'incubatorA-BL': { hasCollision: true, info: "A standard-issue Cell synthesis machine. Humms with the potential of new life." },
        'incubatorA-BR': { hasCollision: true, info: "A standard-issue Cell synthesis machine. Humms with the potential of new life." },
        'megaIncubatorA-BR': { hasCollision: true, info: "The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber." },
        'Cabinet-Big-TopLeft': { hasCollision: false, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'Cabinet-Big-TopRight': { hasCollision: false, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'Cabinet-Big-BottomLeft': { hasCollision: true, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'Cabinet-Big-BottomRight': { hasCollision: true, info: "Organized chaos. Opening it risks a landslide of clipboards and broken test tubes." },
        'TableLeaderB-Top': { hasCollision: true, info: "'Why all the table has to be this meesy?' asked by the Janitor." },
        'TableLeaderB-Bottom': { hasCollision: true, info: "'Why all the table has to be this meesy?' asked by the Janitor." },
        'Cabinet-Small': { hasCollision: true, info: "I can see the little cockcroach's crawing out!" },
        'boxHandA': { hasCollision: true, info: "Labeled: 'FRAGILE - BIOLOGICAL SAMPLES - DO NOT SHAKE'. It just made a sneeze sound." },
        'keyItem-DataPad': { hasCollision: true, info: "Mostly contains encrypted logs, but some files are just high-score records for 'Snake'." },
        'keyItem-RoomKey': { hasCollision: true, info: "A magnetic keycard. Smells like the Director's expensive cologne." },
        'keyItem-SauceBottle': { hasCollision: true, info: "Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal." },
        'chairC': { hasCollision: true, info: "A high-back executive chair that squeaks in a way that sounds suspiciously like judging your life choices." },
        'PotPlant-Small': { hasCollision: true, info: "Look like normal plant, or is it?" },
        'Cartonbox-Small': { hasCollision: true, info: "This box is heavier than it look" },
        'Cartonbox-Pile-Top': { hasCollision: false, info: "Please don't fall on my head" },
        'Cartonbox-Pile-Bottom': { hasCollision: true, info: "Please don't fall on my head" },
        'KeyItem-SecretCard': { hasCollision: true, info: "This is the best ultimate super rare card ever!" },
        'log': { hasCollision: false, info: "A data pad containing potentially sensitive research notes. Better give it a read." }
    },

    getFurnitureMeta(objId) {
        if (!objId) return null;
        const prefix = objId.split('_')[0];
        return this.furnitureMetadata[prefix] || null;
    },

    init() {
        console.log("Overworld Engine Starting...");
        // Use setTimeout to ensure the DOM has updated dimensions after showScreen
        setTimeout(() => {
            this.renderMap('lobby');
            this.setupControls();
            this.updatePlayerPosition();

            // Re-enable transitions after initial placement
            const playerEl = document.getElementById('player-sprite');
            const mapEl = document.getElementById('overworld-map');
            setTimeout(() => {
                if (playerEl) playerEl.classList.remove('no-transition');
                if (mapEl) mapEl.classList.remove('no-transition');
                this.startLoop();
            }, 100);
        }, 50);
    },

    renderMap(zoneId) {
        const zone = this.zones[zoneId];
        this.currentZone = zoneId;
        const viewport = document.getElementById('overworld-viewport');
        const mapEl = document.getElementById('overworld-map');

        mapEl.style.gridTemplateColumns = `repeat(${zone.width}, ${this.tileSize}px)`;
        mapEl.style.gridTemplateRows = `repeat(${zone.height}, ${this.tileSize}px)`;

        // Remove player sprite temporarily so it doesn't get purged by innerHTML = ''
        const playerSprite = document.getElementById('player-sprite');
        if (playerSprite && playerSprite.parentElement === mapEl) {
            mapEl.removeChild(playerSprite);
        }

        mapEl.innerHTML = '';

        // Build floor and walls based on layout array
        for (let y = 0; y < zone.height; y++) {
            for (let x = 0; x < zone.width; x++) {
                const tileID = zone.layout[y][x];
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.classList.add(`t-${tileID}`); // Class for the specific tile texture

                // Logic-based classes for collisions/interactions
                // CLOSED DOORS are walls, OPEN DOORS are floors
                const isClosedDoor = [20, 22, 24, 25, 28, 29, 30, 31].includes(tileID);
                const isOpenDoor = [21, 23, 26, 27].includes(tileID);
                const isGenericWall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 32].includes(tileID);

                if (isGenericWall || isClosedDoor) {
                    tile.classList.add('wall');
                } else {
                    tile.classList.add('floor');
                }

                if (isClosedDoor || isOpenDoor) {
                    tile.classList.add('door-tile');
                }

                // Add objects
                const obj = zone.objects.find(o => o.x === x && o.y === y);
                if (obj) {
                    // Hidden interactive markers removed as requested
                }

                mapEl.appendChild(tile);
            }
        }

        // DRAW OBJECT VISUALS
        zone.objects.forEach(obj => {
            // Include NPCs, props, signs, etc.
            if (obj.type === 'npc' || obj.type === 'prop' || obj.type === 'sign' || obj.id === 'incubator') {
                const el = document.createElement('div');

                // Class hierarchy: .world-object .[type] .[specific-id]
                el.id = `npc-${obj.id}`;
                const specificClass = obj.id.startsWith('npc_') ? obj.id.split('_').slice(0, 2).join('_') : obj.id.split('_')[0];
                el.className = `world-object ${obj.type} ${specificClass}`;

                // Add direction class if it's an NPC
                if (obj.type === 'npc') {
                    const dir = obj.direction || 'down';
                    el.classList.add(`face-${dir}`);
                }

                el.style.width = `${(obj.width || 1) * this.tileSize}px`;
                el.style.height = `${(obj.height || 1) * this.tileSize}px`;
                el.style.left = `${obj.x * this.tileSize}px`;
                el.style.top = `${obj.y * this.tileSize}px`;
                el.style.zIndex = obj.y + (obj.height || 1) + 10;

                // RPG Layering: If object has no collision, it should render over the player
                const meta = this.getFurnitureMeta(obj.id);
                if (meta && meta.hasCollision === false) {
                    el.classList.add('render-top');
                }

                mapEl.appendChild(el);
            }
        });

        // ENSURE PLAYER SPRITE EXISTS (persistent)
        if (!playerSprite) {
            const newSprite = document.createElement('div');
            newSprite.id = 'player-sprite';
            mapEl.appendChild(newSprite);
        } else if (playerSprite.parentElement !== mapEl) {
            // Re-attach to new map if Parent hierarchy changed
            mapEl.appendChild(playerSprite);
        }

        // Set player to spawn position
        this.player.x = zone.spawn.x;
        this.player.y = zone.spawn.y;

        // Ensure teleport is instant
        playerSprite.classList.add('no-transition');
        mapEl.classList.add('no-transition');
        this.updatePlayerPosition();

        document.getElementById('location-name').textContent = zone.name;
    },

    setupControls() {
        if (this.controlsInitialized) return;
        this.controlsInitialized = true;

        window.addEventListener('keydown', (e) => {
            if (document.getElementById('screen-overworld').classList.contains('hidden')) return;
            if (e.key.toLowerCase() === 'f') this.interact();
            if (e.key.toLowerCase() === 'escape') {
                document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
                document.getElementById('screen-main-menu').classList.remove('hidden');
            }
        });

        window.addEventListener('keydown', (e) => {
            if (document.getElementById('screen-overworld').classList.contains('hidden')) return;
            const key = e.key.toLowerCase();
            this.keysPressed.add(key);
            // No longer calling handleMovementInput directly to avoid repeat delay
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keysPressed.delete(key);
        });

        // Ensure loop starts if we regain focus
        window.addEventListener('focus', () => this.startLoop());
        window.addEventListener('blur', () => this.stopLoop());
    },

    startLoop() {
        if (this.gameLoopActive) return;
        this.gameLoopActive = true;
        this.gameLoop();
    },

    stopLoop() {
        this.gameLoopActive = false;
    },

    gameLoop() {
        if (!this.gameLoopActive) return;

        // Only run if overworld is visible
        const overworldVisible = !document.getElementById('screen-overworld').classList.contains('hidden');
        if (overworldVisible && !this.isPaused && !this.isTransitioning) {
            this.handleMovementInput();
        }

        requestAnimationFrame(() => this.gameLoop());
    },

    handleMovementInput() {
        if (this.player.isMoving || this.isDialogueActive || this.isTransitioning || this.isPaused) return;

        const move = { x: 0, y: 0 };
        const keys = Array.from(this.keysPressed);

        // Prioritize last key or specific order
        if (this.keysPressed.has('w') || this.keysPressed.has('arrowup')) move.y = -1;
        else if (this.keysPressed.has('s') || this.keysPressed.has('arrowdown')) move.y = 1;
        else if (this.keysPressed.has('a') || this.keysPressed.has('arrowleft')) move.x = -1;
        else if (this.keysPressed.has('d') || this.keysPressed.has('arrowright')) move.x = 1;

        if (move.x !== 0 || move.y !== 0) {
            this.tryMove(move.x, move.y);
        }
    },

    tryMove(dx, dy) {
        if (this.isDialogueActive || this.player.isMoving) return;

        // 1. Identify Target Direction
        let targetDir = this.player.direction;
        if (dx > 0) targetDir = 'right';
        if (dx < 0) targetDir = 'left';
        if (dy > 0) targetDir = 'down';
        if (dy < 0) targetDir = 'up';

        // 2. Turn-in-place Logic
        if (this.player.direction !== targetDir) {
            this.player.direction = targetDir;
            this.lastTurnTime = Date.now();
            this.updatePlayerPosition();
            return;
        }

        // 3. Movement Delay Logic (Turn-then-Walk Smoothing)
        // If we just turned, wait 150ms before allowing move
        const now = Date.now();
        if (now - this.lastTurnTime < 150) {
            return;
        }

        // 4. Movement Logic (only runs if already facing targetDir and delay passed)

        const nextX = this.player.x + dx;
        const nextY = this.player.y + dy;
        const zone = this.zones[this.currentZone];

        // Bounds Check
        if (nextX < 0 || nextX >= zone.width || nextY < 0 || nextY >= zone.height) return;

        // Wall Check (Tile classes)
        const tiles = document.querySelectorAll('#overworld-map .tile');
        const targetTileIndex = nextY * zone.width + nextX;
        const targetTile = tiles[targetTileIndex];

        if (!targetTile || targetTile.classList.contains('wall')) {
            // Restore Auto-Open Logic
            if (targetTile && targetTile.classList.contains('door-tile')) {
                const tileID = zone.layout[nextY][nextX];
                const doorMap = { 20: 21, 22: 23, 24: 26, 25: 27 };
                const isLocked = [28, 29, 30, 31].includes(tileID);

                if (doorMap[tileID] && !isLocked) {
                    targetTile.classList.remove('wall', `t-${tileID}`);
                    targetTile.classList.add('floor', `t-${doorMap[tileID]}`);
                } else {
                    this.updatePlayerPosition();
                    return;
                }
            } else {
                this.updatePlayerPosition();
                return;
            }
        }

        // Object Collision Check
        const isOccupied = zone.objects.some(obj => {
            // Check metadata override for collision
            const meta = this.getFurnitureMeta(obj.id);
            if (meta && meta.hasCollision === false) return false;

            const w = obj.width || 1;
            const h = obj.height || 1;
            return nextX >= obj.x && nextX < obj.x + w && nextY >= obj.y && nextY < obj.y + h;
        });

        if (isOccupied) {
            this.updatePlayerPosition();
            return;
        }

        // 4. Perform Movement
        this.player.isMoving = true;
        this.player.x = nextX;
        this.player.y = nextY;

        // Start Step Visuals (Idle Frame)
        this.player.currentFrame = this.player.stepParity * 2;
        this.updatePlayerPosition();

        // Midpoint Step (Handled via Timeout for perfect move sync)
        setTimeout(() => {
            if (this.player.isMoving) {
                this.player.currentFrame = (this.player.stepParity * 2) + 1;
                this.updatePlayerPosition();
            }
        }, this.player.moveSpeed / 2);

        setTimeout(() => {
            this.player.isMoving = false;
            this.player.stepParity = (this.player.stepParity + 1) % 2;
            this.player.currentFrame = this.player.stepParity * 2; // Next idle frame

            // CHECK FOR ZONE TRANSITION
            const door = zone.doors && zone.doors.find(d => d.x === nextX && d.y === nextY);
            if (door) {
                this.changeZone(door.targetZone, door.targetX, door.targetY);
                return; // Stop processing further movement if switching zones
            }

            // Check if we continue moving
            const stillHolding = [...this.keysPressed].some(k => ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k));

            if (stillHolding) {
                this.handleMovementInput();
            } else {
                this.updatePlayerPosition();
            }
        }, this.player.moveSpeed);
    },

    changeZone(zoneId, x, y) {
        console.log(`Changing Zone to: ${zoneId}`);
        this.isTransitioning = true;
        this.keysPressed.clear(); // Prevent immediate move in new zone

        const playerEl = document.getElementById('player-sprite');
        const mapEl = document.getElementById('overworld-map');

        // Disable transitions for instant teleport
        if (playerEl) {
            playerEl.classList.add('no-transition');
            playerEl.classList.remove('walking'); // Stop animation during teleport
        }
        if (mapEl) mapEl.classList.add('no-transition');

        // FORCE REFLOW
        if (playerEl) void playerEl.offsetHeight;
        if (mapEl) void mapEl.offsetHeight;

        this.renderMap(zoneId);
        this.player.x = x;
        this.player.y = y;
        this.updatePlayerPosition();

        // Release transition lock after a delay
        setTimeout(() => {
            if (playerEl) playerEl.classList.remove('no-transition');
            if (mapEl) mapEl.classList.remove('no-transition');
            this.isTransitioning = false;
        }, 200); // "Landing" delay
    },

    updatePlayerPosition() {
        const playerEl = document.getElementById('player-sprite');
        const mapEl = document.getElementById('overworld-map');
        const viewport = document.getElementById('overworld-viewport');
        const zone = this.zones[this.currentZone];

        if (playerEl) {
            // 1. Update Direction Class
            const directionClass = `face-${this.player.direction}`;
            if (!playerEl.classList.contains(directionClass)) {
                playerEl.classList.remove('face-up', 'face-down', 'face-left', 'face-right');
                playerEl.classList.add(directionClass);
            }

            // 2. Update Visual Frame
            playerEl.classList.remove('p-frame-0', 'p-frame-1', 'p-frame-2', 'p-frame-3');
            playerEl.classList.add(`p-frame-${this.player.currentFrame}`);

            // 3. Move Player relative to Map
            playerEl.style.transform = `translate(${this.player.x * this.tileSize}px, ${this.player.y * this.tileSize}px)`;
            playerEl.style.zIndex = this.player.y + 1 + 10;
        }

        // 2. Update Map Position (Camera Follow)
        const vWidth = viewport.clientWidth;
        const vHeight = viewport.clientHeight;

        // Target: Center the player in the viewport
        let mapX = (vWidth / 2) - (this.player.x * this.tileSize + this.tileSize / 2);
        let mapY = (vHeight / 2) - (this.player.y * this.tileSize + this.tileSize / 2);

        // Clamping (Don't scroll past map edges if map > viewport)
        if (zone.width * this.tileSize > vWidth) {
            mapX = Math.min(0, Math.max(vWidth - zone.width * this.tileSize, mapX));
        } else {
            mapX = (vWidth - zone.width * this.tileSize) / 2; // Keep centered if small
        }

        if (zone.height * this.tileSize > vHeight) {
            mapY = Math.min(0, Math.max(vHeight - zone.height * this.tileSize, mapY));
        } else {
            mapY = (vHeight - zone.height * this.tileSize) / 2; // Keep centered if small
        }

        mapEl.style.transform = `translate(${mapX}px, ${mapY}px)`;
    },

    interact() {
        if (this.isPaused) return;
        if (this.isDialogueActive) {
            if (this.isTyping) {
                // Instant Complete
                this.finishTyping();
            } else {
                this.nextDialogue();
            }
            return;
        }

        const zone = this.zones[this.currentZone];
        let targetX = this.player.x;
        let targetY = this.player.y;

        if (this.player.direction === 'up') targetY--;
        if (this.player.direction === 'down') targetY++;
        if (this.player.direction === 'left') targetX--;
        if (this.player.direction === 'right') targetX++;

        // 1. Check for NPCs
        const npc = zone.objects.find(o => o.type === 'npc' && o.x === targetX && o.y === targetY);
        if (npc) {
            this.startNPCInteraction(npc);
            return;
        }

        // 2. Check for Furniture / Props (Discovery vs. Lore)
        const obj = zone.objects.find(o => (o.type === 'prop' || o.id === 'incubator') &&
            targetX >= o.x && targetX < o.x + (o.width || 1) &&
            targetY >= o.y && targetY < o.y + (o.height || 1));

        if (obj) {
            const meta = this.getFurnitureMeta(obj.id);
            const hasCollision = meta ? meta.hasCollision : false;

            // Hidden Log Logic (Collision items only)
            if (hasCollision && obj.hiddenLogId && !this.logsCollected.includes(obj.hiddenLogId)) {
                this.collectLog(obj.hiddenLogId);
                return;
            }

            // Normal Lore Inspection
            if (meta && meta.info) {
                const infoLines = Array.isArray(meta.info) ? meta.info : [meta.info];
                this.showDialogue(obj.name || "Laboratory Asset", infoLines);
            } else {
                // Fallback for objects without metadata
                this.showDialogue(obj.name || "Object", [
                    `System initializing for: ${obj.name}...`,
                    `This biological entity is currently under observation.`,
                    `Please consult Director Capsain for further clearance.`
                ]);
            }
            return;
        }

        // 3. Tile Interaction (Special Locked Messages)
        if (targetX >= 0 && targetX < zone.width && targetY >= 0 && targetY < zone.height) {
            const tileID = zone.layout[targetY][targetX];
            const lockedTiles = [28, 29, 30, 31];

            if (lockedTiles.includes(tileID)) {
                // Check if it's the Atrium WC (coordinates 13,10 or 14,10 in Atrium)
                const isAtriumWC = this.currentZone === 'atrium' && targetY === 10 && (targetX === 13 || targetX === 14);

                if (isAtriumWC) {
                    this.showDialogue("Restroom Facility", [
                        "A stray Nitrophyl broke the pipes again.",
                        "Staff are 'regrettably' skipping sanitation protocols until it's fixed."
                    ]);
                } else if (this.currentZone === 'lobby' && targetX === 5 && targetY === 7) {
                    this.showDialogue("Security Gate", [
                        "This door is locked.",
                        "Where are you going, anyway?",
                        "My logs suggest there's nothing but empty arrays beyond this sector."
                    ]);
                } else {
                    this.showDialogue("Security Gate", [
                        "This door is locked.",
                        "Probably for saving the electric bill..."
                    ]);
                }
            }
        }
    },

    startNPCInteraction(npc) {
        console.log(`Talking to: ${npc.name}`);
        this.currentDialoguePartner = npc.id;

        // Make NPC face the player
        const oppDirections = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };
        npc.direction = oppDirections[this.player.direction] || 'down';

        const npcEl = document.getElementById(`npc-${npc.id}`);
        if (npcEl) {
            npcEl.classList.remove('face-up', 'face-down', 'face-left', 'face-right');
            npcEl.classList.add(`face-${npc.direction}`);
        }

        // Dialogue sequences from story_lore.md
        const dialogueDb = {
            'jenzi': [
                "Yo, Intern! Welcome to the Lab. I'm Jenzi.",
                "Don't let the 'Senior' title fool you, I'm just here for the vibes and the chaos.",
                "But fr, you need a Companion Cell if you're gonna survive the Director's mood swings.",
                "Go pick your starter from the Incubation Chamber, bestie! vibes are immaculate today."
            ],
            'lana': [
                "Wait. You've been poking around the botanical archives, haven't you?",
                "Look, I love these cells, but the Director says we have to keep the research classified.",
                "If you want that Old Lab Key, you'll have to prove you can handle the truth in a duel!"
            ],
            'dyzes': [
                "Lydrosome is a marvel of tactical evolution.",
                "But your presence here is... unscheduled.",
                "Let us see if your mind is as sharp as your cell's membrane."
            ],
            // Basic NPC archetypes (can be used as fallbacks)
            'npc_female': [
                "Working under Director Capsain is... intense. He's a visionary, but those vision quests take a toll.",
                "Have you checked the data logs? We've lost track of so many entries lately."
            ],
            'npc_male': [
                "Stay sharp, Intern. The cells in this ward are more reactive than usual today.",
                "If you see Jenzi, tell him the bio-sampler is ready. He's probably slacking in the lounge again."
            ]
        };

        // Random Dialogue Pools categorized by zone (from story_lore.md + new entries)
        const randomPools = {
            atrium: [
                ["Have you seen the latest readings on the Nitrophils?// They seem to have a higher metabolic rate whenever it's Noodle Tuesday.// Strange correlation."],
                ["The Director was shouting in the cafeteria again.// He called the Nitrophils 'bio-hazardous junk'// and threatened to incinerate any dish with a red stain.// I've never seen someone so angry at a cell."],
                ["I remember the Leak of '82... supposedly.// The Director still uses it as an excuse to ignore the Cells.// He calls them 'failed remnants of a dark day' whenever he's in a bad mood."],
                ["The Cells are so helpful! One of them helped me reorganize my entire filing cabinet.// Although, it did categorize everything by 'color' instead of 'alphabetical'."],
                ["Why is the vending machine always out of Spicy Peanuts?// I suspect the Director is buying the entire stock for his late-night shifts."],
                ["Did you hear? A junior intern claims to have seen a 'giant' cell in the old storage wing.// Probably just lack of sleep and too many energy drinks."],
                ["The new bio-blue interface is much easier on the eyes, don't you think?// It makes the whole lab feel more tactical and professional."],
                ["I tried to pet a Nitrophil today.// It was remarkably soft, and it just stared at my lunch with such intense, spicy curiosity.// They're almost... cute."],
                ["Did you know Lydrosomes can use their osmotic pressure to precisely target debris?// I saw one pressure-cleaning a set of microscopes in the breakroom yesterday.// Not a speck of dust left."],
                ["The Osmotic types are fascinating.// They can filter an entire liter of lab-grade water in under ten seconds.// We haven't had a clogged sink since they arrived."],
                ["Thermogenic cells like Nitrophil have a resting body temperature that could boil an egg.// The Director calls them 'walking fire hazards' and banned them from the executive floor."],
                ["I heard rumors from the Alpha-Beta Sector.// They're working on a 'Dual Combatant' pair called Dip-Alpha and Dip-Beta.// Apparently, they're inseparable.// If one goes down, it's a disaster for everyone's energy levels."],
                ["I saw a senior researcher trying to 'authenticate' a Bikini Card// using a high-powered electron microscope.// He claimed he was checking for 'tactical watermarks,//'but he hasn't blinked in three hours.// Curious dedication to the craft, really."],
                ["Why is everyone suddenly trading 'Swimsuit Variants' of the Cell cards?// I heard the holographic foil is made of 'distilled summer vibes'// and makes your Pellicle look 10% more fabulous.// I need one for... thermal testing."],
                ["I tried to explain my research to a Lydrosome,// but it just went right over its head.// I guess I shouldn't have expected it to absorb information that quickly.// It has zero osmotic interest in my career."],
                ["What if we synthesized a cell that only eats student loans?// We'd have to give it a very high affinity for 'depleted wallets' and 'unpaid interest'.// I think it's a Nobel Prize waiting to happen."],
                ["Did you know that some cells in the Botanic Sector can actually hear you scream?// Well, not 'hear' in the traditional sense, but they respond to high-frequency vibrations.// So if you're having a bad day, please scream quietly.// You're stressing the ferns."],
                ["I asked the Nitrophils if they knew any jokes about thermal dynamics.// They acts like they're too 'hot' to handle.// I really need to stop talking to the thermogenic specimens."],
                ["I've been calculating the trajectory of a Nitrophil launched from a high-pressure bio-chute.// If we get the angle right, we could technically deliver spicy noodles across the entire lab in 0.8 seconds.// The Director's office is right in the flight path, though."],
                ["Did you know the 'anti-slip' coating on the stairs is actually a layer of modified adhesive cells that 'lick' your shoes to keep them in place?// It works wonders, but the feeling of a thousand tiny tongues tasting your sneakers is... technically questionable.// And remarkably loud on quiet shifts."]
            ],
            lobby: [
                ["Welcome to Odd Labs!// Please keep your badge visible at all times and avoid the bio-hazard chutes."],
                ["The Incubation Chamber is just ahead.// Have you picked your signature cell yet? Career paths depend on it!"],
                ["Don't mind the security guards.// They're mostly here for... aesthetic compliance and to keep the cells in check."],
                ["If you're looking for the Director, he's usually in the Executive Suite.// Or hiding in the cafeteria during 'Noodle Tuesday'."],
                ["Stay sharp, Intern.// This lobby might look peaceful, but the research floors are quite the tactical maze."],
                ["I'm heading to the breakroom.// Apparently, the coffee machine finally stopped dispensing blue sludge."]
            ],
            botanic: [
                ["Lana is brilliant with those Cambihils, but she has to hide them when the Director walks by.// He calls them 'invasive weeds' and says they're a disgrace to the department."],
                ["Fun fact: Cambihils actually photosynthetic at a 15% higher efficiency rate// when they're near a window.// They're basically high-speed solar panels with leaves."],
                ["Watch out for the 'Canobolus' project in the Fungal Ward.// It’s a Ballistospore with a catapult mechanism.// They say it roots itself into the floor// and just starts peppering its target with high-pressure spores like a machine gun."],
                ["The humidity in here is great for the ferns, but it's murder on my paperwork."],
                ["Did you see the glowing hedge move?// Lana says it's just 'bio-active curiosity', but I'm not so sure."],
                ["Lana spends more time talking to the plants than most of us.// Can't blame her, really. At least the plants don't complain about data entry."],
                ["Lana claims her 'Bikini Collection' is purely for 'UV radiation benchmarks'.// Right... and I'm sure that floral-pattern one is for 'camouflaging with the hydrangeas'.// She's not fooling anyone."]
            ],
            human: [
                ["Working in Human Cell Research with Dyzes is great,// but the Lydrosomes keep trying to 'clean' my coffee mug with high-pressure jets. It's quite a messy way to start the morning."],
                ["Viral-type cells don't actually 'infect'—they just share data at a molecular level.// The Director hates them the most;// he says they're 'biological parasites' that should have been deleted years ago."],
                ["Sector 7 is trying to fix a 'buggy' mitochondria they're calling Mitonegy.// It’s supposed to act like a transformer, patching up colleagues' membranes automatically.// Sounds like a maintenance nightmare."],
                ["Have you seen the blueprints for the 'Kerashell'?// It's a Keratinocyte with an armor plates made of skin protein.// They say it can take a beating with almost zero energy cost.// I wish my lab coat was that durable."],
                ["I heard the Scavenger team in the basement is working on 'Chlarob'.// It's based on Chlamydia, but instead of making you sick, it's programmed to thieve energy from enemy cells. Tactical, but a bit creepy."],
                ["Micro-tactical data is coming in fast today.// Dyzes is going to be pleased with the latest Lydrosome stats."],
                ["I asked Dyzes for a Band-Aid after a papercut.// He tried to give me a 'Lydrosome-infused regenerating patch' that cost more than my monthly salary.// I just used a napkin instead."],
                ["Dyzes says the human-cell interface is 98% stable.// I'm just wondering about what happens with that last 2%."]
            ]
        };

        const key = npc.id.split('_')[0];
        let lines = dialogueDb[key] || ["..."];

        // Apply randomization to generic staff types based on location
        if (npc.id.startsWith('npc_male') || npc.id.startsWith('npc_female')) {
            // Determine pool based on zone
            let activePool = randomPools.atrium; // default
            if (this.currentZone === 'lobby') activePool = randomPools.lobby;
            if (this.currentZone === 'botanic') activePool = randomPools.botanic;
            if (this.currentZone === 'human') activePool = randomPools.human;
            if (this.currentZone === 'kitchen') activePool = randomPools.atrium;

            const randomIndex = Math.floor(Math.random() * activePool.length);
            lines = activePool[randomIndex];
        }

        this.showDialogue(npc.name, lines, npc.id);
    },

    collectLog(logId) {
        console.log(`Found DataLog: ${logId}`);
        this.logsCollected.push(logId);

        // Display the "Found" message
        this.showDialogue("Discovery", [`YOU FOUND A DATAPAD! [DataLog ${logId} archived for review]`]);

        // Dispatch event for UI/Inventory updates
        window.dispatchEvent(new CustomEvent('datalog-found', { detail: { id: logId } }));
    },

    showDialogue(name, lines, npcId = null) {
        this.isDialogueActive = true;

        // Parse '//' as a page break marker
        const parsedLines = [];
        lines.forEach(line => {
            if (typeof line === 'string' && line.includes('//')) {
                const segments = line.split('//').map(s => s.trim()).filter(s => s.length > 0);
                parsedLines.push(...segments);
            } else {
                parsedLines.push(line);
            }
        });

        this.dialogueQueue = [...parsedLines]; // Load parsed lines into queue

        const box = document.getElementById('dialogue-box');
        const nameEl = document.getElementById('dialogue-name');
        const portraitOverlay = document.getElementById('npc-portrait-overlay');
        const portraitImg = document.getElementById('npc-portrait-img');

        if (box) box.classList.remove('hidden');
        if (nameEl) nameEl.textContent = name;

        // Reset and Show Portrait if applicable
        if (portraitOverlay && portraitImg) {
            portraitOverlay.classList.add('hidden');
            portraitImg.src = '';

            const portraitMap = {
                'jenzi': 'Character_FullArt_Jenzi.png',
                'lana': 'Character_FullArt_Lana.png',
                'dyzes': 'Character_FullArt_Dyzes.png',
                'capsain': 'Character_FullArt_Director.png',
                'npc_female': 'Character_FullArt_NPC_Female.png',
                'npc_male': 'Character_FullArt_NPC_Male.png'
            };

            const key = npcId ? (npcId.startsWith('npc_') ? npcId.split('_').slice(0, 2).join('_') : npcId.split('_')[0]) : null;
            if (key && portraitMap[key]) {
                portraitImg.src = `assets/images/${portraitMap[key]}`;
                portraitOverlay.classList.remove('hidden');
            }
        }

        this.nextDialogue();
    },

    nextDialogue() {
        if (this.dialogueQueue.length === 0) {
            this.closeDialogue();
            return;
        }

        const text = this.dialogueQueue.shift();
        this.typeText(text);
    },

    typeText(text) {
        const textEl = document.getElementById('dialogue-text');
        if (!textEl) return;

        this.isTyping = true;
        this.currentFullText = text;
        textEl.textContent = '';
        let i = 0;

        if (this.typingInterval) clearInterval(this.typingInterval);

        this.typingInterval = setInterval(() => {
            textEl.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(this.typingInterval);
                this.isTyping = false;
            }
        }, 25);
    },

    finishTyping() {
        if (this.typingInterval) clearInterval(this.typingInterval);
        const textEl = document.getElementById('dialogue-text');
        if (textEl) textEl.textContent = this.currentFullText;
        this.isTyping = false;
    },

    closeDialogue() {
        this.isDialogueActive = false;
        document.getElementById('dialogue-box')?.classList.add('hidden');
        document.getElementById('npc-portrait-overlay')?.classList.add('hidden');
        this.currentDialoguePartner = null;
    }
};
