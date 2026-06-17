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

    select: {
      id: true,
      personName: true,
      phoneNumber: true,
      city: true,
      ward: true,
      area: true,
      houseNumber: true,
      floorNumber: true,
      wetSlno: true,
      drySlno: true,
      wetRFID: true,
      dryRFID: true,
    },

    orderBy: {
      id: "desc",
    },
  });

  console.log("=================================");
  console.log("RESULT COUNT:", result.length);
  console.log("RESULT:", JSON.stringify(result, null, 2));
  console.log("=================================");

  return result;
};

module.exports = {
  searchCitizen,
};