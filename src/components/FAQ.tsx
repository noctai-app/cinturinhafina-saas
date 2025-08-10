import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "❓ Por que contar calorias ajuda a emagrecer?",
      answer: "Contar calorias funciona porque cria consciência sobre o que você consome. Quando você mantém um déficit calórico consistente (queimar mais do que consome), seu corpo usa a gordura armazenada como energia, resultando em perda de peso. É simples física: energia que entra vs energia que sai."
    },
    {
      question: "⚡ Qual a diferença entre Gasto Energético Total e Taxa Metabólica Basal?",
      answer: "Taxa Metabólica Basal é a energia que seu corpo gasta em repouso absoluto para manter funções vitais. Gasto Energético Total é a Taxa Metabólica Basal multiplicada pelo seu nível de atividade física, representando o total de calorias que você queima por dia incluindo exercícios e atividades cotidianas."
    },
    {
      question: "📊 Índice de Massa Corporal é confiável?",
      answer: "O Índice de Massa Corporal é uma ferramenta útil para avaliação inicial, mas tem limitações. Não diferencia massa muscular de gordura, então atletas podem ter Índice de Massa Corporal alto mesmo sendo saudáveis. Para uma avaliação mais precisa, combine Índice de Massa Corporal com medições de gordura corporal e circunferências."
    },
    {
      question: "🍗 O que são macronutrientes e por que dividir assim?",
      answer: "Macronutrientes são proteínas, carboidratos e gorduras - os componentes que fornecem energia. Cada um tem funções específicas: proteína constrói músculos, carboidratos dão energia, gorduras regulam hormônios. A divisão varia conforme seu objetivo: mais proteína para manter músculo em dietas, mais carboidratos para ganho de massa."
    },
    {
      question: "💧 Por que a hidratação é tão importante?",
      answer: "A água representa 60% do seu corpo e participa de todos os processos metabólicos. Desidratação reduz performance, dificulta a queima de gordura e pode ser confundida com fome. A recomendação de 35ml a 50ml por kg garante funcionamento otimizado do organismo."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
          <span className="text-2xl">🧠</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Perguntas Frequentes
        </h2>
        <p className="text-xl text-gray-600">
          Tire suas dúvidas sobre nutrição e fitness
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-all duration-300 flex items-center justify-between group"
            >
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-orange-600 transition-colors duration-300">
                {faq.question}
              </h3>
              <div className="flex-shrink-0 ml-4">
                {openIndex === index ? (
                  <ChevronUp className="text-orange-500 transition-transform duration-300" size={24} />
                ) : (
                  <ChevronDown className="text-orange-500 transition-transform duration-300" size={24} />
                )}
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-8 pb-6">
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;