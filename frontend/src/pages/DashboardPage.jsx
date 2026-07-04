import { useState } from 'react';
import toast from 'react-hot-toast';
import FitnessProfileForm from '../components/fitness/FitnessProfileForm';
import FitnessPlanResult from '../components/fitness/FitnessPlanResult';
import { generateFitnessPlan, regenerateFitnessPlan } from '../api/fitnessPlanApi';

const DashboardPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleGenerate = async (profileData) => {
    setLoading(true);
    try {
      const { data } = await generateFitnessPlan(profileData);
      setPlan(data.data.plan);
      toast.success('Fitness plan generated!');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!plan) return;
    setRegenerating(true);
    try {
      const { data } = await regenerateFitnessPlan(plan._id);
      setPlan(data.data.plan);
      toast.success('Plan regenerated!');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to regenerate plan');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Generate Your Fitness Plan</h1>
        <p className="text-slate-500 text-sm mt-1">
          Fill in your details below and let AI craft a personalized plan for you.
        </p>
      </div>

      <FitnessProfileForm onSubmit={handleGenerate} loading={loading} />

      {plan && <FitnessPlanResult plan={plan} onRegenerate={handleRegenerate} regenerating={regenerating} />}
    </div>
  );
};

export default DashboardPage;
