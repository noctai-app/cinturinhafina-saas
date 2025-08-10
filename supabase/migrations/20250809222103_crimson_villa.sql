/*
  # Criar tabela de submissões de usuários

  1. Nova Tabela
    - `user_submissions`
      - `id` (serial, primary key) - Numeração automática 1, 2, 3...
      - `nome` (text) - Nome completo do usuário
      - `email` (text) - Email do usuário
      - `whatsapp` (text) - WhatsApp do usuário
      - `sexo` (text) - 'female' ou 'male'
      - `objetivo` (text) - 'lose', 'maintain' ou 'gain'
      - `idade` (integer) - Idade em anos
      - `peso` (decimal) - Peso em kg
      - `altura` (decimal) - Altura em cm
      - `nivel_atividade` (decimal) - Multiplicador de atividade física
      - `nivel_atividade_texto` (text) - Descrição do nível de atividade
      - `gordura_corporal` (decimal, opcional) - Percentual de gordura corporal
      - `sentimento_corpo` (text) - Como se sente com o corpo
      - `baixou_pdf` (boolean) - Se baixou o PDF
      - `clicou_proximos_passos` (boolean) - Se clicou em "próximos passos"
      - `intensidade_selecionada` (text, opcional) - 'light', 'moderate' ou 'aggressive'
      - `created_at` (timestamp) - Data de criação

  2. Segurança
    - Enable RLS na tabela `user_submissions`
    - Política para permitir inserção pública (para capturar leads)
    - Política para leitura apenas por usuários autenticados (admin)
*/

-- Criar tabela de submissões de usuários
CREATE TABLE IF NOT EXISTS user_submissions (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  sexo TEXT NOT NULL CHECK (sexo IN ('female', 'male')),
  objetivo TEXT NOT NULL CHECK (objetivo IN ('lose', 'maintain', 'gain')),
  idade INTEGER NOT NULL CHECK (idade >= 18 AND idade <= 100),
  peso DECIMAL(5,2) NOT NULL CHECK (peso >= 30 AND peso <= 300),
  altura DECIMAL(5,2) NOT NULL CHECK (altura >= 100 AND altura <= 250),
  nivel_atividade DECIMAL(3,2) NOT NULL CHECK (nivel_atividade >= 1.0 AND nivel_atividade <= 2.0),
  nivel_atividade_texto TEXT NOT NULL,
  gordura_corporal DECIMAL(4,1) CHECK (gordura_corporal >= 5 AND gordura_corporal <= 50),
  sentimento_corpo TEXT NOT NULL,
  baixou_pdf BOOLEAN DEFAULT FALSE,
  clicou_proximos_passos BOOLEAN DEFAULT FALSE,
  intensidade_selecionada TEXT CHECK (intensidade_selecionada IN ('light', 'moderate', 'aggressive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (captura de leads)
CREATE POLICY "Permitir inserção pública de submissões"
  ON user_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para permitir atualização pública (para tracking de ações)
CREATE POLICY "Permitir atualização pública de ações"
  ON user_submissions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Política para leitura apenas por usuários autenticados (admin)
CREATE POLICY "Admins podem ler todas as submissões"
  ON user_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_submissions_created_at ON user_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_submissions_email ON user_submissions(email);
CREATE INDEX IF NOT EXISTS idx_user_submissions_objetivo ON user_submissions(objetivo);
CREATE INDEX IF NOT EXISTS idx_user_submissions_sexo ON user_submissions(sexo);

-- Comentários para documentação
COMMENT ON TABLE user_submissions IS 'Tabela para armazenar todas as submissões dos usuários da calculadora';
COMMENT ON COLUMN user_submissions.id IS 'ID sequencial automático (1, 2, 3...)';
COMMENT ON COLUMN user_submissions.nivel_atividade IS 'Multiplicador de atividade física (1.2 a 1.9)';
COMMENT ON COLUMN user_submissions.baixou_pdf IS 'Indica se o usuário baixou o PDF dos resultados';
COMMENT ON COLUMN user_submissions.clicou_proximos_passos IS 'Indica se o usuário clicou em "próximos passos"';
COMMENT ON COLUMN user_submissions.intensidade_selecionada IS 'Intensidade selecionada pelo usuário (light/moderate/aggressive)';