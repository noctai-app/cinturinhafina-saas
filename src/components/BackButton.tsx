import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  show: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-50 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-200"
      aria-label="Voltar ao passo anterior"
    >
      <ArrowLeft size={20} className="text-gray-600" />
    </button>
  );
};

export default BackButton;