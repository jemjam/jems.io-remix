import { useParams, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { sanityClient } from "lib/sanity/getClient";
import { PortableText } from "@portabletext/react";
import type { Page, ImageWithAlt } from "@jemjam/jems.io-sanity";
import { Link } from "@remix-run/react";

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

const myPortableTextComponents = {
  types: {
    imageWithAlt: ({ value }: { value: ImageWithAlt }) => {
      const { alt, caption, image = {} } = value;
      // This is coming from the cloudinary image asset field
      const { secure_url = "", derived = [] } = image;
      // Get first derived image if it exists, otherwise use the main image
      const imageUrl = derived?.[0]?.secure_url ?? secure_url;
      return (
        <figure>
          <img src={imageUrl} alt={alt} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    internalLink: ({ value, children }:any) => {
      const { slug = '', type } = value;
      console.log("lets render internalLink", { value, children });
      const href = `/${slug}`;
      return <Link to={href}>{children}</Link>;
    },
    link: ({value, children}:any) => {
      // Read https://css-tricks.com/use-target_blank/
      const { blank, href } = value
      return blank ?
        <a href={href} target="_blank" rel="noreferrer">{children}</a>
        : <a href={href}>{children}</a>
    }

  },
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
