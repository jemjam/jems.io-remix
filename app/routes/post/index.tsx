import { useLoaderData } from "@remix-run/react";
import { json } from '@remix-run/cloudflare'
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import type { Post } from "@jemjam/jems.io-sanity";
import { Link } from "@remix-run/react";
import getListOfPosts from "lib/sanity/getListOfPosts";

export const loader: LoaderFunction = async ({ params }) => {
  const listOfPosts = await getListOfPosts();
  if (!listOfPosts) {
    throw json("No posts found", { status: 404 });
  }
  return json(listOfPosts);
};

export const meta: MetaFunction = () => ({
  title: `All my latest posts on jems.io`,
});

export default function Index() {
  const data = useLoaderData();

  return (
    <main>
      <h1>Latest posts</h1>
      <ul>
        {data.map((post: Post) => {
          const slug = post?.slug?.current ?? "";
          return (
            <li key={slug}>
              <Link to={`/post/${slug}`}>{post.title}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
