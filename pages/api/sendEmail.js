import formData from "form-data";
import Mailgun from "mailgun.js";
import { envProd } from "lib/constants";

// Email best practices:
// https://help.mailgun.com/hc/en-us/articles/4401814149147-Adding-A-Reply-To-Address
// https://documentation.mailgun.com/en/latest/best_practices.html

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_PRIVATE_API_KEY
});

const configs = {
  prod: {
    domain: "mg.sandiplewis.com",
    from: "mg.sandiplewis.com",
    recipients: ["sandiplewis@gmail.com"]
  },
  dev: {
    domain: "sandboxd4d6735182254bcdbd4398e2443b4d2f.mailgun.org",
    from: "sandbox.mgsend.net",
    // When sending email via the sandbox domain, up to 5 authorized recipients are
    // allowed on the free plan: https://help.mailgun.com/hc/en-us/articles/217531258
    recipients: ["markplewis1@gmail.com"]
  }
};

export default async function sendEmail(req, res) {
  const { name, email, message } = JSON.parse(req.body);
  const config = envProd ? configs.prod : configs.dev;
  try {
    await mg.messages.create(config.domain, {
      from: `${name} <mailgun@${config.from}>`,
      "h:Reply-To": `${name} <${email}>`,
      to: config.recipients,
      subject: "sandiplewis.com contact form submission",
      text: message
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ message: "success" });
}
