import { useState } from 'react';
import PropTypes from 'prop-types';
import { GENDERS, FITNESS_GOALS, ACTIVITY_LEVELS, DEFAULT_PROFILE } from '../../constants/fitness';

const toNumericProfile = (form) => ({
  ...form,
  age: Number(form.age),
  height: Number(form.height),
  weight: Number(form.weight),
  workoutDaysPerWeek: Number(form.workoutDaysPerWeek),
});

const FitnessProfileForm = ({ onSubmit, loading, defaultValues = DEFAULT_PROFILE }) => {
  const [form, setForm] = useState(defaultValues);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(toNumericProfile(form));
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <h2 className="text-lg font-bold text-slate-800">Your Fitness Profile</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input id="name" name="name" required className="input-field" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
            Age
          </label>
          <input
            id="age"
            type="number"
            name="age"
            required
            min={10}
            max={100}
            className="input-field"
            value={form.age}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
            Gender
          </label>
          <select id="gender" name="gender" className="input-field" value={form.gender} onChange={handleChange}>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="workoutDaysPerWeek" className="block text-sm font-medium text-slate-700 mb-1">
            Workout Days / Week
          </label>
          <input
            id="workoutDaysPerWeek"
            type="number"
            name="workoutDaysPerWeek"
            required
            min={1}
            max={7}
            className="input-field"
            value={form.workoutDaysPerWeek}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-1">
            Height (cm)
          </label>
          <input
            id="height"
            type="number"
            name="height"
            required
            min={50}
            max={300}
            className="input-field"
            value={form.height}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            name="weight"
            required
            min={20}
            max={400}
            className="input-field"
            value={form.weight}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="fitnessGoal" className="block text-sm font-medium text-slate-700 mb-1">
            Fitness Goal
          </label>
          <select
            id="fitnessGoal"
            name="fitnessGoal"
            className="input-field"
            value={form.fitnessGoal}
            onChange={handleChange}
          >
            {FITNESS_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="activityLevel" className="block text-sm font-medium text-slate-700 mb-1">
            Activity Level
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            className="input-field"
            value={form.activityLevel}
            onChange={handleChange}
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? 'Generating your plan...' : 'Generate Fitness Plan'}
      </button>
    </form>
  );
};

FitnessProfileForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.oneOf(GENDERS),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fitnessGoal: PropTypes.oneOf(FITNESS_GOALS),
    activityLevel: PropTypes.oneOf(ACTIVITY_LEVELS),
    workoutDaysPerWeek: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default FitnessProfileForm;
