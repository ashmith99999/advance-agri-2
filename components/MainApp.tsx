import React, { useState, useEffect, useCallback } from 'react';
import { User, Booking, Notification, Machinery, UserRole, WeatherData, CollectiveBooking } from '../types';
import { Tractor, User as UserIcon, Bell, LogOut, BookOpen, Menu } from 'lucide-react';
import PaymentModal from './PaymentModal';
import CollectiveModal from './CollectiveModal';
import HomeTab from './tabs/HomeTab';
import CatalogTab from './tabs/CatalogTab';
import RecommendTab from './tabs/RecommendTab';
import WeatherTab from './tabs/WeatherTab';
import YieldTab from './tabs/YieldTab';
import TrainingTab from './tabs/TrainingTab';

interface MainAppProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
  userRole: UserRole;
  currentUser: User;
  bookings: Booking[];
  notifications: Notification[];
  onBooking: (machinery: Machinery) => void;
  machinery: Machinery[];
}

type ActiveTab = 'home' | 'catalog' | 'recommend' | 'weather' | 'yield' | 'training';

const generateMockWeatherData = (location: string): WeatherData => {
  const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const forecast: WeatherData['forecast'] = [];
  const conditions = [
    { name: 'Sunny', icon: '☀️' }, { name: 'Partly Cloudy', icon: '⛅' },
    { name: 'Cloudy', icon: '☁️' }, { name: 'Light Rain', icon: '🌦️' },
    { name: 'Heavy Rain', icon: '🌧️' }, { name: 'Thunderstorm', icon: '⛈️' },
  ];
  
  let recommendation = 'Good conditions for field work. Plan your activities accordingly.';
  let urgency: 'high' | 'medium' | 'low' = 'low';

  for (let i = 0; i < 5; i++) {
    const daySeed = seed + i;
    const temp = 26 + Math.round(Math.sin(daySeed) * 5); // Temp between 21 and 31
    const rainfall = Math.max(0, Math.min(95, Math.round(Math.cos(daySeed * 2) * 50 + 40))); // Rainfall chance
    const conditionIndex = Math.floor((rainfall / 100) * (conditions.length -1));
    const condition = conditions[conditionIndex];
    
    const ideal = rainfall < 40;
    let alert: string | undefined = undefined;
    if (rainfall > 75) {
      alert = 'Not suitable for field work';
      if (i < 2) { // if heavy rain in next 2 days
        recommendation = 'Book machinery now before heavy rain arrives!';
        urgency = 'high';
      }
    }

    forecast.push({
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `Day ${i + 1}`,
      condition: condition.name,
      temp,
      rainfall,
      icon: condition.icon,
      ideal,
      alert
    });
  }

  return {
    current: { temp: forecast[0].temp, condition: forecast[0].condition },
    forecast,
    recommendation,
    urgency,
  };
};

const MainApp: React.FC<MainAppProps> = ({ onLogout, onNavigateToProfile, currentUser, bookings, notifications, onBooking, machinery }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Mangaluru');
  const [collectiveBookings, setCollectiveBookings] = useState<CollectiveBooking[]>([]);
  const [showCollectiveModal, setShowCollectiveModal] = useState(false);
  const [selectedCollective, setSelectedCollective] = useState<CollectiveBooking | null>(null);

  const handleFetchWeather = useCallback(async (location: string) => {
    setIsWeatherLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setWeatherData(generateMockWeatherData(location));
    setIsWeatherLoading(false);
  }, []);

  useEffect(() => {
    handleFetchWeather(selectedLocation);
  }, [selectedLocation, handleFetchWeather]);

  useEffect(() => {
    setCollectiveBookings([
      {
        id: 1, machinery: 'Combine Harvester', machineryId: 3, location: 'Mysuru', distance: 145, originalPrice: 3500, sharedPrice: 1200, currentMembers: 2, requiredMembers: 3, savings: 2300, date: '2025-10-08', members: ['Manjunath K', 'Ravi Kumar'], timeLeft: '2 days'
      },
      {
        id: 2, machinery: 'John Deere 5075E', machineryId: 1, location: 'Devanahalli', distance: 42, originalPrice: 1200, sharedPrice: 600, currentMembers: 1, requiredMembers: 2, savings: 600, date: '2025-10-06', members: ['Rajesh Kumar'], timeLeft: '4 days'
      },
    ]);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRentClick = (machine: Machinery) => {
    setSelectedMachinery(machine);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    if (selectedMachinery) {
      onBooking(selectedMachinery);
      setShowPaymentModal(false);
      setSelectedMachinery(null);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab
          currentUser={currentUser}
          bookings={bookings}
          weatherData={weatherData}
          collectiveBookings={collectiveBookings}
          machinery={machinery}
          setActiveTab={setActiveTab}
          setSelectedCollective={setSelectedCollective}
          setShowCollectiveModal={setShowCollectiveModal}
        />;
      case 'catalog':
        return <CatalogTab machinery={machinery} handleRentClick={handleRentClick} />;
      case 'recommend':
        return <RecommendTab machinery={machinery} weatherData={weatherData} handleRentClick={handleRentClick} />;
      case 'weather':
        return <WeatherTab
          weatherData={weatherData}
          isLoading={isWeatherLoading}
          location={selectedLocation}
          onLocationChange={setSelectedLocation}
          onRefresh={() => handleFetchWeather(selectedLocation)}
        />;
      case 'yield':
        return <YieldTab machinery={machinery} weatherData={weatherData} handleRentClick={handleRentClick} />;
      case 'training':
        return <TrainingTab currentUser={currentUser} bookings={bookings} machinery={machinery} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <header className="bg-white/50 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--app-primary)] p-2 rounded-xl">
                <Tractor className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--app-text-primary)]">AgriRent</h1>
                <p className="text-xs text-[var(--app-text-secondary)]">Smart Machinery Rental</p>
              </div>
            </div>
            
            <nav className="hidden md:flex gap-2 items-center">
              {(['home', 'catalog', 'recommend', 'weather', 'yield', 'training'] as ActiveTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                    activeTab === tab ? 'bg-white/80 text-[var(--app-primary)] shadow-sm' : 'text-[var(--app-text-secondary)] hover:bg-white/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
              
              <div className="w-px h-6 bg-white/30 mx-2"></div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-full text-[var(--app-text-secondary)] hover:bg-white/50 relative transition-colors"
                  aria-label="Toggle notifications"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white/80"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 frosted-card rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-up">
                    <h3 className="font-bold text-[var(--app-text-primary)] mb-3">Notifications</h3>
                    <div className="space-y-2">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 rounded-xl border border-blue-200/50 bg-blue-500/10">
                          <p className="text-sm text-blue-800">{notif.message}</p>
                          <p className="text-xs text-blue-600 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onNavigateToProfile}
                className="p-3 rounded-full text-[var(--app-text-secondary)] hover:bg-white/50 transition-colors"
                aria-label="View profile"
              >
                <UserIcon size={20} />
              </button>

              <button
                onClick={onLogout}
                className="p-3 rounded-full text-[var(--app-text-secondary)] hover:bg-red-500/10 hover:text-red-600 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </nav>
            <div className="md:hidden">
                <button className="p-2" aria-label="Open menu"><Menu/></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderActiveTab()}
      </main>

      {showPaymentModal && selectedMachinery && (
        <PaymentModal 
          machinery={selectedMachinery}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {showCollectiveModal && selectedCollective && (
        <CollectiveModal 
          collective={selectedCollective}
          machinery={machinery}
          currentUser={currentUser}
          onClose={() => setShowCollectiveModal(false)}
          onJoin={() => {
            const machine = machinery.find(m => m.id === selectedCollective.machineryId);
            if (machine) {
              setSelectedMachinery({...machine, price: selectedCollective.sharedPrice});
              setShowCollectiveModal(false);
              setShowPaymentModal(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default MainApp;