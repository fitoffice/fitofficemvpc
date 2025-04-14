import React, { useState } from 'react';
import { User, Target, Palette, Save, X } from 'lucide-react';

interface ProfileSetupProps {
  onSave: (profileData: ProfileData) => void;
}

export interface ProfileData {
  coachInfo: {
    name: string;
    businessName: string;
    brandVoice: string;
  };
  audience: {
    targetAudience: string;
    contentGoals: string;
  };
  branding: {
    logoUrl: string;
    brandColors: string;
  };
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    coachInfo: {
      name: '',
      businessName: '',
      brandVoice: '',
    },
    audience: {
      targetAudience: '',
      contentGoals: '',
    },
    branding: {
      logoUrl: '',
      brandColors: '',
    }
  });

  const handleInputChange = (
    section: keyof ProfileData,
    field: string,
    value: string
  ) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    onSave(profileData);
  };

  // Nuevo estado para manejar la subida de archivos
  const [isUploading, setIsUploading] = useState(false);
  
  // Función para manejar la subida de archivos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      // Simulación de subida de archivo
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      handleInputChange('branding', 'logoUrl', fileUrl);
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Configuración de Perfil
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Comencemos conociendo mejor a ti y a tu negocio de entrenamiento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coach Information - Mejorado */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Información del Entrenador
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6 text-lg">
            Cuéntanos sobre ti y tu negocio de entrenamiento
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-lg">
                Tu Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                placeholder="Ej: Juan Pérez Rodríguez"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                value={profileData.coachInfo.name}
                onChange={(e) => handleInputChange('coachInfo', 'name', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2 text-lg">
                Nombre del Negocio/Marca
              </label>
              <input
                type="text"
                id="businessName"
                placeholder="Ej: Entrenamiento Élite S.A."
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                value={profileData.coachInfo.businessName}
                onChange={(e) => handleInputChange('coachInfo', 'businessName', e.target.value)}
              />
            </div>

            {/* Nuevo campo - Años de experiencia */}
            <div>
              <label htmlFor="experience" className="block text-gray-700 font-medium mb-2 text-lg">
                Años de Experiencia
              </label>
              <select
                id="experience"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                value={profileData.coachInfo.experience || ''}
                onChange={(e) => handleInputChange('coachInfo', 'experience', e.target.value)}
              >
                <option value="">Selecciona tus años de experiencia</option>
                <option value="1-3">1-3 años</option>
                <option value="3-5">3-5 años</option>
                <option value="5-10">5-10 años</option>
                <option value="10+">Más de 10 años</option>
              </select>
            </div>

            <div>
              <label htmlFor="brandVoice" className="block text-gray-700 font-medium mb-2 text-lg">
                Estilo de Comunicación
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Profesional', 'Motivacional', 'Amigable', 'Técnico', 'Divertido', 'Inspirador'].map((style) => (
                  <label key={style} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.coachInfo.brandVoice?.includes(style)}
                      onChange={() => {
                        const current = profileData.coachInfo.brandVoice?.split(', ') || [];
                        const updated = current.includes(style)
                          ? current.filter(s => s !== style)
                          : [...current, style];
                        handleInputChange('coachInfo', 'brandVoice', updated.join(', '));
                      }}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <span>{style}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audience & Goals - Mejorado */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Audiencia y Objetivos
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6 text-lg">
            Define a quién intentas llegar y qué quieres lograr
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="targetAudience" className="block text-gray-700 font-medium mb-2 text-lg">
                Perfil de tu Cliente Ideal
              </label>
              <textarea
                id="targetAudience"
                placeholder="Ej: Mujeres entre 30-45 años, interesadas en fitness, con poco tiempo para entrenar..."
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg min-h-[150px] resize-y"
                value={profileData.audience.targetAudience}
                onChange={(e) => handleInputChange('audience', 'targetAudience', e.target.value)}
              />
            </div>

            {/* Nuevo campo - Nicho de mercado */}
            <div>
              <label htmlFor="marketNiche" className="block text-gray-700 font-medium mb-2 text-lg">
                Nicho de Mercado Específico
              </label>
              <input
                type="text"
                id="marketNiche"
                placeholder="Ej: Entrenamiento para madres ocupadas"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                value={profileData.audience.marketNiche || ''}
                onChange={(e) => handleInputChange('audience', 'marketNiche', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="contentGoals" className="block text-gray-700 font-medium mb-2 text-lg">
                Objetivos Principales
              </label>
              <div className="space-y-3">
                {[
                  'Construir autoridad en el sector',
                  'Generar leads/clientes',
                  'Educar a la audiencia',
                  'Promocionar productos/servicios',
                  'Crear comunidad',
                  'Aumentar engagement'
                ].map((goal, index) => (
                  <label key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profileData.audience.contentGoals?.includes(goal)}
                      onChange={() => {
                        const current = profileData.audience.contentGoals?.split('\n') || [];
                        const updated = current.includes(goal)
                          ? current.filter(g => g !== goal)
                          : [...current, goal];
                        handleInputChange('audience', 'contentGoals', updated.join('\n'));
                      }}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Elements - Mejorado */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-full">
            <Palette className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Identidad Visual
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6 text-lg">
          Personaliza los elementos visuales de tu estrategia
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          

          <div>
            <label className="block text-gray-700 font-medium mb-4 text-lg">
              Paleta de Colores
            </label>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {profileData.branding.brandColors?.split(',').filter(Boolean).map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.trim() }}
                  />
                  <span>{color.trim()}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ej: #4A90E2, #50E3C2, #F5A623"
                className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                value={profileData.branding.brandColors}
                onChange={(e) => handleInputChange('branding', 'brandColors', e.target.value)}
              />
              <button 
                className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                onClick={() => {
                  const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#9013FE', '#7ED321'];
                  handleInputChange('branding', 'brandColors', colors.join(', '));
                }}
              >
                Sugerir
              </button>
            </div>
            
            <p className="text-gray-500 mt-2">
              Ingresa códigos HEX separados por comas
            </p>
          </div>
        </div>
      </div>

      

      {/* Botón de guardar mejorado */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-medium text-lg"
        >
          Volver Arriba
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg flex items-center gap-2 shadow-lg"
        >
          <Save className="w-6 h-6" />
          Guardar y Continuar
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;