// Middleware de validación con Joi
// Uso: const validateJson = require("../middlewares/validation.middleware");
// router.post("/ruta", isJsonRequestValid, validateJson(schema), controller.accion)

module.exports = (schema) => {
  return (req, res, next) => {
    if (!schema) return next(); // por si olvidan pasar schema

    // Validamos body (y permitimos unknown por si vienen campos extra)
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      allowUnknown: true,
      stripUnknown: false,
    });

    if (error) {
      // Mensaje amable del primer detalle
      const msg = error.details?.[0]?.message || "Datos inválidos";
      return res.status(400).json({ error: msg });
    }

    req.body = value;
    next();
  };
};
