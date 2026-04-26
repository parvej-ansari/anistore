'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  Plus, Trash, Edit, LayoutDashboard, 
  Package, Users, ShieldCheck, AlertCircle,
  TrendingUp, Layers, MousePointer2, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    image: '',
    affiliateLink: '',
    platform: 'Amazon',
    category: 'Figures'
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProducts();
      if ((session.user as any).role === 'superadmin') fetchUsers();
    }
  }, [session]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ text: formData.id ? 'Product Updated' : 'Product Published', type: 'success' });
        setFormData({ id: '', name: '', description: '', price: '', image: '', affiliateLink: '', platform: 'Amazon', category: 'Figures' });
        fetchProducts();
        setActiveTab('inventory');
      } else {
        setMessage({ text: 'Error processing request', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network connection failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Permanent delete? This cannot be undone.')) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProducts();
      setMessage({ text: 'Item removed from database', type: 'success' });
    }
  };

  if (status === 'loading') return <div className="loading-state">Syncing secure data...</div>;

  const isSuperAdmin = (session?.user as any)?.role === 'superadmin';

  return (
    <div className="admin-portal">
      <Navbar />
      
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <ShieldCheck size={20} className="text-accent-primary" />
            <span>Admin Console</span>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} /> <span>Inventory</span>
            </button>
            {isSuperAdmin && (
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={18} /> <span>User Control</span>
              </button>
            )}
            <button 
              className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('add');
                setFormData({ id: '', name: '', description: '', price: '', image: '', affiliateLink: '', platform: 'Amazon', category: 'Figures' });
              }}
            >
              <Plus size={18} /> <span>Add New Item</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-pill">
              <div className="status-dot"></div>
              <span className="truncate">{session?.user?.email}</span>
            </div>
          </div>
        </aside>

        {/* Main View */}
        <main className="main-viewport">
          <header className="viewport-header">
            <div className="breadcrumb">
              <span className="muted">Dashboard</span> / <span className="current">{activeTab}</span>
            </div>
            <h1 className="viewport-title">
              {activeTab === 'inventory' && 'Store Inventory'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'add' && (formData.id ? 'Modify Product' : 'New Merchandise')}
            </h1>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="content-grid"
              >
                {/* Quick Stats */}
                <div className="stats-row">
                  <div className="stat-card">
                    <Layers size={20} className="icon" />
                    <div>
                      <p className="stat-label">Total Products</p>
                      <p className="stat-value">{products.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <TrendingUp size={20} className="icon" />
                    <div>
                      <p className="stat-label">Active Listings</p>
                      <p className="stat-value">{products.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <MousePointer2 size={20} className="icon" />
                    <div>
                      <p className="stat-label">Total Reach</p>
                      <p className="stat-value">High</p>
                    </div>
                  </div>
                </div>

                <div className="product-admin-grid">
                  {products.map((p) => (
                    <motion.div 
                      layout
                      key={p._id} 
                      className="admin-product-card"
                    >
                      <div className="card-media">
                        <img src={p.image} alt={p.name} />
                        <div className="media-overlay">
                          <button 
                            onClick={() => {
                              setFormData({ ...p, id: p._id, price: p.price.toString() });
                              setActiveTab('add');
                            }}
                            className="action-pill edit"
                          ><Edit size={14} /></button>
                          <button 
                            onClick={() => deleteProduct(p._id)}
                            className="action-pill delete"
                          ><Trash size={14} /></button>
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="info-top">
                          <span className="platform-tag">{p.platform}</span>
                          <span className="price-tag">₹{p.price}</span>
                        </div>
                        <h3 className="product-name-admin">{p.name}</h3>
                        <div className="info-footer">
                          <span className="category-label">{p.category}</span>
                          <a href={p.affiliateLink} target="_blank" className="link-preview">
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && isSuperAdmin && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="user-table-wrapper"
              >
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Identity</th>
                      <th>Email</th>
                      <th>Access Level</th>
                      <th>Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="font-bold">{u.name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                        <td>
                          <select 
                            value={u.role}
                            onChange={async (e) => {
                              const res = await fetch('/api/admin/users', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: u._id, role: e.target.value })
                              });
                              if (res.ok) fetchUsers();
                            }}
                            className="role-selector"
                            disabled={u.email === session?.user?.email}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">SuperAdmin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'add' && (
              <motion.div 
                key="add"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="form-viewport"
              >
                <form onSubmit={handleSubmit} className="premium-form-layout">
                  <div className="form-section">
                    <h2 className="section-title">Visuals & Branding</h2>
                    <div className="image-preview-box">
                      {formData.image ? <img src={formData.image} alt="Preview" /> : <div className="no-image"><Plus /></div>}
                    </div>
                    <div className="input-group">
                      <label>Image Source URL</label>
                      <input 
                        type="url" 
                        value={formData.image} 
                        onChange={(e) => setFormData({...formData, image: e.target.value})} 
                        placeholder="https://example.com/anime.jpg"
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h2 className="section-title">Product Details</h2>
                    <div className="input-row">
                      <div className="input-group">
                        <label>Display Name</label>
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          placeholder="e.g. Naruto Sage Mode Figure"
                          required 
                        />
                      </div>
                      <div className="input-group">
                        <label>Price (INR)</label>
                        <input 
                          type="number" 
                          value={formData.price} 
                          onChange={(e) => setFormData({...formData, price: e.target.value})} 
                          placeholder="0.00"
                          required 
                        />
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="input-group">
                        <label>E-commerce Platform</label>
                        <select 
                          value={formData.platform} 
                          onChange={(e) => setFormData({...formData, platform: e.target.value})}
                        >
                          <option value="Amazon">Amazon</option>
                          <option value="Flipkart">Flipkart</option>
                          <option value="Meesho">Meesho</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Global Category</label>
                        <select 
                          value={formData.category} 
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="Watches">Watches</option>
                          <option value="Figures">Figures</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Shoes">Shoes</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Affiliate Redirect URL</label>
                      <input 
                        type="url" 
                        value={formData.affiliateLink} 
                        onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})} 
                        placeholder="https://amzn.to/..."
                        required 
                      />
                    </div>

                    <div className="input-group">
                      <label>Marketing Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        rows={5}
                        placeholder="Tell a story about this product..."
                        required 
                      ></textarea>
                    </div>

                    <button className="submit-btn-admin" type="submit" disabled={loading}>
                      {loading ? 'Processing...' : (formData.id ? 'Save Changes' : 'Launch Listing')}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`admin-toast ${message.type}`}
          >
            {message.type === 'success' ? <ShieldCheck /> : <AlertCircle />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .admin-portal {
          min-height: 100vh;
          background: #020203;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }

        .dashboard-layout {
          display: flex;
          padding-top: 80px;
          min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
          width: 280px;
          background: #08080a;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 80px;
          bottom: 0;
          z-index: 100;
        }
        .sidebar-brand {
          padding: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .sidebar-nav {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 20px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          font-weight: 700;
          font-size: 15px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }
        .nav-link:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .nav-link.active { background: rgba(255,157,0,0.1); color: var(--accent-primary); }
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.03);
        }
        .user-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .status-dot { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 10px #00ff88; }

        /* VIEWPORT */
        .main-viewport {
          flex: 1;
          margin-left: 280px;
          padding: 40px 60px;
        }
        .viewport-header {
          margin-bottom: 40px;
        }
        .breadcrumb { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .breadcrumb .muted { color: rgba(255,255,255,0.2); }
        .breadcrumb .current { color: var(--accent-primary); }
        .viewport-title { font-size: 42px; font-weight: 900; letter-spacing: -1px; }

        /* STATS */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: #0d0d12;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 25px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .stat-card .icon { color: var(--accent-primary); background: rgba(255,157,0,0.1); padding: 12px; border-radius: 15px; }
        .stat-label { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .stat-value { font-size: 28px; font-weight: 900; }

        /* PRODUCT GRID */
        .product-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }
        .admin-product-card {
          background: #0d0d12;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .admin-product-card:hover { transform: translateY(-5px); border-color: rgba(255,157,0,0.3); }
        
        .card-media {
          height: 180px;
          position: relative;
          background: #000;
          overflow: hidden;
        }
        .card-media img { width: 100%; height: 100%; object-fit: contain; padding: 10px; transition: transform 0.5s; }
        .admin-product-card:hover img { transform: scale(1.1); }
        
        .media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          opacity: 0;
          transition: all 0.3s;
        }
        .admin-product-card:hover .media-overlay { opacity: 1; }
        
        .action-pill {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-pill.edit { background: #fff; color: #000; }
        .action-pill.delete { background: #ff4444; color: #fff; }
        .action-pill:hover { transform: scale(1.1); }

        .card-info { padding: 20px; }
        .info-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .platform-tag { font-size: 10px; font-weight: 900; text-transform: uppercase; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; }
        .price-tag { font-weight: 900; color: var(--accent-primary); }
        .product-name-admin { font-size: 16px; font-weight: 800; line-height: 1.4; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 44px; }
        .info-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.03); pt: 15px; }
        .category-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.3); }
        .link-preview { color: rgba(255,255,255,0.2); transition: color 0.3s; }
        .link-preview:hover { color: var(--accent-primary); }

        /* USER TABLE */
        .user-table-wrapper { background: #0d0d12; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; overflow: hidden; }
        .modern-table { width: 100%; border-collapse: collapse; }
        .modern-table th { background: rgba(255,255,255,0.02); padding: 20px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.3); }
        .modern-table td { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 14px; }
        .role-badge { padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .role-badge.superadmin { background: #ff9d00; color: #000; }
        .role-badge.admin { background: #00d4ff; color: #000; }
        .role-badge.user { background: rgba(255,255,255,0.05); color: #fff; }
        .role-selector { background: #1a1a22; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 8px; outline: none; font-size: 12px; }

        /* FORMS */
        .form-viewport { max-width: 1000px; }
        .premium-form-layout { display: grid; grid-template-columns: 350px 1fr; gap: 40px; }
        .section-title { font-size: 18px; font-weight: 900; margin-bottom: 25px; border-left: 4px solid var(--accent-primary); padding-left: 15px; }
        .image-preview-box { width: 100%; aspect-ratio: 1; background: #0d0d12; border: 2px dashed rgba(255,255,255,0.05); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; overflow: hidden; }
        .image-preview-box img { width: 100%; height: 100%; object-fit: contain; padding: 20px; }
        .no-image { color: rgba(255,255,255,0.1); }
        
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .input-group label { font-size: 12px; font-weight: 800; text-transform: uppercase; color: rgba(255,255,255,0.3); letter-spacing: 1px; }
        .input-group input, .input-group select, .input-group textarea { background: #0d0d12; border: 1px solid rgba(255,255,255,0.08); padding: 15px 20px; border-radius: 14px; color: #fff; outline: none; font-size: 15px; transition: all 0.3s; }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: var(--accent-primary); background: rgba(255,255,255,0.03); }
        
        .submit-btn-admin { width: 100%; padding: 18px; background: linear-gradient(135deg, #ff9d00, #ff4500); color: #000; border: none; border-radius: 16px; font-weight: 900; font-size: 16px; cursor: pointer; transition: all 0.3s; margin-top: 20px; }
        .submit-btn-admin:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(255,157,0,0.3); }

        .admin-toast { position: fixed; bottom: 40px; right: 40px; background: #fff; color: #000; padding: 16px 30px; border-radius: 16px; display: flex; align-items: center; gap: 12px; font-weight: 800; z-index: 9999; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .admin-toast.success { border-left: 6px solid #00ff88; }
        .admin-toast.error { border-left: 6px solid #ff4444; }

        .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; background: #020203; }
      `}</style>
    </div>
  );
}
