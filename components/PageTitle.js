import { useEffect, useRef } from "react";
import { useApp } from "utils/useApp";

export default function PageTitle({ className, children }) {
  const { dispatchApp } = useApp();
  const skipLinkTargetRef = useRef(null);

  useEffect(() => {
    dispatchApp({
      type: "UPDATE",
      payload: {
        skipLinkTargetRef
      }
    });
  }, [dispatchApp]);

  return (
    <h1 id="skip-link-target" className={className} tabIndex={-1} ref={skipLinkTargetRef}>
      {children}
    </h1>
  );
}
