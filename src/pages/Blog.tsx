import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Calendar, User, Clock, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Blog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts", count: 24 },
    { id: "market-analysis", name: "Market Analysis", count: 8 },
    { id: "investment-guides", name: "Investment Guides", count: 6 },
    { id: "industry-news", name: "Industry News", count: 5 },
    { id: "company-updates", name: "Company Updates", count: 3 },
    { id: "educational", name: "Educational", count: 2 }
  ];

  const featuredPost = {
    title: "2025 Precious Metals Outlook: Navigating Uncertainty with Strategic Investments",
    excerpt: "As we enter 2025, global economic uncertainties continue to drive investors toward precious metals as a hedge against inflation and market volatility. Our comprehensive analysis explores key trends and opportunities.",
    author: "Sarah Chen",
    authorRole: "Head of Market Research",
    date: "December 20, 2024",
    readTime: "8 min read",
    category: "Market Analysis",
    image: "/api/placeholder/600/300"
  };

  const blogPosts = [
    {
      title: "Understanding Storage Premiums: What Every Precious Metals Investor Should Know",
      excerpt: "Storage costs can significantly impact your investment returns. Learn how to evaluate and optimize your precious metals storage strategy.",
      author: "Michael Rodriguez",
      date: "December 18, 2024",
      readTime: "5 min read",
      category: "Investment Guides",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Central Bank Gold Purchases Reach Record Highs in Q4 2024",
      excerpt: "Global central banks continue accumulating gold reserves at unprecedented levels, signaling confidence in precious metals as monetary assets.",
      author: "Emma Thompson", 
      date: "December 15, 2024",
      readTime: "6 min read",
      category: "Industry News",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Silver's Industrial Demand: The Green Energy Revolution Impact",
      excerpt: "Solar panels, electric vehicles, and green technology are driving unprecedented industrial demand for silver. What does this mean for investors?",
      author: "Dr. James Wilson",
      date: "December 12, 2024", 
      readTime: "7 min read",
      category: "Market Analysis",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Tax-Efficient Precious Metals Investing: A Complete Guide",
      excerpt: "Maximize your returns by understanding the tax implications of different precious metals investment strategies and structures.",
      author: "Lisa Zhang",
      date: "December 10, 2024",
      readTime: "10 min read",
      category: "Investment Guides", 
      image: "/api/placeholder/400/200"
    },
    {
      title: "Gold Mint Launches New Mobile App with Advanced Portfolio Tracking",
      excerpt: "Our latest mobile application brings professional-grade portfolio management tools to your fingertips, making precious metals investing more accessible than ever.",
      author: "Gold Mint Team",
      date: "December 8, 2024",
      readTime: "3 min read",
      category: "Company Updates",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Precious Metals vs. Traditional Assets: A 10-Year Performance Review",
      excerpt: "Comprehensive analysis comparing precious metals performance against stocks, bonds, and real estate over the past decade.",
      author: "Sarah Chen",
      date: "December 5, 2024",
      readTime: "9 min read", 
      category: "Market Analysis",
      image: "/api/placeholder/400/200"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category.toLowerCase().replace(" ", "-") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <div className="text-center mb-8 md:mb-12">
          <BookOpen className="w-12 md:w-16 h-12 md:h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">Gold Mint Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Insights, analysis, and expert commentary on precious metals markets, investment strategies, 
            and industry trends from our team of specialists.
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-1 md:gap-2 text-sm md:text-base"
                size="sm"
              >
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {!searchTerm && selectedCategory === "all" && (
          <Card className="mb-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto bg-muted flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground" />
              </div>
              <div className="p-8">
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{featuredPost.author}</p>
                      <p className="text-xs text-muted-foreground">{featuredPost.authorRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                </div>
                <Button variant="gold" onClick={() => {
                  // In a real app, this would navigate to the full article
                  navigate(`/blog/2025-precious-metals-outlook`);
                }}>
                  Read Full Article
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {searchTerm ? `Search Results (${filteredPosts.length})` : 
               selectedCategory === "all" ? "Latest Articles" : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  // In a real app, this would navigate to the full article
                  navigate(`/blog/${post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`);
                }}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? `No articles match "${searchTerm}". Try different keywords or browse categories.`
                  : "No articles in this category yet. Check back soon for new content."
                }
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}>
                View All Articles
              </Button>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-navy-deep to-navy-light text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Informed</h3>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to our newsletter for weekly market insights and investment analysis
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-white text-navy-deep"
                />
                <Button 
                  variant="gold" 
                  className="whitespace-nowrap"
                  onClick={() => {
                    toast({
                      title: "Subscribed!",
                      description: "You've been subscribed to our newsletter.",
                    });
                  }}
                >
                  Subscribe Now
                </Button>
              </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Blog;