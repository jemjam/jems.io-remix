import { sanityClient } from "./getClient";

// Sanity query.
const groq = `*[_type == "siteSettings"][_id == "siteSettings"]{
  description,
  home->
}[0]`;

export default function getDocumentBy() {
  return sanityClient.fetch(groq);
}
