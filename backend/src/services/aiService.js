// import 
// import { OPENAI_API_KEY, OPENAI_MODEL } from '../config/env.js';
// import ApiError from '../utils/ApiError.js';

// const openai = GEMINI_API_KEY ? new OpenAI({ apiKey: GEMINI_API_KEY }) : null;

// const buildPrompt = (profile) => `
// You are a certified fitness coach and nutritionist. Based on the user profile below,
// generate a personalized fitness plan. Respond ONLY with valid JSON, no markdown, no code fences,
// matching exactly this schema:

// {
//   "workoutPlan": "string - detailed workout plan description",
//   "dietSuggestions": "string - basic diet suggestions",
//   "dailyCalorieRecommendation": number,
//   "weeklySchedule": [
//     { "day": "Monday", "focus": "string", "exercises": ["string", "string"] }
//   ],
//   "fitnessTips": ["string", "string", "string"],
//   "weeklyMotivationMessage": "string"
// }

// User Profile:
// - Name: ${profile.name}
// - Age: ${profile.age}
// - Gender: ${profile.gender}
// - Height: ${profile.height} cm
// - Weight: ${profile.weight} kg
// - Fitness Goal: ${profile.fitnessGoal}
// - Activity Level: ${profile.activityLevel}
// - Workout Days Per Week: ${profile.workoutDaysPerWeek}

// Ensure weeklySchedule has exactly ${profile.workoutDaysPerWeek} workout day entries (rest days can be omitted).
// Keep workoutPlan and dietSuggestions concise but useful (150-250 words each).
// `;

// // Fallback deterministic generator - used if no API key configured (keeps app runnable for evaluation)
// const generateMockPlan = (profile) => {
//   const bmr =
//     profile.gender === 'Male'
//       ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
//       : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;

//   const activityMultiplier = { Beginner: 1.3, Intermediate: 1.55, Advanced: 1.75 };
//   const calories = Math.round(bmr * (activityMultiplier[profile.activityLevel] || 1.4));

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const weeklySchedule = days.slice(0, profile.workoutDaysPerWeek).map((day, i) => ({
//     day,
//     focus: ['Full Body', 'Upper Body', 'Lower Body', 'Cardio', 'Core & Mobility'][i % 5],
//     exercises: ['Warm-up (5-10 min)', 'Main workout circuit', 'Cool-down & stretching'],
//   }));

//   return {
//     workoutPlan: `A ${profile.activityLevel.toLowerCase()}-level plan tailored for ${profile.fitnessGoal.toLowerCase()}, spread across ${profile.workoutDaysPerWeek} days per week. Focus on progressive overload and consistent form.`,
//     dietSuggestions: `Prioritize whole foods, lean protein, complex carbs, and healthy fats. Stay hydrated and align intake with your ${profile.fitnessGoal.toLowerCase()} goal.`,
//     dailyCalorieRecommendation: calories,
//     weeklySchedule,
//     fitnessTips: [
//       'Warm up before every session and stretch afterward.',
//       'Prioritize sleep and recovery for consistent progress.',
//       'Track your workouts to stay motivated and monitor gains.',
//     ],
//     weeklyMotivationMessage: `Stay consistent, ${profile.name}! Every workout brings you closer to your goal.`,
//   };
// };

// export const generateFitnessPlan = async (profile) => {
//   if (!openai) {
//     console.warn('AI provider not configured (OPENAI_API_KEY missing) - using mock plan generator.');
//     return generateMockPlan(profile);
//   }

//   try {
//     const completion = await openai.chat.completions.create({
//       model: OPENAI_MODEL,
//       messages: [{ role: 'user', content: buildPrompt(profile) }],
//       temperature: 0.7,
//       response_format: { type: 'json_object' },
//     });

//     const raw = completion.choices[0]?.message?.content;
//     const parsed = JSON.parse(raw);

//     if (!parsed.workoutPlan || !parsed.dietSuggestions || !parsed.dailyCalorieRecommendation) {
//       throw new Error('AI response missing required fields');
//     }

//     return parsed;
//   } catch (err) {
//     console.error('AI generation failed:', err.message);
//     throw new ApiError(502, 'Failed to generate fitness plan from AI provider. Please try again.');
//   }
// };


import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const genAI = GEMINI_API_KEY
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

const buildPrompt = (profile) => `
You are a certified fitness coach and nutritionist.

Generate a personalized fitness plan.

Return ONLY valid JSON.

{
  "workoutPlan": "string",
  "dietSuggestions": "string",
  "dailyCalorieRecommendation": number,
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "string",
      "exercises": ["string"]
    }
  ],
  "fitnessTips": [
    "string"
  ],
  "weeklyMotivationMessage": "string"
}

User Profile:

Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height}
Weight: ${profile.weight}
Fitness Goal: ${profile.fitnessGoal}
Activity Level: ${profile.activityLevel}
Workout Days: ${profile.workoutDaysPerWeek}

Return JSON only.
`;

const generateMockPlan = (profile) => ({
  workoutPlan: `Workout ${profile.workoutDaysPerWeek} days every week focusing on ${profile.fitnessGoal}.`,
  dietSuggestions:
    "Eat high-protein foods, vegetables, fruits and drink plenty of water.",
  dailyCalorieRecommendation: 2200,
  weeklySchedule: [
    {
      day: "Monday",
      focus: "Full Body",
      exercises: [
        "Push Ups",
        "Squats",
        "Plank"
      ]
    }
  ],
  fitnessTips: [
    "Sleep 8 hours",
    "Stay hydrated",
    "Be consistent"
  ],
  weeklyMotivationMessage: `Keep going ${profile.name}!`
});

export const generateFitnessPlan = async (profile) => {
  if (!genAI) {
    console.warn(
      "Gemini API key not found. Using mock generator."
    );

    return generateMockPlan(profile);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    const result = await model.generateContent(
      buildPrompt(profile)
    );

    const response = await result.response;

    let text = response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const plan = JSON.parse(text);

    if (
      !plan.workoutPlan ||
      !plan.dietSuggestions ||
      !plan.dailyCalorieRecommendation
    ) {
      throw new Error("Invalid AI response.");
    }

    return plan;

  } catch (error) {
    console.error("Gemini Error:", error);

    throw new ApiError(
      502,
      "Failed to generate fitness plan."
    );
  }
};