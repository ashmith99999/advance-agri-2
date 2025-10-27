
import React, { useState } from 'react';
import { Machinery, WeatherData, YieldPredictionResult } from '../../types';
import { CROP_TYPES, SOIL_TYPES, REGIONS, CROP_YIELD_DATA } from '../../constants';
import { BarChart3, Sparkles, TrendingUp, ThumbsUp, ThumbsDown, Star, Phone, MapPin } from 'lucide-react';

interface YieldTabProps {
  machinery: Machinery[];
  weatherData: WeatherData | null;
  handleRentClick: (machine: Machinery) => void;
}

const YieldTab: React.FC<YieldTabProps> = ({ machinery, weatherData, handleRentClick }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [region, setRegion] = useState('');
  const [prediction, setPrediction] = useState<YieldPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictYield = () => {
    if (!selectedCrop || !farmSize || !soilType || !plantingDate || !region) return;

    setIsLoading(true);
    setPrediction(null);

    setTimeout(() => {
      const cropData = CROP_YIELD_DATA[selectedCrop];
      if (!cropData) {
        setIsLoading(false);
        return;
      }

      let yieldModifier = 1.0;
      let confidence = 95;
      const positiveFactors: string[] = [];
      const negativeFactors: string[] = [];

      // Soil Factor
      if (cropData.optimalSoils.includes(soilType)) {
        yieldModifier += 0.15;
        positiveFactors.push(`Excellent soil match (${soilType}) for ${selectedCrop}.`);
      } else {
        yieldModifier -= 0.10;
        negativeFactors.push(`Soil type (${soilType}) is not optimal for ${selectedCrop}.`);
        confidence -= 5;
      }

      // Planting Date Factor
      const plantingMonth = new Date(plantingDate).getMonth();
      if (plantingMonth === cropData.optimalPlantingMonth) {
        yieldModifier += 0.10;
        positiveFactors.push('Planted within the optimal window for maximum growth.');
      } else if (Math.abs(plantingMonth - cropData.optimalPlantingMonth) <= 1) {
        yieldModifier -= 0.05;
        negativeFactors.push('Planting date is slightly off-season.');
        confidence -= 5;
      } else {
        yieldModifier -= 0.20;
        negativeFactors.push('Planting is significantly off-season, impacting growth.');
        confidence -= 15;
      }

      // Weather Factor
      if (weatherData?.forecast.some(d => d.rainfall > 80)) {
        yieldModifier -= 0.15;
        negativeFactors.push('Forecast predicts heavy rain, potential risk of flooding.');
        confidence -= 10;
      } else {
        positiveFactors.push('Favorable weather conditions expected.');
      }

      const finalYield = cropData.baseYield * parseFloat(farmSize) * yieldModifier;

      // Equipment Recommendation
      const recommendedEquipment = machinery
        .filter(m => m.suitable.includes(selectedCrop) && (finalYield > 20 ? parseInt(m.power) > 50 : parseInt(m.power) > 0))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 2);

      setPrediction({
        predictedYield: finalYield.toFixed(2),
        unit: 'tons',
        confidence: Math.max(50, confidence),
        influencingFactors: {
          positive: positiveFactors,
          negative: negativeFactors,
        },
        recommendedEquipment,
      });

      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)]">
        <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-2 flex items-center gap-3">
          <BarChart3 className="text-blue-500" size={36} />
          AI Crop Yield Prediction
        </h2>
        <p className="text-[var(--app-text-secondary)] mb-8">Forecast your harvest and get recommendations for optimal equipment.</p>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-white/70 px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition">
            <option value="">Select Crop Type</option>
            {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="Farm Size (acres)" className="w-full px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition bg-white/70" />
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full bg-white/70 px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition">
            <option value="">Select Soil Type</option>
            {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} className="w-full px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition bg-white/70" />
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-white/70 px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition">
            <option value="">Select Region</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <button onClick={handlePredictYield} disabled={!selectedCrop || !farmSize || !soilType || !plantingDate || !region || isLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
          {isLoading ? <><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing Data...</> : <><Sparkles size={24} /> Predict Yield</>}
        </button>
      </div>

      {prediction && (
        <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)] space-y-8 animate-fade-in-up">
          <div>
            <h3 className="text-2xl font-bold text-[var(--app-text-primary)] mb-4">Prediction Results</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm text-white rounded-2xl p-6 text-center border border-white/20">
                <p className="text-lg opacity-80">Predicted Yield</p>
                <p className="text-6xl font-bold my-2">{prediction.predictedYield}</p>
                <p className="text-lg font-semibold">{prediction.unit}</p>
              </div>
              <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-green-200/50">
                <p className="text-lg text-gray-600">AI Confidence Score</p>
                <p className="text-6xl font-bold my-2 text-green-600">{prediction.confidence}%</p>
                <p className="text-gray-500">Based on provided data</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4">Influencing Factors</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 p-4 rounded-xl border-2 border-green-200/50">
                <h4 className="font-bold text-green-700 flex items-center gap-2 mb-2"><ThumbsUp size={20} /> Positive Factors</h4>
                <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">{prediction.influencingFactors.positive.map((f, i) => <li key={i}>{f}</li>)}</ul>
              </div>
              <div className="bg-red-500/10 p-4 rounded-xl border-2 border-red-200/50">
                <h4 className="font-bold text-red-700 flex items-center gap-2 mb-2"><ThumbsDown size={20} /> Negative Factors</h4>
                <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">{prediction.influencingFactors.negative.map((f, i) => <li key={i}>{f}</li>)}</ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-[var(--app-text-primary)] mb-4">Recommended Equipment for Optimal Yield</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {prediction.recommendedEquipment.map(machine => (
                <div key={machine.id} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{machine.image}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[var(--app-text-primary)]">{machine.name}</h4>
                      <div className="text-sm text-[var(--app-text-secondary)] mb-2">{machine.type} • {machine.power}</div>
                      <div className="flex items-center gap-2 text-sm mb-2"><Star className="text-yellow-400 fill-yellow-400" /> {machine.rating}</div>
                      <div className="text-xl font-bold text-green-600">₹{machine.price}/day</div>
                    </div>
                    <button onClick={() => handleRentClick(machine)} className="bg-[var(--app-primary)] text-white py-2 px-4 rounded-lg font-semibold">Rent Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default YieldTab;