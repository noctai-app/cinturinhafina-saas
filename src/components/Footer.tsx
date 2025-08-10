import React from 'react';
import { Heart, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <Heart className="text-red-400" fill="currentColor" size={24} /> 
              <h3 className="text-xl font-bold text-white-500">Cinturinha Fina™</h3>
            </div>
            <p className="text-white-400 leading-relaxed">
              Transformando vidas através da nutrição inteligente e métodos cientificamente comprovados.
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h4 className="font-semibold text-white mb-4"></h4>
            <div className="space-y-2">

       
            </div>
          </div>

          {/* Redes sociais e contato */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-white mb-4">Instagram da Brenda Rios</h4>
            <div className="flex justify-center md:justify-end space-x-4 mb-4">
              <a href="https://www.instagram.com/brendavrios" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 to-orange-500 p-3 rounded-full hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110">
                <Instagram size={20} />
              </a>
 
            </div>

          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white-400 text-sm">
              © 2025 Cinturinha Fina™. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="https://www.youtube.com/@Avelinocpn/videos" target="_blank" rel="noopener noreferrer" className="text-white-400 hover:text-orange-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="https://www.youtube.com/@Avelinocpn/videos" target="_blank" rel="noopener noreferrer" className="text-white-400 hover:text-orange-400 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;