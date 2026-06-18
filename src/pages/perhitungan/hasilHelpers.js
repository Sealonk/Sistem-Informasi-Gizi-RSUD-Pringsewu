export const mapAktivitasFisikToBackend = (aktivitas, isDM) => {
  if (!aktivitas) return null;

  if (isDM) {
    const dmMap = {
      Istirahat: "Bed rest",
      Ringan: "Ringan",
      Sedang: "Sedang",
      Berat: "Berat",
      "Sangat berat": "Sangat Berat",
    };
    return dmMap[aktivitas] || aktivitas;
  }

  const nonDmMap = {
    "Berbaring di tempat tidur": "Bed rest",
    "Dapat turun dari tempat tidur": "Ringan",
    "Kerja banyak duduk / sedikit atau tidak olahraga": "Sedang",
    "Kerja banyak berdiri / olahraga 4-5 kali per minggu": "Berat",
    "Pekerjaan berat / olahraga sangat aktif": "Sangat Berat",
  };
  return nonDmMap[aktivitas] || aktivitas;
};

export const mapFaktorStressToBackend = (stress, sliderVal, isDM) => {
  if (!stress) return "Normal";

  if (isDM) {
    return stress;
  }

  const num = parseFloat(sliderVal || 1.1);
  return `${num.toFixed(2)} (${stress})`;
};

export const prepareSavePayload = (data, hasil) => {
  const dataSimpan = hasil?.data?.data_simpan || {};

  const penyakitOnly = (data?.penyakit || []).filter(
    (item) => !["critical_ill", "mifflin"].includes(item)
  );
  const isDM = penyakitOnly.includes("dm");
  const isStrokeOnly = penyakitOnly.length === 1 && penyakitOnly.includes("stroke");

  const mappedAktivitas = isStrokeOnly
    ? null
    : mapAktivitasFisikToBackend(data?.aktivitasFisik, isDM);
  const mappedStress = isStrokeOnly
    ? null
    : mapFaktorStressToBackend(data?.faktorStress, data?.faktorStressSlider, isDM);

  return {
    id_pasien: data?.id_pasien,
    diagnosa_penyakit:
      data?.penyakit?.map((item) => {
        if (item === "dm") return "DM";
        if (item === "ckd") return "CKD";
        if (item === "chf") return "CHF";
        if (item === "stroke") return "Stroke";
        if (item === "lambung") return "Lambung";
        if (item === "mifflin") return "Mifflin";
        if (item === "critical_ill") return "Critical Ill";
        return item;
      }) || [],
    penyakit_lainnya: data?.penyakitLainnya || null,
    jenis_kelamin: data?.jenisKelamin,
    umur: Number(data?.umur),
    berat_badan: Number(data?.bb),
    tinggi_badan: Number(data?.tb),
    ruang_bangsal: data?.ruangan || null,
    is_estimasi: data?.isEstimasi || false,
    lila_cm: data?.lila ? Number(data?.lila) : null,
    ulna_cm: data?.ulna ? Number(data?.ulna) : null,
    persen_lila: data?.isEstimasi && data?.persenLila ? Number(data?.persenLila) : null,

    aktivitas_fisik: mappedAktivitas,
    faktor_stres: mappedStress,
    kategori_penambahan_energi: data?.penambahanKalori?.join(", ") || "Tidak ada",
    status_hemodialisa: data?.hemodialisa === "Ya" ? "Iya" : (data?.hemodialisa || "Tidak"),
    metode_perhitungan: data?.metodePerhitungan,

    berat_badan_ideal: dataSimpan.berat_badan_ideal || 0,
    bmr: dataSimpan.bmr || 0,
    faktor_aktivitas_nilai: dataSimpan.faktor_aktivitas_nilai || 0,
    faktor_stres_nilai: dataSimpan.faktor_stres_nilai || 0,
    penambahan_kalori: dataSimpan.penambahan_kalori || 0,
    kebutuhan_energi_total: dataSimpan.kebutuhan_energi_total || 0,

    protein_persen: dataSimpan.protein_persen || 0,
    lemak_persen: dataSimpan.lemak_persen || 0,
    karbohidrat_persen: dataSimpan.karbohidrat_persen || 0,
    protein_gram: dataSimpan.protein_gram || 0,
    lemak_gram: dataSimpan.lemak_gram || 0,
    karbohidrat_gram: dataSimpan.karbohidrat_gram || 0,

    input_persen_protein: dataSimpan.protein_persen || 0,
    input_persen_lemak: dataSimpan.lemak_persen || 0,
    input_persen_karbo: dataSimpan.karbohidrat_persen || 0,
  };
};
