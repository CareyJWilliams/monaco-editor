/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { HTMLWorker } from './htmlWorker';
import * as lsTypes from 'vscode-languageserver-types';
import {
	languages,
	editor,
	Uri,
	Position,
	Range,
	CancellationToken,
	IMarkdownString
} from '../fillers/monaco-editor-core';

export interface WorkerAccessor {
	(...more: Uri[]): Promise<HTMLWorker>;
}

// --- completion ------

function fromPosition(position: Position): lsTypes.Position {
	if (!position) {
		return void 0;
	}
	return { character: position.column - 1, line: position.lineNumber - 1 };
}

function fromRange(range: Range): lsTypes.Range {
	if (!range) {
		return void 0;
	}
	return {
		start: fromPosition(range.getStartPosition()),
		end: fromPosition(range.getEndPosition())
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
	edit: lsTypes.TextEdit | lsTypes.InsertReplaceEdit
): edit is lsTypes.InsertReplaceEdit {
	return (
		typeof (<lsTypes.InsertReplaceEdit>edit).insert !== 'undefined' &&
		typeof (<lsTypes.InsertReplaceEdit>edit).replace !== 'undefined'
	);
}

function toCompletionItemKind(kind: number): languages.CompletionItemKind {
	const mItemKind = languages.CompletionItemKind;

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

function fromCompletionItemKind(kind: languages.CompletionItemKind): lsTypes.CompletionItemKind {
	const mItemKind = languages.CompletionItemKind;

	switch (kind) {
		case mItemKind.Text:
			return lsTypes.CompletionItemKind.Text;
		case mItemKind.Method:
			return lsTypes.CompletionItemKind.Method;
		case mItemKind.Function:
			return lsTypes.CompletionItemKind.Function;
		case mItemKind.Constructor:
			return lsTypes.CompletionItemKind.Constructor;
		case mItemKind.Field:
			return lsTypes.CompletionItemKind.Field;
		case mItemKind.Variable:
			return lsTypes.CompletionItemKind.Variable;
		case mItemKind.Class:
			return lsTypes.CompletionItemKind.Class;
		case mItemKind.Interface:
			return lsTypes.CompletionItemKind.Interface;
		case mItemKind.Module:
			return lsTypes.CompletionItemKind.Module;
		case mItemKind.Property:
			return lsTypes.CompletionItemKind.Property;
		case mItemKind.Unit:
			return lsTypes.CompletionItemKind.Unit;
		case mItemKind.Value:
			return lsTypes.CompletionItemKind.Value;
		case mItemKind.Enum:
			return lsTypes.CompletionItemKind.Enum;
		case mItemKind.Keyword:
			return lsTypes.CompletionItemKind.Keyword;
		case mItemKind.Snippet:
			return lsTypes.CompletionItemKind.Snippet;
		case mItemKind.Color:
			return lsTypes.CompletionItemKind.Color;
		case mItemKind.File:
			return lsTypes.CompletionItemKind.File;
		case mItemKind.Reference:
			return lsTypes.CompletionItemKind.Reference;
	}
	return lsTypes.CompletionItemKind.Property;
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

function toCommand(c: lsTypes.Command | undefined): languages.Command {
	return c && c.command === 'editor.action.triggerSuggest'
		? { id: c.command, title: c.title, arguments: c.arguments }
		: undefined;
}

export class CompletionAdapter implements languages.CompletionItemProvider {
	constructor(private _worker: WorkerAccessor) {}

	public get triggerCharacters(): string[] {
		return ['.', ':', '<', '"', '=', '/'];
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

				const items: languages.CompletionItem[] = info.items.map((entry) => {
					const item: languages.CompletionItem = {
						label: entry.label,
						insertText: entry.insertText || entry.label,
						sortText: entry.sortText,
						filterText: entry.filterText,
						documentation: entry.documentation,
						command: toCommand(entry.command),
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

// --- hover ------

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

// --- document highlights ------

function toHighlighKind(kind: lsTypes.DocumentHighlightKind): languages.DocumentHighlightKind {
	const mKind = languages.DocumentHighlightKind;

	switch (kind) {
		case lsTypes.DocumentHighlightKind.Read:
			return mKind.Read;
		case lsTypes.DocumentHighlightKind.Write:
			return mKind.Write;
		case lsTypes.DocumentHighlightKind.Text:
			return mKind.Text;
	}
	return mKind.Text;
}

export class DocumentHighlightAdapter implements languages.DocumentHighlightProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentHighlights(
		model: editor.IReadOnlyModel,
		position: Position,
		token: CancellationToken
	): Promise<languages.DocumentHighlight[]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position)))
			.then((items) => {
				if (!items) {
					return;
				}
				return items.map((item) => ({
					range: toRange(item.range),
					kind: toHighlighKind(item.kind)
				}));
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
					selectionRange: toRange(item.location.range)
				}));
			});
	}
}

export class DocumentLinkAdapter implements languages.LinkProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideLinks(
		model: editor.IReadOnlyModel,
		token: CancellationToken
	): Promise<languages.ILinksList> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.findDocumentLinks(resource.toString()))
			.then((items) => {
				if (!items) {
					return;
				}
				return {
					links: items.map((item) => ({
						range: toRange(item.range),
						url: item.target
					}))
				};
			});
	}
}

function fromFormattingOptions(options: languages.FormattingOptions): lsTypes.FormattingOptions {
	return {
		tabSize: options.tabSize,
		insertSpaces: options.insertSpaces
	};
}

export class DocumentFormattingEditProvider implements languages.DocumentFormattingEditProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentFormattingEdits(
		model: editor.IReadOnlyModel,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<editor.ISingleEditOperation[]> {
		const resource = model.uri;

		return this._worker(resource).then((worker) => {
			return worker
				.format(resource.toString(), null, fromFormattingOptions(options))
				.then((edits) => {
					if (!edits || edits.length === 0) {
						return;
					}
					return edits.map(toTextEdit);
				});
		});
	}
}

export class DocumentRangeFormattingEditProvider
	implements languages.DocumentRangeFormattingEditProvider
{
	constructor(private _worker: WorkerAccessor) {}

	public provideDocumentRangeFormattingEdits(
		model: editor.IReadOnlyModel,
		range: Range,
		options: languages.FormattingOptions,
		token: CancellationToken
	): Promise<editor.ISingleEditOperation[]> {
		const resource = model.uri;

		return this._worker(resource).then((worker) => {
			return worker
				.format(resource.toString(), fromRange(range), fromFormattingOptions(options))
				.then((edits) => {
					if (!edits || edits.length === 0) {
						return;
					}
					return edits.map(toTextEdit);
				});
		});
	}
}

export class RenameAdapter implements languages.RenameProvider {
	constructor(private _worker: WorkerAccessor) {}

	provideRenameEdits(
		model: editor.IReadOnlyModel,
		position: Position,
		newName: string,
		token: CancellationToken
	): Promise<languages.WorkspaceEdit> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => {
				return worker.doRename(resource.toString(), fromPosition(position), newName);
			})
			.then((edit) => {
				return toWorkspaceEdit(edit);
			});
	}
}

function toWorkspaceEdit(edit: lsTypes.WorkspaceEdit): languages.WorkspaceEdit {
	if (!edit || !edit.changes) {
		return void 0;
	}
	let resourceEdits: languages.WorkspaceTextEdit[] = [];
	for (let uri in edit.changes) {
		const _uri = Uri.parse(uri);
		for (let e of edit.changes[uri]) {
			resourceEdits.push({
				resource: _uri,
				edit: {
					range: toRange(e.range),
					text: e.newText
				}
			});
		}
	}
	return {
		edits: resourceEdits
	};
}

export class FoldingRangeAdapter implements languages.FoldingRangeProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideFoldingRanges(
		model: editor.IReadOnlyModel,
		context: languages.FoldingContext,
		token: CancellationToken
	): Promise<languages.FoldingRange[]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.getFoldingRanges(resource.toString(), context))
			.then((ranges) => {
				if (!ranges) {
					return;
				}
				return ranges.map((range) => {
					const result: languages.FoldingRange = {
						start: range.startLine + 1,
						end: range.endLine + 1
					};
					if (typeof range.kind !== 'undefined') {
						result.kind = toFoldingRangeKind(<lsTypes.FoldingRangeKind>range.kind);
					}
					return result;
				});
			});
	}
}

function toFoldingRangeKind(kind: lsTypes.FoldingRangeKind): languages.FoldingRangeKind {
	switch (kind) {
		case lsTypes.FoldingRangeKind.Comment:
			return languages.FoldingRangeKind.Comment;
		case lsTypes.FoldingRangeKind.Imports:
			return languages.FoldingRangeKind.Imports;
		case lsTypes.FoldingRangeKind.Region:
			return languages.FoldingRangeKind.Region;
	}
}

export class SelectionRangeAdapter implements languages.SelectionRangeProvider {
	constructor(private _worker: WorkerAccessor) {}

	public provideSelectionRanges(
		model: editor.IReadOnlyModel,
		positions: Position[],
		token: CancellationToken
	): Promise<languages.SelectionRange[][]> {
		const resource = model.uri;

		return this._worker(resource)
			.then((worker) => worker.getSelectionRanges(resource.toString(), positions.map(fromPosition)))
			.then((selectionRanges) => {
				if (!selectionRanges) {
					return;
				}
				return selectionRanges.map((selectionRange) => {
					const result: languages.SelectionRange[] = [];
					while (selectionRange) {
						result.push({ range: toRange(selectionRange.range) });
						selectionRange = selectionRange.parent;
					}
					return result;
				});
			});
	}
}
