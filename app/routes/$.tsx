import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { sanityClient } from "lib/sanity/getClient";
import { PortableText } from "@portabletext/react";
import type { Page } from "@jemjam/jems.io-sanity";
import { myPortableTextComponents } from "~/components/myPortableTextComponents";

export const loader: LoaderFunction = async ({ params, context }) => {
  const currentSlug = params["*"];

  const pageData: Page = await sanityClient.fetch(
    `*[_type == $type][slug.current == $slug][0]{
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
}`,
    { type: "page", slug: currentSlug }
  );

  return { currentSlug, pageData };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return {
      title: "Unknown",
    };
  }
  const pageData: Page = data?.pageData;
  return {
    title: pageData?.title,
  };
};

export default function Index() {
  const data = useLoaderData();
  console.log("our props", data);

  return (
    <div>
      <h1>{data?.pageData?.title ?? "No Title"}</h1>
      <PortableText
        value={data?.pageData?.body ?? []}
        components={myPortableTextComponents}
      />
    </div>
  );
}
