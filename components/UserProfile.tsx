
import React from 'react';
import { User, Booking } from '../types';
import { Phone, Calendar, Package, Clock } from 'lucide-react';

interface UserProfileProps {
  onBack: () => void;
  onLogout: () => void;
  currentUser: User;
  bookings: Booking[];
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack, onLogout, currentUser, bookings }) => {
  return (
    <div className="min-h-screen p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-transparent mb-6">
          <div className="flex justify-between items-center frosted-card p-3 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-[var(--app-text-primary)] ml-3">My Profile</h1>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="px-5 py-2 bg-white/50 text-[var(--app-text-secondary)] rounded-xl hover:bg-white/80 hover:text-[var(--app-text-primary)] transition-all border border-white/30 font-semibold"
              >
                Back
              </button>
              <button
                onClick={onLogout}
                className="px-5 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-all font-semibold border border-red-400/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="frosted-card rounded-2xl p-6 shadow-[var(--app-shadow)]">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[var(--app-primary)] to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/30">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-[var(--app-text-primary)]">{currentUser?.name}</h2>
              <p className="text-[var(--app-text-secondary)]">{currentUser?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 frosted-subtle rounded-xl">
                <Phone className="text-[var(--app-primary)]" size={20} />
                <div>
                  <div className="text-xs text-[var(--app-text-secondary)]">Phone</div>
                  <div className="font-semibold text-[var(--app-text-primary)]">{currentUser?.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 frosted-subtle rounded-xl">
                <Calendar className="text-[var(--app-primary)]" size={20} />
                <div>
                  <div className="text-xs text-[var(--app-text-secondary)]">Member Since</div>
                  <div className="font-semibold text-[var(--app-text-primary)]">{currentUser?.memberSince}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 frosted-subtle rounded-xl">
                <Package className="text-[var(--app-primary)]" size={20} />
                <div>
                  <div className="text-xs text-[var(--app-text-secondary)]">Total Bookings</div>
                  <div className="font-semibold text-[var(--app-text-primary)]">{currentUser?.totalBookings}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 frosted-card rounded-2xl p-6 shadow-[var(--app-shadow)]">
            <h3 className="text-2xl font-bold text-[var(--app-text-primary)] mb-6">Booking History</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-6 rounded-xl border-2 ${
                    booking.status === 'upcoming'
                      ? 'border-blue-200/50 bg-blue-500/10 backdrop-blur-sm'
                      : 'border-green-200/50 bg-green-500/10 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[var(--app-text-primary)] mb-2">{booking.machinery}</h4>
                      <div className="flex items-center gap-4 text-sm text-[var(--app-text-secondary)] mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {booking.duration} days
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'upcoming'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[var(--app-text-primary)]">₹{booking.price}</div>
                      <div className="text-xs text-[var(--app-text-secondary)]">per day</div>
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-12 text-[var(--app-text-secondary)] frosted-subtle rounded-lg">
                    <Package size={40} className="mx-auto mb-2" />
                    <h4 className="font-semibold text-lg text-[var(--app-text-primary)]">No Bookings Yet</h4>
                    <p>Your machinery rentals will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;