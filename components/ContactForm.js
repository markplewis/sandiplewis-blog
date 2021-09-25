import DOMPurify from "dompurify";
import { useState } from "react";
import { useForm } from "react-hook-form";

import FriendlyCaptcha from "components/FriendlyCaptcha";

import { emailRegex } from "utils/forms";
import useDebug from "utils/useDebug";

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
        .then(() => {
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
    <>
      {isSubmitting && <h2>Submitting form</h2>}

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

      {hasFailed && <h2>Error</h2>}

      {!isSubmitting && !hasSubmitted && !hasFailed && (
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

            <FriendlyCaptcha onSuccess={onCaptchaSuccess} onError={onCaptchaError} />

            <input type="submit" value="Submit" disabled={!isEnabled} />
          </form>
        </>
      )}
    </>
  );
}
