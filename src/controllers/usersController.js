const bcrypt = require("bcrypt");

const prisma = require("../config/cmadsPrisma");

const logEdit = require("../utils/editLogger");

exports.getUsers = async (req, res) => {
  try {
    const { role, id } = req.user;

    const {
      type,
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * pageSize;

    const normalizedSearch = String(search).trim();

    let where = {};

    // =========================================================
    // ADMIN LAYER 1
    // =========================================================
    if (role === "ADMIN_LAYER_1") {
      const targetRole =
        type === "ADMIN_LAYER_1"
          ? "ADMIN_LAYER_1"
          : "ADMIN_LAYER_2";

      where = {
        role: targetRole,
        status: "ACTIVE",
      };

      if (normalizedSearch) {
        where.OR = [
          {
            full_name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            phone_number: {
              contains: normalizedSearch,
            },
          },
        ];
      }
    }

    // =========================================================
    // ADMIN LAYER 2
    // =========================================================
    else if (role === "ADMIN_LAYER_2") {
      where = {
        role: "WORKER",
        parent_admin_id: id,
        status: "ACTIVE",
      };

      if (normalizedSearch) {
        where.OR = [
          {
            full_name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            phone_number: {
              contains: normalizedSearch,
            },
          },
        ];
      }
    }

    // =========================================================
    // OTHER ROLES
    // =========================================================
    else {
      return res.status(403).json({
        success: false,
        error: "Unauthorized.",
      });
    }

    // =========================================================
    // TOTAL COUNT
    // =========================================================
    const total = await prisma.admins.count({
      where,
    });

    // =========================================================
    // FETCH USERS
    // =========================================================
    const users = await prisma.admins.findMany({
      where,

      orderBy: {
        created_at: "desc",
      },

      skip,
      take: pageSize,

      select: {
  id: true,
  full_name: true,
  email: true,
  phone_number: true,
  role: true,
  status: true,
  created_at: true,
  parent_admin_id: true,
},
    });

    const totalPages =
      total === 0 ? 0 : Math.ceil(total / pageSize);

    return res.status(200).json({
      success: true,

      page: currentPage,

      limit: pageSize,

      count: users.length,

      total,

      totalPages,

      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch users.",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { full_name, email, phone_number, password, role } = req.body;

    const loggedInUser = req.user;
    console.log("=== CREATE USER DEBUG ===");
console.log("Logged-in user:", loggedInUser);
console.log("Logged-in user ID:", loggedInUser?.id);
console.log("Logged-in user role:", loggedInUser?.role);

    // ===========================
    // Required Fields Validation
    // ===========================

    if (!full_name || !email || !phone_number || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    // ===========================
    // Role Validation
    // ===========================

    if (loggedInUser.role === "ADMIN_LAYER_1") {
      if (role !== "ADMIN_LAYER_1" && role !== "ADMIN_LAYER_2") {
        return res.status(403).json({
          success: false,
          error: "Admin Layer 1 can only create Admin Layer 1 or Contractors.",
        });
      }
    } else if (loggedInUser.role === "ADMIN_LAYER_2") {
      if (role !== "WORKER") {
        return res.status(403).json({
          success: false,
          error: "Contractors can create Workers only.",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        error: "Unauthorized.",
      });
    }

    // ===========================
    // Email Validation
    // ===========================

    const existingEmail = await prisma.admins.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: "Email already exists.",
      });
    }

    // ===========================
    // Phone Validation
    // ===========================

    const existingPhone = await prisma.admins.findFirst({
      where: {
        phone_number,
      },
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        error: "Phone number already exists.",
      });
    }

    // ===========================
    // Password Validation
    // ===========================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.",
      });
    }

    // ===========================
    // Hash Password
    // ===========================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ===========================
    // Parent Admin Logic
    // ===========================

    let parentAdminId = null;

    if (role === "ADMIN_LAYER_2") {
      parentAdminId = loggedInUser.id;
    }

    if (role === "WORKER") {
      parentAdminId = loggedInUser.id;
    }

    console.log("New user role:", role);
console.log("Calculated parentAdminId:", parentAdminId);
    // ===========================
    // Create User
    // ===========================
console.log("Creating user with parent_admin_id:", parentAdminId);
    const newUser = await prisma.admins.create({
      data: {
        full_name,

        email,

        phone_number,

        password_hash: hashedPassword,

        role,

        parent_admin_id: parentAdminId,

        status: "ACTIVE",
      },
    });

    // ===========================
    // Edit Log
    // ===========================

    await logEdit({
      user: loggedInUser,

      req,

      module: "Users",

      action: "CREATE",

      recordId: newUser.id.toString(),

      description: `${loggedInUser.full_name} created ${role} (${full_name}).`,
    });

    // ===========================
    // Response
    // ===========================

    return res.status(201).json({
      success: true,

      message: "User created successfully.",

      user: {
        id: newUser.id,

        full_name: newUser.full_name,

        email: newUser.email,

        phone_number: newUser.phone_number,

        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error: "Failed to create user.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const loggedInUser = req.user;

    // ===========================
    // Validate User ID
    // ===========================

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID.",
      });
    }

    // ===========================
    // Prevent Self Delete
    // ===========================

    if (userId === loggedInUser.id) {
      return res.status(400).json({
        success: false,
        error: "You cannot delete your own account.",
      });
    }

    // ===========================
    // Check User Exists
    // ===========================

    const existingUser = await prisma.admins.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    // ===========================
    // RBAC Validation
    // ===========================

    // Admin Layer 1 can manage:
    // - Admin Layer 1
    // - Admin Layer 2 / Contractor
    if (loggedInUser.role === "ADMIN_LAYER_1") {
      if (
        existingUser.role !== "ADMIN_LAYER_1" &&
        existingUser.role !== "ADMIN_LAYER_2"
      ) {
        return res.status(403).json({
          success: false,
          error: "Admin Layer 1 cannot manage Workers.",
        });
      }
    }

    // Admin Layer 2 can manage:
    // - Only Workers belonging to them
    if (loggedInUser.role === "ADMIN_LAYER_2") {
      if (
        existingUser.role !== "WORKER" ||
        existingUser.parent_admin_id !== loggedInUser.id
      ) {
        return res.status(403).json({
          success: false,
          error: "You are not allowed to delete this user.",
        });
      }
    }

    // Other roles
    if (
      loggedInUser.role !== "ADMIN_LAYER_1" &&
      loggedInUser.role !== "ADMIN_LAYER_2"
    ) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized.",
      });
    }

    // ===========================
    // Prevent Deleting Last
    // Admin Layer 1
    // ===========================

    if (existingUser.role === "ADMIN_LAYER_1") {
      const adminCount = await prisma.admins.count({
        where: {
          role: "ADMIN_LAYER_1",
          status: "ACTIVE",
        },
      });

      if (adminCount === 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot delete the last Admin Layer 1.",
        });
      }

      // ===========================
      // Protect Contractors
      // ===========================
      //
      // An Admin Layer 1 may have created
      // Admin Layer 2 / Contractor accounts.
      //
      // Never delete the parent while dependent
      // contractor accounts still exist.

      const contractorCount = await prisma.admins.count({
        where: {
          role: "ADMIN_LAYER_2",
          parent_admin_id: userId,
        },
      });

      if (contractorCount > 0) {
        return res.status(409).json({
          success: false,
          error:
            "Cannot delete this Admin Layer 1 because contractors are assigned to this account.",
          code: "DEPENDENT_CONTRACTORS",
          dependentCount: contractorCount,
        });
      }
    }

    // ===========================
    // Protect Workers
    // When deleting Contractor
    // ===========================

    if (existingUser.role === "ADMIN_LAYER_2") {
      const workerCount = await prisma.admins.count({
        where: {
          role: "WORKER",
          parent_admin_id: userId,
        },
      });

      if (workerCount > 0) {
        return res.status(409).json({
          success: false,
          error:
            "Cannot delete this Contractor because workers are assigned to this account.",
          code: "DEPENDENT_WORKERS",
          dependentCount: workerCount,
        });
      }
    }

    // ===========================
    // HARD DELETE
    // ===========================

    await prisma.admins.delete({
      where: {
        id: userId,
      },
    });

    // ===========================
    // Edit Log
    // ===========================

    await logEdit({
      user: loggedInUser,

      req,

      module: "Users",

      action: "DELETE",

      recordId: userId.toString(),

      description: `${loggedInUser.full_name} permanently deleted ${existingUser.full_name}.`,
    });

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,

      message: "User permanently deleted.",

      userId,
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    // ===========================
    // Prisma Foreign Key Protection
    // ===========================

    if (error?.code === "P2003") {
      return res.status(409).json({
        success: false,
        error:
          "This user cannot be deleted because dependent records still exist.",
        code: "DEPENDENCY_CONFLICT",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to delete user.",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const loggedInUser = req.user;

    const { full_name, phone_number } = req.body;

    const existingUser = await prisma.admins.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    // ===========================
    // RBAC
    // ===========================

    if (loggedInUser.role === "ADMIN_LAYER_1") {
      if (
        existingUser.role !== "ADMIN_LAYER_1" &&
        existingUser.role !== "ADMIN_LAYER_2"
      ) {
        return res.status(403).json({
          success: false,
          error: "Admin Layer 1 cannot manage Workers.",
        });
      }
    }

    if (loggedInUser.role === "ADMIN_LAYER_2") {
      if (
        existingUser.role !== "WORKER" ||
        existingUser.parent_admin_id !== loggedInUser.id
      ) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized.",
        });
      }
    }

    // ===========================
    // Phone Duplicate
    // ===========================

    if (phone_number) {
      const duplicate = await prisma.admins.findFirst({
        where: {
          phone_number,

          NOT: {
            id: userId,
          },
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,

          error: "Phone number already exists.",
        });
      }
    }

    // ===========================
    // Update
    // ===========================

    const updatedUser = await prisma.admins.update({
      where: {
        id: userId,
      },

      data: {
        full_name,

        phone_number,
      },
    });

    // ===========================
    // Edit Log
    // ===========================

    await logEdit({
      user: loggedInUser,

      req,

      module: "Users",

      action: "UPDATE",

      recordId: updatedUser.id.toString(),

      description: `${loggedInUser.full_name} updated ${updatedUser.full_name}.`,
    });

    return res.status(200).json({
      success: true,

      message: "User updated successfully.",

      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error: "Failed to update user.",
    });
  }
};
