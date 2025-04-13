
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Github, LinkIcon } from 'lucide-react';

export interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
}

const ProjectCard = ({ title, description, image, tags, github, demo }: ProjectProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 ease-out",
            isHovered ? "scale-105 blur-sm" : "scale-100"
          )}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-white/90 mb-4 line-clamp-3">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-3">
            {github && (
              <a 
                href={github}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm transition-colors"
                aria-label={`View ${title} code on GitHub`}
              >
                <Github size={18} />
              </a>
            )}
            {demo && (
              <a 
                href={demo}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm transition-colors"
                aria-label={`View ${title} live demo`}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
