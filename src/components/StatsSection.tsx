import { TrendingUp, Users, Vault } from "lucide-react";

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
      value: "$550 million",
      label: "in sales",
      description: "👉"
    },
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      value: "151K",
      label: "users",
      description: "👉"
    },
    {
      icon: <Vault className="w-8 h-8 text-gold" />,
      value: "$400 million",
      label: "in storage",
      description: "👉"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-background to-muted py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="flex justify-center">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <span className="text-lg">{stat.description}</span>
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;