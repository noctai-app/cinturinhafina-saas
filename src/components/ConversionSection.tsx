import React from 'react';
import { Star, Calendar } from 'lucide-react';

interface ConversionSectionProps {
  userData: { gender: 'female' | 'male'; name: string };
}

const ConversionSection: React.FC<ConversionSectionProps> = ({ userData }) => {
  const genderText = userData.gender === 'female' ? 'mulheres' : 'homens';

  // Depoimentos específicos por gênero
  const testimonials = userData.gender === 'female' ? [
    {
      name: 'Mariana, 32 anos',
      text: 'Minha barriga sumiu! Não acreditava que era só questão de seguir o método certo. Perdi 4kg em 2 semanas!'
    },
    {
      name: 'Ana Paula, 28 anos', 
      text: 'Achei que era retenção. Era só falta de método. Em 10 dias já vi diferença no espelho e na balança!'
    },
    {
      name: 'Fernanda, 26 anos',
      text: 'Secar a barriga sem passar fome? Existe, sim! O método é incrível. Já perdi 3kg e me sinto muito melhor!'
    }
  ] : [
    {
      name: 'Carlos, 35 anos',
      text: 'Perdi 5kg em 3 semanas! O método realmente funciona para homens também. Finalmente consegui definir o abdômen!'
    },
    {
      name: 'Roberto, 42 anos',
      text: 'Finalmente um método que funciona! Perdi gordura sem perder massa muscular. Recomendo para todos os homens!'
    },
    {
      name: 'João, 38 anos',
      text: 'Consegui definir o abdômen que sempre quis. Método top! Em 1 mês já estava com o corpo que queria!'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* CTA Principal */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">
          🧠 Agora que você entende como seu corpo funciona...
        </h2>
        <p className="text-xl mb-6 text-orange-100">
          O método <strong>Cinturinha Fina</strong> resolve suas principais travas:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-2xl">🔥</span>
            <p className="font-semibold">Baixa autoestima</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-2xl">💧</span>
            <p className="font-semibold">Insatisfação com o corpo</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <span className="text-2xl">🍽️</span>
            <p className="font-semibold">Falta de confiança</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="text-white" size={24} />
            <span className="text-xl font-bold">LANÇAMENTO OFICIAL</span>
          </div>
          <p className="text-2xl font-bold mb-2">11 de Agosto - Manhã</p>
          <p className="text-orange-100">
            O Método Cinturinha Fina será liberado oficialmente no dia 11 de Agosto pela manhã. 
            Prepare-se para transformar seu corpo de forma definitiva!
          </p>
        </div>
      </div>

      {/* Comparação Social */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          💬 O que {genderText} com perfil semelhante ao seu conseguiram
        </h3>
        
        <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-xl p-6 mb-6 border border-orange-500/30">
          <p className="text-lg text-center text-gray-800">
            "<strong>{genderText.charAt(0).toUpperCase() + genderText.slice(1)} com perfil semelhante ao seu já perderam 2 a 4kg em 14 dias</strong> com o método que será liberado."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-200">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" fill="currentColor" size={16} />
                ))}
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{testimonial.name}</h4>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Última tentativa de conversão */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl p-8 text-white text-center shadow-2xl">
        <h3 className="text-2xl font-bold mb-4">
          ⏰ Você já tem o diagnóstico. Que tal a solução completa?
        </h3>
        <p className="text-xl mb-4 text-pink-100">
          251 pessoas já estão transformando o corpo com o método Cinturinha Fina
        </p>
        <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
          <p className="text-lg font-semibold mb-2">🗓️ Liberação: 11 de Agosto (Manhã)</p>
          <p className="text-pink-100">
            Seja uma das primeiras pessoas a ter acesso ao método completo quando for lançado!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversionSection;