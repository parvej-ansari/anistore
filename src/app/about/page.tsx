'use client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { MousePointer2, ExternalLink, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="page-bg-wrapper" style={{ backgroundImage: "url('/images/about_bg.png')" }}>
      <div className="main-content-area">
        <Navbar />
        
        <main style={{ paddingTop: '250px', paddingBottom: '100px' }}>
          {/* CLEAN HERO SECTION (ONLY TEXT) */}
          <section style={{ textAlign: 'center', width: '90%', maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="hero-title" style={{ fontSize: '80px', marginBottom: '40px' }}>
                BEYOND THE <br />
                <span className="text-gradient-konoha">GRAND LINE.</span>
              </h1>
              <p style={{ color: '#fff', fontSize: '22px', margin: '0 auto 60px', maxWidth: '800px', lineHeight: 1.8, fontWeight: 500, textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
                AniStore is a premium affiliate hub curated for the ultimate collectors. We bring the most epic treasures from the One Piece universe and beyond, directly to your vault.
              </p>
            </motion.div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section style={{ padding: '80px 5%' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900 }}>HOW <span className="text-gradient-konoha">IT WORKS</span></h2>
              <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', margin: '15px auto' }}></div>
            </div>

            <div className="glass-panel" style={{ padding: '80px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,157,0,0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--accent-primary)' }}>
                   <Globe size={32} />
                </div>
                <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>Global Curation</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We scout the world's most trusted platforms for elite gear.</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,157,0,0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--accent-primary)' }}>
                   <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>Elite Verification</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Every listing is verified for quality and merchant trust.</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,157,0,0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: 'var(--accent-primary)' }}>
                   <ExternalLink size={32} />
                </div>
                <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>Seamless Redirect</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Securely redirects you to official stores to complete your hunt.</p>
              </div>
            </div>
          </section>

          {/* BUSINESS LOGIC */}
          <section style={{ padding: '0 5% 100px' }}>
             <div className="glass-panel" style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', background: 'rgba(255,255,255,0.05)' }}>
                <div>
                   <h2 style={{ fontSize: '32px', marginBottom: '25px', fontWeight: 900 }}>The <span className="text-gradient-konoha">Shinobi Engine</span></h2>
                   <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', lineHeight: 1.8 }}>
                     AniStore operates on a high-end affiliate model. We build a bridge between global collectors and the world's biggest e-commerce platforms. 
                   </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '20px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                   <Cpu size={80} className="text-gradient-konoha" style={{ marginBottom: '20px' }} />
                   <p style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>System Architecture: Active</p>
                </div>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
}
