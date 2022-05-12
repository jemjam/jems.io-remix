import { useRef, useEffect } from "react";
import * as Fathom from "fathom-client";
import { useLocation } from "react-router-dom";

import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import style from "./style.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "jems.io",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];

const noFathomIdMessage =
  "Environment var for FATHOM_SITE_ID missing. Analytics will not be available.";

export const loader: LoaderFunction = ({ context }) => {
  const { FATHOM_SITE_ID } = context;
  if (!FATHOM_SITE_ID) {
    console.warn(noFathomIdMessage);
  }
  return { fathomSiteId: FATHOM_SITE_ID };
};

export default function App() {
  const { fathomSiteId } = useLoaderData();

  // Analytics loading and tracking
  const fathomLoaded = useRef(false);
  const location = useLocation();
  useEffect(() => {
    if (fathomSiteId) {
      if (!fathomLoaded.current) {
        Fathom.load(fathomSiteId);
        fathomLoaded.current = true;
      } else {
        Fathom.trackPageview();
      }
    } else {
      // Warn in the console when the fathom id isn't parsed.
      console.warn(noFathomIdMessage);
    }
  }, [location, fathomSiteId]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: any) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Error</h1>
        <code>{JSON.stringify(error)}</code>

        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}
