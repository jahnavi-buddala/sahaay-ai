export type HazardType = 
  | 'Waterlogging' 
  | 'Flooded Road' 
  | 'Road Obstruction' 
  | 'Damaged Road' 
  | 'Other';

export type IncidentStatus = 
  | 'unverified' 
  | 'corroborated' 
  | 'verified' 
  | 'resolved' 
  | 'stale';

export type RiskLevel = 
  | 'Limited evidence' 
  | 'Use caution' 
  | 'Elevated concern'
  | 'Resolved / Cleared';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
}

export interface AIAnalysis {
  status: string;
  model_name?: string;
  confidence: number;
  predicted_labels: string[];
  interpretation: string;
  limitations: string;
  human_reviewed: boolean;
  image_metrics?: {
    resolution?: string;
    specular_reflectance_ratio?: number;
    turbidity_indicator?: number;
    surface_uniformity?: string;
  };
}

export interface WeatherContext {
  precipitation_mm: number;
  temperature_c?: number;
  wind_speed_kmh?: number;
  weather_code?: number;
  rain_probability_pct: number;
  expected_rain_next_6h_mm?: number;
  observation_timestamp: string;
  source: string;
  data_status: 'live' | 'cached' | 'service_unavailable';
  context_note?: string;
}

export interface RiskBreakdown {
  score: number;
  level: RiskLevel;
  breakdown: {
    visual: number;
    corroboration: number;
    rainfall: number;
    freshness: number;
    location_quality: number;
  };
  weights?: {
    max_visual: number;
    max_corroboration: number;
    max_rainfall: number;
    max_freshness: number;
    max_quality: number;
  };
  factors: string[];
  missing_data: string[];
}

export interface Incident {
  id: string;
  user_id?: string | null;
  hazard_type: HazardType;
  title?: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  photo_url?: string | null;
  observed_severity: 'low' | 'medium' | 'high';
  is_anonymous: boolean;
  status: IncidentStatus;
  duplicate_group_id?: string | null;
  ai_analysis?: AIAnalysis | null;
  weather_context?: WeatherContext | null;
  risk_score: number;
  risk_level: RiskLevel;
  risk_breakdown?: RiskBreakdown | null;
  review_notes?: string | null;
  reviewer_id?: string | null;
  flags_count: number;
  is_demo_data: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  incident_id: string;
  user_email: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface RouteCandidate {
  id: string;
  name: string;
  coordinates: [number, number][]; // [lat, lon]
  distance_km: number;
  duration_minutes: number;
  hazards_detected_count: number;
  hazards: {
    id: string;
    hazard_type: string;
    title?: string;
    risk_score: number;
    risk_level: string;
    distance_meters: number;
  }[];
  is_recommended: boolean;
}

export interface RouteComparisonResponse {
  status: string;
  routes: RouteCandidate[];
  comparison_summary: string;
  routing_limitations: string;
}
