import React, { useState } from 'react';
import { User, Machinery, TrainingModule } from '../types';
import { MACHINERY_DATA, TRAINING_MODULES, OWNER_BOOKINGS_DATA } from '../constants';
import { BarChart2, Users, Tractor, BookOpen, LogOut, Settings } from 'lucide-react';
import AIContentAssistant from './AIContentAssistant';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

// Mock user data for the user list
const ALL_USERS: User[] = [
    { name: 'Rohan Patel', email: 'rohan.p@example.com', phone: '+919876543210', memberSince: '2024', totalBookings: 2, role: 'user' },
    { name: 'Anitha Sharma', email: 'anitha.s@example.com', phone: '+919876543211', memberSince: '2023', totalBookings: 5, role: 'user' },
    { name: 'Suresh Reddy', email: 'owner@agrirent.com', phone: '+919876543212', memberSince: '2023', totalBookings: 45, role: 'owner' },
    { name: 'Priya Singh', email: 'priya.s@example.com', phone: '+919876543213', memberSince: '2024', totalBookings: 1, role: 'user' },
];


const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout }) => {
  const [machineryList, setMachineryList] = useState<Machinery[]>(MACHINERY_DATA);
  const [trainingList, setTrainingList] = useState<TrainingModule[]>(TRAINING_MODULES);
  
  const totalRevenue = OWNER_BOOKINGS_DATA.reduce((acc, booking) => acc + booking.earnings, 0) + 15200; // adding some for other users
  
  const handleAddMachinery = (newMachine: Omit<Machinery, 'id' | 'rating' | 'distance' | 'owner' | 'phone' | 'address'>) => {
    const machineToAdd: Machinery = {
      id: Date.now(),
      rating: 4.5,
      distance: Math.floor(Math.random() * 100),
      owner: 'AgriRent Fleet',
      phone: '+91 9999988888',
      address: 'Hub location',
      ...newMachine,
    }
    setMachineryList(prev => [machineToAdd, ...prev]);
  };

  const handleAddTraining = (newModule: Omit<TrainingModule, 'id'>) => {
    const moduleToAdd: TrainingModule = {
      id: Date.now(),
      ...newModule,
    }
    setTrainingList(prev => [moduleToAdd, ...prev]);
  };

  return (
     <div className="min-h-screen font-sans">
      <header className="bg-white/50 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Settings className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-text-primary)]">Admin Panel</h1>
              <p className="text-xs text-[var(--app-text-secondary)]">Logged in as {currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 font-semibold border border-red-400/50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in-up">
        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4">
            <div className="p-4 bg-green-100/80 rounded-full"><BarChart2 className="text-green-600" size={32} /></div>
            <div><p className="text-sm text-[var(--app-text-secondary)]">Total Revenue</p><p className="text-3xl font-bold text-[var(--app-text-primary)]">₹{totalRevenue.toLocaleString()}</p></div>
          </div>
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4">
            <div className="p-4 bg-blue-100/80 rounded-full"><Users className="text-blue-600" size={32} /></div>
            <div><p className="text-sm text-[var(--app-text-secondary)]">Total Users</p><p className="text-3xl font-bold text-[var(--app-text-primary)]">{ALL_USERS.length}</p></div>
          </div>
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4">
            <div className="p-4 bg-orange-100/80 rounded-full"><Tractor className="text-orange-600" size={32} /></div>
            <div><p className="text-sm text-[var(--app-text-secondary)]">Machinery</p><p className="text-3xl font-bold text-[var(--app-text-primary)]">{machineryList.length}</p></div>
          </div>
           <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4">
            <div className="p-4 bg-purple-100/80 rounded-full"><BookOpen className="text-purple-600" size={32} /></div>
            <div><p className="text-sm text-[var(--app-text-secondary)]">Training Modules</p><p className="text-3xl font-bold text-[var(--app-text-primary)]">{trainingList.length}</p></div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <AIContentAssistant 
                  onAddMachinery={handleAddMachinery}
                  onAddTraining={handleAddTraining}
                />
            </div>
            <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)]">
                <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4 flex items-center gap-2"><Users/> User Management</h3>
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
                    {ALL_USERS.map(user => (
                        <div key={user.email} className="frosted-subtle p-3 rounded-lg">
                            <p className="font-semibold text-[var(--app-text-primary)]">{user.name}</p>
                            <p className="text-xs text-[var(--app-text-secondary)]">{user.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;