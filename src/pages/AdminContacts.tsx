import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Search, Filter, Mail, MailOpen, Archive, Reply } from 'lucide-react';
import { format } from 'date-fns';

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

const AdminContacts = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied' | 'archived'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
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

      if (error) throw error;

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
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contact messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
                        
                        {message.reply_status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateReplyStatus(message.id, 'replied')}
                            title="Mark as replied"
                          >
                            <Reply className="h-3 w-3" />
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
      </div>
    </div>
  );
};

export default AdminContacts;
