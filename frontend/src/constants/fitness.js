export const GENDERS = ['Male', 'Female', 'Other'];
export const FITNESS_GOALS = ['Weight Loss', 'Muscle Gain', 'General Fitness'];
export const ACTIVITY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const DEFAULT_PROFILE = Object.freeze({
  name: '',
  age: '',
  gender: GENDERS[0],
  height: '',
  weight: '',
  fitnessGoal: FITNESS_GOALS[2],
  activityLevel: ACTIVITY_LEVELS[0],
  workoutDaysPerWeek: 3,
});
