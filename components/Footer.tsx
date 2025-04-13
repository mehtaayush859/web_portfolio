
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="py-10 px-6 bg-secondary/30 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">       
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a
                href="https://github.com/mehtaayush859"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary text-foreground hover:text-primary transition-colors duration-200"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/ayushmehta44"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary text-foreground hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:mehtaayush144@gmail.com"
                className="p-2 rounded-full bg-secondary text-foreground hover:text-primary transition-colors duration-200"
                aria-label="Email Contact"
              >
                <Mail size={20} />
              </a>
            </div>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-border/50 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <div>
            © {currentYear} Portfolio. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
