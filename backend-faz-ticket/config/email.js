import nodemailer from "nodemailer";

// Minimal non-sensitive debug: show whether the env vars are present (true/false)
console.log("[email config] EMAIL_USER present:", !!process.env.EMAIL_USER);
console.log("[email config] EMAIL_PASS present:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, verifyTokenOrUrl) => {
  // If caller provided a full URL, use it. Otherwise build a frontend link using token.
  let verificationLink;
  if (typeof verifyTokenOrUrl === "string" && verifyTokenOrUrl.startsWith("http")) {
    verificationLink = verifyTokenOrUrl;
  } else {
    verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(verifyTokenOrUrl)}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - FAZ Ticketing",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to FAZ Ticketing!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
        <p>Or copy and paste this link: ${verificationLink}</p>
        <p>This link expires in 24 hours.</p>
        <hr>
        <small>If you didn't request this, ignore this email.</small>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
