const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : null;
};

const roundGram = (value) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  return Math.round(value).toLocaleString("id-ID");
};

const getMacroPercent = (item, key) => {
  return toNumber(item?.makronutrien?.[`${key}_persen`] ?? item?.[`${key}_persen`]);
};

export const getEnergiTotal = (item) => {
  return toNumber(
    item?.total_energi ??
      item?.energi ??
      item?.energi_kkal ??
      item?.kebutuhan_energi_total
  );
};

export const getMakronutrienGram = (item, key) => {
  const directGram = toNumber(
    item?.[`${key}_gram`] ??
      item?.[`${key}_gr`] ??
      item?.makronutrien?.[`${key}_gram`] ??
      item?.makronutrien?.[`${key}_gr`] ??
      item?.makronutrien?.[key]
  );

  if (directGram !== null) {
    return directGram;
  }

  const percent = getMacroPercent(item, key);
  const energy = getEnergiTotal(item);

  if (percent === null || energy === null) {
    return null;
  }

  const divisor = key === "lemak" ? 9 : 4;
  return (energy * percent) / 100 / divisor;
};

export const formatMakronutrienGram = (item, key) => {
  const value = getMakronutrienGram(item, key);
  if (value === null) return "-";

  return `${roundGram(value)} g`;
};

export const hasMakronutrienData = (item) => {
  return ["protein", "lemak", "karbohidrat"].some(
    (key) => getMakronutrienGram(item, key) !== null
  );
};
