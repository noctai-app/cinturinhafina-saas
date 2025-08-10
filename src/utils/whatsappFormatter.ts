import { UserData, NutritionalResults } from '../types/calculator';

export const formatWhatsAppMessage = (userData: UserData, results: NutritionalResults): string => {
  const genderText = userData.gender === 'female' ? 'Feminino' : 'Masculino';
  const goalText = {
    'lose': 'Perder Peso',
    'maintain': 'Manter Peso',
    'gain': 'Ganhar Massa',
    'custom': 'Personalizado'
  }[userData.goal];

  return `🎯 *Meu Plano Nutricional Cinturinha Fina™*

👤 *DADOS PESSOAIS*
• Nome: ${userData.name}
• Sexo: ${genderText}
• Idade: ${userData.age} anos
• Peso: ${userData.weight} kg
• Altura: ${userData.height} cm
• Objetivo: ${goalText}

📊 *MEUS RESULTADOS*
• TMB: ${results.tmb} kcal/dia
• GET: ${results.get} kcal/dia  
• Gasto Semanal: ${results.gse.toLocaleString()} kcal
• IMC: ${results.imc} (${results.imcCategory})
• Água: ${(results.waterIntake/1000).toFixed(1)}L/dia
• Fibras: ${results.fiberIntake}g/dia

🎯 *META CALÓRICA*
• Objetivo: ${results.targetCalories} kcal/dia

🍗 *MACRONUTRIENTES*
• Proteína: ${results.macros.protein.grams}g (${results.macros.protein.calories} kcal)
• Carboidrato: ${results.macros.carbs.grams}g (${results.macros.carbs.calories} kcal)  
• Gordura: ${results.macros.fat.grams}g (${results.macros.fat.calories} kcal)

✨ Calculado gratuitamente em: https://verdant-sprite-839bc5.netlify.app

#CinturinhaFina #PlanoNutricional #Emagrecimento`;
};

export const shareWhatsApp = (userData: UserData, results: NutritionalResults) => {
  const message = formatWhatsAppMessage(userData, results);
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
};