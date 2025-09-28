import { TrendingUp, Users, Vault, Shield, Award, Globe } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

const StatsSection = () => {
  const stats: Stat[] = [
    {
      icon: <TrendingUp className="w-8 h-8 text-gold" />,
      value: "$550M+",
      label: "Total Sales Volume",
      description: "Trusted by investors worldwide"
    },
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      value: "151K+",
      label: "Active Customers",
      description: "Growing community of precious metal investors"
    },
    {
      icon: <Vault className="w-8 h-8 text-gold" />,
      value: "$400M+",
      label: "Secure Storage",
      description: "Safely stored precious metals"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-gold" />,
      title: "Secure Storage",
      description: "Swiss-grade security for your investments"
    },
    {
      icon: <Award className="w-6 h-6 text-gold" />,
      title: "Certified Metals",
      description: "All products from accredited mints"
    },
    {
      icon: <Globe className="w-6 h-6 text-gold" />,
      title: "Global Delivery",
      description: "Worldwide shipping & insurance included"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Why Choose Gold Avenue
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by investors worldwide for our commitment to quality, security, and exceptional service
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 animate-fade-in hover-scale" style={{animationDelay: `${200 + index * 200}ms`}}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gold/10">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-primary">
                  {stat.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-card rounded-lg border animate-fade-in hover-scale transition-all duration-300" style={{animationDelay: `${800 + index * 200}ms`}}>
              <div className="flex-shrink-0 p-2 rounded-lg bg-gold/10">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;