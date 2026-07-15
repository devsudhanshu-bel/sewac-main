const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.ALERT_EMAIL,

      pass:
        process.env.ALERT_PASSWORD,
    },
  });

const sendSecurityAlert =
  async ({
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
      from:
        process.env.ALERT_EMAIL,

      to:
        process.env.ADMIN_EMAIL,

      subject:
        `[${severity}] CMADS ${layer} Alert`,

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

    html

  });

};

module.exports = {
  sendSecurityAlert,
  sendPermissionApprovalEmail
};