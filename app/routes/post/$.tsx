import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { PortableText } from "@portabletext/react";
import type { Post } from "@jemjam/jems.io-sanity";
import { myPortableTextComponents } from "~/components/myPortableTextComponents";
import getDocumentBySlug from "lib/sanity/getDocumentBySlug";

export const loader: LoaderFunction = async ({ params, context }) => {
  const currentSlug = params["*"];

  if (!currentSlug) {
    throw new Error("No slug found");
  }

  const pageData: Post = await getDocumentBySlug(currentSlug, "post");
  if (!pageData) {
    throw new Error("No post found");
  }

  return { currentSlug, pageData };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return {
      title: "Unknown",
    };
  }
  const pageData: Post = data?.pageData;
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

      <Link to="/posts">Back to posts</Link>
    </div>
  );
}
