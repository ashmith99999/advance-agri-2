import React from 'react';
import { User } from '../types';
import { MACHINERY_DATA, OWNER_BOOKINGS_DATA, CUSTOMER_REVIEWS_DATA, MAINTENANCE_ALERTS_DATA } from '../constants';
import { DollarSign, Package, Star, Wrench, LogOut, User as UserIcon, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';

interface OwnerDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ currentUser, onLogout }) => {
  const myMachinery = MACHINERY_DATA.filter(m => m.owner === currentUser.name);
  const totalEarnings = OWNER_BOOKINGS_DATA.reduce((acc, booking) => acc + booking.earnings, 0);
  const totalBookings = OWNER_BOOKINGS_DATA.length;
  const averageRating = (CUSTOMER_REVIEWS_DATA.reduce((acc, review) => acc + review.rating, 0) / CUSTOMER_REVIEWS_DATA.length).toFixed(1);

  const getStatusChip = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100/80 text-blue-800';
      case 'in-progress': return 'bg-yellow-100/80 text-yellow-800';
      case 'completed': return 'bg-green-100/80 text-green-800';
      default: return 'bg-gray-100/80 text-gray-800';
    }
  };

  const getUrgencyChip = (urgency: 'high' | 'medium' | 'low') => {
    switch(urgency) {
      case 'high': return 'bg-red-100/80 text-red-800';
      case 'medium': return 'bg-orange-100/80 text-orange-800';
      case 'low': return 'bg-yellow-100/80 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <header className="bg-white/50 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--app-primary)] p-2 rounded-xl">
              <Wrench className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-text-primary)]">Owner Dashboard</h1>
              <p className="text-xs text-[var(--app-text-secondary)]">Welcome, {currentUser.name}</p>
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
        <div className="grid md:grid-cols-3 gap-6">
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4 transition-all hover:shadow-[var(--app-shadow-hover)] hover:-translate-y-1">
            <div className="p-4 bg-green-100/80 rounded-full"><DollarSign className="text-green-600" size={32} /></div>
            <div>
              <p className="text-sm text-[var(--app-text-secondary)]">Total Earnings</p>
              <p className="text-3xl font-bold text-[var(--app-text-primary)]">₹{totalEarnings.toLocaleString()}</p>
            </div>
          </div>
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4 transition-all hover:shadow-[var(--app-shadow-hover)] hover:-translate-y-1">
            <div className="p-4 bg-blue-100/80 rounded-full"><Package className="text-blue-600" size={32} /></div>
            <div>
              <p className="text-sm text-[var(--app-text-secondary)]">Total Bookings</p>
              <p className="text-3xl font-bold text-[var(--app-text-primary)]">{totalBookings}</p>
            </div>
          </div>
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)] flex items-center gap-4 transition-all hover:shadow-[var(--app-shadow-hover)] hover:-translate-y-1">
            <div className="p-4 bg-yellow-100/80 rounded-full"><Star className="text-yellow-600" size={32} /></div>
            <div>
              <p className="text-sm text-[var(--app-text-secondary)]">Average Rating</p>
              <p className="text-3xl font-bold text-[var(--app-text-primary)]">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Machinery & Maintenance */}
          <div className="lg:col-span-2 space-y-6">
             <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)]">
              <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4">My Machinery</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {myMachinery.map(m => (
                  <div key={m.id} className="frosted-subtle p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{m.image}</span>
                      <div>
                        <p className="font-semibold text-[var(--app-text-primary)]">{m.name}</p>
                        <p className="text-xs text-[var(--app-text-secondary)]">{m.type} • {m.power}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100/80 text-green-800">Available</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)]">
              <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500" />Maintenance Alerts</h3>
              <div className="space-y-3">
                {MAINTENANCE_ALERTS_DATA.map(alert => (
                  <div key={alert.id} className="bg-red-500/10 backdrop-blur-sm p-4 rounded-lg border border-red-200/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-red-800">{alert.machineryName}</p>
                        <p className="text-sm text-red-700">{alert.issue}</p>
                      </div>
                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getUrgencyChip(alert.urgency)}`}>{alert.urgency}</span>
                    </div>
                    <p className="text-xs text-[var(--app-text-secondary)] mt-2">Due: {alert.dueDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Bookings */}
          <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)]">
            <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4">Recent Bookings</h3>
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {OWNER_BOOKINGS_DATA.map(b => (
                <div key={b.id} className="border-b border-[var(--app-border)] pb-3 last:border-b-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-[var(--app-text-primary)]">{b.machineryName}</p>
                    <p className="font-bold text-green-600">₹{b.earnings}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[var(--app-text-secondary)]">
                    <span className="flex items-center gap-1"><UserIcon size={14} /> {b.renterName}</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChip(b.status)}`}>{b.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={14} /> {b.startDate} to {b.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="frosted-card p-6 rounded-2xl shadow-[var(--app-shadow)]">
          <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4">Customer Reviews</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CUSTOMER_REVIEWS_DATA.map(r => (
              <div key={r.id} className="frosted-subtle p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{r.renterName}</p>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100/80 text-yellow-800 text-xs font-bold">
                    <Star size={14} /> {r.rating}/5
                  </div>
                </div>
                <p className="text-sm text-[var(--app-text-secondary)] italic">"{r.comment}"</p>
                <p className="text-xs text-gray-400 mt-2">{r.machineryName} • {r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;