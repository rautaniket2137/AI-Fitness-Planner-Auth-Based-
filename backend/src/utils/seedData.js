import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import FitnessPlan from '../models/FitnessPlan.js';
import { MONGO_URI } from '../config/env.js';

const sampleUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
};

const sampleProfile = {
  name: 'John Doe',
  age: 28,
  gender: 'Male',
  height: 178,
  weight: 75,
  fitnessGoal: 'Muscle Gain',
  activityLevel: 'Intermediate',
  workoutDaysPerWeek: 4,
};

const sampleAIPlan = {
  workoutPlan:
    'A 4-day split focusing on progressive overload: Day 1 Upper Push, Day 2 Lower Body, Day 3 Upper Pull, Day 4 Full Body Conditioning. Increase weights weekly by 2.5-5%.',
  dietSuggestions:
    'Aim for a caloric surplus of 300-500 kcal with 1.8g protein per kg bodyweight. Prioritize chicken, eggs, oats, rice, and vegetables.',
  dailyCalorieRecommendation: 2800,
  weeklySchedule: [
    { day: 'Monday', focus: 'Upper Push', exercises: ['Bench Press', 'Shoulder Press', 'Tricep Dips'] },
    { day: 'Tuesday', focus: 'Lower Body', exercises: ['Squats', 'Lunges', 'Leg Press'] },
    { day: 'Thursday', focus: 'Upper Pull', exercises: ['Pull-ups', 'Rows', 'Bicep Curls'] },
    { day: 'Saturday', focus: 'Full Body', exercises: ['Deadlifts', 'Burpees', 'Plank'] },
  ],
  fitnessTips: [
    'Track your lifts weekly to ensure progressive overload.',
    'Sleep 7-9 hours for optimal muscle recovery.',
    'Stay hydrated, especially on workout days.',
  ],
  weeklyMotivationMessage: 'Consistency beats intensity — keep showing up, John!',
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({ email: sampleUser.email });
    const user = await User.create(sampleUser);
    console.log(`Created sample user: ${user.email} (password: ${sampleUser.password})`);

    await FitnessPlan.create({
      user: user._id,
      fitnessProfile: sampleProfile,
      aiGeneratedPlan: sampleAIPlan,
    });
    console.log('Created sample fitness plan.');

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
