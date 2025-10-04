# Multilingual Translation System

This document explains how to use the comprehensive multilingual translation system implemented in the Gold Avenue website.

## Overview

The translation system provides full language-switching functionality for all body text elements across every page. It supports 6 languages:
- English (en)
- Chinese (zh) 
- Spanish (es)
- German (de)
- Italian (it)
- French (fr)

## Architecture

### Core Components

1. **LanguageContext** (`src/contexts/LanguageContext.tsx`)
   - Manages global language state
   - Provides `t()` function for translations
   - Handles language persistence in localStorage
   - Manages transition animations

2. **useBodyTranslation Hook** (`src/hooks/useBodyTranslation.tsx`)
   - Enhanced translation hook for body content
   - Automatic translation of elements with `data-translate` attributes
   - Pattern-based translation for common UI elements
   - Manual translation trigger functionality

3. **LanguageTransitionWrapper** (`src/components/LanguageTransitionWrapper.tsx`)
   - Wraps page content for smooth language transitions
   - Automatically triggers translation when language changes
   - Provides visual feedback during transitions

4. **Translation Files** (`src/contexts/translations/`)
   - `en.ts` - English (base language)
   - `de.ts` - German translations
   - `es.ts` - Spanish translations
   - `fr.ts` - French translations
   - `it.ts` - Italian translations
   - `zh.ts` - Chinese translations

## Usage

### Basic Translation

Use the `t()` function to translate text:

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title1')}</h1>
      <p>{t('hero.subtitle')}</p>
      <Button>{t('hero.cta1')}</Button>
    </div>
  );
};
```

### Automatic Translation with Data Attributes

Use `data-translate` attributes for automatic translation:

```tsx
<div>
  <h2 data-translate="stats.title">{t('stats.title')}</h2>
  <p data-translate="stats.subtitle">{t('stats.subtitle')}</p>
  <Button data-translate="products.addToCart">{t('products.addToCart')}</Button>
</div>
```

### Enhanced Translation Hook

Use the enhanced hook for advanced translation features:

```tsx
import { useBodyTranslation } from '@/hooks/useBodyTranslation';

const MyComponent = () => {
  const { translateBodyContent, translateElement } = useBodyTranslation();
  
  const handleManualTranslation = () => {
    translateBodyContent(); // Translates all elements with data-translate
  };
  
  return (
    <div>
      <Button onClick={handleManualTranslation}>
        Translate Content
      </Button>
    </div>
  );
};
```

## Translation Keys

### Content Categories

The translation system is organized into logical categories:

#### Hero Section
- `hero.title1`, `hero.title2`, `hero.title3`
- `hero.subtitle`
- `hero.feature1`, `hero.feature2`, `hero.feature3`, `hero.feature4`
- `hero.cta1`, `hero.cta2`

#### Navigation
- `nav.deals`, `nav.gold`, `nav.silver`, `nav.platinum`
- `nav.charts`, `nav.priceList`, `nav.resources`

#### Blog Content
- `blog.centralBankTitle`, `blog.centralBankContent`
- `blog.recordBreaking`, `blog.recordBreakingContent`
- `blog.keyDrivers`, `blog.geopoliticalTensions`
- `blog.author`, `blog.publishedDate`, `blog.readTime`

#### Terms of Service
- `terms.accountTerms`, `terms.investmentServices`
- `terms.storageCustody`, `terms.complianceRegulations`
- `terms.paymentTerms`, `terms.liabilityLimitations`

#### Product Details
- `productDetail.notFound`, `productDetail.backToProducts`
- `productDetail.specifications`, `productDetail.features`
- `productDetail.addToCart`, `productDetail.buyNow`

#### Common UI Elements
- `ui.loading`, `ui.error`, `ui.success`
- `ui.cancel`, `ui.save`, `ui.delete`, `ui.edit`
- `ui.back`, `ui.next`, `ui.previous`
- `ui.search`, `ui.filter`, `ui.sort`

## Implementation Examples

### Page Component with Translations

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('about.title')}</h1>
      <p>{t('about.subtitle')}</p>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>{t('about.value1')}</h3>
          <p>{t('about.value1Desc')}</p>
        </div>
        <div>
          <h3>{t('about.value2')}</h3>
          <p>{t('about.value2Desc')}</p>
        </div>
        <div>
          <h3>{t('about.value3')}</h3>
          <p>{t('about.value3Desc')}</p>
        </div>
      </div>
      
      <Button>{t('about.cta')}</Button>
    </div>
  );
};
```

### Blog Post with Dynamic Content

```tsx
const BlogPost = () => {
  const { t } = useLanguage();
  
  const blogPost = {
    title: t('blog.centralBankTitle'),
    content: `
      <h2 data-translate="blog.recordBreaking">${t('blog.recordBreaking')}</h2>
      <p data-translate="blog.recordBreakingContent">${t('blog.recordBreakingContent')}</p>
      
      <h2 data-translate="blog.keyDrivers">${t('blog.keyDrivers')}</h2>
      <ul>
        <li><strong data-translate="blog.geopoliticalTensions">${t('blog.geopoliticalTensions')}:</strong> 
            <span data-translate="blog.geopoliticalTensionsDesc">${t('blog.geopoliticalTensionsDesc')}</span></li>
      </ul>
    `,
    author: t('blog.author'),
    date: t('blog.publishedDate')
  };
  
  return (
    <article>
      <h1>{blogPost.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
      <footer>
        <span>{t('blog.publishedOn')} {blogPost.date} {t('blog.by')} {blogPost.author}</span>
      </footer>
    </article>
  );
};
```

## Adding New Translations

### 1. Add to English Base File

```typescript
// src/contexts/translations/en.ts
export const en = {
  // ... existing translations
  
  // New section
  'newSection.title': 'New Section Title',
  'newSection.subtitle': 'New section subtitle text',
  'newSection.button': 'New Button Text',
};
```

### 2. Add to Other Language Files

```typescript
// src/contexts/translations/de.ts
export const de: typeof en = {
  ...en,
  
  // Override with German translations
  'newSection.title': 'Neuer Abschnitt Titel',
  'newSection.subtitle': 'Neuer Abschnitt Untertitel Text',
  'newSection.button': 'Neuer Button Text',
};
```

### 3. Use in Components

```tsx
const NewComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.subtitle')}</p>
      <Button>{t('newSection.button')}</Button>
    </div>
  );
};
```

## Automatic Translation Features

The system automatically translates common patterns:

### Button Text
- "Add to Cart" → `products.addToCart`
- "Buy Now" → `productDetail.buyNow`
- "Read More" → `ui.readMore`
- "Learn More" → `ui.learnMore`

### Headings
- "About Us" → `footer.company.about`
- "Contact Us" → `contact.title`
- "Products" → `footer.products.title`

### Status Text
- "In Stock" → `productDetail.inStock`
- "Out of Stock" → `productDetail.outOfStock`
- "Free Shipping" → `cart.freeShipping`

## Best Practices

### 1. Use Descriptive Keys
```typescript
// Good
'hero.title1': 'Invest in'
'productDetail.addToCart': 'Add to Cart'

// Avoid
'title1': 'Invest in'
'btn1': 'Add to Cart'
```

### 2. Group Related Translations
```typescript
// Good - grouped by section
'hero.title1': 'Invest in'
'hero.title2': 'Precious Metals'
'hero.title3': 'with Confidence'

'productDetail.specifications': 'Specifications'
'productDetail.features': 'Features'
'productDetail.description': 'Description'
```

### 3. Use Data Attributes for Dynamic Content
```tsx
// Good - allows automatic translation
<div data-translate="blog.centralBankContent">
  {t('blog.centralBankContent')}
</div>

// Also good - manual translation
<div>
  {t('blog.centralBankContent')}
</div>
```

### 4. Handle Missing Translations Gracefully
The system automatically falls back to the translation key if a translation is missing.

## Testing

### Manual Testing
1. Change language using the header/footer language selector
2. Navigate between different pages
3. Verify all text content changes language
4. Check that transitions are smooth

### Demo Page
Visit `/translation-demo` to see a comprehensive example of the translation system in action.

## Troubleshooting

### Common Issues

1. **Text not translating**
   - Check that the translation key exists in the language file
   - Verify the key is spelled correctly
   - Ensure the language file is properly imported

2. **Missing translations**
   - Add the missing key to all language files
   - Use the English text as fallback

3. **Translation not updating**
   - Check that the component is wrapped in LanguageTransitionWrapper
   - Verify the useLanguage hook is being used
   - Try manually triggering translation with useBodyTranslation

### Debug Mode

Enable debug mode to see translation keys:

```tsx
const { t, language } = useLanguage();
console.log('Current language:', language);
console.log('Translation key:', 'hero.title1');
console.log('Translation result:', t('hero.title1'));
```

## Performance Considerations

- Translations are cached in memory
- Language changes trigger minimal re-renders
- Automatic translation only runs when needed
- Large translation files are split by language

## Future Enhancements

- Dynamic translation loading
- Translation management interface
- Automatic translation suggestions
- Translation validation tools
- Performance monitoring
