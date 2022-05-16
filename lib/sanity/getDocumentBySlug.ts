import { sanityClient } from "./getClient";

// Sanity query.
const groq = `*[_type == $type][slug.current == $slug][0]{
  ...,
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug.current,
        "type": @.reference->_type
      }
    }
  }
}`;

export default function getDocumentBy(slug: string, type: string) {
  return sanityClient.fetch(groq, { type, slug });
}
