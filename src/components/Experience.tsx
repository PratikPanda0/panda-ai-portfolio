
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: "Assistant Manager",
      company: "Firstsource Solutions",
      location: "Hyderabad, India",
      period: "2025/05 - Present",
      description: "Leading the design and development of GenAI-powered web applications with a focus on scalability and performance. Spearheading cross-functional collaboration between engineering, data science, and product teams.",
      achievements: [
        "Leading design and development of GenAI-powered web applications",
        "Spearheading cross-functional collaboration between teams",
        "Mentoring junior developers and promoting coding best practices",
        "Managing end-to-end project lifecycles for AI-driven tools",
        "Driving innovation in AI product delivery using OpenAI APIs and automation tools"
      ],
      technologies: [".NET", "GenAI", "OpenAI APIs", "Azure", "React", "Leadership"]
    },
    {
      title: "Senior Software Engineer",
      company: "Firstsource Solutions", 
      location: "Hyderabad, India",
      period: "2024/05 - 2025/04",
      description: "Developed and deployed Generative AI models in enterprise applications, improving decision-making workflows. Built scalable backend solutions using ASP.NET and MVC with Entity Framework.",
      achievements: [
        "Developed and deployed Generative AI models in enterprise applications",
        "Architected scalable backend solutions using ASP.NET MVC and Entity Framework",
        "Contributed to Cognitive Search and Email Automation platforms",
        "Collaborated on CI/CD setup using Azure DevOps",
        "Achieved 40% process efficiency improvement"
      ],
      technologies: ["ASP.NET", "MVC", "Entity Framework", "GenAI", "Azure DevOps", "CI/CD"]
    },
    {
      title: "Junior Software Engineer",
      company: "Firstsource Solutions",
      location: "Hyderabad, India", 
      period: "2021/09 - 2024/04",
      description: "Built internal tools like Issue Management System and Escalation Platform using .NET Framework and SQL Server. Ensured cross-system communication through REST APIs and web services.",
      achievements: [
        "Built Issue Management System and Escalation Platform using .NET Framework",
        "Ensured seamless integration of REST APIs and web services",
        "Conducted comprehensive unit and integration testing",
        "Reduced defects by 25% through quality assurance practices",
        "Worked on client-specific deliverables under tight deadlines"
      ],
      technologies: [".NET Framework", "SQL Server", "REST APIs", "Unit Testing", "Web Services"]
    }
  ];

  return (
    <section id="experience" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground font-mono">&lt;</span>
            <span className="gradient-text">Professional Experience</span>
            <span className="text-muted-foreground font-mono">&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-dev-primary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground font-mono">
            // Career progression and key achievements
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-dev-primary/30 transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-dev-primary rounded-full transform -translate-x-1/2 animate-glow border-4 border-background"></div>

                {/* Content */}
                <div className={`w-full md:w-1/2 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}`}>
                  <Card className="group hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300 hover:-translate-y-2 glass-effect">
                    <CardHeader>
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <Badge variant="outline" className="text-dev-primary border-dev-primary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {exp.period}
                        </Badge>
                        <Badge variant="outline" className="text-dev-secondary border-dev-secondary">
                          <MapPin className="w-3 h-3 mr-1" />
                          {exp.location}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl group-hover:text-dev-primary transition-colors">
                        {exp.title}
                      </CardTitle>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-dev-accent">Key Achievements:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-dev-primary mt-1.5 text-xs">▸</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.technologies.map((tech, i) => (
                          <Badge 
                            key={i}
                            variant="secondary" 
                            className="font-mono text-xs hover:bg-dev-primary hover:text-white transition-all duration-200"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">Education</h3>
          <Card className="glass-effect hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-2">Bachelor of Technology</h4>
                <p className="text-dev-primary font-medium">Computer Science and Engineering</p>
                <p className="text-muted-foreground">Institute of Education and Research (I.T.E.R)</p>
                <Badge variant="outline" className="mt-2">2015 - 2019</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Experience;
