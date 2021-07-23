import Image from "next/image";

export default function Avatar({ name, picture }) {
  return (
    <div className="flex items-center">
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
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}
