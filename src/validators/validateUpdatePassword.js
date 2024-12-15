import Joi from "joi";

export const updatePasswordSchema = Joi.object({
  userId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "El ID del usuario debe ser un UUID válido",
      "any.required": "El ID del usuario es requerido",
    }),
  oldPassword: Joi.string()
    .min(10)
    .max(16)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "La nueva contraseña debe contener al menos una letra y un número",
      "string.min": "La contraseña actual debe tener al menos 6 caracteres",
      "string.max": "La contraseña actual no puede exceder los 16 caracteres",
      "any.required": "La contraseña actual es requerida",
    }),
  newPassword: Joi.string()
    .min(10)
    .max(16)
    .required()
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
    .messages({
      "string.pattern.base":
        "La nueva contraseña debe contener al menos una letra y un número",
      "string.min": "La nueva contraseña debe tener al menos 6 caracteres",
      "string.max": "La nueva contraseña no puede exceder los 16 caracteres",
      "any.required": "La nueva contraseña es requerida",
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
      "any.required": "Es obligatorio repetir la contraseña"
    }),
});
