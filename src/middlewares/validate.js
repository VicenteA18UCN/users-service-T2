export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((err) => err.message);
    throw new Error(errorDetails.join(", "));
  }

  return value;
};
