// Small typed DOM events that let independent client islands talk without a shared provider
// (each island stays separately lazy-loadable). Payloads are plain strings from our own code.

export const ASK_EVENT = 'portfolio:ask';
export const LENS_EVENT = 'portfolio:lens';
export const THEME_EVENT = 'portfolio:theme';

export type LensChoice = 'all' | 'build' | 'secure';

export interface AskDetail {
  question?: string;
  /** Open with Attack mode (prompt-injection playground) switched on. */
  attack?: boolean;
}

/** Opens the Ask Ayush panel, optionally with a question to send. */
export function openAssistant(question?: string, options: { attack?: boolean } = {}) {
  window.dispatchEvent(new CustomEvent<AskDetail>(ASK_EVENT, { detail: { question, attack: options.attack } }));
}

/** Sets the Build / Secure lens (handled by LensSwitch so its UI stays in sync). */
export function requestLens(lens: LensChoice) {
  window.dispatchEvent(new CustomEvent<LensChoice>(LENS_EVENT, { detail: lens }));
}

/**
 * Asks the navbar ThemeToggle (which owns next-themes) to switch theme. Lets lazy chunks such
 * as the command palette change the theme without importing next-themes themselves, which
 * would split it out of the startup bundle into an extra request.
 */
export function requestTheme(theme: 'light' | 'dark') {
  window.dispatchEvent(new CustomEvent<'light' | 'dark'>(THEME_EVENT, { detail: theme }));
}
