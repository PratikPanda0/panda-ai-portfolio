
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  input: string;
  output: string;
  timestamp: string;
}

const Terminal = ({ isOpen, onClose }: TerminalProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([
    {
      input: '',
      output: 'Welcome to Pratik\'s Interactive Terminal! Type "help" to see available commands.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const resumeData = {
    name: 'Pratik Kumar Panda',
    role: 'Assistant Manager, AI Engineer, Full-Stack Developer',
    email: 'pratik@example.com',
    experience: '5+ years in software development',
    skills: 'Generative AI, .NET, React, Azure, Full-Stack Development',
    education: 'Computer Science Engineering',
    location: 'India',
    specialization: 'GenAI Specialist, Cloud Solutions, Scalable Applications',
    description: 'Experienced software engineer specializing in Generative AI, Full-Stack Development, and Cloud Solutions'
  };

  const commands = {
    help: () => `Available commands:
• help - Show this help message
• clear - Clear terminal screen
• about - Brief information about Pratik
• query [question] - Ask questions about Pratik's background
• exit - Close terminal

Examples:
• query What is the role of the user?
• query What is the name of developer?
• query What are the skills?`,

    clear: () => '',
    
    about: () => `${resumeData.name}
${resumeData.role}
${resumeData.description}`,

    query: (question: string) => {
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('name') || lowerQuestion.includes('developer')) {
        return `Developer name: ${resumeData.name}`;
      }
      if (lowerQuestion.includes('role') || lowerQuestion.includes('position') || lowerQuestion.includes('job')) {
        return `Current role: ${resumeData.role}`;
      }
      if (lowerQuestion.includes('skill') || lowerQuestion.includes('technology') || lowerQuestion.includes('tech')) {
        return `Technical skills: ${resumeData.skills}`;
      }
      if (lowerQuestion.includes('experience') || lowerQuestion.includes('years')) {
        return `Experience: ${resumeData.experience}`;
      }
      if (lowerQuestion.includes('education') || lowerQuestion.includes('degree') || lowerQuestion.includes('study')) {
        return `Education: ${resumeData.education}`;
      }
      if (lowerQuestion.includes('location') || lowerQuestion.includes('where') || lowerQuestion.includes('based')) {
        return `Location: ${resumeData.location}`;
      }
      if (lowerQuestion.includes('email') || lowerQuestion.includes('contact')) {
        return `Email: ${resumeData.email}`;
      }
      if (lowerQuestion.includes('specialization') || lowerQuestion.includes('specialty')) {
        return `Specialization: ${resumeData.specialization}`;
      }
      
      return `I found information related to: ${resumeData.name} - ${resumeData.role}. Try asking about: name, role, skills, experience, education, location, or contact.`;
    },

    exit: () => {
      onClose();
      return 'Terminal closed.';
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add to command history
    setCommandHistory(prev => {
      const newHistory = [...prev, trimmedCmd];
      return newHistory.slice(-50); // Keep last 50 commands
    });
    setHistoryIndex(-1);

    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let output = '';

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (commands[command as keyof typeof commands]) {
      if (command === 'query' && args) {
        output = commands.query(args);
      } else if (command !== 'query') {
        output = (commands[command as keyof typeof commands] as () => string)();
      } else {
        output = 'Usage: query [your question]\nExample: query What is the role of the user?';
      }
    } else {
      output = `Command not found: ${command}. Type "help" for available commands.`;
    }

    if (command === 'exit') return;

    const newCommand: Command = {
      input: trimmedCmd,
      output,
      timestamp: new Date().toLocaleTimeString()
    };

    setHistory(prev => [...prev, newCommand]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.3);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(34, 197, 94, 0.5);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(34, 197, 94, 0.7);
    }
  `;

  useEffect(() => {
    // Add styles to document head
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      // Clean up styles when component unmounts
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[35vh] p-0 bg-black text-green-400 font-mono border-2 border-green-400/30">
        <DialogTitle className="sr-only">Interactive Terminal</DialogTitle>
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-400/30 bg-gradient-to-r from-green-900/20 to-green-800/20" style={{maxHeight: "5rem"}}>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-green-300 font-bold">pratik@terminal</span>
              <span className="text-green-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-green-300">$</span>
            </div>
          </div>
          {/* <button
            onClick={onClose}
            className="text-green-400 hover:text-green-300 transition-colors p-1 rounded hover:bg-green-900/30"
          >
            <X className="h-5 w-5" />
          </button> */}
        </div>

        {/* Terminal Content */}
        <div className="flex flex-col h-full bg-gradient-to-b from-black to-green-950/10">
          {/* History */}
          <div 
            ref={historyRef}
            className="flex-1 p-4 overflow-y-auto space-y-2 text-sm custom-scrollbar"
          >
            {history.map((cmd, index) => (
              <div key={index} className="space-y-1">
                {cmd.input && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-300/70 text-xs">[{cmd.timestamp}]</span>
                    <span className="text-green-300 font-bold">pratik@terminal</span>
                    <span className="text-green-500">:</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-green-300">$</span>
                    <span className="text-white font-medium">{cmd.input}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-green-400 ml-2 pl-4 border-l border-green-800/50">
                  {cmd.output}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-green-400/30 p-4 bg-gradient-to-r from-green-950/20 to-black">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <span className="text-green-300 font-bold">pratik@terminal</span>
              <span className="text-green-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-green-300">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white outline-none caret-green-400 font-medium"
                placeholder="Type a command... (Use ↑↓ for history)"
                autoComplete="off"
              />
            </form>
            <div className="mt-2 text-xs text-green-500/70">
              Use ↑↓ arrows for command history • Press Tab for suggestions • Type 'help' for commands
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Terminal;
