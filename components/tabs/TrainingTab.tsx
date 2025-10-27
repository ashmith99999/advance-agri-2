import React, { useState, useMemo } from 'react';
import { User, Booking, Machinery, TrainingModule } from '../../types';
import { TRAINING_MODULES } from '../../constants';
import { BookOpen, Search, ShieldCheck, UserCheck, Star, Clock, AlertTriangle, Info } from 'lucide-react';
import TrainingModuleModal from '../TrainingModuleModal';

interface TrainingTabProps {
  currentUser: User;
  bookings: Booking[];
  machinery: Machinery[];
}

const TrainingTab: React.FC<TrainingTabProps> = ({ currentUser, bookings, machinery }) => {
  const [safetyQuery, setSafetyQuery] = useState('');
  const [safetyTip, setSafetyTip] = useState<{ type: 'tip' | 'warning' | 'info', message: string } | null>(null);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);

  const recommendedModules = useMemo(() => {
    const recommendations: TrainingModule[] = [];
    const isNewUser = currentUser.totalBookings < 5;
    
    // Rule 1: Recommend beginner modules for new users
    if (isNewUser) {
      recommendations.push(...TRAINING_MODULES.filter(m => m.difficulty === 'Beginner'));
    }
    
    // Rule 2: Recommend modules for most frequently rented machinery type
    const machineryTypeCounts: { [key: string]: number } = {};
    bookings.forEach(booking => {
      const machine = machinery.find(m => m.name === booking.machinery);
      if (machine) {
        machineryTypeCounts[machine.type] = (machineryTypeCounts[machine.type] || 0) + 1;
      }
    });
    
    const mostFrequentType = Object.keys(machineryTypeCounts).sort((a, b) => machineryTypeCounts[b] - machineryTypeCounts[a])[0];
    if (mostFrequentType) {
      const relevantModules = TRAINING_MODULES.filter(m => 
        m.machineryType.includes(mostFrequentType) && !recommendations.some(r => r.id === m.id)
      );
      recommendations.push(...relevantModules);
    }
    
    // Rule 3: Add some general advanced/intermediate tips for experienced users
    if (!isNewUser) {
        const advancedModules = TRAINING_MODULES.filter(m => m.difficulty !== 'Beginner' && !recommendations.some(r => r.id === m.id));
        recommendations.push(...advancedModules.slice(0, 2));
    }

    return [...new Map(recommendations.map(item => [item.id, item])).values()].slice(0, 4);
  }, [currentUser, bookings, machinery]);
  
  const handleSafetyQuery = () => {
    const query = safetyQuery.toLowerCase();
    if (query.includes('slope') || query.includes('hill') || query.includes('uneven')) {
      setSafetyTip({ type: 'warning', message: "Operating on slopes is high-risk. Always keep the heavy end of the machine uphill, avoid sharp turns, and maintain a slow, steady speed. Refer to module 'Operating on Uneven Terrain' for more details." });
    } else if (query.includes('maintenance') || query.includes('check')) {
      setSafetyTip({ type: 'tip', message: "Daily pre-operation checks are crucial. Inspect fluid levels, tire pressure, and safety guards before starting any machinery. A well-maintained machine is a safe machine." });
    } else if (query.includes('power line') || query.includes('electric')) {
        setSafetyTip({ type: 'warning', message: "Extreme danger! Stay at least 10 feet away from overhead power lines. Lower all extensions and equipment before moving near them. Contact with power lines can be fatal." });
    } else {
      setSafetyTip({ type: 'info', message: "For general safety, always read the operator's manual, be aware of your surroundings, and never operate machinery when tired. If you have a specific question, try rephrasing it." });
    }
  };

  const SafetyTipIcon = ({ type }: { type: 'tip' | 'warning' | 'info' }) => {
    switch (type) {
      case 'tip': return <ShieldCheck className="text-green-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-red-500" size={24} />;
      case 'info': return <Info className="text-blue-500" size={24} />;
      default: return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Beginner': return 'bg-green-100/80 text-green-800';
        case 'Intermediate': return 'bg-yellow-100/80 text-yellow-800';
        case 'Advanced': return 'bg-red-100/80 text-red-800';
        default: return 'bg-gray-100/80 text-gray-800';
    }
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
        <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)]">
          <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-2 flex items-center gap-3">
            <ShieldCheck className="text-[var(--app-primary)]" size={36} />
            AI-Powered Safety Assistant
          </h2>
          <p className="text-[var(--app-text-secondary)] mb-6">Ask a question about machinery operation to get an instant safety tip.</p>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={safetyQuery}
                onChange={(e) => setSafetyQuery(e.target.value)}
                placeholder="e.g., 'How to work safely on a slope?'"
                className="w-full pl-12 pr-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70"
              />
            </div>
            <button onClick={handleSafetyQuery} className="bg-[var(--app-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all">
              Get Tip
            </button>
          </div>
          {safetyTip && (
            <div className="frosted-subtle rounded-xl p-4 flex items-start gap-4 animate-fade-in-up">
              <SafetyTipIcon type={safetyTip.type} />
              <p className="flex-1 text-[var(--app-text-secondary)]">{safetyTip.message}</p>
            </div>
          )}
        </div>

        <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)]">
          <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-6 flex items-center gap-3">
            <UserCheck className="text-purple-500" size={36} />
            Recommended For You
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendedModules.map(module => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className="bg-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg hover:border-purple-300/80 transition-all text-left"
              >
                  <div className="flex items-start gap-4">
                      <div className="text-4xl">{module.icon}</div>
                      <div className='flex-1'>
                          <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-2">{module.title}</h3>
                          <p className="text-sm text-[var(--app-text-secondary)] mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(module.difficulty)}`}>{module.difficulty}</span>
                              <span className="flex items-center gap-1 text-[var(--app-text-secondary)]"><Clock size={14} /> {module.duration} min</span>
                          </div>
                      </div>
                  </div>
              </button>
            ))}
          </div>
        </div>

        <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)]">
          <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-6 flex items-center gap-3">
            <BookOpen className="text-blue-500" size={36} />
            Training Library
          </h2>
          <div className="space-y-4">
            {TRAINING_MODULES.map(module => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className="w-full frosted-subtle rounded-xl p-4 flex items-center gap-4 hover:bg-blue-500/10 transition-colors"
              >
                  <div className="text-4xl">{module.icon}</div>
                  <div className='flex-1 text-left'>
                      <h3 className="font-bold text-[var(--app-text-primary)]">{module.title}</h3>
                      <p className="text-sm text-[var(--app-text-secondary)]">{module.description}</p>
                  </div>
                  <div className="text-right">
                      <span className={`block mb-2 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(module.difficulty)}`}>{module.difficulty}</span>
                      <span className="text-sm flex items-center gap-1 text-[var(--app-text-secondary)]"><Clock size={14} /> {module.duration} min</span>
                  </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {selectedModule && (
        <TrainingModuleModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
        />
      )}
    </>
  );
};

export default TrainingTab;