/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as choicescriptMode from './choicescriptMode';
import { languages, Emitter, IEvent } from '../fillers/monaco-editor-core';

// TODO: Move types out to separate '-types' module
// to avoid duplication between -server and -monaco
declare type UserDictionaryEntry = {
	[key: string]: boolean;
};

declare type UserDictionary = {
	[key: string]: UserDictionaryEntry;
};

const enum SpellCheckDictionary {
	EN_US = 'en_US',
	EN_GB = 'en_GB'
}
export interface SpellCheckSettings {
	paths: {
		affix: string;
		dics: string[];
	};
	enabled: boolean;
	dictionary: SpellCheckDictionary;
	userDictionary: UserDictionary;
	suggestLimit?: number;
}
export class DictionaryEvent {
	words: string[];
	removed: boolean; /* false if adding */
	dictionary: string;
}
export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly onDictionaryChange: IEvent<DictionaryEvent>;
	readonly diagnosticsOptions: DiagnosticsOptions;
	readonly modeConfiguration: ModeConfiguration;
	addDictWords(dict: string, words: String[]): void;
	removeDictWords(dict: string, words: String[]): void;
	setDiagnosticsOptions(options: DiagnosticsOptions): void;
	setModeConfiguration(modeConfiguration: ModeConfiguration): void;
}

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _onDidDictionaryChange = new Emitter<DictionaryEvent>();
	private _diagnosticsOptions: DiagnosticsOptions;
	private _modeConfiguration: ModeConfiguration;
	private _languageId: string;

	constructor(
		languageId: string,
		diagnosticsOptions: DiagnosticsOptions,
		modeConfiguration: ModeConfiguration
	) {
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration);
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get onDictionaryChange(): IEvent<DictionaryEvent> {
		return this._onDidDictionaryChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): ModeConfiguration {
		return this._modeConfiguration;
	}

	get diagnosticsOptions(): DiagnosticsOptions {
		return this._diagnosticsOptions;
	}

	addDictWords(dict: string, words: string[]): void {
		this._onDidDictionaryChange.fire(<DictionaryEvent>{
			dictionary: dict,
			removed: false,
			words: words
		});
	}

	removeDictWords(dict: string, words: string[]): void {
		this._onDidDictionaryChange.fire(<DictionaryEvent>{
			dictionary: dict,
			removed: true,
			words: words
		});
	}

	setDiagnosticsOptions(options: DiagnosticsOptions): void {
		this._diagnosticsOptions = options || Object.create(null);
		this._onDidChange.fire(this);
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

export interface DiagnosticsOptions {
	readonly validate: boolean;
	readonly lint: {
		readonly enabled: boolean;
	};
	readonly spellcheck: SpellCheckSettings;
}

export interface ModeConfiguration {
	/**
	 * Defines whether the built-in documentFormattingEdit provider is enabled.
	 */
	readonly documentFormattingEdits?: boolean;

	/**
	 * Defines whether the built-in documentRangeFormattingEdit provider is enabled.
	 */
	readonly documentRangeFormattingEdits?: boolean;
	/**
	 * Defines whether the built-in completionItemProvider is enabled.
	 */
	readonly completionItems?: boolean;

	/**
	 * Defines whether the built-in hoverProvider is enabled.
	 */
	readonly hovers?: boolean;

	/**
	 * Defines whether the built-in documentSymbolProvider is enabled.
	 */
	readonly documentSymbols?: boolean;

	/**
	 * Defines whether the built-in definitions provider is enabled.
	 */
	readonly definitions?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly references?: boolean;

	/**
	 * Defines whether the built-in tokens provider is enabled.
	 */
	readonly tokens?: boolean;

	/**
	 * Defines whether the built-in references provider is enabled.
	 */
	readonly documentHighlights?: boolean;

	/**
	 * Defines whether the built-in rename provider is enabled.
	 */
	readonly rename?: boolean;

	/**
	 * Defines whether the built-in color provider is enabled.
	 */
	readonly colors?: boolean;

	/**
	 * Defines whether the built-in foldingRange provider is enabled.
	 */
	readonly foldingRanges?: boolean;

	/**
	 * Defines whether the built-in diagnostic provider is enabled.
	 */
	readonly diagnostics?: boolean;

	/**
	 * Defines whether the built-in selection range provider is enabled.
	 */
	readonly selectionRanges?: boolean;

	/**
	 * Defines whether the built-in format provider is enabled.
	 */
	readonly autoFormat?: boolean;
}
const diagnosticDefault: Required<DiagnosticsOptions> = {
	validate: true,
	lint: { enabled: true },
	spellcheck: {
		enabled: true,
		paths: {
			affix:
				'https://raw.githubusercontent.com/cfinke/Typo.js/master/typo/dictionaries/en_US/en_US.aff',
			dics: [
				'https://raw.githubusercontent.com/cfinke/Typo.js/master/typo/dictionaries/en_US/en_US.dic'
			]
		},
		dictionary: SpellCheckDictionary.EN_US,
		userDictionary: null!
	}
};

const modeConfigurationDefault: Required<ModeConfiguration> = {
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

export const choicescriptDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'choicescript',
	diagnosticDefault,
	modeConfigurationDefault
);

// export to the global based API
(<any>languages).choicescript = choicescriptDefaults;

// --- Registration to monaco editor ---

function getCSMode(): Promise<typeof choicescriptMode> {
	return import('./choicescriptMode');
}

languages.onLanguage('choicescript', () => {
	getCSMode().then((mode) => {
		(<any>languages).choicescriptDispose = mode.setupMode(choicescriptDefaults);
		// handle reset on setModeConfiguration
		choicescriptDefaults.onDidChange(() => {
			(<any>languages).choicescriptDispose?.dispose();
			(<any>languages).choicescriptDispose = mode.setupMode(choicescriptDefaults);
		});
	});
});
