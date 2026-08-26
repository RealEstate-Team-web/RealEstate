const nodemailer = require("nodemailer");

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
const MAIL_FROM = String(
  process.env.MAIL_FROM || SMTP_USER || "NestHome <no-reply@nesthome.com>"
).replace(/^["']|["']$/g, "");

function getTransporter() {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: Number(SMTP_PORT) === 465,
      requireTLS: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return null;
}

async function sendPasswordResetEmail(to, resetLink) {
  const transporter = getTransporter();
  const subject = "Reset your NestHome password";
  const text = `You requested a password reset for your NestHome account.\n\nReset your password using this link (valid for 1 hour):\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#111827;">Reset your NestHome password</h2>
      <p>You requested a password reset for your NestHome account. This link is valid for 1 hour.</p>
      <p>
        <a href="${resetLink}"
           style="display:inline-block;background:#E7B85A;color:#111827;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;">
          Reset password
        </a>
      </p>
      <p style="color:#6B7280;font-size:13px;">If the button does not work, copy and paste this link into your browser:<br/>${resetLink}</p>
      <p style="color:#6B7280;font-size:13px;">If you did not request this, you can safely ignore this email.</p>
    </div>`;

  if (!transporter) {
    console.error(
      "[email.service] SMTP not configured; cannot send password reset email."
    );
    return { delivered: false };
  }

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("SMTP send timed out")), 15000)
  );

  try {
    const info = await Promise.race([
      transporter.sendMail({ from: MAIL_FROM, to, subject, text, html }),
      timeout,
    ]);

    if (SMTP_HOST && SMTP_HOST.includes("ethereal")) {
      console.log(
        "[email.service] Ethereal preview URL:\n" +
          nodemailer.getTestMessageUrl(info)
      );
    } else {
      console.log("[email.service] Password reset email sent to " + to);
    }
    return { delivered: true, info };
  } catch (err) {
    console.error("[email.service] Failed to send reset email: " + err.message);
    return { delivered: false, error: err.message };
  }
}

async function sendSuspensionEmail(to) {
  const transporter = getTransporter();
  const subject = "Your NestHome account has been suspended";
  const text = `Your NestHome account has been suspended by an administrator.\n\nYou will not be able to log in or access NestHome while your account is suspended. If you believe this was done in error, please contact support.\n\nThank you for your understanding.`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#111827;">Account suspended</h2>
      <p>Your NestHome account has been suspended by an administrator.</p>
      <p style="color:#6B7280;font-size:13px;">You will not be able to log in or access NestHome while your account is suspended. If you believe this was done in error, please contact support.</p>
    </div>`;

  if (!transporter) {
    console.error(
      "[email.service] SMTP not configured; cannot send suspension email."
    );
    return { delivered: false };
  }

  try {
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log("[email.service] Account suspension email sent (recipient redacted)");
    return { delivered: true, info };
  } catch (err) {
    console.error("[email.service] Failed to send suspension email: " + err.message);
    return { delivered: false, error: err.message };
  }
}

async function sendActivationEmail(to) {
  const transporter = getTransporter();
  const subject = "Your NestHome account has been reactivated";
  const text = `Good news — your NestHome account has been reactivated by an administrator.\n\nYou can now log in and access NestHome again. Welcome back!`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#111827;">Account reactivated</h2>
      <p>Good news — your NestHome account has been reactivated by an administrator.</p>
      <p style="color:#6B7280;font-size:13px;">You can now log in and access NestHome again. Welcome back!</p>
    </div>`;

  if (!transporter) {
    console.error(
      "[email.service] SMTP not configured; cannot send activation email."
    );
    return { delivered: false };
  }

  try {
    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log("[email.service] Account activation email sent (recipient redacted)");
    return { delivered: true, info };
  } catch (err) {
    console.error("[email.service] Failed to send activation email: " + err.message);
    return { delivered: false, error: err.message };
  }
}

module.exports = { sendPasswordResetEmail, sendSuspensionEmail, sendActivationEmail };
