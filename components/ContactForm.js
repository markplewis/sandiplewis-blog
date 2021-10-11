import DOMPurify from "dompurify";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaExclamationCircle } from "react-icons/fa";

import FriendlyCaptcha from "components/FriendlyCaptcha";

import { emailRegex } from "utils/forms";
import useDebug from "utils/useDebug";

import styles from "components/ContactForm.module.css";

// async function saveMessage(data) {
//   let response = await fetch("/api/createContactFormSubmission", {
//     method: "POST",
//     body: data,
//     type: "application/json"
//   });
//   response = await response.json();
//   return response;
// }

async function sendEmail(data) {
  try {
    let response = await fetch("/api/sendEmail", {
      method: "POST",
      body: data,
      type: "application/json"
    });
    response = await response.json();
    return response;
  } catch (err) {
    return err;
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const debug = useDebug();

  const onCaptchaSuccess = solution => {
    debug && console.log("Captcha was solved. The form can be submitted.");
    debug && console.log(solution);
    setIsEnabled(true);
  };

  const onCaptchaError = err => {
    debug && console.log("There was an error when trying to solve the Captcha.");
    debug && console.error(err);
    setIsEnabled(false);
  };

  const onSubmit = async data => {
    setIsSubmitting(true);
    setFormData(data);

    try {
      const sanitizedData = JSON.stringify({
        ...data,
        name: DOMPurify.sanitize(data.name),
        message: DOMPurify.sanitize(data.message)
      });
      sendEmail(sanitizedData)
        .catch(e => {
          setIsSubmitting(false);
          setHasFailed(true);
          debug && console.error(e);
        })
        .then(response => {
          debug && console.log(response);
          setIsSubmitting(false);
          setHasSubmitted(true);
        });
      // Promise.allSettled([saveMessage(sanitizedData), sendEmail(sanitizedData)]).then(results => {
      //   const success = results.every(result => result.status === "fulfilled");
      //   setIsSubmitting(false);
      //   if (success) {
      //     setHasSubmitted(true);
      //   } else {
      //     setHasFailed(true);
      //     debug && console.log(results);
      //   }
      // });
    } catch (err) {
      debug && console.error("Form submission error:", err);
      setFormData(err);
    }
  };

  return (
    <div className={styles.formContainer}>
      {hasSubmitted && (
        <>
          <h2>Your message has been sent</h2>
          <p>Thanks for reaching out!</p>
          {debug && (
            <ul>
              <li>
                <strong>Name:</strong> {formData.name}
              </li>
              <li>
                <strong>Email:</strong> {formData.email}
              </li>
              <li>
                <strong>Message:</strong> {formData.message}
              </li>
            </ul>
          )}
        </>
      )}

      {!hasSubmitted && (
        <>
          {/* TODO: replace this with a spinner because it's too jarring? */}
          {isSubmitting && <h2>Sending your message...</h2>}

          {hasFailed && (
            <>
              <h2>Oops!</h2>
              <p>An error occurred and your message could not be sent.</p>
            </>
          )}

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                autoComplete="name"
                aria-required="true"
                aria-invalid={errors.name ? true : null}
                aria-describedby={errors.name ? "name-error" : null}
                id="name"
              />
              {errors.name && (
                <p className={styles.error} id="name-error">
                  <FaExclamationCircle />
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="email">Email</label>
              <input
                {...register("email", {
                  required: "Email address is required",
                  pattern: { value: emailRegex, message: "Invalid email address" }
                })}
                type="email"
                autoComplete="email"
                aria-required="true"
                aria-invalid={errors.email ? true : null}
                aria-describedby={errors.email ? "email-error" : null}
                id="email"
              />
              {errors.email && (
                <p className={styles.error} id="email-error">
                  <FaExclamationCircle />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                aria-required="true"
                aria-invalid={errors.message ? true : null}
                aria-describedby={errors.message ? "message-error" : null}
                id="message"
                rows="8"></textarea>
              {errors.message && (
                <p className={styles.error} id="message-error">
                  <FaExclamationCircle />
                  {errors.message.message}
                </p>
              )}
            </div>
            <div className={styles.captcha}>
              <FriendlyCaptcha onSuccess={onCaptchaSuccess} onError={onCaptchaError} />
            </div>
            {/* <input
              className={`u-button-appearance-none ${styles.submitButton}`}
              type="submit"
              value="Submit"
              disabled={!isEnabled || isSubmitting}
            /> */}
            <button
              className={`u-button-appearance-none ${styles.submitButton}`}
              type="submit"
              disabled={!isEnabled || isSubmitting}>
              <span>Submit</span>
              <svg
                className={styles.submitButtonSVG}
                // fill={fgColor}
                role="img"
                pointerEvents="none"
                focusable={false}
                aria-hidden={true}>
                <use xlinkHref="#icon-arrow-right" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
