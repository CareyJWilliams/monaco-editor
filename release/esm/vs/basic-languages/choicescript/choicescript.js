/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};

// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {};
__markAsModule(monaco_editor_core_exports);
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
import * as monaco_editor_core_star from "../../editor/editor.api.js";

// src/basic-languages/choicescript/choicescript.ts
var conf = {
  onEnterRules: [
    {
      beforeText: new RegExp("^\\s*(:?#|\\*(?:" + [
        "achievement",
        "choice",
        "else",
        "elseif",
        "elsif",
        "fake_choice",
        "if",
        "scene_list",
        "stat_chart"
      ].join("|") + ")).*\\s*$"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Indent }
    },
    {
      beforeText: new RegExp("^\\s*\\*(?:" + ["ending", "finish", "goto", "goto_scene", "redirect_scene"].join("|") + ").*\\s*$"),
      action: { indentAction: monaco_editor_core_exports.languages.IndentAction.Outdent }
    }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
};
var language = {
  includeLF: true,
  ignoreCase: true,
  tokenPostfix: ".choicescript",
  commands: [
    "abort",
    "achieve",
    "achievement",
    "advertisement",
    "allow_reuse",
    "author",
    "bug",
    "check_achievements",
    "check_purchase",
    "check_registration",
    "choice",
    "create",
    "delay_break",
    "delay_ending",
    "delete",
    "disable_reuse",
    "else",
    "elseif",
    "elsif",
    "end_trial",
    "ending",
    "fake_choice",
    "finish",
    "gosub",
    "gosub_scene",
    "goto",
    "goto_random_scene",
    "goto_scene",
    "gotoref",
    "hide_reuse",
    "if",
    "image",
    "input_number",
    "input_text",
    "label",
    "line_break",
    "link",
    "link_button",
    "login",
    "looplimit",
    "more_games",
    "page_break",
    "params",
    "print",
    "purchase",
    "purchase_discount",
    "rand",
    "redirect_scene",
    "reset",
    "restart",
    "restore_game",
    "restore_purchases",
    "return",
    "save_game",
    "scene_list",
    "script",
    "selectable_if",
    "set",
    "setref",
    "share_this_game",
    "show_password",
    "sound",
    "stat_chart",
    "subscribe",
    "temp",
    "title"
  ],
  indentCommands: [
    "achievement",
    "choice",
    "else",
    "elseif",
    "elsif",
    "fake_choice",
    "if",
    "scene_list",
    "stat_chart"
  ],
  dedentCommands: ["ending", "finish", "goto", "goto_scene", "redirect_scene"],
  optionCommands: ["allow_reuse", "disable_reuse", "hide_reuse"],
  flowCommands: [
    "gosub",
    "gosub_scene",
    "goto",
    "goto_random_scene",
    "goto_scene",
    "gotoref",
    "label",
    "redirect_scene",
    "return"
  ],
  unquotedStringCommands: ["bug", "image", "text_image", "sound", "page_break"],
  csPlusCommands: [
    "console_log",
    "console_track",
    "console_track_all",
    "console_untrack_all",
    "console_untrack",
    "console_clear",
    "console_track_list",
    "cside_theme_set",
    "cside_theme_apply",
    "sm_save",
    "sm_load",
    "sm_delete",
    "sm_update",
    "sm_menu"
  ],
  symbols: /[=><&+\-*\/\^%!#]+/,
  operators: [
    "#",
    "&",
    "%-",
    "%+",
    "-",
    "+",
    "/",
    "*",
    "<",
    ">",
    "<=",
    ">=",
    "=",
    "!=",
    "and",
    "or",
    "modulo"
  ],
  brackets: [
    { open: "{", close: "}", token: "bracket" },
    { open: "[", close: "]", token: "bracket" },
    { open: "(", close: ")", token: "bracket" }
  ],
  escapes: /[\\"]/,
  tokenizer: {
    root: [
      {
        regex: /[ \t]+/,
        token: "whitespace"
      },
      {
        regex: /\*[A-Za-z_]+/,
        action: {
          token: "@rematch",
          switchTo: "@command_line"
        }
      },
      {
        regex: /[^*].*/,
        action: { token: "@rematch", switchTo: "@text_line" }
      }
    ],
    command_line: [
      {
        regex: /\*\w+/,
        action: { token: "@rematch", next: "@command" }
      },
      {
        regex: /\n/,
        action: {
          token: "linebreak",
          switchTo: "@root"
        }
      },
      {
        regex: /[ \t]+/,
        action: { token: "whitespace" }
      },
      { include: "@expression" }
    ],
    text_line: [
      {
        regex: /#/,
        action: { token: "choice-marker" }
      },
      {
        regex: /\n/,
        action: {
          token: "linebreak",
          switchTo: "@root"
        }
      },
      { include: "@variable" },
      {
        regex: /[ \t]+/,
        action: { token: "whitespace" }
      }
    ],
    command: [
      {
        regex: "\\*comment.*",
        action: { token: "comment", next: "@pop" }
      },
      {
        regex: /(?:\*)(\w+)/,
        action: {
          cases: {
            "$1@unquotedStringCommands": {
              token: "command",
              switchTo: "@unquoted_string"
            },
            "$1@optionCommands": { token: "keyword", switchTo: "@reuse_option" },
            "$1@flowCommands": { token: "flow-command", next: "@pop" },
            "$1@csPlusCommands": { token: "extra-keywords", next: "@pop" },
            "$1@commands": { token: "command", next: "@pop" },
            "@default": { token: "invalid" }
          }
        }
      }
    ],
    unquoted_string: [
      { include: "@string_body" },
      [/"/, "delim"],
      { regex: /\n/, action: { token: "whitespace", next: "@pop" } },
      { regex: /\|/, action: { token: "whitespace", next: "@pop" } }
    ],
    string: [
      [
        /\n/,
        {
          token: "linebreak",
          bracket: "@close",
          next: "@popall",
          switchTo: "@root"
        }
      ],
      { include: "@string_body" },
      [/\\"/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],
    string_body: [{ include: "@variable" }, [/[^\\@\$"\n]+/, { token: "string.string" }]],
    variable: [
      {
        regex: /\$\{/,
        action: { token: "@rematch", next: "@varreplace" }
      },
      {
        regex: /@\{/,
        action: { token: "@rematch", next: "@multireplace" }
      }
    ],
    varreplace: [
      { regex: /\$\{/, action: { token: "bracket.var", bracket: "@open" } },
      { regex: /\}/, action: { token: "bracket.var", bracket: "@close", next: "@pop" } },
      { include: "@expression" }
    ],
    multireplace: [
      { regex: /@{/, action: { token: "bracket.multi", bracket: "@open" } },
      { regex: /\}/, action: { token: "bracket.multi", bracket: "@close", next: "@pop" } },
      { include: "@expression" },
      { include: "@unquoted_string" }
    ],
    expression: [
      [/\n/, { token: "linebreak", next: "@popall" }],
      {
        regex: /\b[A-Za-z_]+\w*/,
        action: {
          cases: {
            "(true|false)": { token: "keyword" },
            "(not|length|round|timestamp|log|auto)": { token: "function" },
            "(and|or|modulo)": { token: "operator" },
            "@default": { token: "identifier" }
          }
        }
      },
      {
        regex: '"',
        action: { token: "string.quote", bracket: "@open", next: "@string" }
      },
      {
        regex: /\b[0-9]+\b/,
        action: { token: "number" }
      },
      {
        regex: /[{]/,
        action: { token: "bracket.deref", bracket: "@open", next: "@push" }
      },
      {
        regex: /[}]/,
        action: { token: "bracket.deref", bracket: "@close", next: "@pop" }
      },
      [/[\[\]()]/, "@brackets"],
      [
        "@symbols",
        {
          cases: {
            "@operators": { token: "operator" }
          }
        }
      ]
    ],
    reuse_option: [
      [/\s*#/, { token: "@rematch", switchTo: "@text_line" }],
      [/\s*\*(selectable_if|if)/, { token: "@rematch", switchTo: "@command" }],
      [/^\s*/, { token: "rematch", next: "@pop" }]
    ]
  }
};
export {
  conf,
  language
};
