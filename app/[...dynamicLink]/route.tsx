export const runtime = "edge";
import { sql } from "@vercel/postgres";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";

import PreviewPage from "@/lib/links/preview-page";
import getPreviewPageHtml from "@/lib/links/preview-page";
import { DynamicLinkInfo } from "@/lib/links/types";
import { getFallbackUrl } from "@/lib/links/utils";
import { NextUa } from "@/lib/utils";

// export async function generateMetadata({
//   params,
// }: {
//   params: { domain: string };
// }): Promise<Metadata | null> {
//   const data = await getSiteData(params.domain);
//   if (!data) {
//     return null;
//   }
//   const {
//     description,
//     image,
//     logo,
//     name: title,
//   } = data as {
//     description: string;
//     image: string;
//     logo: string;
//     name: string;
//   };

//   return {
//     description,
//     icons: [logo],
//     metadataBase: new URL(`https://${params.domain}`),
//     openGraph: {
//       description,
//       images: [image],
//       title,
//     },
//     title,
//     twitter: {
//       card: "summary_large_image",
//       creator: "@vercel",
//       description,
//       images: [image],
//       title,
//     },
//   };
// }

// If it contains a header just return the link object from the info.
// This is because its being requsted via the SDK presumably from within an app.
// if not, its being requested from a browser and the use doesn't have the app
// so we have to take them to the fallback URL so we need to redirect to the fallback url
// Finally, its possible that we can't find the link at all at which point we return 404
export async function GET(request: NextRequest, context: NextFetchEvent) {
  try {
    const domain = request.url.split("://")[1].split("?")[0];

    // going for @vercel/postgres
    // as unlike Prisma it supports edge runtime and sql-over-http
    // https://vercel.com/changelog/improved-performance-for-vercel-postgres-from-edge-functions

    const { fields, rows } =
      await sql`SELECT * FROM dynamic_link WHERE url = ${domain};`;

    if (rows.length === 0) {
      return notFound();
    }

    const dynamicLinkUrl = rows[0].url as string;
    const dynamicLinkInfo = rows[0].info as DynamicLinkInfo;

    if (request.headers.get("x-segtrace-link-request")) {
      return new Response(JSON.stringify({ link: dynamicLinkInfo.link }));
    }
    const ua = userAgent(request) as NextUa;
    // sp = skip preview
    if (ua.os.name === "iOS" && !request.url?.includes("sp=1")) {
      // TODO; add analytics info for preview page?
      // context.waitUntil(handleAnalytics('preview'))

      // Show preview page with action button to copy the link
      return new Response(
        getPreviewPageHtml(`${dynamicLinkUrl}?sp=1`, dynamicLinkInfo),
        {
          headers: {
            "content-type": "text/html;charset=UTF-8",
          },
        },
      );
    }

    const fallbackUrl = getFallbackUrl(dynamicLinkInfo, ua);

    // TODO; add analytics info for redirect
    // context.waitUntil(handleAnalytics('redirect'))

    // TODO: we need a way to statically compute the iOS and Android app store links.
    // Only use fallbacks if they're set for each os

    return NextResponse.redirect(fallbackUrl, { status: 301 });
  } catch (err: any) {
    if (err?.message === "NEXT_NOT_FOUND") {
      // TODO: add a nice 404 page if html
      throw err;
    }
    console.error("Error while processing " + request.url, err);
    // TODO: make into html error screen if type is not json
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
