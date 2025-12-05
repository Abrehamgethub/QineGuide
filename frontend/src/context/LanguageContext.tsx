import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'am' | 'om' | 'tg' | 'so';

export const languageNames: Record<Language, string> = {
  en: 'English',
  am: 'አማርኛ (Amharic)',
  om: 'Oromiffa',
  tg: 'ትግርኛ (Tigrigna)',
  so: 'Soomaali (Somali)',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.career': 'Career Goal',
    'nav.roadmap': 'My Roadmap',
    'nav.tutor': 'AI Tutor',
    'nav.opportunities': 'Opportunities',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',

    // Landing
    'landing.title': 'Your AI-Powered Learning Partner',
    'landing.subtitle': 'Personalized learning paths and career guidance for Ethiopian youth',
    'landing.cta': 'Get Started',
    'landing.login': 'Sign In',

    // Career Goal
    'career.title': 'What career do you want to pursue?',
    'career.placeholder': 'e.g., Software Developer, Data Scientist, UI/UX Designer',
    'career.submit': 'Generate My Roadmap',
    'career.loading': 'Creating your personalized roadmap...',

    // Roadmap
    'roadmap.title': 'Your Learning Roadmap',
    'roadmap.empty': 'Set a career goal to see your roadmap',
    'roadmap.stage': 'Stage',
    'roadmap.resources': 'Resources',
    'roadmap.save': 'Save Roadmap',

    // Tutor
    'tutor.title': 'AI Tutor',
    'tutor.placeholder': 'Ask me anything about your learning journey...',
    'tutor.send': 'Send',
    'tutor.speak': 'Speak',
    'tutor.listening': 'Listening...',

    // Opportunities
    'opportunities.title': 'Opportunities For You',
    'opportunities.generate': 'Find Opportunities',
    'opportunities.save': 'Save',
    'opportunities.saved': 'Saved',

    // Profile
    'profile.title': 'Your Profile',
    'profile.savedRoadmaps': 'Saved Roadmaps',
    'profile.savedOpportunities': 'Saved Opportunities',
    'profile.language': 'Language Preference',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',

    // Daily Coach
    'dailyCoach.title': 'Daily Learning Coach',
    'dailyCoach.subtitle': 'Your personalized learning tasks for today',
    'dailyCoach.streak': 'day streak',
    'dailyCoach.todayProgress': "Today's Progress",
    'dailyCoach.tasks': 'tasks',
    'dailyCoach.timeInvested': 'Time Invested',
    'dailyCoach.min': 'min',
    'dailyCoach.allComplete': 'All tasks completed! Great job!',
    'dailyCoach.todayTasks': "Today's Tasks",
    'dailyCoach.noTasks': 'No tasks yet. Set your career goal to get started!',
    'dailyCoach.preparing': 'Preparing your daily plan...',
    'dailyCoach.knowledgeCheck': 'Daily Knowledge Check',
    'dailyCoach.testUnderstanding': 'Test your understanding with',
    'dailyCoach.questions': 'quick questions',
    'dailyCoach.startQuiz': 'Start Quiz',

    // Analytics
    'analytics.title': 'Learning Analytics',
    'analytics.subtitle': 'Track your progress and identify areas for improvement',
    'analytics.loadingAnalytics': 'Loading your analytics...',
    'analytics.noData': 'No analytics data available',
    'analytics.startLearning': 'Start learning to see your progress!',
    'analytics.learningStreak': 'Learning Streak',
    'analytics.days': 'days',
    'analytics.roadmapProgress': 'Roadmap Progress',
    'analytics.completed': 'completed',
    'analytics.confidenceScore': 'Confidence Score',
    'analytics.aiAssessed': 'AI assessed',
    'analytics.timeInvested': 'Time Invested',
    'analytics.hours': 'hours',
    'analytics.aiInsights': 'AI Learning Insights',
    'analytics.progressOverTime': 'Progress Over Time',
    'analytics.quizAccuracy': 'Quiz Accuracy by Category',
    'analytics.skillsRadar': 'Skills Radar',
    'analytics.yourStrengths': 'Your Strengths',
    'analytics.completeMoreQuizzes': 'Complete more quizzes to identify your strengths!',
    'analytics.areasToImprove': 'Areas to Improve',
    'analytics.keepPracticing': 'Keep practicing to identify areas for improvement!',

    // Quiz
    'quiz.title': 'Test Your Knowledge',
    'quiz.subtitle': 'Challenge yourself with quizzes at different difficulty levels',
    'quiz.knowledgeQuiz': 'Knowledge Quiz',
    'quiz.lastResult': 'Last Quiz Result',
    'quiz.correct': 'correct',
    'quiz.dismiss': 'Dismiss',
    'quiz.chooseTopic': 'Choose a Topic',
    'quiz.customTopic': 'Or enter a custom topic...',
    'quiz.selectDifficulty': 'Select Difficulty',
    'quiz.beginner': 'Beginner',
    'quiz.intermediate': 'Intermediate',
    'quiz.advanced': 'Advanced',
    'quiz.beginnerDesc': 'Basic concepts and fundamentals',
    'quiz.intermediateDesc': 'Applied knowledge and deeper understanding',
    'quiz.advancedDesc': 'Complex problems and expert-level challenges',
    'quiz.questions': 'questions',
    'quiz.generatingQuiz': 'Generating Quiz...',
    'quiz.startQuiz': 'Start',
    'quiz.selectTopic': 'Please select or enter a topic',
    'quiz.failedGenerate': 'Failed to generate quiz. Please try again.',
  },
  am: {
    // Navigation
    'nav.home': 'መነሻ',
    'nav.career': 'የስራ ግብ',
    'nav.roadmap': 'የእኔ መንገድ',
    'nav.tutor': 'AI አስተማሪ',
    'nav.opportunities': 'እድሎች',
    'nav.profile': 'መገለጫ',
    'nav.logout': 'ውጣ',

    // Landing
    'landing.title': 'በAI የተደገፈ የትምህርት አጋርዎ',
    'landing.subtitle': 'ለኢትዮጵያ ወጣቶች ግላዊ የትምህርት መንገዶች እና የስራ መመሪያ',
    'landing.cta': 'ጀምር',
    'landing.login': 'ግባ',

    // Career Goal
    'career.title': 'ምን ሙያ መከተል ይፈልጋሉ?',
    'career.placeholder': 'ለምሳሌ: ሶፍትዌር ገንቢ፣ ዳታ ሳይንቲስት',
    'career.submit': 'የእኔን መንገድ አዘጋጅ',
    'career.loading': 'ግላዊ መንገድዎን በማዘጋጀት ላይ...',

    // Roadmap
    'roadmap.title': 'የትምህርት መንገድዎ',
    'roadmap.empty': 'የስራ ግብ ያስቀምጡ መንገድዎን ለማየት',
    'roadmap.stage': 'ደረጃ',
    'roadmap.resources': 'ግብዓቶች',
    'roadmap.save': 'መንገድ አስቀምጥ',

    // Tutor
    'tutor.title': 'AI አስተማሪ',
    'tutor.placeholder': 'ስለ ትምህርትዎ ማንኛውንም ጥያቄ ይጠይቁ...',
    'tutor.send': 'ላክ',
    'tutor.speak': 'ተናገር',
    'tutor.listening': 'በማዳመጥ ላይ...',

    // Opportunities
    'opportunities.title': 'ለእርስዎ እድሎች',
    'opportunities.generate': 'እድሎችን ፈልግ',
    'opportunities.save': 'አስቀምጥ',
    'opportunities.saved': 'ተቀምጧል',

    // Profile
    'profile.title': 'የእርስዎ መገለጫ',
    'profile.savedRoadmaps': 'የተቀመጡ መንገዶች',
    'profile.savedOpportunities': 'የተቀመጡ እድሎች',
    'profile.language': 'የቋንቋ ምርጫ',

    // Common
    'common.loading': 'በመጫን ላይ...',
    'common.error': 'ችግር ተፈጠረ',
    'common.retry': 'እንደገና ሞክር',
    'common.save': 'አስቀምጥ',
    'common.cancel': 'ሰርዝ',
    'common.delete': 'ሰርዝ',

    // Daily Coach
    'dailyCoach.title': 'የዕለት ትምህርት አሰልጣኝ',
    'dailyCoach.subtitle': 'ለዛሬ የተዘጋጀ ግላዊ የትምህርት ስራዎች',
    'dailyCoach.streak': 'ቀናት ተከታታይ',
    'dailyCoach.todayProgress': 'የዛሬ እድገት',
    'dailyCoach.tasks': 'ስራዎች',
    'dailyCoach.timeInvested': 'የተጠቀመው ጊዜ',
    'dailyCoach.min': 'ደቂቃ',
    'dailyCoach.allComplete': 'ሁሉም ስራዎች ተጠናቀቁ! በጣም ጎበዝ!',
    'dailyCoach.todayTasks': 'የዛሬ ስራዎች',
    'dailyCoach.noTasks': 'እስካሁን ስራ የለም። የስራ ግብ ያስቀምጡ!',
    'dailyCoach.preparing': 'የዕለት እቅድዎን በማዘጋጀት ላይ...',
    'dailyCoach.knowledgeCheck': 'የዕለት እውቀት ፈተና',
    'dailyCoach.testUnderstanding': 'ግንዛቤዎን ይፈትኑ በ',
    'dailyCoach.questions': 'ጥያቄዎች',
    'dailyCoach.startQuiz': 'ፈተና ጀምር',

    // Analytics
    'analytics.title': 'የትምህርት ትንታኔ',
    'analytics.subtitle': 'እድገትዎን ይከታተሉ እና መሻሻል ያለባቸውን ቦታዎች ይለዩ',
    'analytics.loadingAnalytics': 'ትንታኔዎን በመጫን ላይ...',
    'analytics.noData': 'የትንታኔ መረጃ የለም',
    'analytics.startLearning': 'እድገትዎን ለማየት መማር ይጀምሩ!',
    'analytics.learningStreak': 'የመማር ተከታታይነት',
    'analytics.days': 'ቀናት',
    'analytics.roadmapProgress': 'የመንገድ እድገት',
    'analytics.completed': 'ተጠናቋል',
    'analytics.confidenceScore': 'የበራስ መተማመን ነጥብ',
    'analytics.aiAssessed': 'በAI የተገመገመ',
    'analytics.timeInvested': 'የተጠቀመው ጊዜ',
    'analytics.hours': 'ሰዓታት',
    'analytics.aiInsights': 'የAI ትምህርት ግንዛቤዎች',
    'analytics.progressOverTime': 'በጊዜ ሂደት እድገት',
    'analytics.quizAccuracy': 'የፈተና ትክክለኛነት በምድብ',
    'analytics.skillsRadar': 'የክህሎት ራዳር',
    'analytics.yourStrengths': 'ጥንካሬዎችዎ',
    'analytics.completeMoreQuizzes': 'ጥንካሬዎችዎን ለመለየት ተጨማሪ ፈተናዎች ይውሰዱ!',
    'analytics.areasToImprove': 'መሻሻል ያለባቸው ቦታዎች',
    'analytics.keepPracticing': 'መሻሻል ያለባቸውን ቦታዎች ለመለየት መለማመድ ይቀጥሉ!',

    // Quiz
    'quiz.title': 'እውቀትዎን ይፈትኑ',
    'quiz.subtitle': 'ራስዎን በተለያየ ደረጃ ፈተናዎች ይፈታተኑ',
    'quiz.knowledgeQuiz': 'የእውቀት ፈተና',
    'quiz.lastResult': 'የመጨረሻ ፈተና ውጤት',
    'quiz.correct': 'ትክክል',
    'quiz.dismiss': 'አስወግድ',
    'quiz.chooseTopic': 'ርዕስ ይምረጡ',
    'quiz.customTopic': 'ወይም ሌላ ርዕስ ያስገቡ...',
    'quiz.selectDifficulty': 'ከባድነት ይምረጡ',
    'quiz.beginner': 'ጀማሪ',
    'quiz.intermediate': 'መካከለኛ',
    'quiz.advanced': 'የላቀ',
    'quiz.beginnerDesc': 'መሰረታዊ ፅንሰ-ሀሳቦች',
    'quiz.intermediateDesc': 'ተግባራዊ እውቀት እና ጥልቅ ግንዛቤ',
    'quiz.advancedDesc': 'ውስብስብ ችግሮች እና የባለሙያ ደረጃ ፈተናዎች',
    'quiz.questions': 'ጥያቄዎች',
    'quiz.generatingQuiz': 'ፈተና በማመንጨት ላይ...',
    'quiz.startQuiz': 'ጀምር',
    'quiz.selectTopic': 'እባክዎ ርዕስ ይምረጡ ወይም ያስገቡ',
    'quiz.failedGenerate': 'ፈተና ማመንጨት አልተሳካም። እንደገና ይሞክሩ።',
  },
  om: {
    // Navigation
    'nav.home': 'Jalqaba',
    'nav.career': 'Kaayyoo Hojii',
    'nav.roadmap': 'Karaa Koo',
    'nav.tutor': 'Barsiisaa AI',
    'nav.opportunities': 'Carraalee',
    'nav.profile': 'Ibsa',
    'nav.logout': 'Bahi',

    // Landing
    'landing.title': 'Hiriyaa Barnoota AI\'n Deeggaramu',
    'landing.subtitle': 'Karaalee barnoota dhuunfaa fi qajeelfama hojii dargaggoota Itoophiyaatiif',
    'landing.cta': 'Jalqabi',
    'landing.login': 'Seeni',

    // Career Goal
    'career.title': 'Hojii kam hordofuu barbaadda?',
    'career.placeholder': 'Fkn: Software Developer, Data Scientist',
    'career.submit': 'Karaa Koo Uumi',
    'career.loading': 'Karaa dhuunfaa kee uumaa jira...',

    // Roadmap
    'roadmap.title': 'Karaa Barnoota Kee',
    'roadmap.empty': 'Kaayyoo hojii galchi karaa kee ilaaluuf',
    'roadmap.stage': 'Sadarkaa',
    'roadmap.resources': 'Qabeenya',
    'roadmap.save': 'Karaa Olkaa\'i',

    // Tutor
    'tutor.title': 'Barsiisaa AI',
    'tutor.placeholder': 'Waa\'ee barnoota kee waan kamiyyuu naaf gaafadhu...',
    'tutor.send': 'Ergi',
    'tutor.speak': 'Dubbadhu',
    'tutor.listening': 'Dhaggeeffachaa jira...',

    // Opportunities
    'opportunities.title': 'Carraalee Siif',
    'opportunities.generate': 'Carraalee Barbaadi',
    'opportunities.save': 'Olkaa\'i',
    'opportunities.saved': 'Olkaa\'ameera',

    // Profile
    'profile.title': 'Ibsa Kee',
    'profile.savedRoadmaps': 'Karaalee Olkaa\'aman',
    'profile.savedOpportunities': 'Carraalee Olkaa\'aman',
    'profile.language': 'Filannoo Afaanii',

    // Common
    'common.loading': 'Fe\'aa jira...',
    'common.error': 'Rakkoon uumame',
    'common.retry': 'Irra deebi\'i yaali',
    'common.save': 'Olkaa\'i',
    'common.cancel': 'Dhiisi',
    'common.delete': 'Haqi',

    // Daily Coach
    'dailyCoach.title': 'Leenjisaa Guyyaa',
    'dailyCoach.subtitle': 'Hojii barnoota dhuunfaa kee har\'aaf qophaa\'e',
    'dailyCoach.streak': 'guyyaa walitti aanee',
    'dailyCoach.todayProgress': 'Guddina Har\'aa',
    'dailyCoach.tasks': 'hojii',
    'dailyCoach.timeInvested': 'Yeroo Dabale',
    'dailyCoach.min': 'daqiiqaa',
    'dailyCoach.allComplete': 'Hojiin hundi xumurame! Hojii gaarii!',
    'dailyCoach.todayTasks': 'Hojii Har\'aa',
    'dailyCoach.noTasks': 'Hojiin hin jiru. Kaayyoo hojii galchi!',
    'dailyCoach.preparing': 'Karoora guyyaa kee qopheessaa jira...',
    'dailyCoach.knowledgeCheck': 'Qormaata Beekumsa Guyyaa',
    'dailyCoach.testUnderstanding': 'Hubannoo kee qoradhu',
    'dailyCoach.questions': 'gaaffilee',
    'dailyCoach.startQuiz': 'Qormaata Jalqabi',

    // Analytics
    'analytics.title': 'Xiinxala Barnoota',
    'analytics.subtitle': 'Guddina kee hordofi naannoowwan fooyyessuu qabdu adda baasi',
    'analytics.loadingAnalytics': 'Xiinxala kee fe\'aa jira...',
    'analytics.noData': 'Deetaan xiinxala hin jiru',
    'analytics.startLearning': 'Guddina kee ilaaluuf baruu jalqabi!',
    'analytics.learningStreak': 'Wal-qaqqabsiisa Barnoota',
    'analytics.days': 'guyyaa',
    'analytics.roadmapProgress': 'Guddina Karaa',
    'analytics.completed': 'xumurameera',
    'analytics.confidenceScore': 'Qabxii Ofitti Amanamuu',
    'analytics.aiAssessed': 'AI\'n madaalame',
    'analytics.timeInvested': 'Yeroo Dabale',
    'analytics.hours': 'sa\'aatii',
    'analytics.aiInsights': 'Hubannoo Barnoota AI',
    'analytics.progressOverTime': 'Guddina Yeroo Keessa',
    'analytics.quizAccuracy': 'Sirna Qormaata Ramaddii',
    'analytics.skillsRadar': 'Raadaarii Dandeettii',
    'analytics.yourStrengths': 'Cimina Kee',
    'analytics.completeMoreQuizzes': 'Cimina kee adda baasuuf qormaata dabalataa fudhadhu!',
    'analytics.areasToImprove': 'Naannoowwan Fooyyessuu',
    'analytics.keepPracticing': 'Naannoowwan fooyyessuu qabdu adda baasuuf shaakala itti fufadhu!',

    // Quiz
    'quiz.title': 'Beekumsa Kee Qoradhu',
    'quiz.subtitle': 'Ofuma kee qormaata sadarkaa adda addaatiin qori',
    'quiz.knowledgeQuiz': 'Qormaata Beekumsa',
    'quiz.lastResult': 'Bu\'aa Qormaata Dhumaa',
    'quiz.correct': 'sirrii',
    'quiz.dismiss': 'Dhiisi',
    'quiz.chooseTopic': 'Mata-duree Fili',
    'quiz.customTopic': 'Yookiin mata-duree biraa galchi...',
    'quiz.selectDifficulty': 'Cimina Fili',
    'quiz.beginner': 'Jalqabaa',
    'quiz.intermediate': 'Giddu-galeessa',
    'quiz.advanced': 'Sadarkaa Olaanaa',
    'quiz.beginnerDesc': 'Yaad-rimee bu\'uuraa',
    'quiz.intermediateDesc': 'Beekumsa hojiirra oolchuu fi hubannoo gadi fagoo',
    'quiz.advancedDesc': 'Rakkoo walxaxaa fi qormaata sadarkaa ogeeyyii',
    'quiz.questions': 'gaaffilee',
    'quiz.generatingQuiz': 'Qormaata uumaa jira...',
    'quiz.startQuiz': 'Jalqabi',
    'quiz.selectTopic': 'Maaloo mata-duree fili yookiin galchi',
    'quiz.failedGenerate': 'Qormaata uumuu hin dandeenye. Irra deebi\'i yaali.',
  },
  tg: {
    // Navigation - Tigrigna
    'nav.home': 'መበገሲ',
    'nav.career': 'ዕላማ ስራሕ',
    'nav.roadmap': 'መገደይ',
    'nav.tutor': 'AI መምህር',
    'nav.opportunities': 'ዕድላት',
    'nav.profile': 'መግለጺ',
    'nav.logout': 'ውጻእ',

    // Landing
    'landing.title': 'ብAI ዝድገፍ መሻርኽቲ ትምህርቲ',
    'landing.subtitle': 'ንመንእሰያት ኢትዮጵያ ውልቃዊ መገድታት ትምህርቲን መምርሒ ስራሕን',
    'landing.cta': 'ጀምር',
    'landing.login': 'እቶ',

    // Career Goal
    'career.title': 'ኣየናይ ሞያ ክትስዕብ ትደሊ?',
    'career.placeholder': 'ንኣብነት: Software Developer, Data Scientist',
    'career.submit': 'መገደይ ኣዳሉ',
    'career.loading': 'ውልቃዊ መገድኻ እናዳለኹ ኣለኹ...',

    // Roadmap
    'roadmap.title': 'መገዲ ትምህርትኻ',
    'roadmap.empty': 'መገድኻ ንምርኣይ ዕላማ ስራሕ ኣእቱ',
    'roadmap.stage': 'ደረጃ',
    'roadmap.resources': 'ጸጋታት',
    'roadmap.save': 'መገዲ ዓቅብ',

    // Tutor
    'tutor.title': 'AI መምህር',
    'tutor.placeholder': 'ብዛዕባ ትምህርትኻ ዝኾነ ሕቶ ሕተት...',
    'tutor.send': 'ስደድ',
    'tutor.speak': 'ተዛረብ',
    'tutor.listening': 'እሰምዕ ኣለኹ...',

    // Opportunities
    'opportunities.title': 'ንዓኻ ዕድላት',
    'opportunities.generate': 'ዕድላት ድለ',
    'opportunities.save': 'ዓቅብ',
    'opportunities.saved': 'ተዓቂቡ',

    // Profile
    'profile.title': 'መግለጺኻ',
    'profile.savedRoadmaps': 'ዝተዓቀቡ መገድታት',
    'profile.savedOpportunities': 'ዝተዓቀቡ ዕድላት',
    'profile.language': 'ምርጫ ቋንቋ',

    // Common
    'common.loading': 'ይጽዓን ኣሎ...',
    'common.error': 'ጸገም ኣጋጢሙ',
    'common.retry': 'ደጊምካ ፈትን',
    'common.save': 'ዓቅብ',
    'common.cancel': 'ሰርዝ',
    'common.delete': 'ደምስስ',

    // Daily Coach
    'dailyCoach.title': 'ናይ ዕለት መምህር',
    'dailyCoach.subtitle': 'ንሎሚ ዝተዳለወ ውልቃዊ ስራሕቲ ትምህርቲ',
    'dailyCoach.streak': 'ተኸታታሊ መዓልታት',
    'dailyCoach.todayProgress': 'ዕቤት ናይ ሎሚ',
    'dailyCoach.tasks': 'ስራሕቲ',
    'dailyCoach.timeInvested': 'ዝተጠቐምናዮ ግዜ',
    'dailyCoach.min': 'ደቒቕ',
    'dailyCoach.allComplete': 'ኩሉ ስራሕቲ ተዛዚሙ! ጽቡቕ ስራሕ!',
    'dailyCoach.todayTasks': 'ስራሕቲ ናይ ሎሚ',
    'dailyCoach.noTasks': 'ክሳብ ሕጂ ስራሕ የለን። ዕላማ ስራሕ ኣእቱ!',
    'dailyCoach.preparing': 'ናይ ዕለት መደብኻ እናዳለኹ ኣለኹ...',
    'dailyCoach.knowledgeCheck': 'ናይ ዕለት ፈተና ፍልጠት',
    'dailyCoach.testUnderstanding': 'ምርዳእካ ፈትን ብ',
    'dailyCoach.questions': 'ሕቶታት',
    'dailyCoach.startQuiz': 'ፈተና ጀምር',

    // Analytics
    'analytics.title': 'ትንተና ትምህርቲ',
    'analytics.subtitle': 'ዕቤትካ ተኸታተል እና ዘድሊ መመሕየሺ ቦታታት ለሊ',
    'analytics.loadingAnalytics': 'ትንተናኻ ይጽዓን ኣሎ...',
    'analytics.noData': 'ናይ ትንተና ሓበሬታ የለን',
    'analytics.startLearning': 'ዕቤትካ ንምርኣይ ምምሃር ጀምር!',
    'analytics.learningStreak': 'ተኸታታሊ ምምሃር',
    'analytics.days': 'መዓልታት',
    'analytics.roadmapProgress': 'ዕቤት መገዲ',
    'analytics.completed': 'ተዛዚሙ',
    'analytics.confidenceScore': 'ነጥቢ ርእሰ-ምትእምማን',
    'analytics.aiAssessed': 'ብAI ዝተገምገመ',
    'analytics.timeInvested': 'ዝተጠቐምናዮ ግዜ',
    'analytics.hours': 'ሰዓታት',
    'analytics.aiInsights': 'ናይ AI ትምህርታዊ ግንዛበታት',
    'analytics.progressOverTime': 'ዕቤት ብግዜ',
    'analytics.quizAccuracy': 'ትኽክለኛነት ፈተና ብምድብ',
    'analytics.skillsRadar': 'ራዳር ክእለት',
    'analytics.yourStrengths': 'ሓይልታትካ',
    'analytics.completeMoreQuizzes': 'ሓይልታትካ ንምፍላጥ ተወሳኺ ፈተናታት ውሰድ!',
    'analytics.areasToImprove': 'ዘድሊ መመሕየሺ ቦታታት',
    'analytics.keepPracticing': 'ዘድሊ መመሕየሺ ቦታታት ንምፍላጥ ምልምማድ ቀጽል!',

    // Quiz
    'quiz.title': 'ፍልጠትካ ፈትን',
    'quiz.subtitle': 'ነብስኻ ብፈተናታት ዝተፈላለየ ደረጃ ፈትን',
    'quiz.knowledgeQuiz': 'ፈተና ፍልጠት',
    'quiz.lastResult': 'ናይ መወዳእታ ውጽኢት ፈተና',
    'quiz.correct': 'ቅኑዕ',
    'quiz.dismiss': 'ኣወግድ',
    'quiz.chooseTopic': 'ኣርእስቲ ምረጽ',
    'quiz.customTopic': 'ወይ ካልእ ኣርእስቲ ኣእቱ...',
    'quiz.selectDifficulty': 'ጽንካረ ምረጽ',
    'quiz.beginner': 'ጀማሪ',
    'quiz.intermediate': 'ማእከላይ',
    'quiz.advanced': 'ልዑል',
    'quiz.beginnerDesc': 'መሰረታዊ ሓሳባት',
    'quiz.intermediateDesc': 'ተግባራዊ ፍልጠትን ዓሚቕ ምርዳእን',
    'quiz.advancedDesc': 'ዝተሓላለኸ ጸገማትን ናይ ክኢላ ደረጃ ፈተናታትን',
    'quiz.questions': 'ሕቶታት',
    'quiz.generatingQuiz': 'ፈተና ይፈጠር ኣሎ...',
    'quiz.startQuiz': 'ጀምር',
    'quiz.selectTopic': 'በጃኻ ኣርእስቲ ምረጽ ወይ ኣእቱ',
    'quiz.failedGenerate': 'ፈተና ምፍጣር ኣይተኻእለን። ደጊምካ ፈትን።',
  },
  so: {
    // Navigation - Somali
    'nav.home': 'Guriga',
    'nav.career': 'Hadafka Shaqada',
    'nav.roadmap': 'Dariiqdayda',
    'nav.tutor': 'Macalinka AI',
    'nav.opportunities': 'Fursadaha',
    'nav.profile': 'Astaanta',
    'nav.logout': 'Ka bax',

    // Landing
    'landing.title': 'Saaxiibkaaga Waxbarashada AI',
    'landing.subtitle': 'Waddooyinka waxbarashada shakhsiga ah iyo hagista shaqada ee dhallinyarada Itoobiya',
    'landing.cta': 'Bilow',
    'landing.login': 'Gal',

    // Career Goal
    'career.title': 'Shaqo noocee ah ayaad rabtaa inaad raacdo?',
    'career.placeholder': 'Tusaale: Software Developer, Data Scientist',
    'career.submit': 'Samee Dariiqdayda',
    'career.loading': 'Waan samaynayaa dariiqdaada gaarka ah...',

    // Roadmap
    'roadmap.title': 'Dariiqdaada Waxbarashada',
    'roadmap.empty': 'Geli hadafka shaqada si aad u aragto dariiqdaada',
    'roadmap.stage': 'Heer',
    'roadmap.resources': 'Ilaha',
    'roadmap.save': 'Kaydi Dariiqa',

    // Tutor
    'tutor.title': 'Macalinka AI',
    'tutor.placeholder': 'Wax kasta ii weydii waxbarashada...',
    'tutor.send': 'Dir',
    'tutor.speak': 'Hadal',
    'tutor.listening': 'Waan dhegaysanayaa...',

    // Opportunities
    'opportunities.title': 'Fursadaha Adiga',
    'opportunities.generate': 'Raadi Fursadaha',
    'opportunities.save': 'Kaydi',
    'opportunities.saved': 'Waa la keydiyay',

    // Profile
    'profile.title': 'Astaantaada',
    'profile.savedRoadmaps': 'Waddooyinka La Keydiyay',
    'profile.savedOpportunities': 'Fursadaha La Keydiyay',
    'profile.language': 'Doorashada Luqadda',

    // Common
    'common.loading': 'Waa la rarrayaa...',
    'common.error': 'Wax qalad ah ayaa dhacay',
    'common.retry': 'Isku day mar kale',
    'common.save': 'Kaydi',
    'common.cancel': 'Jooji',
    'common.delete': 'Tirtir',

    // Daily Coach
    'dailyCoach.title': 'Tababaraha Maalinlaha',
    'dailyCoach.subtitle': 'Hawlahaaga waxbarashada shakhsiga ah ee maanta',
    'dailyCoach.streak': 'maalin isku xigta',
    'dailyCoach.todayProgress': 'Horumarka Maanta',
    'dailyCoach.tasks': 'hawlo',
    'dailyCoach.timeInvested': 'Waqtiga La Isticmaalay',
    'dailyCoach.min': 'daqiiqo',
    'dailyCoach.allComplete': 'Dhammaan hawlaha waa la dhammeeyay! Shaqo wanaagsan!',
    'dailyCoach.todayTasks': 'Hawlaha Maanta',
    'dailyCoach.noTasks': 'Weli hawlo ma jiraan. Hadafka shaqada geli!',
    'dailyCoach.preparing': 'Qorshaha maalinlaha ayaan diyaarinayaa...',
    'dailyCoach.knowledgeCheck': 'Imtixaanka Aqoonta Maalinlaha',
    'dailyCoach.testUnderstanding': 'Fahankaga tijaabi',
    'dailyCoach.questions': 'su\'aalo',
    'dailyCoach.startQuiz': 'Bilow Imtixaanka',

    // Analytics
    'analytics.title': 'Falanqaynta Waxbarashada',
    'analytics.subtitle': 'Raadi horumarka oo aqoonso meelaha la hagaajiyo',
    'analytics.loadingAnalytics': 'Falanqayntaada ayaa la soo rarrayaa...',
    'analytics.noData': 'Xog falanqayn ma jirto',
    'analytics.startLearning': 'Si aad u aragto horumarkaaga waxbarasho bilow!',
    'analytics.learningStreak': 'Isku Xirnaanta Waxbarashada',
    'analytics.days': 'maalin',
    'analytics.roadmapProgress': 'Horumarka Dariiqa',
    'analytics.completed': 'la dhammeeyay',
    'analytics.confidenceScore': 'Dhibcaha Kalsooni',
    'analytics.aiAssessed': 'AI ayaa qiimeeyay',
    'analytics.timeInvested': 'Waqtiga La Isticmaalay',
    'analytics.hours': 'saacadood',
    'analytics.aiInsights': 'Aragti Waxbarasho AI',
    'analytics.progressOverTime': 'Horumarka Waqti Gudihiisa',
    'analytics.quizAccuracy': 'Saxnaanta Imtixaanka Qaybta',
    'analytics.skillsRadar': 'Radar Xirfadaha',
    'analytics.yourStrengths': 'Awoodahaaga',
    'analytics.completeMoreQuizzes': 'Si aad u ogaato awoodahaaga imtixaano dheeri ah qaado!',
    'analytics.areasToImprove': 'Meelaha La Hagaajiyo',
    'analytics.keepPracticing': 'Si aad u ogaato meelaha la hagaajiyo ku sii wad tabababarka!',

    // Quiz
    'quiz.title': 'Tijaabi Aqoontaada',
    'quiz.subtitle': 'Naftaada ku tijaabi imtixaanno heer kala duwan',
    'quiz.knowledgeQuiz': 'Imtixaanka Aqoonta',
    'quiz.lastResult': 'Natiijaada Imtixaanka Ugu Dambeysa',
    'quiz.correct': 'sax',
    'quiz.dismiss': 'Iska daa',
    'quiz.chooseTopic': 'Dooro Mawduuc',
    'quiz.customTopic': 'Ama geli mawduuc kale...',
    'quiz.selectDifficulty': 'Dooro Adkaanta',
    'quiz.beginner': 'Bilowga',
    'quiz.intermediate': 'Dhexdhexaad',
    'quiz.advanced': 'Sare',
    'quiz.beginnerDesc': 'Fikradaha aasaasiga ah',
    'quiz.intermediateDesc': 'Aqoonta la hirgeliyo iyo faham qoto dheer',
    'quiz.advancedDesc': 'Dhibaatooyinka adag iyo imtixaano heer khabiir ah',
    'quiz.questions': 'su\'aalo',
    'quiz.generatingQuiz': 'Imtixaanka waa la samaynayaa...',
    'quiz.startQuiz': 'Bilow',
    'quiz.selectTopic': 'Fadlan dooro ama geli mawduuc',
    'quiz.failedGenerate': 'Samaynta imtixaanka wuu guul daraystay. Mar kale isku day.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('qineguide-language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('qineguide-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
