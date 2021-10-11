import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_PRIVATE_API_KEY
});

export default async function sendEmail(req, res) {
  const { name, email, message } = JSON.parse(req.body);
  try {
    await mg.messages
      .create("mg.sandiplewis.com", {
        from: `${name} <mailgun@mg.sandiplewis.com>`,
        "h:Reply-To": email,
        to: ["markplewis1@gmail.com"],
        subject: "sandiplewis.com contact form submission",
        text: message
      })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
  } catch (err) {
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ message: "success" });
}

/*
import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";

// https://vercel.com/docs/solutions/email
// https://nodemailer.com/smtp/well-known/
// https://nodemailer.com/smtp/

// TODO: try this: https://github.com/mailgun/mailgun-js
// https://www.mailgun.com/blog/how-to-send-transactional-email-in-a-nodejs-app-using-the-mailgun-api/

// export default async function sendEmail(req, res) {
//   const { name, email, message } = JSON.parse(req.body);
//   try {
//     let response = await fetch("https://api.mailgun.net/v3/mg.sandiplewis.com/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
//     });
//     response = await response.json();
//     return res.status(200).json({ success: response.success, score: response.score });
//   } catch (err) {
//     return res.status(500).json({ message: "reCAPTCHA verification error", err });
//   }
// }

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
      },
      host: "api.mailgun.net"
    })
  );
  try {
    await transporter.sendMail({
      from: {
        name,
        address: "mailgun@mg.sandiplewis.com"
      },
      // https://help.mailgun.com/hc/en-us/articles/4401814149147-Adding-A-Reply-To-Address
      replyTo: email,
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
*/
