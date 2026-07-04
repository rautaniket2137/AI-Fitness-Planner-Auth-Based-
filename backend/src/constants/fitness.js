export const GENDERS = ['Male', 'Female', 'Other'];
export const FITNESS_GOALS = ['Weight Loss', 'Muscle Gain', 'General Fitness'];
export const ACTIVITY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const PROFILE_LIMITS = Object.freeze({
  AGE: { MIN: 10, MAX: 100 },
  HEIGHT_CM: { MIN: 50, MAX: 300 },
  WEIGHT_KG: { MIN: 20, MAX: 400 },
  WORKOUT_DAYS: { MIN: 1, MAX: 7 },
});
