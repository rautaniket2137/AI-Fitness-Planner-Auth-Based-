import { GENDERS, FITNESS_GOALS, ACTIVITY_LEVELS, PROFILE_LIMITS } from '../constants/fitness.js';

const { AGE, HEIGHT_CM, WEIGHT_KG, WORKOUT_DAYS } = PROFILE_LIMITS;

const isInRange = (value, { MIN, MAX }) => typeof value === 'number' && value >= MIN && value <= MAX;

const toErrorResult = (errors) =>
  errors.length ? { error: { details: errors.map((message) => ({ message })) } } : {};

export const validateFitnessProfile = (body = {}) => {
  const { name, age, gender, height, weight, fitnessGoal, activityLevel, workoutDaysPerWeek } = body;
  const errors = [];

  if (!name?.trim() || name.trim().length < 2) errors.push('Name is required');
  if (!isInRange(age, AGE)) errors.push(`Age must be between ${AGE.MIN} and ${AGE.MAX}`);
  if (!GENDERS.includes(gender)) errors.push(`Gender must be one of: ${GENDERS.join(', ')}`);
  if (!isInRange(height, HEIGHT_CM)) {
    errors.push(`Height must be between ${HEIGHT_CM.MIN}cm and ${HEIGHT_CM.MAX}cm`);
  }
  if (!isInRange(weight, WEIGHT_KG)) {
    errors.push(`Weight must be between ${WEIGHT_KG.MIN}kg and ${WEIGHT_KG.MAX}kg`);
  }
  if (!FITNESS_GOALS.includes(fitnessGoal)) {
    errors.push(`Fitness goal must be one of: ${FITNESS_GOALS.join(', ')}`);
  }
  if (!ACTIVITY_LEVELS.includes(activityLevel)) {
    errors.push(`Activity level must be one of: ${ACTIVITY_LEVELS.join(', ')}`);
  }
  if (!isInRange(workoutDaysPerWeek, WORKOUT_DAYS)) {
    errors.push(`Workout days per week must be between ${WORKOUT_DAYS.MIN} and ${WORKOUT_DAYS.MAX}`);
  }

  return toErrorResult(errors);
};
