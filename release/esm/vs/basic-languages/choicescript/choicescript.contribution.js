/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/choicescript/choicescript.contribution.ts
import { registerLanguage, registerTheme } from "../_.contribution.js";

// src/basic-languages/choicescript/choicescript.themes.ts
var csDark = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "extra-keywords", foreground: "DA9ED3" },
    { token: "flow-command", foreground: "599EFF" },
    { token: "command", foreground: "FFA500" },
    { token: "conditional", foreground: "FFA500" },
    { token: "choice-option", foreground: "92A75C" }
  ],
  colors: {}
};
var csLight = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "extra-keywords", foreground: "EE82EE" },
    { token: "flow-command", foreground: "E9692C" },
    { token: "command", foreground: "0000FF" },
    { token: "choice-option", foreground: "FF0000" }
  ],
  colors: {}
};

// src/basic-languages/choicescript/choicescript.contribution.ts
registerTheme("cs-dark", csDark);
registerTheme("cs-light", csLight);
registerLanguage({
  id: "choicescript",
  extensions: [".txt"],
  aliases: ["ChoiceScript", "cs"],
  loader: () => import("./choicescript.js")
});
