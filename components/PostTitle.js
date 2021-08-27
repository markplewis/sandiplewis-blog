export default function PostTitle({ className, children }) {
  return (
    <h1 id="skip-link-target" tabIndex={-1} className={className}>
      {children}
    </h1>
  );
}
