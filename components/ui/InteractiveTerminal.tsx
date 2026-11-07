'use client';

import * as React from 'react';
import { Terminal, CornerDownLeft, Sparkles, Check, Copy } from 'lucide-react';
import { scrollBehavior } from '@/lib/client-utils';
import { identity } from '@/data/identity';
import { triggerEmojiShower } from '@/components/ui/EmojiShower';
import { openAssistant } from '@/lib/events';

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
          <p className="text-primary font-semibold">✓ session started: ayush@portfolio</p>
          <p>• Builds: backend services, data pipelines, full-stack apps</p>
          <p>• Secures: AppSec, detection &amp; response, AI-agent testing</p>
          <p>• Studying: M.S. Computer Science @ Seattle University</p>
          <p className="text-accent font-medium">• Status: open to Software Engineer &amp; Security Engineer roles</p>
          <p className="pt-1 text-text-subtle">
            › type <span className="text-primary font-semibold">help</span> for commands, or try{' '}
            <span className="text-primary font-semibold">sudo hire-me</span>
          </p>
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
        window.scrollTo({ top, behavior: scrollBehavior() });
      }
    }, 100);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let res: React.ReactNode;

    // "ask <question>" hands the question to the Ask Ayush assistant (which screens it).
    if (trimmed === 'ask' || trimmed.startsWith('ask ')) {
      const question = cmd.trim().slice(3).trim();
      openAssistant(question || undefined);
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: <p className="text-xs text-primary">Opening Ask Ayush{question ? ' with your question' : ''}...</p> },
      ]);
      setInputVal('');
      return;
    }

    switch (trimmed) {
      case 'help':
        res = (
          <div className="space-y-0.5 text-xs text-text-subtle">
            <p>Available commands:</p>
            <p><span className="text-primary font-semibold">experience</span> - Jump to work experience</p>
            <p><span className="text-primary font-semibold">projects</span> - Jump to featured projects</p>
            <p><span className="text-primary font-semibold">skills</span> - Jump to the toolkit</p>
            <p><span className="text-primary font-semibold">certs</span> - Education &amp; certifications</p>
            <p><span className="text-primary font-semibold">ask &lt;question&gt;</span> - Ask the assistant</p>
            <p><span className="text-primary font-semibold">resume</span> - Download my resume (PDF)</p>
            <p><span className="text-primary font-semibold">react</span> - Send a 🔥</p>
            <p><span className="text-primary font-semibold">contact</span> - Jump to contact dispatch</p>
            <p><span className="text-primary font-semibold">whoami</span> - Developer bio summary</p>
            <p><span className="text-primary font-semibold">clear</span> - Clear terminal history</p>
          </div>
        );
        break;
      case 'certs':
      case 'certifications':
        res = (
          <div className="text-xs text-text-muted space-y-1">
            <p className="text-primary font-semibold">Navigating to Verified Certifications...</p>
            <p>• CCNAv7: Introduction to Networks (Cisco Networking Academy)</p>
            <p>• Probability &amp; Statistics for Machine Learning (DeepLearning.AI)</p>
            <p>• Supervised Learning with scikit-learn (DataCamp)</p>
          </div>
        );
        navigateToSection('credentials');
        break;
      case 'pulse':
      case 'views':
      case 'react':
        triggerEmojiShower('🔥');
        res = (
          <div className="text-xs text-text-muted space-y-1">
            <p className="text-accent font-semibold">⚡ Reaction sent</p>
            <p>🔥 celebration launched. Leave a real reaction in the footer.</p>
          </div>
        );
        break;
      case 'experience':
      case 'journey':
      case 'work':
        res = <p className="text-xs text-primary">Navigating to Experience...</p>;
        navigateToSection('experience');
        break;
      case 'about':
        res = <p className="text-xs text-primary">You are here: About.</p>;
        navigateToSection('about');
        break;
      case 'resume':
      case 'cv': {
        const a = document.createElement('a');
        a.href = identity.resume.url;
        a.download = identity.resume.filename;
        a.click();
        res = <p className="text-xs text-primary">Downloading {identity.resume.filename}...</p>;
        break;
      }
      case 'sudo hire-me':
      case 'sudo hire ayush':
        res = <p className="text-xs text-primary">Permission granted ✓ Opening contact form...</p>;
        navigateToSection('contact');
        break;
      case 'skills':
        res = (
          <div className="text-xs text-text-muted space-y-1">
            <p className="text-accent font-semibold">Navigating to Skills Matrix...</p>
            <p>• Build: Python, Java, TypeScript, Go · Flask, Django, FastAPI, Spring Boot, React</p>
            <p>• Secure: OWASP Top 10, Burp Suite, SIEM/EDR, adversarial testing, AWS IAM</p>
            <p>• Cloud &amp; data: AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Redis</p>
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
            <p className="leading-relaxed">{identity.heroBio}</p>
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
    navigator.clipboard.writeText(identity.email);
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
            className="flex items-center gap-1 min-h-6 px-2 py-0.5 rounded text-[11px] border border-border/80 hover:border-primary hover:text-primary transition-colors cursor-pointer"
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
            placeholder="type 'help'"
            aria-label="Interactive Terminal Command Input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="flex-1 min-w-0 min-h-7 px-1 rounded bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 text-text-primary placeholder:text-text-subtle font-mono text-xs"
          />
          <button type="submit" aria-label="Execute command" className="p-1.5 rounded text-text-subtle hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Interactive Command Pills */}
      <div className="px-4 py-2 bg-surface-elevated/50 border-t border-border flex flex-wrap items-center gap-1.5 text-[11px] text-text-subtle">
        <span className="mr-1 text-[10px] uppercase font-semibold">Actions:</span>
        {['experience', 'projects', 'skills', 'certs', 'whoami', 'resume', 'clear'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeCommand(cmd)}
            className="min-h-6 px-2 py-0.5 rounded bg-surface border border-border/70 hover:border-primary hover:text-primary transition-colors cursor-pointer active:scale-95"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
