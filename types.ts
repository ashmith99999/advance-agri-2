export type View = 'login' | 'signup' | 'main' | 'profile' | 'ownerDashboard' | 'adminDashboard';
export type UserRole = 'user' | 'owner' | 'admin';

export interface User {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalBookings: number;
  role: UserRole;
}

export interface Booking {
  id: number;
  machinery: string;
  date: string;
  status: 'upcoming' | 'completed';
  price: number;
  duration: number;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  time: string;
}

export interface Machinery {
  id: number;
  name: string;
  type: string;
  power: string;
  price: number;
  rating: number;
  image: string;
  location: string;
  address: string;
  distance: number;
  owner: string;
  phone: string;
  suitable: string[];
  demand: 'high' | 'medium' | 'low';
  soilSuitability: string[];
}

export interface WeatherDay {
    day: string;
    condition: string;
    temp: number;
    rainfall: number;
    icon: string;
    ideal: boolean;
    alert?: string;
}

export interface WeatherData {
    current: { temp: number; condition: string };
    forecast: WeatherDay[];
    recommendation: string;
    urgency: 'high' | 'medium' | 'low';
}

export interface CollectiveBooking {
    id: number;
    machinery: string;
    machineryId: number;
    location: string;
    distance: number;
    originalPrice: number;
    sharedPrice: number;
    currentMembers: number;
    requiredMembers: number;
    savings: number;
    date: string;
    members: string[];
    timeLeft: string;
}

export interface DiseaseDetail {
    title: string;
    description: string;
}

export interface TreatmentPlan {
    summary: string;
    steps: string[];
    recommendedProducts: string[];
}

export interface RecommendedEquipmentInfo {
    id: number;
    reason: string;
}

export interface DiseaseDetectionResult {
    name: string;
    confidence: number;
    severity: string;
    treatment: TreatmentPlan;
    causes: DiseaseDetail[];
    prevention: DiseaseDetail[];
    recommendedEquipment: RecommendedEquipmentInfo[];
    urgency: 'high' | 'medium' | 'low';
}

export interface YieldPredictionResult {
    predictedYield: string;
    unit: string;
    confidence: number;
    influencingFactors: {
      positive: string[];
      negative: string[];
    };
    recommendedEquipment: Machinery[];
}

export interface TrainingModule {
  id: number;
  title: string;
  type: 'Video' | 'Manual' | 'Quick Tip';
  machineryType: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  icon: string;
  description: string;
  content?: {
    type: 'checklist' | 'video' | 'text';
    items: string[];
    links?: { title: string; url: string; }[];
  };
}

export interface OwnerBooking {
  id: number;
  machineryName: string;
  renterName: string;
  startDate: string;
  endDate: string;
  earnings: number;
  status: 'upcoming' | 'completed' | 'in-progress';
}

export interface CustomerReview {
  id: number;
  renterName: string;
  machineryName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MaintenanceAlert {
  id: number;
  machineryName: string;
  issue: string;
  urgency: 'high' | 'medium' | 'low';
  dueDate: string;
}