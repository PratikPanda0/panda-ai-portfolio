
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "Mortgage Language Model",
      period: "2025/05 - Present",
      description: "Built a domain-specific LLM-powered assistant to support mortgage operations across origination, underwriting, and compliance. Delivered intelligent guidance on Form 1003 (Loan Application), reducing agent errors and accelerating processing.",
      features: [
        "Domain-specific LLM integration with OpenAI APIs",
        "Real-time document reference and guidance",
        "HMDA SOP compliance checks and fee comparison automation",
        "AI support for insurance validation and underwriting queries"
      ],
      technologies: ["OpenAI APIs", "LLM", ".NET", "Azure", "Form 1003"],
      category: "AI/ML",
      status: "Production"
    },
    {
      title: "Multi Channel Insights",
      period: "2025/02 - Present", 
      description: "Developed a cloud-native GenAI powered platform to unify customer interactions across text and audio channels for actionable business insights.",
      features: [
        "Real-time sentiment analysis and persona mapping",
        "Lead scoring using automated LLM pipelines", 
        "Role-based access control with project-specific workflows",
        "Bulk file uploads with Azure Storage integration"
      ],
      technologies: ["GenAI", "Azure", "Real-time Analytics", "LLM", "Cloud Storage"],
      category: "Platform",
      status: "Production"
    },
    {
      title: "AIStore",
      period: "2024/10 - Present",
      description: "Designed and launched AIStore, a unified portal to host and explore internal AI applications. Showcased 10+ apps across BFSI, Healthcare, Telecom, and EdTech domains.",
      features: [
        "Centralized AI application marketplace",
        "Multi-domain app showcase and discovery",
        "Usage tracking, ratings, and feedback system",
        "Support for LLMs, LangChain, AWS AI, and other models"
      ],
      technologies: ["React", "Node.js", "AI Integration", "Multi-domain", "Analytics"],
      category: "Platform",
      status: "Production"
    },
    {
      title: "Email Automation Hub",
      period: "2024/04 - Present",
      description: "Built robust email extraction system integrated with multiple mail servers. Leveraged OCR and AI to auto-generate email replies with contextual accuracy.",
      features: [
        "Multi-server email integration and extraction",
        "OCR processing for document analysis",
        "AI-powered contextual email response generation",
        "40% improvement in team productivity through automation"
      ],
      technologies: ["OCR", "AI/ML", "Email APIs", "Automation", "Multi-server"],
      category: "Automation",
      status: "Production"
    },
    {
      title: "FirstSenseAI",
      period: "2022/08 - Present",
      description: "Developed customer-facing solutions using generative AI. Showcased cutting-edge applications for improving customer experience and created reusable modules for rapid prototyping.",
      features: [
        "Customer-facing generative AI solutions",
        "Cutting-edge AI applications for CX improvement", 
        "Reusable modules and dashboards",
        "Rapid prototyping framework"
      ],
      technologies: ["Generative AI", "Customer Experience", "Prototyping", "Modules"],
      category: "AI/ML",
      status: "Production"
    },
    {
      title: "Cognitive Search", 
      period: "2023/05 - Present",
      description: "Built a unified search interface supporting diverse document formats. Designed real-time side window preview, enhancing user productivity with intelligent search capabilities.",
      features: [
        "Multi-format document search interface",
        "Real-time preview with side window",
        "Intelligent search with cognitive capabilities",
        "Enhanced user productivity features"
      ],
      technologies: ["Search APIs", "Document Processing", "Real-time", "UI/UX"],
      category: "Search",
      status: "Production"
    },
    {
      title: "Nirmaan (NGO Project)",
      period: "2023/02 - 2023/11",
      description: "Pro Bono Website Development for NGO: Designed full-stack website for campaign management via Email/SMS. Enabled dynamic campaign creation with modular templates and real-time analytics.",
      features: [
        "Full-stack NGO campaign management system",
        "Email/SMS campaign automation",
        "Dynamic campaign creation with templates",
        "Real-time analytics and reporting"
      ],
      technologies: ["Full-stack", "Email/SMS APIs", "Templates", "Analytics", "NGO"],
      category: "Social Impact",
      status: "Completed"
    },
    {
      title: "Operation Health Dashboard",
      period: "2021/12 - Present",
      description: "Built a responsive dashboard for operational risk alerts used by leadership. Developed mobile-friendly surveys and analytics to aid decision-making.",
      features: [
        "Leadership-focused operational dashboard",
        "Mobile-friendly survey system",
        "Risk alert management",
        "Decision-making analytics"
      ],
      technologies: ["Dashboard", "Mobile-friendly", "Analytics", "Risk Management"],
      category: "Dashboard",
      status: "Production"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI/ML': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Platform': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Automation': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Search': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Social Impact': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'Dashboard': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground font-mono">&lt;</span>
            <span className="gradient-text">Featured Projects</span>
            <span className="text-muted-foreground font-mono">&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-dev-primary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground font-mono">
            // Showcasing impactful solutions and innovations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300 hover:-translate-y-2 glass-effect animate-fade-in h-full flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <CardTitle className="text-xl group-hover:text-dev-primary transition-colors flex-1">
                    {project.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getCategoryColor(project.category)}>
                      {project.category}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {project.period}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-sm text-dev-accent">Key Features:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-dev-primary mt-1 text-xs">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge 
                        key={i}
                        variant="secondary" 
                        className="font-mono text-xs hover:bg-dev-primary hover:text-white transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Project actions could be added here if needed */}
                  <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-dev-primary text-dev-primary hover:bg-dev-primary hover:text-white"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code snippet decoration */}
        <div className="mt-16 text-center">
          <div className="inline-block font-mono text-sm text-muted-foreground/60 p-4 rounded-lg glass-effect">
            <div className="text-dev-primary">// Project portfolio summary</div>
            <div className="text-muted-foreground">
              const impact = projects.reduce((acc, project) =&gt; 
              <span className="text-dev-accent">acc + project.value</span>, 
              <span className="text-dev-secondary">0</span>);
            </div>
            <div className="text-green-400">console.log('Innovation delivered:', impact);</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
