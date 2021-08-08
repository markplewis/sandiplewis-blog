import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CommentForm({ _id }) {
  const [formData, setFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors }
  } = useForm();
  const onSubmit = async data => {
    setIsSubmitting(true);
    // let response;
    setFormData(data);
    try {
      // response = await fetch("/api/createComment", {
      await fetch("/api/createComment", {
        method: "POST",
        body: JSON.stringify(data),
        type: "application/json"
      });
      setIsSubmitting(false);
      setHasSubmitted(true);
    } catch (err) {
      setFormData(err);
    }
  };

  if (isSubmitting) {
    return <h3>Submitting comment…</h3>;
  }
  if (hasSubmitted) {
    return (
      <>
        <h3>Thanks for your comment!</h3>
        <ul>
          <li>
            Name: {formData.name} <br />
            Email: {formData.email} <br />
            Comment: {formData.comment}
          </li>
        </ul>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} disabled>
      <input {...register("_id")} type="hidden" name="_id" value={_id} />
      <label>
        <span>Name</span>
        <input name="name" {...register("name", { required: true })} placeholder="John Appleseed" />
      </label>
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          {...register("email", { required: true })}
          placeholder="your@email.com"
        />
      </label>
      <label>
        <span>Comment</span>
        <textarea
          {...register("comment", { required: true })}
          name="comment"
          rows="8"
          placeholder="Enter some long form content."></textarea>
      </label>
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
}
