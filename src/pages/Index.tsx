
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Terminal as TerminalIcon } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { useDownloads } from '@/hooks/useDownloads';

const Index = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { downloadResume, downloadBusinessCard } = useDownloads();

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    // Handle backtick key press for terminal
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '`') {
        event.preventDefault();
        setIsTerminalOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      
      {/* Download Buttons - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3" style={{bottom: "6.5rem"}}>
        <Button
          onClick={downloadResume}
          className="bg-dev-primary hover:bg-dev-primary/90 text-white shadow-lg hover:scale-105 transition-all duration-300"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Resume
        </Button>
        
        <Button
          onClick={downloadBusinessCard}
          className="bg-dev-secondary hover:bg-dev-secondary/90 text-white shadow-lg hover:scale-105 transition-all duration-300"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Business Card
        </Button>

        <Button
          onClick={() => setIsTerminalOpen(true)}
          className="bg-black hover:bg-gray-800 text-green-400 shadow-lg hover:scale-105 transition-all duration-300 border border-green-400"
          size="sm"
        >
          <TerminalIcon className="mr-2 h-4 w-4" />
          Terminal (`)
        </Button>
      </div>

      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      
      <Footer />
      
      {/* Terminal Component */}
      <Terminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
      />
    </div>
  );
};

export default Index;
