import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs">
        <p className="font-semibold mb-1">Tanggal {payload[0].payload.tanggal}</p>
        <p className="text-violet-300">
          Prediksi: <span className="font-bold text-sm text-white">{payload[0].value}</span> pasien
        </p>
      </div>
    );
  }
  return null;
};

export default function PrediksiChart({ data }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-[380px]">
      <div>
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Grafik Prediksi Pasien Harian
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Fluktuasi jumlah pasien per hari sepanjang bulan yang dipilih
        </p>
      </div>

      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="tanggal"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="jumlah"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#8b5cf6", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
