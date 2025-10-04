import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBodyTranslation } from '@/hooks/useBodyTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Demo page showing how the translation system works
 * This page demonstrates both manual translation using t() function
 * and automatic translation using data-translate attributes
 */
const TranslationDemo = () => {
  const { t, language } = useLanguage();
  const { translateBodyContent } = useBodyTranslation();

  const handleManualTranslation = () => {
    translateBodyContent();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
        
        <div className="grid gap-6">
          {/* Manual Translation Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Translation Examples</CardTitle>
              <CardDescription>
                These elements use the t() function directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('hero.title1')} {t('hero.title2')}</h3>
                <p className="text-muted-foreground">{t('hero.subtitle')}</p>
              </div>
              
              <div className="flex gap-2">
                <Button>{t('hero.cta1')}</Button>
                <Button variant="outline">{t('hero.cta2')}</Button>
              </div>
              
              <div className="flex gap-2">
                <Badge>{t('hero.feature1')}</Badge>
                <Badge>{t('hero.feature2')}</Badge>
                <Badge>{t('hero.feature3')}</Badge>
                <Badge>{t('hero.feature4')}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Automatic Translation Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Automatic Translation Examples</CardTitle>
              <CardDescription>
                These elements use data-translate attributes for automatic translation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 data-translate="stats.title" className="text-lg font-semibold mb-2">
                  {t('stats.title')}
                </h3>
                <p data-translate="stats.subtitle" className="text-muted-foreground">
                  {t('stats.subtitle')}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button data-translate="products.addToCart">
                  {t('products.addToCart')}
                </Button>
                <Button variant="outline" data-translate="products.view">
                  {t('products.view')}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Badge data-translate="ui.new">{t('ui.new')}</Badge>
                <Badge data-translate="ui.sale">{t('ui.sale')}</Badge>
                <Badge data-translate="ui.featured">{t('ui.featured')}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Blog Content Example */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Content Translation</CardTitle>
              <CardDescription>
                Example of blog content with translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 data-translate="blog.centralBankTitle" className="text-lg font-semibold mb-2">
                  {t('blog.centralBankTitle')}
                </h3>
                <p data-translate="blog.centralBankContent" className="text-muted-foreground">
                  {t('blog.centralBankContent')}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button data-translate="blog.share">{t('blog.share')}</Button>
                <Button variant="outline" data-translate="ui.readMore">
                  {t('ui.readMore')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Terms Content Example */}
          <Card>
            <CardHeader>
              <CardTitle>Terms Content Translation</CardTitle>
              <CardDescription>
                Example of terms content with translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 data-translate="terms.accountTerms" className="text-lg font-semibold mb-2">
                  {t('terms.accountTerms')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li data-translate="terms.accountTerms1">{t('terms.accountTerms1')}</li>
                  <li data-translate="terms.accountTerms2">{t('terms.accountTerms2')}</li>
                  <li data-translate="terms.accountTerms3">{t('terms.accountTerms3')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Product Detail Example */}
          <Card>
            <CardHeader>
              <CardTitle>Product Detail Translation</CardTitle>
              <CardDescription>
                Example of product detail content with translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 data-translate="productDetail.specifications" className="text-lg font-semibold mb-2">
                  {t('productDetail.specifications')}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div data-translate="productDetail.metalContent">{t('productDetail.metalContent')}</div>
                  <div data-translate="productDetail.purity">{t('productDetail.purity')}</div>
                  <div data-translate="productDetail.weight">{t('productDetail.weight')}</div>
                  <div data-translate="productDetail.mint">{t('productDetail.mint')}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button data-translate="productDetail.addToCart">
                  {t('productDetail.addToCart')}
                </Button>
                <Button variant="outline" data-translate="productDetail.buyNow">
                  {t('productDetail.buyNow')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Translation Trigger */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Translation Control</CardTitle>
              <CardDescription>
                Current language: <strong>{language}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleManualTranslation} className="w-full">
                {t('ui.apply')} Manual Translation
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This button triggers manual translation of all elements with data-translate attributes.
                The translation system also works automatically when the language changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TranslationDemo;
