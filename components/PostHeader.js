import Avatar from "components/Avatar";
import Date from "components/Date";
import CoverImage from "components/CoverImage";
import PostTitle from "components/PostTitle";

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
