import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { profileData } from '@/data/profile';

const STATEMENT = 'I build backend systems that scale, and break them before attackers do.';

export const socialCardSize = { width: 1200, height: 630 };
export const socialCardAlt = `${profileData.name} — ${profileData.role}. I build backend systems that scale, and break them before attackers do.`;

/**
 * Shared social preview (Open Graph + Twitter). Rendered once at build time (static route),
 * from local files only: no request data, no external fetches.
 */
export async function renderSocialCard() {
  const portrait = await readFile(join(process.cwd(), 'public/images/ayush-portrait.jpg'));
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#05070b',
          backgroundImage:
            'radial-gradient(circle at 10% 0%, rgba(34,211,238,0.22), transparent 45%), radial-gradient(circle at 95% 90%, rgba(139,92,246,0.22), transparent 45%), radial-gradient(circle at 60% 40%, rgba(16,185,129,0.12), transparent 50%)',
          color: '#f3f6fb',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingRight: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: '#10b981' }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#10b981' }} />
            Open to Software Engineer &amp; Security Engineer roles
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{profileData.name}</div>
            {/* Satori lays out each span as a box, so the sentence is split into words to wrap naturally. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 10, fontSize: 34, marginTop: 28, lineHeight: 1.3, color: '#dbe3ee' }}>
              {STATEMENT.split(' ').map((word, i) => (
                <span key={i} style={{ color: word === 'build' ? '#22d3ee' : word === 'break' ? '#10b981' : '#dbe3ee' }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 22, color: '#9aa7b8' }}>
            <span>Software Engineer</span>
            <span>·</span>
            <span>Security Engineer</span>
            <span>·</span>
            <span>Seattle, WA</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: 360,
            height: 450,
            alignSelf: 'center',
            borderRadius: 28,
            padding: 10,
            border: '1px solid rgba(148,163,184,0.25)',
            backgroundColor: 'rgba(12,16,24,0.85)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>; next/image is not available here */}
          <img src={portraitSrc} width={340} height={430} alt="" style={{ borderRadius: 20, objectFit: 'cover' }} />
        </div>
      </div>
    ),
    socialCardSize
  );
}
