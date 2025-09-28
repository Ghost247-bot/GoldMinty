import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Calculator, 
  TrendingUp, 
  Shield,
  Download,
  ExternalLink,
  Play,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Resources = () => {
  const navigate = useNavigate();
  const educationalResources = [
    {
      title: "Precious Metals Investment Guide",
      description: "Complete guide to investing in gold, silver, platinum, and palladium",
      type: "guide",
      icon: BookOpen,
      badge: "Essential",
      readTime: "15 min read"
    },
    {
      title: "Market Analysis Reports", 
      description: "Weekly and monthly market analysis from our expert team",
      type: "report",
      icon: TrendingUp,
      badge: "Weekly",
      readTime: "10 min read"
    },
    {
      title: "Storage Options Explained",
      description: "Understanding secure storage solutions for your precious metals",
      type: "guide",
      icon: Shield,
      badge: "Security",
      readTime: "8 min read"
    },
    {
      title: "Tax Implications of Precious Metals",
      description: "Important tax considerations for precious metals investors",
      type: "guide",
      icon: FileText,
      badge: "Legal",
      readTime: "12 min read"
    }
  ];

  const videoResources = [
    {
      title: "Getting Started with Gold Investment",
      description: "Introduction to gold investment for beginners",
      duration: "8:45",
      category: "Beginner"
    },
    {
      title: "Silver vs Gold: Which Should You Choose?",
      description: "Comparing investment characteristics of silver and gold",
      duration: "12:30",
      category: "Comparison"
    },
    {
      title: "Understanding Precious Metals Premiums",
      description: "Why products cost more than spot price and how to evaluate value",
      duration: "6:20",
      category: "Education"
    },
    {
      title: "Market Timing Strategies",
      description: "Advanced techniques for timing your precious metals purchases",
      duration: "15:15",
      category: "Advanced"
    }
  ];

  const tools = [
    {
      name: "Investment Calculator",
      description: "Calculate potential returns and portfolio allocation",
      icon: Calculator,
      action: "Launch Calculator"
    },
    {
      name: "Price Alerts",
      description: "Set up email alerts for price movements",
      icon: TrendingUp,
      action: "Set Alerts"
    },
    {
      name: "Portfolio Tracker",
      description: "Track your precious metals holdings and performance",
      icon: FileText,
      action: "View Portfolio"
    }
  ];

  const marketReports = [
    {
      title: "Q4 2024 Precious Metals Outlook",
      date: "December 2024",
      size: "2.4 MB",
      type: "PDF"
    },
    {
      title: "Global Gold Market Analysis",
      date: "November 2024", 
      size: "1.8 MB",
      type: "PDF"
    },
    {
      title: "Silver Industrial Demand Report",
      date: "October 2024",
      size: "3.1 MB", 
      type: "PDF"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Investment Resources</h1>
          <p className="text-muted-foreground">
            Educational materials, tools, and insights to help you make informed investment decisions
          </p>
        </div>

        {/* Educational Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Educational Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <resource.icon className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">{resource.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{resource.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{resource.readTime}</span>
                  <Button variant="outline" size="sm" onClick={() => navigate("/blog")}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Library */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Video Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoResources.map((video, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{video.title}</h3>
                      <Badge variant="outline">{video.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {video.duration}
                      </span>
                      <Button size="sm" onClick={() => navigate("/blog")}>
                        <Play className="w-4 h-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tools & Calculators */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Investment Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <tool.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="gold" className="w-full" onClick={() => {
                    navigate("/contact");
                    // In a real app, this would open a calculator tool
                  }}>
                    {tool.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Reports */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Market Reports</h2>
            <Button variant="outline" onClick={() => navigate("/blog")}>
              <Calendar className="w-4 h-4 mr-2" />
              View All Reports
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Latest Research & Analysis</CardTitle>
              <CardDescription>
                Download our comprehensive market reports and analysis documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="w-6 h-6 text-primary" />
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.date} • {report.size} • {report.type}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      // In a real app, this would trigger a download
                      window.open('/api/reports/' + report.title.toLowerCase().replace(/\s+/g, '-') + '.pdf', '_blank');
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* External Resources */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry News & Updates</CardTitle>
                <CardDescription>
                  Stay informed with the latest precious metals news and market developments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/blog")}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Blog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investor Community</CardTitle>
                <CardDescription>
                  Connect with other precious metals investors and share insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/help-center")}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Resources;