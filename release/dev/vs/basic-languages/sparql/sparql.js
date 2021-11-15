/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/sparql/sparql",[],()=>{
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/basic-languages/sparql/sparql.ts
  var sparql_exports = {};
  __export(sparql_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "#"
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "'", close: "'", notIn: ["string"] },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".rq",
    brackets: [
      { token: "delimiter.curly", open: "{", close: "}" },
      { token: "delimiter.parenthesis", open: "(", close: ")" },
      { token: "delimiter.square", open: "[", close: "]" },
      { token: "delimiter.angle", open: "<", close: ">" }
    ],
    keywords: [
      "add",
      "as",
      "asc",
      "ask",
      "base",
      "by",
      "clear",
      "construct",
      "copy",
      "create",
      "data",
      "delete",
      "desc",
      "describe",
      "distinct",
      "drop",
      "false",
      "filter",
      "from",
      "graph",
      "group",
      "having",
      "in",
      "insert",
      "limit",
      "load",
      "minus",
      "move",
      "named",
      "not",
      "offset",
      "optional",
      "order",
      "prefix",
      "reduced",
      "select",
      "service",
      "silent",
      "to",
      "true",
      "undef",
      "union",
      "using",
      "values",
      "where",
      "with"
    ],
    builtinFunctions: [
      "a",
      "abs",
      "avg",
      "bind",
      "bnode",
      "bound",
      "ceil",
      "coalesce",
      "concat",
      "contains",
      "count",
      "datatype",
      "day",
      "encode_for_uri",
      "exists",
      "floor",
      "group_concat",
      "hours",
      "if",
      "iri",
      "isblank",
      "isiri",
      "isliteral",
      "isnumeric",
      "isuri",
      "lang",
      "langmatches",
      "lcase",
      "max",
      "md5",
      "min",
      "minutes",
      "month",
      "now",
      "rand",
      "regex",
      "replace",
      "round",
      "sameterm",
      "sample",
      "seconds",
      "sha1",
      "sha256",
      "sha384",
      "sha512",
      "str",
      "strafter",
      "strbefore",
      "strdt",
      "strends",
      "strlang",
      "strlen",
      "strstarts",
      "struuid",
      "substr",
      "sum",
      "timezone",
      "tz",
      "ucase",
      "uri",
      "uuid",
      "year"
    ],
    ignoreCase: true,
    tokenizer: {
      root: [
        [/<[^\s\u00a0>]*>?/, "tag"],
        { include: "@strings" },
        [/#.*/, "comment"],
        [/[{}()\[\]]/, "@brackets"],
        [/[;,.]/, "delimiter"],
        [/[_\w\d]+:(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])*/, "tag"],
        [/:(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])+/, "tag"],
        [
          /[$?]?[_\w\d]+/,
          {
            cases: {
              "@keywords": { token: "keyword" },
              "@builtinFunctions": { token: "predefined.sql" },
              "@default": "identifier"
            }
          }
        ],
        [/\^\^/, "operator.sql"],
        [/\^[*+\-<>=&|^\/!?]*/, "operator.sql"],
        [/[*+\-<>=&|\/!?]/, "operator.sql"],
        [/@[a-z\d\-]*/, "metatag.html"],
        [/\s+/, "white"]
      ],
      strings: [
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/'$/, "string.sql", "@pop"],
        [/'/, "string.sql", "@stringBody"],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"$/, "string.sql", "@pop"],
        [/"/, "string.sql", "@dblStringBody"]
      ],
      stringBody: [
        [/[^\\']+/, "string.sql"],
        [/\\./, "string.escape"],
        [/'/, "string.sql", "@pop"]
      ],
      dblStringBody: [
        [/[^\\"]+/, "string.sql"],
        [/\\./, "string.escape"],
        [/"/, "string.sql", "@pop"]
      ]
    }
  };
  return sparql_exports;
})();
return moduleExports;
});
