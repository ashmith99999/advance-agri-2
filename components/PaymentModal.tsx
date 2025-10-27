
import React, { useState } from 'react';
import { Machinery } from '../types';
import { XCircle, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  machinery: Machinery;
  onClose: () => void;
  onComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ machinery, onClose, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  const totalPrice = Math.round(machinery.price * 1.18);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{machinery.image}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{machinery.name}</h3>
              <p className="text-gray-600">{machinery.type} • {machinery.power}</p>
              <div className="text-3xl font-bold text-green-600 mt-2">₹{machinery.price}/day</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Base Price</span>
            <span className="font-semibold">₹{machinery.price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-semibold">₹{Math.round(machinery.price * 0.18)}</span>
          </div>
          <div className="border-t-2 border-gray-200 my-3"></div>
          <div className="flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={24} />
              Pay ₹{totalPrice}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
