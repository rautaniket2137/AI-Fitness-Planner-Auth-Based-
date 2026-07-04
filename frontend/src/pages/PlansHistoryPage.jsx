import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import { getMyFitnessPlans, deleteFitnessPlan } from '../api/fitnessPlanApi';

const PlanCard = ({ plan, onDelete, deleting }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-slate-800">{plan.fitnessProfile.fitnessGoal}</h3>
        <p className="text-xs text-slate-400">{new Date(plan.createdAt).toLocaleDateString()}</p>
      </div>
      <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
        {plan.fitnessProfile.activityLevel}
      </span>
    </div>
    <p className="text-sm text-slate-500 mt-3">
      {plan.aiGeneratedPlan.dailyCalorieRecommendation} kcal/day · {plan.fitnessProfile.workoutDaysPerWeek} days/week
    </p>
    <div className="flex gap-2 mt-4">
      <Link to={`/plans/${plan._id}`} className="btn-secondary text-sm py-1.5 px-3 flex-1 text-center">
        View
      </Link>
      <button
        type="button"
        onClick={() => onDelete(plan._id)}
        disabled={deleting}
        className="text-sm py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </div>
);

PlanCard.propTypes = {
  plan: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    fitnessProfile: PropTypes.shape({
      fitnessGoal: PropTypes.string.isRequired,
      activityLevel: PropTypes.string.isRequired,
      workoutDaysPerWeek: PropTypes.number.isRequired,
    }).isRequired,
    aiGeneratedPlan: PropTypes.shape({
      dailyCalorieRecommendation: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  deleting: PropTypes.bool.isRequired,
};

const PlansHistoryPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyFitnessPlans();
      setPlans(data.data.plans);
    } catch {
      toast.error('Failed to load fitness plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this fitness plan? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      await deleteFitnessPlan(id);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      toast.success('Plan deleted');
    } catch {
      toast.error('Failed to delete plan');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner label="Loading your fitness plans..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Fitness Plans</h1>
        <Link to="/dashboard" className="btn-primary text-sm py-1.5 px-3">
          + New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-500">You haven&apos;t generated any fitness plans yet.</p>
          <Link to="/dashboard" className="text-primary-600 font-medium text-sm mt-2 inline-block">
            Generate your first plan →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} onDelete={handleDelete} deleting={deletingId === plan._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansHistoryPage;
