// Development proxy for the local prediction service.
const http = require("http");
const https = require("https");
module.exports = function (app) {
  if (!process.env.AI_API_URL) {
    throw new Error("AI_API_URL belum dikonfigurasi di .env frontend.");
  }
  const target = new URL(process.env.AI_API_URL);
  if (!["http:", "https:"].includes(target.protocol)) {
    throw new Error("AI_API_URL harus menggunakan http:// atau https://.");
  }
  const transport = target.protocol === "https:" ? https : http;
  app.use("/prediction-api", (req, res) => {
    const upstream = transport.request({
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || undefined,
      path: `${target.pathname.replace(/\/$/, "")}${req.url}`,
      method: req.method,
      headers: {
        "Content-Type": "application/json", Accept: "application/json",
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
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
