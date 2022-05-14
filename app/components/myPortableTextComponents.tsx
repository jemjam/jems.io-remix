import * as React from "react";
import { Link } from "@remix-run/react";
import type { ImageWithAlt } from "@jemjam/jems.io-sanity";

export const myPortableTextComponents = {
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
    internalLink: ({ value, children }: any) => {
      const { slug = "", type } = value;
      const href = `${type == "page" ? "" : "/"+type}/${slug}`;
      return <Link to={href} prefetch="intent">{children}</Link>;
    },
    link: ({ value, children }: any) => {
      // Read https://css-tricks.com/use-target_blank/
      const { blank, href } = value;
      return blank ? (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
  },
};
