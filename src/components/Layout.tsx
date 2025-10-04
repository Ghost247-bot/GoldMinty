import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import PriceTicker from './PriceTicker';
import LanguageTransitionWrapper from './LanguageTransitionWrapper';

interface LayoutProps {
  children: ReactNode;
  showPriceTicker?: boolean;
}

const Layout = ({ children, showPriceTicker = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showPriceTicker && <PriceTicker />}
      <Header />
      <main className="flex-1 pt-24">
        <LanguageTransitionWrapper>
          {children}
        </LanguageTransitionWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;