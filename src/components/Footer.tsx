
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/PratikPanda007",
      label: "GitHub"
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/pratikkumarpanda/",
      label: "LinkedIn"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: "mailto:pratik.panda@gmail.com",
      label: "Email"
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dev-darker border-t border-dev-primary/20">
      <div className="container-custom mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <button 
              onClick={scrollToTop}
              className="font-mono font-bold text-2xl gradient-text hover:scale-105 transition-transform duration-300"
            >
              &lt;PratikPanda /&gt;
            </button>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              // Building the future with code
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-card/50 border border-border hover:border-dev-primary hover:bg-dev-primary/10 transition-all duration-300 hover:-translate-y-1"
                aria-label={social.label}
              >
                <div className="text-muted-foreground group-hover:text-dev-primary transition-colors">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <div className="font-mono text-sm text-muted-foreground">
              <div className="text-dev-primary">const contact = {'{'};</div>
              <div className="pl-2">
                email: <span className="text-dev-accent">"pratik.panda@gmail.com"</span>,
              </div>
              <div className="pl-2">
                location: <span className="text-dev-accent">"Hyderabad, India"</span>
              </div>
              <div className="text-dev-primary">{'};'}</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-mono text-sm text-muted-foreground">
              <span className="text-dev-primary">©</span> {currentYear} Pratik Kumar Panda. 
              <span className="text-dev-accent"> All rights reserved</span>.
            </div>
            
            <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              Built with <Heart className="h-4 w-4 text-red-500 animate-pulse" /> and 
              <span className="text-dev-primary">React</span> + 
              <span className="text-dev-secondary">TypeScript</span>
            </div>
          </div>
        </div>

        {/* Code comment */}
        <div className="text-center mt-8 font-mono text-xs text-muted-foreground/40">
          // Thank you for visiting my portfolio
        </div>
      </div>
    </footer>
  );
};

export default Footer;
