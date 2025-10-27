
import React, { useState, useMemo } from 'react';
import { Machinery } from '../../types';
import { Search, MapPin, Star, Phone } from 'lucide-react';

interface CatalogTabProps {
  machinery: Machinery[];
  handleRentClick: (machine: Machinery) => void;
}

const CatalogTab: React.FC<CatalogTabProps> = ({ machinery, handleRentClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedOwner, setSelectedOwner] = useState('all');

  const owners = useMemo(() => {
    const ownerSet = new Set(machinery.map(m => m.owner));
    return Array.from(ownerSet).sort();
  }, [machinery]);

  const maxAvailableDistance = machinery.length > 0 ? Math.ceil(Math.max(...machinery.map(m => m.distance)) / 10) * 10 : 100;

  const filteredMachinery = machinery.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.type === selectedCategory;
    const matchesLocation = locationFilter === 'all' ||
                          (locationFilter === 'nearby' && m.distance <= maxDistance);
    const matchesOwner = selectedOwner === 'all' || m.owner === selectedOwner;
    return matchesSearch && matchesCategory && matchesLocation && matchesOwner;
  }).sort((a, b) => a.distance - b.distance);

  return (
    <div className="frosted-card rounded-2xl p-6 shadow-[var(--app-shadow)] animate-fade-in-up">
      <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-6">Machinery Catalog</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--app-text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70"
        >
          <option value="all">All Types</option>
          <option value="Tractor">Tractors</option>
          <option value="Harvester">Harvesters</option>
          <option value="Cultivator">Cultivators</option>
          <option value="Sprayer">Sprayers</option>
          <option value="Seeder">Seeders</option>
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70"
        >
          <option value="all">All Locations</option>
          <option value="nearby">Nearby Only</option>
        </select>

        <select
          value={selectedOwner}
          onChange={(e) => setSelectedOwner(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70"
        >
          <option value="all">All Owners</option>
          {owners.map(owner => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </select>
      </div>

      {locationFilter === 'nearby' && (
        <div className="bg-blue-500/10 rounded-xl p-4 mb-6 border border-blue-200/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-gray-700">Search Radius</span>
            <span className="text-lg font-bold text-blue-600">{maxDistance} km</span>
          </div>
          <input
            type="range"
            min="5"
            max={maxAvailableDistance}
            step="5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200/50 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachinery.map((machine) => (
          <div key={machine.id} className="frosted-card rounded-2xl p-6 shadow-[var(--app-shadow)] hover:shadow-[var(--app-shadow-hover)] transition-all relative hover:-translate-y-1">
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <MapPin size={12} />
              {machine.distance} km
            </div>

            <div className="text-6xl mb-4">{machine.image}</div>
            <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-2">{machine.name}</h3>
            
            <div className="mb-3 p-2 frosted-subtle rounded-lg">
              <div className="flex items-center gap-2 text-sm text-[var(--app-text-primary)]">
                <MapPin size={14} className="text-blue-500" />
                <span className="font-semibold">{machine.location}</span>
              </div>
              <div className="text-xs text-[var(--app-text-secondary)] ml-5">{machine.address}</div>
            </div>

            <div className="space-y-2 text-sm text-[var(--app-text-secondary)] mb-4">
              <div><span className="font-semibold text-[var(--app-text-primary)]">Type:</span> {machine.type}</div>
              <div><span className="font-semibold text-[var(--app-text-primary)]">Power:</span> {machine.power}</div>
              <div><span className="font-semibold text-[var(--app-text-primary)]">Owner:</span> {machine.owner}</div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="font-semibold text-[var(--app-text-primary)]">{machine.rating}</span>
              </div>
            </div>

            <div className="text-2xl font-bold text-[var(--app-primary)] mb-4">₹{machine.price}/day</div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleRentClick(machine)}
                className="flex-1 bg-[var(--app-primary)] text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
              >
                Rent Now
              </button>
              <a href={`tel:${machine.phone}`} className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                <Phone size={18} />
              </a>
            </div>
          </div>
        ))}
        {filteredMachinery.length === 0 && (
          <div className="col-span-full text-center py-12 frosted-subtle rounded-2xl">
            <div className="text-6xl mb-4">🚜</div>
            <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-2">No Machinery Found</h3>
            <p className="text-[var(--app-text-secondary)]">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogTab;