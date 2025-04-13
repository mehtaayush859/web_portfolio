
import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { cn } from '@/lib/utils';

type Skill = {
  name: string;
  category: 'languages'| 'frontend' | 'backend' | 'database' | 'cloud' | 'DevOps';
  level: number; // 1-5
  icon?: React.ReactNode;
};

const Skills = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'languages' | 'frontend' | 'backend' | 'database' | 'cloud' | 'DevOps'>('all');
  
  const skills: Skill[] = [
    //Languages
    {name: 'Python', category: 'languages', level: 5 },
    {name: 'Java', category: 'languages', level: 4 },
    {name: 'JavaScript', category: 'languages', level: 4 },
    {name: 'TypeScript', category: 'languages', level: 4 },
    {name: 'Golang', category: 'languages', level: 2},
    {name: 'C++', category: 'languages', level: 4 },
    {name: 'C', category: 'languages', level: 4 },
    {name: 'Bash', category: 'languages', level: 3 },

    // Frontend
    { name: 'React', category: 'frontend', level: 5 },
    { name: 'Next.js', category: 'frontend', level: 4 },
    { name: 'HTML5', category: 'frontend', level: 5 },
    { name: 'CSS3', category: 'frontend', level: 5 },
    { name: 'Tailwind CSS', category: 'frontend', level: 5 },
    
    // Backend
    { name: 'Node.js', category: 'backend', level: 5 },
    { name: 'Express', category: 'backend', level: 5 },
    {name: 'Django', category: 'backend', level: 5 },
    {name: 'Flask', category: 'backend', level: 5 },
    { name: 'GraphQL', category: 'backend', level: 3 },
    { name: 'REST APIs', category: 'backend', level: 5 },
    { name: 'Authentication', category: 'backend', level: 4 },
    { name: 'Socket', category: 'backend', level: 3 },
    
    // Database
    { name: 'MySQL', category: 'database', level: 5 },
    { name: 'MongoDB', category: 'database', level: 5 },
    { name: 'PostgreSQL', category: 'database', level: 3 },
    {name: 'DynamoDB', category: 'database', level: 3 },
    { name: 'Redis', category: 'database', level: 3 },
    { name: 'Firebase', category: 'database', level: 4 },

    //Cloud
    {name: 'AWS', category: 'cloud', level: 5 },
    { name: 'Azure', category: 'cloud', level: 4 },
    { name: 'GCP', category: 'cloud', level: 4 },
    { name: 'IBM', category: 'cloud', level: 4 },
    
    
    
    // DevOps
    { name: 'Git', category: 'DevOps', level: 5 },
    { name: 'SVN', category: 'DevOps', level:5},
    { name: 'Docker', category: 'DevOps', level: 3 },
    {name: 'Kuberbetes', category: 'DevOps', level: 4 },
    {name: 'Kafka', category: 'DevOps', level: 4 },
    { name: 'CI/CD', category: 'DevOps', level: 4 },
    { name: 'Jira', category: 'DevOps', level: 4 },
    { name: 'IDEs', category: 'DevOps', level: 3 },
  ];
  
  const filteredSkills = activeTab === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeTab);

  return (
    <section id="skills" className="py-20 px-6 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-sm font-medium text-primary uppercase tracking-wider mb-2">Technical Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Skills & Technologies
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated selection of the technologies and tools I work with regularly,
            continuously expanding my expertise to tackle new challenges.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(['all', 'languages', 'frontend', 'backend', 'database', 'cloud', 'DevOps'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === tab 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filteredSkills.map((skill, index) => (
            <AnimatedSection 
              key={skill.name} 
              animation="fade-in" 
              delay={50 + index * 50}
              className="glass hover:glass-dark p-4 rounded-xl transition-all duration-300 hover:shadow-md"
            >
              <div className="text-center">
                <div className="mb-2">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {skill.name.substring(0, 2)}
                    </span>
                  </div>
                </div>
                <h4 className="font-medium mb-1">{skill.name}</h4>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 h-5 rounded-full",
                        i < skill.level ? "bg-primary" : "bg-secondary"
                      )}
                    />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
