export const PAGE_SIZE = 10;

export const getPatientKey = (item) => (
  item?.no_rm ||
  item?.no_rawat ||
  item?.id_pasien ||
  item?.nama_pasien ||
  item?.id_perhitungan
);

export const getRiwayatDate = (item) => (
  item?.tanggal_perhitungan ||
  item?.created_at ||
  item?.updated_at ||
  item?.tanggal
);

export const normalizeText = (value) => String(value || "").toLowerCase();

export const normalizeComparable = (value) => (
  normalizeText(value)
    .replace(/\s+/g, " ")
    .trim()
);

export const diseaseKeywords = {
  dm: ["dm", "diabetes", "diabetes mellitus", "diabetes melitus"],
  ckd: ["ckd", "ginjal"],
  chf: ["chf", "jantung"],
  stroke: ["stroke"],
  lambung: ["lambung", "dispepsia", "dyspepsia"],
  mifflin: ["mifflin"],
  critical_ill: ["critical ill", "critical_ill", "icu"],
};

export const getItemSearchText = (item) => normalizeText([
  item?.nama_pasien,
  item?.no_rm,
  item?.kode_penyakit,
  item?.diagnosa_penyakit_saat_dihitung,
  item?.penyakit,
  item?.metode_perhitungan,
  item?.jenis_perhitungan,
  item?.ruang_bangsal,
  item?.ruangan,
  item?.created_by,
].filter(Boolean).join(" "));

export const getRoomName = (item) => (
  item?.ruang_bangsal ||
  item?.ruangan ||
  item?.nama_ruangan ||
  item?.bangsal ||
  ""
);

export const bulanIndoMap = {
  januari: "01", jan: "01",
  februari: "02", feb: "02",
  maret: "03", mar: "03",
  april: "04", apr: "04",
  mei: "05",
  juni: "06", jun: "06",
  juli: "07", jul: "07",
  agustus: "08", agu: "08", ags: "08",
  september: "09", sep: "09",
  oktober: "10", okt: "10",
  november: "11", nov: "11",
  desember: "12", des: "12",
};

export const parseDateOnly = (value) => {
  if (!value) return "";
  const str = String(value).trim();

  const isoMatch = str.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const indoMatch = str.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (indoMatch) {
    const day = String(indoMatch[1]).padStart(2, "0");
    const monthStr = indoMatch[2].toLowerCase();
    const month = bulanIndoMap[monthStr] || "01";
    const year = indoMatch[3];
    return `${year}-${month}-${day}`;
  }

  const date = new Date(str);
  if (!Number.isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
};

export const isDateInRange = (value, startDate, endDate) => {
  const itemDate = parseDateOnly(value);
  if (!itemDate) return false;
  if (startDate && itemDate < startDate) return false;
  if (endDate && itemDate > endDate) return false;
  return true;
};

export const matchesUserFilter = (item, filterValue) => {
  if (!filterValue || filterValue === "all") return true;

  let targetId = "";
  let targetName = "";

  if (String(filterValue).startsWith("user|")) {
    const [, id = "", name = ""] = String(filterValue).split("|");
    targetId = normalizeText(id);
    targetName = normalizeText(name);
  }

  const createdById = normalizeText(item?.id_user || item?.user_id || item?.id_petugas || item?.created_by_id);
  const createdByName = normalizeText(item?.created_by || item?.nama_user || item?.nama_petugas);

  if (targetId && createdById) {
    if (createdById === targetId) return true;
  }

  if (targetName && createdByName) {
    return createdByName.includes(targetName) || targetName.includes(createdByName);
  }

  return false;
};
