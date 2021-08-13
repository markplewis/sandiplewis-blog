import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Head from "next/head";
import { SITE_TITLE } from "lib/constants";
import Layout from "components/Layout";

// import "pages/styles/contact.module.css";

export default function Contact() {
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async data => {
    setIsSubmitting(true);
    setFormData(data);
    let response;
    try {
      response = await fetch("/api/createContactFormSubmission", {
        method: "POST",
        body: JSON.stringify(data),
        type: "application/json"
      });
      console.log("Form response:", response);
      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      console.error("Form error:", err);
      setFormData(err);
    }
  };

  // Pattern taken from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
  const emailRegex =
    // eslint-disable-next-line no-useless-escape
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return (
    <Layout layoutClass="l-contact">
      <Head>
        <title>Contact | {SITE_TITLE}</title>
      </Head>
      <h1>Contact</h1>

      {isSubmitting && <h2>Submitting form</h2>}

      {/* {hasSubmitted && <h2>Form submitted</h2>} */}
      {hasSubmitted && (
        <>
          <h2>Form submitted</h2>
          <ul>
            <li>
              Name: {formData.name} <br />
              Email: {formData.email} <br />
              Message: {formData.message}
            </li>
          </ul>
        </>
      )}

      {!isSubmitting && !hasSubmitted && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name">Name</label>
            <input {...register("name", { required: "Name field is required" })} id="name" />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div>
            {/* TODO: integrate reCaptcha: https://www.google.com/recaptcha */}
            <label htmlFor="name">Email</label>
            <input
              {...register("email", {
                required: "Email field is required",
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
      )}
    </Layout>
  );
}
