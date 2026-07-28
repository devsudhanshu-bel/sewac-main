    export const maskName = (name) => {
  if (!name) return "";

  if (name.length <= 2) {
    return name;
  }

  if (name.length <= 4) {
    return (
      name.substring(0, 1) +
      "*".repeat(name.length - 2) +
      name.substring(name.length - 1)
    );
  }

  return (
    name.substring(0, 2) +
    "*".repeat(name.length - 4) +
    name.substring(name.length - 2)
  );
};