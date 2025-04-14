import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DietInfo from '../components/dietspage/DietInfo';
import VistaAlimentacion from '../components/dietspage/VistaAlimentacion';
import { useTheme } from '../contexts/ThemeContext';

export default function PageEdicionDieta() {
  const location = useLocation();
  const { id } = useParams();
  const dietData = location.state?.dietData;
  const { theme } = useTheme();

  // Estado para almacenar los datos de la dieta
  const [diet, setDiet] = useState(dietData);

  useEffect(() => {
    const fetchDietData = async () => {
      if (!dietData && id) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/dietas/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('No se pudo obtener la dieta');
          }

          const data = await response.json();
          setDiet(data);
        } catch (error) {
          console.error('Error al obtener la dieta:', error);
        }
      }
    };

    fetchDietData();
  }, [id, dietData]);

  return (
    <div className={`min-h-screen pb-12 ${theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
      : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="px-4 py-8">
        <DietInfo
          title={diet?.nombre || 'Cargando...'}
          client={diet?.cliente?.nombre || 'Cliente no disponible'}
          goal={diet?.objetivo || 'Sin objetivo'}
          restrictions={diet?.restricciones || 'Sin restricciones'}
          estado={diet?.estado || "activa"}
          macros={diet?.semanas?.[0]?.dias?.[0]?.restricciones ? {
            calories: { current: 0, target: diet.semanas[0].dias[0].restricciones.calorias },
            protein: { current: 0, target: diet.semanas[0].dias[0].restricciones.proteinas },
            carbs: { current: 0, target: diet.semanas[0].dias[0].restricciones.carbohidratos },
            fats: { current: 0, target: diet.semanas[0].dias[0].restricciones.grasas }
          } : undefined}
        />
        
        {/* Nuevo componente VistaAlimentacion */}
        <VistaAlimentacion dietData={diet} />
      </div>
    </div>
  );
}