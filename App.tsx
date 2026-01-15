
import React, { useEffect, useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Preview from './pages/Preview';
import AvailableWebsites from './pages/AvailableWebsites';
import Legal from './pages/Legal';
import { BrandingConfig } from './types';
import { api } from './services/api';

// Enterprise Context for Global Brand Identity
const BrandingContext = createContext<{ branding: BrandingConfig; refresh: () => void }>({
  branding: { companyName: 'Buildora', logoUrl: '', bannerUrl: '', links: [], socialLinks: [] },
  refresh: () => {}
});

export const useBranding = () => useContext(BrandingContext);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Secret Shortcut Listener Component
const AdminShortcutListener = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let inputBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      inputBuffer += e.key;
      if (inputBuffer.endsWith('@@@@@')) {
        navigate('/admin');
        inputBuffer = '';
      }
      if (inputBuffer.length > 20) {
        inputBuffer = inputBuffer.substring(inputBuffer.length - 10);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
  return null;
};

const App: React.FC = () => {
  const [branding, setBranding] = useState<BrandingConfig>({ 
    companyName: 'Buildora', 
    logoUrl: '', 
    bannerUrl: '',
    links: [],
    socialLinks: []
  });

  const loadBranding = async () => {
    const data = await api.getBranding();
    setBranding(data);
  };

  useEffect(() => {
    loadBranding();
    window.addEventListener('storage', loadBranding);
    return () => window.removeEventListener('storage', loadBranding);
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, refresh: loadBranding }}>
      <Router>
        <AdminShortcutListener />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background text-gray-200">
          <Routes>
            {/* Main Application Shell */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home branding={branding} />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/available-websites" element={<AvailableWebsites />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Legal type="privacy" />} />
                    <Route path="/terms" element={<Legal type="terms" />} />
                    <Route path="/ethics" element={<Legal type="ethics" />} />
                    <Route path="/preview/:id" element={<Preview />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
            {/* Autonomous Admin Shell */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </BrandingContext.Provider>
  );
};

export default App;
