/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageServiceDefaults } from './monaco.contribution';
import type { ChoiceScriptWorker } from './choicescriptWorker';
import * as lsTypes from 'vscode-languageserver-types';
import {
	languages,
	editor,
	IMarkdownString,
	Uri,
	Position,
	IRange,
	Range,
	CancellationToken,
	IDisposable,
	MarkerSeverity
} from '../fillers/monaco-editor-core';
import { InsertReplaceEdit, MarkupContent, MarkupKind } from 'vscode-languageserver-types';

export interface WorkerAccessor {
	(first: Uri, ...more: Uri[]): Promise<ChoiceScriptWorker>;
}

// --- diagnostics --- ---

export class DiagnosticsAdapter {
	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(
		private _languageId: string,
		private _worker: WorkerAccessor,
		defaults: LanguageServiceDefaults
	) {
		const onModelAdd = (model: editor.IModel): void => {
			let modeId = model.getLanguageId();
			if (modeId !== this._languageId) {
				return;
			}

			let handle: number;
			this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
				window.clearTimeout(handle);
				handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
			});

			this._doValidate(model.uri, modeId);
		};

		const onModelRemoved = (model: editor.IModel): void => {
			editor.setModelMarkers(model, this._languageId, []);

			let uriStr = model.uri.toString();
			let listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(editor.onWillDisposeModel(onModelRemoved));
		this._disposables.push(
			editor.onDidChangeModelLanguage((event) => {
				onModelRemoved(event.model);
				onModelAdd(event.model);
			})
		);

		this._disposables.push(
			defaults.onDidChange((_) => {
				editor.getModels().forEach((model) => {
					if (model.getLanguageId() === this._languageId) {
						onModelRemoved(model);
						onModelAdd(model);
					}
				});
			})
		);

		this._disposables.push(
			defaults.onDictionaryChange((_) => {
				editor.getModels().forEach((model) => {
					if (model.getLanguageId() === this._languageId) {
						this._doValidate(model.uri, model.getLanguageId());
					}
				});
			})
		);

		this._disposables.push({
			dispose: () => {
				editor.getModels().forEach(onModelRemoved);
				for (let key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		editor.getModels().forEach(onModelAdd);
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables = [];
	}

	private _doValidate(resource: Uri, languageId: string): void {
		this._worker(resource)
			.then((worker) => {
				return worker.doValidation(resource.toString());
			})
			.then((diagnostics) => {
				const markers = diagnostics.map((d) => toDiagnostics(resource, d));
				let model = editor.getModel(resource);
				if (model && model.getLanguageId() === languageId) {
					editor.setModelMarkers(model, languageId, markers);
				}
			})
			.then(undefined, (err) => {
				console.error(err);
			});
	}
}

function toSeverity(lsSeverity: number): MarkerSeverity {
	switch (lsSeverity) {
		case lsTypes.DiagnosticSeverity.Error:
			return MarkerSeverity.Error;
		case lsTypes.DiagnosticSeverity.Warning:
			return MarkerSeverity.Warning;
		case lsTypes.DiagnosticSeverity.Information:
			return MarkerSeverity.Info;
		case lsTypes.DiagnosticSeverity.Hint:
			return MarkerSeverity.Hint;
		default:
			return MarkerSeverity.Info;
	}
}

function toDiagnostics(resource: Uri, diag: lsTypes.Diagnostic): editor.IMarkerData {
	let code = typeof diag.code === 'number' ? String(diag.code) : <string>diag.code;

	return {
		severity: toSeverity(diag.severity),
		startLineNumber: diag.range.start.line + 1,
		startColumn: diag.range.start.character + 1,
		endLineNumber: diag.range.end.line + 1,
		endColumn: diag.range.end.character + 1,
		message: diag.message,
		code: code,
		source: diag.source
	};
}

// --- completion ------

function fromPosition(position: Position): lsTypes.Position {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

function fromRange(range: IRange): lsTypes.Range {
	if (!range) {
		return void 0;
	}
	return {
		start: {
			line: range.startLineNumber - 1,
			character: range.startColumn - 1
		},
		end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
	};
}

function toRange(range: lsTypes.Range): Range {
	if (!range) {
		return void 0;
	}
	return new Range(
		range.start.line + 1,
		range.start.character + 1,
		range.end.line + 1,
		range.end.character + 1
	);
}

function isInsertReplaceEdit(
	edit: lsTypes.TextEdit | InsertReplaceEdit
): edit is InsertReplaceEdit {
	return (
		typeof (<InsertReplaceEdit>edit).insert !== 'undefined' &&
		typeof (<InsertReplaceEdit>edit).replace !== 'undefined'
	);
}

function toCompletionItemKind(kind: number): languages.CompletionItemKind {
	let mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case lsTypes.CompletionItemKind.Text:
			return mItemKind.Text;
		case lsTypes.CompletionItemKind.Method:
			return mItemKind.Method;
		case lsTypes.CompletionItemKind.Function:
			return mItemKind.Function;
		case lsTypes.CompletionItemKind.Constructor:
			return mItemKind.Constructor;
		case lsTypes.CompletionItemKind.Field:
			return mItemKind.Field;
		case lsTypes.CompletionItemKind.Variable:
			return mItemKind.Variable;
		case lsTypes.CompletionItemKind.Class:
			return mItemKind.Class;
		case lsTypes.CompletionItemKind.Interface:
			return mItemKind.Interface;
		case lsTypes.CompletionItemKind.Module:
			return mItemKind.Module;
		case lsTypes.CompletionItemKind.Property:
			return mItemKind.Property;
		case lsTypes.CompletionItemKind.Unit:
			return mItemKind.Unit;
		case lsTypes.CompletionItemKind.Value:
			return mItemKind.Value;
		case lsTypes.CompletionItemKind.Enum:
			return mItemKind.Enum;
		case lsTypes.CompletionItemKind.Keyword:
			return mItemKind.Keyword;
		case lsTypes.CompletionItemKind.Snippet:
			return mItemKind.Snippet;
		case lsTypes.CompletionItemKind.Color:
			return mItemKind.Color;
		case lsTypes.CompletionItemKind.File:
			return mItemKind.File;
		case lsTypes.CompletionItemKind.Reference:
			return mItemKind.Reference;
	}
	return mItemKind.Property;
}

function toTextEdit(textEdit: lsTypes.TextEdit): editor.ISingleEditOperation {
	if (!textEdit) {
		return void 0;
	}
	return {
		range: toRange(textEdit.range),
		text: textEdit.newText
	};
}

export class CompletionAdapter implements languages.CompletionItemProvider {
	constructor(private _worker: WorkerAccessor) {}

	public get triggerCharacters(): string[] {
		return [' ', ':'];
	}

	provideCompletionItems(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.CompletionContext,
		token: CancellationToken
	): Promise<languages.CompletionList> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.doComplete(resource.toString(), fromPosition(position));
			})
			.then((info) => {
				if (!info) {
					return;
				}
				const wordInfo = model.getWordUntilPosition(position);
				const wordRange = new Range(
					position.lineNumber,
					wordInfo.startColumn,
					position.lineNumber,
					wordInfo.endColumn
				);

				let items: languages.CompletionItem[] = info.items.map((entry) => {
					let item: languages.CompletionItem = {
						label: entry.label,
						insertText: entry.insertText || entry.label,
						sortText: entry.sortText,
						filterText: entry.filterText,
						documentation: entry.documentation ? toMarkdownString(entry.documentation) : undefined,
						detail: entry.detail,
						range: wordRange,
						kind: toCompletionItemKind(entry.kind)
					};
					if (entry.textEdit) {
						if (isInsertReplaceEdit(entry.textEdit)) {
							item.range = {
								insert: toRange(entry.textEdit.insert),
								replace: toRange(entry.textEdit.replace)
							};
						} else {
							item.range = toRange(entry.textEdit.range);
						}
						item.insertText = entry.textEdit.newText;
					}
					if (entry.additionalTextEdits) {
						item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit);
					}
					if (entry.insertTextFormat === lsTypes.InsertTextFormat.Snippet) {
						item.insertTextRules = languages.CompletionItemInsertTextRule.InsertAsSnippet;
					}
					return item;
				});

				return {
					isIncomplete: info.isIncomplete,
					suggestions: items
				};
			});
	}
}

function isMarkupContent(thing: any): thing is lsTypes.MarkupContent {
	return (
		thing && typeof thing === 'object' && typeof (<lsTypes.MarkupContent>thing).kind === 'string'
	);
}

function toMarkdownString(entry: lsTypes.MarkupContent | lsTypes.MarkedString): IMarkdownString {
	if (typeof entry === 'string') {
		return {
			value: entry
		};
	}
	if (isMarkupContent(entry)) {
		if (entry.kind === 'plaintext') {
			return {
				value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&')
			};
		}
		return {
			value: entry.value
		};
	}

	return { value: '```' + entry.language + '\n' + entry.value + '\n```\n' };
}

function toMarkedStringArray(
	contents: lsTypes.MarkupContent | lsTypes.MarkedString | lsTypes.MarkedString[]
): IMarkdownString[] {
	if (!contents) {
		return void 0;
	}
	if (Array.isArray(contents)) {
		return contents.map(toMarkdownString);
	}
	return [toMarkdownString(contents)];
}

// --- hover ------

export class HoverAdapter implements languages.HoverProvider {
	constructor(private _worker: WorkerAccessor) {}

	provideHover(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Hover> {
		let resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.doHover(resource.toString(), fromPosition(position));
			})
			.then((info) => {
				if (!info) {
					return;
				}
				return <languages.Hover>{
					range: toRange(info.range),
					contents: toMarkedStringArray(info.contents)
				};
			});
	}
}

// --- CodeActions, Spelling QuickFix ---

export class CodeActionAdapter implements languages.CodeActionProvider {
	constructor(private _worker: WorkerAccessor) {}
	provideCodeActions(
		model: editor.IReadOnlyModel,
		range: Range,
		context: languages.CodeActionContext,
		token: CancellationToken
	): Promise<languages.CodeActionList> {
		let resource = model.uri;
		let words = [];
		return this._worker(resource)
			.then((worker) => {
				let markers = context.markers;
				if (markers.length <= 0) return null;
				// Only use is spellings (for now), and we limit
				// the results to the first one, regardless of context,
				// for performance reasons.
				markers = markers.filter((m) => m.code === 'badSpelling');
				markers = markers.slice(0, 1); //
				for (let m of markers) {
					var wordRange = new Range(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn);
					let word = model.getWordAtPosition(
						new Position(wordRange.startLineNumber, wordRange.startColumn)
					);
					if (!word) continue;
					words.push({ word: word.word, range: wordRange });
				}
				if (words.length <= 0) return null;
				return worker.suggestSpelling(words.map((w) => w.word));
			})
			.then((results) => {
				if (!results) return null;
				let actions = [];
				if (results.length > 0) {
					for (var i = 0; i < results[0].length; i++) {
						actions.push({
							title: 'Correct spelling: ' + results[0][i],
							kind: 'quickfix',
							edit: {
								edits: [
									{ edit: { range: words[0].range, text: results[0][i] }, resource: model.uri }
								]
							}
						});
					}
				}
				actions.push({
					title: "Ignore '" + words[0].word + "' this session",
					kind: 'quickfix',
					command: {
						id: 'add-words',
						title: 'Ignore Word',
						arguments: [{ uri: resource, dict: 'session', words: [words[0].word] }]
					}
				}),
					actions.push({
						title: "Add '" + words[0].word + "' to the User Dictionary",
						kind: 'quickfix',
						command: {
							id: 'add-words',
							title: 'Add Word',
							arguments: [{ uri: resource, dict: 'persistent', words: [words[0].word] }]
						}
					});
				return actions.length > 0
					? <languages.CodeActionList>{
							actions: actions,
							dispose: () => {}
					  }
					: null;
			});
	}
}

// --- SignatureHelp, Spelling QuickFix ---

function getSceneName(path): string {
	return path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.txt'));
}

export class SignatureHelpAdapter implements languages.SignatureHelpProvider {
	constructor(private _worker: WorkerAccessor) {}
	signatureHelpTriggerCharacters = [' '];
	provideSignatureHelp(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken,
		context: languages.SignatureHelpContext
	): Promise<languages.SignatureHelpResult> {
		let resource = model.uri;
		return this._worker(resource).then((worker) => {
			let line = model.getLineContent(position.lineNumber);
			let gosub_scene;
			let match;
			if ((match = line.match(/^(\s*\*gosub_scene\s+(\w+)\s+(\w+))/))) {
				gosub_scene = true;
			} else if ((match = line.match(/^(\s*\*gosub\s+(\w+))/))) {
				gosub_scene = false;
			} else {
				return null;
			}
			let paramIndex = line
				.slice(match[1].length)
				.trim()
				.split(' ')
				.filter((e) => e).length;
			return worker
				.getRoutineInfo(resource.toString(), model.getOffsetAt(position))
				.then((info) => {
					if (info)
						return {
							value: {
								signatures: [
									{
										label: `${match[2]}.txt -> ${match[3]}: ${info.parameters
											.map((p) => p.label)
											.join(' ')}`,
										parameters: info.parameters
									}
								],
								activeSignature: info.activeSignature,
								activeParameter: info.activeParameter
							},
							dispose: () => {}
						};
					return null;
				});
		});
	}
}

// --- definition ------

function toLocation(location: lsTypes.Location): languages.Location {
	return {
		uri: Uri.parse(location.uri),
		range: toRange(location.range)
	};
}

export class DefinitionAdapter {
	constructor(private _worker: WorkerAccessor) {}

	public provideDefinition(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.Definition> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.findDefinition(resource.toString(), fromPosition(position));
			})
			.then((definition) => {
				if (!definition) {
					return;
				}
				return [toLocation(definition)];
			});
	}
}

// --- references ------

export class ReferenceAdapter implements languages.ReferenceProvider {
	constructor(private _worker: WorkerAccessor) {}

	provideReferences(
		model: editor.IReadOnlyModel,
		position: Position,
		context: languages.ReferenceContext,
		token: CancellationToken
	): Promise<languages.Location[]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.findReferences(resource.toString(), fromPosition(position));
			})
			.then((entries) => {
				if (!entries) {
					return;
				}
				return entries.map(toLocation);
			});
	}
}

// --- document symbols ------

function toSymbolKind(kind: lsTypes.SymbolKind): languages.SymbolKind {
	let mKind = languages.SymbolKind;

	switch (kind) {
		case lsTypes.SymbolKind.File:
			return mKind.Array;
		case lsTypes.SymbolKind.Module:
			return mKind.Module;
		case lsTypes.SymbolKind.Namespace:
			return mKind.Namespace;
		case lsTypes.SymbolKind.Package:
			return mKind.Package;
		case lsTypes.SymbolKind.Class:
			return mKind.Class;
		case lsTypes.SymbolKind.Method:
			return mKind.Method;
		case lsTypes.SymbolKind.Property:
			return mKind.Property;
		case lsTypes.SymbolKind.Field:
			return mKind.Field;
		case lsTypes.SymbolKind.Constructor:
			return mKind.Constructor;
		case lsTypes.SymbolKind.Enum:
			return mKind.Enum;
		case lsTypes.SymbolKind.Interface:
			return mKind.Interface;
		case lsTypes.SymbolKind.Function:
			return mKind.Function;
		case lsTypes.SymbolKind.Variable:
			return mKind.Variable;
		case lsTypes.SymbolKind.Constant:
			return mKind.Constant;
		case lsTypes.SymbolKind.String:
			return mKind.String;
		case lsTypes.SymbolKind.Number:
			return mKind.Number;
		case lsTypes.SymbolKind.Boolean:
			return mKind.Boolean;
		case lsTypes.SymbolKind.Array:
			return mKind.Array;
	}
	return mKind.Function;
}

export class DocumentSymbolAdapter implements languages.DocumentSymbolProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentSymbols(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.DocumentSymbol[]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentSymbols(resource.toString()))
			.then((items) => {
				if (!items) {
					return;
				}
				return items.map((item) => ({
					name: item.name,
					detail: '',
					containerName: item.containerName,
					kind: toSymbolKind(item.kind),
					tags: [],
					range: toRange(item.location.range),
					selectionRange: toRange(item.location.range) // location: item.location?
				}));
			});
	}
}

export class IndexAdapter {
	private _disposables: IDisposable[] = [];
	private _listener: { [uri: string]: IDisposable } = Object.create(null);

	constructor(private _languageId: string, private _worker: WorkerAccessor) {
		const onModelAdd = (model: editor.IModel): void => {
			let modeId = model.getLanguageId();
			if (modeId !== this._languageId) {
				return;
			}

			let handle: number;
			this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
				window.clearTimeout(handle);
				// we can probably get away with debouncing/delaying this a good while
				// as it's unlikely we'll need an up-to-date index of the scene we're currently editing
				handle = window.setTimeout(() => this._updateIndex(model.uri), 1000);
			});

			this._updateIndex(model.uri);
		};

		const onModelRemoved = (model: editor.IModel): void => {
			this._removeIndex(model.uri);

			let uriStr = model.uri.toString();
			let listener = this._listener[uriStr];
			if (listener) {
				listener.dispose();
				delete this._listener[uriStr];
			}
		};

		this._disposables.push(editor.onDidCreateModel(onModelAdd));
		this._disposables.push(editor.onWillDisposeModel(onModelRemoved));

		this._disposables.push({
			dispose: () => {
				for (let key in this._listener) {
					this._listener[key].dispose();
				}
			}
		});

		editor.getModels().forEach(onModelAdd);
	}

	private _updateIndex(resource: Uri): void {
		this._worker(resource).then((worker) => {
			return worker.updateIndex(resource.toString());
		});
	}

	private _removeIndex(resource: Uri): void {
		this._worker(resource).then((worker) => {
			return worker.removeIndex(resource.toString());
		});
	}

	public dispose(): void {
		this._disposables.forEach((d) => d && d.dispose());
		this._disposables = [];
	}
}
