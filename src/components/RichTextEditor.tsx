
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Link,
  Image
} from 'lucide-react';

interface RichTextEditorProps {
  content: any[];
  onChange: (content: any[]) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [currentText, setCurrentText] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('paragraph');

  const addBlock = (type: string, level?: number) => {
    if (!currentText.trim()) return;

    const newBlock: any = {
      type,
      content: currentText.trim(),
    };

    if (type === 'heading' && level) {
      newBlock.level = level;
    }

    const newContent = [...content, newBlock];
    onChange(newContent);
    setCurrentText('');
  };

  const removeBlock = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    onChange(newContent);
  };

  const formatButtons = [
    { icon: Heading1, label: 'H1', action: () => addBlock('heading', 1) },
    { icon: Heading2, label: 'H2', action: () => addBlock('heading', 2) },
    { icon: Heading3, label: 'H3', action: () => addBlock('heading', 3) },
    { icon: Quote, label: 'Quote', action: () => addBlock('quote') },
    { icon: Code, label: 'Code', action: () => addBlock('code') },
    { icon: List, label: 'List', action: () => addBlock('list') },
  ];

  const renderBlock = (block: any, index: number) => {
    const baseClasses = "p-3 border rounded-lg mb-2 bg-muted/50";
    
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Heading {block.level}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <div className={`font-bold ${block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg'}`}>
              {block.content}
            </div>
          </div>
        );
      
      case 'quote':
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Quote</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <blockquote className="border-l-4 border-dev-primary pl-4 italic">
              {block.content}
            </blockquote>
          </div>
        );
      
      case 'code':
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Code</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <pre className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto">
              <code>{block.content}</code>
            </pre>
          </div>
        );
      
      case 'list':
        const items = block.content.split('\n').filter((item: string) => item.trim());
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">List</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {items.map((item: string, itemIndex: number) => (
                <li key={itemIndex}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        );
      
      default:
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Paragraph</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <p>{block.content}</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Content Preview */}
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-lg p-4">
            {content.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Start writing your blog content below...
              </p>
            ) : (
              content.map((block, index) => renderBlock(block, index))
            )}
          </div>

          {/* Editor Tools */}
          <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={button.action}
                disabled={!currentText.trim()}
                className="flex items-center gap-2"
              >
                <button.icon className="h-4 w-4" />
                {button.label}
              </Button>
            ))}
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Type your content here..."
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {currentText.trim() ? `${currentText.trim().length} characters` : 'Start typing...'}
              </span>
              <Button
                onClick={() => addBlock('paragraph')}
                disabled={!currentText.trim()}
                size="sm"
              >
                Add Paragraph
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
