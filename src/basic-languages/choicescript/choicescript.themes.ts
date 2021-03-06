import { editor } from '../../fillers/monaco-editor-core';

export const csDark = <editor.IStandaloneThemeData>{
	base: 'vs-dark',
	inherit: true,
	rules: [
		{ token: 'extra-keywords', foreground: 'DA9ED3' },
		{ token: 'flow-command', foreground: '599EFF' },
		{ token: 'command', foreground: 'FFA500' },
		{ token: 'conditional', foreground: 'FFA500' },
		{ token: 'choice-option', foreground: '92A75C' }
	],
	colors: {}
};

export const csLight = <editor.IStandaloneThemeData>{
	base: 'vs',
	inherit: true,
	rules: [
		{ token: 'extra-keywords', foreground: 'EE82EE' },
		{ token: 'flow-command', foreground: 'E9692C' },
		{ token: 'command', foreground: '0000FF' },
		{ token: 'choice-option', foreground: 'FF0000' }
	],
	colors: {}
};
