import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import FitnessPlanResult from '../components/fitness/FitnessPlanResult';
import { getFitnessPlanById, regenerateFitnessPlan } from '../api/fitnessPlanApi';

const PlanDetailPage = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const { data } = await getFitnessPlanById(id);
        setPlan(data.data.plan);
      } catch {
        toast.error('Failed to load plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const { data } = await regenerateFitnessPlan(id);
      setPlan(data.data.plan);
      toast.success('New plan generated!');
    } catch {
      toast.error('Failed to regenerate plan');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <Spinner label="Loading plan..." />;

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-500">Plan not found.</p>
        <Link to="/plans" className="text-primary-600 font-medium text-sm">
          ← Back to my plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
      <Link to="/plans" className="text-sm text-slate-500 hover:text-primary-600">
        ← Back to my plans
      </Link>
      <FitnessPlanResult plan={plan} onRegenerate={handleRegenerate} regenerating={regenerating} />
    </div>
  );
};

export default PlanDetailPage;
