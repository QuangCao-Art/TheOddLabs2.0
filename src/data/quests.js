import { MAIN_QUEST_DATA, MAIN_QUEST_LOGS as CORE_LOGS } from './quests/main.js';
import { SIDE_QUEST_DATA } from './quests/side.js';

/**
 * QUESTS: The global registry for all quest tasks (Main and Side).
 * The engine uses this to look up objectives, targets, and rewards.
 */
export const QUESTS = {
    ...MAIN_QUEST_DATA,
    ...SIDE_QUEST_DATA
};

/**
 * MAIN_QUEST_LOGS: Narrative "Diary" entries.
 * These are linked to the current stage of the main story progression.
 */
export const MAIN_QUEST_LOGS = {
    ...CORE_LOGS
};
