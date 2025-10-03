import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Newspaper, Download, Calendar, ExternalLink, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Press = () => {
  const navigate = useNavigate();

  const pressReleases = [
    {
      title: "Gold Avenue Reaches $2.5 Billion in Assets Under Management",
      date: "December 15, 2024",
      excerpt: "Swiss precious metals platform achieves new milestone as institutional adoption accelerates",
      category: "Company News",
      downloadUrl: "#"
    },
    {
      title: "Gold Avenue Launches Advanced Portfolio Analytics for Institutional Clients",
      date: "November 28, 2024", 
      excerpt: "New features provide enhanced risk management and performance tracking capabilities",
      category: "Product Launch",
      downloadUrl: "#"
    },
    {
      title: "Q3 2024 Precious Metals Market Report Released",
      date: "October 15, 2024",
      excerpt: "Comprehensive analysis shows continued strong demand for physical precious metals",
      category: "Market Research",
      downloadUrl: "#"
    },
    {
      title: "Gold Avenue Expands to Asian Markets with Singapore Office",
      date: "September 10, 2024",
      excerpt: "Strategic expansion strengthens presence in key precious metals trading hub",
      category: "Company News",
      downloadUrl: "#"
    },
    {
      title: "Partnership Announced with Leading Swiss Bank for Custody Services", 
      date: "August 22, 2024",
      excerpt: "Enhanced security and compliance infrastructure for high-net-worth clients",
      category: "Partnership",
      downloadUrl: "#"
    }
  ];

  const mediaKit = [
    {
      name: "Gold Avenue Logo Package",
      description: "High-resolution logos in various formats (PNG, SVG, EPS)",
      size: "2.5 MB",
      type: "ZIP"
    },
    {
      name: "Company Fact Sheet",
      description: "Key statistics, milestones, and company overview",
      size: "1.2 MB", 
      type: "PDF"
    },
    {
      name: "Executive Headshots",
      description: "Professional photos of leadership team members",
      size: "15 MB",
      type: "ZIP"
    },
    {
      name: "Product Screenshots",
      description: "High-quality screenshots of platform and mobile app",
      size: "8.5 MB",
      type: "ZIP"
    }
  ];

  const executiveTeam = [
    {
      name: "Dr. Alexandra Müller",
      title: "Chief Executive Officer",
      bio: "Former Managing Director at UBS Precious Metals, 20+ years industry experience",
      available: true
    },
    {
      name: "Marc Dubois", 
      title: "Chief Technology Officer",
      bio: "Previously CTO at Credit Suisse Digital, fintech innovation specialist",
      available: true
    },
    {
      name: "Sarah Chen",
      title: "Head of Market Research",
      bio: "Former Goldman Sachs commodities analyst, PhD in Economics from LSE",
      available: true
    },
    {
      name: "Roberto Silva",
      title: "Chief Compliance Officer", 
      bio: "Ex-FINMA regulatory affairs, expert in Swiss financial regulations",
      available: false
    }
  ];

  const mediaContact = {
    name: "Emma Thompson",
    title: "Head of Communications",
    email: "press@goldavenue.com",
    phone: "+41 22 518 92 15",
    linkedin: "#"
  };

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Newspaper className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">Press Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Latest news, press releases, and media resources from Gold Avenue. 
            Your source for precious metals market insights and company updates.
          </p>
        </div>

        {/* Media Contact */}
        <Card className="mb-12 border-gold">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Media Contact</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{mediaContact.name}</h3>
                    <p className="text-muted-foreground">{mediaContact.title}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Email:</span> {mediaContact.email}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Phone:</span> {mediaContact.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Available Monday-Friday, 8:00 AM - 6:00 PM CET
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="gold">
                  Contact for Interview
                </Button>
                <Button variant="outline">
                  Download Media Kit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Press Releases */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Press Releases</h2>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Archive
            </Button>
          </div>
          
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{release.category}</Badge>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                      </div>
                      <CardTitle className="text-xl mb-3">{release.title}</CardTitle>
                      <CardDescription>{release.excerpt}</CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Media Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="mt-2">{item.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.size}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Executive Availability */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Executive Team Availability</h2>
          <Card>
            <CardHeader>
              <CardTitle>Available for Interviews</CardTitle>
              <CardDescription>
                Our leadership team is available for media interviews and expert commentary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {executiveTeam.map((executive, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <User className="w-12 h-12 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{executive.name}</h3>
                        <Badge variant={executive.available ? "default" : "secondary"}>
                          {executive.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{executive.title}</p>
                      <p className="text-sm text-muted-foreground">{executive.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Company Facts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Company at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gold mb-2">$2.5B+</div>
                <p className="text-muted-foreground">Assets Under Management</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gold mb-2">50K+</div>
                <p className="text-muted-foreground">Active Clients</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gold mb-2">40+</div>
                <p className="text-muted-foreground">Countries Served</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gold mb-2">25+</div>
                <p className="text-muted-foreground">Years Experience</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Press Inquiry CTA */}
        <Card className="bg-gradient-to-r from-navy-deep to-navy-light text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Press Inquiry?</h3>
            <p className="text-lg mb-6 opacity-90">
              Looking for expert commentary on precious metals markets or company news? 
              We're here to help with your story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy-deep"
                onClick={() => navigate("/contact")}
              >
                Submit Press Inquiry
              </Button>
              <Button variant="gold">
                Schedule Interview
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Press;