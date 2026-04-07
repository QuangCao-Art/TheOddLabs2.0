/**
 * Registry of Furniture Templates for Builder Mode
 * Defines how multi-tile objects are constructed.
 */

export const FURNITURE_TEMPLATES = {
    // --- CHAIRS (1x1) ---
    CHAIR_A_L: { name: 'Chair A (Left-Face)', tiles: [{ id: 'f0', relX: 0, relY: 0 }] },
    CHAIR_A_R: { name: 'Chair A (Right-Face)', tiles: [{ id: 'f1', relX: 0, relY: 0 }] },
    CHAIR_A_F: { name: 'Chair A (Front-Face)', tiles: [{ id: 'f2', relX: 0, relY: 0 }] },

    // --- TABLES (1x1 and 2x1) ---
    TABLE_A: { name: 'Coffee Table A', tiles: [{ id: 'f3', relX: 0, relY: 0 }] },
    TABLE_B: {
        name: 'Sturdy Table B',
        tiles: [
            { id: 'f4', relX: 0, relY: 0, name: 'Left' },
            { id: 'f5', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_COMPUTER: { name: 'Compute Station A', tiles: [{ id: 'f7', relX: 0, relY: 0 }] },
    TABLE_CYLINDERS: { name: 'Chemical Table A', tiles: [{ id: 'f8', relX: 0, relY: 0 }] },
    TABLE_DEVICE: { name: 'Protein Sequencer A', tiles: [{ id: 'f9', relX: 0, relY: 0 }] },
    TABLE_C: {
        name: 'Tall Table C',
        tiles: [
            { id: 'f12', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f11', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    TABLE_D: {
        name: 'Long Table D',
        tiles: [
            { id: 'f26', relX: 0, relY: 0, name: 'Left' },
            { id: 'f27', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_LEADER: {
        name: 'Leader Desk',
        tiles: [
            { id: 'f28', relX: 0, relY: 0, name: 'Left' },
            { id: 'f29', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_DIRECTOR: {
        name: 'Director Desk',
        tiles: [
            { id: 'f30', relX: 0, relY: 0, name: 'Left' },
            { id: 'f31', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    TABLE_LEADER_B: {
        name: 'Leader Desk B (Vertical)',
        tiles: [
            { id: 'f57', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f56', relX: 0, relY: -1, name: 'Top' }
        ]
    },

    // --- TANKS & SPECIMENS (1x2 Stacks) ---
    TANK_GREEN: {
        name: 'Specimen Tank (Green)',
        tiles: [
            { id: 'f14', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f13', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_BLUE: {
        name: 'Specimen Tank (Blue)',
        tiles: [
            { id: 'f16', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f15', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    TANK_RED: {
        name: 'Specimen Tank (Red)',
        tiles: [
            { id: 'f23', relX: 0, relY: 0, name: 'Tank Base' },
            { id: 'f22', relX: 0, relY: -1, name: 'Tank Top' }
        ]
    },
    HEALTHY_PLANT: {
        name: 'Ancient Plant (Healthy)',
        tiles: [
            { id: 'f87', relX: 0, relY: 0, name: 'Plant Base' },
            { id: 'f86', relX: 0, relY: -1, name: 'Plant Top' }
        ]
    },
    DEAD_PLANT: {
        name: 'Ancient Plant (Dead)',
        tiles: [
            { id: 'f89', relX: 0, relY: 0, name: 'Plant Base' },
            { id: 'f88', relX: 0, relY: -1, name: 'Plant Top' }
        ]
    },

    // --- PLANTS (1x2 Stacks) ---
    PLANT_A: {
        name: 'Potted Plant A',
        tiles: [
            { id: 'f19', relX: 0, relY: 0, name: 'Pot' },
            { id: 'f18', relX: 0, relY: -1, name: 'Leaves' }
        ]
    },
    PLANT_B: {
        name: 'Potted Plant B',
        tiles: [
            { id: 'f21', relX: 0, relY: 0, name: 'Pot' },
            { id: 'f20', relX: 0, relY: -1, name: 'Leaves' }
        ]
    },
    PLANT_C: {
        name: 'Potted Plant C',
        tiles: [
            { id: 'f25', relX: 0, relY: 0, name: 'Pot' },
            { id: 'f24', relX: 0, relY: -1, name: 'Leaves' }
        ]
    },
    POT_PLANT_SMALL: { name: 'Small Potted Plant', tiles: [{ id: 'f59', relX: 0, relY: 0 }] },
    EMPTY_POT: { name: 'Empty Potted Pot', tiles: [{ id: 'f91', relX: 0, relY: 0 }] },

    // --- EQUIPMENT (Large Clusters) ---
    CABINET_BIG: {
        name: 'Large Cabinet',
        tiles: [
            { id: 'f54', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f55', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f52', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f53', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    INCUBATOR: {
        name: 'Incubation Unit',
        tiles: [
            { id: 'f40', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f41', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f38', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f39', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    VENDING_MACHINE: {
        name: 'Odd-Vend Machine',
        tiles: [
            { id: 'f69', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f70', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f67', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f68', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    BATTLE_MACHINE: {
        name: 'Battle Station',
        tiles: [
            { id: 'f73', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f74', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f71', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f72', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    BOOKSHELF_BIG: {
        name: 'Grand Bookshelf',
        tiles: [
            { id: 'f78', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f79', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f76', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f77', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    CRYO_POD_BIG: {
        name: 'Grand Cryo Pod (2x2)',
        tiles: [
            { id: 'f82', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f83', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f80', relX: 0, relY: -1, name: 'Top Left' },
            { id: 'f81', relX: 1, relY: -1, name: 'Top Right' }
        ]
    },
    STORAGE_POD_FROZEN: {
        name: 'Deep Freeze Storage Pod',
        tiles: [
            { id: 'f85', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f84', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    BIO_EXTRACTOR: {
        name: 'Bio Extractor Industrial',
        tiles: [
            { id: 'f46', relX: 0, relY: 0, name: 'Bottom Left' },
            { id: 'f47', relX: 1, relY: 0, name: 'Bottom Right' },
            { id: 'f44', relX: 0, relY: -1, name: 'Mid Left' },
            { id: 'f45', relX: 1, relY: -1, name: 'Mid Right' },
            { id: 'f42', relX: 0, relY: -2, name: 'Top Left' },
            { id: 'f43', relX: 1, relY: -2, name: 'Top Right' }
        ]
    },
    CELL_ACCELERATOR: {
        name: 'Cell Accelerator Unit (3x3)',
        tiles: [
            { id: 'f98', relX: 0, relY: 0, name: 'BL' },
            { id: 'f99', relX: 1, relY: 0, name: 'BM' },
            { id: 'f100', relX: 2, relY: 0, name: 'BR' },
            { id: 'f95', relX: 0, relY: -1, name: 'ML' },
            { id: 'f96', relX: 1, relY: -1, name: 'MM' },
            { id: 'f97', relX: 2, relY: -1, name: 'MR' },
            { id: 'f92', relX: 0, relY: -2, name: 'TL' },
            { id: 'f93', relX: 1, relY: -2, name: 'TM' },
            { id: 'f94', relX: 2, relY: -2, name: 'TR' }
        ]
    },

    // --- DECOR & UTILITY (Stacks) ---
    BOX_PILE: {
        name: 'Stacked Box Pile',
        tiles: [
            { id: 'f62', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f61', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    CRYO_POD: {
        name: 'Cryo Maintenance Pod',
        tiles: [
            { id: 'f65', relX: 0, relY: 0, name: 'Left' },
            { id: 'f66', relX: 1, relY: 0, name: 'Right' }
        ]
    },
    SKELETON: {
        name: 'Anatomical Skeleton',
        tiles: [
            { id: 'f35', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f34', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    BOX_HAND: { name: 'Box Labeled Hand', tiles: [{ id: 'f48', relX: 0, relY: 0 }] },
    SMALL_BOX: { name: 'Small Odd Carton Box', tiles: [{ id: 'f60', relX: 0, relY: 0 }] },
    SMALL_CABINET: { name: 'Small Storage Cabinet', tiles: [{ id: 'f58', relX: 0, relY: 0 }] },
    NOODLE_TABLE: { name: 'Researcher Noodle Table', tiles: [{ id: 'f36', relX: 0, relY: 0 }] },
    NOODLE_BOWL: { name: 'Empty Noodle Bowl', tiles: [{ id: 'f37', relX: 0, relY: 0 }] },
    WALL_HANGING_A: { name: 'Evolution Poster A', tiles: [{ id: 'f6', relX: 0, relY: 0 }] },
    WALL_HANGING_B: { name: 'Evolution Poster B', tiles: [{ id: 'f17', relX: 0, relY: 0 }] },
    WARNING_SIGN_FRONT: { name: 'Warning Sign (Front)', tiles: [{ id: 'f105', relX: 0, relY: 0 }] },
    WARNING_SIGN_SIDE: { name: 'Warning Sign (Side)', tiles: [{ id: 'f106', relX: 0, relY: 0 }] },
    HUGE_PETRI_DISH_SINGLE: { name: 'Petry Dish (Standalone)', tiles: [{ id: 'f103', relX: 0, relY: 0 }] },

    // --- KEY ITEMS ---
    ITEM_DATAPAD: { name: 'DATAPAD LOG', tiles: [{ id: 'f49', relX: 0, relY: 0 }] },
    ITEM_ROOMKEY: { name: 'SECURE KEYCARD', tiles: [{ id: 'f50', relX: 0, relY: 0 }] },
    ITEM_SAUCE: { name: 'INFERNO SAUCE', tiles: [{ id: 'f51', relX: 0, relY: 0 }] },
    ITEM_COLLECTIBLE: { name: 'COLLECTIBLE CARD', tiles: [{ id: 'f75', relX: 0, relY: 0 }] },
    ITEM_DATASTICK: { name: 'OLD DATA STICK', tiles: [{ id: 'f64', relX: 0, relY: 0 }] },
    ITEM_EMPLOYEE_CARD: { name: 'OFFICIAL EMPLOYEE CARD', tiles: [{ id: 'f90', relX: 0, relY: 0 }] },
    ITEM_SECRET: { name: 'ULTIMATE RARE CARD', tiles: [{ id: 'f63', relX: 0, relY: 0 }] },
    ITEM_BLUEPRINT: { name: 'CELL GENOMIC BLUEPRINT', tiles: [{ id: 'f101', relX: 0, relY: 0 }] },
    ITEM_BIOMASS: { name: 'RAW BIOMASS CONTAINER', tiles: [{ id: 'f102', relX: 0, relY: 0 }] },
    ITEM_CREDIT: { name: 'LAB CREDIT CHIP', tiles: [{ id: 'f104', relX: 0, relY: 0 }] },
    MR_SLIM: {
        name: 'Mr-Slim Robot',
        tiles: [
            { id: 'f108', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f107', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    HUGE_PETRY_DISH: {
        name: 'Huge Petry Dish',
        tiles: [
            { id: 'f110', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f109', relX: 0, relY: -1, name: 'Top' }
        ]
    },
    MOBILE_MONITOR_CABINET: {
        name: 'Mobile Monitor Cabinet',
        tiles: [
            { id: 'f112', relX: 0, relY: 0, name: 'Bottom' },
            { id: 'f111', relX: 0, relY: -1, name: 'Top' }
        ]
    }
};

/**
 * Terrain tiles for "Painting" mode
 */
export const TERRAIN_PALETTE = [
    { id: 13, name: 'Floor (Basic)' },
    { id: 12, name: 'Empty Fill' },
    // --- Walls (Outer) ---
    { id: 8, name: 'Wall Edge (Top)' },
    { id: 9, name: 'Wall Edge (Bottom)' },
    { id: 10, name: 'Wall Edge (Left)' },
    { id: 11, name: 'Wall Edge (Right)' },
    // --- Wall Centers ---
    { id: 14, name: 'Wall Center (Top)' },
    { id: 15, name: 'Wall Center (Bottom)' },
    { id: 16, name: 'Wall Left (Top)' },
    { id: 17, name: 'Wall Left (Bottom)' },
    { id: 18, name: 'Wall Right (Top)' },
    { id: 19, name: 'Wall Right (Bottom)' },
    // --- Corners (Outer) ---
    { id: 0, name: 'Corner (TL)' },
    { id: 1, name: 'Corner (TR)' },
    { id: 2, name: 'Corner (BL)' },
    { id: 3, name: 'Corner (BR)' },
    // --- Corners (Inner) ---
    { id: 4, name: 'Inner Corner (TL)' },
    { id: 5, name: 'Inner Corner (TR)' },
    { id: 6, name: 'Inner Corner (BL)' },
    { id: 7, name: 'Inner Corner (BR)' },
    // --- Special ---
    { id: 32, name: 'Window (Basic)' },
    { id: 33, name: 'Window (FullWall)' },
    { id: 38, name: 'Floor (SideDeco)' }
];

/**
 * Door templates for Portal Placement
 */
export const DOOR_TEMPLATES = {
    DOOR_BASIC: {
        name: 'Basic Door (Wall)',
        tiles: [{ id: 22, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_BOTTOM: {
        name: 'Bottom Wall Door',
        tiles: [{ id: 20, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_LEFT: {
        name: 'Left Wall Door',
        tiles: [{ id: 24, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_RIGHT: {
        name: 'Right Wall Door',
        tiles: [{ id: 25, relX: 0, relY: 0, name: 'Closed' }]
    },
    DOOR_SECRET_OPEN: {
        name: 'Secret Door (Open)',
        tiles: [{ id: 34, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_SECRET_BOTTOM_OPEN: {
        name: 'Secret Door Bottom (Open)',
        tiles: [{ id: 35, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_SECRET_RIGHT_OPEN: {
        name: 'Secret Door Right (Open)',
        tiles: [{ id: 36, relX: 0, relY: 0, name: 'Open' }]
    },
    DOOR_SECRET_LEFT_OPEN: {
        name: 'Secret Door Left (Open)',
        tiles: [{ id: 37, relX: 0, relY: 0, name: 'Open' }]
    }
};
