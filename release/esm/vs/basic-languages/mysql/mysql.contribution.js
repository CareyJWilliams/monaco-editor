/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/mysql/mysql.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "mysql",
  extensions: [],
  aliases: ["MySQL", "mysql"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/mysql/mysql"], resolve, reject);
      });
    } else {
      return import("./mysql.js");
    }
  }
});
