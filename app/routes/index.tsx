import type { SiteSettings, Page } from '@jemjam/jems.io-sanity';
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import getSiteSettings from 'lib/sanity/getSiteSettings';
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "~/components/myPortableTextComponents";
import { useLoaderData, Link } from "@remix-run/react";

interface HomePageData {
  description: string;
  home: Page;
}

export const loader: LoaderFunction = async ({ params, context }) => {
  const pageData: SiteSettings = await getSiteSettings();

  if (!pageData) {
    throw new Error("Failed to load site settings");
  }

  return { ...pageData };
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return {
      title: "Unknown",
    };
  }
  const title = data?.home?.title ?? "Unknown";

  return { title };
};

export default function Index() {
  const data:HomePageData = useLoaderData();

  return (
    <div>
      <h1>{data?.home?.title ?? "No Title"}</h1>
      <PortableText
        value={data?.home?.body ?? []}
        components={myPortableTextComponents}
      />

      <Link to="/posts">Read some posts...</Link>
    </div>
  );
}

