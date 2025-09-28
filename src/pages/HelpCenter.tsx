import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  BookOpen,
  Shield,
  CreditCard,
  Truck,
  Users,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      count: 8
    },
    {
      id: "account",
      title: "Account & Security", 
      icon: Shield,
      count: 12
    },
    {
      id: "trading",
      title: "Trading & Investments",
      icon: CreditCard,
      count: 15
    },
    {
      id: "storage", 
      title: "Storage & Delivery",
      icon: Truck,
      count: 10
    }
  ];

  const popularFaqs = [
    {
      question: "How do I create an account with Gold Avenue?",
      answer: "Creating an account is simple. Click 'Sign Up' on our homepage, provide your email and basic information, verify your email address, and complete the KYC (Know Your Customer) process by uploading required identification documents. The entire process typically takes 5-10 minutes.",
      category: "getting-started"
    },
    {
      question: "What are the storage fees for precious metals?",
      answer: "Storage fees are calculated annually at 0.5% of the total value of stored precious metals, charged monthly. For example, if you store $10,000 worth of gold, the annual fee is $50, or approximately $4.17 per month. There are no minimum storage fees for the first year.",
      category: "storage"
    },
    {
      question: "How quickly can I buy precious metals?",
      answer: "Once your account is verified and funded, you can purchase precious metals instantly during market hours. Prices are updated in real-time, and your purchase is confirmed immediately. Physical delivery typically takes 5-7 business days within Europe.",
      category: "trading"
    },
    {
      question: "Is my investment secure?",
      answer: "Yes, your investments are highly secure. Precious metals are stored in certified Swiss vaults with full insurance coverage. Your metals are segregated and allocated specifically to you. Gold Avenue is regulated by FINMA and follows Swiss banking security standards.",
      category: "account"
    },
    {
      question: "Can I sell my metals back to Gold Avenue?",
      answer: "Absolutely. Gold Avenue offers instant buyback on all products we sell. You can sell your metals at any time during market hours at competitive market prices. Funds are typically available in your account within 24 hours of the sale.",
      category: "trading"
    },
    {
      question: "What identification do I need to open an account?",
      answer: "You'll need a government-issued photo ID (passport or national ID card), proof of address (utility bill or bank statement dated within 3 months), and may need additional documents based on your investment amount and residency status.",
      category: "account"
    }
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "24/7",
      action: "Start Chat"
    },
    {
      title: "Phone Support",
      description: "Speak directly with a precious metals specialist",
      icon: Phone,
      availability: "Mon-Fri 8AM-6PM CET",
      action: "Call Now"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      availability: "Response within 4 hours",
      action: "Send Email"
    },
    {
      title: "Account Manager",
      description: "Dedicated support for premium clients",
      icon: Users,
      availability: "By appointment",
      action: "Schedule Call"
    }
  ];

  const filteredFaqs = searchQuery 
    ? popularFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularFaqs;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <HelpCircle className="w-12 md:w-16 h-12 md:h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">Help Center</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Find answers to common questions, get support, and learn more about precious metals investing
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 text-lg h-14"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <option.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {option.availability}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                    if (option.title === "Live Chat") {
                      // In a real app, this would open a chat widget
                      window.open("https://tawk.to/chat", "_blank");
                    } else if (option.title === "Phone Support") {
                      window.open("tel:+41225189211", "_self");
                    } else if (option.title === "Email Support") {
                      window.open("mailto:support@goldavenue.com", "_self");
                    } else {
                      navigate("/contact");
                    }
                  }}>
                    {option.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {faqCategories.map((category) => (
              <Card 
                key={category.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  // In a real app, this would filter FAQs by category
                  setSearchQuery(category.title.toLowerCase());
                }}
              >
                <CardHeader className="text-center">
                  <category.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge variant="outline">{category.count} articles</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">
            {searchQuery ? `Search Results (${filteredFaqs.length})` : 'Frequently Asked Questions'}
          </h2>
          
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="ml-8 pb-4">
                      <div className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No results found for "{searchQuery}"</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Additional Resources */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-3" />
                <CardTitle>Investment Guides</CardTitle>
                <CardDescription>
                  Comprehensive guides to precious metals investing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/resources")}
                >
                  View Guides
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="w-8 h-8 text-primary mb-3" />
                <CardTitle>Fee Schedule</CardTitle>
                <CardDescription>
                  Transparent pricing for all our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/prices")}
                >
                  View Pricing
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-3" />
                <CardTitle>Security Center</CardTitle>
                <CardDescription>
                  Learn about our security measures and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <Card className="mt-12 bg-gradient-to-r from-navy-deep to-navy-light text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our expert team is here to assist you with any questions about precious metals investing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy-deep"
                onClick={() => navigate("/contact")}
              >
                Contact Support
              </Button>
              <Button variant="gold">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;