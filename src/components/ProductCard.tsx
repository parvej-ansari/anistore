'use client';
import { Eye, ExternalLink, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductProps {
  product: {
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
  };
  onView?: () => void;
  transparent?: boolean; // new prop to control background transparency
};

export default function ProductCard({ product, onView, transparent }: ProductProps) {
  return (
    <motion.div 
      className="glass-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      style={{ 
        padding: '0', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
        background: transparent ? 'rgba(255,255,255,0.05)' : undefined
      }}
    >
      {/* Product Image with fixed aspect ratio */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : product.image} 
          alt={product.name} 
          style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            objectFit: 'contain', padding: '10px', background: '#000',
            transition: 'transform 0.5s ease' 
          }} 
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        
        {/* Platform Badge */}
        <div style={{
          position: 'absolute', top: '15px', left: '15px',
          padding: '6px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 900,
          background: product.platform === 'Amazon' ? '#FF9900' : 
                     product.platform === 'Flipkart' ? '#2874f0' : '#ff007a',
          color: '#fff', textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          {product.platform}
        </div>
      </div>

      {/* Info Section */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            {product.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>₹{product.price}</div>
            {product.originalPrice && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice}</div>
            )}
          </div>
        </div>

        <h3 style={{ 
          fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '15px', 
          lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
          overflow: 'hidden', minHeight: '48px'
        }}>
          {product.name}
        </h3>

        {/* Professional Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button 
            onClick={onView}
            style={{ 
              flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            <Eye size={14} /> VIEW DETAILS
          </button>
          
          <button 
            onClick={() => window.open(product.affiliateLink, '_blank')}
            style={{ 
              padding: '12px', background: 'var(--accent-primary)', border: 'none', 
              color: '#000', borderRadius: '8px', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', transition: '0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
