---
description: Create a standardized UI Menu (Modal) following Laboratory OS standards
---

### ✍️ Writing Quality & Grammar
> [!IMPORTANT]
> For any new UI text (Titles, Subtitles, Button Labels), the assistant MUST perform a comprehensive grammar check and polish the language for professional, high-quality narrative writing before implementation.

# 🛠 Creating Laboratory OS UI Menus

Use this workflow to create a new UI modal (Pause, Confirmation, or Dialogue) ensuring it meets the game's high-end aesthetic standards and avoids common input bugs.

## Phase 1: Structure (HTML)

1.  **Layer Selection**: Wrap the menu in a `.overlay.hidden` container.
2.  **Glass Panel**: Use a `.glass-panel` div for the actual modal content.
3.  **Header Hierarchy**:
    - `h2.neon-text.outline-text`: Primary title (Uppercase).
    - `p.pause-subtitle`: Thematic pun or descriptive text (Rajdhani font).
    - `div.header-line`: Separator.
4.  **Buttons Container**: Wrap buttons in `.pause-buttons` or similar Flex column.
5.  **Hint Layer**: Add `.pause-hint` at the bottom for keyboard guides (e.g., `[W/S] Navigate | [F] Select`).
6.  **Centering Logic**:
    *   **Utility (Default)**: Rely on `.overlay` Flexbox.
    *   **Cinematic (Large Imagery)**: Use `position: absolute; top: 50%; left: 50%;` on the panel with `transform: translate(-50%, -50%)`.

---

## Phase 2: Look & Feel (CSS)

1.  **Dimensions**:
    - `max-width: 450px`, `width: 90%`.
    - `padding: 40px`.
    - `border-radius: 12px`.
2.  **Typography**:
    - Title: Uppercase, Orbitron.
    - Buttons: `font-size: 0.9rem`, `letter-spacing: 2px`.
3.  **Hover Themes (CRITICAL)**:
    - **Safe/Success (Solid Green)**: Use `background: var(--color-bio)` and dark text (`color: var(--bg-color)`).
    - **Alert/Danger (Transparent Red)**: Use `background: rgba(255, 51, 51, 0.2)` and bright text (`color: #ffcccc`).
4.  **Transitions**: Use `transform: scale(1.05)` for the hover/selected state and ensure `!important` is used where global overrides interfere.
5.  **Closing Animation (CRITICAL)**: Always define the `modal-closing` state. For cinematic modals, you MUST include the translation in the transform:
    ```css
    .overlay.modal-closing .cinematic-panel {
        transform: translate(-50%, -50%) scale(0.85) !important;
        opacity: 0;
    }
    ```

---

## Phase 3: Logic & Interaction (JS)

1.  **Input Isolation**:
    - **`e.stopImmediatePropagation()`**: This is MUST. Use it on all keydown handlers (ESC, F, Enter) to prevent the menu click from interacting with overworld NPCs or objects behind the screen.
2.  **Global Blocking**: Add the new menu ID to the `activeOverlays` or `isAnyOtherMenuOpen` check in the global `keydown` listener to prevent W/W/A/D movement while the menu is open.
3.  **Input Sync**: Add `mouseenter` listeners to all buttons that update the `currentNavIndex` and call `updateSelection()`. This prevents the "Double Highlight" bug where both a keyboard selection and mouse hover are visible.
4.  **Audio Triggers**:
    *   **Open**: Call `AudioManager.play('modal_open')` when the menu opens.
    *   **Close**: Use `window.hideWithFade(element)` to trigger the universal `modal_close` sound and 300ms fade-out.
    *   **Special events**: For milestones, use `modal_quest_clear` or `modal_pickup`.

---

## 🚫 Mistakes to Avoid ("Wall of Shame")

- **Double Highlights**: Forgetting to sync `mouseenter` with the keyboard index.
- **Leaky ESC**: Closing the menu with ESC but also triggering the overworld's "Exit to Main Menu" logic.
- **Accidental Injections**: Never use `window.BioExtract` or `injectCSS` hacks inside `main.js` that might corrupt the file.
- **Ad-hoc Sizing**: Avoid `min-width: 450px`. Stick to `max-width` for responsiveness.
- **Wiggling Icons**: If buttons have icons, ensure they don't jump positions during the `scale(1.05)` hover transform.
- **The "Shift-to-Corner" Bug**: Forgetting to include the `translate(-50%, -50%)` in the `modal-closing` keyframes for absolute-positioned modals.
