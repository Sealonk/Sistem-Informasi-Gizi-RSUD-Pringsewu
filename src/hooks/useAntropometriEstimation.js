import { useEffect } from "react";

export default function useAntropometriEstimation(data, setData) {
  useEffect(() => {
    if (!data.isEstimasi) return;

    const lilaVal = parseFloat(data.lila);
    const ulnaVal = parseFloat(data.ulna);
    const jk = data.jenisKelamin;

    let tbEst = "";
    let bbEst = "";
    let persenLilaVal = "";

    // TB ESTIMASI ULNA
    if (!isNaN(ulnaVal) && ulnaVal > 0) {
      if (jk === "L") {
        tbEst = parseFloat(
          (97.252 + 2.645 * ulnaVal).toFixed(2)
        );
      } else {
        tbEst = parseFloat(
          (68.777 + 3.536 * ulnaVal).toFixed(2)
        );
      }
    }

    // PERSEN LILA
    if (!isNaN(lilaVal) && lilaVal > 0) {
      const standarLila = jk === "L" ? 29 : 28.5;
      persenLilaVal = parseFloat(
        ((lilaVal / standarLila) * 100).toFixed(2)
      );
    }

    // BB ESTIMASI LILA
    if (tbEst && lilaVal) {
      if (jk === "L") {
        bbEst = (lilaVal / 29) * (tbEst - 100);
      } else {
        bbEst = (lilaVal / 28.5) * (tbEst - 100);
      }
      bbEst = parseFloat(bbEst.toFixed(2));
    }

    setData((current) => {
      if (
        current.tbEstimasi === tbEst &&
        current.bbEstimasi === bbEst &&
        current.persenLila === persenLilaVal &&
        current.tb === tbEst &&
        current.bb === bbEst
      ) {
        return current;
      }

      return {
        ...current,
        tbEstimasi: tbEst,
        bbEstimasi: bbEst,
        persenLila: persenLilaVal,
        tb: tbEst,
        bb: bbEst,
      };
    });
  }, [data.isEstimasi, data.lila, data.ulna, data.jenisKelamin, setData]);
}
