import Image from "next/image";
import Link from "next/link";

export default function Avatar({ name, slug, picture }) {
  return (
    <div className="flex items-center">
      {picture ? (
        <Image
          className="w-12 h-12 rounded-full mr-4"
          src={picture}
          width={48}
          height={48}
          // sizes="(max-width: 800px) 100vw, 800px"
          // layout="responsive"
          alt={name}
          // quality={75}
          // priority={false}
          placeholder="blur"
          // Data URL generated here: https://png-pixel.com/
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8UQ8AAhUBSQV8WJQAAAAASUVORK5CYII="
        />
      ) : null}
      <p>
        <Link as={`/authors/${slug}`} href="/authors/[slug]">
          <a>{name}</a>
        </Link>
      </p>
    </div>
  );
}
