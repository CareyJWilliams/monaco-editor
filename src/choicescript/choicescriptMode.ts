/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { WorkerManager } from './workerManager';
import type { ChoiceScriptWorker } from './choicescriptWorker';
import { LanguageServiceDefaults } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import { editor, Uri, IDisposable, languages, Range } from '../fillers/monaco-editor-core';

export function setupMode(defaults: LanguageServiceDefaults): IDisposable {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<ChoiceScriptWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId, modeConfiguration } = defaults;

		disposeAll(providers);

		if (modeConfiguration.completionItems) {
			providers.push(
				languages.registerCompletionItemProvider(
					languageId,
					new languageFeatures.CompletionAdapter(worker)
				)
			);
		}
		if (modeConfiguration.hovers) {
			providers.push(
				languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker))
			);
		}
		if (modeConfiguration.definitions) {
			providers.push(
				languages.registerDefinitionProvider(
					languageId,
					new languageFeatures.DefinitionAdapter(worker)
				)
			);
		}
		if (modeConfiguration.references) {
			providers.push(
				languages.registerReferenceProvider(
					languageId,
					new languageFeatures.ReferenceAdapter(worker)
				)
			);
		}
		if (modeConfiguration.documentSymbols) {
			providers.push(
				languages.registerDocumentSymbolProvider(
					languageId,
					new languageFeatures.DocumentSymbolAdapter(worker)
				)
			);
		}
		if (true) {
			providers.push(
				languages.registerSignatureHelpProvider(
					languageId,
					new languageFeatures.SignatureHelpAdapter(worker)
				)
			);
		}
		if (modeConfiguration.diagnostics) {
			providers.push(
				languages.registerCodeActionProvider(
					languageId,
					new languageFeatures.CodeActionAdapter(worker)
				)
			);
		}
		if (modeConfiguration.diagnostics) {
			providers.push(new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults));
		}
		if (modeConfiguration.autoFormat) {
			var autoFormatMap: { [key: string]: { match: string; result: string } } = {
				'.': { match: '...', result: '…' }, // ellipsis
				'-': { match: '--', result: '—' } // emdash
			};
			providers.push(
				languages.registerOnTypeFormattingEditProvider(languageId, {
					autoFormatTriggerCharacters: Object.keys(autoFormatMap),
					provideOnTypeFormattingEdits: function (model, position, character, options, token) {
						var matchLength = autoFormatMap[character].match.length;
						var range = new Range(
							position.lineNumber,
							position.column >= matchLength ? position.column - matchLength : 0,
							position.lineNumber,
							position.column
						);
						if (model.getValueInRange(range) === autoFormatMap[character].match) {
							return [
								{
									range: range,
									text: autoFormatMap[character].result
								}
							];
						}
					}
				})
			);
		}
		/* Project-wide/multi-file intellisense manager */
		providers.push(new languageFeatures.IndexAdapter(languageId, worker));

		/* Dictionary Interface Commands */
		disposables.push(
			editor.registerCommand('add-words', (acc, args) => {
				if (Array.isArray(args)) {
					args = args[0];
				}
				worker(args.uri).then((worker) => {
					worker.addWords(args.words).then((results) => {
						defaults.addDictWords(
							args.dict,
							results.filter((w) => w)
						);
					});
				});
			})
		);
		disposables.push(
			editor.registerCommand('remove-words', (acc, args) => {
				worker(args.uri).then((worker) => {
					worker.removeWords(args.words).then((results) => {
						defaults.removeDictWords(
							args.dict,
							results.filter((w) => w)
						);
					});
				});
			})
		);
	}

	worker(new Uri()).then((worker) => {
		let wordsObj = defaults.diagnosticsOptions.spellcheck.userDictionary;
		let wordsArr = [];
		for (let w in wordsObj) {
			wordsArr.push(w);
		}
		worker.addWords(wordsArr);
	});

	registerProviders();

	disposables.push(asDisposable(providers));

	return asDisposable(disposables);
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()!.dispose();
	}
}
