const bcrypt = require("bcrypt");

const prisma = require("../config/cmadsPrisma");

const logEdit = require("../utils/editLogger");

exports.getUsers = async (req, res) => {
  try {
    const { role, id } = req.user;
    const { type, search, page = 1, limit = 10 } = req.query;
    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    let users = [];

    // ===============================
    // ADMIN LAYER 1
    // ===============================
    if (role === "ADMIN_LAYER_1") {
      const targetRole =
        type === "ADMIN_LAYER_1" ? "ADMIN_LAYER_1" : "ADMIN_LAYER_2";

      users = await prisma.admins.findMany({
        where: {
          role: targetRole,
          status: "ACTIVE",

          ...(search && {
            OR: [
              {
                full_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone_number: {
                  contains: search,
                },
              },
            ],
          }),
        },
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
        },
      });
    }

    // ===============================
    // ADMIN LAYER 2
    // ===============================
    else if (role === "ADMIN_LAYER_2") {
      users = await prisma.admins.findMany({
        where: {
          role: "WORKER",
          parent_admin_id: id,
          status: "ACTIVE",

          ...(search && {
            OR: [
              {
                full_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone_number: {
                  contains: search,
                },
              },
            ],
          }),
        },
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
        },
      });
    } else {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      page: currentPage,
      limit: pageSize,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { full_name, email, phone_number, password, role } = req.body;

    const loggedInUser = req.user;

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

    // ===========================
    // Create User
    // ===========================

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
    // Prevent deleting last Admin
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
    }

    // ===========================
    // RBAC Validation
    // ===========================

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

    // ===========================
    // Soft Delete
    // ===========================

    await prisma.admins.update({
      where: {
        id: userId,
      },

      data: {
        status: "INACTIVE",
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

      description: `${loggedInUser.full_name} deactivated ${existingUser.full_name}.`,
    });

    return res.status(200).json({
      success: true,

      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);

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

    const { full_name, phone_number, status } = req.body;

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

        status,
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
