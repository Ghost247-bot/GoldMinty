import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Shield, Clock, CheckCircle, AlertCircle, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Returns = () => {
  const navigate = useNavigate();

  const returnProcess = [
    {
      step: 1,
      title: "Contact Support",
      description: "Reach out to our team within 14 days of delivery",
      timeframe: "Within 14 days",
      icon: AlertCircle
    },
    {
      step: 2,
      title: "Return Authorization", 
      description: "Receive return authorization and shipping instructions",
      timeframe: "24-48 hours",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Package Return",
      description: "Securely package and ship items using provided label",
      timeframe: "Your convenience",
      icon: Package
    },
    {
      step: 4,
      title: "Inspection",
      description: "Items inspected upon arrival at our facility", 
      timeframe: "2-3 business days",
      icon: Shield
    },
    {
      step: 5,
      title: "Refund Processing",
      description: "Approved returns processed to original payment method",
      timeframe: "3-5 business days",
      icon: RefreshCw
    }
  ];

  const returnReasons = [
    {
      reason: "Damaged in Transit",
      eligible: true,
      timeframe: "14 days",
      refundType: "Full refund + shipping costs",
      description: "Items damaged during delivery"
    },
    {
      reason: "Wrong Item Received",
      eligible: true, 
      timeframe: "14 days",
      refundType: "Full refund + shipping costs",
      description: "Incorrect product shipped"
    },
    {
      reason: "Defective Product",
      eligible: true,
      timeframe: "30 days", 
      refundType: "Full refund + shipping costs",
      description: "Manufacturing defects or quality issues"
    },
    {
      reason: "Change of Mind",
      eligible: true,
      timeframe: "7 days",
      refundType: "Refund minus shipping costs",
      description: "Customer decides to return (conditions apply)"
    },
    {
      reason: "Investment Strategy Change",
      eligible: true,
      timeframe: "7 days",
      refundType: "Refund minus fees",
      description: "Portfolio rebalancing needs"
    }
  ];

  const returnConditions = [
    "Items must be in original condition and packaging",
    "All certificates and documentation must be included",
    "Custom or personalized items cannot be returned",
    "Items showing signs of wear or damage may be subject to restocking fees",
    "Precious metals must be verified authentic upon return",
    "Returns must be initiated within specified timeframes"
  ];

  const nonReturnableItems = [
    "Damaged items due to misuse or normal wear",
    "Items without original packaging or certificates", 
    "Custom engraved or personalized products",
    "Items held in vault storage (different process applies)",
    "Digital products and gift certificates"
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
          <RefreshCw className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">Returns & Refunds</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We stand behind the quality of our precious metals. Learn about our return policy, 
            process, and how to initiate a return if needed.
          </p>
        </div>

        {/* Return Policy Overview */}
        <Card className="mb-12 border-green-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Shield className="w-12 h-12 text-green-600 flex-shrink-0 mt-2" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Return Guarantee</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">14-Day Return Window</h4>
                    <p className="text-sm text-muted-foreground">
                      Most items can be returned within 14 days of delivery for any reason
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">Quality Guarantee</h4>
                    <p className="text-sm text-muted-foreground">
                      30-day guarantee against manufacturing defects and quality issues
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">Hassle-Free Process</h4>
                    <p className="text-sm text-muted-foreground">
                      Simple return process with pre-paid shipping labels provided
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Return Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {returnProcess.map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                      <Badge variant="outline">{step.timeframe}</Badge>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Return Eligibility */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Return Eligibility</h2>
          <Card>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Reason</th>
                      <th className="text-left py-3 font-semibold">Eligible</th>
                      <th className="text-left py-3 font-semibold">Time Limit</th>
                      <th className="text-left py-3 font-semibold">Refund Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnReasons.map((reason, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{reason.reason}</p>
                            <p className="text-sm text-muted-foreground">{reason.description}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={reason.eligible ? "default" : "destructive"}>
                            {reason.eligible ? "Yes" : "No"}
                          </Badge>
                        </td>
                        <td className="py-4 text-muted-foreground">{reason.timeframe}</td>
                        <td className="py-4 text-muted-foreground text-sm">{reason.refundType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Return Conditions */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-6 h-6" />
                  Return Conditions
                </CardTitle>
                <CardDescription>
                  Requirements for eligible returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {returnConditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-6 h-6" />
                  Non-Returnable Items
                </CardTitle>
                <CardDescription>
                  Items that cannot be returned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Refund Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Refund Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-primary mb-3" />
                <CardTitle>Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Standard Returns</p>
                    <p className="text-sm text-muted-foreground">3-5 business days after inspection</p>
                  </div>
                  <div>
                    <p className="font-medium">Defective Items</p>
                    <p className="text-sm text-muted-foreground">1-2 business days priority processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <RefreshCw className="w-8 h-8 text-primary mb-3" />
                <CardTitle>Refund Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Original Payment Method</p>
                    <p className="text-sm text-muted-foreground">Credit card, bank transfer, etc.</p>
                  </div>
                  <div>
                    <p className="font-medium">Account Credit</p>
                    <p className="text-sm text-muted-foreground">For future purchases (faster processing)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-3" />
                <CardTitle>Fees & Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Our Error</p>
                    <p className="text-sm text-muted-foreground">Full refund + all shipping costs</p>
                  </div>
                  <div>
                    <p className="font-medium">Change of Mind</p>
                    <p className="text-sm text-muted-foreground">Refund minus original shipping</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vault Storage Returns */}
        <Card className="mb-16 border-gold">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Package className="w-12 h-12 text-gold flex-shrink-0 mt-2" />
              <div>
                <h3 className="text-2xl font-bold mb-4">Vault Storage Returns</h3>
                <p className="text-muted-foreground mb-4">
                  Items stored in our secure vault facilities follow a different return process:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                    Sell-back available at current market prices minus our spread
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                    Physical delivery can be arranged to any eligible address
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                    Transfer to another Gold Mint customer available
                  </li>
                </ul>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/contact")}>
                  Contact Vault Services
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Return Process */}
        <Card className="bg-gradient-to-r from-navy-deep to-navy-light text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need to Return an Item?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our support team will guide you through the return process step by step
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy-deep"
                onClick={() => navigate("/contact")}
              >
                Start Return Process
              </Button>
              <Button 
                variant="gold"
                onClick={() => navigate("/help-center")}
              >
                View FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Returns;