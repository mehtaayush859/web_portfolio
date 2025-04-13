import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { Mail, MapPin, Send, Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
// import emailjs from 'emailjs-com';
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace these with your actual EmailJS service, template and user IDs
      // const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      // const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      // const userId = import.meta.env.VITE_EMAILJS_USER_ID;
      
      const templateParams = {
        from_name: formState.name,
        from_email: formState.email,
        message: formState.message,
      };
      
      // await emailjs.send(serviceId, templateId, templateParams, userId);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      
      toast({
        title: "Message sent!",
        description: "Your message has been sent successfully. I'll get back to you soon.",
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to send the message:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Message failed to send",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-sm font-medium text-primary uppercase tracking-wider mb-2">Get In Touch</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Let's Work Together
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities?
            I'd love to hear from you. Feel free to reach out using the form below.
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatedSection animation="slide-up" className="order-2 md:order-1">
            <div className="glass p-8 rounded-2xl h-full">
              <h4 className="text-xl font-semibold mb-6">Send a Message</h4>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-primary" />
                  </div>
                  <h5 className="text-lg font-medium mb-2">Message Sent!</h5>
                  <p className="text-muted-foreground">
                    Thanks for reaching out. I'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formState.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      placeholder="How can I help you?"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center",
                      isSubmitting 
                        ? "bg-primary/70 text-primary-foreground cursor-not-allowed" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2" size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-up" delay={200} className="order-1 md:order-2">
            <div className="space-y-8">
              <div className="glass p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Email</h4>
                    <a 
                      href="mailto:mehtaayush144@gmail.com" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      mehtaayush144@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Location</h4>
                    <p className="text-muted-foreground">
                      Seattle, WA, USA
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Available for remote work worldwide
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-4">Connect on Social Media</h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/mehtaayush859"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Github size={18} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayushmehta44"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-2">Work Availability</h4>
                <p className="text-muted-foreground mb-4">
                  Currently available for freelance projects and full-time opportunities.
                </p>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>100% Availability</span>
                  <span>Updated: March 2025</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
