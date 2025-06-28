
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: "🚀",
      color: "text-dev-primary",
      skills: ["C#", "JavaScript", "Python", "TypeScript", "SQL", "HTML/CSS"]
    },
    {
      title: "Frameworks & Libraries", 
      icon: "⚡",
      color: "text-dev-secondary",
      skills: [".NET", "ASP.NET MVC", ".NET Core", "Entity Framework", "React", "Django", "Vue.js"]
    },
    {
      title: "AI & Automation",
      icon: "🤖",
      color: "text-dev-accent",
      skills: ["OpenAI APIs", "Generative AI", "LLM Integration", "Email Automation", "Cognitive Search", "Prompt Engineering"]
    },
    {
      title: "Cloud & DevOps",
      icon: "☁️",
      color: "text-blue-400",
      skills: ["Azure", "Azure DevOps", "CI/CD Pipelines", "Docker", "Git", "GitHub Actions"]
    },
    {
      title: "Databases & Storage",
      icon: "🗄️",
      color: "text-green-400",
      skills: ["SQL Server", "MySQL", "PostgreSQL", "Azure Storage", "NoSQL", "Entity Framework"]
    },
    {
      title: "Tools & Platforms",
      icon: "🛠️",
      color: "text-orange-400",
      skills: ["Visual Studio", "VS Code", "Azure DevOps", "GitHub", "Postman", "Swagger", "Fiddler"]
    }
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground font-mono">&lt;</span>
            <span className="gradient-text">Skills & Technologies</span>
            <span className="text-muted-foreground font-mono">&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-dev-primary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground font-mono">
            // Constantly evolving tech stack
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300 hover:-translate-y-2 glass-effect animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="text-2xl animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                    {category.icon}
                  </span>
                  <span className={`${category.color} group-hover:scale-105 transition-transform`}>
                    {category.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex}
                      variant="secondary"
                      className="font-mono text-xs hover:bg-dev-primary hover:text-white transition-all duration-200 cursor-default hover:scale-105"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code snippet decoration */}
        <div className="mt-16 text-center">
          <div className="inline-block font-mono text-sm text-muted-foreground/60 p-4 rounded-lg glass-effect">
            <div className="text-dev-primary">// Tech stack overview</div>
            <div className="text-muted-foreground">
              const skills = expertise.map(tech =&gt; 
              <span className="text-dev-accent">mastery</span>);
            </div>
            <div className="text-dev-secondary">console.log(skills);</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
