import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, 
  Award, 
  Users, 
  Globe, 
  CheckCircle,
  Building,
  Target,
  Heart
} from "lucide-react";

const About = () => {
  const { t } = useLanguage();
  
  const stats = [
    { label: t('about.years'), value: "25+", icon: Award },
    { label: t('about.customers'), value: "50K+", icon: Users },
    { label: t('about.countries'), value: "40+", icon: Globe },
    { label: t('about.aum'), value: "$2.5B+", icon: Building }
  ];

  const values = [
    {
      title: t('about.value1'),
      description: t('about.value1Desc'),
      icon: Shield
    },
    {
      title: t('about.value2'),
      description: t('about.value2Desc'),
      icon: Heart
    },
    {
      title: t('about.value3'),
      description: t('about.value3Desc'),
      icon: Award
    },
    {
      title: t('about.value4'),
      description: t('about.value4Desc'),
      icon: Target
    }
  ];

  const milestones = [
    { year: "1999", event: "Gold Mint founded in Geneva, Switzerland" },
    { year: "2005", event: "Launched secure vault storage services" },
    { year: "2010", event: "Expanded to serve international clients" },
    { year: "2015", event: "Digital platform launch for online trading" },
    { year: "2020", event: "Reached $1B in assets under management" },
    { year: "2024", event: "Launched next-generation investment platform" }
  ];

  const certifications = [
    "Swiss Financial Market Supervisory Authority (FINMA) Regulated",
    "ISO 27001 Certified Security Management",
    "LBMA (London Bullion Market Association) Member",
    "DMCC (Dubai Multi Commodities Centre) Approved"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-6">{t('about.title')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            {t('about.subtitle')}
          </p>
          <Button variant="gold" size="lg" className="w-full sm:w-auto">
            {t('about.cta')}
          </Button>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gold mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1999 in the heart of Geneva, Switzerland, Gold Mint was born from a 
                  simple vision: to make precious metals investment accessible, secure, and transparent 
                  for investors around the world.
                </p>
                <p>
                  What started as a small precious metals dealer has grown into one of Europe's 
                  leading precious metals investment platforms, serving over 50,000 customers 
                  across 40 countries.
                </p>
                <p>
                  Our commitment to Swiss-level security, transparent pricing, and exceptional 
                  customer service has earned us the trust of individual investors, families, 
                  and institutions seeking to preserve and grow their wealth through precious metals.
                </p>
              </div>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Building className="w-16 h-16 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <value.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 md:space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-base md:text-lg px-3 md:px-4 py-1 md:py-2">
                      {milestone.year}
                    </Badge>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <p className="text-muted-foreground text-sm md:text-base">{milestone.event}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Trust & Compliance</h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Regulatory Compliance & Certifications</CardTitle>
              <CardDescription className="text-center">
                We maintain the highest standards of regulatory compliance and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-navy-deep to-navy-light text-white">
            <CardContent className="p-6 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Investing?</h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                Join thousands of investors who trust Gold Mint with their precious metals portfolio
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  Open Account
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy-deep w-full sm:w-auto">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
    </div>
  );
};

export default About;