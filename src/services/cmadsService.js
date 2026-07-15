const axios = require("axios");
const bcrypt = require("bcrypt");

const prisma = require("../config/cmadsPrisma");

exports.verifyCMADS = async (payload) => {
  try {
    const { email, password } = payload;

    // Find user first
    const user = await prisma.admins.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // ===============================
    // WORKER LOGIN (Simple JWT)
    // ===============================
    if (user.role === "WORKER") {

      const match = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!match) {
        throw new Error("Invalid email or password");
      }

      return {
        admin: user
      };
    }

    // ===============================
    // ADMIN L1 & L2 (CMADS)
    // ===============================

    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      payload
    );

    return response.data;

  } catch (error) {

    throw error.response?.data || error;

  }
};