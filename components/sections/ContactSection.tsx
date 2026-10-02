'use client';

import * as React from 'react';
import { Mail, MapPin, Send, Github, Linkedin, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { profileData } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { MotionWrapper } from '@/components/motion/MotionWrapper';

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

export function ContactSection() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [formState, setFormState] = React.useState<FormState>({
    name: '',
    email: '',
    message: '',
  });

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

  const maskedEmail = React.useMemo(() => {
    const email = profileData.contact.email;
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const visible = user.slice(0, 3);
    return `${visible}*****@${domain}`;
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

    setIsSubmitting(true);

    // Capture values at submit time
    const form = formRef.current;
    const sendName = formState.name || (form?.elements.namedItem('name') as HTMLInputElement | null)?.value || '';
    const sendEmail = formState.email || (form?.elements.namedItem('email') as HTMLInputElement | null)?.value || '';
    const sendMessage = formState.message || (form?.elements.namedItem('message') as HTMLTextAreaElement | null)?.value || '';

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey =
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      if (!serviceId || !templateId || !publicKey) {
        // Fallback simulation for dev/unconfigured environment
        console.warn('EmailJS environment variables not configured. Simulating success.');
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
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
    <section id="contact" className="py-20 sm:py-28 border-t border-border/60">
      <Container size="lg">
        {/* Section Header */}
        <MotionWrapper className="text-center mb-12 sm:mb-14">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-2.5 block">
            Get In Touch
          </span>
          <Heading as="h2" size="xl" className="mb-3">
            Let&apos;s Connect
          </Heading>
          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
            Interested in discussing software engineering, cloud systems, or security opportunities? Reach out directly or send a message below.
          </p>
        </MotionWrapper>

        {/* Unified Compact Contact Console */}
        <MotionWrapper delay={100} className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Direct Connect & Info */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-surface-elevated/40 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div>
                  {/* Status Indicator */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span>Open to SWE & Security Roles</span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    Contact Information
                  </h3>
                  <p className="text-xs text-text-muted mb-6 leading-relaxed">
                    Always happy to connect regarding engineering challenges, full-time roles, or technical discussions.
                  </p>

                  {/* Direct Email */}
                  <div className="p-4 rounded-xl border border-border bg-surface mb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-text-subtle flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        Direct Email
                      </span>
                      <a
                        href={`mailto:${profileData.contact.email}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:text-primary-hover transition-colors px-2.5 py-0.5 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        title="Open directly in email client"
                      >
                        <span>Send Email</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">
                      {maskedEmail}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Click &quot;Send Email&quot; to reach out
                    </p>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-xl border border-border bg-surface mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-subtle flex items-center gap-1.5 mb-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Location
                    </span>
                    <p className="text-sm font-semibold text-text-primary">
                      {profileData.contact.location}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Open to Relocation & Remote Roles
                    </p>
                  </div>
                </div>

                {/* Socials & SLA */}
                <div className="pt-4 border-t border-border/60">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-subtle block mb-2.5">
                    Connect Profiles
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <a
                      href={profileData.contact.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors min-h-[40px]"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={profileData.contact.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors min-h-[40px]"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-subtle">
                    <Clock className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                    <span>Typically responds within 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Message Form */}
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
                    className="space-y-4"
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
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </section>
  );
}
