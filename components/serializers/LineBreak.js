import styles from "components/serializers/LineBreak.module.css";

const LineBreak = ({ node }) => {
  const { style } = node;
  return <hr className={`${styles.lineBreak} ${style === "thick" ? styles.lineBreakThick : ""}`} />;
};

export default LineBreak;
