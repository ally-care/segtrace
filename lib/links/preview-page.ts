import { DynamicLinkInfo } from "@/lib/links/types";

export default function getPreviewPageHtml(
  dynamicLinkUrl: string,
  info: DynamicLinkInfo,
): string {
  const html = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${info?.socialMetaTagInfo?.socialTitle || "App Download"}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css">
      </head>
      <body class="bg-gray-100">
        <div class="flex items-center justify-center min-h-screen text-center">
          <div class="bg-white p-8 rounded shadow-md w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center">
            <div class="mb-4">
            ${
              info?.socialMetaTagInfo?.socialImageLink
                ? `<img src="${info.socialMetaTagInfo?.socialImageLink}" alt="App Image" class="mx-auto h-20">`
                : ""
            }
            </div>
            ${
              info?.socialMetaTagInfo?.socialTitle
                ? `<h1 class="text-2xl font-semibold mb-2">${info?.socialMetaTagInfo?.socialTitle}</h1>`
                : ""
            }
            
            ${
              info?.socialMetaTagInfo?.socialDescription
                ? `<p class="text-gray-600 mb-4">${info?.socialMetaTagInfo?.socialDescription}</p>`
                : ""
            }
            
            <form id="myForm">
              <div class="mb-4">
                <label class="flex items-center justify-center">
                  <input type="checkbox" class="form-checkbox mr-2 h-4 w-4" id="consentCheckbox" checked>
                  Save my place in the app.
                </label>
              </div>
              <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                Continue to App
              </button>
            </form>
          </div>
        </div>

        <script>
          document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('myForm');
            const consentCheckbox = document.getElementById('consentCheckbox');
            const submitButton = form.querySelector('button[type="submit"]');

            form.addEventListener('submit', async function (e) {
              e.preventDefault();

              if(consentCheckbox.checked) {
                const textToCopy = '${dynamicLinkUrl}';
                await navigator.clipboard.writeText(textToCopy).then(() => {
                  // console.log('Text copied to clipboard:', textToCopy);
                }).catch((error) => {
                  console.error('Error copying text:', error);
                });
              }
              // console.log('redirecting to https://${info.link}');
              window.location.href = 'https://${info.link}';  
            });
          });
        </script>
      </body>
    </html>
  `;

  return html;
}
