import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { roadmapApi } from '../api';
import { Target, Loader2, ArrowRight, Sparkles } from 'lucide-react';

const popularCareers = [
  'Software Developer',
  'Data Scientist',
  'UI/UX Designer',
  'Mobile App Developer',
  'Cybersecurity Analyst',
  'Cloud Engineer',
  'Machine Learning Engineer',
  'Web Developer',
];

const CareerGoal = () => {
  const [careerGoal, setCareerGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!careerGoal.trim()) {
      setError('Please enter a career goal');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await roadmapApi.generate(careerGoal, skillLevel, language);
      
      if (response.success && response.data) {
        // Store roadmap data and navigate
        sessionStorage.setItem('currentRoadmap', JSON.stringify({
          careerGoal,
          stages: response.data.roadmap,
          saved: response.data.saved,
        }));
        navigate('/roadmap');
      } else {
        setError(response.error || 'Failed to generate roadmap');
      }
    } catch (err) {
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectCareer = (career: string) => {
    setCareerGoal(career);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 mb-4">
          <Target className="h-4 w-4" />
          Step 1
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t('career.title')}</h1>
        <p className="mt-2 text-gray-600">
          Tell us your dream career and we'll create a personalized learning roadmap for you.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Career Input */}
        <div>
          <label htmlFor="careerGoal" className="block text-sm font-medium text-gray-700 mb-2">
            Career Goal
          </label>
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="careerGoal"
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder={t('career.placeholder')}
              className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 text-lg text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        {/* Popular Careers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Popular careers
          </label>
          <div className="flex flex-wrap gap-2">
            {popularCareers.map((career) => (
              <button
                key={career}
                type="button"
                onClick={() => selectCareer(career)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  careerGoal === career
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {career}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Current skill level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSkillLevel(level)}
                className={`rounded-xl border-2 py-3 text-sm font-medium capitalize transition-colors ${
                  skillLevel === level
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !careerGoal.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 text-lg font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('career.loading')}
            </>
          ) : (
            <>
              {t('career.submit')}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Info */}
      <div className="mt-8 rounded-xl bg-primary-50 p-6">
        <h3 className="font-semibold text-primary-900 mb-2">What happens next?</h3>
        <ul className="space-y-2 text-sm text-primary-800">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
            AI analyzes your career goal and skill level
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
            Creates a 5-stage personalized learning roadmap
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
            Recommends free resources for each stage
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
            Saves your roadmap for future reference
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CareerGoal;
