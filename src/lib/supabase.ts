import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Cliente regular para operações públicas
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente admin com service role (ignora RLS) - para operações administrativas
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase // Fallback para o cliente regular se não houver service key

export interface UserSubmission {
  id?: number
  nome: string
  email: string
  whatsapp: string
  sexo?: 'female' | 'male'
  objetivo?: 'lose' | 'maintain' | 'gain'
  idade?: number
  peso?: number
  altura?: number
  nivel_atividade?: number
  nivel_atividade_texto?: string
  gordura_corporal?: number
  sentimento_corpo?: string
  baixou_pdf: boolean
  clicou_proximos_passos: boolean
  intensidade_selecionada?: 'light' | 'moderate' | 'aggressive'
  created_at?: string
}

// Interface para dados da primeira etapa
export interface UserFirstStep {
  nome: string
  email: string
  whatsapp: string
  baixou_pdf?: boolean
  clicou_proximos_passos?: boolean
}

// Interface para dados da segunda etapa
export interface UserSecondStep {
  sexo: 'female' | 'male'
  objetivo: 'lose' | 'maintain' | 'gain'
  idade: number
  peso: number
  altura: number
  nivel_atividade: number
  nivel_atividade_texto: string
  gordura_corporal?: number
  sentimento_corpo: string
  intensidade_selecionada?: 'light' | 'moderate' | 'aggressive'
}

// 🆕 NOVA FUNÇÃO: Salvar primeira etapa (nome, email, whatsapp)
export const saveUserFirstStep = async (userData: UserFirstStep) => {
  try {
    console.log('🔄 Salvando primeira etapa do usuário:', userData.nome)
    
    // Dados básicos da primeira etapa - APENAS campos obrigatórios
    const firstStepData = {
      nome: userData.nome,
      email: userData.email,
      whatsapp: userData.whatsapp,
      baixou_pdf: userData.baixou_pdf || false,
      clicou_proximos_passos: userData.clicou_proximos_passos || false,
      created_at: new Date().toISOString()
      // NÃO enviamos sexo, objetivo, idade etc. na primeira etapa
    }

    console.log('📝 Dados da primeira etapa:', firstStepData)

    // Verifica se já existe um usuário com o mesmo email
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('user_submissions')
      .select('id, nome, email')
      .eq('email', userData.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = No rows found, que é esperado se não houver usuário
      console.error('❌ Erro ao verificar usuário existente:', checkError)
      return { success: false, error: checkError.message }
    }

    if (existingUser) {
      console.log('⚠️ Usuário já existe, atualizando dados básicos...')
      // Se já existe, atualiza os dados básicos
      const { data, error } = await supabaseAdmin
        .from('user_submissions')
        .update(firstStepData)
        .eq('email', userData.email)
        .select()

      if (error) {
        console.error('❌ Erro ao atualizar primeira etapa:', error)
        
        // Tenta com cliente público se admin falhar
        const { data: publicData, error: publicError } = await supabase
          .from('user_submissions')
          .update(firstStepData)
          .eq('email', userData.email)
          .select()

        if (publicError) {
          console.error('❌ Erro também no cliente público:', publicError)
          return { success: false, error: publicError.message }
        }

        console.log('✅ Primeira etapa atualizada com cliente público:', publicData[0])
        return { success: true, data: publicData[0], isUpdate: true }
      }

      console.log('✅ Primeira etapa atualizada com sucesso:', data[0])
      return { success: true, data: data[0], isUpdate: true }
    } else {
      // Se não existe, cria novo registro
      const { data, error } = await supabaseAdmin
        .from('user_submissions')
        .insert([firstStepData])
        .select()

      if (error) {
        console.error('❌ Erro ao salvar primeira etapa:', error)
        
        // Tenta com cliente público se admin falhar
        const { data: publicData, error: publicError } = await supabase
          .from('user_submissions')
          .insert([firstStepData])
          .select()

        if (publicError) {
          console.error('❌ Erro também no cliente público:', publicError)
          return { success: false, error: publicError.message }
        }

        console.log('✅ Primeira etapa salva com cliente público:', publicData[0])
        return { success: true, data: publicData[0], isUpdate: false }
      }

      console.log('✅ Primeira etapa salva com sucesso:', data[0])
      return { success: true, data: data[0], isUpdate: false }
    }
  } catch (error: any) {
    console.error('❌ Erro inesperado na primeira etapa:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao salvar dados iniciais',
      details: error.message 
    }
  }
}

// 🆕 NOVA FUNÇÃO: Completar segunda etapa (dados do formulário)
export const completeUserSecondStep = async (email: string, secondStepData: UserSecondStep) => {
  try {
    console.log('🔄 Completando segunda etapa para:', email)
    
    console.log('📝 Dados da segunda etapa:', secondStepData)

    // Atualiza o registro existente com os dados da segunda etapa
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .update(secondStepData)
      .eq('email', email)
      .select()

    if (error) {
      console.error('❌ Erro ao completar segunda etapa:', error)
      
      // Tenta com cliente público se admin falhar
      const { data: publicData, error: publicError } = await supabase
        .from('user_submissions')
        .update(secondStepData)
        .eq('email', email)
        .select()

      if (publicError) {
        console.error('❌ Erro também no cliente público:', publicError)
        return { success: false, error: publicError.message }
      }

      console.log('✅ Segunda etapa completada com cliente público:', publicData[0])
      return { success: true, data: publicData[0] }
    }

    if (!data || data.length === 0) {
      console.error('❌ Nenhum usuário encontrado com o email:', email)
      return { 
        success: false, 
        error: 'Usuário não encontrado. Complete a primeira etapa primeiro.' 
      }
    }

    console.log('✅ Segunda etapa completada com sucesso:', data[0])
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error('❌ Erro inesperado na segunda etapa:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao completar dados',
      details: error.message 
    }
  }
}

// 🆕 NOVA FUNÇÃO: Buscar usuário por email (útil para verificar se já existe)
export const getUserByEmail = async (email: string) => {
  try {
    console.log('🔍 Buscando usuário por email:', email)
    
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar usuário:', error)
      return { success: false, error: error.message }
    }

    if (!data) {
      console.log('⚠️ Usuário não encontrado:', email)
      return { success: false, error: 'Usuário não encontrado' }
    }

    console.log('✅ Usuário encontrado:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Erro inesperado ao buscar usuário:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao buscar usuário',
      details: error.message 
    }
  }
}

// 🆕 NOVA FUNÇÃO: Atualizar ação por email (mais útil para o fluxo)
export const updateUserActionByEmail = async (
  email: string, 
  action: 'baixou_pdf' | 'clicou_proximos_passos', 
  value: boolean = true
) => {
  try {
    console.log(`🔄 Atualizando ${action} para usuário:`, email)
    
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .update({ [action]: value })
      .eq('email', email)
      .select()

    if (error) {
      console.error(`❌ Erro ao atualizar ${action}:`, error)
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      console.error('❌ Usuário não encontrado para atualizar:', email)
      return { success: false, error: 'Usuário não encontrado' }
    }

    console.log(`✅ ${action} atualizado com sucesso:`, data[0])
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error)
    return { success: false, error: 'Erro inesperado ao atualizar ação' }
  }
}

// FUNÇÃO MANTIDA: Para compatibilidade (salva dados completos de uma vez)
export const saveUserData = async (userData: UserSubmission) => {
  try {
    console.log('🔄 Tentando salvar dados completos do usuário:', userData.nome)
    
    // Remove campos undefined para evitar problemas no Supabase
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined)
    )

    console.log('📝 Dados limpos para inserção:', cleanUserData)

    // Verifica se já existe um usuário com o mesmo email
    const { data: existingUser } = await supabaseAdmin
      .from('user_submissions')
      .select('id')
      .eq('email', userData.email)
      .single()

    let result;
    if (existingUser) {
      // Atualiza registro existente
      result = await supabaseAdmin
        .from('user_submissions')
        .update(cleanUserData)
        .eq('email', userData.email)
        .select()
    } else {
      // Cria novo registro
      result = await supabaseAdmin
        .from('user_submissions')
        .insert([cleanUserData])
        .select()
    }

    // Se falhar com admin, tenta com cliente público
    if (result.error) {
      console.log('⚠️ Admin falhou, tentando cliente público...')
      if (existingUser) {
        result = await supabase
          .from('user_submissions')
          .update(cleanUserData)
          .eq('email', userData.email)
          .select()
      } else {
        result = await supabase
          .from('user_submissions')
          .insert([cleanUserData])
          .select()
      }
    }

    const { data, error } = result

    if (error) {
      console.error('❌ Erro ao salvar dados:', error)
      
      // Mensagens de erro mais específicas
      if (error.message.includes('permission denied')) {
        return { 
          success: false, 
          error: 'Erro de permissão. Verifique as configurações RLS no Supabase.',
          suggestion: 'Desabilite o RLS na tabela user_submissions ou configure políticas adequadas.'
        }
      }
      
      if (error.message.includes('duplicate key')) {
        return { 
          success: false, 
          error: 'Este usuário já foi cadastrado.',
          suggestion: 'Verifique se o email não está duplicado.'
        }
      }
      
      return { success: false, error: error.message }
    }

    console.log('✅ Dados salvos com sucesso:', data[0])
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao salvar dados',
      details: error.message 
    }
  }
}

export const updateUserAction = async (
  userId: number, 
  action: 'baixou_pdf' | 'clicou_proximos_passos', 
  value: boolean = true
) => {
  try {
    // Usa o cliente admin para operações de atualização
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .update({ [action]: value })
      .eq('id', userId)
      .select()

    if (error) {
      console.error(`Erro ao atualizar ${action}:`, error)
      return { success: false, error: error.message }
    }

    console.log(`${action} atualizado com sucesso:`, data)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Erro inesperado:', error)
    return { success: false, error: 'Erro inesperado ao atualizar ação' }
  }
}

export const updateUserIntensity = async (
  userId: number, 
  intensity: 'light' | 'moderate' | 'aggressive'
) => {
  try {
    // Usa o cliente admin para operações de atualização
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .update({ intensidade_selecionada: intensity })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('Erro ao atualizar intensidade:', error)
      return { success: false, error: error.message }
    }

    console.log('Intensidade atualizada com sucesso:', data)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Erro inesperado:', error)
    return { success: false, error: 'Erro inesperado ao atualizar intensidade' }
  }
}

// Função para buscar todos os usuários com numeração automática
export const getAllUsers = async () => {
  try {
    console.log('🔍 Buscando usuários...')
    
    // Usa o cliente admin para buscar dados (ignora RLS)
    const { data, error } = await supabaseAdmin
      .from('user_submissions')
      .select('*')
      .order('created_at', { ascending: false }) // Mudei para mostrar mais recentes primeiro

    if (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Usuários encontrados:', data?.length || 0)

    // Adicionar numeração automática (1, 2, 3, 4...)
    const usersWithNumbers = data?.map((user, index) => ({
      ...user,
      numero: index + 1
    })) || []

    return { success: true, data: usersWithNumbers }
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    return { success: false, error: 'Erro inesperado ao buscar usuários' }
  }
}

// Função para testar a conexão (útil para debug)
export const testConnection = async () => {
  try {
    console.log('🔄 Testando conexão com Supabase...')
    
    // Testa primeiro com o cliente admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('user_submissions')
      .select('count(*)', { count: 'exact' })
      .limit(1)

    if (!adminError) {
      console.log('✅ Conexão Admin OK - Total de registros:', adminData)
      return { success: true, count: adminData, client: 'admin' }
    }

    console.log('⚠️ Cliente admin falhou, testando cliente público...')
    
    // Se admin falhar, testa com cliente público
    const { data, error } = await supabase
      .from('user_submissions')
      .select('count(*)', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão:', error)
      return { 
        success: false, 
        error: error.message,
        suggestion: 'Verifique as permissões RLS no Supabase ou configure a Service Role Key'
      }
    }

    console.log('✅ Conexão com Supabase OK (cliente público)')
    return { success: true, count: data, client: 'public' }
  } catch (error) {
    console.error('❌ Erro inesperado na conexão:', error)
    return { success: false, error: 'Erro inesperado na conexão' }
  }
}

// Função para verificar se o usuário é admin (para o painel)
export const checkAdminAccess = () => {
  const isLogged = localStorage.getItem('cinturinha_admin_logged') === 'true'
  const hasServiceKey = !!supabaseServiceKey
  
  return {
    isLogged,
    hasServiceKey,
    canAccessData: isLogged && (hasServiceKey || !import.meta.env.PROD)
  }
}

// Função de debug para verificar configuração
export const debugSupabaseConfig = () => {
  console.log('🔧 Configuração do Supabase:')
  console.log('- URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada')
  console.log('- Anon Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada')
  console.log('- Service Key:', supabaseServiceKey ? '✅ Configurada' : '⚠️ Não configurada (necessária para admin)')
  
  return {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    serviceKey: !!supabaseServiceKey
  }
}