export default async function verifyReCaptcha(req, res) {
  const { token } = JSON.parse(req.body);
  try {
    let response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    });
    response = await response.json();
    return res.status(200).json({ success: response.success, score: response.score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "reCAPTCHA verification error", err });
  }
}