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
        // TODO: add a `mail.sandiplewis.com` subdomain and configure its MX records
        // https://help.mailgun.com/hc/en-us/articles/203637190
        domain: "sandboxd4d6735182254bcdbd4398e2443b4d2f.mailgun.org"
      }
    })
  );
  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      // Up to 5 authorized recipients are allowed on the free plan
      // TODO: add `sandiplewis@gmail.com`
      // https://help.mailgun.com/hc/en-us/articles/217531258
      to: "markplewis1@gmail.com",
      subject: "sandiplewis.com contact form submission",
      html: message
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ message: "success" });
}
