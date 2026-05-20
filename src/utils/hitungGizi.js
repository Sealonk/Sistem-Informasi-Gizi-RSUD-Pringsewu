export function hitungStatusGizi(bb, tb) {
  const tinggiM = tb > 0 ? tb / 100 : 0;
  const nilaiImt = tinggiM > 0 ? bb / (tinggiM * tinggiM) : 0;
  const imt = nilaiImt > 0 ? nilaiImt.toFixed(2) : "0.00";
  let status = "-";

  if (nilaiImt > 0 && nilaiImt < 18.5) {
    status = "Kurang Gizi";
  } else if (nilaiImt >= 18.5 && nilaiImt <= 25) {
    status = "Normal";
  } else if (nilaiImt > 25) {
    status = "Obesitas";
  }

  return { imt, status };
}

const faktorAktivitasMap = {
  ringan: 1.2,
  sedang: 1.3,
  berat: 1.5,
};

const faktorStressMap = {
  ringan: 1.2,
  sedang: 1.3,
  berat: 1.5,
};

export function hitungBMR(data) {
  const bb = Number(data.bb) || 0;
  const tb = Number(data.tb) || 0;
  const umur = Number(data.umur) || 0;
  const jenisKelamin = data.jenisKelamin || "";

  if (!bb || !tb || !umur) return 0;

  if (jenisKelamin.toLowerCase() === "l" || jenisKelamin.toLowerCase() === "laki-laki") {
    return Math.round((10 * bb) + (6.25 * tb) - (5 * umur) + 5);
  }

  if (jenisKelamin.toLowerCase() === "p" || jenisKelamin.toLowerCase() === "perempuan") {
    return Math.round((10 * bb) + (6.25 * tb) - (5 * umur) - 161);
  }

  return Math.round((10 * bb) + (6.25 * tb) - (5 * umur));
}

export function hitungEnergi(data) {
  const bmr = hitungBMR(data);
  const faktorAktivitas = faktorAktivitasMap[data.aktivitas] || 1.2;
  const faktorStress = faktorStressMap[data.stress] || 1.0;
  const tambahanKalori = Number(data.kalori) || 0;

  if (!bmr) return 0;

  return Math.round(bmr * faktorAktivitas * faktorStress + tambahanKalori);
}

export function hitungMakro(data, energi) {
  const bb = Number(data.bb) || 0;
  const proteinGram = bb ? Math.round(bb * 1.0) : 0;
  const kaloriProtein = proteinGram * 4;
  const kaloriLemak = energi * 0.25;
  const lemakGram = energi ? Math.round(kaloriLemak / 9) : 0;
  const karboGram = energi ? Math.round((energi - kaloriProtein - kaloriLemak) / 4) : 0;

  return {
    protein: Math.max(proteinGram, 0),
    lemak: Math.max(lemakGram, 0),
    karbo: Math.max(karboGram, 0),
  };
}
