import Joi from "joi";

const validateRut = (rut) => {
  rut = rut.replace(/\./g, "").toUpperCase();
  const regex = /^[0-9]+-[0-9K]$/;

  // Verifica el formato del RUT
  if (!regex.test(rut)) {
    return false;
  }

  const [number, dv] = rut.split("-");
  return dv === calculateDigit(number);
};

const calculateDigit = (rut) => {
  let sum = 0;
  let multiplier = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    sum += multiplier * parseInt(rut[i], 10);
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  return remainder === 11 ? "0" : remainder === 10 ? "K" : remainder.toString();
};

const RutValidator = Joi.string().custom((value, helpers) => {
  if (!validateRut(value)) {
    return helpers.message("El RUT ingresado no es válido");
  }
  return value;
});

export default RutValidator;
