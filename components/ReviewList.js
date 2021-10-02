import styles from "components/ReviewList.module.css";

export default function ReviewList({ reviews, headings = "h2" }) {
  const Heading = headings;
  return (
    <ul className={styles.reviewList}>
      {reviews.map(review => (
        <li className={styles.reviewItem} key={review?._id}>
          <figure className={styles.reviewFigure}>
            <blockquote className={styles.reviewQuote}>
              <Heading className={styles.reviewTitle}>{review?.title}</Heading>
              <p>{review?.review}</p>
            </blockquote>
            <figcaption className={styles.reviewCaption}>— {review?.author}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
