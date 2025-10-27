
import React from 'react';
import { CollectiveBooking, Machinery, User } from '../types';
import { XCircle, MapPin, Calendar, Users, CheckCircle } from 'lucide-react';

interface CollectiveModalProps {
  collective: CollectiveBooking;
  machinery: Machinery[];
  currentUser: User;
  onClose: () => void;
  onJoin: () => void;
}

const CollectiveModal: React.FC<CollectiveModalProps> = ({ collective, machinery, currentUser, onClose, onJoin }) => {
  const machineImage = machinery.find(m => m.id === collective.machineryId)?.image || '🚜';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Join Cost-Sharing Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
        </div>

        <div className="bg-green-500/10 rounded-2xl p-6 mb-6 border-2 border-green-200/50">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{machineImage}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{collective.machinery}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin size={14} />
                <span>{collective.location} • {collective.distance}km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar size={14} />
                <span>Date: {collective.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 rounded-2xl p-6 mb-6 border-2 border-green-300/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Savings</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Regular Price:</span>
              <span className="text-xl text-gray-500 line-through">₹{collective.originalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shared Price:</span>
              <span className="text-xl font-bold text-green-600">₹{collective.sharedPrice}</span>
            </div>
            <div className="border-t-2 border-green-300/50 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold">You Save:</span>
                <span className="text-3xl font-bold text-green-600">₹{collective.savings}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Group Members</h3>
          <div className="space-y-2">
            {collective.members.map((member, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-500/10 rounded-xl">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{member}</div>
                  <div className="text-xs text-gray-600">Confirmed</div>
                </div>
                <CheckCircle className="ml-auto text-green-500" size={20} />
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border-2 border-blue-400/50 border-dashed">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{currentUser?.name} (You)</div>
                <div className="text-xs text-blue-600 font-semibold">Joining now</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 border-2 border-gray-300/50 text-gray-700 rounded-xl font-bold hover:bg-gray-500/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onJoin}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[var(--app-primary)] to-green-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Users size={24} />
            Join & Pay ₹{collective.sharedPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectiveModal;