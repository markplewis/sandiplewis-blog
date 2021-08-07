import Date from "components/Date";

export default function Comments({ comments = [] }) {
  return (
    <>
      <h2>Comments:</h2>
      <ul>
        {comments?.map(({ _id, _createdAt, name, email, comment }) => (
          <li key={_id}>
            <hr />
            <h4>
              <a href={`mailto:${email}`}>{name}</a> (<Date dateString={_createdAt} />)
            </h4>
            <p>{comment}</p>
            <hr />
          </li>
        ))}
      </ul>
    </>
  );
}
