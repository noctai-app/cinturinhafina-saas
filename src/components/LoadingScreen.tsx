import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "🧮 Calculando sua Taxa Metabólica Basal...",
    "⚡ Analisando seu Gasto Energético Total...",
    "🎯 Definindo suas metas calóricas...",
    "🍗 Distribuindo seus macronutrientes...",
    "💧 Calculando hidratação ideal...",
    "📊 Gerando seu relatório personalizado...",
    "✨ Finalizando seu plano nutricional..."
  ];

  useEffect(() => {
    const duration = 7000; // 7 segundos
    const interval = 50; // atualiza a cada 50ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        
        // Muda a mensagem baseada no progresso
        const messageIndex = Math.floor((newProgress / 100) * messages.length);
        if (messageIndex < messages.length) {
          setCurrentMessage(messageIndex);
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl mb-6 animate-pulse">
            <img 
              src="https://i.imgur.com/QGbOqA0.png" 
              alt="Cinturinha Fina" 
              className="h-12 w-auto filter brightness-0 invert"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Gerando seu plano personalizado...
          </h2>
          <p className="text-gray-600 mb-8">
            Estamos analisando todos os seus dados para criar o plano nutricional perfeito para você
          </p>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {Math.round(progress)}% concluído
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-700 font-medium animate-pulse">
            {messages[currentMessage]}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 text-xl">🧮</span>
            </div>
            <span className="text-xs text-gray-500">Cálculos</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <span className="text-xs text-gray-500">Análise</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 text-xl">✨</span>
            </div>
            <span className="text-xs text-gray-500">Personalização</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;