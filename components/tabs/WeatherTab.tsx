import React from 'react';
import { WeatherData } from '../../types';
import { DAKSHINA_KANNADA_LOCATIONS } from '../../constants';
import { RefreshCw, MapPin } from 'lucide-react';

interface WeatherTabProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  location: string;
  onLocationChange: (location: string) => void;
  onRefresh: () => void;
}

const WeatherTab: React.FC<WeatherTabProps> = ({ weatherData, isLoading, location, onLocationChange, onRefresh }) => {
  const lastUpdated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const WeatherSkeleton = () => (
    <div className="rounded-2xl p-6 border-2 border-gray-200/50 bg-gray-500/10 animate-pulse">
      <div className="text-center mb-3">
        <div className="h-4 bg-gray-300/50 rounded w-1/2 mx-auto mb-2"></div>
        <div className="w-16 h-16 bg-gray-300/50 rounded-full mx-auto mb-2"></div>
        <div className="h-6 bg-gray-300/50 rounded w-1/4 mx-auto"></div>
      </div>
      <div className="h-4 bg-gray-300/50 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-300/50 rounded w-1/2 mx-auto mb-2"></div>
      <div className="mt-2 h-8 bg-gray-300/50 rounded-lg w-full"></div>
    </div>
  );

  return (
    <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)] animate-fade-in-up">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-[var(--app-text-primary)] flex items-center gap-3">
          <span className="text-4xl">🌦️</span>
          Weather Forecast
        </h2>
        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl border border-white/30">
          <MapPin className="text-gray-500" />
          <select 
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-transparent font-semibold focus:outline-none"
            aria-label="Select location"
          >
            {DAKSHINA_KANNADA_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6 text-sm text-[var(--app-text-secondary)]">
        <p>Showing live forecast for <span className="font-bold text-[var(--app-text-primary)]">{location}</span>.</p>
        <div className="flex items-center gap-3">
          <span>Last Updated: {lastUpdated}</span>
          <button onClick={onRefresh} disabled={isLoading} className="p-2 hover:bg-gray-500/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <WeatherSkeleton key={i} />)
        ) : weatherData ? (
          weatherData.forecast.map((day, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 border-2 transition-all backdrop-blur-sm ${
                day.ideal
                  ? 'bg-green-500/10 border-green-200/50'
                  : 'bg-red-500/10 border-red-200/50'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-[var(--app-text-secondary)] mb-1">{day.day}</div>
                <div className="text-5xl mb-2">{day.icon}</div>
                <div className="text-xl font-bold text-[var(--app-text-primary)]">{day.temp}°C</div>
              </div>
              <div className="text-center text-sm text-[var(--app-text-primary)] mb-2">{day.condition}</div>
              <div className="text-center text-xs text-blue-600 font-semibold mb-2">
                💧 {day.rainfall}% rain chance
              </div>
              {day.alert && (
                <div className="mt-2 p-2 bg-red-500/20 rounded-lg text-xs text-red-700 font-semibold text-center">
                  ⚠️ {day.alert}
                </div>
              )}
              {day.ideal && !day.alert && (
                <div className="mt-2 p-2 bg-green-500/20 rounded-lg text-xs text-green-700 font-semibold text-center">
                  ✓ Good for work
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-[var(--app-text-secondary)] frosted-subtle rounded-lg">
            <p>Could not load weather data. Please try refreshing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherTab;
