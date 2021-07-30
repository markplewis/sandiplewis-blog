import React from "react";
import PropTypes from "prop-types";
import resolveProductionUrl from "../resolveProductionUrl";
import styles from "./IframePreview.css";

// Documentation and references:
// https://www.sanity.io/blog/evolve-authoring-experiences-with-views-and-split-panes
// https://github.com/sanity-io/gatsby-portfolio-preview-poc/blob/master/studio/README.md

const assembleProjectUrl = document => {
  const previewURL = resolveProductionUrl(document);
  const slug = document?.displayed?.slug?.current;

  if (!slug || !previewURL) {
    console.warn("Missing slug or previewURL", { slug, previewURL });
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
