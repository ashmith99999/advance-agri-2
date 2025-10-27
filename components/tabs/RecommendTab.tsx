import React, { useState } from 'react';
import { Machinery, WeatherData, DiseaseDetectionResult } from '../../types';
import { CROP_TYPES, SOIL_TYPES } from '../../constants';
import { Zap, Sparkles, MapPin, Star, Phone, CheckCircle, Package, AlertCircle, ClipboardList, Shield, Droplets, Tractor, Beaker } from 'lucide-react';

interface RecommendTabProps {
  machinery: Machinery[];
  weatherData: WeatherData | null;
  handleRentClick: (machine: Machinery) => void;
}

const RecommendTab: React.FC<RecommendTabProps> = ({ machinery, weatherData, handleRentClick }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [diseaseImage, setDiseaseImage] = useState<string | null>(null);
  const [diseaseDetection, setDiseaseDetection] = useState<DiseaseDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateDynamicPrice = (basePrice: number, demand: string, farmSize: number) => {
    let multiplier = 1;
    if (demand === 'high') multiplier = 1.3;
    else if (demand === 'low') multiplier = 0.8;
    const sizeMultiplier = farmSize > 50 ? 0.9 : farmSize > 20 ? 1 : 1.1;
    return Math.round(basePrice * multiplier * sizeMultiplier);
  };

  const getMachineryRecommendations = () => {
    if (!selectedCrop || !farmSize) return;
    
    let suitable = machinery.filter(m => m.suitable.includes(selectedCrop));
    
    if (soilType) {
      suitable = suitable.filter(m => m.soilSuitability.includes(soilType));
    }
    
    const farmSizeNum = parseFloat(farmSize);
    const scored = suitable.map(m => {
      let score = m.rating * 20;
      score += m.demand === 'high' ? 10 : m.demand === 'medium' ? 5 : 0;
      score += m.distance <= 25 ? 15 : m.distance <= 50 ? 10 : 5;
      if (soilType && m.soilSuitability.includes(soilType)) score += 20;
      if (weatherData && weatherData.forecast.some(d => d.rainfall > 50)) {
        if (m.type === 'Sprayer') score += 15;
      }
      if (farmSizeNum > 50 && parseInt(m.power) > 70) score += 10;
      else if (farmSizeNum <= 20 && parseInt(m.power) < 50) score += 10;
      
      return {
        ...m,
        score: Math.min(100, score),
        dynamicPrice: calculateDynamicPrice(m.price, m.demand, farmSizeNum)
      };
    });
    
    scored.sort((a, b) => b.score - a.score);
    setRecommendations(scored.slice(0, 3));
    setShowRecommendations(true);
  };

  const analyzeCropDisease = () => {
    setIsAnalyzing(true);
    setDiseaseDetection(null);
    setTimeout(() => {
      const diseases: DiseaseDetectionResult[] = [
        { 
          name: 'Leaf Blight', 
          confidence: 89, 
          severity: 'High', 
          treatment: {
            summary: 'Systemic fungicide application is crucial. Apply every 7-10 days for effective control.',
            steps: [
              'Mix fungicide with water according to label instructions.',
              'Ensure complete plant coverage, including undersides of leaves.',
              'Alternate between different fungicide groups to prevent resistance.'
            ],
            recommendedProducts: ['Azoxystrobin', 'Propiconazole']
          },
          causes: [
            { title: 'High Humidity', description: 'Spores thrive in moist environments over 85% humidity.' },
            { title: 'Poor Air Circulation', description: 'Dense foliage traps moisture, creating an ideal breeding ground.' },
            { title: 'Infected Debris', description: 'Fungus can survive winters in leftover plant material on the soil.' }
          ],
          prevention: [
            { title: 'Disease-Resistant Varieties', description: 'Choose crop varieties specifically bred for resistance to blight.' },
            { title: 'Proper Spacing', description: 'Allows for better airflow, helping leaves dry faster.' },
            { title: 'Crop Rotation', description: 'Avoid planting susceptible crops in the same field for at least two years.' }
          ],
          recommendedEquipment: [
            { id: 5, reason: 'Provides fine mist for even fungicide application on dense foliage.' }
          ], 
          urgency: 'high' 
        },
        { 
          name: 'Rust Disease', 
          confidence: 76, 
          severity: 'Medium', 
          treatment: {
            summary: 'Apply a foliar fungicide at the first sign of rust pustules to prevent widespread infection.',
            steps: [
                'Monitor fields weekly, especially after warm, damp weather.',
                'Apply fungicide early in the morning when winds are calm.',
                'Consider a second application after 14 days if conditions persist.'
            ],
            recommendedProducts: ['Tebuconazole', 'Myclobutanil']
          },
          causes: [
            { title: 'Windborne Spores', description: 'Spores can travel long distances on wind currents.' },
            { title: 'Moisture on Leaves', description: 'Spores require several hours of moisture on leaf surfaces to germinate.' }
          ],
          prevention: [
            { title: 'Plant Resistant Varieties', description: 'This is the most effective long-term prevention strategy.' },
            { title: 'Avoid Overhead Irrigation', description: 'Watering the soil directly minimizes leaf wetness duration.' }
          ],
          recommendedEquipment: [
            { id: 5, reason: 'Efficient for large-area foliar application needed to combat rust.' }
          ], 
          urgency: 'medium' 
        },
      ];
      setDiseaseDetection(diseases[Math.floor(Math.random() * diseases.length)]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDiseaseImage(event.target?.result as string);
        analyzeCropDisease();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)]">
        <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-2 flex items-center gap-3">
          <Zap className="text-yellow-500" size={36} />
          AI-Powered Recommendations
        </h2>
        <p className="text-[var(--app-text-secondary)] mb-8">Get personalized machinery suggestions based on your farm.</p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-white/70 px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition">
            <option value="">Select crop type</option>
            {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="Farm Size (acres)" className="w-full px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition bg-white/70" />
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full bg-white/70 px-4 py-3 border border-[var(--app-border)] rounded-xl focus:border-[var(--app-primary)] focus:ring-2 focus:ring-[var(--app-primary-light)] focus:outline-none transition">
            <option value="">Select soil type (optional)</option>
            {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button onClick={getMachineryRecommendations} disabled={!selectedCrop || !farmSize} className="w-full bg-gradient-to-r from-[var(--app-primary)] to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
          <Sparkles size={24} /> Get AI Recommendations
        </button>

        {showRecommendations && (
          <div className="mt-8 space-y-4 animate-fade-in-up">
            {recommendations.length > 0 ? (
              <>
                <h3 className="text-2xl font-bold text-[var(--app-text-primary)]">Top Recommendations for You</h3>
                {recommendations.map((m, i) => (
                  <div key={m.id} className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{m.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-[var(--app-text-primary)]">{m.name}</h4>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">#{i + 1} Best Match</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="bg-white/50 rounded-lg p-3 border border-white/30"><div className="text-xs text-[var(--app-text-secondary)]">Price</div><div className="text-2xl font-bold text-green-600">₹{m.dynamicPrice}</div></div>
                          <div className="bg-white/50 rounded-lg p-3 border border-white/30"><div className="text-xs text-[var(--app-text-secondary)]">AI Score</div><div className="text-2xl font-bold text-blue-600">{Math.round(m.score)}%</div></div>
                          <div className="bg-white/50 rounded-lg p-3 border border-white/30"><div className="text-xs text-[var(--app-text-secondary)]">Rating</div><div className="flex items-center gap-1"><Star className="text-yellow-400 fill-yellow-400" size={20} /><span className="text-2xl font-bold">{m.rating}</span></div></div>
                        </div>
                        <div className="bg-yellow-400/20 rounded-lg p-3 border border-yellow-400/30 text-sm"><span className="font-bold">Recommended for:</span> {selectedCrop} on {farmSize} acres.</div>
                      </div>
                      <div className="flex flex-col gap-2"><button onClick={() => handleRentClick(m)} className="bg-gradient-to-r from-[var(--app-primary)] to-green-600 text-white px-6 py-3 rounded-xl font-semibold">Book Now</button><a href={`tel:${m.phone}`} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><Phone size={18} /> Call</a></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 frosted-subtle rounded-2xl"><div className="text-6xl mb-4">😔</div><h3 className="text-xl font-bold">No Suitable Machinery Found</h3><p className="text-[var(--app-text-secondary)]">We couldn't find machinery for {selectedCrop}.</p></div>
            )}
          </div>
        )}
      </div>

      <div className="frosted-card rounded-2xl p-8 shadow-[var(--app-shadow)]">
        <h2 className="text-3xl font-bold text-[var(--app-text-primary)] mb-2 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={36} /> AI Crop Disease Detection
        </h2>
        <p className="text-[var(--app-text-secondary)] mb-8">Upload an image of a crop leaf to detect diseases.</p>
        
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="w-full h-64 border-2 border-dashed border-gray-300/50 rounded-xl flex items-center justify-center bg-black/5 relative">
              {diseaseImage ? <img src={diseaseImage} alt="Crop" className="w-full h-full object-contain rounded-xl p-2" /> : <div className="text-center text-[var(--app-text-secondary)]"><Package size={48} className="mx-auto mb-2" /><p>Upload an image to start analysis</p></div>}
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100/80 file:text-green-700 hover:file:bg-green-200/80 cursor-pointer"/>
          </div>
          <div className="h-full max-h-[450px]">
            {isAnalyzing && <div className="flex flex-col items-center justify-center h-full bg-blue-500/10 rounded-xl p-4 border border-blue-200/50"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-blue-700 font-semibold">Analyzing Image...</p></div>}
            {diseaseDetection && !isAnalyzing && (
              <div className={`frosted-card rounded-2xl p-4 border-2 ${
                  diseaseDetection.urgency === 'high' ? 'border-red-300/50' : 'border-orange-300/50'
              } h-full overflow-y-auto`}>
                  <h4 className="text-xl font-bold text-[var(--app-text-primary)] mb-2">Analysis Complete</h4>
                  <div className={`p-3 rounded-lg mb-4 ${
                      diseaseDetection.urgency === 'high' ? 'bg-red-500/20' : 'bg-orange-500/20'
                  }`}>
                      <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          <AlertCircle className={`${
                              diseaseDetection.urgency === 'high' ? 'text-red-600' : 'text-orange-600'
                          }`} />
                          {diseaseDetection.name}
                      </div>
                      <div className="text-sm text-gray-600 ml-8">Confidence: {diseaseDetection.confidence}% | Severity: {diseaseDetection.severity}</div>
                  </div>

                  <div className="space-y-4 text-sm">
                      <div>
                          <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><ClipboardList size={18} className="text-blue-500" /> Potential Causes</h5>
                          <div className="space-y-2 pl-2">
                              {diseaseDetection.causes.map((cause, i) => <div key={i} className="p-2 bg-blue-500/10 rounded-md border border-blue-100/50"><p className="font-semibold text-gray-800">{cause.title}</p><p className="text-gray-600">{cause.description}</p></div>)}
                          </div>
                      </div>
                       <div>
                          <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Shield size={18} className="text-green-500" /> Preventative Measures</h5>
                          <div className="space-y-2 pl-2">
                              {diseaseDetection.prevention.map((item, i) => <div key={i} className="p-2 bg-green-500/10 rounded-md border border-green-100/50"><p className="font-semibold text-gray-800">{item.title}</p><p className="text-gray-600">{item.description}</p></div>)}
                          </div>
                      </div>
                      <div>
                          <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Droplets size={18} className="text-red-500" /> Immediate Treatment Plan</h5>
                          <div className="pl-2 space-y-3">
                            <p className="p-2 bg-red-500/10 rounded-md text-gray-600 border border-red-100/50">{diseaseDetection.treatment.summary}</p>
                            <div>
                                <h6 className="font-semibold text-gray-800">Steps:</h6>
                                <ol className="list-decimal list-inside space-y-1 mt-1 text-gray-600">
                                    {diseaseDetection.treatment.steps.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>
                             <div>
                                <h6 className="font-semibold text-gray-800 flex items-center gap-1"><Beaker size={14} /> Active Ingredients:</h6>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {diseaseDetection.treatment.recommendedProducts.map((prod, i) => <span key={i} className="px-2 py-1 bg-gray-200/80 text-gray-800 text-xs font-medium rounded-full">{prod}</span>)}
                                </div>
                            </div>
                          </div>
                      </div>
                      <div>
                          <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Tractor size={18} className="text-orange-500" /> Recommended Equipment</h5>
                          <div className="space-y-3">
                              {diseaseDetection.recommendedEquipment.map(rec => {
                                  const machine = machinery.find(m => m.id === rec.id);
                                  if (!machine) return null;
                                  return (
                                      <div key={rec.id} className="bg-white/50 p-3 rounded-lg border border-white/30">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{machine.image}</span>
                                                <div>
                                                    <p className="font-semibold">{machine.name}</p>
                                                    <p className="text-xs text-[var(--app-text-secondary)]">₹{machine.price}/day</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRentClick(machine)} className="bg-[var(--app-primary)] text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-600 transition-all">Rent</button>
                                        </div>
                                        <div className="mt-2 text-xs p-2 bg-yellow-400/20 rounded-md border border-yellow-400/30">
                                            <span className="font-bold text-yellow-800">Reason:</span> {rec.reason}
                                        </div>
                                      </div>
                                  )
                              })}
                          </div>
                      </div>
                  </div>
              </div>
            )}
            {!diseaseDetection && !isAnalyzing && <div className="flex flex-col items-center justify-center h-full frosted-subtle rounded-xl p-4 text-center"><CheckCircle size={48} className="text-gray-400 mb-2" /><p className="text-[var(--app-text-secondary)] font-semibold">Results will appear here</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendTab;