import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBodyTranslation } from '@/hooks/useBodyTranslation';

interface LanguageTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that handles language transitions for body content
 * Automatically translates content when language changes
 */
const LanguageTransitionWrapper: React.FC<LanguageTransitionWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isTransitioning } = useLanguage();
  const { translateBodyContent } = useBodyTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Translate content after transition completes
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        translateBodyContent();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, translateBodyContent]);

  return (
    <div 
      ref={wrapperRef}
      className={`transition-all duration-300 ${
        isTransitioning ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default LanguageTransitionWrapper;