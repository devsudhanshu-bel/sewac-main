const prisma = require("../config/prisma");

const searchCitizen = async (query) => {
  const normalizedQuery = query.trim();

  console.log("SERVICE RECEIVED QUERY:", normalizedQuery);

  const result = await prisma.master_citizen_data.findMany({
    where: {
      OR: [
        {
          personName: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          phoneNumber: normalizedQuery,
        },
        {
          wetSlno: {
            contains: normalizedQuery,
          },
        },
        {
          drySlno: {
            contains: normalizedQuery,
          },
        },
      ],
    },

    orderBy: {
      id: "desc",
    },
  });

  console.log("=================================");
  console.log("RESULT COUNT:", result.length);
  console.log("RESULT:", JSON.stringify(result, null, 2));
  console.log("FIRST RECORD FULL:");
console.log(result[0]);
  console.log("=================================");

  return result;
};
const getAllCitizens = async () => {
  const result = await prisma.master_citizen_data.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return result;
};

module.exports = {
  searchCitizen,
  getAllCitizens,
};