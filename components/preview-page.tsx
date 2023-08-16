import React, { useState } from "react";
import { renderToString } from "react-dom/server";

import { DynamicLinkInfo } from "@/lib/links/types";

export default function PreviewPage({
  dynamicLinkUrl,
  info,
}: {
  dynamicLinkUrl: string;
  info: DynamicLinkInfo;
}) {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    window.location.href = dynamicLinkUrl; // Replace with your desired URL
  };

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <script async src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="w-full rounded bg-white p-8 shadow-md sm:w-2/3 md:w-1/2 lg:w-1/3">
            {info?.socialMetaTagInfo?.socialImageLink && (
              <div className="mb-4">
                <img
                  alt="Your Image"
                  className="mx-auto h-20"
                  src={info.socialMetaTagInfo?.socialImageLink}
                />
              </div>
            )}

            {info?.socialMetaTagInfo?.socialTitle && (
              <h1 className="mb-2 text-2xl font-semibold">Title Here</h1>
            )}

            {info?.socialMetaTagInfo?.socialDescription && (
              <p className="mb-4 text-gray-600">Description goes here.</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    checked={isChecked}
                    className="form-checkbox mr-2"
                    onChange={handleCheckboxChange}
                    type="checkbox"
                  />
                  I consent to the terms and conditions.
                </label>
              </div>
              <button
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                // disabled={!isChecked}
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
}

export function getPreviewPageHtml(
  dynamicLinkUrl: string,
  info: DynamicLinkInfo,
) {
  return renderToString(
    <PreviewPage dynamicLinkUrl={dynamicLinkUrl} info={info}></PreviewPage>,
  );
}
