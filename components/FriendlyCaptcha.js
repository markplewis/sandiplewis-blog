import { useEffect, useRef, useState } from "react";

// See: https://docs.friendlycaptcha.com/#/widget_api?id=full-example-in-react-with-react-hooks

const FriendlyCaptcha = ({ onSuccess, onError }) => {
  const container = useRef();
  const widget = useRef();
  const [widgetModule, setWidgetModule] = useState();

  // Must use dynamic import (see: https://github.com/FriendlyCaptcha/friendly-challenge/issues/29)
  useEffect(() => {
    async function importCaptcha() {
      const module = await import("friendly-challenge");
      setWidgetModule(module);
    }
    importCaptcha();
  }, []);

  useEffect(() => {
    if (!widget.current && container.current && widgetModule) {
      widget.current = new widgetModule.WidgetInstance(container.current, {
        startMode: "focus",
        doneCallback: onSuccess,
        errorCallback: onError
      });
    }
    return () => {
      // No need to reset the widget since this isn't a single page app
      // if (widget.current != undefined) widget.current.reset();
    };
  }, [widgetModule, container, onError, onSuccess]);

  return (
    <div
      ref={container}
      className="frc-captcha"
      data-lang="en"
      data-start="focus"
      data-sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
    />
  );
};

export default FriendlyCaptcha;
