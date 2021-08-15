import DOMPurify from "dompurify";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { emailRegex } from "utils/forms";
import useDebug from "utils/useDebug";

export default function ContactForm() {
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const debug = useDebug();

  const submitReCaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      debug && console.log("Execute reCAPTCHA not yet available");
      return;
    }
    const token = await executeRecaptcha("contactSubmit");
    try {
      let response = await fetch("/api/verifyReCaptcha", {
        method: "POST",
        body: JSON.stringify({ token }),
        type: "application/json"
      });
      response = await response.json();
      debug && console.log("reCAPTCHA response", response);
      const verified = response.success && response.score >= 0.5;
      setCaptchaVerified(verified);
      return verified;
    } catch (err) {
      debug && console.error(err);
    }
  }, [debug, executeRecaptcha]);

  // Trigger the verification as soon as the component is loaded
  useEffect(() => {
    submitReCaptcha();
  }, [submitReCaptcha]);

  const sendEmail = async data => {
    try {
      let response = await fetch("/api/sendEmail", {
        method: "POST",
        body: data,
        type: "application/json"
      });
      response = await response.json();
      debug && console.log("sendMail response", response);
    } catch (err) {
      debug && console.error(err);
    }
  };

  const onSubmit = async data => {
    setIsSubmitting(true);
    setFormData(data);
    debug && console.log(`reCAPTCHA ${captchaVerified ? "already" : "not yet"} verified`);

    const captchaIsVerified = captchaVerified || (await submitReCaptcha());
    if (!captchaIsVerified) {
      debug && console.log("reCAPTCHA not verified");
      return;
    } else {
      debug && console.log("reCAPTCHA verified");
    }
    try {
      const sanitizedData = JSON.stringify({
        ...data,
        name: DOMPurify.sanitize(data.name),
        message: DOMPurify.sanitize(data.message)
      });
      // Send form submission data to Sanity
      let response = await fetch("/api/createContactFormSubmission", {
        method: "POST",
        body: sanitizedData,
        type: "application/json"
      });
      response = await response.json();
      debug && console.log(`Form submission ${response.message}`);

      // Email form submission data
      sendEmail(sanitizedData);

      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      debug && console.error("Form submission error:", err);
      setFormData(err);
    }
  };

  return (
    <>
      {isSubmitting && <h2>Submitting form</h2>}

      {/* {hasSubmitted && <h2>Form submitted</h2>} */}
      {hasSubmitted && (
        <>
          <h2>Form submitted</h2>
          <ul>
            <li>Name: {formData.name}</li>
            <li>Email: {formData.email}</li>
            <li>Message: {formData.message}</li>
          </ul>
        </>
      )}

      {!isSubmitting && !hasSubmitted && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name">Name</label>
              <input {...register("name", { required: "Name is required" })} id="name" />
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                {...register("email", {
                  required: "Email address is required",
                  pattern: { value: emailRegex, message: "Invalid email address" }
                })}
                id="email"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                id="message"
                rows="8"></textarea>
              {errors.message && <p>{errors.message.message}</p>}
            </div>
            <input type="submit" value="Submit" />
          </form>
          {/* https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed */}
          <p>
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </p>
        </>
      )}
    </>
  );
}
