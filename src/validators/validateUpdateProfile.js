import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no debe exceder los 50 caracteres.",
  }),

  firstLastName: Joi.string().min(3).max(30).optional().messages({
    "string.min": "El primer apellido debe tener al menos 3 caracteres.",
    "string.max": "El primer apellido no debe exceder los 30 caracteres.",
  }),

  secondLastName: Joi.string().min(3).max(30).optional().messages({
    "string.min": "El segundo apellido debe tener al menos 3 caracteres.",
    "string.max": "El segundo apellido no debe exceder los 30 caracteres.",
  }),
});
