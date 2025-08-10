import { UserData, NutritionalResults } from '../types/calculator';

export const calculateNutritionalData = (userData: UserData): NutritionalResults => {
  // TMB (Taxa Metabólica Basal) - Harris-Benedict
  let tmb: number;
  if (userData.gender === 'female') {
    tmb = 655 + (9.6 * userData.weight) + (1.8 * userData.height) - (4.7 * userData.age);
  } else {
    tmb = 66 + (13.7 * userData.weight) + (5 * userData.height) - (6.8 * userData.age);
  }

  // GET (Gasto Energético Total)
  const get = tmb * userData.activityLevel;

  // GSE (Gasto Semanal)
  const gse = get * 7;

  // IMC
  const heightInMeters = userData.height / 100;
  const imc = userData.weight / (heightInMeters * heightInMeters);

  // Categoria IMC
  let imcCategory: string;
  if (imc < 18.5) imcCategory = 'Abaixo do peso';
  else if (imc < 25) imcCategory = 'Peso normal';
  else if (imc < 30) imcCategory = 'Sobrepeso';
  else imcCategory = 'Obesidade';

  // Água diária (ml) - mínima e máxima
  const waterIntake = userData.weight * 35;
  const waterIntakeMax = userData.weight * 50;

  // Fibras (g)
  const fiberIntake = (get / 1000) * 14;

  // Calorias alvo baseado no objetivo
  let goalMultiplier: number;
  let targetCalories: number;
  
  switch (userData.goal) {
    case 'lose':
      // Aplicar déficit baseado no nível selecionado
      switch (userData.deficitLevel) {
        case 'light':
          goalMultiplier = 0.925; // Déficit 7.5% (média entre 5-10%)
          break;
        case 'moderate':
          goalMultiplier = 0.85; // Déficit 15% (média entre 10-20%)
          break;
        case 'aggressive':
          goalMultiplier = 0.75; // Déficit 25%
          break;
        default:
          goalMultiplier = 0.85; // Padrão moderado
      }
      targetCalories = get * goalMultiplier;
      break;
    case 'maintain':
      goalMultiplier = 1.0; // Manutenção
      targetCalories = get * goalMultiplier;
      break;
    case 'gain':
      // Aplicar superávit baseado no nível selecionado
      switch (userData.deficitLevel) {
        case 'light':
          goalMultiplier = 1.125; // Superávit 12.5% (média entre 8-15%)
          break;
        case 'moderate':
          goalMultiplier = 1.15; // Superávit 15%
          break;
        case 'aggressive':
          goalMultiplier = 1.25; // Superávit 25%
          break;
        default:
          goalMultiplier = 1.15; // Padrão moderado
      }
      targetCalories = get * goalMultiplier;
      break;
    case 'custom':
      targetCalories = userData.customCalories || get;
      goalMultiplier = targetCalories / get;
      break;
    default:
      goalMultiplier = 0.85;
      targetCalories = get * goalMultiplier;
  }

  // Distribuição de Macronutrientes - Proteína: 2g por kg corporal
  const proteinGrams = 2 * userData.weight;
  const proteinCalories = proteinGrams * 4;

  // Gordura: 1g por kg corporal
  const fatGrams = 1 * userData.weight;
  const fatCalories = fatGrams * 9;

  // Carboidratos: calorias restantes
  const remainingCalories = targetCalories - (proteinCalories + fatCalories);
  const carbsGrams = Math.max(0, remainingCalories / 4);
  const carbsCalories = carbsGrams * 4;

  const macros = {
    protein: {
      calories: Math.round(proteinCalories),
      grams: Math.round(proteinGrams)
    },
    carbs: {
      calories: Math.round(carbsCalories),
      grams: Math.round(carbsGrams)
    },
    fat: {
      calories: Math.round(fatCalories),
      grams: Math.round(fatGrams)
    }
  };

  // Score Cinturinha (baseado em múltiplos fatores)
  let score = 50;
  if (imc >= 18.5 && imc <= 24.9) score += 20;
  if (userData.activityLevel > 1.375) score += 15;
  if (userData.age < 35) score += 10;
  if (userData.bodyFeeling === 'Quero melhorar visual') score += 5;
  
  const cinturinhaScore = Math.min(100, score);

  return {
    tmb: Math.round(tmb),
    get: Math.round(get),
    gse: Math.round(gse),
    imc: Math.round(imc * 10) / 10,
    imcCategory,
    waterIntake: Math.round(waterIntake),
    waterIntakeMax: Math.round(waterIntakeMax),
    fiberIntake: Math.round(fiberIntake * 10) / 10,
    targetCalories: Math.round(targetCalories),
    macros,
    cinturinhaScore,
    goalMultiplier
  };
};

export const getActivityLevelText = (level: number): string => {
  switch (level) {
    case 1.2: return 'Sedentária';
    case 1.375: return 'Levemente ativa';
    case 1.55: return 'Moderadamente ativa';
    case 1.725: return 'Muito ativa';
    case 1.9: return 'Super ativa';
    default: return 'Moderadamente ativa';
  }
};

// Função para calcular todas as opções de superávit para ganho de massa
export const calculateAllSurplusOptions = (userData: UserData) => {
  const baseResults = calculateNutritionalData({ ...userData, goal: 'maintain' });
  
  return {
    light: {
      surplus8: {
        calories: Math.round(baseResults.get * 1.08),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 1.08), userData.weight)
      },
      surplus15: {
        calories: Math.round(baseResults.get * 1.15),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 1.15), userData.weight)
      }
    },
    moderate: {
      surplus15: {
        calories: Math.round(baseResults.get * 1.15),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 1.15), userData.weight)
      },
      surplus20: {
        calories: Math.round(baseResults.get * 1.20),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 1.20), userData.weight)
      }
    },
    aggressive: {
      surplus25: {
        calories: Math.round(baseResults.get * 1.25),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 1.25), userData.weight)
      },
      surplus30: {
        calories: Math.round(baseResults.get * 1.30),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 1.30), userData.weight)
      }
    }
  };
};

// Função para calcular todas as opções de déficit
export const calculateAllDeficitOptions = (userData: UserData) => {
  const baseResults = calculateNutritionalData({ ...userData, goal: 'maintain' });
  
  return {
    light: {
      deficit5: {
        calories: Math.round(baseResults.get * 0.95),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 0.95), userData.weight)
      },
      deficit10: {
        calories: Math.round(baseResults.get * 0.90),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 0.90), userData.weight)
      }
    },
    moderate: {
      deficit15: {
        calories: Math.round(baseResults.get * 0.85),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 0.85), userData.weight)
      },
      deficit20: {
        calories: Math.round(baseResults.get * 0.80),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 0.80), userData.weight)
      }
    },
    aggressive: {
      deficit25: {
        calories: Math.round(baseResults.get * 0.75),
        macros: calculateMacrosForCalories(Math.round(baseResults.get * 0.75), userData.weight)
      }
    }
  };
};

// Função auxiliar para calcular macros para uma quantidade específica de calorias
const calculateMacrosForCalories = (calories: number, weight: number) => {
  const proteinGrams = 2 * weight;
  const proteinCalories = proteinGrams * 4;
  const fatGrams = 1 * weight;
  const fatCalories = fatGrams * 9;
  const remainingCalories = calories - (proteinCalories + fatCalories);
  const carbsGrams = Math.max(0, remainingCalories / 4);
  
  return {
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fat: Math.round(fatGrams)
  };
};