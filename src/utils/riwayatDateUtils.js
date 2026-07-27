import { getMakronutrienGram } from "./makronutrien";

export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
    ...options,
  }).format(date);
};

export const parseIndonesianUtcDate = (indoStr) => {
  if (typeof indoStr !== "string") return null;
  const cleaned = indoStr.toLowerCase().trim();

  let datePart = "";
  let timePart = "";

  if (cleaned.includes(" pukul ")) {
    const parts = cleaned.split(" pukul ");
    datePart = parts[0];
    timePart = parts[1];
  } else if (cleaned.includes(" ")) {
    const lastSpaceIndex = cleaned.lastIndexOf(" ");
    datePart = cleaned.substring(0, lastSpaceIndex).trim();
    timePart = cleaned.substring(lastSpaceIndex + 1).trim();
  } else {
    return null;
  }

  const monthsMap = {
    januari: "January",
    februari: "February",
    maret: "March",
    april: "April",
    mei: "May",
    juni: "June",
    juli: "July",
    agustus: "August",
    september: "September",
    oktober: "October",
    november: "November",
    desember: "December"
  };

  const dateParts = datePart.split(" ");
  if (dateParts.length !== 3) return null;

  const day = dateParts[0];
  const monthIndo = dateParts[1];
  const year = dateParts[2];

  const monthEng = monthsMap[monthIndo];
  if (!monthEng) return null;

  const cleanedTimePart = timePart.replace(/\./g, ":");
  const utcString = `${monthEng} ${day}, ${year} ${cleanedTimePart} UTC`;
  const date = new Date(utcString);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const parseAsLocalDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;

  let str = String(dateStr).trim();

  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}[.:]\d{2}[.:]\d{2}/.test(str)) {
    str = str.replace(" ", "T");
    str = str.replace(/(Z|[+-]\d{2}:?\d{2})$/, "");
    
    const tIndex = str.indexOf("T");
    if (tIndex !== -1) {
      const datePart = str.substring(0, tIndex);
      let timePart = str.substring(tIndex + 1);
      
      const parts = timePart.split(".");
      parts[0] = parts[0].replace(/\./g, ":");
      timePart = parts.join(".");
      
      str = `${datePart}T${timePart}`;
    }
    
    if (!str.includes(".")) {
      str += ".000";
    }
    str += "Z";

    const parsed = new Date(str);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const parsedIndo = parseIndonesianUtcDate(str);
  if (parsedIndo) return parsedIndo;

  const cleanedFallback = str.replace(/\./g, ":");
  const parsedFallback = new Date(cleanedFallback);
  return Number.isNaN(parsedFallback.getTime()) ? null : parsedFallback;
};

export const formatTime = (dateStr) => {
  if (!dateStr) return "-";
  const localDate = parseAsLocalDate(dateStr);
  if (!localDate) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date);
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(localDate);
};

export const splitDateTime = (dateStr) => {
  if (!dateStr) return { date: "-", time: "-" };

  const localDate = parseAsLocalDate(dateStr);
  if (localDate) {
    const formattedD = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(localDate);
    const formattedT = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(localDate);
    return { date: formattedD, time: formattedT };
  }

  if (typeof dateStr === "string" && dateStr.includes(" pukul ")) {
    const parts = dateStr.split(" pukul ");
    return { date: parts[0], time: parts[1] };
  }

  return { date: dateStr, time: "-" };
};

export const numberWithUnit = (value, unit) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${number.toLocaleString("id-ID")} ${unit}`;
};

export const formatMacroWithDecimal = (item, key) => {
  const val = getMakronutrienGram(item, key);
  if (val === null || val === undefined || !Number.isFinite(val)) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(val);
};
