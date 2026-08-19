const mainDb = require("../../config/mainDb");

/**
 * ============================================================
 * COMPLAINTS GRIEVANCE MAP SERVICE
 * ============================================================
 *
 * Fetches all citizen complaints that have valid
 * latitude and longitude values.
 *
 * Response format:
 *
 * [
 *   {
 *     lat: 12.9716,
 *     long: 77.5946,
 *     data: {
 *       id: 1,
 *       ticket_number: "...",
 *       phone_number: "...",
 *       title: "...",
 *       description: "...",
 *       category: "...",
 *       image_url: "...",
 *       address: "...",
 *       status: "PENDING"
 *     }
 *   }
 * ]
 *
 * ============================================================
 */

const getComplaintLocations = async () => {
  try {
    const query = `
      SELECT
        id,
        ticket_number,
        phone_number,
        title,
        description,
        category,
        image_url,
        latitude,
        longitude,
        address,
        status
      FROM citizen_complaints
      WHERE latitude IS NOT NULL
        AND longitude IS NOT NULL
      ORDER BY created_at DESC;
    `;

    const result = await mainDb.query(query);

    const locations = result.rows
      .filter(
        (complaint) =>
          complaint.latitude !== null &&
          complaint.longitude !== null &&
          !Number.isNaN(Number(complaint.latitude)) &&
          !Number.isNaN(Number(complaint.longitude))
      )
      .map((complaint) => ({
        lat: Number(complaint.latitude),
        long: Number(complaint.longitude),

        data: {
          id: complaint.id,
          ticket_number: complaint.ticket_number,
          phone_number: complaint.phone_number,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          image_url: complaint.image_url,
          address: complaint.address,
          status: complaint.status,
        },
      }));

    console.log("==============================================");
    console.log("📍 COMPLAINT GREVANCE MAP REQUEST");
    console.log("==============================================");
    console.log(
      "📍 COMPLAINT LOCATIONS LOADED:",
      locations.length
    );

    if (locations.length > 0) {
      console.log(
        "📍 FIRST COMPLAINT LOCATION:",
        locations[0]
      );
    }

    console.log("==============================================");

    return locations;
  } catch (error) {
    console.error(
      "❌ COMPLAINT GREVANCE MAP SERVICE ERROR:",
      error
    );

    throw error;
  }
};

module.exports = {
  getComplaintLocations,
};