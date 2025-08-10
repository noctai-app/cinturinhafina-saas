import React, { useState } from 'react';
import BackButton from './components/BackButton';
import LeadForm from './components/LeadForm';
import CalculatorForm from './components/CalculatorForm';
import Results from './components/Results';
import ConversionSection from './components/ConversionSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import StepIndicator from './components/StepIndicator';
import LoadingScreen from './components/LoadingScreen';
import { UserData, NutritionalResults } from './types/calculator';
import { calculateNutritionalData } from './utils/calculations';
import { 
  saveUserFirstStep, 
  completeUserSecondStep, 
  updateUserActionByEmail, 
  updateUserIntensity,
  getUserByEmail,
  UserSubmission 
} from './lib/supabase';
import { getActivityLevelText } from './utils/calculations';
import AdminPanel from './components/AdminPanel';

type AppStep = 'lead' | 'form' | 'loading' | 'results' | 'conversion' | 'admin';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('lead');
  const [leadData, setLeadData] = useState<{ name: string; email: string; whatsapp: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<NutritionalResults | null>(null);
  const [viewedNextSteps, setViewedNextSteps] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar se deve mostrar admin (URL contém /admin)
  const showAdmin = window.location.pathname.includes('/admin') || window.location.search.includes('admin=true');

  if (showAdmin) {
    return <AdminPanel />;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🆕 NOVA FUNÇÃO: Lidar com submit da primeira etapa
  const handleLeadSubmit = async (data: { name: string; email: string; whatsapp: string }) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('🔄 Salvando primeira etapa:', data);
      
      // Salvar primeira etapa no Supabase
      const result = await saveUserFirstStep({
        nome: data.name,
        email: data.email,
        whatsapp: data.whatsapp
      });

      if (result.success && result.data) {
        console.log('✅ Primeira etapa salva com sucesso:', result.data);
        
        // Salvar dados para próxima etapa
        setLeadData(data);
        setCurrentUserEmail(data.email);
        setCurrentUserId(result.data.id);
        
        // Salvar email no localStorage como backup
        localStorage.setItem('user_email', data.email);
        
        // Ir para próxima etapa
        setCurrentStep('form');
        setTimeout(scrollToTop, 100);
      } else {
        console.error('❌ Erro ao salvar primeira etapa:', result.error);
        alert('Erro ao salvar dados iniciais. Tente novamente.');
      }
    } catch (error) {
      console.error('❌ Erro inesperado na primeira etapa:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🆕 NOVA FUNÇÃO: Lidar com submit da segunda etapa
  const handleFormSubmit = async (data: UserData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setUserData(data);
    setCurrentStep('loading');
    
    try {
      const userEmail = currentUserEmail || localStorage.getItem('user_email');
      
      if (!userEmail) {
        throw new Error('Email do usuário não encontrado. Volte à primeira etapa.');
      }

      console.log('🔄 Completando segunda etapa para:', userEmail);
      
      // Preparar dados da segunda etapa
      const secondStepData = {
        sexo: data.gender,
        objetivo: data.goal,
        idade: data.age,
        peso: data.weight,
        altura: data.height,
        nivel_atividade: data.activityLevel,
        nivel_atividade_texto: getActivityLevelText(data.activityLevel),
        gordura_corporal: data.bodyFat || null,
        sentimento_corpo: data.bodyFeeling,
        intensidade_selecionada: data.deficitLevel || null
      };

      console.log('📝 Dados da segunda etapa:', secondStepData);
      
      // Completar segunda etapa no Supabase
      const result = await completeUserSecondStep(userEmail, secondStepData);
      
      if (result.success && result.data) {
        console.log('✅ Segunda etapa completada com sucesso:', result.data);
        
        // Atualizar IDs se necessário
        setCurrentUserId(result.data.id);
        setCurrentUserEmail(result.data.email);
        
        // Adicionar userId aos dados do usuário
        setUserData({ ...data, userId: result.data.id });
      } else {
        console.error('❌ Erro ao completar segunda etapa:', result.error);
        // Continuar mesmo com erro - não bloquear o fluxo do usuário
        alert('Aviso: Alguns dados não foram salvos, mas você pode continuar usando a calculadora.');
      }
    } catch (error) {
      console.error('❌ Erro inesperado na segunda etapa:', error);
      // Continuar mesmo com erro
      alert('Aviso: Alguns dados não foram salvos, mas você pode continuar usando a calculadora.');
    } finally {
      setIsSubmitting(false);
    }
    
    setTimeout(scrollToTop, 100);
  };

  const handleLoadingComplete = () => {
    if (userData) {
      const calculatedResults = calculateNutritionalData(userData);
      setResults(calculatedResults);
      setCurrentStep('results');
      setTimeout(scrollToTop, 100);
    }
  };

  // 🔄 FUNÇÃO ATUALIZADA: Usar email em vez de ID
  const handleViewConversion = async () => {
    setViewedNextSteps(true);
    
    // Atualizar no Supabase que clicou em "próximos passos"
    const userEmail = currentUserEmail || localStorage.getItem('user_email');
    
    if (userEmail) {
      try {
        const result = await updateUserActionByEmail(userEmail, 'clicou_proximos_passos', true);
        if (result.success) {
          console.log('✅ Próximos passos registrado para:', userEmail);
        }
      } catch (error) {
        console.error('❌ Erro ao registrar próximos passos:', error);
      }
    }
    
    setCurrentStep('conversion');
    setTimeout(scrollToTop, 100);
  };

  // 🔄 FUNÇÃO ATUALIZADA: Usar email em vez de ID
  const handlePDFDownload = async () => {
    // Atualizar no Supabase que baixou o PDF
    const userEmail = currentUserEmail || localStorage.getItem('user_email');
    
    if (userEmail) {
      try {
        const result = await updateUserActionByEmail(userEmail, 'baixou_pdf', true);
        if (result.success) {
          console.log('✅ Download PDF registrado para:', userEmail);
        }
      } catch (error) {
        console.error('❌ Erro ao registrar download PDF:', error);
      }
    }
  };

  const handleIntensityChange = async (intensity: 'light' | 'moderate' | 'aggressive') => {
    // Atualizar intensidade no Supabase
    if (currentUserId) {
      try {
        const result = await updateUserIntensity(currentUserId, intensity);
        if (result.success) {
          console.log('✅ Intensidade atualizada para usuário:', currentUserId, 'intensidade:', intensity);
        }
      } catch (error) {
        console.error('❌ Erro ao atualizar intensidade:', error);
      }
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'form':
        setCurrentStep('lead');
        break;
      case 'results':
        setCurrentStep('form');
        break;
      case 'conversion':
        setCurrentStep('results');
        break;
      default:
        break;
    }
    setTimeout(scrollToTop, 100);
  };

  const getStepNumber = (): number => {
    switch (currentStep) {
      case 'lead': return 0;
      case 'form': return 1;
      case 'loading': return 2;
      case 'results': return 3;
      case 'conversion': return 4;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <BackButton 
        onClick={handleBack} 
        show={currentStep !== 'lead' && currentStep !== 'loading'} 
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep !== 'conversion' && currentStep !== 'loading' && (
          <StepIndicator currentStep={getStepNumber()} totalSteps={5} />
        )}

        {currentStep === 'lead' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl mb-6">
                <img 
                  src="https://i.imgur.com/QGbOqA0.png" 
                  alt="Cinturinha Fina" 
                  className="h-20 w-auto filter brightness-0 invert"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Calculadora <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Cinturinha Fina™</span>
              </h1>
              <p className="text-xl text-slate-999 leading-relaxed">
                Descubra exatamente o que o seu corpo precisa para <strong className="text-orange-600">secar barriga</strong>, <strong className="text-pink-600">acelerar o metabolismo</strong> e <strong className="text-orange-600">transformar sua autoestima</strong>.
                
                Gere agora seu <strong className="text-gray-800">plano nutricional gratuito</strong>, com resultados instantâneos e orientações 100% personalizadas.
              </p>
              <div className="flex items-center justify-center space-x-6 mt-8">
                  </div>
              <button 
                onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-6 px-10 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg mb-8"
              >
                🎯 Quero meu plano gratuito
              </button>
              
              <div className="flex items-center justify-center space-x-6 mt-8">
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-500 font-medium">100% Gratuito</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-500 font-medium">Resultados Instantâneos</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></span>
                  <span className="text-sm text-gray-500 font-medium">Cientificamente Comprovado</span>
                </span>
              </div>
              
              <div className="mt-8 flex justify-center">
                <div className="animate-bounce">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
            <div id="lead-form">
              <LeadForm 
                onSubmit={handleLeadSubmit} 
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {currentStep === 'form' && leadData && (
          <CalculatorForm 
            leadData={leadData} 
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'loading' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}

        {currentStep === 'results' && userData && results && (
          <div className="space-y-12">
            <Results 
              userData={userData} 
              results={results} 
              onViewConversion={handleViewConversion}
              onPDFDownload={handlePDFDownload}
              onIntensityChange={handleIntensityChange}
            />
          </div>
        )}

        {currentStep === 'conversion' && (
          <div className="space-y-16">
            <ConversionSection userData={{ gender: userData.gender, name: userData.name }} />
            <FAQ />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App; 