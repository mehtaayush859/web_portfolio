import { after, type NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/data/siteConfig';
import { REACTIONS, isReactionId, type PulseResponse } from '@/lib/pulse/shared';
import {
  coarseLocation,
  dayBucket,
  deviceClass,
  getStore,
  referrerHost,
  sendDiscordAlert,
  visitorKey,
} from '@/lib/pulse/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 1024;
const VISITOR_REQUESTS_PER_MINUTE = 20;
const ALERTS_PER_HOUR = 30;
const DAY_SECONDS = 86_400;

const NO_STORE = { 'Cache-Control': 'no-store' };
// Let the CDN absorb polling: one function invocation per region every ~15 s at most.
const SHARED_CACHE = { 'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=45' };

const ownHosts = [new URL(siteConfig.url).hostname.replace(/^www\./, '')];

function json(body: PulseResponse | { error: string }, status: number, headers: Record<string, string>) {
  return NextResponse.json(body, { status, headers });
}

export async function GET() {
  const store = getStore();
  if (!store) return json({ enabled: false }, 200, SHARED_CACHE);
  try {
    const snap = await store.snapshot();
    return json({ enabled: true, ...snap }, 200, SHARED_CACHE);
  } catch (err) {
    console.error('[pulse] read failed:', err instanceof Error ? err.message : err);
    return json({ enabled: false }, 200, NO_STORE);
  }
}

/**
 * CSRF guard: only the site's own pages may record visits/reactions. Browsers send
 * Sec-Fetch-Site on every request; when it's missing (older browsers, scripts), fall back to
 * comparing Origin with Host. Requests without either (curl) are still rate limited below.
 */
function isCrossSite(req: NextRequest): boolean {
  const site = req.headers.get('sec-fetch-site');
  if (site) return site !== 'same-origin' && site !== 'none';
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.headers.get('host');
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  // 0. Same-site JSON only. Requiring application/json also forces a CORS preflight for any
  //    cross-site fetch, which fails because this route never sends CORS headers.
  if (isCrossSite(req)) return json({ error: 'cross-site request' }, 403, NO_STORE);
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json({ error: 'unsupported media type' }, 415, NO_STORE);
  }

  // 1. Bounded body parsing — reject oversized or malformed input instead of guessing.
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > MAX_BODY_BYTES) return json({ error: 'payload too large' }, 413, NO_STORE);
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'payload too large' }, 413, NO_STORE);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'invalid json' }, 400, NO_STORE);
  }
  if (typeof body !== 'object' || body === null) return json({ error: 'invalid body' }, 400, NO_STORE);
  const { action, reactionId, clientReferrer } = body as Record<string, unknown>;

  if (action !== 'visit' && action !== 'react') return json({ error: 'invalid action' }, 400, NO_STORE);
  if (action === 'react' && !isReactionId(reactionId)) return json({ error: 'invalid reaction' }, 400, NO_STORE);

  // 2. Store availability.
  const store = getStore();
  if (!store) return json({ enabled: false }, 200, NO_STORE);

  try {
    // 3. Per-visitor rate limit (hashed, daily-rotating key; raw IP never stored).
    const day = dayBucket();
    const visitor = visitorKey(req.headers, day);
    const minute = Math.floor(Date.now() / 60_000);
    const used = await store.hit(`rl:${visitor}:${minute}`, 60);
    if (used > VISITOR_REQUESTS_PER_MINUTE) return json({ error: 'rate limited' }, 429, { ...NO_STORE, 'Retry-After': '60' });

    // 4. Count at most once per visitor per day (per reaction for reactions).
    let counted: boolean;
    if (action === 'visit') {
      counted = await store.markOnce(`seen:v:${visitor}`, DAY_SECONDS);
      if (counted) await store.incrementViews();
    } else {
      const id = reactionId as (typeof REACTIONS)[number]['id'];
      counted = await store.markOnce(`seen:r:${id}:${visitor}`, DAY_SECONDS);
      if (counted) await store.incrementReaction(id);
    }

    const snap = await store.snapshot();

    // 5. Owner alert for newly counted events, kept alive past the response via after(),
    //    and capped globally so the webhook cannot be flooded.
    if (counted && process.env.DISCORD_WEBHOOK_URL) {
      const reaction = action === 'react' ? REACTIONS.find((r) => r.id === reactionId) : undefined;
      const alert = {
        kind: action === 'visit' ? ('visit' as const) : ('reaction' as const),
        reaction: reaction ? { emoji: reaction.emoji, label: reaction.label } : undefined,
        location: coarseLocation(req.headers),
        referrer: referrerHost(clientReferrer, ownHosts),
        device: deviceClass(req.headers.get('user-agent')),
        views: snap.views,
      };
      const hour = Math.floor(Date.now() / 3_600_000);
      after(async () => {
        try {
          if ((await store.hit(`rl:alerts:${hour}`, 3600)) <= ALERTS_PER_HOUR) {
            await sendDiscordAlert(alert);
          }
        } catch {
          // best-effort
        }
      });
    }

    return json({ enabled: true, ...snap, counted }, 200, NO_STORE);
  } catch (err) {
    console.error('[pulse] write failed:', err instanceof Error ? err.message : err);
    return json({ enabled: false }, 200, NO_STORE);
  }
}
