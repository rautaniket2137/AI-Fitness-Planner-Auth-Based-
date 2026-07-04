import PropTypes from 'prop-types';
import jsPDF from 'jspdf';

const PDF_MARGIN_X = 14;
const PDF_PAGE_BREAK_Y = 270;
const PDF_TOP_Y = 15;

const buildPlanPdf = ({ aiGeneratedPlan, fitnessProfile }) => {
  const doc = new jsPDF();
  let y = PDF_TOP_Y;

  const addLine = (text, size = 11, bold = false) => {
    doc.setFontSize(size);
    doc.setFont(undefined, bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, PDF_MARGIN_X, y);
    y += lines.length * (size / 2) + 4;
    if (y > PDF_PAGE_BREAK_Y) {
      doc.addPage();
      y = PDF_TOP_Y;
    }
  };

  addLine('AI Fitness Plan', 18, true);
  addLine(`Generated for: ${fitnessProfile.name} | Goal: ${fitnessProfile.fitnessGoal}`, 10);
  addLine(`Age: ${fitnessProfile.age} | Height: ${fitnessProfile.height}cm | Weight: ${fitnessProfile.weight}kg`, 10);

  addLine('Workout Plan', 13, true);
  addLine(aiGeneratedPlan.workoutPlan);

  addLine('Diet Suggestions', 13, true);
  addLine(aiGeneratedPlan.dietSuggestions);

  addLine(`Daily Calorie Recommendation: ${aiGeneratedPlan.dailyCalorieRecommendation} kcal`, 12, true);

  addLine('Weekly Schedule', 13, true);
  aiGeneratedPlan.weeklySchedule?.forEach(({ day, focus, exercises }) => {
    addLine(`${day} - ${focus}: ${exercises.join(', ')}`);
  });

  addLine('Fitness Tips', 13, true);
  aiGeneratedPlan.fitnessTips?.forEach((tip) => addLine(`• ${tip}`));

  addLine('Motivation', 13, true);
  addLine(aiGeneratedPlan.weeklyMotivationMessage ?? '');

  return doc;
};

const StatCard = ({ label, value }) => (
  <div className="bg-primary-50 rounded-lg p-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-bold text-primary-700">{value}</p>
  </div>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const FitnessPlanResult = ({ plan, onRegenerate, regenerating }) => {
  if (!plan) return null;

  const { aiGeneratedPlan, fitnessProfile, createdAt } = plan;

  const handleDownloadPDF = () => {
    const doc = buildPlanPdf(plan);
    doc.save(`fitness-plan-${fitnessProfile.name}.pdf`);
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Your Personalized Plan</h2>
          {createdAt && (
            <p className="text-xs text-slate-400">Generated on {new Date(createdAt).toLocaleString()}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleDownloadPDF} className="btn-secondary text-sm py-1.5 px-3">
            Download PDF
          </button>
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="btn-primary text-sm py-1.5 px-3"
            >
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <StatCard label="Calories/day" value={aiGeneratedPlan.dailyCalorieRecommendation} />
        <StatCard label="Goal" value={fitnessProfile.fitnessGoal} />
        <StatCard label="Level" value={fitnessProfile.activityLevel} />
        <StatCard label="Days/week" value={fitnessProfile.workoutDaysPerWeek} />
      </div>

      <section>
        <h3 className="font-semibold text-slate-800 mb-1">Workout Plan</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{aiGeneratedPlan.workoutPlan}</p>
      </section>

      <section>
        <h3 className="font-semibold text-slate-800 mb-1">Diet Suggestions</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{aiGeneratedPlan.dietSuggestions}</p>
      </section>

      {aiGeneratedPlan.weeklySchedule?.length > 0 && (
        <section>
          <h3 className="font-semibold text-slate-800 mb-2">Weekly Schedule</h3>
          <div className="space-y-2">
            {aiGeneratedPlan.weeklySchedule.map(({ day, focus, exercises }) => (
              <div key={day} className="border border-slate-200 rounded-lg p-3">
                <p className="text-sm font-medium text-slate-700">
                  {day} — <span className="text-primary-600">{focus}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">{exercises?.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {aiGeneratedPlan.fitnessTips?.length > 0 && (
        <section>
          <h3 className="font-semibold text-slate-800 mb-2">Fitness Tips</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {aiGeneratedPlan.fitnessTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {aiGeneratedPlan.weeklyMotivationMessage && (
        <div className="bg-primary-600 text-white rounded-lg p-4 text-sm font-medium">
          💪 {aiGeneratedPlan.weeklyMotivationMessage}
        </div>
      )}
    </div>
  );
};

const aiGeneratedPlanShape = PropTypes.shape({
  workoutPlan: PropTypes.string.isRequired,
  dietSuggestions: PropTypes.string.isRequired,
  dailyCalorieRecommendation: PropTypes.number.isRequired,
  weeklySchedule: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      focus: PropTypes.string.isRequired,
      exercises: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  fitnessTips: PropTypes.arrayOf(PropTypes.string),
  weeklyMotivationMessage: PropTypes.string,
});

FitnessPlanResult.propTypes = {
  plan: PropTypes.shape({
    _id: PropTypes.string,
    createdAt: PropTypes.string,
    aiGeneratedPlan: aiGeneratedPlanShape.isRequired,
    fitnessProfile: PropTypes.shape({
      name: PropTypes.string.isRequired,
      age: PropTypes.number,
      height: PropTypes.number,
      weight: PropTypes.number,
      fitnessGoal: PropTypes.string.isRequired,
      activityLevel: PropTypes.string.isRequired,
      workoutDaysPerWeek: PropTypes.number.isRequired,
    }).isRequired,
  }),
  onRegenerate: PropTypes.func,
  regenerating: PropTypes.bool,
};

export default FitnessPlanResult;
