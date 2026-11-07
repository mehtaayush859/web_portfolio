// Server-only helpers for /api/pulse. Imported only by app/api/pulse/route.ts.
import { createHash } from 'node:crypto';
import { REACTION_IDS, type ReactionId } from './shared';

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

export interface PulseSnapshot {
  views: number;
  reactions: Record<ReactionId, number>;
}

export interface PulseStore {
  snapshot(): Promise<PulseSnapshot>;
  /** Atomically sets `key` if absent (with TTL). Returns true only for the first caller. */
  markOnce(key: string, ttlSeconds: number): Promise<boolean>;
  incrementViews(): Promise<void>;
  incrementReaction(id: ReactionId): Promise<void>;
  /** Fixed-window counter: increments `key` and returns the new count. */
  hit(key: string, windowSeconds: number): Promise<number>;
}

const NS = 'pulse:v2';
const VIEWS_KEY = `${NS}:views`;
const REACTIONS_KEY = `${NS}:reactions`;

function emptyReactions(): Record<ReactionId, number> {
  return Object.fromEntries(REACTION_IDS.map((id) => [id, 0])) as Record<ReactionId, number>;
}

/** Upstash Redis over its REST API (no SDK dependency). All writes are atomic Redis commands. */
class UpstashStore implements PulseStore {
  constructor(private readonly url: string, private readonly token: string) {}

  private async pipeline(commands: (string | number)[][]): Promise<unknown[]> {
    const res = await fetch(`${this.url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
    const json = (await res.json()) as { result?: unknown; error?: string }[];
    return json.map((entry) => {
      if (entry.error) throw new Error(`Upstash error: ${entry.error}`);
      return entry.result;
    });
  }

  async snapshot(): Promise<PulseSnapshot> {
    const [views, flat] = await this.pipeline([['GET', VIEWS_KEY], ['HGETALL', REACTIONS_KEY]]);
    const reactions = emptyReactions();
    if (Array.isArray(flat)) {
      for (let i = 0; i + 1 < flat.length; i += 2) {
        const field = String(flat[i]);
        if ((REACTION_IDS as readonly string[]).includes(field)) {
          reactions[field as ReactionId] = toCount(flat[i + 1]);
        }
      }
    }
    return { views: toCount(views), reactions };
  }

  async markOnce(key: string, ttlSeconds: number): Promise<boolean> {
    const [result] = await this.pipeline([['SET', `${NS}:${key}`, '1', 'NX', 'EX', ttlSeconds]]);
    return result === 'OK';
  }

  async incrementViews(): Promise<void> {
    await this.pipeline([['INCR', VIEWS_KEY]]);
  }

  async incrementReaction(id: ReactionId): Promise<void> {
    await this.pipeline([['HINCRBY', REACTIONS_KEY, id, 1]]);
  }

  async hit(key: string, windowSeconds: number): Promise<number> {
    const k = `${NS}:${key}`;
    // SET NX EX starts the window once; INCR counts within it.
    const [, count] = await this.pipeline([['SET', k, '0', 'NX', 'EX', windowSeconds], ['INCR', k]]);
    return toCount(count);
  }
}

/**
 * In-process store. Per-instance and non-persistent by design, so it is only used in
 * `next dev`, or when PULSE_MEMORY_STORE=1 is set explicitly (local production testing).
 */
class MemoryStore implements PulseStore {
  private views = 0;
  private reactions = emptyReactions();
  private expiring = new Map<string, { value: number; expiresAt: number }>();

  private sweep() {
    if (this.expiring.size < 5000) return;
    const now = Date.now();
    for (const [k, v] of this.expiring) if (v.expiresAt <= now) this.expiring.delete(k);
  }

  async snapshot(): Promise<PulseSnapshot> {
    return { views: this.views, reactions: { ...this.reactions } };
  }

  async markOnce(key: string, ttlSeconds: number): Promise<boolean> {
    this.sweep();
    const existing = this.expiring.get(key);
    if (existing && existing.expiresAt > Date.now()) return false;
    this.expiring.set(key, { value: 1, expiresAt: Date.now() + ttlSeconds * 1000 });
    return true;
  }

  async incrementViews(): Promise<void> {
    this.views += 1;
  }

  async incrementReaction(id: ReactionId): Promise<void> {
    this.reactions[id] += 1;
  }

  async hit(key: string, windowSeconds: number): Promise<number> {
    this.sweep();
    const now = Date.now();
    const existing = this.expiring.get(key);
    if (!existing || existing.expiresAt <= now) {
      this.expiring.set(key, { value: 1, expiresAt: now + windowSeconds * 1000 });
      return 1;
    }
    existing.value += 1;
    return existing.value;
  }
}

let memoryStore: MemoryStore | null = null;

/** Returns the configured store, or null when telemetry is disabled (no persistent store in production). */
export function getStore(): PulseStore | null {
  // Vercel's Upstash marketplace integration may expose either naming scheme.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return new UpstashStore(url, token);

  const allowMemory = process.env.NODE_ENV !== 'production' || process.env.PULSE_MEMORY_STORE === '1';
  if (!allowMemory) return null;
  memoryStore ??= new MemoryStore();
  return memoryStore;
}

function toCount(value: unknown): number {
  const n = typeof value === 'number' ? value : parseInt(String(value ?? '0'), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// ---------------------------------------------------------------------------
// Visitor identity (privacy-preserving)
// ---------------------------------------------------------------------------

/** UTC day bucket, e.g. "2026-11-04". */
export function dayBucket(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * One-way, daily-rotating visitor key. The raw IP is never stored or forwarded.
 * On Vercel, x-forwarded-for is set by the platform and cannot be spoofed by clients.
 */
export function visitorKey(headers: Headers, day: string): string {
  const ip = (headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  const ua = (headers.get('user-agent') || '').slice(0, 256);
  const salt = process.env.PULSE_HASH_SALT || 'pulse-default-salt';
  return createHash('sha256').update(`${salt}|${day}|${ip}|${ua}`).digest('hex').slice(0, 32);
}

// ---------------------------------------------------------------------------
// Alert formatting (no free-form client text reaches Discord)
// ---------------------------------------------------------------------------

/** Reduces a client-supplied referrer to a bare hostname; anything unparsable becomes "direct". */
export function referrerHost(raw: unknown, ownHosts: string[]): string {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 2048) return 'direct';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'direct';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (ownHosts.includes(host) || host === 'localhost' || host === '127.0.0.1') return 'internal';
    return host.slice(0, 100);
  } catch {
    return 'direct';
  }
}

export function coarseLocation(headers: Headers): string {
  const decode = (v: string | null) => {
    if (!v) return '';
    try {
      return decodeURIComponent(v).slice(0, 60);
    } catch {
      return '';
    }
  };
  const parts = [decode(headers.get('x-vercel-ip-city')), decode(headers.get('x-vercel-ip-country'))].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Unknown';
}

export function deviceClass(userAgent: string | null): string {
  const ua = (userAgent || '').toLowerCase();
  if (/bot|crawl|spider|lighthouse|headless/.test(ua)) return 'Bot / automated';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('macintosh')) return 'macOS';
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('linux')) return 'Linux';
  return 'Other';
}

export interface AlertPayload {
  kind: 'visit' | 'reaction';
  reaction?: { emoji: string; label: string };
  location: string;
  referrer: string;
  device: string;
  views: number;
}

/** Sends a Discord embed. Every field is server-derived; mentions are disabled. */
export async function sendDiscordAlert(payload: AlertPayload): Promise<void> {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  const title =
    payload.kind === 'visit'
      ? 'New portfolio visitor'
      : `Reaction: ${payload.reaction?.emoji ?? ''} ${payload.reaction?.label ?? ''}`.trim();

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title,
            color: payload.kind === 'visit' ? 0x00ff3e : 0xf59e0b,
            fields: [
              { name: 'Location (approx.)', value: payload.location, inline: true },
              { name: 'Referrer', value: payload.referrer, inline: true },
              { name: 'Device', value: payload.device, inline: true },
              { name: 'Unique visits (daily)', value: String(payload.views), inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Alerts are best-effort; never affect the visitor's response.
  }
}
