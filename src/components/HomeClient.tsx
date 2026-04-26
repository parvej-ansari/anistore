'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Shield, Sparkles, X, ExternalLink, Eye, Search, ShoppingBag, TrendingUp, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';

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

export default function HomeClient({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return (
    <div className="page-bg-wrapper" style={{ backgroundImage: "url('/images/bg.png')" }}>
      <div className="main-content-area">
        <Navbar />

        <main>
          {/* DYNAMIC HERO SECTION (NOT STABLE) */}
          <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 5% 0' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ maxWidth: '1000px', marginTop: '10vh' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,157,0,0.1)', border: '1px solid var(--accent-primary)', padding: '8px 24px', borderRadius: '50px', marginBottom: '30px' }}
              >
                <Sparkles size={16} className="text-gradient-konoha" />
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '2px', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Elite Shippuden Vault</span>
              </motion.div>

              <h1 className="hero-title" style={{ marginBottom: '30px' }}>
                EXPERIENCE THE <br />
                <span className="text-gradient-konoha">SHINOBI WAY.</span>
              </h1>

              <p style={{ maxWidth: '700px', margin: '0 auto 50px', fontSize: '20px', color: '#fff', fontWeight: 500, lineHeight: 1.6 }}>
                Discover master-crafted collectibles and premium apparel curated for the ultimate fan. No more boring gear—only legends.
              </p>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button className="btn-premium" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Vault <ArrowRight size={20} />
                </button>
                <button className="btn-secondary" onClick={() => window.location.href = '/shop'}>
                  View All Gear
                </button>
              </div>
            </motion.div>
          </section>

          {/* RESTORED FEATURES SECTION (PROFESSIONAL STATS) */}
          <section style={{ padding: '300px 5% 80px', marginTop: '100px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {[
                { icon: <TrendingUp size={30} />, title: "Trend Analytics", desc: "Real-time verified anime trends." },
                { icon: <Shield size={30} />, title: "Authentic Guard", desc: "100% verified merchant platforms." },
                { icon: <Zap size={30} />, title: "Ninja Speed", desc: "Instant redirect to trusted stores." },
                { icon: <CheckCircle size={30} />, title: "Premium Quality", desc: "Handpicked masterpieces only." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel"
                  style={{ padding: '40px', textAlign: 'left' }}
                >
                  <div style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: 800 }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* TRENDING COLLECTION */}
          <section id="collection" style={{ padding: '300px 5% 100px' }}>
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, textTransform: 'uppercase' }}>
                TOP <span className="text-gradient-konoha">PICKS.</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} onView={() => setSelectedProduct(product)} />
              ))}
            </div>
          </section>
        </main>

        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            >
              <motion.div
                className="glass-panel"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', position: 'relative' }}
              >
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
                  <h2 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: 900 }}>{selectedProduct.name}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '18px' }}>{selectedProduct.description}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', marginBottom: '40px' }}>
                    <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>₹{selectedProduct.price}</div>
                    {selectedProduct.originalPrice && (
                      <div style={{ fontSize: '20px', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '5px' }}>₹{selectedProduct.originalPrice}</div>
                    )}
                  </div>
                  <button className="btn-premium" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.open(selectedProduct.affiliateLink, '_blank')}>
                    Buy on {selectedProduct.platform}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
