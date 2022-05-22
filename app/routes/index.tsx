import type { SiteSettings, Page } from "@jemjam/jems.io-sanity";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";

import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import { PortableText } from "@portabletext/react";
import getSiteSettings from "lib/sanity/getSiteSettings";
import { myPortableTextComponents } from "~/components/myPortableTextComponents";

interface HomePageData {
  description: string;
  home: Page;
}

export const loader: LoaderFunction = async ({ params, context }) => {
  const pageData: SiteSettings = await getSiteSettings();

  if (!pageData) {
    throw json("Failed to load site settings", 404);
  }

  return json(pageData);
};

export const meta: MetaFunction = ({ data }) => {
  const defaultTitle = "jems.io Homepage";
  const homePageTitle = data?.home?.title ?? defaultTitle;
  return { title: homePageTitle };
};

export default function Index() {
  const data: HomePageData = useLoaderData();

  return (
    <div>
      <h1>{data?.home?.title ?? "No Title"}</h1>
      <PortableText
        value={data?.home?.body ?? []}
        components={myPortableTextComponents}
      />

      <Link to="/post">Read some posts...</Link>
    </div>
  );
}

export function CatchBoundary() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}
