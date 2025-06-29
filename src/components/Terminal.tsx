
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 bg-black text-green-400 font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-green-300">pratik@terminal:~$</span>
          </div>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="flex flex-col h-full">
          {/* History */}
          <div 
            ref={historyRef}
            className="flex-1 p-4 overflow-y-auto space-y-2 text-sm"
          >
            {history.map((cmd, index) => (
              <div key={index} className="space-y-1">
                {cmd.input && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-300">[{cmd.timestamp}]</span>
                    <span className="text-blue-400">$</span>
                    <span className="text-white">{cmd.input}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-green-400 ml-4">
                  {cmd.output}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-green-800 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <span className="text-green-300">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none"
                placeholder="Type a command..."
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Terminal;
