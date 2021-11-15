import '../../editor/editor.api.js';
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

// src/choicescript/monaco.contribution.ts
var SpellCheckDictionary;
(function(SpellCheckDictionary2) {
  SpellCheckDictionary2["EN_US"] = "en_US";
  SpellCheckDictionary2["EN_GB"] = "en_GB";
})(SpellCheckDictionary || (SpellCheckDictionary = {}));
var DictionaryEvent = class {
};
var LanguageServiceDefaultsImpl = class {
  constructor(languageId, diagnosticsOptions, modeConfiguration) {
    this._onDidChange = new monaco_editor_core_exports.Emitter();
    this._onDidDictionaryChange = new monaco_editor_core_exports.Emitter();
    this._languageId = languageId;
    this.setDiagnosticsOptions(diagnosticsOptions);
    this.setModeConfiguration(modeConfiguration);
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  get onDictionaryChange() {
    return this._onDidDictionaryChange.event;
  }
  get languageId() {
    return this._languageId;
  }
  get modeConfiguration() {
    return this._modeConfiguration;
  }
  get diagnosticsOptions() {
    return this._diagnosticsOptions;
  }
  addDictWords(dict, words) {
    this._onDidDictionaryChange.fire({
      dictionary: dict,
      removed: false,
      words
    });
  }
  removeDictWords(dict, words) {
    this._onDidDictionaryChange.fire({
      dictionary: dict,
      removed: true,
      words
    });
  }
  setDiagnosticsOptions(options) {
    this._diagnosticsOptions = options || Object.create(null);
    this._onDidChange.fire(this);
  }
  setModeConfiguration(modeConfiguration) {
    this._modeConfiguration = modeConfiguration || Object.create(null);
    this._onDidChange.fire(this);
  }
};
var diagnosticDefault = {
  validate: true,
  lint: { enabled: true },
  spellcheck: {
    enabled: true,
    paths: {
      affix: "https://raw.githubusercontent.com/cfinke/Typo.js/master/typo/dictionaries/en_US/en_US.aff",
      dics: [
        "https://raw.githubusercontent.com/cfinke/Typo.js/master/typo/dictionaries/en_US/en_US.dic"
      ]
    },
    dictionary: SpellCheckDictionary.EN_US,
    userDictionary: null
  }
};
var modeConfigurationDefault = {
  completionItems: true,
  hovers: true,
  documentSymbols: true,
  definitions: true,
  references: true,
  documentHighlights: true,
  rename: true,
  colors: true,
  foldingRanges: true,
  diagnostics: true,
  selectionRanges: true,
  autoFormat: false,
  documentFormattingEdits: false,
  documentRangeFormattingEdits: false,
  tokens: true
};
var choicescriptDefaults = new LanguageServiceDefaultsImpl("choicescript", diagnosticDefault, modeConfigurationDefault);
monaco_editor_core_exports.languages.choicescript = choicescriptDefaults;
function getCSMode() {
  return import("./choicescriptMode.js");
}
monaco_editor_core_exports.languages.onLanguage("choicescript", () => {
  getCSMode().then((mode) => {
    monaco_editor_core_exports.languages.choicescriptDispose = mode.setupMode(choicescriptDefaults);
    choicescriptDefaults.onDidChange(() => {
      monaco_editor_core_exports.languages.choicescriptDispose?.dispose();
      monaco_editor_core_exports.languages.choicescriptDispose = mode.setupMode(choicescriptDefaults);
    });
  });
});
export {
  DictionaryEvent,
  choicescriptDefaults
};
