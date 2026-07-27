export const getSisaKarbohidrat = (protein, lemak) => {
  return Math.max(0, 100 - Number(protein || 0) - Number(lemak || 0));
};

// Configuration for macronutrients by disease combination
export const MACRO_CONFIGS = {
  "dm": {
    name: "Diabetes Mellitus",
    type: "three-sliders",
    protein: { min: 10, max: 20, defaultVal: 10, label: "Protein" },
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" },
    karbo: { min: 45, max: 65, defaultVal: 65, label: "Karbohidrat" },
  },
  "dm,stroke": {
    name: "DM + Stroke",
    type: "three-sliders",
    protein: { min: 10, max: 25, defaultVal: 10, label: "Protein" },
    lemak: { min: 20, max: 35, defaultVal: 25, label: "Lemak" },
    karbo: { min: 45, max: 65, defaultVal: 65, label: "Karbohidrat" },
  },
  "dm,lambung": {
    name: "DM + Lambung",
    type: "three-sliders",
    protein: { min: 10, max: 20, defaultVal: 10, label: "Protein" },
    lemak: { min: 10, max: 25, defaultVal: 25, label: "Lemak" },
    karbo: { min: 45, max: 80, defaultVal: 65, label: "Karbohidrat" },
  },
  "ckd,dm": {
    name: "DM + CKD",
    type: "one-slider",
    lemak: { min: 15, max: 30, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf,ckd,dm": {
    name: "DM + CKD + CHF",
    type: "one-slider",
    lemak: { min: 15, max: 30, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf,dm": {
    name: "DM + CHF",
    type: "three-sliders",
    protein: { min: 10, max: 25, defaultVal: 10, label: "Protein" },
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" },
    karbo: { min: 45, max: 65, defaultVal: 65, label: "Karbohidrat" },
  },
  "ckd": {
    name: "CKD",
    type: "one-slider",
    lemak: { min: 15, max: 30, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "ckd,stroke": {
    name: "CKD + Stroke",
    type: "one-slider",
    lemak: { min: 15, max: 35, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf": {
    name: "CHF",
    type: "three-sliders",
    protein: { min: 15, max: 25, defaultVal: 15, label: "Protein" },
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" },
    karbo: { min: 50, max: 60, defaultVal: 60, label: "Karbohidrat" },
  },
  "chf,lambung": {
    name: "CHF + Lambung",
    type: "three-sliders",
    protein: { min: 10, max: 25, defaultVal: 15, label: "Protein" },
    lemak: { min: 10, max: 25, defaultVal: 25, label: "Lemak" },
    karbo: { min: 50, max: 80, defaultVal: 60, label: "Karbohidrat" },
  },
  "lambung": {
    name: "Lambung",
    type: "three-sliders",
    protein: { min: 10, max: 20, defaultVal: 10, label: "Protein" },
    lemak: { min: 10, max: 15, defaultVal: 15, label: "Lemak" },
    karbo: { min: 65, max: 80, defaultVal: 75, label: "Karbohidrat" },
  },
  "stroke": {
    name: "Stroke",
    type: "one-slider",
    lemak: { min: 25, max: 35, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: 1.2 x BBI (fase pemulihan)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf,stroke": {
    name: "CHF + Stroke",
    type: "three-sliders",
    protein: { min: 15, max: 30, defaultVal: 15, label: "Protein" },
    lemak: { min: 20, max: 35, defaultVal: 25, label: "Lemak" },
    karbo: { min: 50, max: 60, defaultVal: 60, label: "Karbohidrat" },
  },
  "ckd,lambung": {
    name: "CKD + Lambung",
    type: "one-slider",
    lemak: { min: 10, max: 30, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf,ckd": {
    name: "CKD + CHF",
    type: "one-slider",
    lemak: { min: 15, max: 30, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "": {
    name: "Mifflin St Jeor (Umum)",
    type: "three-sliders",
    protein: { min: 10, max: 30, defaultVal: 15, label: "Protein" },
    lemak: { min: 20, max: 35, defaultVal: 25, label: "Lemak" },
    karbo: { min: 45, max: 65, defaultVal: 60, label: "Karbohidrat" },
  },
};

export function isExcludedCombination(penyakitArray) {
  return false;
}
