import React, { useState, useEffect } from 'react';
import { Tractor, Mail, Lock, Eye, EyeOff, ArrowRight, Palette } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  onNavigateToSignUp: () => void;
}

const themes = {
  emerald: {
    name: 'Emerald Field',
    colors: {
      '--primary-color': '#2E8B57',
      '--accent-color': '#F5F5F5',
      '--text-color': '#F5F5F5',
      '--subtle-text-color': 'rgba(245, 245, 245, 0.7)',
      '--card-bg': 'rgba(0, 0, 0, 0.2)',
      '--input-bg': 'rgba(0, 0, 0, 0.2)',
      '--input-glow-color': 'rgba(46, 139, 87, 0.5)',
      '--button-bg': 'rgba(46, 139, 87, 0.7)',
      '--button-hover-bg': '#2E8B57',
    },
  },
  golden: {
    name: 'Golden Harvest',
    colors: {
      '--primary-color': '#DAA520',
      '--accent-color': '#FFF8DC',
      '--text-color': '#3A3A3A',
      '--subtle-text-color': 'rgba(58, 58, 58, 0.7)',
      '--card-bg': 'rgba(255, 248, 220, 0.2)',
      '--input-bg': 'rgba(255, 255, 255, 0.3)',
      '--input-glow-color': 'rgba(218, 165, 32, 0.5)',
      '--button-bg': 'rgba(218, 165, 32, 0.8)',
      '--button-hover-bg': '#DAA520',
    },
  },
  dusk: {
    name: 'Dusk Vineyard',
    colors: {
      '--primary-color': '#8A2BE2',
      '--accent-color': '#E6E6FA',
      '--text-color': '#E6E6FA',
      '--subtle-text-color': 'rgba(230, 230, 250, 0.7)',
      '--card-bg': 'rgba(25, 25, 112, 0.2)',
      '--input-bg': 'rgba(0, 0, 0, 0.2)',
      '--input-glow-color': 'rgba(138, 43, 226, 0.5)',
      '--button-bg': 'rgba(138, 43, 226, 0.7)',
      '--button-hover-bg': '#8A2BE2',
    },
  },
  crimson: {
    name: 'Crimson Orchard',
    colors: {
      '--primary-color': '#DC143C',
      '--accent-color': '#FFF0F5',
      '--text-color': '#FFF0F5',
      '--subtle-text-color': 'rgba(255, 240, 245, 0.7)',
      '--card-bg': 'rgba(40, 0, 0, 0.2)',
      '--input-bg': 'rgba(0, 0, 0, 0.2)',
      '--input-glow-color': 'rgba(220, 20, 60, 0.5)',
      '--button-bg': 'rgba(220, 20, 60, 0.7)',
      '--button-hover-bg': '#DC143C',
    },
  },
};

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTheme, setActiveTheme] = useState('emerald');
  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[activeTheme as keyof typeof themes].colors;
    for (const [property, value] of Object.entries(themeColors)) {
      root.style.setProperty(property, value);
    }
  }, [activeTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        setError(error.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=2878&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      
      <div className="absolute top-5 right-5 z-20">
        <button 
          onClick={() => setShowThemes(!showThemes)} 
          className="p-3 rounded-full bg-[var(--card-bg)] text-[var(--text-color)] backdrop-blur-md hover:bg-[var(--primary-color)] transition-all"
          aria-label="Change theme"
        >
          <Palette size={20} />
        </button>
        {showThemes && (
          <div className="absolute top-14 right-0 w-56 rounded-lg bg-[var(--card-bg)] backdrop-blur-xl border border-white/10 shadow-2xl p-2 animate-login-card">
            {Object.entries(themes).map(([key, theme]) => (
              <button 
                key={key} 
                onClick={() => { setActiveTheme(key); setShowThemes(false); }}
                className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-white/10"
              >
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.colors['--primary-color'] }}></div>
                <span className="text-sm font-medium" style={{ color: themes[activeTheme as keyof typeof themes].colors['--text-color'] }}>{theme.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-md rounded-2xl bg-[var(--card-bg)] backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-[var(--text-color)] animate-login-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--primary-color)]" style={{ backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <Tractor size={32} style={{ color: 'var(--primary-color)' }} />
          </div>
          <h1 className="text-3xl font-bold">AgriRent</h1>
          <p style={{ color: 'var(--subtle-text-color)' }}>Smart Machinery Rental</p>
        </div>

        {error && <p className="bg-red-500/30 text-red-100 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative input-wrapper">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--subtle-text-color)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[var(--input-bg)] pl-10 pr-4 py-3 border border-transparent rounded-lg focus:outline-none transition-all duration-300 placeholder:text-[var(--subtle-text-color)]"
            />
            <div className="input-focus-line"></div>
          </div>

          <div className="relative input-wrapper">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--subtle-text-color)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[var(--input-bg)] pl-10 pr-12 py-3 border border-transparent rounded-lg focus:outline-none transition-all duration-300 placeholder:text-[var(--subtle-text-color)]"
            />
            <div className="input-focus-line"></div>
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--subtle-text-color)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full login-btn text-[var(--accent-color)] py-3 rounded-lg font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading 
              ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" /> 
              : <>Login <ArrowRight size={22} className="arrow-icon" /></>
            }
          </button>
        </form>

        <p className="text-center text-sm text-[var(--subtle-text-color)] mt-6">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignUp} className="font-bold text-[var(--primary-color)] hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;