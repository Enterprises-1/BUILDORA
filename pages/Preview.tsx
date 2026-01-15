
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Clock, ChevronRight, ChevronLeft, ExternalLink, 
  X, DollarSign, User, Mail, Send, CheckCircle2,
  ShieldAlert, RefreshCw, Zap
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';

/**
 * Buildora Asset Preview Component
 * Manages the secure audit lifecycle of a deployed digital asset.
 */
const Preview: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showToolbar, setShowToolbar] = useState(true);
  
  // Audit Context Logic
  const [isIframeBlocked, setIsIframeBlocked] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [bidForm, setBidForm] = useState({ name: '', email: '', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      const found = await api.getProductById(id);
      if (found) {
        setProduct(found);
        
        if (found.previewMode === 'redirect') {
          handleFallbackRedirect(found.demoUrl);
        }

        const token = searchParams.get('token');
        if (token) {
          try {
            const activationTime = parseInt(atob(token), 10);
            const limitMs = 4 * 60 * 60 * 1000;
            const elapsed = Date.now() - activationTime;
            if (elapsed < limitMs) setTimeRemaining(limitMs - elapsed);
          } catch (e) {
            setTimeRemaining(null);
          }
        }
      }
      setLoading(false);
    };
    fetchAsset();
  }, [id, searchParams]);

  useEffect(() => {
    // Protocol heuristic check
    if (product && product.previewMode === 'iframe' && !iframeLoaded) {
      timeoutRef.current = setTimeout(() => {
        if (!iframeLoaded) {
          setIsIframeBlocked(true);
          handleFallbackRedirect(product.demoUrl, true);
        }
      }, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [product, iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleFallbackRedirect = (url: string, isAutomatic = false) => {
    if (isAutomatic) {
      setShowFallbackMessage(true);
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }, 2000);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    if (timeRemaining === null) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1000) {
          clearInterval(timer);
          navigate('/available-websites');
          return 0;
        }
        return prev ? prev - 1000 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, navigate]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmitting(true);

    try {
      await api.submitBid(product.id, {
        clientName: bidForm.name,
        clientEmail: bidForm.email,
        amount: parseFloat(bidForm.amount),
      });

      setShowSuccess(true);
      setBidForm({ name: '', email: '', amount: '' });
      setTimeout(() => {
        setShowSuccess(false);
        setIsOfferModalOpen(false);
      }, 2500);
    } catch (error) {
      console.error("Acquisition proposal failure", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">Asset Missing</h2>
      <Link to="/available-websites" className="text-primary font-bold uppercase text-xs tracking-widest">Return to Marketplace</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      <div className={`fixed z-[1000] transition-all duration-500 ease-in-out ${showToolbar ? 'top-6 right-6' : 'top-6 -right-12'}`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowToolbar(!showToolbar)} 
            className="bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md shadow-2xl border border-white/10 hover:bg-black transition-all"
          >
            {showToolbar ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          
          {showToolbar && (
            <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-6 shadow-2xl animate-fade-in ring-1 ring-white/5">
              <div className="flex flex-col px-4 py-1">
                <span className="text-[7px] font-black uppercase text-gray-500 tracking-[0.3em]">Buildora Asset</span>
                <span className="text-[11px] font-black text-white uppercase tracking-tighter">{product.name}</span>
              </div>
              
              {timeRemaining !== null && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Clock size={12} className="text-primary" />
                  <span className="text-[10px] font-black text-primary tabular-nums tracking-widest">{formatTime(timeRemaining)}</span>
                </div>
              )}

              <div className="h-4 w-px bg-white/10"></div>
              
              <div className="flex items-center gap-2 pr-1">
                <button 
                  onClick={() => setIsOfferModalOpen(true)}
                  className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-xl hover:bg-primary-hover transition-all active:scale-95"
                >
                  Acquire
                </button>
                <button 
                  onClick={() => handleFallbackRedirect(product.demoUrl)}
                  className="text-gray-500 hover:text-white p-3 transition-colors" 
                  title="Direct Launch"
                >
                  <ExternalLink size={16} />
                </button>
                <Link to="/available-websites" className="text-gray-500 hover:text-white p-3 transition-colors" title="Close Preview">
                  <X size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 w-full bg-white relative overflow-hidden flex flex-col items-center justify-center">
        {showFallbackMessage && (
          <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-8 animate-fade-in">
             <div className="bg-primary/10 p-6 rounded-3xl mb-8 border border-primary/20">
               <Zap size={48} className="text-primary animate-pulse" />
             </div>
             <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Direct Context Active</h3>
             <p className="text-gray-400 text-lg font-medium max-w-md leading-relaxed">
               Opening asset in a native browser context for full performance verification.
             </p>
             <button 
               onClick={() => handleFallbackRedirect(product.demoUrl)}
               className="mt-10 bg-primary text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl"
             >
               Launch Immediately <ExternalLink size={14} />
             </button>
          </div>
        )}

        {isIframeBlocked && !iframeLoaded && !showFallbackMessage && (
          <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-fade-in">
             <ShieldAlert size={56} className="text-orange-500 mb-8" />
             <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">Security Protocol Native</h3>
             <p className="text-gray-400 text-sm font-medium max-w-sm mb-10">
               Protocol restricted by asset security headers. Transitioning to direct verification link.
             </p>
             <button 
               onClick={() => handleFallbackRedirect(product.demoUrl)}
               className="bg-white text-background px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-3"
             >
               Launch Direct Link <ExternalLink size={14} />
             </button>
          </div>
        )}

        {product.previewMode === 'iframe' && (
          <iframe 
            ref={iframeRef}
            src={product.demoUrl} 
            onLoad={handleIframeLoad}
            className={`w-full h-full border-none shadow-inner transition-opacity duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
            title={`Audit: ${product.name}`}
            loading="lazy"
          />
        )}

        {!iframeLoaded && product.previewMode === 'iframe' && !isIframeBlocked && (
           <div className="flex flex-col items-center gap-4 text-gray-500 uppercase font-black text-[9px] tracking-widest">
              <RefreshCw className="animate-spin text-primary" size={24} />
              Synchronizing Asset...
           </div>
        )}
      </div>

      {isOfferModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-background/90 backdrop-blur-md animate-fade-in">
          <div className="bg-background-surface border border-border-light w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative ring-1 ring-white/5">
            <button 
              onClick={() => setIsOfferModalOpen(false)}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>

            {showSuccess ? (
              <div className="p-16 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                  <CheckCircle2 size={40} className="animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">Bid Processed.</h3>
                <p className="text-gray-400 text-lg font-medium">Proposal logged to the corporate ledger.</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="p-12 space-y-8">
                <header className="mb-10 text-center">
                  <p className="text-primary font-black uppercase text-[9px] tracking-[0.5em] mb-3">Asset Acquisition Cycle</p>
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{product.name}</h3>
                </header>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Authorized Officer</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        required
                        type="text" 
                        value={bidForm.name}
                        onChange={(e) => setBidForm({...bidForm, name: e.target.value})}
                        className="w-full bg-background border border-border-light rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold"
                        placeholder="Authorized Identity"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Corporate Channel</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        required
                        type="email" 
                        value={bidForm.email}
                        onChange={(e) => setBidForm({...bidForm, email: e.target.value})}
                        className="w-full bg-background border border-border-light rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold"
                        placeholder="officer@firm.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Acquisition Bid (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        required
                        type="number" 
                        value={bidForm.amount}
                        onChange={(e) => setBidForm({...bidForm, amount: e.target.value})}
                        className="w-full bg-background border border-border-light rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-mono text-xl font-black"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'PROCESSING...' : <>TRANSMIT OFFER <Send size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
