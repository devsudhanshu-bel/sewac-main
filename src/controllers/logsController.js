const cmadsPrisma = require("../config/cmadsPrisma");
const prisma = require("../config/sewacPrisma");

/*
=========================================
Logs Summary
=========================================
*/

exports.getLogsSummary = async (req, res) => {
  try {
    const auditLogs = await cmadsPrisma.audit_logs.count();

    const editLogs = await prisma.edit_logs.count();

    res.status(200).json({
      totalLogs: auditLogs + editLogs,
      auditLogs,
      editLogs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch logs summary"
    });
  }
};

/*
=========================================
Audit Logs
=========================================
*/

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await cmadsPrisma.audit_logs.findMany({
      orderBy: {
        created_at: "desc"
      }
    });

    const formattedLogs = logs.map(log => ({
      id: log.id,
      time: log.created_at,
      user: log.admin_id ? `Admin #${log.admin_id}` : "System",
      event: log.event_type,
      description: log.event_description,
      ipAddress: log.ip_address
    }));

    res.status(200).json(formattedLogs);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch audit logs"
    });
  }
};

/*
=========================================
Edit Logs
=========================================
*/

exports.getEditLogs = async (req, res) => {
  try {
    const logs = await prisma.edit_logs.findMany({
      orderBy: {
        created_at: "desc"
      }
    });

    const formattedLogs = logs.map(log => ({
      id: log.id,
      time: log.created_at,
      user: log.performed_by,
      role: log.role,
      module: log.module,
      action: log.action,
      recordId: log.record_id,
      description: log.description,
      ipAddress: log.ip_address
    }));

    res.status(200).json(formattedLogs);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch edit logs"
    });
  }
};