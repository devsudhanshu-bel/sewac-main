const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.ALERT_EMAIL,

    pass: process.env.ALERT_PASSWORD,
  },
});

const sendSecurityAlert = async ({
  layer,
  severity,
  type,
  description,
  ipAddress,
}) => {
  const message = `
CMADS SECURITY ALERT

Layer: ${layer}

Severity: ${severity}

Type: ${type}

Description:
${description}

IP Address:
${ipAddress}

Timestamp:
${new Date().toISOString()}
`;

  await transporter.sendMail({
    from: process.env.ALERT_EMAIL,

    to: process.env.ADMIN_EMAIL,

    subject: `[${severity}] CMADS ${layer} Alert`,

    text: message,
  });
};

const sendPermissionApprovalEmail = async ({
  requesterName,
  requesterEmail,
  module,
  action,
  target,
  reason,
  approveLink,
  rejectLink,
}) => {
  const html = `
    <h2>SEWAC Permission Approval Required</h2>

    <p><b>Requested By:</b> ${requesterName}</p>

    <p><b>Email:</b> ${requesterEmail}</p>

    <p><b>Module:</b> ${module}</p>

    <p><b>Action:</b> ${action}</p>

    <p><b>Target:</b> ${target}</p>

    <p><b>Reason:</b></p>

    <p>${reason}</p>

    <br>

    <a href="${approveLink}"
       style="
       background:#28a745;
       color:white;
       padding:12px 24px;
       text-decoration:none;
       border-radius:6px;
       margin-right:15px;
       ">
       APPROVE
    </a>

    <a href="${rejectLink}"
       style="
       background:#dc3545;
       color:white;
       padding:12px 24px;
       text-decoration:none;
       border-radius:6px;
       ">
       REJECT
    </a>
  `;

  await transporter.sendMail({
    from: process.env.ALERT_EMAIL,

    to: process.env.ADMIN_EMAIL,

    subject: "SEWAC Permission Approval",

    html,
  });
};

const sendDeviceRegistrationEmail = async (
  recipientEmail,
  adminName,
  token
) => {
  const approvalLink =
    `${process.env.FRONTEND_URL}/approve-device?token=${token}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
      <h2>New Device Registration Request</h2>

      <p>Hello <b>${adminName}</b>,</p>

      <p>
        A new device is requesting access to your CMADS administrator account.
      </p>

      <p>
        If this was you, approve the device using the button below.
      </p>

      <br>

      <a
        href="${approvalLink}"
        style="
          background:#2563eb;
          color:white;
          padding:12px 24px;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Approve Device
      </a>

      <br><br>

      <p>
        This approval link expires in <b>60 minutes</b>.
      </p>

      <hr>

      <small>
        If you did not initiate this login, simply ignore this email.
      </small>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.ALERT_EMAIL,
    to: recipientEmail,
    subject: "CMADS - New Device Registration",
    html,
  });
};

module.exports = {
  sendSecurityAlert,
  sendPermissionApprovalEmail,
  sendDeviceRegistrationEmail,
};
