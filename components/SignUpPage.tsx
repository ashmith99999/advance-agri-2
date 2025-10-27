import React, { useState } from 'react';
import { Tractor, User as UserIcon, Mail, Lock, ArrowRight, Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                phone,
            },
        },
    });
    
    if (error) {
        setError(error.message);
    } else {
        setSuccess('Success! Please check your email to confirm your account.');
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
      <div className="w-full max-w-md rounded-2xl bg-[var(--card-bg)] backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-[var(--text-color)] animate-login-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--primary-color)]" style={{ backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <Tractor size={32} style={{ color: 'var(--primary-color)' }} />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p style={{ color: 'var(--subtle-text-color)' }}>Join AgriRent Today</p>
        </div>

        {error && <p className="bg-red-500/30 text-red-100 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-500/30 text-green-100 text-center text-sm p-3 rounded-lg mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative input-wrapper">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--subtle-text-color)' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-[var(--input-bg)] pl-10 pr-4 py-3 border border-transparent rounded-lg focus:outline-none transition-all duration-300 placeholder:text-[var(--subtle-text-color)]"
            />
            <div className="input-focus-line"></div>
          </div>
          
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
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--subtle-text-color)' }} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full bg-[var(--input-bg)] pl-10 pr-4 py-3 border border-transparent rounded-lg focus:outline-none transition-all duration-300 placeholder:text-[var(--subtle-text-color)]"
            />
            <div className="input-focus-line"></div>
          </div>

          <div className="relative input-wrapper">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--subtle-text-color)' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-[var(--input-bg)] pl-10 pr-4 py-3 border border-transparent rounded-lg focus:outline-none transition-all duration-300 placeholder:text-[var(--subtle-text-color)]"
            />
            <div className="input-focus-line"></div>
          </div>

          <div className="relative input-wrapper">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--subtle-text-color)' }} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-[var(--input-bg)] pl-10 pr-4 py-3 border border-transparent rounded-lg focus:outline-none transition-all duration-300 placeholder:text-[var(--subtle-text-color)]"
            />
            <div className="input-focus-line"></div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full login-btn text-[var(--accent-color)] py-3 rounded-lg font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading 
              ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" /> 
              : <>Sign Up <ArrowRight size={22} className="arrow-icon" /></>
            }
          </button>
        </form>

        <p className="text-center text-sm text-[var(--subtle-text-color)] mt-6">
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} className="font-bold text-[var(--primary-color)] hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
