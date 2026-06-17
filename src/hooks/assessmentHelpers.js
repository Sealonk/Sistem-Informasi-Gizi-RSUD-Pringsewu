export const CATEGORY_PREFIXES = {
  dm: ["E10", "E11", "E12", "E13", "E14"],
  ckd: ["N18"],
  chf: ["I50"],
  stroke: ["I60", "I61", "I62", "I63", "I64"],
  lambung: ["K21", "K25", "K29", "K30"]
};

export const CATEGORY_DEFAULTS = {
  dm: "E11.9",
  ckd: "N18.9",
  chf: "I50.0",
  stroke: "I63.9",
  lambung: "K29.7"
};

export const getFilteredDiseaseCodes = (selectedPenyakitKeys, originalDiagnosis) => {
  if (!selectedPenyakitKeys || selectedPenyakitKeys.length === 0) return "-";

  const rawCodes = originalDiagnosis 
    ? originalDiagnosis.split(",").map(c => c.trim()).filter(Boolean) 
    : [];

  const filteredCodes = [];

  selectedPenyakitKeys.forEach(key => {
    const prefixes = CATEGORY_PREFIXES[key];
    if (prefixes) {
      const matches = rawCodes.filter(code => 
        prefixes.some(prefix => code.toUpperCase().startsWith(prefix.toUpperCase()))
      );
      if (matches.length > 0) {
        filteredCodes.push(...matches);
      } else {
        const defaultCode = CATEGORY_DEFAULTS[key];
        if (defaultCode) {
          filteredCodes.push(defaultCode);
        }
      }
    } else if (key === "mifflin" || key === "critical_ill") {
      const otherMatches = rawCodes.filter(code => 
        !Object.values(CATEGORY_PREFIXES).flat().some(prefix => 
          code.toUpperCase().startsWith(prefix.toUpperCase())
        )
      );
      if (otherMatches.length > 0) {
        filteredCodes.push(...otherMatches);
      }
    }
  });

  const uniqueCodes = [...new Set(filteredCodes)];
  return uniqueCodes.length > 0 ? uniqueCodes.join(", ") : "-";
};

export const mapAktivitasFisikFromBackend = (val, isDM) => {
  if (!val) return "";
  const cleaned = val.toLowerCase().trim();

  if (isDM) {
    if (cleaned === "bed rest" || cleaned === "istirahat") return "Istirahat";
    if (cleaned === "ringan") return "Ringan";
    if (cleaned === "sedang") return "Sedang";
    if (cleaned === "berat") return "Berat";
    if (cleaned === "sangat berat") return "Sangat berat";
    return val;
  }

  // Non-DM
  if (cleaned === "bed rest" || cleaned === "berbaring di tempat tidur") return "Berbaring di tempat tidur";
  if (cleaned === "ringan" || cleaned === "dapat turun dari tempat tidur") return "Dapat turun dari tempat tidur";
  if (cleaned === "sedang" || cleaned === "kerja banyak duduk / sedikit atau tidak olahraga") return "Kerja banyak duduk / sedikit atau tidak olahraga";
  if (cleaned === "berat" || cleaned === "kerja banyak berdiri / olahraga 4-5 kali per minggu") return "Kerja banyak berdiri / olahraga 4-5 kali per minggu";
  if (cleaned === "sangat berat" || cleaned === "pekerjaan berat / olahraga sangat aktif") return "Pekerjaan berat / olahraga sangat aktif";
  return val;
};

export const mapFaktorStressFromBackend = (val, isDM) => {
  if (!val) return { parent: "", slider: 1.1 };
  const cleaned = val.toLowerCase().trim();

  if (isDM) {
    let parent = val;
    if (cleaned === "ringan") parent = "Ringan";
    if (cleaned === "sedang") parent = "Sedang";
    if (cleaned === "berat") parent = "Berat";
    return { parent, slider: isNaN(parseFloat(val)) ? 10 : parseFloat(val) };
  }

  // Parse format "X.XX (Category)"
  const match = val.match(/^([0-9.]+)(?:\s*\((.*)\))?$/);
  if (match) {
    const num = parseFloat(match[1]);
    const category = match[2] || "";

    let parent = "Tidak ada stress";
    if (category.toLowerCase().includes("sepsis")) {
      parent = "Stress Ringan Sepsis";
    } else if (category.toLowerCase().includes("sangat berat")) {
      parent = "Stress Sangat Berat";
    } else if (category.toLowerCase().includes("ringan")) {
      parent = "Stress Ringan";
    } else if (category.toLowerCase().includes("berat")) {
      parent = "Stress Berat";
    } else {
      // Fallback berdasarkan nilai angka
      if (num >= 1.2 && num <= 1.4) {
        parent = "Stress Ringan";
      } else if (num > 1.4 && num <= 1.5) {
        parent = "Stress Ringan Sepsis";
      } else if (num > 1.5 && num <= 1.6) {
        parent = "Stress Berat";
      } else if (num > 1.6 && num <= 1.7) {
        parent = "Stress Sangat Berat";
      }
    }

    return { parent, slider: num };
  }

  // Fallback untuk catatan lama yang disimpan berupa teks murni
  if (cleaned === "tidak ada" || cleaned === "normal" || cleaned === "tidak ada stress") {
    return { parent: "Tidak ada stress", slider: 1.1 };
  }
  if (cleaned === "ringan" || cleaned === "stress ringan") {
    return { parent: "Stress Ringan", slider: 1.3 };
  }
  if (cleaned === "ringan sepsis" || cleaned === "stress ringan sepsis") {
    return { parent: "Stress Ringan Sepsis", slider: 1.5 };
  }
  if (cleaned === "berat" || cleaned === "stress berat") {
    return { parent: "Stress Berat", slider: 1.6 };
  }
  if (cleaned === "sangat berat" || cleaned === "stress sangat berat") {
    return { parent: "Stress Sangat Berat", slider: 1.7 };
  }

  return { parent: val, slider: 1.1 };
};

export const initialAssessmentData = {
  nama: "",
  noRM: "",
  umur: "",
  jenisKelamin: "L",
  bb: "",
  tb: "",
  isEstimasi: false,
  lila: "",
  ulna: "",
  bbEstimasi: "",
  tbEstimasi: "",
  persenLila: "",
  originalBb: "",
  originalTb: "",
  penyakit: [],
  penyakitLainnya: "",
  aktivitasFisik: "",
  faktorStress: "",
  faktorStressSlider: 1.1,
  metodePerhitungan: "Mifflin St Jeor",
  hemodialisa: "",
  penambahanKalori: [],
  tanggal_masuk: "",
  diagnosis: "",
  originalDiagnosis: "",
  isDiagnosisEdited: false,
};
