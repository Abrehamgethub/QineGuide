import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, BookOpen, Target, MessageCircle, Briefcase, Sparkles } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: 'Career Roadmaps',
      description: 'Get personalized learning paths tailored to your career goals',
    },
    {
      icon: MessageCircle,
      title: 'AI Tutor',
      description: 'Learn STEM concepts in Amharic, Oromo, or English',
    },
    {
      icon: Briefcase,
      title: 'Opportunities',
      description: 'Discover scholarships, internships, and programs',
    },
    {
      icon: BookOpen,
      title: 'Free Resources',
      description: 'Access curated free learning materials',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
              T
            </div>
            <span className="text-xl font-bold text-gray-900">TenaAI</span>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <Link
                to="/career-goal"
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {t('landing.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  {t('landing.cta')}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 mb-6">
          <Sparkles className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
          {t('landing.title')}
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? '/career-goal' : '/register'}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-medium text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            {t('landing.cta')}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('landing.login')}
          </Link>
        </div>

        {/* Hero Image/Illustration Placeholder */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 p-8 shadow-xl">
          <div className="aspect-video rounded-xl bg-white/50 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                  T
                </div>
              </div>
              <p className="text-primary-700 font-medium">Your AI Learning Journey Starts Here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Join thousands of Ethiopian youth who are building their future with TenaAI
          </p>
          <Link
            to={user ? '/career-goal' : '/register'}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-medium text-primary-700 hover:bg-primary-50 transition-colors"
          >
            {t('landing.cta')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
              T
            </div>
            <span className="font-bold text-gray-900">TenaAI</span>
          </div>
          <p className="text-sm text-gray-500">
            Empowering Ethiopian youth through AI-powered education
          </p>
          <p className="mt-4 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} TenaAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
