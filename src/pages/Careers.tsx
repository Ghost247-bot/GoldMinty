import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MapPin, Clock, Briefcase, Heart, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Careers = () => {
  const navigate = useNavigate();

  const openPositions = [
    {
      title: "Senior Precious Metals Analyst",
      department: "Research & Analysis",
      location: "Geneva, Switzerland",
      type: "Full-time",
      level: "Senior",
      description: "Lead market analysis and research for gold, silver, platinum, and palladium markets",
      requirements: ["5+ years precious metals experience", "CFA or equivalent certification", "Fluent in English and French"]
    },
    {
      title: "Customer Success Manager", 
      department: "Customer Experience",
      location: "Geneva, Switzerland / Remote",
      type: "Full-time", 
      level: "Mid-level",
      description: "Build relationships with high-value clients and ensure exceptional service delivery",
      requirements: ["3+ years client management experience", "Financial services background preferred", "Excellent communication skills"]
    },
    {
      title: "Full-Stack Developer",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      level: "Mid-Senior",
      description: "Develop and maintain our trading platform and customer-facing applications",
      requirements: ["React/TypeScript expertise", "Node.js backend experience", "Financial technology experience a plus"]
    },
    {
      title: "Compliance Officer",
      department: "Risk & Compliance",
      location: "Geneva, Switzerland",
      type: "Full-time",
      level: "Senior", 
      description: "Ensure regulatory compliance across all business operations and client interactions",
      requirements: ["Swiss financial regulation expertise", "AML/KYC certification", "Legal or compliance background"]
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Geneva, Switzerland / Remote",
      type: "Full-time",
      level: "Mid-level",
      description: "Drive digital marketing initiatives and customer acquisition strategies",
      requirements: ["Digital marketing experience", "Financial services knowledge", "Multi-language capabilities preferred"]
    }
  ];

  const benefits = [
    {
      title: "Competitive Compensation",
      description: "Market-leading salary with performance bonuses and equity participation",
      icon: Target
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance, dental, and wellness programs",
      icon: Heart
    },
    {
      title: "Professional Development", 
      description: "Continuous learning opportunities, conference attendance, and certification support",
      icon: Users
    },
    {
      title: "Work-Life Balance",
      description: "Flexible working arrangements, generous vacation policy, and sabbatical options",
      icon: Clock
    }
  ];

  const values = [
    {
      value: "Excellence",
      description: "We strive for excellence in everything we do, from client service to product quality"
    },
    {
      value: "Integrity", 
      description: "Transparency, honesty, and ethical behavior guide all our business decisions"
    },
    {
      value: "Innovation",
      description: "We continuously innovate to provide better solutions for our clients"
    },
    {
      value: "Collaboration",
      description: "We believe in the power of teamwork and diverse perspectives"
    }
  ];

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
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build your career with Gold Avenue, where innovation meets tradition in the precious metals industry. 
            Join a team that values excellence, integrity, and continuous growth.
          </p>
        </div>

        {/* Company Culture */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Why Gold Avenue?</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    At Gold Avenue, we're not just colleagues – we're a close-knit team of passionate professionals 
                    dedicated to revolutionizing precious metals investing. Our Swiss heritage of precision and 
                    excellence creates an environment where innovation thrives.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We offer more than just a job; we provide a platform for professional growth, meaningful impact, 
                    and the opportunity to work with cutting-edge financial technology while maintaining our 
                    commitment to traditional Swiss values.
                  </p>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gold">{value.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <benefit.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <Badge variant="outline">{position.level}</Badge>
                      </div>
                      <CardDescription className="mb-3">{position.description}</CardDescription>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="gold">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2">Key Requirements:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hiring Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Hiring Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Application</h3>
                <p className="text-sm text-muted-foreground">Submit your application and resume online</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Screening</h3>
                <p className="text-sm text-muted-foreground">Initial phone/video screening with HR</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Interviews</h3>
                <p className="text-sm text-muted-foreground">Technical and cultural fit interviews</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Offer</h3>
                <p className="text-sm text-muted-foreground">Reference checks and job offer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Diversity & Inclusion */}
        <Card className="mb-8 border-gold">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Diversity & Inclusion</h3>
              <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
                Gold Avenue is committed to creating an inclusive workplace where all employees can thrive. 
                We believe that diverse perspectives drive innovation and better serve our global client base. 
                We are an equal opportunity employer and welcome applications from all qualified candidates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application CTA */}
        <Card className="bg-gradient-to-r from-navy-deep to-navy-light text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Team?</h3>
            <p className="text-lg mb-6 opacity-90">
              Don't see the perfect role? We're always looking for exceptional talent. 
              Send us your resume and let's start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy-deep"
                onClick={() => navigate("/contact")}
              >
                General Application
              </Button>
              <Button variant="gold">
                View All Positions
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Careers;