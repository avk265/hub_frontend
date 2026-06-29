import fs from "fs";
import path from "path";
import { HUB_FRONTEND_PATH } from "../config.js";

export async function discoverApiDependenciesHandler() {

  const root = path.join(
    HUB_FRONTEND_PATH,
    "src"
  );

  const endpoints = new Set<string>();

  function scan(dir: string) {

    const entries = fs.readdirSync(
      dir,
      { withFileTypes: true }
    );

    for (const entry of entries) {

      const full = path.join(
        dir,
        entry.name
      );

      if (entry.isDirectory()) {

        scan(full);
        continue;
      }

      if (
        !entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".tsx")
      ) {
        continue;
      }

      const content =
        fs.readFileSync(
          full,
          "utf8"
        );

      const matches = [
        ...content.matchAll(
          /\/api\/[a-zA-Z0-9/_-]+/g
        ),
      ];

      matches.forEach(
        (m) => endpoints.add(m[0])
      );
    }
  }

  scan(root);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            count: endpoints.size,
            endpoints: [
              ...endpoints,
            ],
          },
          null,
          2
        ),
      },
    ],
  };
}