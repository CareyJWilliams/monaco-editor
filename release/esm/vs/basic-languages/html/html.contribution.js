/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

// src/basic-languages/html/html.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "html",
  extensions: [".html", ".htm", ".shtml", ".xhtml", ".mdoc", ".jsp", ".asp", ".aspx", ".jshtm"],
  aliases: ["HTML", "htm", "html", "xhtml"],
  mimetypes: ["text/html", "text/x-jshtm", "text/template", "text/ng-template"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/html/html"], resolve, reject);
      });
    } else {
      return import("./html.js");
    }
  }
});
