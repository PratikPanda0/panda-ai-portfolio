
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Highlighter
} from 'lucide-react';

interface RichTextEditorProps {
  content: any[];
  onChange: (content: any[]) => void;
}

const AdvancedRichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [currentText, setCurrentText] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('paragraph');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentText.substring(start, end);
    
    if (!selectedText) return;

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'highlight':
        formattedText = `<mark>${selectedText}</mark>`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      default:
        formattedText = selectedText;
    }

    const newText = currentText.substring(0, start) + formattedText + currentText.substring(end);
    setCurrentText(newText);
  };

  const addBlock = (type: string, level?: number, url?: string) => {
    if (!currentText.trim() && type !== 'image' && type !== 'link') return;

    const newBlock: any = {
      type,
      content: currentText.trim(),
    };

    if (type === 'heading' && level) {
      newBlock.level = level;
    }

    if (type === 'link' && url) {
      newBlock.url = url;
      newBlock.content = currentText.trim() || 'Link text';
    }

    if (type === 'image' && url) {
      newBlock.url = url;
      newBlock.content = currentText.trim() || 'Image description';
    }

    const newContent = [...content, newBlock];
    onChange(newContent);
    setCurrentText('');
    setLinkUrl('');
    setImageUrl('');
    setShowLinkDialog(false);
    setShowImageDialog(false);
  };

  const removeBlock = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    onChange(newContent);
  };

  const formatButtons = [
    { icon: Bold, label: 'Bold', action: () => formatText('bold') },
    { icon: Italic, label: 'Italic', action: () => formatText('italic') },
    { icon: Underline, label: 'Underline', action: () => formatText('underline') },
    { icon: Strikethrough, label: 'Strike', action: () => formatText('strikethrough') },
    { icon: Highlighter, label: 'Highlight', action: () => formatText('highlight') },
    { icon: Code, label: 'Inline Code', action: () => formatText('code') },
  ];

  const blockButtons = [
    { icon: Heading1, label: 'H1', action: () => addBlock('heading', 1) },
    { icon: Heading2, label: 'H2', action: () => addBlock('heading', 2) },
    { icon: Heading3, label: 'H3', action: () => addBlock('heading', 3) },
    { icon: Quote, label: 'Quote', action: () => addBlock('quote') },
    { icon: Code, label: 'Code Block', action: () => addBlock('code') },
    { icon: List, label: 'List', action: () => addBlock('list') },
    { icon: ListOrdered, label: 'Ordered List', action: () => addBlock('ordered-list') },
  ];

  const renderBlock = (block: any, index: number) => {
    const baseClasses = "p-3 border rounded-lg mb-2 bg-muted/50 relative group";
    
    switch (block.type) {
      case 'heading':
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Heading {block.level}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                ×
              </Button>
            </div>
            <div 
              className={`font-bold ${block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg'}`}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
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
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                ×
              </Button>
            </div>
            <blockquote className="border-l-4 border-dev-primary pl-4 italic">
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            </blockquote>
          </div>
        );
      
      case 'code':
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Code Block</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
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
      case 'ordered-list':
        const items = block.content.split('\n').filter((item: string) => item.trim());
        const ListTag = block.type === 'ordered-list' ? 'ol' : 'ul';
        const listClass = block.type === 'ordered-list' ? 'list-decimal' : 'list-disc';
        
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">
                {block.type === 'ordered-list' ? 'Ordered List' : 'List'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                ×
              </Button>
            </div>
            <ListTag className={`${listClass} list-inside space-y-1`}>
              {items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item.trim() }} />
              ))}
            </ListTag>
          </div>
        );

      case 'link':
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Link</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                ×
              </Button>
            </div>
            <a 
              href={block.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {block.content}
            </a>
          </div>
        );

      case 'image':
        return (
          <div key={index} className={baseClasses}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-muted-foreground">Image</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(index)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                ×
              </Button>
            </div>
            <img 
              src={block.url} 
              alt={block.content} 
              className="max-w-full h-auto rounded"
            />
            {block.content && (
              <p className="text-sm text-muted-foreground mt-2">{block.content}</p>
            )}
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
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                ×
              </Button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: block.content }} />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Content Preview */}
          <div className="min-h-[300px] max-h-[500px] overflow-y-auto border rounded-lg p-4">
            {content.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Start writing your blog content below...
              </p>
            ) : (
              content.map((block, index) => renderBlock(block, index))
            )}
          </div>

          {/* Text Formatting Tools */}
          <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
            <span className="text-sm font-medium self-center mr-2">Format:</span>
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={button.action}
                disabled={!currentText}
                className="flex items-center gap-1"
              >
                <button.icon className="h-3 w-3" />
                {button.label}
              </Button>
            ))}
          </div>

          {/* Block Tools */}
          <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
            <span className="text-sm font-medium self-center mr-2">Blocks:</span>
            {blockButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={button.action}
                disabled={!currentText.trim()}
                className="flex items-center gap-1"
              >
                <button.icon className="h-3 w-3" />
                {button.label}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkDialog(true)}
              disabled={!currentText.trim()}
              className="flex items-center gap-1"
            >
              <Link className="h-3 w-3" />
              Link
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageDialog(true)}
              className="flex items-center gap-1"
            >
              <Image className="h-3 w-3" />
              Image
            </Button>
          </div>

          {/* Link Dialog */}
          {showLinkDialog && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">Link URL</label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <Button onClick={() => addBlock('link', undefined, linkUrl)}>Add Link</Button>
                <Button variant="ghost" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Image Dialog */}
          {showImageDialog && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={() => addBlock('image', undefined, imageUrl)}>Add Image</Button>
                <Button variant="ghost" onClick={() => setShowImageDialog(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Type your content here... Select text to format it."
              rows={6}
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

export default AdvancedRichTextEditor;
