'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/auth/signin?success=1');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <Navbar />
      
      <main className="auth-container">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="auth-image-side"
          style={{ backgroundImage: 'url("/anime_login_bg_1777146997973.png")' }}
        >
          <div className="image-overlay">
            <div>
              <h2 className="text-5xl font-black mb-4">JOIN THE <span className="text-accent-primary">CLAN</span></h2>
              <p className="text-lg text-text-muted">Create your account and unlock exclusive rewards.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="auth-form-side"
        >
          <div className="form-content">
            <div className="mb-10">
              <h1 className="text-4xl font-black mb-2">Create <span className="text-gradient">Account</span></h1>
              <p className="text-text-muted">Become a member of the AniStore elite.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="input-label">Username</label>
                <div className="input-field">
                  <User className="icon" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="AnimeLover99"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="input-label">Email Address</label>
                <div className="input-field">
                  <Mail className="icon" size={18} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="kakashi@konoha.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="input-label">Password</label>
                <div className="input-field">
                  <Lock className="icon" size={18} />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="error-msg">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="signup-btn"
              >
                {loading ? 'Creating Account...' : 'Register as Shinobi'} <ShieldCheck size={18} />
              </button>

              <div className="mt-8 text-center">
                <Link href="/auth/signin" className="text-sm text-text-muted hover:text-accent-primary transition-colors flex items-center justify-center gap-2">
                  Already have an account? Sign In <ArrowRight size={16} />
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      <style jsx>{`
        .signup-wrapper {
          min-height: 100vh;
          background: #050505;
          display: flex;
          flex-direction: column;
        }
        .auth-container {
          flex: 1;
          display: flex;
          overflow: hidden;
          flex-direction: row-reverse;
        }
        .auth-image-side {
          flex: 1.2;
          background-size: cover;
          background-position: center;
          position: relative;
          display: none;
        }
        @media (min-width: 1024px) { .auth-image-side { display: block; } }
        
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to left, rgba(5,5,5,0.8), transparent);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 10%;
          text-align: right;
        }
        .auth-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #050505;
        }
        .form-content {
          width: 100%;
          max-width: 450px;
        }

        .input-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-left: 5px;
        }
        .input-field {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-field .icon {
          position: absolute;
          left: 18px;
          color: var(--text-muted);
        }
        .input-field input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px 16px 16px 50px;
          border-radius: 15px;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .input-field input:focus {
          border-color: var(--accent-primary);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 20px rgba(255,157,0,0.1);
        }
        .signup-btn {
          width: 100%;
          padding: 18px;
          background: white;
          color: black;
          border: none;
          border-radius: 15px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 20px;
        }
        .signup-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,255,255,0.1); }
        
        .error-msg {
          color: #ff4444;
          font-size: 13px;
          text-align: center;
          background: rgba(255,68,68,0.1);
          padding: 10px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
