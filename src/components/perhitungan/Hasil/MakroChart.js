import { BarChart3, GlassWater, AlertTriangle } from "lucide-react";

export default function MakroChart({ hasil, persen, data }) {
  const formatNumber = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return "0";
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const isPersenChanged = (macroKey, currentPersen) => {
    if (!data?.originalValues) return false;
    const originalPersen = data.originalValues[`persen_${macroKey}`];
    if (originalPersen === undefined) return false;
    return Math.round(Number(currentPersen)) !== Math.round(Number(originalPersen));
  };

  const renderChangedBadge = (macroKey, currentPersen) => {
    if (isPersenChanged(macroKey, currentPersen)) {
      return (
        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Diubah
        </span>
      );
    }
    return null;
  };

  // 1. MACRONUTRIENTS DATA
  const macroData = [
    {
      label: "Protein",
      value: hasil?.protein_gr ?? hasil?.protein_gram ?? 0,
      persen: persen?.protein ?? hasil?.protein_persen ?? 0,
      color: "bg-blue-500",
      badge: renderChangedBadge("protein", persen?.protein ?? hasil?.protein_persen ?? 0),
    },
    {
      label: "Lemak",
      value: hasil?.lemak_gr ?? hasil?.lemak_gram ?? 0,
      persen: persen?.lemak ?? hasil?.lemak_persen ?? 0,
      color: "bg-yellow-500",
      badge: renderChangedBadge("lemak", persen?.lemak ?? hasil?.lemak_persen ?? 0),
    },
    {
      label: "Karbohidrat",
      value: hasil?.karbohidrat_gr ?? hasil?.karbohidrat_gram ?? 0,
      persen: persen?.karbohidrat ?? hasil?.karbohidrat_persen ?? 0,
      color: "bg-emerald-500",
      badge: renderChangedBadge("karbohidrat", persen?.karbohidrat ?? hasil?.karbohidrat_persen ?? 0),
    },
  ];

  const maxMacroValue = Math.max(...macroData.map((item) => item.value), 1);

  // 2. MICRONUTRIENTS DATA
  const microData = [];

  if (hasil?.natrium_mg !== undefined && hasil?.natrium_mg !== null && hasil?.natrium_mg > 0) {
    microData.push({
      label: "Natrium (Sodium)",
      value: hasil.natrium_mg,
      unit: "mg",
      badge: "Batas Asupan",
      color: "bg-amber-500",
    });
  }

  if (hasil?.kolesterol_mg !== undefined && hasil?.kolesterol_mg !== null && hasil?.kolesterol_mg > 0) {
    microData.push({
      label: "Kolesterol",
      value: hasil.kolesterol_mg,
      unit: "mg",
      badge: "Maks Harian",
      color: "bg-rose-500",
    });
  }

  if (hasil?.kalium_mg !== undefined && hasil?.kalium_mg !== null && hasil?.kalium_mg > 0) {
    microData.push({
      label: "Kalium (Potassium)",
      value: hasil.kalium_mg,
      unit: "mg",
      badge: "Target Ginjal",
      color: "bg-violet-500",
    });
  }

  if (hasil?.kalsium_mg !== undefined && hasil?.kalsium_mg !== null && hasil?.kalsium_mg > 0) {
    microData.push({
      label: "Kalsium (Calcium)",
      value: hasil.kalsium_mg,
      unit: "mg",
      badge: "Kebutuhan",
      color: "bg-cyan-500",
    });
  }

  if (hasil?.fosfor_mg !== undefined && hasil?.fosfor_mg !== null && hasil?.fosfor_mg > 0) {
    microData.push({
      label: "Fosfor (Phosphorus)",
      value: hasil.fosfor_mg,
      unit: "mg",
      badge: "Target Ginjal",
      color: "bg-indigo-500",
    });
  }

  const seratVal = hasil?.serat_gr ?? hasil?.serat_gram;
  if (seratVal !== undefined && seratVal !== null && seratVal > 0) {
    microData.push({
      label: "Kecukupan Serat",
      value: seratVal,
      unit: "g",
      badge: "Kecukupan",
      color: "bg-emerald-500",
    });
  }

  const kebutuhanCairan = hasil?.kebutuhan_cairan;
  const keteranganSerat = hasil?.keterangan_serat;
  const anjuranMakan = hasil?.anjuran_makan;
  const hasExtraInfo = kebutuhanCairan || keteranganSerat || anjuranMakan;
  const hasMicros = microData.length > 0;

  return (
    <div className="rounded-[24px] border border-blue-100 bg-white p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Grafik Kebutuhan Nutrisi</h3>
            <p className="text-sm text-slate-500">Distribusi kebutuhan makronutrien & mikronutrien harian pasien</p>
          </div>
        </div>

        {/* SECTION 1: MACRONUTRIENTS */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zat Gizi Makro</h4>
          <div className="space-y-4">
            {macroData.map((item) => {
              const width = (item.value / maxMacroValue) * 100;
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-slate-600">{item.label}</p>
                    <p className="font-semibold text-slate-900 flex items-center">
                      {formatNumber(item.value)} g
                      <span className="ml-2 text-slate-500 font-medium">({formatNumber(item.persen)}%)</span>
                      {item.badge}
                    </p>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: MICRONUTRIENTS (IF AVAILABLE) */}
        {hasMicros && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zat Gizi Mikro</h4>
            <div className="space-y-4">
              {microData.map((item) => {
                // Micronutrients don't share a single scale due to different magnitudes (e.g. 1500mg vs 20mg).
                // We display them with a clean 100% capacity tracker representing their target/limit.
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium text-slate-600">{item.label}</p>
                      <p className="font-semibold text-slate-900">
                        {formatNumber(item.value)}
                        <span className="text-xs font-medium text-slate-400 ml-1">{item.unit}</span>
                        <span className="ml-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                          {item.badge}
                        </span>
                      </p>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full opacity-80 ${item.color}`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: FLUIDS & GUIDELINES (IF AVAILABLE) */}
      {hasExtraInfo && (
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          {kebutuhanCairan && (
            <div className="flex items-center gap-3.5 rounded-2xl border border-blue-50 bg-blue-50/50 p-3.5 transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <GlassWater size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 mb-0.5">Rekomendasi Kebutuhan Cairan</p>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{kebutuhanCairan}</h4>
              </div>
            </div>
          )}

          {(keteranganSerat || anjuranMakan) && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <AlertTriangle size={14} className="text-amber-600" />
                <span>Panduan Diet Saluran Cerna</span>
              </div>
              <div className="text-[11px] leading-relaxed text-amber-900/90 space-y-1.5">
                {keteranganSerat && (
                  <p>
                    <strong className="text-amber-950">Serat: </strong> {keteranganSerat}
                  </p>
                )}
                {anjuranMakan && (
                  <p>
                    <strong className="text-amber-950">Anjuran: </strong> {anjuranMakan}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}