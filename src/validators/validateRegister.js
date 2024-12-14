import Joi from "joi";
import RutValidator from "./validateRut.js";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder los 50 caracteres",
  }),
  firstLastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "El primer apellido es obligatorio",
    "string.min": "El primer apellido debe tener al menos 3 caracteres",
    "string.max": "El primer apellido no puede exceder los 30 caracteres",
  }),
  secondLastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "El segundo apellido es obligatorio",
    "string.min": "El segundo apellido debe tener al menos 3 caracteres",
    "string.max": "El segundo apellido no puede exceder los 30 caracteres",
  }),
  rut: RutValidator.required().messages({
    "string.empty": "El RUT es obligatorio",
  }),
  email: Joi.string()
    .email()
    .pattern(/@ucn\.cl$/)
    .required()
    .messages({
      "string.empty": "El correo electrónico es obligatorio",
      "string.email": "El formato del correo electrónico es inválido",
      "string.pattern.base":
        "El correo electrónico debe ser de la Universidad Católica del Norte (@ucn.cl)",
    }),
  careerId: Joi.required().messages({
    "any.required": "El ID de carrera es obligatorio",
  }),
  password: Joi.string()
    .min(10)
    .max(16)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      "string.empty": "La contraseña es obligatoria",
      "string.min": "La contraseña debe tener al menos 10 caracteres",
      "string.max": "La contraseña no puede exceder los 16 caracteres",
      "string.pattern.base":
        "La contraseña debe tener al menos una letra y un número",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Las contraseñas no coinciden",
    "any.required": "Es obligatorio repetir la contraseña",
  }),
});
