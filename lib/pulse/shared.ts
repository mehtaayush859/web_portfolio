// Shared between the client widget and the /api/pulse route. Keep this file free of server-only imports.

export const REACTIONS = [
  { id: 'thumbs', emoji: '👍', label: 'Thumbs Up' },
  { id: 'fire', emoji: '🔥', label: 'Impressive Tech' },
  { id: 'rocket', emoji: '🚀', label: 'Fast & Smooth' },
  { id: 'bulb', emoji: '💡', label: 'Innovative' },
  { id: 'heart', emoji: '❤️', label: 'Love the Work' },
] as const;

export type ReactionId = (typeof REACTIONS)[number]['id'];

export const REACTION_IDS: readonly ReactionId[] = REACTIONS.map((r) => r.id);

export function isReactionId(value: unknown): value is ReactionId {
  return typeof value === 'string' && (REACTION_IDS as readonly string[]).includes(value);
}

/** Snapshot returned by the API. `enabled: false` means no persistent store is configured. */
export type PulseResponse =
  | { enabled: true; views: number; reactions: Record<ReactionId, number>; counted?: boolean }
  | { enabled: false };
