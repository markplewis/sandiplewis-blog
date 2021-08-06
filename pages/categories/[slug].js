import ErrorPage from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { client } from "lib/sanity";

// TODO: get posts in this category
// See: https://css-tricks.com/how-to-make-taxonomy-pages-with-gatsby-and-sanity-io/#querying-sanitys-references
const query = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "posts": *[_type == "post" && references(^._id)]{
      title,
      "slug": slug.current
    }
  }
`;

// TODO: $title must have its "-" characters replaced with spaces " " first becuase I don't
// know how to do this in a GROQ query. So categories can't have dashes in their titles :(
// const query = `
//   *[_type == "category" && lower(title) == $title][0] {
//     _id,
//     title,
//     description
//   }
// `;

// const postsByCategoryQuery = ``;

export default function Category({ category }) {
  const router = useRouter();

  return !router.isFallback && !category?.slug ? (
    <ErrorPage statusCode={404} />
  ) : (
    <div>
      <h2>{category?.title}</h2>
      <p>{category?.description}</p>
      {category?.posts ? (
        <>
          <p>Posts:</p>
          <ul>
            {category.posts.map(({ slug, title }) => (
              <li key={slug}>
                <Link as={`/posts/${slug}`} href="/posts/[slug]">
                  <a>{title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const category = await client.fetch(query, {
    slug: params.slug
  });
  // const postsByCategory = await client.fetch(postsByCategoryQuery, {
  //   slug: params.slug
  // });
  return {
    props: {
      category
      // postsByCategory
    }
  };
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "category" && defined(slug.current)]{ "params": { "slug": slug.current } }`
  );
  return {
    paths,
    fallback: true
  };
}
