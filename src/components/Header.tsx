import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <img 
            src="https://i.imgur.com/fh8dwQz.png" 
            alt="Cinturinha Fina" 
            className="h-10 w-auto filter brightness-110"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Cinturinha Fina™
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Calculadora Nutricional Gratuita
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;