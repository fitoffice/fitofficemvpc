import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';
import { Ingredient } from './IngredientsPopup';

interface NewIngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  ingredientToEdit?: Ingredient | null;
}

export default function NewIngredientForm({ 
  isOpen, 
  onClose, 
  onSave,
  ingredientToEdit 
}: NewIngredientFormProps) {
  const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    category: 'proteínas',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    servingSize: '',
    allergens: [],
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing an existing ingredient, populate the form
  useEffect(() => {
    if (ingredientToEdit) {
      setFormData({
        name: ingredientToEdit.name,
        category: ingredientToEdit.category,
        calories: ingredientToEdit.calories,
        protein: ingredientToEdit.protein,
        carbs: ingredientToEdit.carbs,
        fats: ingredientToEdit.fats,
        servingSize: ingredientToEdit.servingSize,
        allergens: [...ingredientToEdit.allergens],
        tags: [...ingredientToEdit.tags]
      });
    }
  }, [ingredientToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['calories', 'protein', 'carbs', 'fats'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, newAllergen.trim()]
      });
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergenToRemove: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter(allergen => allergen !== allergenToRemove)
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.servingSize.trim()) {
      newErrors.servingSize = 'La porción es obligatoria';
    }
    
    if (formData.calories < 0) {
      newErrors.calories = 'Las calorías no pueden ser negativas';
    }
    
    if (formData.protein < 0) {
      newErrors.protein = 'Las proteínas no pueden ser negativas';
    }
    
    if (formData.carbs < 0) {
      newErrors.carbs = 'Los carbohidratos no pueden ser negativos';
    }
    
    if (formData.fats < 0) {
      newErrors.fats = 'Las grasas no pueden ser negativas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newIngredient: Ingredient = {
        id: ingredientToEdit?.id || Date.now().toString(),
        ...formData
      };
      
      onSave(newIngredient);
      onClose();
      
      // Reset form if not editing
      if (!ingredientToEdit) {
        setFormData({
          name: '',
          category: 'proteínas',
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          servingSize: '',
          allergens: [],
          tags: []
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700 animate-fade-in">
        <div className="p-6 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {ingredientToEdit ? 'Editar Alimento' : 'Nuevo Alimento'}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Información Básica</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Nombre del Alimento*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-slate-400`}
                  placeholder="Ej: Pechuga de pollo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white"
                >
                  <option value="proteínas">Proteínas</option>
                  <option value="carbohidratos">Carbohidratos</option>
                  <option value="grasas">Grasas</option>
                  <option value="lácteos y alternativas">Lácteos y alternativas</option>
                  <option value="verduras">Verduras</option>
                  <option value="frutas">Frutas</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="servingSize" className="block text-sm font-medium text-slate-300 mb-1">
                  Tamaño de Porción*
                </label>
                <input
                  type="text"
                  id="servingSize"
                  name="servingSize"
                  value={formData.servingSize}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border ${errors.servingSize ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-slate-400`}
                  placeholder="Ej: 100g, 1 taza, etc."
                />
                {errors.servingSize && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.servingSize}
                  </p>
                )}
              </div>
            </div>
            
            {/* Nutritional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Información Nutricional</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-slate-300 mb-1">
                    Calorías (kcal)
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 bg-slate-700/50 border ${errors.calories ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white`}
                  />
                  {errors.calories && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.calories}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-slate-300 mb-1">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 bg-slate-700/50 border ${errors.protein ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white`}
                  />
                  {errors.protein && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.protein}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="carbs" className="block text-sm font-medium text-slate-300 mb-1">
                    Carbohidratos (g)
                  </label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 bg-slate-700/50 border ${errors.carbs ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white`}
                  />
                  {errors.carbs && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.carbs}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="fats" className="block text-sm font-medium text-slate-300 mb-1">
                    Grasas (g)
                  </label>
                  <input
                    type="number"
                    id="fats"
                    name="fats"
                    value={formData.fats}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 bg-slate-700/50 border ${errors.fats ? 'border-red-500' : 'border-slate-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white`}
                  />
                  {errors.fats && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fats}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Etiquetas</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-slate-400"
                  placeholder="Añadir etiqueta (ej: bajo en grasa)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Allergens */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Alérgenos</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-slate-400"
                  placeholder="Añadir alérgeno (ej: frutos secos)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                />
                <button
                  type="button"
                  onClick={addAllergen}
                  className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {formData.allergens.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergens.map((allergen, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-lg text-sm text-red-300">
                      {allergen}
                      <button
                        type="button"
                        onClick={() => removeAllergen(allergen)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all text-white font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>{ingredientToEdit ? 'Guardar Cambios' : 'Crear Alimento'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.7);
        }
      `}</style>
    </div>
  );
}