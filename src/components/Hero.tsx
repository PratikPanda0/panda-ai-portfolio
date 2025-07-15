
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    'AI Engineer 🤖', 
    'Assistant Manager 📋',
    'Full-Stack Developer 💻',
    'GenAI Specialist 🧠',
    'Freelancer 💼',
    'Gamer 🎮',
    'Coffee Addict ☕',
    'Bug Hunter 🐛',
    'Hakuna Matata 🦁'
  ];

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    if (!isDeleting && displayText.length < currentText.length) {
      // Typing effect
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && displayText.length === currentText.length) {
      // Pause before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length > 0) {
      // Deleting effect
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length === 0) {
      // Move to next text
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }
  }, [displayText, currentIndex, isDeleting]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dev-dark via-dev-darker to-black">
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-dev-primary/5 to-transparent animate-pulse"></div>
        </div>
      </div>

      <div className="container-custom mx-auto px-4 relative z-10">
        <div className="text-center animate-fade-in">
          {/* Code-style greeting */}
          <div className="font-mono text-dev-primary mb-4 animate-slide-in-left">
            <span className="text-muted-foreground">console.log(</span>
            <span className="text-dev-accent">"Hello, World!"</span>
            <span className="text-muted-foreground">);</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block text-white mb-2">Pratik Kumar</span>
            <span className="block gradient-text">Panda</span>
          </h1>

          {/* Animated role */}
          <div className="h-16 flex items-center justify-center mb-8">
            <div className="font-mono text-xl md:text-2xl lg:text-3xl">
              <span className="text-muted-foreground">&lt;</span>
              <span className="text-dev-primary font-semibold">
                {displayText}
                {showCursor && <span className="text-dev-accent">|</span>}
              </span>
              <span className="text-muted-foreground"> /&gt;</span>
            </div>
          </div>

          {/* Professional subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-in-right">
            Experienced software engineer specializing in{' '}
            <span className="text-dev-accent font-semibold">Generative AI</span>,{' '}
            <span className="text-dev-secondary font-semibold">Full-Stack Development</span>, and{' '}
            <span className="text-dev-primary font-semibold">Cloud Solutions</span>.
            Building scalable applications with .NET, React, and Azure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-dev-primary hover:bg-dev-primary/90 text-white font-mono px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={scrollToContact}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="icon"
                className="border-dev-primary text-dev-primary hover:bg-dev-primary hover:text-white transition-all duration-300 hover:scale-110"
                asChild
              >
                <a href="https://github.com/PratikPanda007" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="border-dev-primary text-dev-primary hover:bg-dev-primary hover:text-white transition-all duration-300 hover:scale-110"
                asChild
              >
                <a href="https://www.linkedin.com/in/pratikkumarpanda/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ArrowDown className="h-6 w-6 text-dev-primary mx-auto" />
          </div>
        </div>
      </div>

      {/* Code snippet decoration */}
      <div className="absolute bottom-10 left-10 font-mono text-xs text-muted-foreground/30 hidden lg:block">
        <div>// Passionate about innovation</div>
        <div>// Ready to build the future</div>
      </div>
    </section>
  );
};

export default Hero;
