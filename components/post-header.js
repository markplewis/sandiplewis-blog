import Avatar from "components/avatar";
import Date from "components/date";
import CoverImage from "components/cover-image";
import PostTitle from "components/post-title";

export default function PostHeader({ title, image, imageMeta, date, author }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <CoverImage imageObject={image} imageMeta={imageMeta} title={title} url={image} />
      <Avatar name={author?.name} slug={author?.slug} picture={author?.picture} />
      <Date dateString={date} />
    </>
  );
}
