
import { Card, CardContent } from '@/components/ui/card';
import { Code, Brain, Cloud, Users } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Code className="h-6 w-6 text-dev-primary" />,
      title: "4+ Years Experience",
      description: "Full-stack development with .NET, React, and modern web technologies"
    },
    {
      icon: <Brain className="h-6 w-6 text-dev-secondary" />,
      title: "AI & GenAI Specialist",
      description: "Expertise in OpenAI APIs, LLM integration, and intelligent automation"
    },
    {
      icon: <Cloud className="h-6 w-6 text-dev-accent" />,
      title: "Cloud Architecture",
      description: "Azure solutions, DevOps pipelines, and scalable cloud applications"
    },
    {
      icon: <Users className="h-6 w-6 text-dev-primary" />,
      title: "Technical Leadership",
      description: "Leading cross-functional teams and mentoring junior developers"
    }
  ];

  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground font-mono">&lt;</span>
            <span className="gradient-text">About Me</span>
            <span className="text-muted-foreground font-mono">&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-dev-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-slide-in-left">
            <div className="font-mono text-dev-primary mb-4">
              <span className="text-muted-foreground">const</span> developer = {'{'}
            </div>
            
            <div className="pl-6 space-y-4 text-lg leading-relaxed">
              <p>
                <span className="font-mono text-dev-accent">name:</span> "Pratik Kumar Panda",
              </p>
              <p>
                <span className="font-mono text-dev-accent">role:</span> "Assistant Manager & AI Engineer",
              </p>
              <p>
                <span className="font-mono text-dev-accent">location:</span> "Hyderabad, India",
              </p>
              <p>
                <span className="font-mono text-dev-accent">passion:</span> [
                <span className="text-dev-secondary">"Innovation"</span>,
                <span className="text-dev-secondary">"AI/ML"</span>,
                <span className="text-dev-secondary">"Problem Solving"</span>
                ]
              </p>
            </div>

            <div className="font-mono text-dev-primary mt-4">
              {'};'}
            </div>

            <div className="mt-8 space-y-4 text-muted-foreground">
              <p>
                I'm a passionate software engineer with over 4 years of experience in building 
                scalable web applications and AI-powered solutions. Currently serving as an 
                Assistant Manager at Firstsource Solutions, I specialize in .NET technologies, 
                React, and cutting-edge Generative AI implementations.
              </p>
              <p>
                My expertise spans across full-stack development, cloud architecture, and 
                intelligent automation systems. I've successfully led cross-functional teams 
                and delivered enterprise-grade solutions that drive business value and 
                operational efficiency.
              </p>
            </div>
          </div>

          {/* Highlights Cards */}
          <div className="grid sm:grid-cols-2 gap-6 animate-slide-in-right">
            {highlights.map((item, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300 hover:-translate-y-2 glass-effect"
              >
                <CardContent className="p-6">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-dev-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Code comment */}
        <div className="text-center mt-16 font-mono text-muted-foreground/60">
          // Always learning, always growing
        </div>
      </div>
    </section>
  );
};

export default About;
