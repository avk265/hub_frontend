import * as fs from "fs";
import path from "path";
import { HUB_FRONTEND_PATH } from "../config.js";

export async function discoverStateManagementHandler() {

  const storeDir = path.join(
    HUB_FRONTEND_PATH,
    "src",
    "store"
  );

  const result = {
    type: "Zustand",
    stores: [] as any[],
  };

  if (!fs.existsSync(storeDir)) {

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

  const files =
    fs.readdirSync(storeDir);

  for (const file of files) {

    const fullPath =
      path.join(
        storeDir,
        file
      );

    if (
      !file.endsWith(".ts")
    ) {
      continue;
    }

    const content =
      fs.readFileSync(
        fullPath,
        "utf8"
      );

    const actions =
      Array.from(
        content.matchAll(
          /([a-zA-Z0-9_]+)\s*:\s*(?:async\s*)?\(/g
        )
      ).map(
        (m) => m[1]
      );

    result.stores.push({
      file,
      actions,
    });
  }

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