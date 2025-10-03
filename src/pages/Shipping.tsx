import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, Shield, Clock, MapPin, Package, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const navigate = useNavigate();

  const shippingOptions = [
    {
      name: "Standard Delivery",
      timeframe: "5-7 business days",
      cost: "Free over $500",
      insurance: "Up to $25,000",
      tracking: "Full tracking",
      description: "Secure delivery via registered mail with full insurance coverage"
    },
    {
      name: "Express Delivery", 
      timeframe: "2-3 business days",
      cost: "$45",
      insurance: "Up to $50,000",
      tracking: "Real-time tracking",
      description: "Fast delivery via premium courier service with signature required"
    },
    {
      name: "Vault Storage",
      timeframe: "Immediate",
      cost: "0.5% annually",
      insurance: "Full coverage",
      tracking: "Digital certificate",
      description: "Keep your metals in our secure Swiss vault - no shipping required"
    }
  ];

  const deliveryZones = [
    {
      zone: "Switzerland",
      timeframe: "1-2 business days", 
      cost: "Free over CHF 500",
      methods: ["Swiss Post Priority", "Securitas Transport"]
    },
    {
      zone: "European Union",
      timeframe: "3-5 business days",
      cost: "Free over €500", 
      methods: ["DHL Express", "UPS Secure"]
    },
    {
      zone: "United Kingdom",
      timeframe: "4-6 business days",
      cost: "Free over £500",
      methods: ["Royal Mail Special Delivery", "DHL"]
    },
    {
      zone: "North America",
      timeframe: "7-10 business days",
      cost: "Free over $1,000",
      methods: ["FedEx International", "UPS Worldwide"]
    },
    {
      zone: "Rest of World",
      timeframe: "10-15 business days",
      cost: "Contact for quote",
      methods: ["DHL Express Worldwide", "FedEx International Priority"]
    }
  ];

  const securityFeatures = [
    {
      title: "Discreet Packaging",
      description: "No external markings indicating precious metals content",
      icon: Package
    },
    {
      title: "Full Insurance",
      description: "100% insurance coverage from vault to your door",
      icon: Shield
    },
    {
      title: "Signature Required",
      description: "Delivery only to verified recipient with photo ID",
      icon: CheckCircle
    },
    {
      title: "Real-time Tracking",
      description: "Monitor your shipment every step of the way",
      icon: MapPin
    }
  ];

  const deliveryProcess = [
    {
      step: 1,
      title: "Order Confirmation",
      description: "Your order is verified and prepared for shipment within 24 hours"
    },
    {
      step: 2, 
      title: "Secure Packaging",
      description: "Items are professionally packaged in tamper-evident containers"
    },
    {
      step: 3,
      title: "Carrier Pickup",
      description: "Authorized courier collects your package from our secure facility"
    },
    {
      step: 4,
      title: "In Transit",
      description: "Track your shipment in real-time as it travels to your address"
    },
    {
      step: 5,
      title: "Delivery",
      description: "Signature required delivery to your verified address"
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
          <Truck className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">Shipping & Delivery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Secure, insured delivery of your precious metals worldwide. Learn about our shipping options, 
            timeframes, and security measures.
          </p>
        </div>

        {/* Shipping Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-xl">{option.name}</CardTitle>
                    <Badge variant="outline">{option.timeframe}</Badge>
                  </div>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cost:</span>
                      <span className="text-sm text-muted-foreground">{option.cost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Insurance:</span>
                      <span className="text-sm text-muted-foreground">{option.insurance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tracking:</span>
                      <span className="text-sm text-muted-foreground">{option.tracking}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Delivery Zones */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Zones & Timeframes</h2>
          <Card>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Region</th>
                      <th className="text-left py-3 font-semibold">Delivery Time</th>
                      <th className="text-left py-3 font-semibold">Free Shipping</th>
                      <th className="text-left py-3 font-semibold">Carriers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-4 font-medium">{zone.zone}</td>
                        <td className="py-4 text-muted-foreground">{zone.timeframe}</td>
                        <td className="py-4 text-muted-foreground">{zone.cost}</td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {zone.methods.map((method, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Security Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Security & Protection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Delivery Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How Delivery Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {deliveryProcess.map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Delivery Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Orders placed before 2 PM CET are processed the same day
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Delivery times exclude weekends and public holidays
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Remote areas may require additional delivery time
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Customs clearance may add 1-3 days for international orders
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Insurance & Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Full replacement value insurance on all shipments
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Claims must be reported within 48 hours of delivery
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Damaged packaging should be photographed before opening
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    Our team will handle all insurance claims on your behalf
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Can I change my delivery address after ordering?</h4>
                <p className="text-sm text-muted-foreground">
                  Address changes are possible before shipping confirmation. Contact our support team 
                  immediately if you need to change your delivery address.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What if I'm not home for delivery?</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple delivery attempts will be made. If unsuccessful, the package will be held 
                  at the local carrier facility for collection with photo ID.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Do you ship to P.O. boxes?</h4>
                <p className="text-sm text-muted-foreground">
                  For security reasons, we only deliver to verified physical addresses. P.O. boxes 
                  and mail forwarding services are not accepted.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-navy-deep to-navy-light text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Shipping?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our logistics team is here to help with any shipping or delivery questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy-deep"
                onClick={() => navigate("/contact")}
              >
                Contact Support
              </Button>
              <Button 
                variant="gold"
                onClick={() => navigate("/help-center")}
              >
                Visit Help Center
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Shipping;