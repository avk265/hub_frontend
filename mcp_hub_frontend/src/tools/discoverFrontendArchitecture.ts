import { discoverPagesHandler }
from "./discoverPages.js";

import { discoverComponentsHandler }
from "./discoverComponents.js";

import { discoverStateManagementHandler }
from "./discoverStateManagement.js";

import { discoverApiLayerHandler }
from "./discoverApiLayer.js";

export async function discoverFrontendArchitectureHandler() {

  const pages =
    await discoverPagesHandler();

  const components =
    await discoverComponentsHandler();

  const state =
    await discoverStateManagementHandler();

  const api =
    await discoverApiLayerHandler();

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            pages,
            components,
            state,
            api,
          },
          null,
          2
        ),
      },
    ],
  };
}