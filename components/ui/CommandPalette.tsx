'use client';

import * as React from 'react';
import {
  ArrowRight,
  Code2,
  Copy,
  FileText,
  Github,
  Layers,
  Linkedin,
  MessageCircle,
  Search,
  ShieldCheck,
  SunMoon,
  Swords,
  FolderGit2,
  type LucideIcon,
} from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { profileData } from '@/data/profile';
import { projectsData } from '@/data/projects';
import { useDialogFocus } from '@/lib/hooks/useDialogFocus';
import { openAssistant, requestLens, requestTheme } from '@/lib/events';
import { scrollBehavior } from '@/lib/client-utils';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  group: 'Go to' | 'Actions' | 'Links';
  label: string;
  hint?: string;
  keywords?: string;
  icon: LucideIcon;
  run: () => void;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === 'home') window.scrollTo({ top: 0, behavior: scrollBehavior() });
  else el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
}

// Only URLs from our own data files reach here; opened without opener access.
function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * ⌘K command palette (WAI-ARIA combobox + listbox inside a modal dialog). Commands are built
 * from the site's own data; the visitor's query is only used for filtering and, for the
 * "Ask Ayush" entry, handed to the assistant, which screens it.
 */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const dialogRef = useDialogFocus<HTMLDivElement>(true);
  // Read from the DOM (set by next-themes) rather than importing next-themes into this chunk.
  const [isDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  const { toast } = useToast();
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement>(null);

  const commands = React.useMemo<Command[]>(
    () => [
      { id: 'home', group: 'Go to', label: 'Home', icon: ArrowRight, run: () => scrollToSection('home') },
      ...siteConfig.navLinks.map((l) => ({
        id: `nav-${l.href}`,
        group: 'Go to' as const,
        label: l.name,
        keywords: l.href.slice(1),
        icon: ArrowRight,
        run: () => scrollToSection(l.href.slice(1)),
      })),
      { id: 'ask', group: 'Actions', label: 'Ask Ayush', hint: 'chat', keywords: 'assistant chat question ai', icon: MessageCircle, run: () => openAssistant() },
      {
        id: 'attack',
        group: 'Actions',
        label: 'Try to prompt-inject the assistant',
        keywords: 'attack security injection playground jailbreak',
        icon: Swords,
        run: () => openAssistant(undefined, { attack: true }),
      },
      {
        id: 'theme',
        group: 'Actions',
        label: `Switch to ${isDark ? 'light' : 'dark'} theme`,
        keywords: 'theme dark light mode appearance',
        icon: SunMoon,
        run: () => requestTheme(isDark ? 'light' : 'dark'),
      },
      { id: 'lens-build', group: 'Actions', label: 'Highlight software engineering work', hint: 'Build lens', keywords: 'lens build sde swe developer', icon: Code2, run: () => { requestLens('build'); scrollToSection('experience'); } },
      { id: 'lens-secure', group: 'Actions', label: 'Highlight security work', hint: 'Secure lens', keywords: 'lens secure security', icon: ShieldCheck, run: () => { requestLens('secure'); scrollToSection('experience'); } },
      { id: 'lens-all', group: 'Actions', label: 'Show all work', hint: 'Both', keywords: 'lens both all reset', icon: Layers, run: () => requestLens('all') },
      {
        id: 'resume',
        group: 'Actions',
        label: 'Download resume',
        hint: 'PDF',
        keywords: 'cv pdf',
        icon: FileText,
        run: () => {
          const a = document.createElement('a');
          a.href = profileData.resume.url;
          a.download = profileData.resume.filename;
          a.click();
        },
      },
      {
        id: 'email',
        group: 'Actions',
        label: 'Copy email address',
        hint: profileData.contact.email,
        keywords: 'contact mail',
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(profileData.contact.email).then(
            () => toast({ title: 'Email copied', description: profileData.contact.email, variant: 'success' }),
            () => toast({ title: 'Could not copy', description: profileData.contact.email, variant: 'destructive' })
          );
        },
      },
      { id: 'github', group: 'Links', label: 'GitHub', hint: 'profile', icon: Github, run: () => openExternal(profileData.contact.socials.github) },
      { id: 'linkedin', group: 'Links', label: 'LinkedIn', hint: 'profile', icon: Linkedin, run: () => openExternal(profileData.contact.socials.linkedin) },
      ...projectsData.map((p) => ({
        id: `repo-${p.id}`,
        group: 'Links' as const,
        label: `${p.title.split(' — ')[0]} source`,
        hint: 'GitHub',
        keywords: `${p.category} ${p.tags.join(' ')} project repo`,
        icon: FolderGit2,
        run: () => openExternal(p.github),
      })),
    ],
    [isDark, toast]
  );

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return commands;
    const words = q.split(/\s+/);
    return commands.filter((c) => {
      const hay = `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''} ${c.group}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [commands, q]);

  // Any query can also be asked to the assistant, as the last option.
  const askItem: Command | null = q
    ? { id: 'ask-query', group: 'Actions', label: `Ask Ayush: “${query.trim().slice(0, 80)}”`, icon: MessageCircle, run: () => openAssistant(query.trim()) }
    : null;
  const items = askItem ? [...filtered, askItem] : filtered;
  const current = Math.min(active, Math.max(0, items.length - 1));

  React.useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [current]);

  const run = (c: Command) => {
    onClose();
    // After the dialog closes and focus has returned, so scrolling and new panels win.
    requestAnimationFrame(() => c.run());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const d = e.key === 'ArrowDown' ? 1 : -1;
      setActive((current + d + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setActive(e.key === 'Home' ? 0 : items.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[current]) run(items[current]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  // Group in display order while keeping one flat index for keyboard navigation.
  let index = -1;
  const groups = (['Go to', 'Actions', 'Links'] as const)
    .map((g) => ({ g, list: items.filter((c) => c.group === g) }))
    .filter((x) => x.list.length > 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[12vh]">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search and commands"
        tabIndex={-1}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-text-subtle" aria-hidden="true" />
          <input
            data-autofocus
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-autocomplete="list"
            aria-activedescendant={items[current] ? `cmdk-${items[current].id}` : undefined}
            aria-label="Search sections, actions and links"
            onKeyDown={onKeyDown}
            value={query}
            maxLength={200}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search, or ask a question…"
            className="h-14 flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-subtle focus:outline-none"
          />
          <kbd className="hidden sm:inline rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-subtle">esc</kbd>
        </div>
        <ul id="cmdk-list" ref={listRef} role="listbox" aria-label="Results" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {groups.map(({ g, list }) => (
            <li key={g} role="presentation">
              <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle" aria-hidden="true">
                {g}
              </p>
              <ul role="group" aria-label={g}>
                {list.map((c) => {
                  index += 1;
                  const i = index;
                  const selected = i === current;
                  const Icon = c.icon;
                  return (
                    // Options are operated from the combobox input (arrow keys + Enter via
                    // aria-activedescendant), so the click handler here is the mouse path only.
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <li
                      key={c.id}
                      id={`cmdk-${c.id}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => active !== i && setActive(i)}
                      onClick={() => run(c)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
                        selected ? 'bg-surface-elevated text-text-primary' : 'text-text-muted'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', selected ? 'text-accent' : 'text-text-subtle')} aria-hidden="true" />
                      <span className="flex-1 truncate">{c.label}</span>
                      {c.hint && <span className="truncate font-mono text-[11px] text-text-subtle">{c.hint}</span>}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <p className="border-t border-border px-4 py-2 font-mono text-[10px] text-text-subtle" aria-hidden="true">
          ↑↓ to move · enter to run · esc to close
        </p>
      </div>
    </div>
  );
}
