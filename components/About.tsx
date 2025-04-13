
import { Code, Briefcase, GraduationCap, Heart } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const About = () => {
  return (
    <section id="about" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-sm font-medium text-primary uppercase tracking-wider mb-2">About Me</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            My Journey as a Developer
          </h3>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="slide-up" className="order-2 md:order-1">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                I'm a passionate Software Engineer and Cybersecurity Enthusiast with a strong background in 
                backend development, distributed systems, and AI-powered applications. Currently pursuing a 
                Master's in Computer Science at Seattle University, I'm driven to create innovative solutions 
                to complex technical challenges.
              </p>
              <p className="text-lg leading-relaxed">
                My expertise spans multiple languages and frameworks including Python, Java, JavaScript, React.js, 
                Node.js, Flask, and Django. I've developed scalable RESTful APIs, implemented gRPC-based microservices, 
                and built real-time object detection systems leveraging modern technologies.
              </p>
              <p className="text-lg leading-relaxed">
                Beyond development, I'm particularly passionate about cybersecurity, cloud computing, and AI-driven 
                innovations. My hands-on experience in penetration testing and security analysis complements my 
                software engineering skills, allowing me to build not only functional but also secure applications.
              </p>
              <p className="text-lg leading-relaxed">
              With my expertise in software development and deep understanding of cyber security principles, 
              I strive to create secure and efficient solutions. I am dedicated to continuously expanding 
              my knowledge and staying up-to-date with the latest industry trends to deliver innovative and 
              resilient software applications.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={200} className="order-1 md:order-2">
            <div className="space-y-6">
              <div className="glass p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <Code size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Technical Skills</h4>
                    <p className="text-muted-foreground">
                      Proficient in Python, Java, JavaScript, React.js, Node.js, Flask, and Django.
                      Experienced with RESTful APIs, gRPC, and real-time systems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Professional Experience</h4>
                    <p className="text-muted-foreground">
                      Built scalable backend systems, developed AI-powered applications,
                      and implemented secure software solutions across multiple domains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Education</h4>
                    <p className="text-muted-foreground">
                      Currently pursuing a Master's in Computer Science at Seattle University,
                      with focus on advanced software engineering and cybersecurity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl">
                <div className="flex items-start">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Passion</h4>
                    <p className="text-muted-foreground">
                      Deeply passionate about cybersecurity, cloud computing, and AI-driven innovations,
                      constantly learning and applying new technologies to solve real-world problems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
