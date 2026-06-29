import fs from "fs";
import path from "path";
import { HUB_FRONTEND_PATH } from "../config.js";

export async function discoverComponentsHandler() {

  const root = path.join(
    HUB_FRONTEND_PATH,
    "src",
    "components"
  );

  const components: string[] = [];

  if (!fs.existsSync(root)) {

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              count: 0,
              components: [],
            },
            null,
            2
          ),
        },
      ],
    };
  }

  function scan(dir: string) {

    const entries = fs.readdirSync(
      dir,
      {
        withFileTypes: true,
      }
    );

    for (const entry of entries) {

      const fullPath = path.join(
        dir,
        entry.name
      );

      if (entry.isDirectory()) {

        scan(fullPath);
        continue;
      }

      if (
        entry.name.endsWith(".tsx") ||
        entry.name.endsWith(".ts")
      ) {

        components.push(
          path.relative(
            root,
            fullPath
          )
        );
      }
    }
  }

  scan(root);

  components.sort();

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            count: components.length,
            components,
          },
          null,
          2
        ),
      },
    ],
  };
}