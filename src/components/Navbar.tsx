'use client';
import Link from 'next/link';
import { User as UserIcon, Search, Command, LogOut, Shield, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('user-profile-image');
    if (savedImage) setLocalImage(savedImage);
  }, []);

  const userRole = (session?.user as any)?.role || 'User';
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const displayImage = localImage || session?.user?.image;

  return (
    <motion.nav 
      initial={{ y: -100, x: '-50%' }}
      animate={{ y: 0, x: '-50%' }}
      className="navbar"
    >
      <div className="nav-section left">
        <Link href="/" className="brand-logo">
          <Command className="logo-icon-primary" size={20} />
          <span className="logo-text">
            <span className="ani-part">ANI</span>
            <span className="text-gradient-konoha">STORE</span>
          </span>
        </Link>
      </div>
      
      <div className="nav-section center">
        <div className="nav-links-container">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
        </div>
      </div>

      <div className="nav-section right">
        <div className="nav-actions">
          <div className="search-pill">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              onClick={() => window.location.href = '/shop'}
            />
          </div>
          
          <div className="profile-container">
            <button 
              onClick={() => session ? setShowDropdown(!showDropdown) : window.location.href = '/auth/signin'}
              className="profile-trigger"
            >
              {displayImage ? (
                <img src={displayImage} alt="Profile" className="avatar-img" />
              ) : (
                <UserIcon size={18} />
              )}
            </button>

            <AnimatePresence>
              {showDropdown && session && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="nav-dropdown-premium"
                >
                  <div className="dropdown-header">
                    <div className="user-details">
                      <p className="user-name">{session.user?.name}</p>
                      <p className="user-email">{session.user?.email}</p>
                    </div>
                    <span className="role-badge-small">{userRole}</span>
                  </div>
                  
                  <div className="dropdown-menu">
                    <Link href="/profile" className="menu-item" onClick={() => setShowDropdown(false)}>
                      <UserCircle size={22} className="item-icon" /> 
                      <div className="item-text">
                        <span className="item-label">Profile Settings</span>
                        <span className="item-subtext">Manage your account</span>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link href="/admin" className="menu-item admin-highlight" onClick={() => setShowDropdown(false)}>
                        <Shield size={22} className="item-icon" /> 
                        <div className="item-text">
                          <span className="item-label">Admin Console</span>
                          <span className="item-subtext">Control center</span>
                        </div>
                      </Link>
                    )}

                    <div className="menu-divider-thin" />
                    
                    <button onClick={() => signOut()} className="menu-item logout-btn">
                      <LogOut size={22} className="item-icon" /> 
                      <div className="item-text">
                        <span className="item-label">Sign Out</span>
                        <span className="item-subtext">See you soon!</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
        }

        .nav-section { display: flex; align-items: center; }
        .nav-section.left { flex: 1; justify-content: flex-start; }
        .nav-section.center { flex: 2; justify-content: center; }
        .nav-section.right { flex: 1; justify-content: flex-end; }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
        }

        .logo-icon-primary { color: #fff; }

        .logo-text {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          line-height: 1;
        }
        .ani-part { color: #fff; }

        .nav-links-container {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        .nav-links-container a {
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s;
          letter-spacing: 1px;
        }
        .nav-links-container a:hover { color: var(--accent-primary); }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .search-pill {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-pill input {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 10px 15px 10px 42px;
          border-radius: 100px;
          color: #fff;
          font-size: 14px;
          outline: none;
          width: 180px;
          transition: all 0.3s;
        }
        .search-pill input::placeholder { color: rgba(255,255,255,0.3); }
        .search-pill input:focus { width: 220px; border-color: var(--accent-primary); background: rgba(255,255,255,0.12); }
        .search-icon { position: absolute; left: 16px; color: var(--accent-primary); }

        .search-pill {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 20px;
        }
        .search-pill input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 15px 8px 38px;
          border-radius: 100px;
          color: #fff;
          font-size: 13px;
          outline: none;
          width: 140px;
          transition: all 0.3s;
        }
        .search-pill input:focus { width: 180px; border-color: var(--accent-primary); }
        .search-icon { position: absolute; left: 14px; color: rgba(255,255,255,0.4); }

        .profile-container { position: relative; }
        .profile-trigger {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
          overflow: hidden;
        }
        .profile-trigger:hover { border-color: var(--accent-primary); background: rgba(255,255,255,0.1); transform: scale(1.05); }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }

        .nav-dropdown-premium {
          position: absolute;
          top: calc(100% + 25px); /* Moved down from 15px */
          right: 0px;
          width: 320px;
          background: #0a0a0f;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.95);
          overflow: hidden;
          z-index: 5000;
        }

        .dropdown-header {
          padding: 30px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .user-name { font-weight: 900; font-size: 20px; margin: 0; color: #fff; line-height: 1.2; }
        .user-email { font-size: 14px; color: rgba(255, 255, 255, 0.5); margin: 4px 0 0; }
        .role-badge-small {
          align-self: flex-start;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          background: var(--accent-primary);
          color: #000;
          padding: 4px 14px;
          border-radius: 100px;
          letter-spacing: 1.5px;
        }

        .dropdown-menu { padding: 15px; display: flex; flex-direction: column; gap: 8px; }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 20px;
          color: #fff; /* Explicitly white for better visibility */
          text-decoration: none;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .menu-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--accent-primary); }
        .item-icon { color: rgba(255, 255, 255, 0.4); transition: color 0.3s; }
        .menu-item:hover .item-icon { color: var(--accent-primary); transform: scale(1.1); }
        
        .item-text { display: flex; flex-direction: column; }
        .item-label { font-size: 16px; font-weight: 800; color: inherit; }
        .item-subtext { font-size: 14px; color: rgba(255, 255, 255, 0.35); font-weight: 600; margin-top: 4px; }

        .admin-highlight:hover { background: rgba(255, 157, 0, 0.1); }
        
        .logout-btn {
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .logout-btn:hover { background: rgba(255, 68, 68, 0.08); }
        .logout-btn:hover .item-label { color: #ff4444; }
        .logout-btn:hover .item-icon { color: #ff4444; }

        .menu-divider-thin { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 10px 20px; }
      `}</style>
    </motion.nav>
  );
}
