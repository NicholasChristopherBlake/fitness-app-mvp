import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: false, // TODO check this property later
});

class MailService {
  async sendActivationEmail(to: string, activation_link: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Activate your account on " + process.env.APP_BASE_NAME,
      text: " ",
      html: `
          <div>
            <h1>Please activate your account by clicking the following link:</h1>
            <a href="${activation_link}">${activation_link}</a>
          </div>
        `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Activation email sent successfully");
    } catch (error) {
      console.error("Error sending activation email:", error);
      throw new Error("Failed to send activation email");
    }
  }
}

export default new MailService();
