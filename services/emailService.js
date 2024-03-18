import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: "your_email@example.com",
    to: email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking the following link:</p>
               <a href="/users/verify/${verificationToken}">Verify Email</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Failed to send verification email");
  }
};
