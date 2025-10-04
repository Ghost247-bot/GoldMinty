import { TrendingUp, Users, Vault, Shield, Award, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

const StatsSection = () => {
  const { t } = useLanguage();
  
  const stats: Stat[] = [
    {
      icon: <TrendingUp className="w-8 h-8 text-gold" />,
      value: "$550M+",
      label: t('stats.sales'),
      description: t('stats.salesDesc')
    },
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      value: "151K+",
      label: t('stats.customers'),
      description: t('stats.customersDesc')
    },
    {
      icon: <Vault className="w-8 h-8 text-gold" />,
      value: "$400M+",
      label: t('stats.storage'),
      description: t('stats.storageDesc')
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-gold" />,
      title: t('stats.feature1Title'),
      description: t('stats.feature1Desc')
    },
    {
      icon: <Award className="w-6 h-6 text-gold" />,
      title: t('stats.feature2Title'),
      description: t('stats.feature2Desc')
    },
    {
      icon: <Globe className="w-6 h-6 text-gold" />,
      title: t('stats.feature3Title'),
      description: t('stats.feature3Desc')
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            {t('stats.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('stats.subtitle')}
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