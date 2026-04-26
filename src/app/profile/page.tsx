'use client';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, Package, UserCircle, Settings, LogOut, Bell, Lock, Smartphone } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('user-profile-image');
    if (savedImage) setPreviewImage(savedImage);
  }, []);

  if (!session) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        localStorage.setItem('user-profile-image', base64String);
        // Force refresh of any other components using this image
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const userImage = previewImage || session.user?.image;
  const initial = session.user?.name?.charAt(0) || '?';
  const userRole = (session.user as any).role || 'User';

  return (
    <div className="profile-page-root" style={{ backgroundImage: "url('/images/bg.png')" }}>
      <div className="overlay-premium"></div>
      <Navbar />
      
      <main className="profile-viewport">
        <div className="profile-grid">
          {/* Left Side: Avatar & Basic Info */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="profile-sidebar-glass"
          >
            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar-frame">
                  {userImage ? (
                    <img src={userImage} alt="Profile" className="profile-img-active" />
                  ) : (
                    <div className="avatar-placeholder">{initial}</div>
                  )}
                </div>
                <label htmlFor="avatar-upload" className="upload-trigger">
                  <Smartphone size={18} />
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>
              <h1 className="profile-name">{session.user?.name}</h1>
              <span className="profile-role-tag">{userRole}</span>
            </div>

            <div className="profile-quick-actions">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`action-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                <UserCircle size={22} /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`action-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Settings size={22} /> Settings
              </button>
              <button onClick={() => signOut()} className="action-btn logout">
                <LogOut size={22} /> Sign Out
              </button>
            </div>
          </motion.aside>

          {/* Right Side: Detailed Stats */}
          <div className="profile-main-content">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' ? (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="tab-content"
                >
                  <div className="glass-panel">
                    <h2 className="panel-title"><Shield size={24} /> Identity Verification</h2>
                    <div className="info-list">
                      <div className="info-item">
                        <label>Primary Email</label>
                        <p>{session.user?.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Account Status</label>
                        <p className="status-active">Verified</p>
                      </div>
                      <div className="info-item">
                        <label>Join Date</label>
                        <p>April 26, 2026</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel mt-8">
                    <h2 className="panel-title"><Package size={24} /> Vault Activity</h2>
                    <div className="empty-activity">
                      <Package size={64} className="muted-icon" />
                      <p>Your collection vault is currently empty.</p>
                      <button onClick={() => window.location.href = '/shop'} className="explore-btn">Start Exploring</button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="tab-content"
                >
                  <div className="glass-panel">
                    <h2 className="panel-title"><Settings size={24} /> Account Settings</h2>
                    <div className="settings-stack">
                      <div className="setting-row">
                        <div className="setting-info">
                          <div className="setting-icon"><Bell size={20} /></div>
                          <div>
                            <h3>Notifications</h3>
                            <p>Manage your email and push alerts</p>
                          </div>
                        </div>
                        <button className="toggle-btn active">Enabled</button>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <div className="setting-icon"><Lock size={20} /></div>
                          <div>
                            <h3>Privacy & Security</h3>
                            <p>Update your password and 2FA settings</p>
                          </div>
                        </div>
                        <button className="btn-small">Update</button>
                      </div>

                      <div className="setting-row">
                        <div className="setting-info">
                          <div className="setting-icon"><Smartphone size={20} /></div>
                          <div>
                            <h3>Session Management</h3>
                            <p>View and logout of active devices</p>
                          </div>
                        </div>
                        <button className="btn-small">View Devices</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style jsx>{`
        .profile-page-root {
          min-height: 100vh;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }

        .overlay-premium {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.95));
          z-index: 1;
        }

        .profile-viewport {
          position: relative;
          z-index: 10;
          max-width: 1300px;
          margin: 0 auto;
          padding: 160px 40px 100px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 60px;
        }

        /* SIDEBAR */
        .profile-sidebar-glass {
          background: rgba(10, 10, 15, 0.7);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 50px 40px;
          height: fit-content;
        }

        .avatar-section {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .avatar-container {
          position: relative;
          width: fit-content;
          margin: 0 auto 25px;
        }

        .avatar-frame {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 3px solid var(--accent-primary);
          padding: 8px;
          background: rgba(255, 157, 0, 0.1);
          box-shadow: 0 0 30px rgba(255, 157, 0, 0.15);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-trigger {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 42px;
          height: 42px;
          background: var(--accent-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          cursor: pointer;
          border: 4px solid #0a0a0f;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }
        .upload-trigger:hover { transform: scale(1.1) rotate(15deg); background: #fff; }

        .profile-img-active { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; transition: opacity 0.3s; }
        .avatar-placeholder {
          font-size: 64px;
          font-weight: 900;
          color: var(--accent-primary);
          text-shadow: 0 0 15px rgba(255, 157, 0, 0.5);
        }

        .profile-name { font-size: 32px; font-weight: 900; margin-bottom: 12px; letter-spacing: -1px; }
        .profile-role-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          background: var(--accent-primary);
          color: #000;
          padding: 6px 18px;
          border-radius: 100px;
          letter-spacing: 1px;
        }

        .profile-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 25px;
          background: transparent;
          border: none;
          color: #fff; /* High visibility white */
          font-weight: 700;
          font-size: 16px;
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }
        .action-btn:hover { background: rgba(255,255,255,0.08); color: var(--accent-primary); transform: translateX(5px); }
        .action-btn.active { background: rgba(255,157,0,0.15); color: var(--accent-primary); border: 1px solid rgba(255,157,0,0.2); }
        .action-btn.logout { color: #ff6b6b; }
        .action-btn.logout:hover { background: rgba(255,107,107,0.1); }

        /* MAIN CONTENT */
        .glass-panel {
          background: rgba(10, 10, 15, 0.7);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 50px;
        }

        .panel-title {
          font-size: 24px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 25px;
        }

        .info-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 40px;
        }
        .info-item label {
          display: block;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }
        .info-item p { font-size: 20px; font-weight: 700; color: #fff; }
        .status-active { color: #00ff88 !important; text-shadow: 0 0 20px rgba(0, 255, 136, 0.2); }

        .settings-stack { display: flex; flex-direction: column; gap: 20px; }
        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .setting-info { display: flex; align-items: center; gap: 20px; }
        .setting-icon { 
          width: 44px; height: 44px; 
          background: rgba(255,255,255,0.05); 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: var(--accent-primary);
        }
        .setting-info h3 { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
        .setting-info p { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 600; }

        .toggle-btn {
          padding: 10px 20px; border-radius: 100px; border: none; font-weight: 900; font-size: 12px; cursor: pointer;
        }
        .toggle-btn.active { background: #00ff88; color: #000; }
        .btn-small {
          background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 10px 20px; border-radius: 100px; font-weight: 900; font-size: 12px; cursor: pointer;
        }

        .empty-activity {
          text-align: center;
          padding: 80px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
        .muted-icon { color: rgba(255,255,255,0.05); }
        .empty-activity p { color: rgba(255,255,255,0.4); font-weight: 600; font-size: 18px; }
        .explore-btn {
          background: #fff;
          color: #000;
          border: none;
          padding: 16px 40px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .explore-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,255,255,0.1); }

        .mt-8 { margin-top: 32px; }
      `}</style>
    </div>
  );
}
