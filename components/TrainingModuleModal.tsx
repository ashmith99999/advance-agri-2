
import React from 'react';
import { TrainingModule } from '../types';
import { XCircle, PlayCircle, CheckSquare, Youtube } from 'lucide-react';

interface TrainingModuleModalProps {
  module: TrainingModule;
  onClose: () => void;
}

const TrainingModuleModal: React.FC<TrainingModuleModalProps> = ({ module, onClose }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Beginner': return 'bg-green-100/80 text-green-800 border-green-200/80';
        case 'Intermediate': return 'bg-yellow-100/80 text-yellow-800 border-yellow-200/80';
        case 'Advanced': return 'bg-red-100/80 text-red-800 border-red-200/80';
        default: return 'bg-gray-100/80 text-gray-800 border-gray-200/80';
    }
  };

  const renderContent = () => {
    if (!module.content) {
      return <p className="text-gray-600">Detailed content coming soon.</p>;
    }

    switch (module.content.type) {
      case 'checklist':
        return (
          <div className="space-y-3">
            {module.content.items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-500/10 rounded-lg">
                <CheckSquare className="text-[var(--app-primary)] mt-1" size={20} />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        );
      case 'video':
        return (
          <div>
            <div className="bg-black rounded-xl p-6 text-center text-white aspect-video flex flex-col items-center justify-center mb-4">
              <PlayCircle size={64} className="text-white/80 mb-4" />
              <h4 className="text-xl font-bold">Video Content</h4>
              <p className="text-white/70 max-w-sm">{module.content.items[0]}</p>
            </div>
            {module.content.links && (
              <div>
                <h4 className="font-bold text-gray-700 mb-2">Recommended YouTube Channels:</h4>
                <div className="space-y-2">
                  {module.content.links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group"
                    >
                      <Youtube className="text-red-500" size={24} />
                      <span className="text-red-800 font-semibold group-hover:underline">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-200/50">
            <p className="text-blue-800">{module.content.items[0]}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{module.icon}</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{module.title}</h2>
              <div className={`mt-1 w-fit px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-gray-500/10 rounded-xl">
          <h3 className="font-bold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{module.description}</p>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-4 text-lg">Module Content</h3>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TrainingModuleModal;