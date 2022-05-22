import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import type { Post } from "@jemjam/jems.io-sanity";

import { useLoaderData, Link } from "@remix-run/react";
import { json } from '@remix-run/cloudflare'
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "~/components/myPortableTextComponents";
import getDocumentBySlug from "lib/sanity/getDocumentBySlug";

export const loader: LoaderFunction = async ({ params, context }) => {
  const currentSlug = params["*"] as string;

  const pageData: Post = await getDocumentBySlug(currentSlug, "post");
  if (!pageData) {
    throw json("No post found", { status: 404 });
  }

  return json(pageData);
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return {
      title: "Post not found",
    };
  }
  const pageData: Post = data?.pageData;
  return {
    title: pageData?.title,
  };
};

export default function Index() {
  const data:Post = useLoaderData();
  console.log('data', data)

  return (
    <div>
      <h1>{data?.title ?? "No Title"}</h1>
      <PortableText
        value={data?.body ?? []}
        components={myPortableTextComponents}
      />

      <Link to="/post">Back to posts</Link>
    </div>
  );
}

export function CatchBoundary() {
  return (
    <div>
      <h1>404</h1>
      <p>That page doesn't exist (yet).</p>

      <Link to="/post">See posts that do exist.</Link>
    </div>
  );
}
