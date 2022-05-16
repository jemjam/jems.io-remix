import { sanityClient } from "./getClient";

// Sanity query.
const groq = `*[_type == 'post'][slug.current != null] | order(_createdAt desc) {
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
}[0..10]`;

export default function getListOfPosts() {
  return sanityClient.fetch(groq);
}
