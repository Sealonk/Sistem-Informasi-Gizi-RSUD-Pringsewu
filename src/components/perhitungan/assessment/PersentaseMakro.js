import { useEffect, useRef } from "react";
import { Calculator, Lock, Unlock, RotateCcw, CheckCircle2, AlertCircle, Info } from "lucide-react";
import SectionCard from "../../common/SectionCard";
import { getDiseaseValues } from "./JenisPenyakit";

// Configuration for macronutrients by disease combination
export const MACRO_CONFIGS = {
  "dm": {
    name: "Diabetes Mellitus",
    type: "three-sliders",
    protein: { min: 10, max: 20, defaultVal: 15, label: "Protein" },
    lemak: { min: 20, max: 25, defaultVal: 20, label: "Lemak" },
    karbo: { min: 45, max: 65, defaultVal: 65, label: "Karbohidrat" },
  },
  "dm,stroke": {
    name: "DM + Stroke",
    type: "one-slider",
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: 1.2 x BBI (fase pemulihan)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "dm,lambung": {
    name: "DM + Lambung",
    type: "three-sliders",
    protein: { min: 10, max: 20, defaultVal: 20, label: "Protein" },
    lemak: { min: 10, max: 15, defaultVal: 15, label: "Lemak" },
    karbo: { min: 45, max: 65, defaultVal: 65, label: "Karbohidrat" },
  },
  "ckd,dm": {
    name: "DM + CKD",
    type: "one-slider",
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" }, // backend accepts 20-30%, we set range 20-25% as requested (default 25%)
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf,ckd,dm": {
    name: "DM + CKD + CHF",
    type: "one-slider",
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: Dihitung berdasarkan hemodialisa (HD/non-HD)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
  "chf,dm": {
    name: "DM + CHF",
    type: "three-sliders",
    protein: { min: 15, max: 20, defaultVal: 15, label: "Protein" },
    lemak: { min: 20, max: 25, defaultVal: 25, label: "Lemak" }, // default 25% to sum to 100%
    karbo: { min: 50, max: 60, defaultVal: 60, label: "Karbohidrat" },
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
    lemak: { min: 25, max: 30, defaultVal: 25, label: "Lemak" },
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
    protein: { min: 15, max: 25, defaultVal: 15, label: "Protein" },
    lemak: { min: 10, max: 15, defaultVal: 15, label: "Lemak" },
    karbo: { min: 60, max: 75, defaultVal: 70, label: "Karbohidrat" },
  },
  "lambung": {
    name: "Lambung",
    type: "three-sliders",
    protein: { min: 10, max: 20, defaultVal: 15, label: "Protein" },
    lemak: { min: 10, max: 15, defaultVal: 15, label: "Lemak" },
    karbo: { min: 65, max: 80, defaultVal: 70, label: "Karbohidrat" },
  },
  "stroke": {
    name: "Stroke",
    type: "one-slider",
    lemak: { min: 25, max: 35, defaultVal: 25, label: "Lemak" },
    proteinLockedLabel: "Locked: 1.2 x BBI (fase pemulihan)",
    karboLockedLabel: "Sisa dari protein + lemak",
  },
};

// Check if a combination is in the excluded (LEWATIN) list
export function isExcludedCombination(penyakitArray) {
  const diseaseValues = getDiseaseValues(penyakitArray);
  const sorted = [...diseaseValues].sort().join(",");
  return ["chf,stroke", "ckd,lambung", "chf,ckd"].includes(sorted);
}

export default function MetodePerhitungan({ data, setData, errors, showErrors }) {
  const penyakitOnly = getDiseaseValues(data.penyakit);
  const sortedPenyakit = [...penyakitOnly].sort();
  const key = sortedPenyakit.join(",");
  const config = MACRO_CONFIGS[key];
  const isExcluded = isExcludedCombination(data.penyakit);

  const prevKeyRef = useRef(null);

  // Dynamic initialization / reset of slider values when disease changes
  useEffect(() => {
    const isInitialLoad = prevKeyRef.current === null;
    const diseaseChanged = prevKeyRef.current !== key;

    if (diseaseChanged) {
      const needsInit = isInitialLoad && (
        (config?.type === "three-sliders" && (data.persen_protein === undefined || data.persen_lemak === undefined || data.persen_karbohidrat === undefined)) ||
        (config?.type === "one-slider" && data.persen_lemak === undefined)
      );
      const needsReset = !isInitialLoad && diseaseChanged;

      if (needsInit || needsReset) {
        if (config) {
          if (config.type === "three-sliders") {
            setData(prev => ({
              ...prev,
              persen_protein: config.protein.defaultVal,
              persen_lemak: config.lemak.defaultVal,
              persen_karbohidrat: config.karbo.defaultVal,
            }));
          } else if (config.type === "one-slider") {
            setData(prev => ({
              ...prev,
              persen_protein: undefined,
              persen_lemak: config.lemak.defaultVal,
              persen_karbohidrat: undefined,
            }));
          }
        } else {
          setData(prev => ({
            ...prev,
            persen_protein: undefined,
            persen_lemak: undefined,
            persen_karbohidrat: undefined,
          }));
        }
      }
      prevKeyRef.current = key;
    }
  }, [key, config, setData, data.persen_protein, data.persen_lemak, data.persen_karbohidrat]);

  // Handle resets to defaults
  const handleResetToDefault = () => {
    if (!config) return;
    if (config.type === "three-sliders") {
      setData(prev => ({
        ...prev,
        persen_protein: config.protein.defaultVal,
        persen_lemak: config.lemak.defaultVal,
        persen_karbohidrat: config.karbo.defaultVal,
      }));
    } else if (config.type === "one-slider") {
      setData(prev => ({
        ...prev,
        persen_protein: undefined,
        persen_lemak: config.lemak.defaultVal,
        persen_karbohidrat: undefined,
      }));
    }
  };

  const handleSliderChange = (field, val) => {
    setData(prev => ({
      ...prev,
      [field]: Number(val),
    }));
  };

  // Determine current active values
  const hasSliders = config && !isExcluded;
  const pVal = hasSliders && config.type === "three-sliders" ? (data.persen_protein ?? config.protein.defaultVal) : 0;
  const lVal = hasSliders ? (data.persen_lemak ?? config.lemak.defaultVal) : 0;
  const kVal = hasSliders && config.type === "three-sliders" ? (data.persen_karbohidrat ?? config.karbo.defaultVal) : 0;
  const total = pVal + lVal + kVal;

  const isDifferentFromDefault = config && (
    (config.type === "three-sliders" && (
      pVal !== config.protein.defaultVal ||
      lVal !== config.lemak.defaultVal ||
      kVal !== config.karbo.defaultVal
    )) ||
    (config.type === "one-slider" && lVal !== config.lemak.defaultVal)
  );

  return (
    <SectionCard
      compact={true}
      title="Metode Perhitungan & Makronutrien"
      subtitle={hasSliders ? `Sesuaikan persentase gizi medis untuk komplikasi ${config.name}` : "Metode kebutuhan energi yang digunakan sistem"}
      icon={<Calculator size={20} />}
      theme="emerald"
    >
      <div className="space-y-4">
        {/* CASE 1: Excluded Combination (LEWATIN) */}
        {isExcluded && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
            <div className="flex gap-2.5 items-start">
              <Info size={18} className="text-emerald-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 mb-1">
                  Mifflin St Jeor (Default Terkunci)
                </h3>
                <p className="text-sm leading-relaxed text-emerald-700">
                  Untuk kombinasi penyakit ini, kebutuhan gizi makronutrien akan dihitung secara default oleh sistem gizi klinis. Slider dinonaktifkan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: No disease or Mifflin */}
        {!config && !isExcluded && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
            <h3 className="text-sm font-semibold text-emerald-800 mb-2">
              Mifflin St Jeor
            </h3>
            <p className="text-sm leading-relaxed text-emerald-700">
              Sistem menggunakan metode Mifflin St Jeor untuk menghitung kebutuhan energi dan makronutrien pasien (Protein: 15%, Lemak: 20%, Karbohidrat: 65%).
            </p>
          </div>
        )}

        {/* CASE 3: Has Sliders */}
        {hasSliders && (
          <div className="space-y-5">
            {/* Visual stacked progress bar breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500 px-1">
                <span>Visualisasi Distribusi Energi</span>
                {config.type === "three-sliders" && (
                  <span className={total === 100 ? "text-emerald-600" : "text-amber-600"}>
                    Total: {total}%
                  </span>
                )}
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden transition-all duration-300">
                {config.type === "three-sliders" ? (
                  <>
                    <div style={{ width: `${pVal}%` }} className="bg-indigo-500 transition-all duration-300" title={`Protein: ${pVal}%`} />
                    <div style={{ width: `${lVal}%` }} className="bg-amber-500 transition-all duration-300" title={`Lemak: ${lVal}%`} />
                    <div style={{ width: `${kVal}%` }} className="bg-emerald-500 transition-all duration-300" title={`Karbohidrat: ${kVal}%`} />
                  </>
                ) : (
                  <>
                    <div style={{ width: `${lVal}%` }} className="bg-amber-500 transition-all duration-300" title={`Lemak: ${lVal}%`} />
                    <div style={{ width: `${100 - lVal}%` }} className="bg-slate-300 transition-all duration-300" title="Protein & Karbohidrat (Dihitung Sistem)" />
                  </>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-slate-600 px-1 pt-1">
                {config.type === "three-sliders" ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      <span>Protein ({pVal}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Lemak ({lVal}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Karbohidrat ({kVal}%)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Lemak ({lVal}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span>Protein & Karbo ({100 - lVal}% - Dihitung Otomatis)</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sliders Container */}
            <div className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-white/50 backdrop-blur-sm shadow-inner">
              {/* PROTEIN SLIDER OR LOCKED */}
              {config.type === "three-sliders" ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Unlock size={14} className="text-slate-400" />
                      Protein
                    </span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs">
                      {pVal}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={config.protein.min}
                    max={config.protein.max}
                    value={pVal}
                    onChange={(e) => handleSliderChange("persen_protein", e.target.value)}
                    className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Rentang: {config.protein.min}% - {config.protein.max}%</span>
                    <span>Default: {config.protein.defaultVal}%</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-600">Protein</div>
                      <div className="text-[10px] text-slate-400">{config.proteinLockedLabel}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Otomatis
                  </span>
                </div>
              )}

              {/* LEMAK SLIDER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Unlock size={14} className="text-slate-400" />
                    Lemak
                  </span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                    {lVal}%
                  </span>
                </div>
                <input
                  type="range"
                  min={config.lemak.min}
                  max={config.lemak.max}
                  value={lVal}
                  onChange={(e) => handleSliderChange("persen_lemak", e.target.value)}
                  className="w-full h-1.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Rentang: {config.lemak.min}% - {config.lemak.max}%</span>
                  <span>Default: {config.lemak.defaultVal}%</span>
                </div>
              </div>

              {/* KARBOHIDRAT SLIDER OR LOCKED */}
              {config.type === "three-sliders" ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Unlock size={14} className="text-slate-400" />
                      Karbohidrat
                    </span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                      {kVal}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={config.karbo.min}
                    max={config.karbo.max}
                    value={kVal}
                    onChange={(e) => handleSliderChange("persen_karbohidrat", e.target.value)}
                    className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Rentang: {config.karbo.min}% - {config.karbo.max}%</span>
                    <span>Default: {config.karbo.defaultVal}%</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-600">Karbohidrat</div>
                      <div className="text-[10px] text-slate-400">{config.karboLockedLabel}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Sisa
                  </span>
                </div>
              )}
            </div>

            {/* Validation & Helper actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-slate-100">
              <div>
                {config.type === "three-sliders" && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {total === 100 ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Total 100% tepat.
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertCircle size={14} /> Total {total}% (harus 100%).
                      </span>
                    )}
                  </div>
                )}
                {/* Specific form errors (if sum != 100) */}
                {errors.makronutrien && showErrors && (
                  <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.makronutrien}
                  </p>
                )}
              </div>

              {isDifferentFromDefault && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Reset ke Default
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}