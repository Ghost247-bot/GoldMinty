import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, Building, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LegalNotice = () => {
  const navigate = useNavigate();

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
          <Scale className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">Legal Notice</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Important legal information about Gold Avenue SA, our regulatory status, 
            and terms applicable to our services.
          </p>
        </div>

        {/* Company Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-6 h-6" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Legal Entity</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">Company Name:</span> Gold Avenue SA</p>
                  <p><span className="font-medium">Legal Form:</span> Swiss Corporation (Société Anonyme)</p>
                  <p><span className="font-medium">Registration Number:</span> CHE-123.456.789</p>
                  <p><span className="font-medium">VAT Number:</span> CHE-123.456.789 MWST</p>
                  <p><span className="font-medium">Date of Incorporation:</span> January 15, 1999</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Registered Address</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>Gold Avenue SA</p>
                  <p>Rue du Rhône 100</p>
                  <p>1204 Geneva</p>
                  <p>Switzerland</p>
                  <p><span className="font-medium">Phone:</span> +41 22 518 92 11</p>
                  <p><span className="font-medium">Email:</span> info@goldavenue.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Regulatory Information
            </CardTitle>
            <CardDescription>
              Gold Avenue SA operates under Swiss financial regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Regulatory Authority</h4>
                <p className="text-muted-foreground mb-2">
                  Gold Avenue SA is regulated by the Swiss Financial Market Supervisory Authority (FINMA)
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium">License Number:</span> FINMA-12345</p>
                  <p><span className="font-medium">License Type:</span> Securities Dealer License</p>
                  <p><span className="font-medium">Date Issued:</span> March 10, 2005</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Applicable Laws</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Swiss Federal Act on Financial Market Infrastructures and Market Conduct (FMIA)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Swiss Federal Act on Banks and Savings Banks (Banking Act)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Swiss Federal Act on Combating Money Laundering (AMLA)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Swiss Federal Act on Data Protection (FADP)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management and Ownership */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Management and Ownership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Board of Directors</h4>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-medium">Dr. Alexandra Müller</p>
                    <p className="text-sm">Chairman & Chief Executive Officer</p>
                  </div>
                  <div>
                    <p className="font-medium">Prof. Heinrich Weber</p>
                    <p className="text-sm">Independent Director</p>
                  </div>
                  <div>
                    <p className="font-medium">Marie Dubois</p>
                    <p className="text-sm">Independent Director</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Share Capital</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium">Authorized Share Capital:</span> CHF 10,000,000</p>
                  <p><span className="font-medium">Issued Share Capital:</span> CHF 5,000,000</p>
                  <p><span className="font-medium">Number of Shares:</span> 50,000 registered shares</p>
                  <p><span className="font-medium">Par Value:</span> CHF 100 per share</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Indemnity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Professional Indemnity Insurance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Gold Avenue SA maintains comprehensive professional indemnity insurance coverage 
                as required by Swiss financial regulations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Insurance Provider</h4>
                  <p className="text-muted-foreground">Zurich Insurance Company Ltd</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Coverage Amount</h4>
                  <p className="text-muted-foreground">CHF 50,000,000 per incident</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Policy Number</h4>
                  <p className="text-muted-foreground">ZUR-PI-2024-GA-001</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Validity Period</h4>
                  <p className="text-muted-foreground">January 1, 2024 - December 31, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investor Compensation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Investor Compensation Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gold Avenue SA participates in the Swiss Investor Compensation Scheme as required 
              by Article 37d of the Banking Act.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Scheme Operator</h4>
                <p className="text-muted-foreground">esisuisse (Einlagensicherung Schweiz)</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Maximum Compensation</h4>
                <p className="text-muted-foreground">CHF 100,000 per client</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-8 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-6 h-6" />
              Important Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Investment Risk</h4>
                <p>
                  Investments in precious metals carry risks, including the risk of loss of principal. 
                  Past performance does not guarantee future results. The value of precious metals 
                  can fluctuate significantly based on market conditions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">No Investment Advice</h4>
                <p>
                  The information provided on our platform is for informational purposes only and 
                  should not be construed as investment advice. We recommend consulting with 
                  qualified financial advisors before making investment decisions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Market Data</h4>
                <p>
                  Market prices and data are provided for informational purposes and may not 
                  reflect real-time market conditions. Trading decisions should not be based 
                  solely on this information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Legal Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For legal matters, regulatory inquiries, or formal notices, please contact:
            </p>
            <div className="space-y-2">
              <p><span className="font-medium">Legal Department:</span> legal@goldavenue.com</p>
              <p><span className="font-medium">Compliance Officer:</span> compliance@goldavenue.com</p>
              <p><span className="font-medium">Data Protection Officer:</span> privacy@goldavenue.com</p>
              <p><span className="font-medium">Postal Address:</span> Gold Avenue SA, Legal Department, Rue du Rhône 100, 1204 Geneva, Switzerland</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-muted">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              This legal notice is subject to Swiss law. Any disputes shall be resolved by the 
              competent courts of Geneva, Switzerland.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/terms-of-service")}>
                Terms of Service
              </Button>
              <Button variant="outline" onClick={() => navigate("/privacy-policy")}>
                Privacy Policy
              </Button>
              <Button variant="outline" onClick={() => navigate("/contact")}>
                Contact Legal Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default LegalNotice;