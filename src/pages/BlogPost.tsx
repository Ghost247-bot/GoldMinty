import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock blog posts data - in a real app, this would come from an API or CMS
  const blogPosts = {
    "central-bank-gold-purchases-reach-record-highs-in-q4-2024": {
      title: t('blog.centralBankTitle'),
      content: `
        <p data-translate="blog.centralBankContent">${t('blog.centralBankContent')}</p>
        
        <h2 data-translate="blog.recordBreaking">${t('blog.recordBreaking')}</h2>
        <p data-translate="blog.recordBreakingContent">${t('blog.recordBreakingContent')}</p>
        
        <h2 data-translate="blog.keyDrivers">${t('blog.keyDrivers')}</h2>
        <p>Several factors have contributed to this remarkable trend:</p>
        <ul>
          <li><strong data-translate="blog.geopoliticalTensions">${t('blog.geopoliticalTensions')}:</strong> <span data-translate="blog.geopoliticalTensionsDesc">${t('blog.geopoliticalTensionsDesc')}</span></li>
          <li><strong data-translate="blog.inflationHedge">${t('blog.inflationHedge')}:</strong> <span data-translate="blog.inflationHedgeDesc">${t('blog.inflationHedgeDesc')}</span></li>
          <li><strong data-translate="blog.dollarDiversification">${t('blog.dollarDiversification')}:</strong> <span data-translate="blog.dollarDiversificationDesc">${t('blog.dollarDiversificationDesc')}</span></li>
          <li><strong data-translate="blog.financialStability">${t('blog.financialStability')}:</strong> <span data-translate="blog.financialStabilityDesc">${t('blog.financialStabilityDesc')}</span></li>
        </ul>
        
        <h2 data-translate="blog.leadingPurchasers">${t('blog.leadingPurchasers')}</h2>
        <p data-translate="blog.leadingPurchasersContent">${t('blog.leadingPurchasersContent')}</p>
        
        <h2 data-translate="blog.marketImpact">${t('blog.marketImpact')}</h2>
        <p data-translate="blog.marketImpactContent">${t('blog.marketImpactContent')}</p>
        
        <p>Analysts project that central bank purchases will remain elevated throughout 2025, with several countries publicly announcing intentions to increase their gold reserve ratios. This institutional backing provides a solid foundation for long-term precious metals investment strategies.</p>
        
        <h2 data-translate="blog.investmentImplications">${t('blog.investmentImplications')}</h2>
        <p data-translate="blog.investmentImplicationsContent">${t('blog.investmentImplicationsContent')}</p>
      `,
      author: t('blog.author'),
      date: t('blog.publishedDate'),
      readTime: t('blog.readTime'),
      category: t('blog.category')
    },
    "2025-precious-metals-outlook": {
      title: "2025 Precious Metals Outlook: Navigating Uncertainty with Strategic Investments",
      content: `
        <p>As we enter 2025, global economic uncertainties continue to drive investors toward precious metals as a hedge against inflation and market volatility. Our comprehensive analysis explores key trends and opportunities for the year ahead.</p>
        
        <h2>Economic Landscape Overview</h2>
        <p>The global economic environment remains complex, with central banks worldwide grappling with persistent inflationary pressures while attempting to maintain economic growth. This delicate balancing act creates an ideal backdrop for precious metals investment.</p>
        
        <h2>Gold Market Projections</h2>
        <p>Gold enters 2025 from a position of strength, having reached multiple record highs throughout 2024. Key factors supporting continued gold appreciation include:</p>
        <ul>
          <li>Ongoing central bank accumulation programs</li>
          <li>Persistent inflation concerns in major economies</li>
          <li>Geopolitical tensions driving safe-haven demand</li>
          <li>Currency debasement fears amid expansive fiscal policies</li>
        </ul>
        
        <h2>Silver's Industrial Renaissance</h2>
        <p>Silver presents a unique investment opportunity in 2025, benefiting from both monetary demand and accelerating industrial applications. The green energy transition, particularly solar panel manufacturing and electric vehicle production, continues to drive unprecedented industrial silver consumption.</p>
        
        <h2>Platinum and Palladium Dynamics</h2>
        <p>The platinum group metals face evolving demand patterns as automotive manufacturing shifts toward electric vehicles. However, hydrogen fuel cell technology and industrial applications provide new growth avenues for these precious metals.</p>
        
        <h2>Strategic Investment Approaches</h2>
        <p>Successful precious metals investing in 2025 requires a nuanced approach that considers both macroeconomic factors and individual investment objectives. Key strategies include:</p>
        <ul>
          <li>Dollar-cost averaging for consistent accumulation</li>
          <li>Diversification across multiple precious metals</li>
          <li>Geographic diversification of storage locations</li>
          <li>Regular portfolio rebalancing based on market conditions</li>
        </ul>
        
        <h2>Risk Considerations</h2>
        <p>While precious metals offer compelling investment opportunities, investors must also consider potential risks, including short-term volatility, storage costs, and opportunity costs relative to other asset classes.</p>
        
        <p>Our outlook for 2025 remains constructive on precious metals, with gold and silver positioned to benefit from continued monetary uncertainty and industrial demand growth.</p>
      `,
      author: "Sarah Chen",
      date: "December 20, 2024", 
      readTime: "8 min read",
      category: "Market Analysis"
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/blog")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="w-4 h-4 mr-2" />
              {t('blog.share')}
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-primary prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-ul:text-muted-foreground prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('blog.publishedOn')} {post.date} {t('blog.by')} {post.author}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {t('blog.shareArticle')}
            </Button>
          </div>
        </footer>

        {/* Related Articles CTA */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Explore More Insights</h3>
          <p className="text-muted-foreground mb-6">
            Discover more expert analysis and market insights from our team of precious metals specialists.
          </p>
          <Button onClick={() => navigate("/blog")}>
            View All Articles
          </Button>
        </div>
    </article>
  );
};

export default BlogPost;