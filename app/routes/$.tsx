import { useParams, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { sanityClient } from "../../lib/sanity/getClient";
import { PortableText } from "@portabletext/react";

export const loader: LoaderFunction = async ({ params }) => {
  const currentPath = params["*"];

  const pageData = await sanityClient.fetch(
    "*[_type == $type][slug.current == $slug][0]",
    { type: "page", slug: currentPath }
  );

  console.log("all params", pageData);

  // if (fullPath == 'your/mom') {
  //   throw new Error('You are not allowed to visit this page');
  // }
  console.log("route param:", currentPath);
  return { fullPath: currentPath, pageData };
};

// export const action: ActionFunction = async ({ params }) => {
//   console.log(params);
//   return null;
// };

// export default function PostRoute() {
//   const params = useParams();
//   console.log(params["*"]);
//   return null;
// }

const myPortableTextComponents = {
  types: {
    imageWithAlt: ({ value }) => {
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
};

export default function Index(props) {
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

// export function ErrorBoundary({ error }) {
//   console.error(error);
//   return (
//     <div>There was an error in here <code>{JSON.stringify(error)}</code></div>
//   );
// }
