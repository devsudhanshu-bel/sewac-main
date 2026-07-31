export const validateComplaint = (data) => {
  const {
    title,
    description,
    category,
    latitude,
    longitude,
    address,
  } = data;

  if (!title || title.trim() === "") {
    throw new Error("Title is required.");
  }

  if (!description || description.trim() === "") {
    throw new Error("Description is required.");
  }

  if (!category || category.trim() === "") {
    throw new Error("Category is required.");
  }

  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
    throw new Error("Latitude and Longitude are required.");
  }

  if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
    throw new Error("Invalid latitude or longitude.");
  }

  if (!address || address.trim() === "") {
    throw new Error("Address is required.");
  }

  return true;
};