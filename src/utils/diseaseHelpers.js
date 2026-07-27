export const calculationTypeValues = ["critical_ill", "mifflin"];

export function getDiseaseValues(penyakitArray) {
  return (penyakitArray || []).filter(
    (item) => !calculationTypeValues.includes(item)
  );
}

export function isValidCombination(penyakitArray) {
  const diseaseValues = getDiseaseValues(penyakitArray);

  if (!diseaseValues.length) return false;

  const validCombinations = [
    ["dm"],
    ["dm", "ckd"],
    ["dm", "ckd", "chf"],
    ["dm", "chf"],
    ["dm", "lambung"],
    ["dm", "stroke"],
    ["ckd"],
    ["ckd", "chf"],
    ["ckd", "lambung"],
    ["ckd", "stroke"],
    ["chf"],
    ["chf", "lambung"],
    ["chf", "stroke"],
    ["lambung"],
    ["stroke"],
  ];

  const sorted = [...diseaseValues].sort();

  return validCombinations.some((combo) => {
    const sortedCombo = [...combo].sort();
    if (sortedCombo.length !== sorted.length) return false;
    return sortedCombo.every((val, idx) => val === sorted[idx]);
  });
}
