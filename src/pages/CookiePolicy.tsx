import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Cookie, Settings, Shield, BarChart3, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    preferences: true
  });

  const cookieTypes = [
    {
      id: "essential",
      title: "Essential Cookies",
      icon: Shield,
      description: "Required for basic site functionality and security",
      examples: [
        "User authentication and session management",
        "Security tokens and fraud prevention",
        "Shopping cart and transaction processing",
        "Cookie consent preferences"
      ],
      required: true,
      badge: "Required"
    },
    {
      id: "analytics",
      title: "Analytics Cookies", 
      icon: BarChart3,
      description: "Help us understand how visitors interact with our website",
      examples: [
        "Page views and user journey tracking",
        "Performance monitoring and error reporting",
        "Feature usage statistics",
        "A/B testing and optimization data"
      ],
      required: false,
      badge: "Optional"
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      icon: Palette,
      description: "Used to deliver relevant advertisements and marketing content",
      examples: [
        "Personalized product recommendations",
        "Retargeting advertisements",
        "Social media integration",
        "Email marketing optimization"
      ],
      required: false,
      badge: "Optional"
    },
    {
      id: "preferences",
      title: "Preference Cookies",
      icon: Settings,
      description: "Remember your settings and preferences for a better experience",
      examples: [
        "Language and currency preferences",
        "Theme and display settings",
        "Saved search filters",
        "Notification preferences"
      ],
      required: false,
      badge: "Recommended"
    }
  ];

  const handleCookieToggle = (cookieType: string, enabled: boolean) => {
    if (cookieType === "essential") return; // Cannot disable essential cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: enabled
    }));
  };

  const savePreferences = () => {
    // In a real app, this would save to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    toast({
      title: "All Cookies Accepted",
      description: "You've accepted all cookie categories for the best experience.",
    });
  };

  const rejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookiePreferences(essentialOnly);
    localStorage.setItem('cookiePreferences', JSON.stringify(essentialOnly));
    toast({
      title: "Optional Cookies Rejected",
      description: "Only essential cookies will be used.",
    });
  };

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
          <div className="flex items-center justify-center mb-4">
            <Cookie className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We use cookies to enhance your experience, provide security, and improve our services. 
            Learn about the different types of cookies we use and manage your preferences.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* What are Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What are Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-muted-foreground">
              <p className="mb-4">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                keeping you logged in, and helping us understand how you use our platform.
              </p>
              <p>
                We use both first-party cookies (set by Gold Avenue) and third-party cookies 
                (set by our partners and service providers) to deliver our services effectively and securely.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Your Cookie Preferences</CardTitle>
            <CardDescription>
              Choose which types of cookies you'd like to accept. You can change these settings at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cookieTypes.map((cookieType) => (
                <div key={cookieType.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <cookieType.icon className="w-6 h-6 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{cookieType.title}</h3>
                        <p className="text-sm text-muted-foreground">{cookieType.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={cookieType.required ? "default" : "outline"}
                        className={cookieType.required ? "bg-green-100 text-green-800" : ""}
                      >
                        {cookieType.badge}
                      </Badge>
                      <Switch
                        checked={cookiePreferences[cookieType.id as keyof typeof cookiePreferences]}
                        onCheckedChange={(checked) => handleCookieToggle(cookieType.id, checked)}
                        disabled={cookieType.required}
                      />
                    </div>
                  </div>
                  
                  <div className="ml-9">
                    <h4 className="font-medium text-sm mb-2">Examples:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {cookieType.examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button variant="gold" onClick={savePreferences} className="flex-1">
                Save Preferences
              </Button>
              <Button variant="outline" onClick={acceptAll} className="flex-1">
                Accept All
              </Button>
              <Button variant="outline" onClick={rejectOptional} className="flex-1">
                Reject Optional
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Third-party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-party Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Analytics Partners</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Google Analytics - Website usage statistics</li>
                  <li>• Hotjar - User behavior analysis</li>
                  <li>• Mixpanel - Product analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Service Providers</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Stripe - Payment processing</li>
                  <li>• Zendesk - Customer support</li>
                  <li>• SendGrid - Email delivery</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browser Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Browser Cookie Settings</CardTitle>
            <CardDescription>
              You can also manage cookies through your browser settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Chrome</h4>
                <p className="text-sm text-muted-foreground">Settings → Privacy → Cookies</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Firefox</h4>
                <p className="text-sm text-muted-foreground">Options → Privacy → Cookies</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Safari</h4>
                <p className="text-sm text-muted-foreground">Preferences → Privacy</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Edge</h4>
                <p className="text-sm text-muted-foreground">Settings → Privacy → Cookies</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Note: Disabling cookies in your browser may affect the functionality of our platform.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-3">Questions About Cookies?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                If you have any questions about our use of cookies or this Cookie Policy, 
                please don't hesitate to contact our privacy team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/privacy-policy")}>
                  Privacy Policy
                </Button>
                <Button variant="outline" onClick={() => navigate("/contact")}>
                  Contact Privacy Team
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

export default CookiePolicy;