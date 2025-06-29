
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';

interface ContactReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  onReplySuccess: () => void;
}

const ContactReplyDialog = ({ isOpen, onClose, message, onReplySuccess }: ContactReplyDialogProps) => {
  const [replyContent, setReplyContent] = useState<any[]>([]);
  const [replySubject, setReplySubject] = useState(`Re: ${message.subject}`);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const convertContentToHtml = (content: any[]) => {
    return content.map(block => {
      switch (block.type) {
        case 'heading':
          return `<h${block.level}>${block.content}</h${block.level}>`;
        case 'quote':
          return `<blockquote>${block.content}</blockquote>`;
        case 'code':
          return `<pre><code>${block.content}</code></pre>`;
        case 'list':
          const items = block.content.split('\n').filter((item: string) => item.trim());
          return `<ul>${items.map((item: string) => `<li>${item.trim()}</li>`).join('')}</ul>`;
        default:
          return `<p>${block.content}</p>`;
      }
    }).join('');
  };

  const handleSendReply = async () => {
    if (replyContent.length === 0) {
      toast({
        title: 'Error',
        description: 'Please write a reply before sending',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const replyHtml = convertContentToHtml(replyContent);
      
      // Insert the reply into the database
      const { error } = await supabase
        .from('contact_replies')
        .insert({
          contact_message_id: message.id,
          reply_content: replyContent,
          reply_html: replyHtml,
          sent_by: 'admin'
        });

      if (error) throw error;

      // Update the original message status to 'replied'
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ reply_status: 'replied' })
        .eq('id', message.id);

      if (updateError) throw updateError;

      toast({
        title: 'Reply Sent',
        description: 'Your reply has been saved successfully',
      });

      // Reset form and close dialog
      setReplyContent([]);
      setReplySubject(`Re: ${message.subject}`);
      onReplySuccess();
      onClose();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reply to Contact Message</DialogTitle>
          <DialogDescription>
            Replying to message from {message.name} ({message.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Message */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Original Message:</h4>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Subject:</strong> {message.subject}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>From:</strong> {message.name} ({message.email})
            </p>
            <p className="text-sm">{message.message}</p>
          </div>

          {/* Reply Subject */}
          <div className="space-y-2">
            <Label htmlFor="reply-subject">Reply Subject</Label>
            <Input
              id="reply-subject"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              placeholder="Reply subject"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>Reply Message</Label>
            <RichTextEditor
              content={replyContent}
              onChange={setReplyContent}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactReplyDialog;
