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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Customer Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their experience with Gold Avenue.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="font-semibold text-primary">4.9/5</span>
              <span className="text-sm text-muted-foreground">Rating</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">10,000+</span> Reviews
            </div>
            <div className="w-px h-4 bg-border"></div>
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