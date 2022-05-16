import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import getDocumentBySlug from "lib/sanity/getDocumentBySlug";
import { PortableText } from "@portabletext/react";
import type { Page } from "@jemjam/jems.io-sanity";
import { myPortableTextComponents } from "~/components/myPortableTextComponents";

export const loader: LoaderFunction = async ({ params, context }) => {
  const currentSlug = params["*"];
  if (!currentSlug) {
    throw new Error("No slug found");
  }

  const pageData: Page = await getDocumentBySlug(currentSlug, "page");
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
