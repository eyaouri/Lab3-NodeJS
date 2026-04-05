export const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

export const validateEventInput = (req, res, next) => {
  const { title, date, location, capacity } = req.body;
  if (!title || !date || !location || !capacity)
    return res.status(400).json({
      success: false,
      message: "Champs requis manquants",
      required: ["title", "date", "location", "capacity"]
    });
  if (typeof title !== "string")
    return res.status(400).json({ success: false, message: "title doit être une string" });
  if (typeof capacity !== "number" || capacity < 1)
    return res.status(400).json({ success: false, message: "capacity doit être un nombre >= 1" });
  next();
};

export const measureTime = (req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`  ⏱ ${Date.now() - start}ms`);
    return originalJson.call(this, data);
  };
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur :", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Erreur serveur" });
};