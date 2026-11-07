import { renderSocialCard, socialCardAlt, socialCardSize } from '@/lib/og/socialCard';

export const alt = socialCardAlt;
export const size = socialCardSize;
export const contentType = 'image/png';

export default function TwitterImage() {
  return renderSocialCard();
}
