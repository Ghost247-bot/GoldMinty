import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import PriceTicker from './PriceTicker';

interface LayoutProps {
  children: ReactNode;
  showPriceTicker?: boolean;
}

const Layout = ({ children, showPriceTicker = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showPriceTicker && <PriceTicker />}
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;