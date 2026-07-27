import { useEffect, useRef } from "react";
import { Calculator, Lock, Unlock, RotateCcw, CheckCircle2, AlertCircle, Info } from "lucide-react";
import SectionCard from "../../common/SectionCard";
import { getDiseaseValues } from "./JenisPenyakit";

import {
  MACRO_CONFIGS,
  getSisaKarbohidrat,
  isExcludedCombination,
} from "../../../constants/macroConfigs";

export { MACRO_CONFIGS, getSisaKarbohidrat, isExcludedCombination };

export default function MetodePerhitungan({ data, setData, errors, showErrors }) {
  const penyakitOnly = getDiseaseValues(data.penyakit);
  const sortedPenyakit = [...penyakitOnly].sort();
  const key = sortedPenyakit.join(",");
  const isExcluded = isExcludedCombination(data.penyakit);
  const rawConfig = MACRO_CONFIGS[key];
  
  // Clone config to allow dynamic changes
  const config = rawConfig ? { ...rawConfig } : null;


  // Clamp persen_lemak when config min/max changes dynamically (e.g. switching HD status)
  useEffect(() => {
    if (config && config.lemak) {
      const min = config.lemak.min;
      const max = config.lemak.max;
      if (data.persen_lemak !== undefined && (data.persen_lemak < min || data.persen_lemak > max)) {
        const clamped = Math.max(min, Math.min(max, data.persen_lemak));
        setData(prev => ({
          ...prev,
          persen_lemak: clamped
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.lemak?.min, config?.lemak?.max, data.persen_lemak, setData]);

  const prevKeyRef = useRef(null);

  // Dynamic initialization / reset of slider values when disease changes
  useEffect(() => {
    const isInitialLoad = prevKeyRef.current === null;
    const diseaseChanged = prevKeyRef.current !== key;

    if (diseaseChanged) {
      const needsInit = isInitialLoad && (
        (config?.type === "three-sliders" && (data.persen_protein === undefined || data.persen_lemak === undefined)) ||
        (config?.type === "one-slider" && data.persen_lemak === undefined)
      );
      const needsReset = !isInitialLoad && diseaseChanged;

      if (needsInit || needsReset) {
        if (config) {
          if (config.type === "three-sliders") {
            const defaultKarbo = getSisaKarbohidrat(
              config.protein.defaultVal,
              config.lemak.defaultVal
            );
            setData(prev => ({
              ...prev,
              persen_protein: config.protein.defaultVal,
              persen_lemak: config.lemak.defaultVal,
              persen_karbohidrat: defaultKarbo,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rawConfig, setData, data.persen_protein, data.persen_lemak, data.persen_karbohidrat]);

  useEffect(() => {
    if (!config || config.type !== "three-sliders") return;

    const pVal = data.persen_protein ?? config.protein.defaultVal;
    const lVal = data.persen_lemak ?? config.lemak.defaultVal;
    const nextKarbo = getSisaKarbohidrat(pVal, lVal);

    if (data.persen_karbohidrat !== nextKarbo) {
      setData(prev => ({
        ...prev,
        persen_karbohidrat: nextKarbo,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config?.type,
    config?.protein?.defaultVal,
    config?.lemak?.defaultVal,
    data.persen_protein,
    data.persen_lemak,
    data.persen_karbohidrat,
    setData,
  ]);

  // Handle resets to defaults
  const handleResetToDefault = () => {
    if (!config) return;
    if (config.type === "three-sliders") {
      const defaultKarbo = getSisaKarbohidrat(
        config.protein.defaultVal,
        config.lemak.defaultVal
      );
      setData(prev => ({
        ...prev,
        persen_protein: config.protein.defaultVal,
        persen_lemak: config.lemak.defaultVal,
        persen_karbohidrat: defaultKarbo,
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
  const kVal = hasSliders && config.type === "three-sliders" ? getSisaKarbohidrat(pVal, lVal) : 0;
  const total = pVal + lVal + kVal;

  const isDifferentFromDefault = config && (
    (config.type === "three-sliders" && (
      pVal !== config.protein.defaultVal ||
      lVal !== config.lemak.defaultVal ||
      kVal !== getSisaKarbohidrat(config.protein.defaultVal, config.lemak.defaultVal)
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
                  <span className="text-emerald-600">
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

              {/* KARBOHIDRAT AUTOMATIC REMAINDER */}
              {config.type === "three-sliders" ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-800">
                        Karbohidrat
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        Otomatis dari sisa 100% setelah protein dan lemak
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 bg-white/80 px-3 py-1 rounded-full">
                    {kVal}%
                  </span>
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
                    {kVal >= config.karbo.min && kVal <= config.karbo.max ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Karbohidrat otomatis {kVal}%.
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertCircle size={14} /> Karbohidrat {kVal}% di luar rentang {config.karbo.min}% - {config.karbo.max}%.
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
