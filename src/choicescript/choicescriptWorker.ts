/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { worker } from '../fillers/monaco-editor-core';
import * as choicescriptService from 'vscode-choicescript-languageservice';
import { RoutineInfo } from 'vscode-choicescript-languageservice/lib/umd/csTypes';

export class ChoiceScriptWorker {
	// --- model sync -----------------------

	private _ctx: worker.IWorkerContext;
	private _csLanguageService: choicescriptService.ChoiceScriptLanguageService;
	private _cslanguageSettings: choicescriptService.ChoiceScriptLanguageSettings;
	private _languageId: string;

	constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
		this._ctx = ctx;
		this._cslanguageSettings = createData.languageSettings;
		this._languageId = createData.languageId;
		switch (this._languageId) {
			case 'choicescript':
				this._csLanguageService = choicescriptService.getChoiceScriptLanguageService();
				this._csLanguageService.configure(this._cslanguageSettings);
				break;
			default:
				throw new Error('Invalid language id: ' + this._languageId);
		}
	}

	async doHover(
		uri: string,
		position: choicescriptService.Position
	): Promise<choicescriptService.Hover | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		let stylesheet = this._csLanguageService.parseScene(document);
		let hover = this._csLanguageService.doHover(document, position, stylesheet);
		return Promise.resolve(hover);
	}

	async doValidation(uri: string): Promise<choicescriptService.Diagnostic[]> {
		let document = this._getTextDocument(uri);
		if (document) {
			let stylesheet = this._csLanguageService.parseScene(document);
			let diagnostics = this._csLanguageService.doValidation(document, stylesheet);
			return Promise.resolve(diagnostics);
		}
		return Promise.resolve([]);
	}

	async addWords(words: string[]): Promise<String[]> {
		return this._csLanguageService.addDictWords(words);
	}

	async removeWords(words: string[]): Promise<String[]> {
		return this._csLanguageService.removeDictWords(words);
	}

	private _getStartupTextDocument(): choicescriptService.TextDocument | null {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (/\/startup\.txt$/.test(model.uri.toString())) {
				return choicescriptService.TextDocument.create(
					model.uri.toString(),
					this._languageId,
					model.version,
					model.getValue()
				);
			}
		}
		return null;
	}

	private _getProjectPath(uri: string) {
		return uri.slice(0, uri.lastIndexOf('/') + 1);
	}

	private _getTextDocument(uri: string): choicescriptService.TextDocument | undefined {
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (model.uri.toString() === uri) {
				return choicescriptService.TextDocument.create(
					uri,
					this._languageId,
					model.version,
					model.getValue()
				);
			}
		}
		return;
	}

	private _getAllProjectTextDocuments(uri: string): choicescriptService.TextDocument[] {
		let docs = [];
		let projectPath = this._getProjectPath(uri);
		let models = this._ctx.getMirrorModels();
		for (let model of models) {
			if (this._getProjectPath(model.uri.toString()) === projectPath) {
				docs.push(
					choicescriptService.TextDocument.create(
						model.uri.toString(),
						this._languageId,
						model.version,
						model.getValue()
					)
				);
			}
		}
		return docs;
	}

	removeIndex(uri: string): void {
		this._csLanguageService.purgeProject(uri, [uri]);
	}

	updateIndex(uri: string): void {
		let document = this._getTextDocument(uri);
		if (!document) return;
		this._csLanguageService.updateProject(uri, [document]);
	}

	async doComplete(
		uri: string,
		position: choicescriptService.Position
	): Promise<choicescriptService.CompletionList | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		let stylesheet = this._csLanguageService.parseScene(document);
		let completions = this._csLanguageService.doComplete(document, position, stylesheet);
		return Promise.resolve(completions);
	}

	async findDefinition(
		uri: string,
		position: choicescriptService.Position
	): Promise<choicescriptService.Location | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		let localScene = this._csLanguageService.parseScene(document);
		let definition = this._csLanguageService.findDefinition(document, position, localScene);
		return Promise.resolve(definition);
	}

	async findReferences(
		uri: string,
		position: choicescriptService.Position
	): Promise<choicescriptService.Location[] | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		let stylesheet = this._csLanguageService.parseScene(document);
		let references = this._csLanguageService.findReferences(document, position, stylesheet);
		return Promise.resolve(references);
	}

	async findDocumentSymbols(uri: string): Promise<choicescriptService.SymbolInformation[] | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		let scene = this._csLanguageService.parseScene(document);
		let symbols = this._csLanguageService.findDocumentSymbols(
			document,
			scene,
			false /* includeGlobals */
		);
		return Promise.resolve(symbols);
	}

	async getRoutineInfo(uri: string, offset: number): Promise<RoutineInfo | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		let localScene = this._csLanguageService.parseScene(document);
		return this._csLanguageService.getRoutineInfo(document, offset, localScene);
	}

	async findParameters(
		uri: string,
		sceneName: string,
		labelName: string
	): Promise<string[] | null> {
		let document = this._getTextDocument(uri);
		if (!document) return null;
		return this._csLanguageService.findParameters(document, sceneName, labelName);
	}

	async suggestSpelling(words: string[]): Promise<String[][]> {
		return this._csLanguageService.suggestSpelling(words);
	}

	configure(settings: choicescriptService.ChoiceScriptLanguageSettings): void {
		this._csLanguageService.configure(settings);
	}
}
export interface ICreateData {
	languageId: string;
	languageSettings: choicescriptService.ChoiceScriptLanguageSettings;
}
export function create(ctx: worker.IWorkerContext, createData: ICreateData): ChoiceScriptWorker {
	return new ChoiceScriptWorker(ctx, createData);
}
