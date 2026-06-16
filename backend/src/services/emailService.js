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

module.exports = {
  sendSecurityAlert,
};