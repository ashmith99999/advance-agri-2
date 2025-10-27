
import React from 'react';
import { User, Booking, WeatherData, CollectiveBooking, Machinery } from '../../types';
import { Users, MapPin, Package, CheckCircle, Clock } from 'lucide-react';

interface HomeTabProps {
  currentUser: User;
  bookings: Booking[];
  weatherData: WeatherData | null;
  collectiveBookings: CollectiveBooking[];
  machinery: Machinery[];
  setActiveTab: (tab: 'home' | 'catalog' | 'recommend' | 'weather' | 'yield' | 'training') => void;
  setSelectedCollective: (collective: CollectiveBooking) => void;
  setShowCollectiveModal: (show: boolean) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
  currentUser,
  bookings,
  weatherData,
  collectiveBookings,
  machinery,
  setActiveTab,
  setSelectedCollective,
  setShowCollectiveModal,
}) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {weatherData && weatherData.urgency === 'high' && (
        <div className="bg-amber-400/20 backdrop-blur-lg rounded-3xl p-6 border border-amber-400/40">
          <div className="flex items-start gap-4">
            <div className="text-5xl animate-pulse">⚠️</div>
            <div className="flex-1 text-amber-900">
              <h3 className="text-2xl font-bold mb-2">Weather Alert: Heavy Rain Expected!</h3>
              <p className="text-lg mb-4">{weatherData.recommendation}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="bg-[var(--app-primary)] text-white px-6 py-3 rounded-xl font-bold shadow-[var(--app-shadow)] hover:shadow-[var(--app-shadow-hover)] transition-all"
                >
                  Book Now
                </button>
                <button
                  onClick={() => setActiveTab('weather')}
                  className="border-2 border-amber-700/50 bg-white/50 text-amber-800 px-6 py-3 rounded-xl font-bold hover:bg-amber-700 hover:text-white transition-all"
                >
                  View Forecast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-600/80 to-green-800/80 backdrop-blur-md rounded-3xl p-12 text-white shadow-xl border border-white/20">
        <h2 className="text-5xl font-bold mb-4">Welcome, {currentUser?.name}!</h2>
        <p className="text-xl opacity-80 mb-6">You have {bookings.filter(b => b.status === 'upcoming').length} upcoming bookings.</p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="bg-white text-[var(--app-primary)] px-8 py-3 rounded-xl font-semibold shadow-[var(--app-shadow)] hover:shadow-[var(--app-shadow-hover)] transition-all"
        >
          Browse Catalog
        </button>
      </div>

      {collectiveBookings.length > 0 && (
        <div className="frosted-card rounded-3xl p-8 shadow-[var(--app-shadow)]">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-[var(--app-text-primary)] flex items-center gap-3">
              <Users className="text-[var(--app-primary)]" size={36} />
              Cost-Sharing Opportunities
            </h3>
            <p className="text-[var(--app-text-secondary)] mt-2">Join nearby farmers and save up to 70%!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {collectiveBookings.map((collective) => {
              const machine = machinery.find(m => m.id === collective.machineryId);
              const machineImage = machine?.image || '🚜';

              return (
                <div key={collective.id} className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 hover:shadow-[var(--app-shadow-hover)] transition-all relative">
                  <div className="absolute top-0 right-0 bg-[var(--app-secondary)] text-white px-4 py-2 rounded-bl-2xl rounded-tr-xl font-bold text-lg z-10">
                    Save ₹{collective.savings}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-4">
                        <h4 className="text-xl font-bold text-[var(--app-text-primary)] mb-2">{collective.machinery}</h4>
                        <div className="flex items-center gap-2 text-sm text-[var(--app-text-secondary)]">
                          <MapPin size={14} />
                          <span>{collective.location} • {collective.distance}km</span>
                        </div>
                      </div>
                      <div className="text-6xl -mt-2">{machineImage}</div>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Solo Price</span>
                      <span className="text-lg text-gray-500 line-through">₹{collective.originalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">Shared Price</span>
                      <span className="text-3xl font-bold text-green-600">₹{collective.sharedPrice}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">{collective.currentMembers}/{collective.requiredMembers} Farmers</span>
                      <span className="text-green-600 font-bold">{collective.timeLeft}</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${(collective.currentMembers / collective.requiredMembers) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCollective(collective);
                      setShowCollectiveModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-[var(--app-primary)] to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={20} />
                    Join Group
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Package, title: 'Total Bookings', value: currentUser?.totalBookings || 0, color: 'from-blue-400 to-blue-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { icon: CheckCircle, title: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'from-green-400 to-green-600', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
          { icon: Clock, title: 'Upcoming', value: bookings.filter(b => b.status === 'upcoming').length, color: 'from-orange-400 to-orange-600', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="frosted-card rounded-2xl p-6 shadow-[var(--app-shadow)] hover:shadow-[var(--app-shadow-hover)] transition-all hover:-translate-y-1">
            <div className={`p-3 rounded-full w-fit mb-4 ${stat.iconBg}`}>
              <stat.icon className={stat.iconColor} size={28} />
            </div>
            <h3 className="text-lg text-[var(--app-text-secondary)] mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-[var(--app-text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTab;