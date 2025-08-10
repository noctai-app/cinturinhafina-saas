import React, { useState } from 'react';
import { UserData } from '../types/calculator';
import { ChevronDown, Info } from 'lucide-react';

interface CalculatorFormProps {
  leadData: { name: string; email: string; whatsapp: string };
  onSubmit: (data: UserData) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ leadData, onSubmit }) => {
  const [formData, setFormData] = useState({
    gender: 'female' as 'female' | 'male',
    age: '',
    weight: '',
    height: '',
    activityLevel: 1.375,
    bodyFat: '',
    bodyFeeling: '',
    goal: 'lose' as 'lose' | 'maintain' | 'gain' | 'custom',
    customCalories: '',
    deficitLevel: 'moderate' as 'light' | 'moderate' | 'aggressive'
  });

  const getGenderSpecificOptions = () => {
    if (formData.gender === 'female') {
      return [
        'Inchada e travada',
        'Com retenção',
        'Sem energia',
        'Quero melhorar visual'
      ];
    } else {
      return [
        'Inchado e travado',
        'Com retenção',
        'Sem energia',
        'Quero melhorar visual'
      ];
    }
  };

  const [showActivityDropdown, setShowActivityDropdown] = useState(false);

  const activityOptions = [
    { value: 1.2, label: 'Sedentária', desc: 'Pouco ou nenhum exercício' },
    { value: 1.375, label: 'Levemente ativa', desc: 'Exercício leve 1-3 dias/semana' },
    { value: 1.55, label: 'Moderadamente ativa', desc: 'Exercício moderado 3-5 dias/semana' },
    { value: 1.725, label: 'Muito ativa', desc: 'Exercício pesado 6-7 dias/semana' },
    { value: 1.9, label: 'Super ativa', desc: 'Exercício muito pesado, trabalho físico' }
  ];

  const selectedActivity = activityOptions.find(opt => opt.value === formData.activityLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData: UserData = {
      ...leadData,
      gender: formData.gender,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activityLevel: formData.activityLevel,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      bodyFeeling: formData.bodyFeeling,
      goal: formData.goal,
      customCalories: formData.customCalories ? parseFloat(formData.customCalories) : undefined,
      deficitLevel: formData.deficitLevel
    };

    onSubmit(userData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mb-4 animate-pulse">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {leadData.name}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Vamos calcular seu perfil nutricional personalizado
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sexo */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              ⚧ Sexo
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'female', label: '♀️ Feminino', gradient: 'from-pink-500 to-rose-500' },
                { value: 'male', label: '♂️ Masculino', gradient: 'from-blue-500 to-cyan-500' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: option.value as 'female' | 'male' })}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    formData.gender === option.value
                      ? `border-transparent bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="font-semibold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              🎯 Escolha seu Objetivo
            </label>
            <p className="text-gray-600 mb-4">Personalize seu plano nutricional</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'lose', label: 'Perder Peso', desc: 'Déficit calórico para queimar gordura', icon: '🔥', gradient: 'from-red-500 to-orange-500' },
                { value: 'maintain', label: 'Manter Peso', desc: 'Manter seu peso atual', icon: '⚖️', gradient: 'from-blue-500 to-indigo-500' },
                { value: 'gain', label: 'Ganhar Massa', desc: 'Superávit calórico para construir músculos', icon: '💪', gradient: 'from-green-500 to-emerald-500' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: option.value as any })}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                    formData.goal === option.value
                      ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-semibold mb-1">{option.label}</div>
                  <div className="text-sm opacity-80">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

     

          {/* Dados físicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                🎂 Idade (anos)
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
                min="18"
                max="80"
                placeholder="Ex: 25"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                ⚖️ Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
                min="40"
                max="200"
                placeholder="Ex: 65.5"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📏 Altura (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                required
                min="140"
                max="220"
                placeholder="Ex: 165"
              />
            </div>
          </div>

          {/* Nível de atividade */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              🏃‍♀️ Nível de Atividade Física
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowActivityDropdown(!showActivityDropdown)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{selectedActivity?.label}</div>
                  <div className="text-sm text-gray-500">{selectedActivity?.desc}</div>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${showActivityDropdown ? 'rotate-180' : ''}`} size={20} />
              </button>
              
              {showActivityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-2xl z-10 overflow-hidden">
                  {activityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, activityLevel: option.value });
                        setShowActivityDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="font-semibold text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gordura corporal */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              💪 Porcentagem de gordura corporal (opcional)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.bodyFat}
              onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              min="5"
              max="50"
              placeholder="Ex: 25% (se souber) - Opcional"
            />
          </div>

          {/* Sentimento com o corpo */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              👀 Como você se sente com seu corpo hoje?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                let options;
                if (formData.goal === 'gain') {
                  options = formData.gender === 'female' ? [
                    'Muito magra',
                    'Sem curvas',
                    'Fraca fisicamente',
                    'Quero mais volume muscular'
                  ] : [
                    'Muito magro',
                    'Sem massa muscular',
                    'Fraco fisicamente', 
                    'Quero mais volume muscular'
                  ];
                } else {
                  options = getGenderSpecificOptions();
                }
                return options;
              })().map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, bodyFeeling: option })}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                    formData.bodyFeeling === option
                      ? 'border-transparent bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="font-semibold">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center space-x-2"
          >
            <span>🔍 Gerar meu plano nutricional personalizado</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CalculatorForm;