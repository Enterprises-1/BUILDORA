
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, DollarSign, ExternalLink, ArrowUpRight, 
  CheckCircle2, X, Send, User, Mail, Sparkles, Search, Layout, TrendingUp
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';

const AvailableWebsites: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bidForm, setBidForm] = useState({ name: '', email: '', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWebsites = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
    window.addEventListener('storage', fetchWebsites);
    return () => window.removeEventListener('storage', fetchWebsites);
  }, []);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const amount = parseFloat(bidForm.amount);
    if (amount < selectedProduct.basePrice) {
      alert(`Minimum bid for this asset is $${selectedProduct.basePrice.toLocaleString()}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitBid(selectedProduct.id, {
        clientName: bidForm.name,
        clientEmail: bidForm.email,
        amount: amount,
      });

      setShowSuccess(true);
      setBidForm({ name: '', email: '', amount: '' });
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedProduct(null);
        fetchWebsites(); // Refresh local list
      }, 2500);
    } catch (error) {
      console.error("Bid error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.status === 'available' && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary mb-8 uppercase tracking-[0.3em] shadow-xl shadow-primary/5">
              <Sparkles size={12} /> Global Inventory
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase">
              Digital <span className="text-primary italic">Acquisitions.</span>
            </h1>
            <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl">
              Secure high-performance engineering builds ready for immediate corporate deployment. Verifiable results, enterprise-grade architecture.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter nodes by identity or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-surface border border-border-light rounded-[1.5rem] pl-14 pr-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold shadow-2xl"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((p) => {
              const activeBids = p.bids?.filter(b => b.status === 'pending').length || 0;
              const highestBid = Math.max(p.basePrice, ...(p.bids?.map(b => b.amount) || []));
              
              return (
                <div key={p.id} className="bg-background-surface border border-border-light rounded-[3rem] overflow-hidden group hover:border-primary/40 transition-all flex flex-col shadow-2xl relative">
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                       <div className="bg-green-500 text-white text-[8px] font-black px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 uppercase tracking-widest border border-white/10 backdrop-blur-md">
                         <Globe size={10} className="animate-pulse" /> Live Deployment
                       </div>
                       {activeBids > 0 && (
                         <div className="bg-primary text-white text-[8px] font-black px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 uppercase tracking-widest border border-white/10 backdrop-blur-md">
                           <TrendingUp size={10} /> {activeBids} Active Bids
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="mb-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{p.name}</h3>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Floor Price</p>
                          <p className="text-lg font-black text-primary">${highestBid.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.features.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-[8px] font-black text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">{f}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <Link 
                        to={`/preview/${p.id}`}
                        className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl border border-border-light transition-all text-[10px] uppercase tracking-widest"
                      >
                        Audit <ArrowUpRight size={14} />
                      </Link>
                      <button 
                        onClick={() => setSelectedProduct(p)}
                        className="bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-2xl transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95"
                      >
                        Acquire
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="py-60 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
            <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
               <Layout className="text-gray-700" size={40} />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Zero Node Matches</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">Infrastructure inventory is dynamic. Check back for fresh engineering deployments.</p>
          </div>
        )}
      </div>

      {/* Acquisition Intelligence Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-background-surface border border-border-light w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative ring-1 ring-white/10">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>

            {showSuccess ? (
              <div className="p-20 text-center space-y-8">
                <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/20">
                  <CheckCircle2 size={48} className="animate-pulse" />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight uppercase">Bid Recorded.</h3>
                <p className="text-gray-400 text-lg font-medium leading-relaxed">Our acquisition desk will verify firm credentials and transmit the result within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="p-14 space-y-10">
                <header className="mb-12 text-center">
                  <p className="text-primary font-black uppercase text-[10px] tracking-[0.6em] mb-4">Official Asset Acquisition</p>
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{selectedProduct.name}</h3>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Minimum Threshold: ${selectedProduct.basePrice.toLocaleString()}</p>
                </header>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-3">Acquisition Officer</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        required
                        type="text" 
                        value={bidForm.name}
                        onChange={(e) => setBidForm({...bidForm, name: e.target.value})}
                        className="w-full bg-background border border-border-light rounded-[1.5rem] pl-16 pr-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold shadow-inner"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-3">Firm Channel</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        required
                        type="email" 
                        value={bidForm.email}
                        onChange={(e) => setBidForm({...bidForm, email: e.target.value})}
                        className="w-full bg-background border border-border-light rounded-[1.5rem] pl-16 pr-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold shadow-inner"
                        placeholder="officer@firm.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-3">Acquisition Offer (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input 
                        required
                        type="number" 
                        min={selectedProduct.basePrice}
                        value={bidForm.amount}
                        onChange={(e) => setBidForm({...bidForm, amount: e.target.value})}
                        className="w-full bg-background border border-border-light rounded-[1.5rem] pl-16 pr-6 py-6 text-white focus:outline-none focus:border-primary transition-all font-mono text-2xl font-black shadow-inner"
                        placeholder={selectedProduct.basePrice.toString()}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'PROCESSING LEDGER...' : <>TRANSMIT OFFER <Send size={20} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableWebsites;
