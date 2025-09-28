import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Account Terms",
      icon: FileText,
      content: [
        "You must be at least 18 years old to create an account and use our services",
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You agree to provide accurate and complete information during registration",
        "Each user may maintain only one active account unless specifically authorized",
        "Account termination may occur for violation of these terms or applicable laws"
      ]
    },
    {
      title: "Investment Services", 
      icon: Shield,
      content: [
        "Gold Avenue provides precious metals trading and storage services",
        "All investments carry inherent risks, including potential loss of principal",
        "We do not provide investment advice; all decisions are your responsibility",
        "Minimum investment amounts and transaction fees apply as published",
        "Product availability and pricing are subject to market conditions"
      ]
    },
    {
      title: "Storage & Custody",
      icon: Scale,
      content: [
        "Precious metals are stored in certified secure vaults in Switzerland",
        "Storage fees apply as outlined in our current fee schedule",
        "You retain full ownership of your stored precious metals",
        "Insurance coverage protects against theft, loss, and damage",
        "Delivery and withdrawal services available subject to verification procedures"
      ]
    },
    {
      title: "Compliance & Regulations",
      icon: AlertTriangle,
      content: [
        "All services are provided under Swiss financial regulations (FINMA)",
        "Anti-money laundering (AML) and Know Your Customer (KYC) procedures apply",
        "Transactions may be monitored and reported as required by law",
        "Tax reporting is your responsibility in your jurisdiction of residence",
        "We may refuse transactions that do not meet compliance requirements"
      ]
    }
  ];

  const restrictions = [
    "Use our services for any illegal or unauthorized purpose",
    "Attempt to circumvent security measures or access unauthorized areas",
    "Provide false or misleading information during registration or transactions",
    "Transfer your account to another person without our written consent",
    "Engage in activities that could harm our platform or other users",
    "Use automated systems to access our services without permission"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
          <h1 className="text-4xl font-bold text-primary mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These terms govern your use of Gold Avenue's precious metals investment platform and services.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline">Last updated: December 2024</Badge>
            <Badge variant="outline">Version 3.2</Badge>
          </div>
        </div>

        {/* Acceptance Notice */}
        <Card className="mb-8 border-gold">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Important Notice</h3>
                <p className="text-muted-foreground">
                  By accessing or using Gold Avenue's services, you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any part of these terms, 
                  you must not use our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Welcome to Gold Avenue SA, a Swiss-regulated precious metals investment platform. These Terms of 
                Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") 
                and Gold Avenue SA ("Company," "we," "our," or "us").
              </p>
              <p className="mt-4 text-muted-foreground">
                Our services are regulated by the Swiss Financial Market Supervisory Authority (FINMA) and operate 
                under Swiss law. These Terms, along with our Privacy Policy and other applicable agreements, 
                govern your access to and use of our precious metals investment and storage services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <section.icon className="w-6 h-6 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Prohibited Uses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Prohibited Uses
            </CardTitle>
            <CardDescription>
              You agree not to engage in any of the following prohibited activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{restriction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Additional Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Fees & Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Transaction Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Fees apply to purchases, sales, and transfers as outlined in our current fee schedule
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Storage Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Annual storage fees are charged monthly based on the value of stored metals
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Methods</h4>
                  <p className="text-sm text-muted-foreground">
                    Bank transfers, credit cards, and other approved payment methods accepted
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/prices")}>
                  View Fee Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liability & Disclaimers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Investment Risk</h4>
                  <p className="text-sm text-muted-foreground">
                    Precious metals investments carry risk of loss; past performance does not guarantee future results
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Service Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    Services provided "as is" with no guarantee of uninterrupted availability
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Limitation of Liability</h4>
                  <p className="text-sm text-muted-foreground">
                    Our liability is limited as permitted by applicable Swiss law
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law & Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Applicable Law</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These Terms are governed by Swiss law, without regard to conflict of law provisions.
                </p>
                <p className="text-sm text-muted-foreground">
                  The courts of Geneva, Switzerland have exclusive jurisdiction over any disputes.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-3">Dispute Resolution</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  We encourage resolution of disputes through direct communication with our support team.
                </p>
                <p className="text-sm text-muted-foreground">
                  Arbitration may be available for certain types of disputes as permitted by law.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Updates */}
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-3">Questions or Updates</h3>
              <p className="text-sm text-muted-foreground mb-6">
                These Terms may be updated from time to time. Continued use of our services constitutes 
                acceptance of any changes. For questions about these Terms, please contact our legal department.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/privacy-policy")}>
                  Privacy Policy
                </Button>
                <Button variant="outline" onClick={() => navigate("/contact")}>
                  Contact Legal Team
                </Button>
                <Button variant="gold" onClick={() => navigate("/contact")}>
                  Get Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;