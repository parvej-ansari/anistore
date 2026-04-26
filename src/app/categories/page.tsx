'use client';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { LayoutGrid, ShoppingBag, Zap, Heart, Sparkles, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  affiliateLink: string;
  platform: string;
  category: string;
}

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.log("Using local data");
      }
    };
    fetchProducts();
  }, []);
  
  const categories = [
    { id: 'Figures', icon: <Zap size={40} />, count: products.filter(p => p.category === 'Figures').length, img: 'https://images.unsplash.com/photo-1578632738908-4844da3e7fbc?auto=format&fit=crop&q=80&w=800' },
    { id: 'Clothing', icon: <ShoppingBag size={40} />, count: products.filter(p => p.category === 'Clothing').length, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800' },
    { id: 'Watches', icon: <Zap size={40} />, count: products.filter(p => p.category === 'Watches').length, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
    { id: 'Shoes', icon: <ShoppingBag size={40} />, count: products.filter(p => p.category === 'Shoes').length, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { id: 'Posters', icon: <LayoutGrid size={40} />, count: products.filter(p => p.category === 'Posters').length, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
    { id: 'Collectibles', icon: <Heart size={40} />, count: products.filter(p => p.category === 'Collectibles').length, img: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="page-bg-wrapper" style={{ backgroundImage: "url('/images/about_new.png')" }}>
      <div className="main-content-area">
        <Navbar />
        
        <main style={{ paddingTop: '140px', paddingBottom: '100px', width: '95%', maxWidth: '1400px', margin: '0 auto' }}>
          
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              /* CATEGORY SELECTION VIEW */
              <motion.div 
                key="grid"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                style={{ textAlign: 'center' }}
              >
                <header style={{ marginBottom: '60px' }}>
                  <h1 className="hero-title">SELECT <span className="text-gradient-konoha">COLLECTION.</span></h1>
                  <p style={{ color: 'var(--text-muted)', marginTop: '20px', fontSize: '18px' }}>Choose a universe to explore verified anime masterpieces.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                  {categories.map(cat => (
                    <motion.div 
                      key={cat.id}
                      whileHover={{ y: -10 }}
                      className="glass-panel"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{ cursor: 'pointer', overflow: 'hidden', height: '400px', position: 'relative' }}
                    >
                      <img src={cat.img} alt={cat.id} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>{cat.icon}</div>
                        <h2 style={{ fontSize: '32px', fontWeight: 900 }}>{cat.id}</h2>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: 800, marginTop: '10px' }}>{cat.count} ITEMS</p>
                        <button className="btn-premium" style={{ marginTop: '30px', minWidth: '140px' }}>VIEW ALL</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* PRODUCT DISPLAY VIEW */
              <motion.div 
                key="products"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <header style={{ marginBottom: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}
                    >
                      <ArrowLeft size={18} /> BACK TO COLLECTIONS
                    </button>
                    <h1 className="hero-title">{selectedCategory.toUpperCase()} <span className="text-gradient-konoha">VAULT.</span></h1>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 600 }}>Showing {filteredProducts.length} verified items</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onView={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* MODAL (Same as Home) */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div className="glass-panel" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', position: 'relative' }}>
                <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px', borderRadius: '50%' }}><X size={24} /></button>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', borderRadius: '15px' }} />
                <div>
                  <h2 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: 900 }}>{selectedProduct.name}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>{selectedProduct.description}</p>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '40px' }}>₹{selectedProduct.price}</div>
                  <button className="btn-premium" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.open(selectedProduct.affiliateLink, '_blank')}>Buy on {selectedProduct.platform}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
