export interface UserData {
  name: string;
  email: string;
  whatsapp: string;
  gender: 'female' | 'male';
  age: number;
  weight: number;
  height: number;
  activityLevel: number;
  bodyFat?: number;
  bodyFeeling: string;
  goal: 'lose' | 'maintain' | 'gain' | 'custom';
  deficitLevel?: 'light' | 'moderate' | 'aggressive';
  userId?: number; // ID do usuário no Supabase
}

export interface NutritionalResults {
  tmb: number;
  get: number;
  gse: number;
  imc: number;
  imcCategory: string;
  waterIntake: number;
  waterIntakeMax?: number;
  fiberIntake: number;
  targetCalories: number;
  macros: {
    protein: { calories: number; grams: number };
    carbs: { calories: number; grams: number };
    fat: { calories: number; grams: number };
  };
  cinturinhaScore: number;
  goalMultiplier: number;
}