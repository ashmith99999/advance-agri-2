import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MainApp from './components/MainApp';
import UserProfile from './components/UserProfile';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import { View, UserRole, User, Booking, Notification, Machinery } from './types';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [currentView, setCurrentView] = useState<View>('login');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [backgroundClass, setBackgroundClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setCurrentUser(null);
            setCurrentView('login');
          } else if (profile) {
            const user: User = {
              name: profile.name,
              email: session.user.email!,
              phone: profile.phone,
              memberSince: new Date(profile.member_since).getFullYear().toString(),
              totalBookings: profile.total_bookings,
              role: profile.role as UserRole,
            };
            setCurrentUser(user);
            
            const role = profile.role as UserRole;
             if (role === 'owner') {
                setCurrentView('ownerDashboard');
            } else if (role === 'admin') {
                setCurrentView('adminDashboard');
            } else {
                setCurrentView('main');
            }
          }
        } else {
          setCurrentUser(null);
          setCurrentView('login');
        }
        setIsLoading(false);
      }
    );
    
    // Check for initial session
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setIsLoading(false);
        }
    };
    checkInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const fetchMachinery = async () => {
        const { data, error } = await supabase.from('machinery').select('*');
        if (error) {
            console.error('Error fetching machinery:', error);
        } else {
            setMachinery(data as Machinery[]);
        }
    };
    fetchMachinery();
  }, []);

  useEffect(() => {
    switch (currentView) {
      case 'main': setBackgroundClass('bg-view-main'); break;
      case 'profile': setBackgroundClass('bg-view-profile'); break;
      case 'ownerDashboard': setBackgroundClass('bg-view-owner'); break;
      case 'adminDashboard': setBackgroundClass('bg-view-admin'); break;
      default: setBackgroundClass(''); break;
    }
  }, [currentView]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setBookings([]);
    setNotifications([]);
    setCurrentView('login');
  };
  
  const handleBooking = (machinery: Machinery) => {
    const newBooking: Booking = {
      id: Date.now(),
      machinery: machinery.name,
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      status: 'upcoming',
      price: machinery.price,
      duration: 3
    };
    setBookings([newBooking, ...bookings]);
    setNotifications([{
      id: Date.now(),
      message: `Booking confirmed for ${machinery.name}`,
      type: 'success',
      time: 'Just now'
    }, ...notifications]);
  };

  if (isLoading) {
      return (
          <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
              <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!session || !currentUser) {
    if (currentView === 'signup') {
        return <SignUpPage onNavigateToLogin={() => setCurrentView('login')} />;
    }
    return <LoginPage onNavigateToSignUp={() => setCurrentView('signup')} />;
  }
  
  const renderMainContent = () => {
    switch(currentView) {
      case 'main':
        return <MainApp 
          onLogout={handleLogout}
          onNavigateToProfile={() => setCurrentView('profile')}
          userRole={currentUser.role}
          currentUser={currentUser}
          bookings={bookings}
          notifications={notifications}
          onBooking={handleBooking}
          machinery={machinery}
        />;
      case 'profile':
        return <UserProfile
          onBack={() => setCurrentView('main')}
          onLogout={handleLogout}
          currentUser={currentUser}
          bookings={bookings}
        />;
      case 'ownerDashboard':
        return <OwnerDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
        />;
      case 'adminDashboard':
        return <AdminDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
        />;
      default:
        // Fallback to main view if something is wrong
        return <MainApp 
          onLogout={handleLogout}
          onNavigateToProfile={() => setCurrentView('profile')}
          userRole={currentUser.role}
          currentUser={currentUser}
          bookings={bookings}
          notifications={notifications}
          onBooking={handleBooking}
          machinery={machinery}
        />;
    }
  };

  return (
    <div className={`app-background-container text-[var(--app-text-primary)] min-h-screen ${backgroundClass}`}>
      {renderMainContent()}
    </div>
  );
};

export default App;