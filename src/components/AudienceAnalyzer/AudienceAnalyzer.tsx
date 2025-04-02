import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Save, 
  Loader2, 
  Users, 
  X, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown,
  UserCircle2,
  Heart,
  Clock,
  BarChart3,
  Video,
  Target,
  CreditCard,
  Users2,
  FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AudienceAnalyzerResponse from './AudienceAnalyzerResponse';

interface AudienceAnalyzerProps {
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  defaultAnswer: string;
  answer: string;
  type: 'text' | 'number' | 'dropdown' | 'checkbox' | 'textarea';
  options?: string[];
  section: string;
}

interface AudienceData {
  targetGender: string;
  primaryInterest: string;
  specificInterests: string[];
  activeHours: string[];
  painPoints: string[];
  goals: string[];
  communicationStyle: string;
}

const AudienceAnalyzer: React.FC<AudienceAnalyzerProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Demografía': true,
    'Intereses y conocimiento': false,
    'Horarios de actividad': false,
    'Engagement y métricas': false,
    'Contenido más exitoso': false,
    'Pain points y objetivos': false,
    'Presupuesto': false,
    'Competidores': false,
    'Notas adicionales': false
  });
  
  const [questions, setQuestions] = useState<Question[]>([
    // Demografía
    {
      id: 1,
      question: "Distribución de género",
      defaultAnswer: "60% mujeres, 40% hombres",
      answer: "",
      type: "text",
      section: "Demografía"
    },
    {
      id: 2,
      question: "Rango de edad predominante",
      defaultAnswer: "25-45 años",
      answer: "",
      type: "text",
      section: "Demografía"
    },
    {
      id: 3,
      question: "Ubicación principal (opcional)",
      defaultAnswer: "Madrid, Barcelona, Valencia",
      answer: "",
      type: "text",
      section: "Demografía"
    },
    
    // Intereses y conocimiento
    {
      id: 4,
      question: "Intereses principales",
      defaultAnswer: "Fitness, nutrición saludable, bienestar mental, lifestyle",
      answer: "",
      type: "text",
      section: "Intereses y conocimiento"
    },
    {
      id: 5,
      question: "Nivel de conocimiento de la audiencia",
      defaultAnswer: "Intermedio",
      answer: "",
      type: "dropdown",
      options: ["Principiante", "Intermedio", "Avanzado", "Mixto"],
      section: "Intereses y conocimiento"
    },
    
    // Horarios de actividad
    {
      id: 6,
      question: "Horarios de mayor actividad",
      defaultAnswer: "Mañanas (7-9am), Noches (8-11pm)",
      answer: "",
      type: "text",
      section: "Horarios de actividad"
    },
    {
      id: 7,
      question: "Días de la semana más activos (opcional)",
      defaultAnswer: "Lunes, Miércoles, Viernes",
      answer: "",
      type: "text",
      section: "Horarios de actividad"
    },
    
    // Engagement y métricas
    {
      id: 8,
      question: "Número de seguidores",
      defaultAnswer: "10.000",
      answer: "",
      type: "number",
      section: "Engagement y métricas"
    },
    {
      id: 9,
      question: "Likes promedio por publicación",
      defaultAnswer: "200-300",
      answer: "",
      type: "text",
      section: "Engagement y métricas"
    },
    {
      id: 10,
      question: "Comentarios promedio por publicación",
      defaultAnswer: "10-15",
      answer: "",
      type: "text",
      section: "Engagement y métricas"
    },
    {
      id: 11,
      question: "Visualizaciones promedio de Stories",
      defaultAnswer: "1.000-1.500",
      answer: "",
      type: "text",
      section: "Engagement y métricas"
    },
    {
      id: 12,
      question: "Tasa de engagement (si se conoce)",
      defaultAnswer: "2.5%",
      answer: "",
      type: "text",
      section: "Engagement y métricas"
    },
    
    // Contenido más exitoso
    {
      id: 13,
      question: "Formato más exitoso",
      defaultAnswer: "Reels, Stories, Posts",
      answer: "",
      type: "text",
      section: "Contenido más exitoso"
    },
    {
      id: 14,
      question: "Temática más valorada por la audiencia",
      defaultAnswer: "Videos cortos de ejercicios, antes/después, consejos rápidos",
      answer: "",
      type: "text",
      section: "Contenido más exitoso"
    },
    
    // Pain points y objetivos
    {
      id: 15,
      question: "Problemáticas comunes",
      defaultAnswer: "Falta de tiempo, motivación inconsistente, resultados lentos",
      answer: "",
      type: "text",
      section: "Pain points y objetivos"
    },
    {
      id: 16,
      question: "Objetivos de transformación",
      defaultAnswer: "Pérdida de peso, tonificación, hábitos saludables",
      answer: "",
      type: "text",
      section: "Pain points y objetivos"
    },
    
    // Presupuesto
    {
      id: 17,
      question: "Rango de gasto promedio en fitness",
      defaultAnswer: "50-150€ mensuales",
      answer: "",
      type: "text",
      section: "Presupuesto"
    },
    
    // Competidores
    {
      id: 18,
      question: "Principales competidores que siguen",
      defaultAnswer: "Otros entrenadores personales, influencers fitness, marcas deportivas",
      answer: "",
      type: "text",
      section: "Competidores"
    },
    
    // Notas adicionales
    {
      id: 19,
      question: "Comentarios o notas adicionales",
      defaultAnswer: "Cualquier información extra relevante sobre tu audiencia",
      answer: "",
      type: "textarea",
      section: "Notas adicionales"
    }
  ]);

  const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer: value } : q
    ));
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const getSectionIcon = (section: string) => {
    switch(section) {
      case 'Demografía': return <UserCircle2 className="w-5 h-5 text-blue-500" />;
      case 'Intereses y conocimiento': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Horarios de actividad': return <Clock className="w-5 h-5 text-purple-500" />;
      case 'Engagement y métricas': return <BarChart3 className="w-5 h-5 text-green-500" />;
      case 'Contenido más exitoso': return <Video className="w-5 h-5 text-red-500" />;
      case 'Pain points y objetivos': return <Target className="w-5 h-5 text-yellow-500" />;
      case 'Presupuesto': return <CreditCard className="w-5 h-5 text-indigo-500" />;
      case 'Competidores': return <Users2 className="w-5 h-5 text-orange-500" />;
      case 'Notas adicionales': return <FileText className="w-5 h-5 text-gray-500" />;
      default: return <ChevronRight className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleSave = () => {
    // Aquí puedes implementar la lógica para guardar las respuestas
    console.log('Análisis de audiencia guardado:', questions);
    onClose();
  };

  const progressPercentage = (questions.filter(q => q.answer.trim() !== '').length / questions.length) * 100;

  const generateApiPayload = (formData: any) => {
    console.log('🎯 Generando payload para análisis de audiencia...');
    console.log('📝 Datos del formulario:', formData);
    
    // Extraer respuestas por sección
    const demografiaQuestions = questions.filter(q => q.section === 'Demografía');
    const interesesQuestions = questions.filter(q => q.section === 'Intereses y conocimiento');
    const horariosQuestions = questions.filter(q => q.section === 'Horarios de actividad');
    const engagementQuestions = questions.filter(q => q.section === 'Engagement y métricas');
    const contenidoQuestions = questions.filter(q => q.section === 'Contenido más exitoso');
    const painPointsQuestions = questions.filter(q => q.section === 'Pain points y objetivos');
    const presupuestoQuestions = questions.filter(q => q.section === 'Presupuesto');
    const competidoresQuestions = questions.filter(q => q.section === 'Competidores');
    const notasQuestions = questions.filter(q => q.section === 'Notas adicionales');
    
    // Construir payload con respuestas o valores por defecto
    const payload = {
      distributionDemographic: `${demografiaQuestions[0].answer || demografiaQuestions[0].defaultAnswer}, principalmente entre ${demografiaQuestions[1].answer || demografiaQuestions[1].defaultAnswer}, ubicados en ${demografiaQuestions[2].answer || demografiaQuestions[2].defaultAnswer}`,
      
      interests: (interesesQuestions[0].answer || interesesQuestions[0].defaultAnswer)
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      
      knowledgeLevel: interesesQuestions[1].answer || interesesQuestions[1].defaultAnswer,
      
      activeHours: `Mayor actividad: ${horariosQuestions[0].answer || horariosQuestions[0].defaultAnswer}. Días más activos: ${horariosQuestions[1].answer || horariosQuestions[1].defaultAnswer}`,
      
      engagementMetrics: {
        followers: engagementQuestions[0].answer || engagementQuestions[0].defaultAnswer,
        avgLikes: engagementQuestions[1].answer || engagementQuestions[1].defaultAnswer,
        avgComments: engagementQuestions[2].answer || engagementQuestions[2].defaultAnswer,
        avgStoryViews: engagementQuestions[3].answer || engagementQuestions[3].defaultAnswer,
        engagementRate: engagementQuestions[4].answer || engagementQuestions[4].defaultAnswer
      },
      
      contentEngagement: [
        ...(contenidoQuestions[0].answer || contenidoQuestions[0].defaultAnswer)
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
        ...(contenidoQuestions[1].answer || contenidoQuestions[1].defaultAnswer)
          .split(',')
          .map(s => s.trim())
          .filter(s => s)
      ],
      
      painPoints: (painPointsQuestions[0].answer || painPointsQuestions[0].defaultAnswer)
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      
      transformationGoals: (painPointsQuestions[1].answer || painPointsQuestions[1].defaultAnswer)
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      
      budget: presupuestoQuestions[0].answer || presupuestoQuestions[0].defaultAnswer,
      
      competitors: (competidoresQuestions[0].answer || competidoresQuestions[0].defaultAnswer)
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      
      additionalNotes: notasQuestions[0].answer || notasQuestions[0].defaultAnswer
    };

    console.log('📦 Payload generado:', payload);
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const formData = {
        // Extraer datos del formulario
        questions
      };

      const payload = generateApiPayload(formData);
      console.log('🚀 Enviando análisis a la API:', payload);

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/chats/audience-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('❌ Error en la respuesta:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa del análisis:', {
        status: response.status,
        data: data
      });

      setAnalysis(data);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('❌ Error en el análisis:', {
        error: error,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      setError((error as Error).message);
      setIsLoading(false);
    }
  };

  // Agrupar preguntas por sección
  const sections = [...new Set(questions.map(q => q.section))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/50'
      }`}
    >
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">Análisis Detallado de Audiencia</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completa el análisis para entender mejor a tu audiencia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="sticky top-[88px] z-10 px-6 py-2 bg-inherit border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Progreso del análisis
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="p-6 space-y-6">
          {!isSuccess ? (
            sections.map((section) => (
              <div 
                key={section}
                className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${
                  expandedSections[section] ? 'shadow-md' : ''
                }`}
              >
                <button
                  onClick={() => toggleSection(section)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                    theme === 'dark' 
                      ? expandedSections[section] ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700' 
                      : expandedSections[section] ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getSectionIcon(section)}
                    <h3 className="text-lg font-semibold">{section}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    expandedSections[section] ? 'transform rotate-180' : ''
                  }`} />
                </button>
                
                {expandedSections[section] && (
                  <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
                    {questions
                      .filter(q => q.section === section)
                      .map((q) => (
                        <motion.div 
                          key={q.id}
                          initial={false}
                          animate={{ 
                            scale: hoveredQuestion === q.id ? 1.01 : 1,
                            backgroundColor: hoveredQuestion === q.id 
                              ? theme === 'dark' ? 'rgb(31, 41, 55)' : 'rgb(249, 250, 251)'
                              : 'transparent'
                          }}
                          onHoverStart={() => setHoveredQuestion(q.id)}
                          onHoverEnd={() => setHoveredQuestion(null)}
                          className="p-4 rounded-xl space-y-2 transition-colors"
                        >
                          <div className="flex items-start space-x-2">
                            <ChevronRight className={`w-5 h-5 mt-1 transition-colors ${
                              hoveredQuestion === q.id ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                            <div className="flex-1">
                              <label className="block text-lg font-medium mb-2">
                                {q.question}
                              </label>
                              
                              {q.type === 'dropdown' ? (
                                <select
                                  value={q.answer}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  className={`w-full p-4 rounded-lg border transition-all ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-gray-300 text-gray-900'
                                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                                >
                                  <option value="">Selecciona una opción</option>
                                  {q.options?.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : q.type === 'textarea' ? (
                                <textarea
                                  value={q.answer}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  placeholder={q.defaultAnswer}
                                  className={`w-full p-4 rounded-lg border transition-all ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                                  rows={4}
                                />
                              ) : (
                                <input
                                  type={q.type}
                                  value={q.answer}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  placeholder={q.defaultAnswer}
                                  className={`w-full p-4 rounded-lg border transition-all ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400`}
                                />
                              )}
                              
                              {!q.answer && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                                  <AlertCircle className="inline-block w-4 h-4 mr-1" />
                                  Sugerencia: {q.defaultAnswer}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <AudienceAnalyzerResponse data={analysis} />
          )}
          
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
              <p className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-inherit">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : progressPercentage < 30
                  ? 'bg-blue-400 hover:bg-blue-500'
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Analizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AudienceAnalyzer;
