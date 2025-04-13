
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center relative pt-20 pb-16 px-6 overflow-hidden bg-pattern">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-4xl mx-auto z-10 text-center">
        <AnimatedSection animation="fade-in" delay={100}>
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm">
            Software Engineer & Cybersecurity Enthusiast
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={300}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight">
            Hi, I'm{' '}
            <span className="text-primary relative">
              Ayush Mehta
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={500}>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Results-driven Software Engineer with expertise in backend development, distributed systems, and AI-powered applications. 
            Currently pursuing a Master's in Computer Science at Seattle University.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={700}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-md"
            >
              Get in touch
            </a>
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-secondary text-foreground font-medium transition-all duration-300 hover:bg-secondary/80"
            >
              View my work
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in" delay={900}>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/mehtaayush859"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary text-foreground hover:text-primary transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/ayushmehta44"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary text-foreground hover:text-primary transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:mehtaayush144@gmail.com"
              className="p-2 rounded-full bg-secondary text-foreground hover:text-primary transition-colors duration-200"
              aria-label="Email Contact"
            >
              <Mail size={24} />
            </a>
          </div>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <a
          href="#about"
          className="flex flex-col items-center text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          <span className="mb-2">Scroll down</span>
          <ArrowDown size={20} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
