
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserInput, TripPlan, TravelMode, User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRIP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    detectedStyle: { type: Type.STRING },
    keyAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          energyLevel: { type: Type.STRING, description: "One of: Low, Medium, High" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING }
              },
              required: ["time", "title", "description", "location"]
            }
          },
          travelLogic: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["dayNumber", "theme", "energyLevel", "activities", "travelLogic", "reasoning"]
      }
    },
    budget: {
      type: Type.OBJECT,
      properties: {
        stay: { type: Type.NUMBER },
        transport: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        activities: { type: Type.NUMBER },
        buffer: { type: Type.NUMBER }
      },
      required: ["stay", "transport", "food", "activities", "buffer"]
    },
    alternatives: {
      type: Type.OBJECT,
      properties: {
        lazyDay: { type: Type.STRING },
        rainyDay: { type: Type.STRING },
        upgrade: { type: Type.STRING }
      },
      required: ["lazyDay", "rainyDay", "upgrade"]
    },
    smartTips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["summary", "detectedStyle", "keyAssumptions", "itinerary", "budget", "alternatives", "smartTips"]
};

export async function generateTripPlan(input: UserInput, user: User | null): Promise<TripPlan> {
  const origin = `${input.originCity}, ${input.originState}, ${input.originCountry}`;
  const destination = `${input.destinationCity}, ${input.destinationState}, ${input.destinationCountry}`;
  
  const isRoadTrip = input.travelMode === TravelMode.ROAD;
  const roadContext = isRoadTrip ? `The user is travelling via ROAD using a ${input.roadVehicleType}. 
    Calculate estimated fuel costs (approx ₹100/L) and maintenance based on the distance from ${origin} to ${destination}. 
    Factor in highway tolls for major routes in the specific countries mentioned.` : '';

  const userName = user?.name || "Traveler";

  const systemInstruction = `
    You are VentureMind AI, an expert personal travel architect. Your client today is ${userName}.
    Always address ${userName} by name in the summary or reasoning if appropriate.
    Your goal is to create realistic, human-centric travel decisions, not just lists.
    
    REASONING PIPELINE:
    1. Intent Extraction: Infer pace tolerance and energy curves for ${userName}.
    2. Context Awareness: Deeply analyze the journey from ${origin} to ${destination}.
    3. Logistics Analysis: 
       - If Flight/Train: Prioritize time efficiency and transit logic.
       - If Road: ${roadContext} Account for driver fatigue and mandatory breaks.
    4. Attraction Selection: Group sights by proximity. Prioritize "Must-Visit" locations: ${input.mustVisitPlaces || 'None specified'}.
    5. Critic & Optimizer: Review for route backtracking and budget feasibility (Budget: ₹${input.budget}).
    6. Explanation Layer: Justify groupings and energy trade-offs to ${userName}.

    ALL BUDGET CALCULATIONS AND OUTPUTS MUST BE IN INDIAN RUPEES (INR / ₹). 
  `;

  const prompt = `
    Create a detailed trip plan for ${userName}:
    Travelling From: ${origin}
    Destination: ${destination}
    Travel Mode: ${input.travelMode} ${input.roadVehicleType ? `(${input.roadVehicleType})` : ''}
    Dates: ${input.startDate} to ${input.endDate}
    Total Budget: ₹${input.budget}
    Style: ${input.style}
    Interests: ${input.interests.join(', ')}
    Group: ${input.groupType}
    Must-Visit Locations: ${input.mustVisitPlaces || 'None specified'}
    Constraints: ${input.constraints}
    Special Goals: ${input.specialGoals}
    Additional Info: ${input.naturalLanguagePrompt || 'None'}
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: TRIP_SCHEMA,
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });

  return JSON.parse(response.text || '{}') as TripPlan;
}

export async function replanTrip(currentPlan: TripPlan, userUpdate: string, user: User | null): Promise<TripPlan> {
  const userName = user?.name || "Traveler";
  const systemInstruction = `
    You are VentureMind AI, the dynamic travel re-planner for ${userName}.
    The user has a current plan but needs an immediate adjustment.
    Address ${userName} by name and explain why this new trajectory makes sense for them.
    Apply the logic of the original architecture (energy, logistics, explanations) to modify the plan.
    Keep all budget items in Indian Rupees (INR / ₹).
    Always return a full updated TripPlan JSON.
  `;

  const prompt = `
    Current Plan Summary: ${currentPlan.summary}
    Change Requested by ${userName}: "${userUpdate}"
    Please adjust the remaining days of the itinerary to accommodate this while maintaining realistic travel times and energy levels.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: TRIP_SCHEMA,
      thinkingConfig: { thinkingBudget: 32768 }
    },
  });

  return JSON.parse(response.text || '{}') as TripPlan;
}
