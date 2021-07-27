import Container from "components/container";
import cn from "classnames";

export default function Alert({ preview }) {
  return (
    <div
      className={cn("border-b", {
        "bg-accent-7 border-accent-7 text-white": preview,
        "bg-accent-1 border-accent-2": !preview
      })}>
      <Container>
        <div className="py-2 text-center text-sm">
          {preview ? (
            <>
              This page is a preview.{" "}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/api/exit-preview"
                className="underline hover:text-cyan duration-200 transition-colors">
                Click here to exit preview mode
              </a>
              .
            </>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
