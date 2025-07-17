
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Project {
  ProjID: string;
  ProjName: string;
  ProjDesc: string;
  ProjURL: string;
  ProjImg: string;
  tags: string[];
}

const Freelance = () => {
  // Sample project data - you can update this with your actual projects
    const genUniqueProjID = () => {
    return 'proj_' + Math.random().toString(36).substr(2, 9);
  };

  const [projects] = useState<Project[]>([
    {
      ProjID: genUniqueProjID(),
      ProjName: "Priya Legal Portfolio",
      ProjDesc: "A personal legal portfolio website for my client who works in High Court of Calcutta.",
      ProjURL: "https://priyabanerjee.in/",
      ProjImg: "/images/freelancing/priya-legal-portfolio.png",
      tags: ["Live Project", "Client"]
    },
    {
      ProjID: genUniqueProjID(),
      ProjName: "GEOSTRATACONSULTANCY PRIVATE LIMITED",
      ProjDesc: "GeoStrata Consultancy Private Limited is a multidisciplinary enterprise driven by expertise, innovation, and integrity.",
      ProjURL: "https://geostrata.org/",
      ProjImg: "/images/freelancing/geostrata.png",
      tags: ["Live Project", "Client"]
    },
    {
      ProjID: genUniqueProjID(),
      ProjName: "Juris-Smart",
      ProjDesc: "Streamline your legal workflow with smart contract drafting, document analysis, and AI-driven legal advice. Save time and reduce costs with JurisSmart.",
      ProjURL: "https://juris-smart-assist.vercel.app/",
      ProjImg: "/images/freelancing/juris-smart.png",
      tags: ["Live Project", "Internal"]
    },
    {
      ProjID: genUniqueProjID(),
      ProjName: "DairyDelight E-Commerce Platform",
      ProjDesc: "Modern e-commerce solution with React, Node.js, and Stripe integration. Features include product catalog, shopping cart, and secure payment processing.",
      ProjURL: "https://dairy-delight-amber.vercel.app/",
      ProjImg: "/images/freelancing/dairydelight.png",
      tags: ["Live Project", "Client", "POC"]
    },
    // {
    //   ProjID: genUniqueProjID(),
    //   ProjName: "Portfolio Website",
    //   ProjDesc: "Responsive portfolio website built with React and TypeScript. Features smooth animations, dark mode, and optimized performance.",
    //   ProjURL: "https://example-portfolio.com",
    //   ProjImg: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    //   tags: ["Live Project", "Client"]
    // },
    // {
    //   ProjID: genUniqueProjID(),
    //   ProjName: "Restaurant Website",
    //   ProjDesc: "Modern restaurant website with online reservation system, menu display, and location integration. Built with responsive design principles.",
    //   ProjURL: "https://example-restaurant.com",
    //   ProjImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    //   tags: ["Live Project", "Client"]
    // },
    // {
    //   ProjID: genUniqueProjID(),
    //   ProjName: "Fitness Tracking App",
    //   ProjDesc: "Mobile-first fitness application with workout tracking, progress analytics, and social features. Integrated with health APIs.",
    //   ProjURL: "",
    //   ProjImg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    //   tags: ["Dev Env", "Internal"]
    // },
    // {
    //   ProjID: genUniqueProjID(),
    //   ProjName: "Real Estate Platform",
    //   ProjDesc: "Comprehensive real estate platform with property listings, virtual tours, and mortgage calculator. Features advanced search and filtering.",
    //   ProjURL: "https://example-realestate.com",
    //   ProjImg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    //   tags: ["Live Project", "Client"]
    // }
  ]);

  const handleProjectClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(
    (project) =>
      project.ProjName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ProjDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="section-padding">
        <div className="container-custom">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-muted-foreground font-mono">&lt;</span>
              <span className="gradient-text">Freelance Projects</span>
              <span className="text-muted-foreground font-mono">&gt;</span>
            </h1>
            <div className="w-20 h-1 bg-dev-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
              // Showcasing custom web solutions and applications built for clients
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-10 flex justify-center">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md p-3 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dev-primary/40 transition"
            />
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card 
                key={project.ProjID}
                className="group hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300 hover:-translate-y-2 glass-effect animate-fade-in h-full flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={project.ProjImg} 
                    alt={project.ProjName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-dev-primary transition-colors">
                    {project.ProjName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {project.ProjDesc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <Badge 
                        key={i}
                        variant="secondary" 
                        className="font-mono text-xs bg-dev-primary/10 text-dev-primary border-dev-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {project.ProjURL ? (
                      <>
                        <Badge 
                          variant="secondary" 
                          className="font-mono text-xs bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          Live
                        </Badge>
                        
                        <Button
                          onClick={() => handleProjectClick(project.ProjURL)}
                          size="sm"
                          className="bg-dev-primary hover:bg-dev-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 group/btn"
                        >
                          <span className="mr-2">View</span>
                          <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </>
                    ) : (
                      <Badge 
                        variant="outline"
                        className="font-mono text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                      >
                        Dev Env
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="inline-block p-8 rounded-lg glass-effect">
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Ready to Start Your Project?
              </h3>
              <p className="text-muted-foreground mb-6 font-mono">
                // Let's build something amazing together
              </p>
              <Button
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg"
                className="bg-dev-secondary hover:bg-dev-secondary/90 text-white shadow-lg"
              >
                Get In Touch
              </Button>
            </div>
          </div>

          {/* Code snippet decoration */}
          <div className="mt-16 text-center">
            <div className="inline-block font-mono text-sm text-muted-foreground/60 p-4 rounded-lg glass-effect">
              <div className="text-dev-primary">// Portfolio stats</div>
              <div className="text-muted-foreground">
                const totalProjects = <span className="text-dev-accent">{projects.length}</span>;
              </div>
              <div className="text-muted-foreground">
                const satisfiedClients = <span className="text-dev-accent">{projects.length}</span>;
              </div>
              <div className="text-green-400">console.log('Building digital experiences');</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Freelance;
