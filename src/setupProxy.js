// Development proxy for the local prediction service.
const http = require("http");
module.exports = function (app) {
  app.use("/prediction-api", (req, res) => {
    const upstream = http.request({
      hostname: "127.0.0.1", port: 8000, path: req.url, method: req.method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    }, (response) => {
      res.status(response.statusCode);
      res.setHeader("Content-Type", response.headers["content-type"] || "application/json");
      response.pipe(res);
    });
    upstream.setTimeout(65000, () => upstream.destroy(new Error("Prediction timeout")));
    upstream.on("error", () => {
      if (!res.headersSent) res.status(502).json({ message: "Layanan prediksi belum dapat diakses. Pastikan server AI berjalan." });
      else res.end();
    });
    res.on("close", () => upstream.destroy());
    req.pipe(upstream);
  });
};
