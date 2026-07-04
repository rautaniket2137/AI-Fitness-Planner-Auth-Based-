import mongoose from 'mongoose';
import { GENDERS, FITNESS_GOALS, ACTIVITY_LEVELS, PROFILE_LIMITS } from '../constants/fitness.js';

const { Schema, model } = mongoose;
const { AGE, HEIGHT_CM, WEIGHT_KG, WORKOUT_DAYS } = PROFILE_LIMITS;

const fitnessProfileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: AGE.MIN, max: AGE.MAX },
    gender: { type: String, required: true, enum: GENDERS },
    height: { type: Number, required: true, min: HEIGHT_CM.MIN, max: HEIGHT_CM.MAX }, // cm
    weight: { type: Number, required: true, min: WEIGHT_KG.MIN, max: WEIGHT_KG.MAX }, // kg
    fitnessGoal: { type: String, required: true, enum: FITNESS_GOALS },
    activityLevel: { type: String, required: true, enum: ACTIVITY_LEVELS },
    workoutDaysPerWeek: { type: Number, required: true, min: WORKOUT_DAYS.MIN, max: WORKOUT_DAYS.MAX },
  },
  { _id: false }
);

const dailyScheduleSchema = new Schema(
  {
    day: { type: String, required: true },
    focus: { type: String, required: true },
    exercises: [{ type: String }],
  },
  { _id: false }
);

const fitnessPlanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fitnessProfile: {
      type: fitnessProfileSchema,
      required: true,
    },
    aiGeneratedPlan: {
      workoutPlan: { type: String, required: true },
      dietSuggestions: { type: String, required: true },
      dailyCalorieRecommendation: { type: Number, required: true },
      weeklySchedule: [dailyScheduleSchema],
      fitnessTips: [{ type: String }],
      weeklyMotivationMessage: { type: String },
    },
    progressLogs: [
      {
        date: { type: Date, default: Date.now },
        weight: Number,
        notes: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

fitnessPlanSchema.index({ user: 1, createdAt: -1 });

export default model('FitnessPlan', fitnessPlanSchema);
