import { QUEST_DATA } from './quests/quest_data.js';

/**
 * QUESTS: The global registry for all quest tasks (Main and Side).
 * The engine uses this to look up objectives, targets, and rewards.
 */
export const QUESTS = {
    ...QUEST_DATA
};
