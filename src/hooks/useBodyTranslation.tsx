import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Enhanced translation hook for body content
 * Provides utilities for translating body content dynamically
 */
export const useBodyTranslation = () => {
  const { language, t, isTransitioning } = useLanguage();
  const bodyRef = useRef<HTMLElement | null>(null);

  /**
   * Translate a single text node or element
   */
  const translateElement = (element: HTMLElement, translationKey: string) => {
    const translation = t(translationKey as any);
    if (translation && translation !== translationKey) {
      element.textContent = translation;
    }
  };

  /**
   * Translate all elements with data-translate attributes
   */
  const translateDataAttributes = () => {
    if (!bodyRef.current) return;

    const elements = bodyRef.current.querySelectorAll('[data-translate]');
    elements.forEach((element) => {
      const translationKey = element.getAttribute('data-translate');
      if (translationKey) {
        translateElement(element as HTMLElement, translationKey);
      }
    });
  };

  /**
   * Translate content based on common patterns
   */
  const translateCommonPatterns = () => {
    if (!bodyRef.current) return;

    // Translate common button text
    const buttons = bodyRef.current.querySelectorAll('button, .btn');
    buttons.forEach((button) => {
      const text = button.textContent?.toLowerCase().trim();
      if (text) {
        let translationKey = '';
        
        if (text.includes('add to cart') || text.includes('add')) {
          translationKey = 'products.addToCart';
        } else if (text.includes('buy now') || text.includes('buy')) {
          translationKey = 'productDetail.buyNow';
        } else if (text.includes('view') || text.includes('see')) {
          translationKey = 'products.view';
        } else if (text.includes('read more')) {
          translationKey = 'ui.readMore';
        } else if (text.includes('learn more')) {
          translationKey = 'ui.learnMore';
        } else if (text.includes('get started')) {
          translationKey = 'ui.getStarted';
        } else if (text.includes('continue')) {
          translationKey = 'ui.continue';
        } else if (text.includes('back')) {
          translationKey = 'ui.back';
        } else if (text.includes('next')) {
          translationKey = 'ui.next';
        } else if (text.includes('previous')) {
          translationKey = 'ui.previous';
        } else if (text.includes('close')) {
          translationKey = 'ui.close';
        } else if (text.includes('save')) {
          translationKey = 'ui.save';
        } else if (text.includes('cancel')) {
          translationKey = 'ui.cancel';
        } else if (text.includes('delete')) {
          translationKey = 'ui.delete';
        } else if (text.includes('edit')) {
          translationKey = 'ui.edit';
        } else if (text.includes('search')) {
          translationKey = 'ui.search';
        } else if (text.includes('filter')) {
          translationKey = 'ui.filter';
        } else if (text.includes('sort')) {
          translationKey = 'ui.sort';
        } else if (text.includes('clear')) {
          translationKey = 'ui.clear';
        } else if (text.includes('apply')) {
          translationKey = 'ui.apply';
        } else if (text.includes('submit')) {
          translationKey = 'ui.submit';
        } else if (text.includes('confirm')) {
          translationKey = 'ui.confirm';
        } else if (text.includes('accept')) {
          translationKey = 'ui.accept';
        } else if (text.includes('decline')) {
          translationKey = 'ui.decline';
        } else if (text.includes('yes')) {
          translationKey = 'ui.yes';
        } else if (text.includes('no')) {
          translationKey = 'ui.no';
        } else if (text.includes('ok')) {
          translationKey = 'ui.ok';
        }

        if (translationKey) {
          const translation = t(translationKey as any);
          if (translation && translation !== translationKey) {
            button.textContent = translation;
          }
        }
      }
    });

    // Translate common headings
    const headings = bodyRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      const text = heading.textContent?.toLowerCase().trim();
      if (text) {
        let translationKey = '';
        
        if (text.includes('about us') || text.includes('about')) {
          translationKey = 'footer.company.about';
        } else if (text.includes('contact us') || text.includes('contact')) {
          translationKey = 'contact.title';
        } else if (text.includes('products') || text.includes('shop')) {
          translationKey = 'footer.products.title';
        } else if (text.includes('support') || text.includes('help')) {
          translationKey = 'footer.support.title';
        } else if (text.includes('privacy') || text.includes('privacy policy')) {
          translationKey = 'footer.legal.privacy';
        } else if (text.includes('terms') || text.includes('terms of service')) {
          translationKey = 'footer.legal.terms';
        } else if (text.includes('shipping') || text.includes('delivery')) {
          translationKey = 'shipping.title';
        } else if (text.includes('returns') || text.includes('return policy')) {
          translationKey = 'returns.title';
        } else if (text.includes('blog') || text.includes('news')) {
          translationKey = 'blog.title';
        } else if (text.includes('careers') || text.includes('jobs')) {
          translationKey = 'careers.title';
        } else if (text.includes('press') || text.includes('media')) {
          translationKey = 'press.title';
        } else if (text.includes('legal') || text.includes('legal notice')) {
          translationKey = 'legal.title';
        } else if (text.includes('cookies') || text.includes('cookie policy')) {
          translationKey = 'cookies.title';
        }

        if (translationKey) {
          const translation = t(translationKey as any);
          if (translation && translation !== translationKey) {
            heading.textContent = translation;
          }
        }
      }
    });

    // Translate common paragraphs and descriptions
    const paragraphs = bodyRef.current.querySelectorAll('p, .description, .desc');
    paragraphs.forEach((paragraph) => {
      const text = paragraph.textContent?.toLowerCase().trim();
      if (text) {
        let translationKey = '';
        
        if (text.includes('welcome') || text.includes('welcome to')) {
          translationKey = 'hero.title1';
        } else if (text.includes('trusted') || text.includes('reliable')) {
          translationKey = 'hero.badge';
        } else if (text.includes('secure') || text.includes('security')) {
          translationKey = 'hero.feature1';
        } else if (text.includes('authentic') || text.includes('genuine')) {
          translationKey = 'hero.feature2';
        } else if (text.includes('live prices') || text.includes('market prices')) {
          translationKey = 'hero.feature3';
        } else if (text.includes('insured') || text.includes('insurance')) {
          translationKey = 'hero.feature4';
        } else if (text.includes('free shipping') || text.includes('free delivery')) {
          translationKey = 'cart.freeShipping';
        } else if (text.includes('in stock') || text.includes('available')) {
          translationKey = 'productDetail.inStock';
        } else if (text.includes('out of stock') || text.includes('unavailable')) {
          translationKey = 'productDetail.outOfStock';
        } else if (text.includes('limited stock') || text.includes('few left')) {
          translationKey = 'productDetail.limitedStock';
        }

        if (translationKey) {
          const translation = t(translationKey as any);
          if (translation && translation !== translationKey) {
            paragraph.textContent = translation;
          }
        }
      }
    });
  };

  /**
   * Main translation function that runs all translation methods
   */
  const translateBodyContent = () => {
    if (isTransitioning) return;
    
    // Set body reference if not set
    if (!bodyRef.current) {
      bodyRef.current = document.querySelector('main') || document.body;
    }

    // Run all translation methods
    translateDataAttributes();
    translateCommonPatterns();
  };

  // Auto-translate when language changes
  useEffect(() => {
    const timer = setTimeout(() => {
      translateBodyContent();
    }, 200); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [language, isTransitioning]);

  return {
    translateBodyContent,
    translateElement,
    t,
    language,
    isTransitioning
  };
};

export default useBodyTranslation;
