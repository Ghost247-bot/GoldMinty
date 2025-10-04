import { Button } from "@/components/ui/button";
import { Play, Download, ShoppingCart, Heart, Star, ArrowRight } from "lucide-react";

const ButtonShowcase = () => {
  const variants = [
    { name: "default", label: "Default" },
    { name: "destructive", label: "Destructive" },
    { name: "outline", label: "Outline" },
    { name: "secondary", label: "Secondary" },
    { name: "ghost", label: "Ghost" },
    { name: "link", label: "Link" },
    { name: "gold", label: "Gold" },
    { name: "hero", label: "Hero" },
    { name: "premium", label: "Premium" },
  ] as const;

  const sizes = [
    { name: "sm", label: "Small" },
    { name: "default", label: "Default" },
    { name: "lg", label: "Large" },
    { name: "icon", label: "Icon" },
  ] as const;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Button Showcase</h1>
          <p className="text-muted-foreground">All available button variants and sizes in the design system</p>
        </div>

        {/* Button Variants */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <div key={variant.name} className="space-y-3">
                <h3 className="text-lg font-medium capitalize">{variant.label}</h3>
                <div className="p-6 border rounded-lg bg-card">
                  <Button variant={variant.name as any} className="w-full">
                    {variant.label} Button
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Button Sizes */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Button Sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {sizes.map((size) => (
              <div key={size.name} className="space-y-3">
                <h3 className="text-lg font-medium capitalize">{size.label}</h3>
                <div className="p-6 border rounded-lg bg-card flex justify-center">
                  {size.name === "icon" ? (
                    <Button variant="default" size={size.name as any}>
                      <Star />
                    </Button>
                  ) : (
                    <Button variant="default" size={size.name as any}>
                      {size.label}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons with Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons with Icons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg bg-card space-y-4">
              <h3 className="text-lg font-medium">Leading Icons</h3>
              <div className="space-y-2">
                <Button variant="default" className="w-full">
                  <Play />
                  Play Video
                </Button>
                <Button variant="gold" className="w-full">
                  <Download />
                  Download
                </Button>
                <Button variant="premium" className="w-full">
                  <ShoppingCart />
                  Add to Cart
                </Button>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card space-y-4">
              <h3 className="text-lg font-medium">Trailing Icons</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Continue
                  <ArrowRight />
                </Button>
                <Button variant="secondary" className="w-full">
                  Add to Wishlist
                  <Heart />
                </Button>
                <Button variant="hero" className="w-full">
                  Shop Now
                  <ArrowRight />
                </Button>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card space-y-4">
              <h3 className="text-lg font-medium">Icon Only</h3>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button variant="default" size="icon">
                  <Play />
                </Button>
                <Button variant="gold" size="icon">
                  <Star />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Special Combinations */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Special Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-card space-y-4">
              <h3 className="text-lg font-medium">Gold Mint Styles</h3>
              <div className="space-y-3">
                <Button variant="gold" size="lg" className="w-full">
                  Invest in Gold
                </Button>
                <Button variant="premium" size="lg" className="w-full">
                  Premium Storage
                </Button>
                <Button variant="hero" size="lg" className="w-full">
                  Start Trading
                </Button>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-card space-y-4">
              <h3 className="text-lg font-medium">Disabled States</h3>
              <div className="space-y-3">
                <Button variant="default" disabled className="w-full">
                  Disabled Default
                </Button>
                <Button variant="gold" disabled className="w-full">
                  Disabled Gold
                </Button>
                <Button variant="premium" disabled className="w-full">
                  Disabled Premium
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Background Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">On Dark Background</h2>
          <div className="bg-navy-deep p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="hero">Hero Button</Button>
              <Button variant="gold">Gold Button</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Outline on Dark
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ButtonShowcase;