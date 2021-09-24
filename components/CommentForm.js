import DOMPurify from "dompurify";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { emailRegex } from "utils/forms";
import useDebug from "utils/useDebug";

// I deleted the ReCaptcha v3 "sites" that I had created at: https://www.google.com/recaptcha/admin/

export default function CommentForm({ _id }) {
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // const [captchaVerified, setCaptchaVerified] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // const { executeRecaptcha } = useGoogleReCaptcha();
  const debug = useDebug();

  // const submitReCaptcha = useCallback(async () => {
  //   if (!executeRecaptcha) {
  //     debug && console.log("Execute reCAPTCHA not yet available");
  //     return;
  //   }
  //   const token = await executeRecaptcha("commentSubmit");
  //   try {
  //     let response = await fetch("/api/verifyReCaptcha", {
  //       method: "POST",
  //       body: JSON.stringify({ token }),
  //       type: "application/json"
  //     });
  //     response = await response.json();
  //     debug && console.log("reCAPTCHA response", response);
  //     const verified = response.success && response.score >= 0.5;
  //     setCaptchaVerified(verified);
  //     return verified;
  //   } catch (err) {
  //     debug && console.error(err);
  //   }
  // }, [debug, executeRecaptcha]);

  // Trigger the verification as soon as the component is loaded
  // useEffect(() => {
  //   submitReCaptcha();
  // }, [submitReCaptcha]);

  const onSubmit = async data => {
    setIsSubmitting(true);
    setFormData(data);
    // debug && console.log(`reCAPTCHA ${captchaVerified ? "already" : "not yet"} verified`);

    // const captchaIsVerified = captchaVerified || (await submitReCaptcha());
    // if (!captchaIsVerified) {
    //   debug && console.log("reCAPTCHA not verified");
    //   return;
    // } else {
    //   debug && console.log("reCAPTCHA verified");
    // }
    try {
      const sanitizedData = {
        ...data,
        name: DOMPurify.sanitize(data.name),
        comment: DOMPurify.sanitize(data.comment)
      };
      let response = await fetch("/api/createComment", {
        method: "POST",
        body: JSON.stringify(sanitizedData),
        type: "application/json"
      });
      response = await response.json();
      debug && console.log(`Form submission ${response.message}`);

      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      debug && console.error("Form submission error:", err);
      setFormData(err);
    }
  };

  return (
    <>
      {isSubmitting && <h2>Submitting comment</h2>}

      {hasSubmitted && (
        <>
          <h2>Comment submitted</h2>
          <ul>
            <li>Name: {formData.name}</li>
            <li>Email: {formData.email}</li>
            <li>Comment: {formData.comment}</li>
          </ul>
        </>
      )}

      {!isSubmitting && !hasSubmitted && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("_id")} type="hidden" name="_id" value={_id} />
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
              <label htmlFor="comment">Comment</label>
              <textarea
                {...register("comment", { required: "Comment is required" })}
                id="comment"
                rows="8"></textarea>
              {errors.comment && <p>{errors.comment.message}</p>}
            </div>
            <input type="submit" value="Submit" />
          </form>
          {/* https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed */}
          {/* <p>
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </p> */}
        </>
      )}
    </>
  );
}
