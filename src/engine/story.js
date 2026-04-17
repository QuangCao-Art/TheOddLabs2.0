import { gameState, STORY_STAGES, saveGameState } from './state.js';
import { MAIN_QUEST_LOGS } from '../data/quests.js';

/**
 * StoryManager: Centralized logic for main story progression.
 */
export const StoryManager = {
    /**
     * Advances the story to the next linear stage.
     */
    advanceStage() {
        const currentStage = gameState.storyStage;
        const stages = Object.values(STORY_STAGES);
        const currentIndex = stages.indexOf(currentStage);

        if (currentIndex < stages.length - 1) {
            gameState.storyStage = stages[currentIndex + 1];
            console.log(`[Story] Stage Advanced: ${gameState.storyStage}`);
            if (gameState.settings?.autoSave) saveGameState();
            return true;
        }
        return false;
    },

    /**
     * Sets the story to a specific stage.
     */
    setStage(stageId) {
        if (Object.values(STORY_STAGES).includes(stageId)) {
            gameState.storyStage = stageId;
            console.log(`[Story] Stage Set: ${stageId}`);
            if (gameState.settings?.autoSave) saveGameState();
        }
    },

    /**
     * Migration/Sync Tool: Calculates the likely story stage based on isolated flags.
     * Used for backward compatibility with old saves during dev transitions.
     */
    syncStageFromFlags() {
        const flags = gameState.storyFlags;
        let stage = STORY_STAGES.LOBBY_START;

        // Check flags in reverse order of progression
        if (flags.gameCompleted) stage = STORY_STAGES.CLEARED;
        else if (flags.capsainBattleDone) stage = STORY_STAGES.CAPSAIN_DONE;
        else if (flags.dyzesBattleDone) stage = STORY_STAGES.DYZES_DONE;
        else if (flags.lanaBattleDone) stage = STORY_STAGES.LANA_DONE;
        else if (flags.botanicSectorUnlocked) stage = STORY_STAGES.BOTANIC_UNLOCKED;
        else if (flags.jenziAtriumUnlocked) stage = STORY_STAGES.ATRIUM_UNLOCKED;
        else if (flags.jenziFirstBattleDone) stage = STORY_STAGES.TUTORIAL_DONE;
        else if (flags.starterChosen) stage = STORY_STAGES.CELL_CHOSEN;

        gameState.storyStage = stage;
        console.log(`[Story] Stage Synced from Flags: ${stage}`);
    },

    /**
     * Returns the current narrative objective for the UI based on the Story Stage.
     */
    getCurrentObjective() {
        const stage = gameState.storyStage;
        const stageToLogMap = {
            [STORY_STAGES.LOBBY_START]: 'initialization',
            [STORY_STAGES.CELL_CHOSEN]: 'initialization',
            [STORY_STAGES.TUTORIAL_DONE]: 'first_duel',
            [STORY_STAGES.ATRIUM_UNLOCKED]: 'atrium_threshold',
            [STORY_STAGES.ATRIUM_QUEST]: 'atrium_archive',
            [STORY_STAGES.BOTANIC_UNLOCKED]: 'botanic_secrets',
            [STORY_STAGES.LANA_DONE]: 'botanic_secrets',
            [STORY_STAGES.DYZES_DONE]: 'osmotic_revelations',
            [STORY_STAGES.CAPSAIN_DONE]: 'executive_truth',
            [STORY_STAGES.CLEARED]: 'spicy_origin'
        };

        const logId = stageToLogMap[stage];
        return MAIN_QUEST_LOGS[logId] || null;
    }
};
