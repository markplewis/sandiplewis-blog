import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>
        <h1>Sandi Plewis</h1>
        <h2>Author/editor</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/novels">
              <a>Writing</a>
            </Link>
          </li>
          <li>
            <Link href="/posts">
              <a>Blog</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
