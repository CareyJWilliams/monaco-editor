/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/sql/sql.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "sql",
  extensions: [".sql"],
  aliases: ["SQL"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/sql/sql"], resolve, reject);
      });
    } else {
      return import("./sql.js");
    }
  }
});
