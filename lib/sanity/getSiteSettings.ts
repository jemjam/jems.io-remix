import { sanityClient } from "./getClient";

// Sanity query.
const groq = `*[_type == "siteSettings"][_id == "siteSettings"]{
  description,
  home->{
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
  }
}[0]`;

export default function getDocumentBy() {
  return sanityClient.fetch(groq);
}
