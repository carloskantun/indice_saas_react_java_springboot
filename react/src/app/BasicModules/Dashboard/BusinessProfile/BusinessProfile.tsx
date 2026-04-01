import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useLanguage } from '../../../shared/context';

interface DiagnosticoAnswers {
  people: Record<number, number>;
  processes: Record<number, number>;
  products: Record<number, number>;
  finance: Record<number, number>;
}

type PillarId = keyof DiagnosticoAnswers;

type PillarColor = 'blue' | 'yellow' | 'orange' | 'green';

export default function BusinessProfile() {
  const { t } = useLanguage();
  const [activePillar, setActivePillar] = useState<PillarId | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticoAnswers>({
    people: {},
    processes: {},
    products: {},
    finance: {},
  });

  const diagnosticoQuestions = {
    people: t.panelInicial.diagnosis.questions.people,
    processes: t.panelInicial.diagnosis.questions.processes,
    products: t.panelInicial.diagnosis.questions.products,
    finance: t.panelInicial.diagnosis.questions.finance,
  };

  const pilares: Array<{
    id: PillarId;
    emoji: string;
    title: string;
    description: string;
    color: PillarColor;
  }> = [
    {
      id: 'people',
      emoji: '👥',
      title: t.panelInicial.diagnosis.pillars.people.title,
      description: t.panelInicial.diagnosis.pillars.people.description,
      color: 'blue',
    },
    {
      id: 'processes',
      emoji: '⚙️',
      title: t.panelInicial.diagnosis.pillars.processes.title,
      description: t.panelInicial.diagnosis.pillars.processes.description,
      color: 'yellow',
    },
    {
      id: 'products',
      emoji: '📦',
      title: t.panelInicial.diagnosis.pillars.products.title,
      description: t.panelInicial.diagnosis.pillars.products.description,
      color: 'orange',
    },
    {
      id: 'finance',
      emoji: '💰',
      title: t.panelInicial.diagnosis.pillars.finance.title,
      description: t.panelInicial.diagnosis.pillars.finance.description,
      color: 'green',
    },
  ];

  const calculateProgress = (pillarId: PillarId) => Object.keys(answers[pillarId]).length;

  const totalQuestions = Object.values(diagnosticoQuestions).reduce(
    (acc, questions) => acc + questions.length,
    0,
  );

  const calculateTotalProgress = () => {
    const totalAnswered = Object.values(answers).reduce(
      (acc, pillarAnswers) => acc + Object.keys(pillarAnswers).length,
      0,
    );

    return totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  };

  const handleAnswer = (pillarId: PillarId, questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [pillarId]: {
        ...prev[pillarId],
        [questionIndex]: answerIndex,
      },
    }));
  };

  const handleRestartPillar = (pillarId: PillarId) => {
    setAnswers((prev) => ({
      ...prev,
      [pillarId]: {},
    }));
    setCurrentQuestion(0);
  };

  const handleNextQuestion = () => {
    if (!activePillar) {
      return;
    }

    const pillarQuestions = diagnosticoQuestions[activePillar];
    if (currentQuestion < pillarQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleStartPillar = (pillarId: PillarId) => {
    setActivePillar(pillarId);
    setCurrentQuestion(0);
  };

  const getColorClasses = (color: PillarColor) => {
    const colorMap: Record<
      PillarColor,
      { bg: string; text: string; border: string; icon: string }
    > = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-700',
        icon: 'bg-blue-100 dark:bg-blue-900/40',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-700',
        icon: 'bg-yellow-100 dark:bg-yellow-900/40',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'bg-orange-100 dark:bg-orange-900/40',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-700',
        icon: 'bg-green-100 dark:bg-green-900/40',
      },
    };

    return colorMap[color];
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 p-4 dark:border-purple-700/30 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              {t.panelInicial.diagnosis.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.panelInicial.diagnosis.description}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="w-full gap-2 border-purple-600 bg-purple-600 text-white hover:border-purple-700 hover:bg-purple-700 sm:w-auto"
          >
            <Printer className="h-4 w-4" />
            {t.panelInicial.diagnosis.printDiagnosis}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t.panelInicial.diagnosis.centerTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t.panelInicial.diagnosis.centerDescription}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          El diagnostico contiene <span className="text-purple-600">{t.panelInicial.diagnosis.questionCount}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pilares.map((pilar) => {
            const progress = calculateProgress(pilar.id);
            const isComplete = progress === diagnosticoQuestions[pilar.id].length;

            return (
              <div key={pilar.id} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isComplete ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isComplete && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {pilar.emoji} {pilar.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t.panelInicial.diagnosis.progress}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {calculateTotalProgress()}% {t.panelInicial.diagnosis.progressOf}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {pilares.map((pilar) => {
            const progress = calculateProgress(pilar.id);
            const isComplete = progress === diagnosticoQuestions[pilar.id].length;

            return (
              <div key={pilar.id} className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isComplete ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isComplete && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{pilar.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pilares.map((pilar) => {
          const progress = calculateProgress(pilar.id);
          const totalPillarQuestions = diagnosticoQuestions[pilar.id].length;
          const isActive = activePillar === pilar.id;
          const colors = getColorClasses(pilar.color);

          return (
            <div key={pilar.id}>
              <div className={`border-2 rounded-lg p-4 transition-all sm:p-6 ${colors.border} ${colors.bg}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colors.icon}`}>
                    {pilar.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${colors.text}`}>{pilar.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pilar.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {progress}/{totalPillarQuestions}
                  </span>
                  <Button
                    onClick={() => handleStartPillar(pilar.id)}
                    size="sm"
                    className="w-full bg-purple-600 text-white hover:bg-purple-700 sm:w-auto"
                  >
                    {progress === 0
                      ? t.panelInicial.diagnosis.start
                      : progress === totalPillarQuestions
                        ? t.panelInicial.diagnosis.doAgain
                        : t.panelInicial.diagnosis.continue}
                  </Button>
                </div>
              </div>

              {isActive && (
                <div className="mt-4 rounded-lg border-2 border-purple-600 bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-8">
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {pilar.emoji} {pilar.title}
                    </h4>
                    <Button variant="outline" size="sm" onClick={() => setActivePillar(null)} className="w-full sm:w-auto">
                      {t.panelInicial.diagnosis.close}
                    </Button>
                  </div>

                  <div className="mb-8">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.panelInicial.diagnosis.question} {currentQuestion + 1} {t.panelInicial.diagnosis.of}{' '}
                        {totalPillarQuestions}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress}/{totalPillarQuestions} {t.panelInicial.diagnosis.completed}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / totalPillarQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {(() => {
                    const currentQ = diagnosticoQuestions[pilar.id][currentQuestion];
                    const selectedAnswer = answers[pilar.id][currentQuestion];

                    return (
                      <div className="mb-8">
                        <p className="mb-6 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                          {currentQuestion + 1}. {currentQ.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentQ.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => handleAnswer(pilar.id, currentQuestion, optionIndex)}
                              className={`rounded-lg border-2 px-4 py-4 text-left text-sm font-medium transition-all sm:px-6 sm:text-base ${
                                selectedAnswer === optionIndex
                                  ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="w-full gap-2 sm:w-auto"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t.panelInicial.diagnosis.previous}
                    </Button>

                    {currentQuestion < totalPillarQuestions - 1 ? (
                      <Button
                        size="sm"
                        onClick={handleNextQuestion}
                        className="w-full gap-2 bg-purple-600 hover:bg-purple-700 sm:w-auto"
                      >
                        {t.panelInicial.diagnosis.next}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setActivePillar(null);
                          setCurrentQuestion(0);
                        }}
                        disabled={progress < totalPillarQuestions}
                        className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
                      >
                        {t.panelInicial.diagnosis.finish}
                      </Button>
                    )}
                  </div>

                  {progress === totalPillarQuestions && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestartPillar(pilar.id)}
                        className="text-sm"
                      >
                        {t.panelInicial.diagnosis.restart}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
