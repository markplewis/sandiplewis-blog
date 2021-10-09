import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";

// https://vercel.com/docs/solutions/email
// https://nodemailer.com/smtp/well-known/
// https://nodemailer.com/smtp/

export default async function sendEmail(req, res) {
  const { name, email, message } = JSON.parse(req.body);

  const transporter = nodemailer.createTransport(
    mg({
      auth: {
        api_key: process.env.MAILGUN_PRIVATE_API_KEY,
        domain:
          process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
            ? "mg.sandiplewis.com"
            : "sandboxd4d6735182254bcdbd4398e2443b4d2f.mailgun.org"
      }
    })
  );
  try {
    await transporter.sendMail({
      from: `"${name}" <messages@mg.sandiplewis.com>`,
      // https://help.mailgun.com/hc/en-us/articles/4401814149147-Adding-A-Reply-To-Address
      replyTo: `"${name}" <${email}>`,
      // When sending email via the sandbox domain, up to 5 authorized recipients are
      // allowed on the free plan: https://help.mailgun.com/hc/en-us/articles/217531258
      to: "markplewis1@gmail.com",
      subject: "sandiplewis.com contact form submission",
      html: message
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ message: "success" });
}
