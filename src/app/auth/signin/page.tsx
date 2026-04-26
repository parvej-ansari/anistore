'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Check your access code.');
        setLoading(false);
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="signin-page-root" style={{ backgroundImage: "url('/images/signin_new.png')" }}>
      <div className="overlay"></div>
      <Navbar />
      
      <main className="auth-centered-main">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="auth-card-premium"
        >
          <div className="card-header">
            <h1 className="title">Welcome <span className="text-gradient-konoha">Back</span></h1>
            <p className="subtitle">Sign in to access your elite collection.</p>
          </div>

          <div className="auth-methods">
            <button 
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="google-btn-modern"
            >
              <Globe size={18} /> Continue with Google
            </button>

            <div className="divider-minimalist">
              <span>OR USE EMAIL</span>
            </div>

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="input-field-wrapper">
                <div className="input-inner">
                  <Mail size={18} className="field-icon" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    maxLength={255}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-field-wrapper">
                <div className="input-inner">
                  <Lock size={18} className="field-icon" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    maxLength={255}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="error-message-box"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn-premium"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="footer-links">
              <Link href="/auth/signup" className="signup-link">
                New to AniStore? <span className="accent">Create Account</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <style jsx>{`
        .signin-page-root {
          min-height: 100vh;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.9));
          z-index: 1;
        }

        .auth-centered-main {
          flex: 1;
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }

        .auth-card-premium {
          width: 100%;
          max-width: 520px;
          background: rgba(10, 10, 15, 0.7);
          backdrop-filter: blur(25px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 60px 50px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        .card-header {
          text-align: center;
          margin-bottom: 45px;
        }
        .title {
          font-size: 42px;
          font-weight: 900;
          letter-spacing: -2px;
          margin-bottom: 10px;
        }
        .subtitle {
          color: rgba(255,255,255,0.5);
          font-size: 16px;
          font-weight: 500;
        }

        .google-btn-modern {
          width: 100%;
          height: 62px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-bottom: 35px;
        }
        .google-btn-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255,255,255,0.2);
        }

        .divider-minimalist {
          margin: 35px 0;
          position: relative;
          text-align: center;
        }
        .divider-minimalist::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .divider-minimalist span {
          position: relative;
          background: #0d0d12;
          padding: 0 20px;
          font-size: 11px;
          font-weight: 900;
          color: rgba(255,255,255,0.3);
          letter-spacing: 2px;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .input-field-wrapper {
          width: 100%;
        }
        .input-inner {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 22px;
          color: rgba(255,255,255,0.3);
          transition: color 0.3s;
        }
        .input-inner input {
          width: 100%;
          height: 62px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 0 25px 0 62px;
          color: #fff;
          font-size: 16px;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box; /* Critical for truncation fix */
        }
        .input-inner input:focus {
          background: rgba(255,255,255,0.06);
          border-color: var(--accent-primary);
          box-shadow: 0 0 20px rgba(255,157,0,0.1);
        }
        .input-inner input:focus ~ .field-icon {
          color: var(--accent-primary);
        }

        .submit-btn-premium {
          height: 62px;
          background: linear-gradient(135deg, #ff9d00, #ff4500);
          color: #000;
          border: none;
          border-radius: 16px;
          font-weight: 900;
          font-size: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.4s;
          margin-top: 10px;
        }
        .submit-btn-premium:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(255,157,0,0.3);
        }
        .submit-btn-premium:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .error-message-box {
          background: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          border: 1px solid rgba(255, 77, 77, 0.2);
        }

        .footer-links {
          margin-top: 35px;
          text-align: center;
        }
        .signup-link {
          text-decoration: none;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          font-weight: 600;
          transition: color 0.3s;
        }
        .signup-link:hover { color: #fff; }
        .signup-link .accent {
          color: var(--accent-primary);
          font-weight: 800;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0,0,0,0.1);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}





