
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Search, Filter, Mail, MailOpen, Archive, Reply, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import ContactReplyDialog from '@/components/ContactReplyDialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  reply_status: 'pending' | 'replied' | 'archived';
}

interface ContactReply {
  id: string;
  reply_content: any[];
  reply_html: string;
  sent_at: string;
  sent_by: string | null;
}

const AdminContacts = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied' | 'archived'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [messageReplies, setMessageReplies] = useState<ContactReply[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in as admin
    const adminToken = localStorage.getItem('admin_token');
    
    if (!adminToken) {
      navigate('/admin');
      return;
    }

    fetchMessages();
  }, [navigate]);

  useEffect(() => {
    // Filter messages based on search and filters
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.reply_status === statusFilter);
    }

    if (readFilter !== 'all') {
      filtered = filtered.filter(msg => 
        readFilter === 'read' ? msg.is_read : !msg.is_read
      );
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter, readFilter]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const cleaned: ContactMessage[] = (data || []).map((msg): ContactMessage => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        created_at: msg.created_at,
        is_read: msg.is_read,
        reply_status: 
          msg.reply_status === 'pending' || 
          msg.reply_status === 'replied' || 
          msg.reply_status === 'archived'
            ? msg.reply_status
            : 'pending'
      }));

      setMessages(cleaned);
      
      toast({
        title: 'Messages Loaded',
        description: `Found ${cleaned.length} contact messages`,
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contact messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessageReplies = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_replies')
        .select('*')
        .eq('contact_message_id', messageId)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      // Transform the data to match our ContactReply interface
      const transformedReplies: ContactReply[] = (data || []).map(reply => ({
        id: reply.id,
        reply_content: Array.isArray(reply.reply_content) ? reply.reply_content : [],
        reply_html: reply.reply_html,
        sent_at: reply.sent_at,
        sent_by: reply.sent_by
      }));

      setMessageReplies(transformedReplies);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch replies',
        variant: 'destructive',
      });
    }
  };

  const updateMessageStatus = async (id: string, updates: Partial<ContactMessage>) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, ...updates } : msg
        )
      );

      toast({
        title: 'Updated',
        description: 'Message status updated successfully',
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive',
      });
    }
  };

  const markAsRead = (id: string) => {
    updateMessageStatus(id, { is_read: true });
  };

  const markAsUnread = (id: string) => {
    updateMessageStatus(id, { is_read: false });
  };

  const updateReplyStatus = (id: string, status: 'pending' | 'replied' | 'archived') => {
    updateMessageStatus(id, { reply_status: status });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      replied: 'secondary',
      archived: 'outline'
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status}
      </Badge>
    );
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    await fetchMessageReplies(message.id);
    setIsViewDialogOpen(true);
    
    // Mark as read if not already read
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const handleReplyMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsReplyDialogOpen(true);
    
    // Mark as read if not already read
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const handleReplySuccess = () => {
    fetchMessages(); // Refresh the messages list
  };

  const renderReplyContent = (content: any[]) => {
    return content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag key={index} className={`font-bold ${block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg'} mb-2`}>
              {block.content}
            </HeadingTag>
          );
        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-dev-primary pl-4 italic mb-4">
              {block.content}
            </blockquote>
          );
        case 'code':
          return (
            <pre key={index} className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto mb-4">
              <code>{block.content}</code>
            </pre>
          );
        case 'list':
          const items = block.content.split('\n').filter((item: string) => item.trim());
          return (
            <ul key={index} className="list-disc list-inside space-y-1 mb-4">
              {items.map((item: string, itemIndex: number) => (
                <li key={itemIndex}>{item.trim()}</li>
              ))}
            </ul>
          );
        default:
          return <p key={index} className="mb-4">{block.content}</p>;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dev-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold gradient-text">Contact Messages</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredMessages.length} of {messages.length} messages
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Search and filter contact messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setReadFilter('all');
                }}
                variant="outline"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id} className={!message.is_read ? 'bg-muted/30' : ''}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                    <TableCell>{format(new Date(message.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(message.reply_status)}</TableCell>
                    <TableCell>
                      {message.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-dev-primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewMessage(message)}
                          title="View message"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReplyMessage(message)}
                          title="Reply to message"
                        >
                          <Reply className="h-3 w-3" />
                        </Button>
                        
                        {!message.is_read ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(message.id)}
                            title="Mark as read"
                          >
                            <MailOpen className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsUnread(message.id)}
                            title="Mark as unread"
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateReplyStatus(message.id, 'archived')}
                          title="Archive"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredMessages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No messages found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-6">
                {/* Message Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Name:</strong> {selectedMessage.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedMessage.email}
                    </div>
                  </div>
                  <div>
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </div>
                  <div>
                    <strong>Date:</strong> {format(new Date(selectedMessage.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                  <div>
                    <strong>Status:</strong> {getStatusBadge(selectedMessage.reply_status)}
                  </div>
                </div>

                {/* Original Message */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Message:</h4>
                  <p>{selectedMessage.message}</p>
                </div>

                {/* Replies */}
                {messageReplies.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Replies ({messageReplies.length})
                    </h4>
                    {messageReplies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-dev-primary/5 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">Admin Reply</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(reply.sent_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {renderReplyContent(reply.reply_content)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleReplyMessage(selectedMessage);
                    }}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        {selectedMessage && (
          <ContactReplyDialog
            isOpen={isReplyDialogOpen}
            onClose={() => setIsReplyDialogOpen(false)}
            message={selectedMessage}
            onReplySuccess={handleReplySuccess}
          />
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
