import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SecurityVerification from "./components/SecurityVerification";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ButtonShowcase from "./pages/ButtonShowcase";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Charts from "./pages/Charts";
import Prices from "./pages/Prices";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import HelpCenter from "./pages/HelpCenter";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderFailed from "./pages/OrderFailed";
import BulkProductUpload from "./components/BulkProductUpload";
import Wishlist from "./pages/Wishlist";

const App = () => (
  <LanguageProvider>
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Pages with Layout (Header + Footer) */}
          <Route path="/" element={<Layout showPriceTicker><Index /></Layout>} />
          <Route path="/buttons" element={<Layout><ButtonShowcase /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/products/:category" element={<Layout><Products /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-failed" element={<OrderFailed />} />
        <Route path="/bulk-upload" element={<BulkProductUpload />} />
          <Route path="/charts" element={<Layout><Charts /></Layout>} />
          <Route path="/prices" element={<Layout><Prices /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
          <Route path="/cookie-policy" element={<Layout><CookiePolicy /></Layout>} />
          <Route path="/help-center" element={<Layout><HelpCenter /></Layout>} />
          <Route path="/shipping" element={<Layout><Shipping /></Layout>} />
          <Route path="/returns" element={<Layout><Returns /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/press" element={<Layout><Press /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/legal-notice" element={<Layout><LegalNotice /></Layout>} />
          
          {/* Standalone pages (no Layout) */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/security-verification" element={<SecurityVerification />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><UserDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </LanguageProvider>
);

export default App;
