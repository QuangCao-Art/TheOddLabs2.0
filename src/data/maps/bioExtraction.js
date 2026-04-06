export const bioExtraction = {
    name: 'BIO EXTRACTION ROOM',
    width: 8,
    height: 10,
    spawn: { x: 5, y: 3 },
    layout: [
        [0, 8, 8, 8, 8, 8, 8, 1],
        [10, 14, 14, 14, 14, 14, 14, 11],
        [10, 15, 15, 15, 15, 22, 15, 11],
        [10, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 11],
        [10, 13, 13, 13, 13, 13, 13, 11],
        [2, 9, 9, 9, 9, 9, 9, 3]
    ],
    objects: [
        { id: 'f42_bio', x: 3, y: 4, type: 'prop', name: 'Bio-Extractor' },
        { id: 'f43_bio', x: 4, y: 4, type: 'prop', name: 'Bio-Extractor' },
        { id: 'f44_bio', x: 3, y: 5, type: 'prop', name: 'Bio-Extractor' },
        { id: 'f45_bio', x: 4, y: 5, type: 'prop', name: 'Bio-Extractor' },
        { id: 'f46_bio', x: 3, y: 6, type: 'prop', name: 'Bio-Extractor' },
        { id: 'f47_bio', x: 4, y: 6, type: 'prop', name: 'Bio-Extractor' },
        { id: 'f59_bio_nw', x: 1, y: 3, type: 'prop', name: 'Potted Plant' },
        { id: 'f4_bio_n', x: 2, y: 3, type: 'prop', name: 'Research Table' },
        { id: 'f5_bio_n', x: 3, y: 3, type: 'prop', name: 'Research Table' },
        { id: 'f7_bio_n', x: 4, y: 3, type: 'prop', name: 'Research Terminal' },
        { id: 'f59_bio_ne', x: 6, y: 3, type: 'prop', name: 'Potted Plant' },
        { id: 'f59_bio_sw', x: 1, y: 8, type: 'prop', name: 'Potted Plant' },
        { id: 'f59_bio_se', x: 6, y: 8, type: 'prop', name: 'Potted Plant' },
        { id: 'f103_bio_l1', x: 1, y: 4, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_l2', x: 1, y: 5, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_l3', x: 1, y: 6, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_l4', x: 1, y: 7, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_r1', x: 6, y: 4, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_r2', x: 6, y: 5, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_r3', x: 6, y: 6, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_r4', x: 6, y: 7, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_s1', x: 2, y: 8, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_s2', x: 3, y: 8, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_s3', x: 4, y: 8, type: 'prop', name: 'Huge Petry Dish' },
        { id: 'f103_bio_s4', x: 5, y: 8, type: 'prop', name: 'Huge Petry Dish' }
    ],
    doors: [
        { x: 5, y: 2, targetZone: 'atrium', targetX: 4, targetY: 13 }
    ]
};
