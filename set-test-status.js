import "dotenv/config";
import sewacPrisma from "./src/config/sewacPrisma.js";

const ticketNumber = "SEWAC-1786343935991";

try {
  const complaint = await sewacPrisma.citizen_complaints.findUnique({
    where: {
      ticket_number: ticketNumber,
    },
  });

  if (!complaint) {
    throw new Error(`Complaint ${ticketNumber} not found`);
  }

  console.log("Current status:", complaint.status);

  const updated = await sewacPrisma.citizen_complaints.update({
    where: {
      ticket_number: ticketNumber,
    },
    data: {
      status: "READY_FOR_VERIFICATION",
    },
  });

  console.log("Updated status:", updated.status);

  console.log(`✅ ${ticketNumber} is ready for OTP verification.`);
} catch (error) {
  console.error("❌ Failed:", error.message);
} finally {
  await sewacPrisma.$disconnect();
}
