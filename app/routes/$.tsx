import { useParams, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ params }) => {
  console.log("all params", params);

  const fullPath = params["*"];
  // if (fullPath == 'your/mom') {
  //   throw new Error('You are not allowed to visit this page');
  // }
  console.log("route param:", fullPath);
  return { fullPath };
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

export default function Index(props) {
  const data = useLoaderData();
  console.log('our props', data);

  return <h1>Hello {props?.fullPath}</h1>;
}

// export function ErrorBoundary({ error }) {
//   console.error(error);
//   return (
//     <div>There was an error in here <code>{JSON.stringify(error)}</code></div>
//   );
// }