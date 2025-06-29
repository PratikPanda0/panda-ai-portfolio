
import { useToast } from '@/hooks/use-toast';

export const useDownloads = () => {
  const { toast } = useToast();

  const downloadResume = () => {
    // Create resume content
    const resumeContent = `
PRATIK KUMAR PANDA
Assistant Manager | AI Engineer | Full-Stack Developer

Contact Information:
• Email: pratik@example.com
• LinkedIn: https://www.linkedin.com/in/pratikkumarpanda/
• GitHub: https://github.com/PratikPanda007

Professional Summary:
Experienced software engineer with 5+ years in software development, specializing in Generative AI, Full-Stack Development, and Cloud Solutions. Expert in building scalable applications with .NET, React, and Azure.

Technical Skills:
• Programming Languages: C#, JavaScript, TypeScript, Python
• Frontend: React, HTML5, CSS3, Tailwind CSS
• Backend: .NET Core, Node.js, ASP.NET
• Cloud: Microsoft Azure, AWS
• Databases: SQL Server, PostgreSQL, MongoDB
• AI/ML: Generative AI, OpenAI APIs, Machine Learning
• DevOps: Docker, CI/CD, Git

Professional Experience:
Assistant Manager & AI Engineer
• Developed and deployed GenAI solutions
• Led full-stack development projects
• Implemented cloud-based architectures
• Managed cross-functional teams

Key Achievements:
• Successfully delivered 15+ enterprise applications
• Reduced development time by 40% through AI integration
• Implemented scalable cloud solutions serving 10k+ users
• Mentored junior developers and established best practices

Education:
Bachelor of Technology in Computer Science Engineering

Certifications:
• Microsoft Azure Certified
• AWS Cloud Practitioner
• Generative AI Specialist
    `.trim();

    // Create and download the file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Pratik_Kumar_Panda_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Resume Downloaded',
      description: 'Resume has been downloaded successfully!',
    });
  };

  const downloadBusinessCard = () => {
    // Business Card Text Content
    const businessCardText = `
╔══════════════════════════════════════════════════════════╗
║                    BUSINESS CARD                         ║
║                                                          ║
║              PRATIK KUMAR PANDA                          ║
║         Assistant Manager | AI Engineer                  ║
║            Full-Stack Developer                          ║
║                                                          ║
║  📧 Email: pratik@example.com                           ║
║  🔗 LinkedIn: linkedin.com/in/pratikkumarpanda/         ║
║  💻 GitHub: github.com/PratikPanda007                   ║
║                                                          ║
║  🎯 Specialties:                                         ║
║     • Generative AI & Machine Learning                  ║
║     • Full-Stack Development (.NET, React)              ║
║     • Cloud Solutions (Azure, AWS)                      ║
║     • Enterprise Application Development                 ║
║                                                          ║
║  "Building the future with AI and innovative tech"      ║
╚══════════════════════════════════════════════════════════╝
    `.trim();

    // Business Card PDF Content (simplified HTML to PDF simulation)
    const businessCardHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Business Card - Pratik Kumar Panda</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .card {
            width: 350px;
            height: 200px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 15px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { margin: 0; font-size: 24px; text-align: center; }
        h2 { margin: 5px 0; font-size: 14px; text-align: center; opacity: 0.9; }
        .contact { margin-top: 15px; font-size: 12px; }
        .skills { margin-top: 10px; font-size: 11px; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="card">
        <h1>PRATIK KUMAR PANDA</h1>
        <h2>Assistant Manager | AI Engineer | Full-Stack Developer</h2>
        <div class="contact">
            📧 pratik@example.com<br>
            🔗 linkedin.com/in/pratikkumarpanda/<br>
            💻 github.com/PratikPanda007
        </div>
        <div class="skills">
            <strong>Specialties:</strong> GenAI • Full-Stack Dev • Cloud Solutions
        </div>
    </div>
</body>
</html>
    `;

    // Download Text File
    const textBlob = new Blob([businessCardText], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = 'Pratik_Business_Card.txt';
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
    URL.revokeObjectURL(textUrl);

    // Download HTML File (can be saved as PDF by user)
    const htmlBlob = new Blob([businessCardHTML], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'Pratik_Business_Card.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    URL.revokeObjectURL(htmlUrl);

    // Create a simple JPEG using Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 400, 250);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 250);

      // Card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.roundRect(25, 25, 350, 200, 15);
      ctx.fill();

      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PRATIK KUMAR PANDA', 200, 70);
      
      ctx.font = '14px Arial';
      ctx.fillText('Assistant Manager | AI Engineer', 200, 95);
      ctx.fillText('Full-Stack Developer', 200, 115);
      
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('📧 pratik@example.com', 50, 150);
      ctx.fillText('🔗 linkedin.com/in/pratikkumarpanda/', 50, 170);
      ctx.fillText('💻 github.com/PratikPanda007', 50, 190);
      
      ctx.font = '11px Arial';
      ctx.fillText('Specialties: GenAI • Full-Stack Dev • Cloud Solutions', 50, 210);
    }

    // Download JPEG
    canvas.toBlob((blob) => {
      if (blob) {
        const jpegUrl = URL.createObjectURL(blob);
        const jpegLink = document.createElement('a');
        jpegLink.href = jpegUrl;
        jpegLink.download = 'Pratik_Business_Card.jpg';
        document.body.appendChild(jpegLink);
        jpegLink.click();
        document.body.removeChild(jpegLink);
        URL.revokeObjectURL(jpegUrl);
      }
    }, 'image/jpeg', 0.9);

    toast({
      title: 'Business Card Downloaded',
      description: 'Business card files (TXT, HTML, JPG) have been downloaded!',
    });
  };

  return {
    downloadResume,
    downloadBusinessCard,
  };
};
