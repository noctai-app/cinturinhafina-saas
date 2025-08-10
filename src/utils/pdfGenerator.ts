import jsPDF from 'jspdf';
import { UserData, NutritionalResults } from '../types/calculator';

export const generatePDF = async (userData: UserData, results: NutritionalResults, deficitOptions?: any) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFillColor(255, 165, 0);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Cinturinha Fina', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Seu Plano Nutricional Personalizado', pageWidth / 2, 30, { align: 'center' });
  
  // Reset text color
  pdf.setTextColor(0, 0, 0);
  
  let yPosition = 55;
  
  // Seu Objetivo
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Seu Objetivo', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const goalText = {
    'lose': 'Perder Peso',
    'maintain': 'Manter Peso',
    'gain': 'Ganhar Massa',
    'custom': 'Personalizado'
  }[userData.goal];
  pdf.text(`Objetivo: ${goalText}`, 20, yPosition);
  yPosition += 15;
  
  // Dados Pessoais
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados Pessoais', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nome: ${userData.name}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Sexo: ${userData.gender === 'female' ? 'Feminino' : 'Masculino'}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Idade: ${userData.age} anos`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Peso: ${userData.weight} kg`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Altura: ${userData.height} cm`, 20, yPosition);
  yPosition += 15;
  
  // Resultados
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Seus Resultados', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  // Taxa Metabólica Basal
  pdf.setFont('helvetica', 'bold');
  pdf.text('Taxa Metabolica Basal:', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${results.tmb} kcal/dia`, 120, yPosition);
  yPosition += 8;
  
  // Gasto Energético Total
  pdf.setFont('helvetica', 'bold');
  pdf.text('Gasto Energetico Total:', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${results.get} kcal/dia`, 120, yPosition);
  yPosition += 8;
  
  // Gasto Semanal
  pdf.setFont('helvetica', 'bold');
  pdf.text('Gasto Semanal:', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${results.gse.toLocaleString()} kcal/semana`, 120, yPosition);
  yPosition += 8;
  
  // Índice de Massa Corporal
  pdf.setFont('helvetica', 'bold');
  pdf.text('Indice de Massa Corporal:', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${results.imc} (${results.imcCategory})`, 120, yPosition);
  yPosition += 8;
  
  // Água
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hidratacao Diaria:', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${(results.waterIntake/1000).toFixed(1)}L a ${(results.waterIntakeMax!/1000).toFixed(1)}L`, 120, yPosition);
  yPosition += 8;
  
  // Fibras
  pdf.setFont('helvetica', 'bold');
  pdf.text('Fibras Diarias:', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${results.fiberIntake}g`, 120, yPosition);
  yPosition += 15;
  
  // Opções de Déficit Calórico (apenas para perda de peso)
  if (userData.goal === 'lose' && deficitOptions) {
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Opcoes de Deficit Calorico', 20, yPosition);
    yPosition += 15;
    
    // Função para calcular macros
    const getDeficitMacros = (calories: number) => {
      const proteinGrams = 2 * userData.weight;
      const proteinCalories = proteinGrams * 4;
      const fatGrams = 1 * userData.weight;
      const fatCalories = fatGrams * 9;
      const remainingCalories = calories - (proteinCalories + fatCalories);
      const carbsGrams = Math.max(0, remainingCalories / 4);
      
      return {
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbsGrams),
        fat: Math.round(fatGrams)
      };
    };
    
    const deficitData = [
      { label: 'Leve 5%:', calories: deficitOptions.light.deficit5.calories },
      { label: 'Leve 10%:', calories: deficitOptions.light.deficit10.calories },
      { label: 'Moderado 15%:', calories: deficitOptions.moderate.deficit15.calories },
      { label: 'Moderado 20%:', calories: deficitOptions.moderate.deficit20.calories },
      { label: 'Agressivo 25%:', calories: deficitOptions.aggressive.deficit25.calories }
    ];
    
    deficitData.forEach(option => {
      const macros = getDeficitMacros(option.calories);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${option.label}`, 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${option.calories} kcal/dia`, 120, yPosition);
      yPosition += 6;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`  Proteina: ${macros.protein}g`, 25, yPosition);
      pdf.text(`Carboidrato: ${macros.carbs}g`, 80, yPosition);
      pdf.text(`Gordura: ${macros.fat}g`, 140, yPosition);
      yPosition += 10;
    });
    
    yPosition += 5;
  } else {
    // Meta Calórica para outros objetivos
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sua Meta Calorica', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 165, 0);
    pdf.text(`${results.targetCalories} kcal/dia`, 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 15;
    
    // Macronutrientes
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Distribuicao dos Macronutrientes', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Proteína
    pdf.setFont('helvetica', 'bold');
    pdf.text('Proteina:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${results.macros.protein.grams}g (${results.macros.protein.calories} kcal)`, 120, yPosition);
    yPosition += 8;
    
    // Carboidrato
    pdf.setFont('helvetica', 'bold');
    pdf.text('Carboidrato:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${results.macros.carbs.grams}g (${results.macros.carbs.calories} kcal)`, 120, yPosition);
    yPosition += 8;
    
    // Gordura
    pdf.setFont('helvetica', 'bold');
    pdf.text('Gordura:', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${results.macros.fat.grams}g (${results.macros.fat.calories} kcal)`, 120, yPosition);
    yPosition += 15;
  }

  // Footer
  pdf.setFillColor(255, 165, 0);
  pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text('Gerado pela Calculadora Cinturinha Fina', pageWidth / 2, pageHeight - 15, { align: 'center' });
  pdf.text('2025 - Todos os direitos reservados', pageWidth / 2, pageHeight - 8, { align: 'center' });
  
  return pdf;
};

export const downloadPDF = async (userData: UserData, results: NutritionalResults, deficitOptions?: any) => {
  const pdf = await generatePDF(userData, results, deficitOptions);
  pdf.save(`Plano_Nutricional_${userData.name.replace(/\s+/g, '_')}.pdf`);
};