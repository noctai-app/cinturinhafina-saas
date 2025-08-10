import React, { useState } from 'react';
import { UserData, NutritionalResults } from '../types/calculator';
import { Info, MessageCircle, ExternalLink, Download, Share, ChevronDown, ChevronUp } from 'lucide-react';
import { downloadPDF } from '../utils/pdfGenerator';
import { shareWhatsApp } from '../utils/whatsappFormatter';
import { calculateNutritionalData, calculateAllSurplusOptions } from '../utils/calculations';

interface ResultsProps {
  userData: UserData;
  results: NutritionalResults;
  onViewConversion: () => void;
  onPDFDownload: () => void;
  onIntensityChange: (intensity: 'light' | 'moderate' | 'aggressive') => void;
}

const Results: React.FC<ResultsProps> = ({ userData, results, onViewConversion, onPDFDownload, onIntensityChange }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<'light' | 'moderate' | 'aggressive'>('moderate');
  
  // Estados para déficit (perda de peso)
  const [deficitResults, setDeficitResults] = useState(userData.goal === 'lose' ? {
    light: calculateNutritionalData({ ...userData, goal: 'lose', deficitLevel: 'light' }),
    moderate: calculateNutritionalData({ ...userData, goal: 'lose', deficitLevel: 'moderate' }),
    aggressive: calculateNutritionalData({ ...userData, goal: 'lose', deficitLevel: 'aggressive' })
  } : null);
  
  // Estados para superávit (ganho de massa)
  const [surplusResults, setSurplusResults] = useState(userData.goal === 'gain' ? {
    light: calculateNutritionalData({ ...userData, goal: 'gain', deficitLevel: 'light' }),
    moderate: calculateNutritionalData({ ...userData, goal: 'gain', deficitLevel: 'moderate' }),
    aggressive: calculateNutritionalData({ ...userData, goal: 'gain', deficitLevel: 'aggressive' })
  } : null);

  const InfoTooltip = ({ id, title, description }: { id: string; title: string; description: string }) => (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        className="ml-2 p-1 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
      >
        <Info size={14} className="text-slate-400" />
      </button>
      {showTooltip === id && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-600 rounded-lg shadow-xl z-10">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      )}
    </div>
  );

  const genderText = userData.gender === 'female' ? 'Mulheres' : 'Homens';
  const genderPronoun = userData.gender === 'female' ? 'ela' : 'ele';

  const getGoalText = () => {
    switch (userData.goal) {
      case 'lose': return 'perda de peso';
      case 'maintain': return 'manutenção do peso';
      case 'gain': return 'ganho de massa';
      case 'custom': return 'objetivo personalizado';
      default: return 'perda de peso';
    }
  };

  const handleDownloadPDF = async () => {
    onPDFDownload(); // Notificar o App sobre o download
    await downloadPDF(userData, results);
  };

  const handleShareWhatsApp = () => {
    shareWhatsApp(userData, results);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

    {/* Header dos resultados */}
      <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 animate-bounce">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Seu Plano Está Pronto!
        </h2>
        <p className="text-xl text-green-100">
          Resultados baseados em ciência e personalizados para você
        </p>
      </div>
      
      {/* Seu Objetivo */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Seu Objetivo
          </h3>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {getGoalText().toUpperCase()}
          </div>
          <p className="text-gray-700 text-lg">
            Plano personalizado para <strong>{userData.name}</strong>
          </p>
        </div>
      </div>

      {/* Seletor de Intensidade - para objetivos "lose" e "gain" */}
      {(userData.goal === 'lose' || userData.goal === 'gain') && (
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${
              userData.goal === 'lose' ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500'
            } rounded-2xl mb-4`}>
              <span className="text-2xl">{userData.goal === 'lose' ? '🔥' : '💪'}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {userData.goal === 'lose' 
                ? 'Escolha sua Intensidade de Déficit Calórico'
                : 'Escolha sua Intensidade de Superávit Calórico'
              }
            </h3>
            <p className="text-gray-600">
              {userData.goal === 'lose'
                ? 'Selecione o nível que melhor se adapta ao seu estilo de vida'
                : 'Selecione a estratégia ideal para seu ganho de massa'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(userData.goal === 'lose' ? [
              { 
                value: 'light', 
                label: 'Leve', 
                desc: '5% a 10% menos calorias', 
                gradient: 'from-green-500 to-emerald-500',
                calories: deficitResults!.light.targetCalories
              },
              { 
                value: 'moderate', 
                label: 'Moderado', 
                desc: '10% a 20% menos calorias', 
                gradient: 'from-orange-500 to-yellow-500',
                calories: deficitResults!.moderate.targetCalories
              },
              { 
                value: 'aggressive', 
                label: 'Agressivo', 
                desc: '20% a 25% menos calorias', 
                gradient: 'from-red-500 to-pink-500',
                calories: deficitResults!.aggressive.targetCalories
              }
            ] : [
              { 
                value: 'light', 
                label: 'Limpo', 
                desc: '8% a 15% mais calorias (clean bulk)', 
                gradient: 'from-green-500 to-emerald-500',
                calories: surplusResults!.light.targetCalories
              },
              { 
                value: 'moderate', 
                label: 'Moderado', 
                desc: '15% a 20% mais calorias', 
                gradient: 'from-blue-500 to-cyan-500',
                calories: surplusResults!.moderate.targetCalories
              },
              { 
                value: 'aggressive', 
                label: 'Agressivo', 
                desc: '25% a 30% mais calorias (bulking)', 
                gradient: 'from-purple-500 to-pink-500',
                calories: surplusResults!.aggressive.targetCalories
              }
            ]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedIntensity(option.value as any);
                  onIntensityChange(option.value as any);
                }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                  selectedIntensity === option.value
                    ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-lg mb-2">{option.label}</div>
                <div className="text-sm opacity-90 mb-3">{option.desc}</div>
                <div className="text-2xl font-bold">{option.calories} kcal/dia</div>
              </button>
            ))}
          </div>

          {selectedIntensity === 'aggressive' && userData.goal === 'lose' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-red-500 text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-red-800 mb-3">Importante: Cuidado com déficits calóricos superiores a 25%</h4>
                  <p className="text-red-700 mb-3">
                    Embora déficits acima de 25% do gasto energético total possam resultar em perda de peso mais rápida no curto prazo, 
                    essa estratégia apresenta riscos significativos à saúde e à sustentabilidade dos resultados. Entre os principais efeitos adversos observados, estão:
                  </p>
                  <ul className="text-red-700 space-y-1 mb-3">
                    <li>• Perda de massa muscular magra</li>
                    <li>• Aumento de fadiga e risco de episódios de compulsão alimentar</li>
                    <li>• Comprometimento do metabolismo e de funções hormonais</li>
                    <li>• Redução na adesão ao plano alimentar a longo prazo</li>
                  </ul>
                  <p className="text-red-700">
                    Por isso, déficits mais agressivos devem ser utilizados com cautela, por períodos limitados e, preferencialmente, com acompanhamento profissional.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {selectedIntensity === 'aggressive' && userData.goal === 'gain' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-500 text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-yellow-800 mb-3">Importante: Superávit Agressivo para Ganho de Massa</h4>
                  <p className="text-yellow-700 mb-3">
                    A literatura científica recomenda um superávit de 10% a 15% para otimizar o ganho de massa magra minimizando gordura.
                    Acima de 20% o risco de aumentar o percentual de gordura cresce consideravelmente.
                  </p>
                  <ul className="text-yellow-700 space-y-1 mb-3">
                    <li>• O corpo tem um limite natural de síntese de massa muscular</li>
                    <li>• Comer muito mais não acelera o ganho de músculo, só acumula gordura</li>
                    <li>• Mais não é melhor, especialmente se o objetivo é estética</li>
                  </ul>
                  <p className="text-yellow-700">
                    Recomendado apenas para iniciantes ou pessoas muito abaixo do peso ideal.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-center">
              Seu Plano Selecionado: {
                userData.goal === 'lose' 
                  ? (selectedIntensity === 'light' ? 'Leve' : selectedIntensity === 'moderate' ? 'Moderado' : 'Agressivo')
                  : (selectedIntensity === 'light' ? 'Limpo' : selectedIntensity === 'moderate' ? 'Moderado' : 'Agressivo')
              }
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {userData.goal === 'lose' 
                  ? deficitResults![selectedIntensity].targetCalories 
                  : userData.goal === 'gain'
                  ? surplusResults![selectedIntensity].targetCalories
                  : results.targetCalories
                } kcal/dia
              </div>
              <p className="text-gray-600">Meta calórica para {getGoalText()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Distribuição de Macronutrientes */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <span className="text-2xl">🍗</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Distribuição dos Macronutrientes</h3>
          <p className="text-gray-600">Seu plano nutricional personalizado</p>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mb-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-green-400">
              {userData.goal === 'lose' 
                ? deficitResults![selectedIntensity].targetCalories 
                : userData.goal === 'gain'
                ? surplusResults![selectedIntensity].targetCalories
                : results.targetCalories
              }
            </div>
            <div className="text-gray-600">Meta Calórica Diária</div>
          </div>
        </div>

        {/* Barra de macros colorida */}
        <div className="w-full h-8 rounded-full overflow-hidden mb-6 shadow-lg">
          <div className="flex h-full">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-sm" style={{ width: '33%' }}>
              🍗 33%
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm" style={{ width: '38%' }}>
              🌾 38%
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm" style={{ width: '29%' }}>
              🥑 29%
            </div>
          </div>
        </div>

        {/* Usar os macros do déficit selecionado se for perda de peso */}
        {(() => {
          let currentMacros;
          if (userData.goal === 'lose') {
            currentMacros = deficitResults![selectedIntensity].macros;
          } else if (userData.goal === 'gain') {
            currentMacros = surplusResults![selectedIntensity].macros;
          } else {
            currentMacros = results.macros;
          }
          
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Proteína */}
              <div className="bg-gradient-to-br from-pink-50 to-red-50 border border-pink-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🍗</span>
                  </div>
                  <h4 className="text-gray-800 font-bold">Proteína</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentual:</span>
                    <span className="text-pink-400 font-bold">33%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gramas:</span>
                    <span className="text-pink-400 font-bold">{currentMacros.protein.grams}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calorias:</span>
                    <span className="text-pink-400 font-bold">{currentMacros.protein.calories} kcal</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>

              {/* Carboidrato */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🌾</span>
                  </div>
                  <h4 className="text-gray-800 font-bold">Carboidrato</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentual:</span>
                    <span className="text-orange-400 font-bold">38%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gramas:</span>
                    <span className="text-orange-400 font-bold">{currentMacros.carbs.grams}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calorias:</span>
                    <span className="text-orange-400 font-bold">{currentMacros.carbs.calories} kcal</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              {/* Gordura */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🥑</span>
                  </div>
                  <h4 className="text-gray-800 font-bold">Gordura</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentual:</span>
                    <span className="text-green-400 font-bold">29%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gramas:</span>
                    <span className="text-green-400 font-bold">{currentMacros.fat.grams}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calorias:</span>
                    <span className="text-green-400 font-bold">{currentMacros.fat.calories} kcal</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '29%' }}></div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Dicas importantes */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">💡</span>
            <h4 className="text-gray-800 font-bold">Dicas Importantes:</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-pink-400">•</span>
              <span className="text-gray-700"><strong className="text-pink-600">Proteína:</strong> Essencial para construção e manutenção muscular</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400">•</span>
              <span className="text-gray-700"><strong className="text-green-600">Gordura:</strong> Importante para hormônios e absorção de vitaminas</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-400">•</span>
              <span className="text-gray-700"><strong className="text-orange-600">Carboidrato:</strong> Principal fonte de energia para treinos</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span className="text-gray-700"><strong className="text-blue-600">Timing:</strong> Distribua os macros ao longo do dia para melhor absorção</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cards principais - Estilo das imagens */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Seus Resultados Personalizados</h3>
          <p className="text-gray-600">Baseado em cálculos científicos precisos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TMB */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-bold flex items-center">
                    TMB
                    <InfoTooltip 
                      id="tmb" 
                      title="Taxa Metabólica Basal" 
                      description="Energia básica do seu corpo em repouso absoluto para manter funções vitais como respiração, circulação e metabolismo celular."
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">{results.tmb}</div>
            <div className="text-green-300 text-sm mb-1">kcal/dia em repouso</div>
            <div className="text-gray-500 text-xs">Energia básica do seu corpo</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* GET */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-bold flex items-center">
                    GET
                    <InfoTooltip 
                      id="get" 
                      title="Gasto Energético Total" 
                      description="Seu gasto energético total diário, incluindo TMB + atividades físicas + termogênese. É o total de calorias que você queima por dia."
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{results.get}</div>
            <div className="text-blue-300 text-sm mb-1">kcal/dia total</div>
            <div className="text-gray-500 text-xs">Seu gasto energético total</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* IMC */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-bold flex items-center">
                    IMC
                    <InfoTooltip 
                      id="imc" 
                      title="Índice de Massa Corporal" 
                      description="Relação entre peso e altura. Ferramenta útil para avaliação inicial, mas não diferencia massa muscular de gordura."
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{results.imc}</div>
            <div className="text-yellow-300 text-sm mb-1">{results.imcCategory}</div>
            <div className="text-gray-500 text-xs">Índice de massa corporal</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          {/* Água */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💧</span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-bold flex items-center">
                    Água 💧
                    <InfoTooltip 
                      id="agua" 
                      title="Hidratação Diária" 
                      description="Recomendação de 35ml por kg de peso. A água participa de todos os processos metabólicos e é essencial para queima de gordura."
                    />
                  </h4>
                </div>
              </div>
            </div>
<div className="text-3xl font-bold text-cyan-400 mb-2">
  {(results.waterIntake/1000).toFixed(1)}L a {(results.waterIntakeMax!/1000).toFixed(1)}L
  <span className="text-base font-normal text-cyan-300"> / dia</span>
</div>
<div className="text-gray-500 text-xs">Hidratação recomendada</div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Fibras */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🌾</span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-bold flex items-center">
                    Fibras 🌾
                    <InfoTooltip 
                      id="fibras" 
                      title="Fibras Diárias" 
                      description="Essenciais para digestão saudável, saciedade e controle glicêmico. Ajudam na manutenção do peso e saúde intestinal."
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-2">{results.fiberIntake}</div>
            <div className="text-orange-300 text-sm mb-1">g/dia</div>
            <div className="text-gray-500 text-xs">Fibras para digestão</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>

          {/* Gasto Semanal */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-bold flex items-center">
                    Gasto Semanal
                    <InfoTooltip 
                      id="gse" 
                      title="Gasto Semanal de Energia" 
                      description="Total de energia que você gasta em uma semana completa. Útil para planejamento nutricional de longo prazo."
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{results.gse.toLocaleString()}</div>
            <div className="text-purple-300 text-sm mb-1">kcal/semana</div>
            <div className="text-gray-500 text-xs">Energia semanal queimada</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
            <span className="text-green-600 font-semibold">• Cálculos baseados em evidências científicas •</span>
          </div>
        </div>
      </div>

      {/* Diagnóstico personalizado */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🧠 Diagnóstico Personalizado
        </h3>
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-200">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-gray-800">{userData.name}</strong>, baseado no seu perfil de {userData.age} anos, {userData.weight}kg e {userData.height}cm, 
            identificamos que você tem um gasto energético de <strong className="text-green-600">{results.get} calorias/dia</strong>. 
            
            {userData.bodyFeeling === 'Inchada e travada' && (
              <> Sua sensação de estar "inchada e travada" pode estar relacionada à retenção hídrica e baixa ingestão de fibras. 
              Recomendamos aumentar o consumo de água para <strong className="text-blue-600">{(results.waterIntake/1000).toFixed(1)}L diários</strong>.</>
            )}
            
            {userData.bodyFeeling === 'Inchado e travado' && (
              <> Sua sensação de estar "inchado e travado" pode estar relacionada à retenção hídrica e baixa ingestão de fibras. 
              Recomendamos aumentar o consumo de água para <strong className="text-blue-600">{(results.waterIntake/1000).toFixed(1)}L diários</strong>.</>
            )}
            
            {userData.bodyFeeling === 'Com retenção' && (
              <> A retenção que você sente pode ser combatida com a hidratação adequada (<strong className="text-blue-600">{(results.waterIntake/1000).toFixed(1)}L/dia</strong>) 
              e consumo de <strong className="text-orange-600">{results.fiberIntake}g de fibras diárias</strong>.</>
            )}
            
            {userData.bodyFeeling === 'Sem energia' && (
              <> Sua falta de energia pode estar ligada a um desequilíbrio nutricional. O plano de <strong className="text-green-600">{
                userData.goal === 'lose' 
                  ? deficitResults![selectedIntensity].targetCalories 
                  : userData.goal === 'gain'
                  ? surplusResults![selectedIntensity].targetCalories
                  : results.targetCalories
              } calorias</strong> 
              com <strong className="text-pink-600">{
                userData.goal === 'lose' 
                  ? deficitResults![selectedIntensity].macros.protein.grams 
                  : userData.goal === 'gain'
                  ? surplusResults![selectedIntensity].macros.protein.grams
                  : results.macros.protein.grams
              }g de proteína</strong> vai ajudar a regular seu metabolismo.</>
            )}
            
            {userData.bodyFeeling === 'Quero melhorar visual' && (
              <> Seu objetivo de melhoria visual é totalmente alcançável! Com seu IMC atual de <strong className="text-yellow-600">{results.imc}</strong>, 
              seguindo o plano nutricional calculado, você pode esperar resultados consistentes.</>
            )}
            
            <br/><br/>
            Para maximizar seus resultados, mantenha o foco na distribuição de macronutrientes calculada especialmente para você: 
            <strong className="text-pink-600"> {
              userData.goal === 'lose' 
                ? deficitResults![selectedIntensity].macros.protein.grams 
                : userData.goal === 'gain'
                ? surplusResults![selectedIntensity].macros.protein.grams
                : results.macros.protein.grams
            }g de proteína</strong>, 
            <strong className="text-orange-600"> {
              userData.goal === 'lose' 
                ? deficitResults![selectedIntensity].macros.carbs.grams 
                : userData.goal === 'gain'
                ? surplusResults![selectedIntensity].macros.carbs.grams
                : results.macros.carbs.grams
            }g de carboidratos</strong> e 
            <strong className="text-green-600"> {
              userData.goal === 'lose' 
                ? deficitResults![selectedIntensity].macros.fat.grams 
                : userData.goal === 'gain'
                ? surplusResults![selectedIntensity].macros.fat.grams
                : results.macros.fat.grams
            }g de gorduras</strong> diariamente.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
          <span className="text-3xl">🎯</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">
          Agora que você entendeu como seu corpo funciona, está a um passo de atingir seu objetivo.
        </h3>
        <p className="text-xl text-green-100 mb-8 max-w-4xl mx-auto">
          Use esse plano como base e comece hoje — sem sofrimento, sem achismo, sem fórmulas milagrosas. 
          Tudo aqui é cientificamente validado e 100% gratuito, feito para te ajudar a transformar sua saúde.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg flex items-center space-x-2"
          >
            <Download size={20} />
            <span>📄 Baixar PDF</span>
          </button>
          
          <button
            onClick={handleShareWhatsApp}
            className="bg-green-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg flex items-center space-x-2 border-2 border-white"
          >
            <Share size={20} />
            <span>📱 Compartilhar no WhatsApp</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-green-100 mb-4 text-lg">
            No próximo passo você poderá salvar todas essas informações e descobrir como acelerar ainda mais seus resultados.
          </p>
          <button
            onClick={onViewConversion}
            className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
          >
            🚀 Ver próximos passos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;