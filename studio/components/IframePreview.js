import React from "react";
import PropTypes from "prop-types";
import resolveProductionUrl from "../resolveProductionUrl";
import styles from "./IframePreview.css";

// Documentation and references:
// https://www.sanity.io/blog/evolve-authoring-experiences-with-views-and-split-panes
// https://github.com/sanity-io/gatsby-portfolio-preview-poc/blob/master/studio/README.md

// TODO: Fix this ref-related Sanity Studio console warning:
// https://www.sanity.io/help/input-component-no-ref

const assembleProjectUrl = document => {
  const previewURL = resolveProductionUrl(document);
  const slug = document?.displayed?.slug?.current;
  const type = document?.displayed?._type;

  if (!previewURL) {
    console.warn("Missing preview URL");
    return "";
  }
  if (!slug && type !== "homePage") {
    console.warn("Missing slug");
    return "";
  }
  return previewURL;
};

class IframePreview extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  };

  static defaultProps = {
    document: null
  };

  render() {
    const { displayed } = this.props.document;

    if (!displayed) {
      return (
        <div className={styles.componentWrapper}>
          <p>There is no document to preview</p>
        </div>
      );
    }

    const url = assembleProjectUrl(this.props.document);

    if (!url) {
      return (
        <div className={styles.componentWrapper}>
          <p>Hmm. Having problems constructing the web front-end URL.</p>
        </div>
      );
    }

    return (
      <div className={styles.componentWrapper}>
        <div className={styles.iframeContainer}>
          <iframe src={url} frameBorder={"0"} />
        </div>
      </div>
    );
  }
}

export default IframePreview;

// --------------------------------------- //
// Failed attempt based on https://github.com/sanity-io/sanity/issues/2025
// --------------------------------------- //
/*
function Frame({ document, forwardedRef }) {
  const { displayed } = document;

  if (!displayed) {
    return (
      <div className={styles.componentWrapper}>
        <p>There is no document to preview</p>
      </div>
    );
  }

  const url = assembleProjectUrl(document);

  if (!url) {
    return (
      <div className={styles.componentWrapper}>
        <p>Hmm. Having problems constructing the web front-end URL.</p>
      </div>
    );
  }

  return (
    <div className={styles.componentWrapper}>
      <div className={styles.iframeContainer}>
        <iframe src={url} frameBorder={"0"} ref={forwardedRef} />
      </div>
    </div>
  );
}

// Sanity accessibility
Frame.focus = function () {
  this._inputElement.focus();
};

Frame.propTypes = {
  document: PropTypes.object,
  forwardedRef: PropTypes.func
};

Frame.displayName = "Frame";

// Wrapped component

const IframePreview = forwardRef((props, ref) => <Frame {...props} forwardedRef={ref} />);

IframePreview.displayName = "IframePreview";

export default IframePreview;
*/

// --------------------------------------- //
// Failed attempt
// --------------------------------------- //
/*
const IframePreview = React.forwardRef(({ document }, ref) => {
  const { displayed } = document;

  if (!displayed) {
    return (
      <div className={styles.componentWrapper}>
        <p>There is no document to preview</p>
      </div>
    );
  }

  const url = assembleProjectUrl(document);

  if (!url) {
    return (
      <div className={styles.componentWrapper}>
        <p>Hmm. Having problems constructing the web front-end URL.</p>
      </div>
    );
  }

  return (
    <div className={styles.componentWrapper}>
      <div className={styles.iframeContainer}>
        <iframe src={url} frameBorder={"0"} ref={ref} />
      </div>
    </div>
  );
});

IframePreview.displayName = "IframePreview";
IframePreview.propTypes = {
  document: PropTypes.object
};
export default IframePreview;
*/
