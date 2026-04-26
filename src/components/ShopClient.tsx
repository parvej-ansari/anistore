'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, Info, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  affiliateLink: string;
  platform: string;
  category: string;
}

export default function ShopClient({ products: initialProducts }: { products: Product[] }) {
  const [products] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('none');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      (category === 'All' || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'lowToHigh') result.sort((a, b) => a.price - b.price);
    if (sort === 'highToLow') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, search, category, sort]);

  return (
    /* REVERTED TO FIXED BACKGROUND FOR PARALLAX FEEL + HD ONE PIECE IMAGE */
    <div className="page-bg-wrapper" style={{ 
      backgroundImage: "url('https://th.wallhaven.cc/lg/72/72pwy9.jpg')"
    }}>
      <div className="main-content-area">
        <Navbar />
        
        <main style={{ paddingTop: '150px', paddingBottom: '100px', width: '98%', maxWidth: '1800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '60px', textAlign: 'center' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-title" 
              style={{ fontSize: '70px' }}
            >
              GRAND <span className="text-gradient-konoha">LINE.</span>
            </motion.h1>
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Exploring {products.length} treasures from across the seas.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }} className="shop-main-grid">
            <aside>
              <div className="glass-panel" style={{ padding: '30px', position: 'sticky', top: '120px' }}>
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Search</h3>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Find gear..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px 12px 12px 45px', borderRadius: '10px', color: '#fff', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Category</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setCategory(cat)} style={{ textAlign: 'left', background: 'none', border: 'none', color: category === cat ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', fontWeight: category === cat ? 800 : 500 }}>{cat}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Sort By</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => setSort('lowToHigh')} style={{ textAlign: 'left', background: 'none', border: 'none', color: sort === 'lowToHigh' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}>Price: Low to High</button>
                    <button onClick={() => setSort('highToLow')} style={{ textAlign: 'left', background: 'none', border: 'none', color: sort === 'highToLow' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}>Price: High to Low</button>
                  </div>
                </div>
              </div>
            </aside>

            {/* PRODUCT GRID - FIXED 4 CARDS IN A ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onView={() => setSelectedProduct(product)} />
              ))}
            </div>
          </div>
        </main>

        <AnimatePresence>
          {selectedProduct && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div className="glass-panel" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', position: 'relative' }}>
                <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px', borderRadius: '50%' }}><X size={24} /></button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${selectedProduct.name} - View ${idx + 1}`} style={{ width: '100%', borderRadius: '15px' }} />
                    ))
                  ) : (
                    <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', borderRadius: '15px' }} />
                  )}
                </div>
                <div>
                  <span className="text-gradient-konoha" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>{selectedProduct.category}</span>
                  <h2 style={{ fontSize: '36px', margin: '15px 0', fontWeight: 900 }}>{selectedProduct.name}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>{selectedProduct.description}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>₹{selectedProduct.price}</div>
                    {selectedProduct.originalPrice && (
                      <div style={{ fontSize: '20px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '5px' }}>₹{selectedProduct.originalPrice}</div>
                    )}
                  </div>
                  <button className="btn-premium" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.open(selectedProduct.affiliateLink, '_blank')}>Order from {selectedProduct.platform}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
