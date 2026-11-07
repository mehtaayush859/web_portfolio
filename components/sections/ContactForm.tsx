'use client';

import * as React from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { cx } from '@/lib/client-utils';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const LIMITS = { name: 100, email: 254, message: 5000 } as const;
const HONEYPOT_FIELD = 'website';

/** The interactive half of the Contact section: validation, honeypot and EmailJS delivery. */
export function ContactForm() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [formState, setFormState] = React.useState<FormState>({
    name: '',
    email: '',
    message: '',
  });

  const [selectedTopic, setSelectedTopic] = React.useState<string>('');
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Sync browser-restored DOM input values into React state if populated by autofill on reload
  React.useEffect(() => {
    if (formRef.current) {
      const form = formRef.current;
      const nameVal = (form.elements.namedItem('name') as HTMLInputElement | null)?.value;
      const emailVal = (form.elements.namedItem('email') as HTMLInputElement | null)?.value;
      const messageVal = (form.elements.namedItem('message') as HTMLTextAreaElement | null)?.value;

      if (nameVal || emailVal || messageVal) {
        setFormState((prev) => ({
          name: prev.name || nameVal || '',
          email: prev.email || emailVal || '',
          message: prev.message || messageVal || '',
        }));
      }
    }
  }, []);

  const validate = (): boolean => {
    // Read from state or fallback to direct DOM values in case browser restored inputs without firing onChange
    const form = formRef.current;
    const domName = (form?.elements.namedItem('name') as HTMLInputElement | null)?.value || '';
    const domEmail = (form?.elements.namedItem('email') as HTMLInputElement | null)?.value || '';
    const domMessage = (form?.elements.namedItem('message') as HTMLTextAreaElement | null)?.value || '';

    const currentName = formState.name || domName;
    const currentEmail = formState.email || domEmail;
    const currentMessage = formState.message || domMessage;

    // Keep React state synchronized if DOM had values
    if (currentName !== formState.name || currentEmail !== formState.email || currentMessage !== formState.message) {
      setFormState({ name: currentName, email: currentEmail, message: currentMessage });
    }

    const newErrors: FormErrors = {};

    if (currentName.trim().length < 2) {
      newErrors.name = 'Please enter your name.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (currentMessage.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    } else if (currentMessage.length > LIMITS.message) {
      newErrors.message = `Message must be under ${LIMITS.message} characters.`;
    }

    if (currentName.length > LIMITS.name) {
      newErrors.name = `Name must be under ${LIMITS.name} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Clear error on user edit
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: 'Incomplete Details',
        description: 'Please correct the highlighted fields before sending.',
        variant: 'destructive',
      });
      return;
    }

    const form = formRef.current;

    // Honeypot: humans never see or fill this field. Bots that do are dropped silently.
    const honeypot = (form?.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value;
    if (honeypot) {
      formRef.current?.reset();
      setFormState({ name: '', email: '', message: '' });
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    // Capture values at submit time
    const sendName = formState.name || (form?.elements.namedItem('name') as HTMLInputElement | null)?.value || '';
    const sendEmail = formState.email || (form?.elements.namedItem('email') as HTMLInputElement | null)?.value || '';
    const rawMessage = formState.message || (form?.elements.namedItem('message') as HTMLTextAreaElement | null)?.value || '';
    const sendMessage = selectedTopic
      ? `[Topic / Suggestion: ${selectedTopic}]\n\n${rawMessage}`
      : rawMessage;

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey =
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      if (!serviceId || !templateId || !publicKey) {
        // Never pretend a message was sent: surface the misconfiguration instead.
        throw new Error('EmailJS environment variables are not configured.');
      } else {
        // Loaded on demand: most visitors never submit the form.
        const { default: emailjs } = await import('@emailjs/browser');
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: sendName,
            from_email: sendEmail,
            message: sendMessage,
          },
          publicKey
        );
      }

      // Reset both DOM form and React state
      formRef.current?.reset();
      setFormState({ name: '', email: '', message: '' });
      setSelectedTopic('');
      setErrors({});
      setIsSubmitted(true);

      toast({
        title: 'Message sent!',
        description: "Your message has been sent successfully. I'll get back to you soon.",
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Message failed to send',
        description: 'There was an error sending your message. Please try emailing directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-7 p-6 sm:p-8 bg-surface flex flex-col justify-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">
          Send a Message
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Fill out the fields below to send a direct message.
        </p>
      </div>

      {isSubmitted ? (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mb-3 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-base font-semibold text-text-primary mb-1">
            Message Dispatched!
          </h4>
          <p className="text-xs sm:text-sm text-text-muted max-w-sm mb-6">
            Thank you for reaching out. I&apos;ve received your message and will respond promptly.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setFormState({ name: '', email: '', message: '' });
              setErrors({});
            }}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          className="relative space-y-4"
        >
          {/* Name & Email 2-column on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-mono font-medium text-text-primary mb-1.5"
              >
                Name <span className="text-primary">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="off"
                maxLength={LIMITS.name}
                value={formState.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                placeholder="Your name"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-border bg-surface-elevated text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono font-medium text-text-primary mb-1.5"
              >
                Email <span className="text-primary">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                maxLength={LIMITS.email}
                value={formState.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="your.email@example.com"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-border bg-surface-elevated text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Optional Roadmap Idea / Topic Selector */}
          <div role="group" aria-labelledby="topic-label">
            <div className="flex items-center justify-between mb-1.5">
              <span id="topic-label" className="block text-xs font-mono font-medium text-text-subtle">
                Topic or Feature You&apos;d Like to See Next (Optional)
              </span>
              {selectedTopic && (
                <button
                  type="button"
                  onClick={() => setSelectedTopic('')}
                  className="text-[11px] font-mono text-primary hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                '💼 Engineering / SDE Role',
                '⚡ More AI & ML Projects',
                '🛡️ Security Architecture Demos',
                '💡 Portfolio Feedback & Ideas',
              ].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={selectedTopic === topic}
                  onClick={() => setSelectedTopic((prev) => (prev === topic ? '' : topic))}
                  className={cx(
                    'px-2.5 py-1 rounded-md text-xs font-mono transition-all border cursor-pointer select-none',
                    selectedTopic === topic
                      ? 'bg-primary/15 border-primary text-primary font-semibold'
                      : 'bg-surface-elevated border-border/80 text-text-muted hover:border-primary/40 hover:text-text-primary'
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-mono font-medium text-text-primary mb-1.5"
            >
              Message <span className="text-primary">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              autoComplete="off"
              rows={4}
              maxLength={LIMITS.message}
              value={formState.message}
              onChange={handleChange}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              placeholder="Share details about your project, team, or opportunity..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface-elevated text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Honeypot (anti-spam): hidden from people and assistive tech */}
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
            <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[160px]"
            >
              <span>Send Message</span>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
