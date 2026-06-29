import * as fs from "fs";
import path from "path";
import { HUB_FRONTEND_PATH } from "../config.js";

export async function discoverApiLayerHandler() {

  const apiFile = path.join(
    HUB_FRONTEND_PATH,
    "src",
    "lib",
    "api.ts"
  );

  const result = {
    exists: false,
    api_functions: [] as string[],
  };

  if (!fs.existsSync(apiFile)) {

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            result,
            null,
            2
          ),
        },
      ],
    };
  }

  result.exists = true;

  const content =
    fs.readFileSync(
      apiFile,
      "utf8"
    );

  const matches = [
    ...content.matchAll(
      /export\s+async\s+function\s+([a-zA-Z0-9_]+)/g
    ),

    ...content.matchAll(
      /export\s+function\s+([a-zA-Z0-9_]+)/g
    ),

    ...content.matchAll(
      /export\s+const\s+([a-zA-Z0-9_]+)/g
    ),
  ];

  result.api_functions =
    matches.map(
      (m) => m[1]
    );

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          result,
          null,
          2
        ),
      },
    ],
  };
}