import { gameState, STORY_STAGES, saveGameState } from './state.js';
import { MAIN_QUEST_LOGS } from '../data/quests.js';

/**
 * StoryManager: Centralized logic for main story progression.
 */
export const StoryManager = {
    /**
     * Advances the story.
     * @param {number|null} targetStage - If provided, jumps directly to this stage. 
     * Otherwise, increments the stage linearly.
     */
    advanceStage(targetStage = null) {
        const stages = Object.values(STORY_STAGES);
        
        if (targetStage !== null && stages.includes(targetStage)) {
            gameState.storyStage = targetStage;
            console.log(`[Story] Stage Jumped to: ${gameState.storyStage}`);
        } else {
            const currentStage = gameState.storyStage;
            const currentIndex = stages.indexOf(currentStage);
            if (currentIndex < stages.length - 1) {
                gameState.storyStage = stages[currentIndex + 1];
                console.log(`[Story] Stage Advanced Linearly: ${gameState.storyStage}`);
            } else {
                return false;
            }
        }

        if (gameState.settings?.autoSave) saveGameState();
        return true;
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
     * This ensures the storyStage ALWAYS matches the player's highest achievements.
     */
    syncStageFromFlags() {
        const flags = gameState.storyFlags;
        let stage = STORY_STAGES.LOBBY_START;

        // Check flags in descending order of progression (Highest flag wins)
        if (flags.gameCompleted) stage = STORY_STAGES.CLEARED;
        else if (flags.capsainBattleDone) stage = STORY_STAGES.CAPSAIN_DONE;
        else if (flags.dyzesBattleDone) stage = STORY_STAGES.DYZES_DONE;
        else if (flags.lanaBattleDone) stage = STORY_STAGES.LANA_DONE;
        else if (flags.botanicSectorUnlocked) stage = STORY_STAGES.BOTANIC_UNLOCKED;
        else if (flags.jenziAtriumUnlocked) stage = STORY_STAGES.ATRIUM_UNLOCKED;
        else if (flags.jenziFirstBattleDone) stage = STORY_STAGES.TUTORIAL_DONE;
        else if (flags.starterChosen) stage = STORY_STAGES.CELL_CHOSEN;

        // Atomic correction: Don't allow the stage to move backward via sync
        if (stage > gameState.storyStage) {
            gameState.storyStage = stage;
            console.log(`[Story] Save Recovery: Stage Snapped to ${stage} based on flags.`);
        }
    },

    /**
     * Returns the current narrative objective for the UI based on the Story Stage.
     */
    getCurrentObjective() {
        // Now using a direct numeric index mapping to MAIN_QUEST_LOGS
        // This is perfectly synced with gameState.storyStage (0, 1, 2, etc.)
        return MAIN_QUEST_LOGS[gameState.storyStage] || null;
    }
};
