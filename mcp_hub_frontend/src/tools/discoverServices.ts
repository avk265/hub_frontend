import fs from "fs";
import path from "path";
import { HUB_FRONTEND_PATH } from "../config.js";

export async function discoverServicesHandler() {

  const candidates = [
    path.join(HUB_FRONTEND_PATH, "src", "services"),
    path.join(HUB_FRONTEND_PATH, "src", "lib"),
  ];

  const services: string[] = [];

  for (const dir of candidates) {

    if (!fs.existsSync(dir)) {
      continue;
    }

    function scan(folder: string) {

      const entries = fs.readdirSync(
        folder,
        { withFileTypes: true }
      );

      for (const entry of entries) {

        const full = path.join(
          folder,
          entry.name
        );

        if (entry.isDirectory()) {

          scan(full);
          continue;
        }

        if (
          entry.name.endsWith(".ts") ||
          entry.name.endsWith(".tsx")
        ) {

          services.push(
            path.relative(
              HUB_FRONTEND_PATH,
              full
            )
          );
        }
      }
    }

    scan(dir);
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            count: services.length,
            services,
          },
          null,
          2
        ),
      },
    ],
  };
}