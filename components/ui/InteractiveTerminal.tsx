'use client';

import * as React from 'react';
import { Terminal, CornerDownLeft, Sparkles, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profileData } from '@/data/profile';

interface CommandOutput {
  command: string;
  output: string | React.ReactNode;
}

export function InteractiveTerminal() {
  const [history, setHistory] = React.useState<CommandOutput[]>([
    {
      command: 'ayush.init()',
      output: (
        <div className="space-y-1 text-xs font-mono text-text-muted">
          <p className="text-primary font-semibold">✓ System Initialized: Ayush Mehta Portfolio OS</p>
          <p>• Education: M.S. in Computer Science @ Seattle University</p>
          <p>• Focus: Advanced Software Engineering &amp; Cybersecurity</p>
          <p className="text-accent font-medium">• Status: Open to Software Engineer &amp; Security Engineer roles</p>
        </div>
      ),
    },
  ]);

  const [inputVal, setInputVal] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const terminalBodyRef = React.useRef<HTMLDivElement>(null);

  // Scroll only the terminal's internal container, never the window
  React.useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const navigateToSection = (sectionId: string) => {
    // Small timeout ensures react state updates without competing with window scroll
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let res: React.ReactNode;

    switch (trimmed) {
      case 'help':
        res = (
          <div className="space-y-0.5 text-xs text-text-subtle">
            <p>Available commands:</p>
            <p><span className="text-primary font-semibold">journey</span> - Jump to developer journey</p>
            <p><span className="text-primary font-semibold">projects</span> - Jump to featured projects</p>
            <p><span className="text-primary font-semibold">skills</span> - Jump to technical skills matrix</p>
            <p><span className="text-primary font-semibold">contact</span> - Jump to contact dispatch</p>
            <p><span className="text-primary font-semibold">whoami</span> - Developer bio summary</p>
            <p><span className="text-primary font-semibold">clear</span> - Clear terminal history</p>
          </div>
        );
        break;
      case 'journey':
      case 'about':
        res = <p className="text-xs text-primary">Navigating to Developer Journey...</p>;
        navigateToSection('about');
        break;
      case 'skills':
        res = (
          <div className="text-xs text-text-muted space-y-1">
            <p className="text-accent font-semibold">Navigating to Skills Matrix...</p>
            <p>• Languages: Python, Java, JavaScript, TypeScript, Go, C++</p>
            <p>• Backend: Node.js, Express, Django, Flask, gRPC, REST APIs</p>
            <p>• Security: Penetration Testing, Payloads, Cryptography</p>
          </div>
        );
        navigateToSection('skills');
        break;
      case 'projects':
        res = <p className="text-xs text-primary">Navigating to Featured Projects...</p>;
        navigateToSection('projects');
        break;
      case 'contact':
        res = <p className="text-xs text-primary">Navigating to Contact form...</p>;
        navigateToSection('contact');
        break;
      case 'whoami':
        res = (
          <div className="text-xs text-text-muted space-y-1">
            <p className="text-text-primary font-semibold">Ayush Mehta — Software &amp; Security Engineer</p>
            <p className="leading-relaxed">{profileData.heroBio}</p>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      case '':
        setInputVal('');
        return;
      default:
        res = (
          <p className="text-xs text-destructive">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-primary font-semibold">help</span> for a list of commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output: res }]);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal;
    if (!cmd.trim()) return;
    setInputVal('');
    executeCommand(cmd);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profileData.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl border border-border bg-surface/95 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-left">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-border text-xs text-text-subtle select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="ml-2 font-medium text-text-primary text-[11px] hidden sm:inline">
            ayush@engineer: ~ (zsh)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyEmail}
            title="Copy email to clipboard"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border border-border/80 hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Email'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body with Dedicated Container Ref */}
      <div ref={terminalBodyRef} className="p-4 sm:p-5 max-h-[220px] overflow-y-auto space-y-3 scrollbar-thin">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold">
              <span className="text-text-subtle">ayush@engineer:~$</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-primary font-bold">ayush@engineer:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'journey', 'projects'..."
            aria-label="Interactive Terminal Command Input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-subtle/60 font-mono text-xs"
          />
          <button type="submit" aria-label="Execute command" className="text-text-subtle hover:text-primary cursor-pointer">
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Interactive Command Pills */}
      <div className="px-4 py-2 bg-surface-elevated/50 border-t border-border flex flex-wrap items-center gap-1.5 text-[11px] text-text-subtle">
        <span className="mr-1 text-[10px] uppercase font-semibold">Quick Actions:</span>
        {['journey', 'projects', 'skills', 'contact', 'whoami', 'clear'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeCommand(cmd)}
            className="px-2 py-0.5 rounded bg-surface border border-border/70 hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
