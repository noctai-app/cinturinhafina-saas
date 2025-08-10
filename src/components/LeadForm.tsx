import React, { useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';

interface LeadFormProps {
  onSubmit: (data: { name: string; email: string; whatsapp: string }) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.whatsapp) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 backdrop-blur-sm animate-slide-up">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mb-4 animate-pulse">
          <span className="text-2xl">📥</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📥 Antes de gerar seu plano personalizado...
        </h2>
        <p className="text-gray-600">
          Precisamos de alguns dados básicos para criar seu relatório completo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="tel"
            placeholder="WhatsApp (com DDD)"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          ✨ Continuar para o formulário
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        🔒 Seus dados estão seguros e não serão compartilhados
      </p>
    </div>
  );
};

export default LeadForm;