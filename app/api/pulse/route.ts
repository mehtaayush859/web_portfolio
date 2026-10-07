import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PulseData {
  views: number;
  reactions: Record<string, number>;
}

const DEFAULT_PULSE_DATA: PulseData = {
  views: 1450,
  reactions: {
    thumbs: 248,
    fire: 196,
    rocket: 154,
    bulb: 122,
    heart: 210,
  },
};

const LOCAL_CACHE_FILE = path.join('/tmp', 'portfolio_pulse.json');

// Memory cache fallback for sub-millisecond responses
let memoryData: PulseData = { ...DEFAULT_PULSE_DATA };

// Rate-limiting map for Discord notifications (prevents spamming Discord if refreshed rapidly)
const lastAlertTimeByIp = new Map<string, number>();

// Helper to read data (Upstash Redis if configured, local file/memory fallback)
async function getStoredData(): Promise<PulseData> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/mget/portfolio:views/portfolio:reactions`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        const viewsVal = json.result?.[0] ? parseInt(json.result[0], 10) : DEFAULT_PULSE_DATA.views;
        const reactionsVal = json.result?.[1] ? JSON.parse(json.result[1]) : DEFAULT_PULSE_DATA.reactions;
        return {
          views: viewsVal,
          reactions: { ...DEFAULT_PULSE_DATA.reactions, ...reactionsVal },
        };
      }
    } catch (err) {
      console.warn('Upstash read error, falling back to local cache:', err);
    }
  }

  // Local filesystem cache
  try {
    if (fs.existsSync(LOCAL_CACHE_FILE)) {
      const content = fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      memoryData = {
        views: typeof parsed.views === 'number' ? parsed.views : memoryData.views,
        reactions: { ...memoryData.reactions, ...parsed.reactions },
      };
    }
  } catch {
    // Keep memory fallback
  }

  return memoryData;
}

// Helper to save data
async function saveStoredData(data: PulseData) {
  memoryData = data;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['SET', 'portfolio:views', data.views.toString()],
          ['SET', 'portfolio:reactions', JSON.stringify(data.reactions)],
        ]),
      });
      return;
    } catch (err) {
      console.warn('Upstash write error:', err);
    }
  }

  try {
    fs.writeFileSync(LOCAL_CACHE_FILE, JSON.stringify(data), 'utf-8');
  } catch {
    // Ignore in read-only environments
  }
}

// Helper to resolve accurate Geolocation
async function resolveLocation(req: NextRequest, clientIp: string) {
  let city = req.headers.get('x-vercel-ip-city')
    ? decodeURIComponent(req.headers.get('x-vercel-ip-city')!)
    : '';
  let region = req.headers.get('x-vercel-ip-country-region') || '';
  let country = req.headers.get('x-vercel-ip-country') || '';
  let org = '';

  // If Vercel edge headers are missing or in local environment, query fast IP lookup
  if (!city || city === 'Local / Direct') {
    try {
      const isLocalIp =
        !clientIp ||
        clientIp.startsWith('127.') ||
        clientIp.startsWith('192.168.') ||
        clientIp.startsWith('10.') ||
        clientIp === '::1';

      // If local IP or invalid IP characters, query without IP to get the machine's public egress IP info
      const isCleanIp = /^[0-9a-fA-F:.]+$/.test(clientIp);
      const queryParam = (!isLocalIp && isCleanIp) ? encodeURIComponent(clientIp) : '';
      const geoRes = await fetch(
        `http://ip-api.com/json/${queryParam}?fields=status,country,regionName,city,org,isp`,
        { signal: AbortSignal.timeout(1400) }
      );
      if (geoRes.ok) {
        const geo = await geoRes.json();
        if (geo.status === 'success') {
          city = String(geo.city || city).slice(0, 80);
          region = String(geo.regionName || region).slice(0, 80);
          country = String(geo.country || country).slice(0, 80);
          org = String(geo.org || geo.isp || '').slice(0, 100);
        }
      }
    } catch {
      // Fallback cleanly
    }
  }

  const locationParts = [city, region, country].filter(Boolean);
  return {
    location: locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location',
    org,
  };
}

// Helper to format clean human-readable referrer
function formatReferrer(clientReferrer?: string): string {
  if (!clientReferrer || typeof clientReferrer !== 'string' || clientReferrer.trim() === '') {
    return 'Direct Visit (Typed URL or Bookmark)';
  }

  const safeRef = clientReferrer.slice(0, 300);
  const ref = safeRef.toLowerCase();
  if (ref.includes('linkedin.com')) {
    return `LinkedIn (${safeRef})`;
  }
  if (ref.includes('github.com')) {
    return `GitHub (${safeRef})`;
  }
  if (ref.includes('google.')) {
    return 'Google Search';
  }
  if (ref.includes('x.com') || ref.includes('twitter.com') || ref.includes('t.co')) {
    return `X / Twitter (${safeRef})`;
  }
  if (ref.includes('amehta.vercel.app') || ref.includes('ameht.vercel.app') || ref.includes('localhost')) {
    return 'Direct Navigation';
  }

  return safeRef;
}

// Non-blocking Webhook Dispatcher (Discord or Telegram)
function dispatchWebhookAlert(payload: {
  type: 'visit' | 'reaction';
  reaction?: string;
  ip: string;
  location: string;
  org: string;
  referrer: string;
  userAgent: string;
  views: number;
}) {
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

  if (!discordWebhook) {
    // Webhook not configured or disabled; skip notification cleanly
    return;
  }

  const isVisit = payload.type === 'visit';
  const safeReaction = String(payload.reaction || 'Reaction').slice(0, 16);
  const title = isVisit
    ? `🚀 New Visitor Viewed Ayush's Portfolio!`
    : `🎉 Visitor Sent ${safeReaction} Reaction!`;

  // Clean User Agent format
  let simpleDevice = 'Desktop Browser';
  const ua = (payload.userAgent || '').toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad')) {
    simpleDevice = 'iPhone / Safari Mobile';
  } else if (ua.includes('android')) {
    simpleDevice = 'Android Mobile';
  } else if (ua.includes('macintosh')) {
    simpleDevice = ua.includes('chrome') ? 'Mac / Chrome' : 'Mac / Safari';
  } else if (ua.includes('windows')) {
    simpleDevice = 'Windows PC';
  }

  // Safe field truncations to guarantee Discord embed compliance
  const safeLocation = (payload.location || 'Unknown Location').slice(0, 100);
  const safeReferrer = (payload.referrer || 'Direct Visit').slice(0, 250);
  const safeOrg = payload.org ? payload.org.slice(0, 100) : '';

  // Dispatch to Discord
  fetch(discordWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title,
          color: isVisit ? 65342 : 16096779, // Emerald green or Amber gold
          fields: [
            {
              name: '📍 Location',
              value: safeLocation,
              inline: true,
            },
            {
              name: '🔗 Referrer Source',
              value: safeReferrer,
              inline: true,
            },
            {
              name: '⚡ Total Views',
              value: `${payload.views.toLocaleString()}`,
              inline: true,
            },
            ...(safeOrg
              ? [
                  {
                    name: '🏢 Network / ISP',
                    value: safeOrg,
                    inline: true,
                  },
                ]
              : []),
            {
              name: '📱 Client Device',
              value: simpleDevice,
              inline: true,
            },
          ],
          footer: { text: 'Ayush Mehta Portfolio • Live Telemetry Dispatch' },
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  }).catch(() => {
    // Fire-and-forget
  });
}

export async function GET() {
  const data = await getStoredData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'visit';
    const current = await getStoredData();

    // Extract IP and User-Agent
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'Anonymous';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    // Format clean referrer using document.referrer sent by client
    const cleanReferrer = formatReferrer(body.clientReferrer);

    if (action === 'visit') {
      current.views += 1;
      // Fire-and-forget background persistence
      void saveStoredData(current);

      // Async background telemetry (geolocation + Discord alert) without blocking HTTP response
      const now = Date.now();
      const lastAlert = lastAlertTimeByIp.get(ip) || 0;
      if (now - lastAlert > 10000) {
        if (lastAlertTimeByIp.size > 1000) {
          lastAlertTimeByIp.clear();
        }
        lastAlertTimeByIp.set(ip, now);
        void (async () => {
          try {
            const { location, org } = await resolveLocation(req, ip);
            dispatchWebhookAlert({
              type: 'visit',
              ip,
              location,
              org,
              referrer: cleanReferrer,
              userAgent,
              views: current.views,
            });
          } catch {
            // Ignore background error
          }
        })();
      }

      // Return immediately in <2ms!
      return NextResponse.json({
        success: true,
        views: current.views,
        reactions: current.reactions,
      });
    }

    if (action === 'react') {
      const reactionId = body.reactionId;
      if (reactionId && typeof current.reactions[reactionId] === 'number') {
        current.reactions[reactionId] += 1;
      }
      void saveStoredData(current);

      // Async background reaction alert
      void (async () => {
        try {
          const { location, org } = await resolveLocation(req, ip);
          dispatchWebhookAlert({
            type: 'reaction',
            reaction: body.emoji || reactionId,
            ip,
            location,
            org,
            referrer: cleanReferrer,
            userAgent,
            views: current.views,
          });
        } catch {
          // Ignore background error
        }
      })();

      return NextResponse.json({
        success: true,
        views: current.views,
        reactions: current.reactions,
      });
    }

    return NextResponse.json(current);
  } catch (error) {
    console.error('Pulse API error:', error);
    return NextResponse.json(memoryData, { status: 200 });
  }
}
