import Joi from "joi";

export const updatePasswordSchema = Joi.object({
  userId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "El ID del usuario debe ser un UUID válido",
      "any.required": "El ID del usuario es requerido",
    }),
  oldPassword: Joi.string().required().messages({
    "any.required": "La contraseña actual es requerida",
  }),
  newPassword: Joi.string().required().messages({
    "any.required": "La nueva contraseña es requerida",
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
      "any.required": "Es obligatorio repetir la contraseña",
    }),
});
