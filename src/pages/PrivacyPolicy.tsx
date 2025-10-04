import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
      content: [
        "Personal identification information (name, email address, phone number, address)",
        "Financial information necessary for transactions and compliance",
        "Government-issued identification for KYC (Know Your Customer) requirements",
        "Device information and usage data when you use our platform",
        "Communication records when you contact our support team"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: FileText,
      content: [
        "Process transactions and manage your precious metals investments",
        "Verify your identity and comply with regulatory requirements",
        "Provide customer support and respond to your inquiries",
        "Send important account notifications and security alerts",
        "Improve our services and develop new features",
        "Conduct fraud prevention and security monitoring"
      ]
    },
    {
      title: "Information Sharing",
      icon: Shield,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Information may be shared with regulatory authorities as required by law",
        "Trusted service providers who assist in operating our platform (under strict confidentiality)",
        "Legal authorities when required by court order or legal process",
        "In case of business merger or acquisition (with prior notice to users)"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "Swiss bank-level encryption for all data transmission and storage",
        "Multi-factor authentication and advanced access controls",
        "Regular security audits and penetration testing",
        "Segregated storage systems with redundant backups",
        "24/7 security monitoring and incident response team",
        "ISO 27001 certified security management practices"
      ]
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
          <h1 className="text-4xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy and data security are fundamental to our service. Learn how we collect, 
            use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Gold Mint SA ("we," "our," or "us") is committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our precious metals investment platform 
                and related services.
              </p>
              <p className="mt-4 text-muted-foreground">
                As a Swiss-regulated financial services provider, we adhere to the highest standards of data 
                protection, including compliance with the Swiss Federal Act on Data Protection (FADP) and the 
                European General Data Protection Regulation (GDPR) where applicable.
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

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
              <CardDescription>
                You have the following rights regarding your personal data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Access and review your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Request correction of inaccurate data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Request deletion of your data (subject to regulatory requirements)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Object to processing for marketing purposes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">Data portability (receive your data in a structured format)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies & Tracking</CardTitle>
              <CardDescription>
                How we use cookies and similar technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Required for platform functionality, security, and user authentication
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how users interact with our platform (with your consent)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Preference Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Remember your settings and preferences for a better experience
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/cookie-policy")}>
                  View Cookie Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Questions about this Privacy Policy or your personal data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Data Protection Officer</h4>
                <p className="text-sm text-muted-foreground mb-1">privacy@goldmint.com</p>
                <p className="text-sm text-muted-foreground">+41 22 518 92 11</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mailing Address</h4>
                <p className="text-sm text-muted-foreground">
                  Gold Mint SA<br />
                  Attention: Privacy Officer<br />
                  Rue du Rhône 100<br />
                  1204 Geneva, Switzerland
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Notice */}
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                This Privacy Policy may be updated from time to time. We will notify you of any material 
                changes via email or through our platform. Your continued use of our services constitutes 
                acceptance of the updated policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/terms-of-service")}>
                  View Terms of Service
                </Button>
                <Button variant="outline" onClick={() => navigate("/contact")}>
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default PrivacyPolicy;