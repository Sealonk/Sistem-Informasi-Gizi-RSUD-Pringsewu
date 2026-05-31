import React from "react";

export default function FilterCard({
  periode,
  setPeriode,
  selectedDate,
  setSelectedDate,
  search,
  setSearch,
  error,
  onReset,
  onSearch,
}) {

  return (

    <div className="bg-white rounded-[18px] border border-blue-100 shadow-soft p-6 mb-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        <div>

          <div className="text-sm text-slate-500 mb-3">

            1. Periode Data

          </div>

          <div className="flex flex-wrap gap-2 items-center">

            <button
              className={`h-10 px-4 rounded-lg border ${
                periode === ""
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-100"
              }`}
              onClick={() => setPeriode("")}
            >
              Semua
            </button>

            <button
              className={`h-10 px-4 rounded-lg border ${
                periode === "Hari Ini"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-100"
              }`}
              onClick={() => setPeriode("Hari Ini")}
            >
              Hari Ini
            </button>

            <button
              className={`h-10 px-4 rounded-lg border ${
                periode === "Minggu Ini"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-100"
              }`}
              onClick={() => setPeriode("Minggu Ini")}
            >
              Minggu Ini
            </button>

            <button
              className={`h-10 px-4 rounded-lg border ${
                periode === "Bulan Ini"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-100"
              }`}
              onClick={() => setPeriode("Bulan Ini")}
            >
              Bulan Ini
            </button>

            <button
              className={`h-10 px-4 rounded-lg border ${
                periode === "Custom"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-100"
              }`}
              onClick={() => setPeriode("Custom")}
            >
              Custom
            </button>

          </div>

          <div className="mt-3">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              disabled={periode !== "Custom"}
              className={`h-10 rounded-lg border px-3 text-sm w-full ${
                periode !== "Custom"
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-slate-100 bg-white text-slate-900"
              }`}
            />

            {
              periode === "Custom" &&
              !selectedDate && (
                <p className="mt-2 text-sm text-rose-600">

                  Pilih tanggal untuk filter custom.

                </p>
              )
            }

          </div>

        </div>

        <div>

          <div className="flex items-center justify-between mb-3">

            <div className="text-sm text-slate-500">

              2. Cari Pasien

            </div>

            <button
              onClick={onReset}
              className="text-sm text-blue-600 hover:underline"
            >

              Reset Filter

            </button>

          </div>

          <div className="flex gap-2">

            <input
              type="text"
              placeholder="Cari berdasarkan Nama / No. RM"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-100 px-3 text-sm w-full"
            />

            <button
              onClick={onSearch}
              disabled={
                periode === "Custom" &&
                !selectedDate
              }
              className={`h-10 px-4 rounded-lg text-sm text-white ${
                periode === "Custom" &&
                !selectedDate
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >

              Cari

            </button>

          </div>

          {
            error && (
              <p className="mt-2 text-sm text-rose-600">

                {error}

              </p>
            )
          }

        </div>

      </div>

    </div>
  );
}