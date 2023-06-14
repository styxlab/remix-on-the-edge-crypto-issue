import type { LoaderArgs } from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";

import { Footer } from "~/components/footer";
import { parseVercelId } from "~/parse-vercel-id";
import { sha1digest } from "~/crypto";

export const config = { runtime: "edge" };

let isCold = true;
let initialDate = Date.now();

export async function loader({ request }: LoaderArgs) {
  const wasCold = isCold;
  isCold = false;

  const parsedId = parseVercelId(request.headers.get("x-vercel-id"));

  const uuid = await sha1digest(
    new TextEncoder().encode("vercel-bug" + new Date().toISOString())
  );

  return {
    ...parsedId,
    isCold: wasCold,
    date: new Date().toISOString(),
    uuid,
  };
}

export function headers() {
  return {
    "x-edge-age": Date.now() - initialDate,
  };
}

export default function App() {
  const { isCold, date, uuid } = useLoaderData<typeof loader>();
  return (
    <>
      <main>
        <div className='info'>
          <span>Hash calculated with crypto.subtle():</span>
          {uuid}
        </div>
      </main>

      <Footer>
        <p>
          Generated at {date} <span data-break /> ({isCold ? "cold" : "hot"}) by{" "}
          <a
            href='https://vercel.com/docs/concepts/functions/edge-functions'
            target='_blank'
            rel='noreferrer'
          >
            Vercel Edge Runtime
          </a>
        </p>
      </Footer>
    </>
  );
}
