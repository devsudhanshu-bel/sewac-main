const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  console.log("========== BREVO ==========");
  console.log("TO:", to);
  console.log("SUBJECT:", subject);
  console.log("SENDER:", process.env.SENDER_EMAIL);
  console.log("API KEY EXISTS:", !!process.env.BREVO_API_KEY);

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "SEWAC CMADS",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    console.log("BREVO RESPONSE:");
    console.log(response.data);

    return response.data;
  } catch (err) {
    console.log("BREVO ERROR STATUS:", err.response?.status);
    console.log("BREVO ERROR DATA:", err.response?.data);
    console.log("BREVO ERROR MESSAGE:", err.message);

    throw err;
  }
};

const sendPasswordResetEmail = async (recipientEmail, resetLink) => {
  const html = `
<h2>Password Reset</h2>

<p>Click the button below to reset your password.</p>

<a
href="${resetLink}"
style="
background:#2563eb;
color:white;
padding:12px 24px;
text-decoration:none;
border-radius:6px;
">
Reset Password
</a>

<p>This link expires in 15 minutes.</p>
`;

  await sendEmail({
    to: recipientEmail,
    subject: "CMADS Password Reset",
    html,
  });
};

const sendSecurityAlert = async ({
  layer,
  severity,
  type,
  description,
  ipAddress,
}) => {
  const html = `
<pre>
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
</pre>
`;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `[${severity}] CMADS ${layer} Alert`,
    html,
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

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "SEWAC Permission Approval",
    html,
  });
};

const sendDeviceRegistrationEmail = async (
  recipientEmail,
  adminName,
  token,
) => {
  const approvalLink = `${process.env.FRONTEND_URL}/approve-device?token=${token}`;

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
display:inline-block;
">
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

  await sendEmail({
    to: recipientEmail,
    subject: "CMADS - New Device Registration",
    html,
  });
};

module.exports = {
  sendSecurityAlert,
  sendPermissionApprovalEmail,
  sendPasswordResetEmail,
  sendDeviceRegistrationEmail,
};
