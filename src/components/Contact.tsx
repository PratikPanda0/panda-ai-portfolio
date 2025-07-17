import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        ]);

      if (error) {
        console.error('Error inserting contact message:', error);
        throw error;
      }

      console.log('Contact message saved successfully:', data);

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "contactus@pratikpanda.in",
      href: "mailto:contactus@pratikpanda.in"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Phone", 
      value: "+91 7008166268",
      href: "tel:+917008166268"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: "Hyderabad, India",
      href: "#"
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      label: "GitHub",
      href: "https://github.com/PratikPanda007",
      username: "PratikPanda007"
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn", 
      href: "https://www.linkedin.com/in/pratikkumarpanda/",
      username: "pratikkumarpanda"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground font-mono">&lt;</span>
            <span className="gradient-text">Get In Touch</span>
            <span className="text-muted-foreground font-mono">&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-dev-primary mx-auto rounded-full mb-4"></div>
          <p className="text-muted-foreground font-mono">
            // Let's build something amazing together
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-semibold mb-6 gradient-text">Let's Connect</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, innovative projects, 
                or just having a chat about technology and AI. Feel free to reach out!
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="p-3 rounded-lg bg-dev-primary/10 text-dev-primary group-hover:bg-dev-primary group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      {item.href === "#" ? (
                        <p className="text-muted-foreground">{item.value}</p>
                      ) : (
                        <a 
                          href={item.href}
                          className="text-muted-foreground hover:text-dev-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-semibold mb-4 text-dev-accent">Follow Me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg bg-card border border-border hover:border-dev-primary hover:bg-dev-primary/10 transition-all duration-300"
                    >
                      <div className="text-muted-foreground group-hover:text-dev-primary transition-colors">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass-effect hover:shadow-lg hover:shadow-dev-primary/20 transition-all duration-300 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl">Send me a message</CardTitle>
                <div className="font-mono text-sm text-muted-foreground">
                  <span className="text-dev-primary">const</span> message = {'{'}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium font-mono text-dev-accent">
                        name:
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium font-mono text-dev-accent">
                        email:
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium font-mono text-dev-accent">
                      subject:
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium font-mono text-dev-accent">
                      message:
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your project or just say hello..."
                      rows={6}
                      required
                      className="font-mono resize-none"
                    />
                  </div>

                  <div className="font-mono text-sm text-muted-foreground mb-6">
                    {'};'}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-dev-primary hover:bg-dev-primary/90 text-white font-mono"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Code snippet decoration */}
        <div className="mt-16 text-center">
          <div className="inline-block font-mono text-sm text-muted-foreground/60 p-4 rounded-lg glass-effect">
            <div className="text-dev-primary">// Ready to collaborate</div>
            <div className="text-muted-foreground">
              if (opportunity.isExciting() && project.hasImpact()) {'{'}
            </div>
            <div className="text-dev-accent pl-4">return "Let's build it together!";</div>
            <div className="text-muted-foreground">{'}'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
