import formData from "form-data";
import Mailgun from "mailgun.js";

// https://vercel.com/docs/solutions/email
// https://www.mailgun.com/blog/how-to-send-transactional-email-in-a-nodejs-app-using-the-mailgun-api/
// https://help.mailgun.com/hc/en-us/articles/4401814149147-Adding-A-Reply-To-Address
// When sending email via the sandbox domain, up to 5 authorized recipients are
// allowed on the free plan: https://help.mailgun.com/hc/en-us/articles/217531258

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_PRIVATE_API_KEY
});

export default async function sendEmail(req, res) {
  const { name, email, message } = JSON.parse(req.body);
  // const domain =
  //   process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
  //     ? "mg.sandiplewis.com"
  //     : "sandboxd4d6735182254bcdbd4398e2443b4d2f.mailgun.org";
  try {
    await mg.messages
      .create("mg.sandiplewis.com", {
        from: `${name} <mailgun@mg.sandiplewis.com>`,
        "h:Reply-To": email,
        to: ["markplewis1@gmail.com"],
        subject: "sandiplewis.com contact form submission",
        text: message
      })
      .then(msg => console.log(msg))
      .catch(err => console.log(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ message: "success" });
}
