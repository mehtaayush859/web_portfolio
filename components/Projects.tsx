
import AnimatedSection from './AnimatedSection';
import ProjectCard, { ProjectProps } from './ProjectCard';

const Projects = () => {
  const projects: ProjectProps[] = [
    {
      title: "Real-Time Object Detection System",
      description: "Built a synchronous object detection system to address the challenge of accurate tracing in resource constrained envs.",
      image: "./obj_dec_1.jpg",
      tags: ["Python", "Open CV", "TensorFlow", "Excel", "REST API"],
      github: "https://github.com/mehtaayush859/real_time_object_detection"
    },
    {
      title: "Image Processing System",
      description: "A CLI Interface portal to change, edit, modify, resize and perform various operations on images in one single API call.",
      image: "./individual_project_img.png",
      tags: ["Python", "Javascript", "GRPC", "ProtoBuff"],
      github: "https://github.com/mehtaayush859/image_processing_system"
    },
    {
      title: "Casting Agency App",
      description: "A comprehensive casting application that allows users to cast celebrities and actors to work in their team.",
      image: "./cast_agency_1.jpg",
      tags: ["Android", "Kotlin", "Firebase", "Android Studio"],
      github: "https://github.com/mehtaayush859/casting_agency_app"
    },
    {
      title: "Password Cracking Tool",
      description: "A fun script and a tool for cracking password using payloads provided in common password file.",
      image: "./pass_crack_1.jpg",
      tags: ["Python", "Penetration Testing", "Cyber Security", "Payloads"],
      github: "https://github.com/mehtaayush859/password_generater_and_cracker"
    },
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-sm font-medium text-primary uppercase tracking-wider mb-2">My Work</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Featured Projects
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore some of my recent work, showcasing my expertise in building 
            amazing applications and some cool stuff for fun.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={project.title} animation="scale-in" delay={100 * index}>
              <ProjectCard {...project} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12 text-center">
          <a 
            href="https://github.com/mehtaayush859/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View more projects on GitHub <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-px"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Projects;
