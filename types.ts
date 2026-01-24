
export enum TravelStyle {
  RELAXED = 'relaxed',
  BALANCED = 'balanced',
  PACKED = 'packed'
}

export enum GroupType {
  SOLO = 'solo',
  COUPLE = 'couple',
  FRIENDS = 'friends',
  FAMILY = 'family'
}

export enum TravelMode {
  FLIGHT = 'flight',
  TRAIN = 'train',
  ROAD = 'road'
}

export enum RoadVehicleType {
  PERSONAL_CAR = 'personal_car',
  BIKE = 'bike',
  BUS = 'bus',
  TAXI = 'taxi'
}

export interface User {
  name: string;
  email: string;
}

export interface UserInput {
  originCountry: string;
  originState: string;
  originCity: string;
  destinationCountry: string;
  destinationState: string;
  destinationCity: string;
  startDate: string;
  endDate: string;
  budget: number;
  style: TravelStyle;
  interests: string[];
  groupType: GroupType;
  travelMode: TravelMode;
  roadVehicleType?: RoadVehicleType;
  constraints: string;
  mustVisitPlaces: string;
  specialGoals: string;
  naturalLanguagePrompt?: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  energyLevel: 'Low' | 'Medium' | 'High';
  activities: Activity[];
  travelLogic: string;
  reasoning: string;
}

export interface BudgetBreakdown {
  stay: number;
  transport: number;
  food: number;
  activities: number;
  buffer: number;
}

export interface TripPlan {
  summary: string;
  detectedStyle: string;
  keyAssumptions: string[];
  itinerary: ItineraryDay[];
  budget: BudgetBreakdown;
  alternatives: {
    lazyDay: string;
    rainyDay: string;
    upgrade: string;
  };
  smartTips: string[];
}
