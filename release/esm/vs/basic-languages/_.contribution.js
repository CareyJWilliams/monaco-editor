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
import * as monaco_editor_core_star from "../editor/editor.api.js";

// src/basic-languages/_.contribution.ts
var IStandaloneThemeData = monaco_editor_core_exports.editor.IStandaloneThemeData;
var languageDefinitions = {};
var lazyLanguageLoaders = {};
var LazyLanguageLoader = class {
  static getOrCreate(languageId) {
    if (!lazyLanguageLoaders[languageId]) {
      lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId);
    }
    return lazyLanguageLoaders[languageId];
  }
  constructor(languageId) {
    this._languageId = languageId;
    this._loadingTriggered = false;
    this._lazyLoadPromise = new Promise((resolve, reject) => {
      this._lazyLoadPromiseResolve = resolve;
      this._lazyLoadPromiseReject = reject;
    });
  }
  whenLoaded() {
    return this._lazyLoadPromise;
  }
  load() {
    if (!this._loadingTriggered) {
      this._loadingTriggered = true;
      languageDefinitions[this._languageId].loader().then((mod) => this._lazyLoadPromiseResolve(mod), (err) => this._lazyLoadPromiseReject(err));
    }
    return this._lazyLoadPromise;
  }
};
function loadLanguage(languageId) {
  return LazyLanguageLoader.getOrCreate(languageId).load();
}
function registerLanguage(def) {
  const languageId = def.id;
  languageDefinitions[languageId] = def;
  monaco_editor_core_exports.languages.register(def);
  const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);
  monaco_editor_core_exports.languages.setMonarchTokensProvider(languageId, lazyLanguageLoader.whenLoaded().then((mod) => mod.language));
  monaco_editor_core_exports.languages.onLanguage(languageId, () => {
    lazyLanguageLoader.load().then((mod) => {
      monaco_editor_core_exports.languages.setLanguageConfiguration(languageId, mod.conf);
    });
  });
}
function registerTheme(themeName, themeData) {
  monaco_editor_core_exports.editor.defineTheme(themeName, themeData);
}
export {
  loadLanguage,
  registerLanguage,
  registerTheme
};
