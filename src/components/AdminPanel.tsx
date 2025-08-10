import React, { useState, useEffect } from 'react';
import { getAllUsers, testConnection, UserSubmission } from '../lib/supabase';
import { 
  Users, Download, Eye, Calendar, Activity, RefreshCw, 
  AlertCircle, CheckCircle, Database, TrendingUp, Filter,
  ExternalLink, Phone, Mail, LogOut, Shield, BarChart3,
  UserCheck, Clock, Target, Zap, Heart, Lock, FileDown,
  PieChart, BarChart, User, UserX, Search, X, Settings,
  FileText, Copy, Share2, Smartphone, Calendar as CalendarIcon,
  TrendingDown, Star, Award, MapPin, Globe
} from 'lucide-react';

// Interface extendida para incluir numeração
interface UserWithNumber extends UserSubmission {
  numero?: number;
}

interface FilterState {
  objetivo: 'all' | 'lose' | 'maintain' | 'gain';
  sexo: 'all' | 'male' | 'female';
  idadeMin: number;
  idadeMax: number;
  baixouPdf: 'all' | 'sim' | 'nao';
  clicouProximos: 'all' | 'sim' | 'nao';
  periodo: 'all' | 'hoje' | '7dias' | '30dias';
}

const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Credenciais fixas
    const ADMIN_EMAIL = 'nojdigital@gmail.com';
    const ADMIN_PASSWORD = '2025@CinturinhaF1n4!@$';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Salvar no localStorage para manter login
      localStorage.setItem('cinturinha_admin_logged', 'true');
      onLogin();
    } else {
      setError('Email ou senha incorretos');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Painel <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Administrativo</span>
          </h1>
          <p className="text-gray-600">Calculadora Cinturinha Fina™</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none"
                  placeholder="Sua senha segura"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Acessar Painel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Acesso restrito apenas para administradores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState<UserWithNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'analytics' | 'exports'>('dashboard');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filtros avançados
  const [filters, setFilters] = useState<FilterState>({
    objetivo: 'all',
    sexo: 'all',
    idadeMin: 18,
    idadeMax: 80,
    baixouPdf: 'all',
    clicouProximos: 'all',
    periodo: 'all'
  });

  useEffect(() => {
    // Verificar se já está logado
    const isLogged = localStorage.getItem('cinturinha_admin_logged') === 'true';
    setIsLoggedIn(isLogged);
    
    if (isLogged) {
      loadUsers();
      testSupabaseConnection();
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    loadUsers();
    testSupabaseConnection();
  };

  const handleLogout = () => {
    localStorage.removeItem('cinturinha_admin_logged');
    setIsLoggedIn(false);
  };

  const testSupabaseConnection = async () => {
    setConnectionStatus('testing');
    const result = await testConnection();
    
    if (result.success) {
      setConnectionStatus('success');
      console.log('✅ Conexão com Supabase OK');
    } else {
      setConnectionStatus('error');
      console.error('❌ Erro na conexão:', result.error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllUsers();
      
      if (result.success && result.data) {
        setUsers(result.data as UserWithNumber[]);
        setLastUpdated(new Date());
        console.log('✅ Usuários carregados:', result.data.length);
      } else {
        setError(result.error || 'Erro ao carregar usuários');
        console.error('❌ Erro ao carregar usuários:', result.error);
      }
    } catch (err) {
      setError('Erro inesperado ao carregar usuários');
      console.error('❌ Erro inesperado:', err);
    }
    
    setLoading(false);
  };

  // Função para filtrar usuários
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Filtro por busca
      const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.whatsapp.includes(searchTerm);

      // Filtro por objetivo
      const matchesObjective = filters.objetivo === 'all' || user.objetivo === filters.objetivo;

      // Filtro por sexo
      const matchesGender = filters.sexo === 'all' || user.sexo === filters.sexo;

      // Filtro por idade
      const matchesAge = user.idade >= filters.idadeMin && user.idade <= filters.idadeMax;

      // Filtro por PDF
      const matchesPdf = filters.baixouPdf === 'all' || 
                        (filters.baixouPdf === 'sim' && user.baixou_pdf) ||
                        (filters.baixouPdf === 'nao' && !user.baixou_pdf);

      // Filtro por próximos passos
      const matchesNextSteps = filters.clicouProximos === 'all' || 
                              (filters.clicouProximos === 'sim' && user.clicou_proximos_passos) ||
                              (filters.clicouProximos === 'nao' && !user.clicou_proximos_passos);

      // Filtro por período
      let matchesPeriod = true;
      if (filters.periodo !== 'all' && user.created_at) {
        const userDate = new Date(user.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - userDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filters.periodo === 'hoje') {
          matchesPeriod = diffDays <= 1;
        } else if (filters.periodo === '7dias') {
          matchesPeriod = diffDays <= 7;
        } else if (filters.periodo === '30dias') {
          matchesPeriod = diffDays <= 30;
        }
      }

      return matchesSearch && matchesObjective && matchesGender && 
             matchesAge && matchesPdf && matchesNextSteps && matchesPeriod;
    });
  };

  const filteredUsers = getFilteredUsers();

  // Estatísticas detalhadas
  const detailedStats = {
    total: users.length,
    filtered: filteredUsers.length,
    
    // Por gênero
    masculino: users.filter(u => u.sexo === 'male').length,
    feminino: users.filter(u => u.sexo === 'female').length,
    masculinoPerc: users.length > 0 ? ((users.filter(u => u.sexo === 'male').length / users.length) * 100).toFixed(1) : '0',
    femininoPerc: users.length > 0 ? ((users.filter(u => u.sexo === 'female').length / users.length) * 100).toFixed(1) : '0',
    
    // Por objetivo
    lose: users.filter(u => u.objetivo === 'lose').length,
    maintain: users.filter(u => u.objetivo === 'maintain').length,
    gain: users.filter(u => u.objetivo === 'gain').length,
    
    // Ações
    pdfDownloads: users.filter(u => u.baixou_pdf).length,
    nextStepsClicks: users.filter(u => u.clicou_proximos_passos).length,
    
    // Conversão
    conversionRate: users.length > 0 ? 
      ((users.filter(u => u.baixou_pdf || u.clicou_proximos_passos).length / users.length) * 100).toFixed(1) 
      : '0',
    
    // Idades
    idadeMedia: users.length > 0 ? 
      (users.reduce((sum, user) => sum + user.idade, 0) / users.length).toFixed(1) : '0',
    
    // Por faixa etária
    jovens: users.filter(u => u.idade >= 18 && u.idade <= 25).length, // 18-25
    adultos: users.filter(u => u.idade >= 26 && u.idade <= 40).length, // 26-40
    maturos: users.filter(u => u.idade >= 41 && u.idade <= 60).length, // 41-60
    seniors: users.filter(u => u.idade > 60).length, // 60+
  };

  // Função para exportar leads
  const exportLeads = (format: 'csv' | 'json') => {
    const dataToExport = filteredUsers.map(user => ({
      Nome: user.nome,
      Email: user.email,
      WhatsApp: user.whatsapp,
      Sexo: user.sexo === 'female' ? 'Feminino' : 'Masculino',
      Idade: user.idade,
      Peso: user.peso,
      Altura: user.altura,
      Objetivo: getObjectiveText(user.objetivo),
      'Nível de Atividade': user.nivel_atividade_texto,
      'Gordura Corporal': user.gordura_corporal || 'Não informado',
      'Baixou PDF': user.baixou_pdf ? 'Sim' : 'Não',
      'Clicou Próximos Passos': user.clicou_proximos_passos ? 'Sim' : 'Não',
      'Data de Cadastro': user.created_at ? formatDate(user.created_at) : 'Não informado'
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0] || {}).join(','),
        ...dataToExport.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `leads_cinturinha_fina_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `leads_cinturinha_fina_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  };

  // Função para copiar leads
  const copyLeadsToClipboard = () => {
    const leadsText = filteredUsers.map(user => 
      `${user.nome} - ${user.email} - ${user.whatsapp}`
    ).join('\n');
    
    navigator.clipboard.writeText(leadsText).then(() => {
      alert('Lista de leads copiada para a área de transferência!');
    });
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const getObjectiveText = (objetivo: string) => {
    switch (objetivo) {
      case 'lose': return 'Perder Peso';
      case 'maintain': return 'Manter Peso';
      case 'gain': return 'Ganhar Massa';
      default: return objetivo;
    }
  };

  const getGenderText = (sexo: string) => {
    return sexo === 'female' ? 'Feminino' : 'Masculino';
  };

  const getIntensityText = (intensity?: string) => {
    switch (intensity) {
      case 'light': return 'Leve';
      case 'moderate': return 'Moderado';
      case 'aggressive': return 'Agressivo';
      default: return 'Não selecionado';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWhatsApp = (whatsapp: string) => {
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return whatsapp;
  };

  const openWhatsApp = (whatsapp: string) => {
    const cleaned = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleaned}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Carregando Dashboard</h2>
          <p className="text-gray-600">Buscando dados dos usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center backdrop-blur-sm bg-opacity-95">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-3xl mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao Carregar Dados</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={loadUsers}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
            <button 
              onClick={testSupabaseConnection}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-semibold"
            >
              <Database className="w-4 h-4" />
              Testar Conexão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Premium */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Dashboard <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Premium</span>
                </h1>
                <p className="text-gray-600 font-medium">
                  Calculadora Cinturinha Fina™
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
              {/* Status da conexão */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-2xl">
                {connectionStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
                {connectionStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {connectionStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                <span className="text-sm font-medium text-gray-700">
                  {connectionStatus === 'testing' && 'Conectando...'}
                  {connectionStatus === 'success' && 'Online'}
                  {connectionStatus === 'error' && 'Offline'}
                </span>
              </div>

              {/* Navigation */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                {[
                  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { key: 'users', label: 'Usuários', icon: Users },
                  { key: 'analytics', label: 'Analytics', icon: PieChart },
                  { key: 'exports', label: 'Exportar', icon: FileDown }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCurrentView(tab.key as any)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                      currentView === tab.key
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <button
                onClick={loadUsers}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:block">Atualizar</span>
              </button>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sair</span>
              </button>
            </div>
          </div>

          {lastUpdated && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-2xl w-fit">
              <Clock className="w-4 h-4" />
              Última atualização: {formatDate(lastUpdated.toISOString())}
            </div>
          )}
        </div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            {/* Stats Cards Premium */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
              {[
                { value: detailedStats.total, label: 'Total Usuários', icon: Users, color: 'from-blue-500 to-blue-600' },
                { value: detailedStats.masculino, label: 'Masculino', subtext: `${detailedStats.masculinoPerc}%`, icon: User, color: 'from-indigo-500 to-indigo-600' },
                { value: detailedStats.feminino, label: 'Feminino', subtext: `${detailedStats.femininoPerc}%`, icon: Heart, color: 'from-pink-500 to-pink-600' },
                { value: detailedStats.lose, label: 'Perder Peso', icon: TrendingDown, color: 'from-red-500 to-red-600' },
                { value: detailedStats.maintain, label: 'Manter Peso', icon: Target, color: 'from-green-500 to-green-600' },
                { value: detailedStats.gain, label: 'Ganhar Massa', icon: Activity, color: 'from-purple-500 to-purple-600' },
                { value: detailedStats.pdfDownloads, label: 'PDFs Baixados', icon: Download, color: 'from-orange-500 to-orange-600' },
                { value: `${detailedStats.conversionRate}%`, label: 'Taxa Conversão', icon: Zap, color: 'from-yellow-500 to-yellow-600' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-4 text-center backdrop-blur-sm bg-opacity-95 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl mb-3 shadow-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  {stat.subtext && (
                    <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Age Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl">
                    <BarChart className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Distribuição por Idade</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { range: '18-25 anos', count: detailedStats.jovens, color: 'from-green-400 to-green-500', label: 'Jovens' },
                    { range: '26-40 anos', count: detailedStats.adultos, color: 'from-blue-400 to-blue-500', label: 'Adultos' },
                    { range: '41-60 anos', count: detailedStats.maturos, color: 'from-orange-400 to-orange-500', label: 'Maduros' },
                    { range: '60+ anos', count: detailedStats.seniors, color: 'from-purple-400 to-purple-500', label: 'Seniors' }
                  ].map((ageGroup, index) => {
                    const percentage = detailedStats.total > 0 ? ((ageGroup.count / detailedStats.total) * 100).toFixed(1) : '0';
                    return (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">{ageGroup.range}</span>
                          <span className="text-sm text-gray-600">{ageGroup.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${ageGroup.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <div className="text-sm text-gray-600">
                    <strong>Idade Média:</strong> {detailedStats.idadeMedia} anos
                  </div>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl">
                    <PieChart className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Distribuição por Gênero</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Masculino */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-700">Masculino</span>
                      </div>
                      <span className="text-sm text-gray-600">{detailedStats.masculino} ({detailedStats.masculinoPerc}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${detailedStats.masculinoPerc}%` }}
                      />
                    </div>
                  </div>

                  {/* Feminino */}
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span className="text-sm font-semibold text-gray-700">Feminino</span>
                      </div>
                      <span className="text-sm text-gray-600">{detailedStats.feminino} ({detailedStats.femininoPerc}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${detailedStats.femininoPerc}%` }}
                      />
                    </div>
                  </div>
                  
                </div>

                

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{detailedStats.masculino}</div>
                    <div className="text-sm text-blue-700">Homens</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-pink-600">{detailedStats.feminino}</div>
                    <div className="text-sm text-pink-700">Mulheres</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      


        {/* Users View */}
        {currentView === 'users' && (
          <>
            {/* Search and Advanced Filters */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl">
                    <Search className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Busca e Filtros Avançados</h3>
                </div>
                
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-2xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg"
                >
                  <Settings className="w-4 h-4" />
                  {showAdvancedFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:bg-white transition-all duration-300 outline-none"
                  placeholder="Buscar por nome, email ou WhatsApp..."
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  {/* Filtro por Gênero */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gênero</label>
                    <select
                      value={filters.sexo}
                      onChange={(e) => setFilters({...filters, sexo: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                    </select>
                  </div>

                  {/* Filtro por Objetivo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Objetivo</label>
                    <select
                      value={filters.objetivo}
                      onChange={(e) => setFilters({...filters, objetivo: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="lose">Perder Peso</option>
                      <option value="maintain">Manter Peso</option>
                      <option value="gain">Ganhar Massa</option>
                    </select>
                  </div>

                  {/* Filtro por Idade Mínima */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Idade Mínima</label>
                    <input
                      type="number"
                      value={filters.idadeMin}
                      onChange={(e) => setFilters({...filters, idadeMin: parseInt(e.target.value) || 18})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                      min="18"
                      max="100"
                    />
                  </div>

                  {/* Filtro por Idade Máxima */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Idade Máxima</label>
                    <input
                      type="number"
                      value={filters.idadeMax}
                      onChange={(e) => setFilters({...filters, idadeMax: parseInt(e.target.value) || 80})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                      min="18"
                      max="100"
                    />
                  </div>

                  {/* Filtro por PDF */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Baixou PDF</label>
                    <select
                      value={filters.baixouPdf}
                      onChange={(e) => setFilters({...filters, baixouPdf: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  {/* Filtro por Próximos Passos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Próximos Passos</label>
                    <select
                      value={filters.clicouProximos}
                      onChange={(e) => setFilters({...filters, clicouProximos: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  {/* Filtro por Período */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
                    <select
                      value={filters.periodo}
                      onChange={(e) => setFilters({...filters, periodo: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-400 transition-all duration-300 outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="hoje">Hoje</option>
                      <option value="7dias">Últimos 7 dias</option>
                      <option value="30dias">Últimos 30 dias</option>
                    </select>
                  </div>

                  {/* Reset Filters Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => setFilters({
                        objetivo: 'all',
                        sexo: 'all',
                        idadeMin: 18,
                        idadeMax: 80,
                        baixouPdf: 'all',
                        clicouProximos: 'all',
                        periodo: 'all'
                      })}
                      className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="text-sm text-blue-700">
                  Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuários
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Filter className="w-4 h-4" />
                  {Object.values(filters).filter(f => f !== 'all' && f !== 18 && f !== 80).length} filtros ativos
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <UserCheck size={24} />
                    Usuários Cadastrados ({filteredUsers.length})
                  </h3>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-2xl">
                    <span className="font-bold">Total: {users.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      {[
                        '#', 'Nome', 'Contato', 'Perfil', 'Objetivo', 
                        'Físico', 'Atividade', 'Intensidade', 'Ações', 'Data'
                      ].map((header, index) => (
                        <th key={index} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-300">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-sm font-bold text-white">
                                {user.numero || user.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-bold text-gray-900">{user.nome}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {getGenderText(user.sexo)}, {user.idade} anos
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-900 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <button 
                                onClick={() => openWhatsApp(user.whatsapp)}
                                className="hover:text-green-600 transition-colors font-medium flex items-center gap-1"
                                title="Abrir WhatsApp"
                              >
                                {formatWhatsApp(user.whatsapp)}
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-gray-900">{user.peso} kg</div>
                            <div className="text-sm text-gray-600">{user.altura} cm</div>
                            {user.gordura_corporal && (
                              <div className="text-sm text-orange-600 font-medium">{user.gordura_corporal}% gord.</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-2xl shadow-lg ${
                            user.objetivo === 'lose' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
                            user.objetivo === 'maintain' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' :
                            'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800'
                          }`}>
                            {getObjectiveText(user.objetivo)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="max-w-32 truncate font-medium" title={user.nivel_atividade_texto}>
                            {user.nivel_atividade_texto}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-2xl shadow-lg ${
                            user.intensidade_selecionada === 'light' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' :
                            user.intensidade_selecionada === 'moderate' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                            user.intensidade_selecionada === 'aggressive' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
                            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                          }`}>
                            {getIntensityText(user.intensidade_selecionada)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            {user.baixou_pdf && (
                              <span className="inline-flex items-center px-3 py-1 rounded-2xl text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-bold shadow-lg">
                                <Download size={12} className="mr-1" />
                                PDF
                              </span>
                            )}
                            {user.clicou_proximos_passos && (
                              <span className="inline-flex items-center px-3 py-1 rounded-2xl text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-bold shadow-lg">
                                <Eye size={12} className="mr-1" />
                                Próximos
                              </span>
                            )}
                            {!user.baixou_pdf && !user.clicou_proximos_passos && (
                              <span className="text-xs text-gray-400 italic">Sem ações</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-2xl">
                            <Calendar className="w-4 h-4" />
                            <div className="font-medium">
                              {user.created_at && formatDate(user.created_at)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl mb-6 shadow-2xl">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou termo de busca para encontrar usuários.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Funil de Conversão</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Visitantes que preencheram o formulário',
                      count: detailedStats.total,
                      percentage: '100%',
                      color: 'from-blue-400 to-blue-500'
                    },
                    {
                      label: 'Baixaram o PDF',
                      count: detailedStats.pdfDownloads,
                      percentage: detailedStats.total > 0 ? ((detailedStats.pdfDownloads / detailedStats.total) * 100).toFixed(1) + '%' : '0%',
                      color: 'from-orange-400 to-orange-500'
                    },
                    {
                      label: 'Clicaram em Próximos Passos',
                      count: detailedStats.nextStepsClicks,
                      percentage: detailedStats.total > 0 ? ((detailedStats.nextStepsClicks / detailedStats.total) * 100).toFixed(1) + '%' : '0%',
                      color: 'from-green-400 to-green-500'
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">{step.label}</span>
                        <span className="text-sm text-gray-600">{step.count} ({step.percentage})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${step.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: step.percentage }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives Analysis */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <Target className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Análise de Objetivos</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { 
                      objective: 'Perder Peso',
                      count: detailedStats.lose,
                      color: 'from-red-400 to-red-500',
                      icon: TrendingDown
                    },
                    {
                      objective: 'Manter Peso',
                      count: detailedStats.maintain,
                      color: 'from-green-400 to-green-500',
                      icon: Target
                    },
                    {
                      objective: 'Ganhar Massa',
                      count: detailedStats.gain,
                      color: 'from-purple-400 to-purple-500',
                      icon: Activity
                    }
                  ].map((obj, index) => {
                    const percentage = detailedStats.total > 0 ? ((obj.count / detailedStats.total) * 100).toFixed(1) : '0';
                    return (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <obj.icon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">{obj.objective}</span>
                          </div>
                          <span className="text-sm text-gray-600">{obj.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${obj.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
                  <Award className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Métricas de Performance</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    metric: 'Taxa de Conversão Geral',
                    value: `${detailedStats.conversionRate}%`,
                    description: 'Usuários que fizeram alguma ação',
                    color: 'from-green-500 to-emerald-500',
                    icon: Zap
                  },
                  {
                    metric: 'Taxa de Download PDF',
                    value: detailedStats.total > 0 ? `${((detailedStats.pdfDownloads / detailedStats.total) * 100).toFixed(1)}%` : '0%',
                    description: 'Usuários que baixaram PDF',
                    color: 'from-blue-500 to-indigo-500',
                    icon: Download
                  },
                  {
                    metric: 'Idade Média',
                    value: `${detailedStats.idadeMedia} anos`,
                    description: 'Idade média dos usuários',
                    color: 'from-purple-500 to-pink-500',
                    icon: Users
                  },
                  {
                    metric: 'Mais Comum',
                    value: detailedStats.feminino > detailedStats.masculino ? 'Mulheres' : 'Homens',
                    description: 'Gênero mais frequente',
                    color: 'from-orange-500 to-red-500',
                    icon: Heart
                  }
                ].map((metric, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${metric.color} rounded-2xl mb-4 shadow-lg`}>
                      <metric.icon className="text-white" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">{metric.value}</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">{metric.metric}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Exports View */}
        {currentView === 'exports' && (
          <>
            <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                  <FileDown className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Exportação de Leads</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Export Summary */}
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                    <h4 className="text-lg font-bold text-blue-800 mb-4">Resumo da Exportação</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total de usuários:</span>
                        <span className="font-bold text-blue-800">{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Usuários filtrados:</span>
                        <span className="font-bold text-blue-800">{filteredUsers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Com ações (PDF/Próximos):</span>
                        <span className="font-bold text-blue-800">
                          {users.filter(u => u.baixou_pdf || u.clicou_proximos_passos).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Taxa de conversão:</span>
                        <span className="font-bold text-blue-800">{detailedStats.conversionRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Export Actions */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800">Ações Rápidas</h4>
                    
                    <button
                      onClick={copyLeadsToClipboard}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 font-semibold shadow-lg"
                    >
                      <Copy className="w-5 h-5" />
                      Copiar Lista de Leads
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => exportLeads('csv')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-semibold shadow-lg"
                      >
                        <FileText className="w-4 h-4" />
                        Export CSV
                      </button>

                      <button
                        onClick={() => exportLeads('json')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-semibold shadow-lg"
                      >
                        <Database className="w-4 h-4" />
                        Export JSON
                      </button>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl">
                    <h4 className="text-lg font-bold text-orange-800 mb-4">Opções de Exportação</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-xl border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold text-orange-800">Formato CSV</span>
                        </div>
                        <p className="text-sm text-orange-700">
                          Ideal para planilhas (Excel, Google Sheets). 
                          Inclui todos os dados estruturados.
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Database className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">Formato JSON</span>
                        </div>
                        <p className="text-sm text-purple-700">
                          Para desenvolvedores e sistemas. 
                          Dados estruturados em formato técnico.
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Copy className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">Copiar Lista</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Copia nome, email e WhatsApp para área de transferência.
                          Rápido para uso imediato.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Integration */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                    <h4 className="text-lg font-bold text-green-800 mb-4">Integração WhatsApp</h4>
                    <div className="space-y-3">
                      <p className="text-sm text-green-700">
                        Todos os números de WhatsApp são clicáveis na tabela de usuários.
                        Clique em qualquer número para abrir diretamente no WhatsApp.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Smartphone className="w-4 h-4" />
                        <span>{users.length} contatos disponíveis para WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Filters Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-700">Filtros Aplicados na Exportação</span>
                </div>
                <p className="text-sm text-gray-600">
                  A exportação considera apenas os usuários que passaram pelos filtros aplicados. 
                  {filteredUsers.length < users.length && (
                    <span className="font-semibold text-orange-600">
                      {` Atualmente exportando ${filteredUsers.length} de ${users.length} usuários.`}
                    </span>
                  )}
                  {filteredUsers.length === users.length && (
                    <span className="font-semibold text-green-600">
                      {` Exportando todos os ${users.length} usuários.`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </> 
        )} 

        {/* Footer Premium */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Painel Administrativo Seguro</span>
            </div>
            <p className="text-sm text-gray-500">
              Calculadora Cinturinha Fina™ - Todos os dados são tratados com máxima segurança e privacidade
            </p>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{users.length} usuários</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                <span>Atualizado: {lastUpdated && formatDate(lastUpdated.toISOString())}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Dashboard v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AdminPanel;   