import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import type { Post } from "@jemjam/jems.io-sanity";
import { Link } from "@remix-run/react";
import getListOfPosts from "lib/sanity/getListOfPosts";

export const loader: LoaderFunction = async ({ params }) => {
  const pageData = await getListOfPosts();
  if (!pageData) {
    throw new Error("No post found");
  }
  console.log("pageData", pageData);

  return { pageData };
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

  return (
    <div>
      <h1>Latest posts</h1>
      <ul>
        {data?.pageData?.map((post: Post) => {
          const slug = post?.slug?.current ?? "";
          return (
            <li key={slug}>
              <Link to={`/post/${slug}`}>{post.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
