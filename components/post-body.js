import BlockContent from '@sanity/block-content-to-react'
import { imageBuilder } from '../lib/sanity'
import markdownStyles from './markdown-styles.module.css'

// https://www.sanity.io/docs/image-url
// https://www.sanity.io/docs/presenting-block-text
// https://github.com/sanity-io/block-content-to-react
// https://www.sanity.io/docs/block-type
// https://gist.github.com/vramdal/ac326a5bf5a4f2755dfe5e64125fceb1
// https://medium.com/@kimbjrkman/how-to-use-inline-images-in-rich-text-with-sanity-io-c42594baa509
// https://www.sanity.io/guides/portable-text-internal-and-external-links

export default function PostBody({ content }) {
  const serializers = {
    types: {
      image: props => (
        // <figure className="customized">
        //   <img
        //     src={imageBuilder(props.node.asset).width(1240).height(540).url()}
        //     alt={props.node.alt}
        //   />
        //   <figcaption>{props.node.caption}</figcaption>
        // </figure>
        <img className="customized"
          src={imageBuilder(props.node.asset).width(1240).height(540).url()}
          alt={props.node.alt}
        />
      )
    }
  }
  return (
    <div className="max-w-2xl mx-auto">
      <BlockContent blocks={content} serializers={serializers} projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID} dataset={process.env.NEXT_PUBLIC_SANITY_DATASET} className={markdownStyles.markdown} />
    </div>
  )
}
