export function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => !key.startsWith("_") && obj[`_${key}`] && value !== " "
    )
  );
}
