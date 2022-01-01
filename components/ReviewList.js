import styles from "components/ReviewList.module.css";

export default function ReviewList({ reviews, headingLevel = 2 }) {
  // TODO: when we convert this project to TypeScript, do the following and delete the @ts-ignore:
  // const HeadingTagName = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const HeadingTagName = `h${headingLevel}`;
  return (
    <ul className={styles.reviewList}>
      {reviews.map(review => (
        <li className={styles.reviewItem} key={review?._id}>
          <figure className={styles.reviewFigure}>
            <blockquote className={styles.reviewQuote}>
              {/* @ts-ignore */}
              <HeadingTagName className={styles.reviewTitle}>{review?.title}</HeadingTagName>
              <p>{review?.review}</p>
            </blockquote>
            <figcaption className={styles.reviewCaption}>— {review?.author}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
