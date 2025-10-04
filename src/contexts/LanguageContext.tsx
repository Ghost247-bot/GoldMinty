import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'fr' | 'es' | 'de' | 'zh' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header & Navigation
    'nav.deals': '🔥 Deals',
    'nav.gold': 'Gold',
    'nav.silver': 'Silver',
    'nav.platinum': 'Platinum & Palladium',
    'nav.charts': 'Live Charts',
    'nav.priceList': 'Price List',
    'nav.resources': 'Resources',
    'header.needHelp': 'Need help?',
    'header.signIn': 'Sign in',
    'header.signOut': 'Sign out',
    'header.dashboard': 'Dashboard',
    'header.adminPanel': 'Admin Panel',
    'header.menu': 'Menu',
    'header.search': 'Search gold, silver, platinum...',
    'header.searchProducts': 'Search products...',
    
    // Home Page
    'home.hero.title': 'Invest in Precious Metals',
    'home.hero.subtitle': 'Secure your wealth with gold, silver, and platinum',
    'home.hero.cta': 'Start Investing',
    'home.stats.customers': 'Trusted Customers',
    'home.stats.products': 'Premium Products',
    'home.stats.countries': 'Countries Served',
    'home.stats.security': 'Secure Storage',
    
    // Products
    'products.title': 'Our Products',
    'products.filter': 'Filter',
    'products.sort': 'Sort by',
    'products.addToCart': 'Add to Cart',
    'products.viewDetails': 'View Details',
    'products.inStock': 'In Stock',
    'products.outOfStock': 'Out of Stock',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.browseProducts': 'Browse Products',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.insurance': 'Insurance',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.portfolio': 'My Portfolio',
    'dashboard.orders': 'My Orders',
    'dashboard.settings': 'Settings',
    'dashboard.totalValue': 'Total Portfolio Value',
    'dashboard.monthlyGrowth': 'Monthly Growth',
    
    // Footer
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.press': 'Press',
    'footer.contact': 'Contact',
    'footer.products': 'Products',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.shipping': 'Shipping',
    'footer.returns': 'Returns',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
  },
  fr: {
    // Header & Navigation
    'nav.deals': '🔥 Offres',
    'nav.gold': 'Or',
    'nav.silver': 'Argent',
    'nav.platinum': 'Platine & Palladium',
    'nav.charts': 'Graphiques en Direct',
    'nav.priceList': 'Liste des Prix',
    'nav.resources': 'Ressources',
    'header.needHelp': 'Besoin d\'aide?',
    'header.signIn': 'Se connecter',
    'header.signOut': 'Se déconnecter',
    'header.dashboard': 'Tableau de bord',
    'header.adminPanel': 'Panneau Admin',
    'header.menu': 'Menu',
    'header.search': 'Rechercher or, argent, platine...',
    'header.searchProducts': 'Rechercher des produits...',
    
    // Home Page
    'home.hero.title': 'Investir dans les Métaux Précieux',
    'home.hero.subtitle': 'Sécurisez votre richesse avec l\'or, l\'argent et le platine',
    'home.hero.cta': 'Commencer à Investir',
    'home.stats.customers': 'Clients de Confiance',
    'home.stats.products': 'Produits Premium',
    'home.stats.countries': 'Pays Servis',
    'home.stats.security': 'Stockage Sécurisé',
    
    // Products
    'products.title': 'Nos Produits',
    'products.filter': 'Filtrer',
    'products.sort': 'Trier par',
    'products.addToCart': 'Ajouter au Panier',
    'products.viewDetails': 'Voir les Détails',
    'products.inStock': 'En Stock',
    'products.outOfStock': 'Rupture de Stock',
    
    // Cart
    'cart.title': 'Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.continueShopping': 'Continuer les Achats',
    'cart.browseProducts': 'Parcourir les Produits',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.insurance': 'Assurance',
    'cart.tax': 'Taxe',
    'cart.total': 'Total',
    'cart.checkout': 'Passer à la Caisse',
    'cart.remove': 'Supprimer',
    'cart.quantity': 'Quantité',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.portfolio': 'Mon Portefeuille',
    'dashboard.orders': 'Mes Commandes',
    'dashboard.settings': 'Paramètres',
    'dashboard.totalValue': 'Valeur Totale du Portefeuille',
    'dashboard.monthlyGrowth': 'Croissance Mensuelle',
    
    // Footer
    'footer.company': 'Entreprise',
    'footer.about': 'À Propos',
    'footer.careers': 'Carrières',
    'footer.press': 'Presse',
    'footer.contact': 'Contact',
    'footer.products': 'Produits',
    'footer.support': 'Support',
    'footer.helpCenter': 'Centre d\'Aide',
    'footer.shipping': 'Livraison',
    'footer.returns': 'Retours',
    'footer.legal': 'Légal',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.cookies': 'Politique des Cookies',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
  },
  es: {
    // Header & Navigation
    'nav.deals': '🔥 Ofertas',
    'nav.gold': 'Oro',
    'nav.silver': 'Plata',
    'nav.platinum': 'Platino y Paladio',
    'nav.charts': 'Gráficos en Vivo',
    'nav.priceList': 'Lista de Precios',
    'nav.resources': 'Recursos',
    'header.needHelp': '¿Necesitas ayuda?',
    'header.signIn': 'Iniciar sesión',
    'header.signOut': 'Cerrar sesión',
    'header.dashboard': 'Panel',
    'header.adminPanel': 'Panel de Admin',
    'header.menu': 'Menú',
    'header.search': 'Buscar oro, plata, platino...',
    'header.searchProducts': 'Buscar productos...',
    
    // Home Page
    'home.hero.title': 'Invertir en Metales Preciosos',
    'home.hero.subtitle': 'Asegure su riqueza con oro, plata y platino',
    'home.hero.cta': 'Comenzar a Invertir',
    'home.stats.customers': 'Clientes de Confianza',
    'home.stats.products': 'Productos Premium',
    'home.stats.countries': 'Países Servidos',
    'home.stats.security': 'Almacenamiento Seguro',
    
    // Products
    'products.title': 'Nuestros Productos',
    'products.filter': 'Filtrar',
    'products.sort': 'Ordenar por',
    'products.addToCart': 'Añadir al Carrito',
    'products.viewDetails': 'Ver Detalles',
    'products.inStock': 'En Stock',
    'products.outOfStock': 'Agotado',
    
    // Cart
    'cart.title': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.continueShopping': 'Continuar Comprando',
    'cart.browseProducts': 'Explorar Productos',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Envío',
    'cart.insurance': 'Seguro',
    'cart.tax': 'Impuesto',
    'cart.total': 'Total',
    'cart.checkout': 'Proceder al Pago',
    'cart.remove': 'Eliminar',
    'cart.quantity': 'Cantidad',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido',
    'dashboard.portfolio': 'Mi Portafolio',
    'dashboard.orders': 'Mis Pedidos',
    'dashboard.settings': 'Configuración',
    'dashboard.totalValue': 'Valor Total del Portafolio',
    'dashboard.monthlyGrowth': 'Crecimiento Mensual',
    
    // Footer
    'footer.company': 'Empresa',
    'footer.about': 'Sobre Nosotros',
    'footer.careers': 'Carreras',
    'footer.press': 'Prensa',
    'footer.contact': 'Contacto',
    'footer.products': 'Productos',
    'footer.support': 'Soporte',
    'footer.helpCenter': 'Centro de Ayuda',
    'footer.shipping': 'Envío',
    'footer.returns': 'Devoluciones',
    'footer.legal': 'Legal',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.cookies': 'Política de Cookies',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
  },
  de: {
    // Header & Navigation
    'nav.deals': '🔥 Angebote',
    'nav.gold': 'Gold',
    'nav.silver': 'Silber',
    'nav.platinum': 'Platin & Palladium',
    'nav.charts': 'Live-Charts',
    'nav.priceList': 'Preisliste',
    'nav.resources': 'Ressourcen',
    'header.needHelp': 'Brauchen Sie Hilfe?',
    'header.signIn': 'Anmelden',
    'header.signOut': 'Abmelden',
    'header.dashboard': 'Dashboard',
    'header.adminPanel': 'Admin-Panel',
    'header.menu': 'Menü',
    'header.search': 'Gold, Silber, Platin suchen...',
    'header.searchProducts': 'Produkte suchen...',
    
    // Home Page
    'home.hero.title': 'In Edelmetalle Investieren',
    'home.hero.subtitle': 'Sichern Sie Ihr Vermögen mit Gold, Silber und Platin',
    'home.hero.cta': 'Jetzt Investieren',
    'home.stats.customers': 'Vertrauenswürdige Kunden',
    'home.stats.products': 'Premium-Produkte',
    'home.stats.countries': 'Länder Bedient',
    'home.stats.security': 'Sichere Lagerung',
    
    // Products
    'products.title': 'Unsere Produkte',
    'products.filter': 'Filtern',
    'products.sort': 'Sortieren nach',
    'products.addToCart': 'In den Warenkorb',
    'products.viewDetails': 'Details Anzeigen',
    'products.inStock': 'Auf Lager',
    'products.outOfStock': 'Nicht Vorrätig',
    
    // Cart
    'cart.title': 'Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.continueShopping': 'Weiter Einkaufen',
    'cart.browseProducts': 'Produkte Durchsuchen',
    'cart.subtotal': 'Zwischensumme',
    'cart.shipping': 'Versand',
    'cart.insurance': 'Versicherung',
    'cart.tax': 'Steuer',
    'cart.total': 'Gesamt',
    'cart.checkout': 'Zur Kasse',
    'cart.remove': 'Entfernen',
    'cart.quantity': 'Menge',
    
    // Dashboard
    'dashboard.welcome': 'Willkommen zurück',
    'dashboard.portfolio': 'Mein Portfolio',
    'dashboard.orders': 'Meine Bestellungen',
    'dashboard.settings': 'Einstellungen',
    'dashboard.totalValue': 'Gesamtwert des Portfolios',
    'dashboard.monthlyGrowth': 'Monatliches Wachstum',
    
    // Footer
    'footer.company': 'Unternehmen',
    'footer.about': 'Über Uns',
    'footer.careers': 'Karriere',
    'footer.press': 'Presse',
    'footer.contact': 'Kontakt',
    'footer.products': 'Produkte',
    'footer.support': 'Support',
    'footer.helpCenter': 'Hilfezentrum',
    'footer.shipping': 'Versand',
    'footer.returns': 'Rücksendungen',
    'footer.legal': 'Rechtliches',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.cookies': 'Cookie-Richtlinie',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.view': 'Ansehen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.search': 'Suchen',
  },
  zh: {
    // Header & Navigation
    'nav.deals': '🔥 优惠',
    'nav.gold': '黄金',
    'nav.silver': '白银',
    'nav.platinum': '铂金和钯金',
    'nav.charts': '实时图表',
    'nav.priceList': '价格表',
    'nav.resources': '资源',
    'header.needHelp': '需要帮助？',
    'header.signIn': '登录',
    'header.signOut': '退出',
    'header.dashboard': '仪表板',
    'header.adminPanel': '管理面板',
    'header.menu': '菜单',
    'header.search': '搜索黄金、白银、铂金...',
    'header.searchProducts': '搜索产品...',
    
    // Home Page
    'home.hero.title': '投资贵金属',
    'home.hero.subtitle': '用黄金、白银和铂金保护您的财富',
    'home.hero.cta': '开始投资',
    'home.stats.customers': '信赖的客户',
    'home.stats.products': '优质产品',
    'home.stats.countries': '服务国家',
    'home.stats.security': '安全存储',
    
    // Products
    'products.title': '我们的产品',
    'products.filter': '筛选',
    'products.sort': '排序',
    'products.addToCart': '加入购物车',
    'products.viewDetails': '查看详情',
    'products.inStock': '有货',
    'products.outOfStock': '缺货',
    
    // Cart
    'cart.title': '购物车',
    'cart.empty': '您的购物车是空的',
    'cart.continueShopping': '继续购物',
    'cart.browseProducts': '浏览产品',
    'cart.subtotal': '小计',
    'cart.shipping': '运费',
    'cart.insurance': '保险',
    'cart.tax': '税费',
    'cart.total': '总计',
    'cart.checkout': '结账',
    'cart.remove': '删除',
    'cart.quantity': '数量',
    
    // Dashboard
    'dashboard.welcome': '欢迎回来',
    'dashboard.portfolio': '我的投资组合',
    'dashboard.orders': '我的订单',
    'dashboard.settings': '设置',
    'dashboard.totalValue': '投资组合总值',
    'dashboard.monthlyGrowth': '月增长',
    
    // Footer
    'footer.company': '公司',
    'footer.about': '关于我们',
    'footer.careers': '职业',
    'footer.press': '新闻',
    'footer.contact': '联系',
    'footer.products': '产品',
    'footer.support': '支持',
    'footer.helpCenter': '帮助中心',
    'footer.shipping': '运输',
    'footer.returns': '退货',
    'footer.legal': '法律',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.cookies': 'Cookie政策',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.search': '搜索',
  },
  it: {
    // Header & Navigation
    'nav.deals': '🔥 Offerte',
    'nav.gold': 'Oro',
    'nav.silver': 'Argento',
    'nav.platinum': 'Platino e Palladio',
    'nav.charts': 'Grafici in Tempo Reale',
    'nav.priceList': 'Listino Prezzi',
    'nav.resources': 'Risorse',
    'header.needHelp': 'Hai bisogno di aiuto?',
    'header.signIn': 'Accedi',
    'header.signOut': 'Esci',
    'header.dashboard': 'Dashboard',
    'header.adminPanel': 'Pannello Admin',
    'header.menu': 'Menu',
    'header.search': 'Cerca oro, argento, platino...',
    'header.searchProducts': 'Cerca prodotti...',
    
    // Home Page
    'home.hero.title': 'Investi in Metalli Preziosi',
    'home.hero.subtitle': 'Proteggi la tua ricchezza con oro, argento e platino',
    'home.hero.cta': 'Inizia a Investire',
    'home.stats.customers': 'Clienti Fidati',
    'home.stats.products': 'Prodotti Premium',
    'home.stats.countries': 'Paesi Serviti',
    'home.stats.security': 'Deposito Sicuro',
    
    // Products
    'products.title': 'I Nostri Prodotti',
    'products.filter': 'Filtra',
    'products.sort': 'Ordina per',
    'products.addToCart': 'Aggiungi al Carrello',
    'products.viewDetails': 'Vedi Dettagli',
    'products.inStock': 'Disponibile',
    'products.outOfStock': 'Esaurito',
    
    // Cart
    'cart.title': 'Carrello',
    'cart.empty': 'Il tuo carrello è vuoto',
    'cart.continueShopping': 'Continua gli Acquisti',
    'cart.browseProducts': 'Sfoglia Prodotti',
    'cart.subtotal': 'Subtotale',
    'cart.shipping': 'Spedizione',
    'cart.insurance': 'Assicurazione',
    'cart.tax': 'Tassa',
    'cart.total': 'Totale',
    'cart.checkout': 'Procedi al Pagamento',
    'cart.remove': 'Rimuovi',
    'cart.quantity': 'Quantità',
    
    // Dashboard
    'dashboard.welcome': 'Bentornato',
    'dashboard.portfolio': 'Il Mio Portfolio',
    'dashboard.orders': 'I Miei Ordini',
    'dashboard.settings': 'Impostazioni',
    'dashboard.totalValue': 'Valore Totale del Portfolio',
    'dashboard.monthlyGrowth': 'Crescita Mensile',
    
    // Footer
    'footer.company': 'Azienda',
    'footer.about': 'Chi Siamo',
    'footer.careers': 'Carriere',
    'footer.press': 'Stampa',
    'footer.contact': 'Contatto',
    'footer.products': 'Prodotti',
    'footer.support': 'Supporto',
    'footer.helpCenter': 'Centro Assistenza',
    'footer.shipping': 'Spedizione',
    'footer.returns': 'Resi',
    'footer.legal': 'Legale',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Termini di Servizio',
    'footer.cookies': 'Cookie Policy',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
    'common.cancel': 'Annulla',
    'common.save': 'Salva',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.view': 'Visualizza',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.previous': 'Precedente',
    'common.search': 'Cerca',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
