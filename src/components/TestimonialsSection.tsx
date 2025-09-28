import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Martinez",
      role: "Investment Advisor",
      content: "Gold Avenue has been my go-to platform for precious metals. Their selection is outstanding and the service is impeccable. I've recommended them to all my clients.",
      rating: 5,
      image: "/api/placeholder/80/80"
    },
    {
      name: "Michael Chen",
      role: "Portfolio Manager",
      content: "The transparency in pricing and the quality of metals is exceptional. I've been investing through Gold Avenue for over 3 years and couldn't be happier.",
      rating: 5,
      image: "/api/placeholder/80/80"
    },
    {
      name: "Elena Rodriguez",
      role: "Private Investor",
      content: "Fast delivery, secure packaging, and competitive prices. Gold Avenue makes precious metal investing accessible and trustworthy.",
      rating: 5,
      image: "/api/placeholder/80/80"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary mb-4">
            What Our <span className="text-gold">Investors</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-card hover:shadow-luxury transition-all duration-500 animate-scale-in hover-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-gold/60" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-full blur-2xl group-hover:from-gold/10 transition-all duration-500"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-card/50 rounded-full border border-border/50">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-gold text-gold" />
              <span className="font-semibold text-primary">4.9/5</span>
              <span className="text-sm text-muted-foreground">Customer Rating</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">10,000+</span> Reviews
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">A+</span> BBB Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;