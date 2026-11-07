/**
 * The two halves of the portfolio's story. Every role, project and toolkit group is
 * tagged with one or both, and the hero "lens" switch highlights the matching items.
 */
export type Lens = 'build' | 'secure';

/** Value for the `data-lens-item` attribute, e.g. "build secure". */
export function lensAttr(lenses: readonly Lens[]): string {
  return lenses.join(' ');
}
