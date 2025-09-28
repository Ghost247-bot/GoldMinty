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
    <section className="relative py-20 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-border/10 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary mb-4">
            Trusted by <span className="text-gold">151,000+</span> Investors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a growing community of precious metal investors who trust us with their wealth preservation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group text-center space-y-6 p-8 rounded-2xl bg-gradient-to-b from-card/50 to-background border border-border/50 hover:shadow-luxury transition-all duration-500 animate-scale-in hover-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-gold/10 to-gold/5 group-hover:from-gold/20 group-hover:to-gold/10 transition-all duration-300">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-primary">
                  {stat.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-6 rounded-xl bg-card/30 border border-border/30 hover:bg-card/50 transition-all duration-300 animate-fade-in hover-scale"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-gold/10">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">{feature.title}</h3>
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