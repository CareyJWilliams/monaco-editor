/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { removeDir, tsc, dts, buildESM, buildAMD } = require('../build/utils');

removeDir(`monaco-html/release`);
removeDir(`monaco-html/out`);

tsc(`monaco-html/src/tsconfig.json`);

dts(
	`monaco-html/out/amd/monaco.contribution.d.ts`,
	`monaco-html/monaco.d.ts`,
	'monaco.languages.html'
);

buildESM({
	entryPoints: ['src/monaco.contribution.ts', 'src/htmlMode.ts', 'src/html.worker.ts'],
	external: ['monaco-editor-core', '*/htmlMode']
});
buildAMD({
	entryPoint: 'src/monaco.contribution.ts',
	banner: 'define("vs/language/html/monaco.contribution",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/htmlMode.ts',
	banner: 'define("vs/language/html/htmlMode",["vs/editor/editor.api"],()=>{'
});
buildAMD({
	entryPoint: 'src/htmlWorker.ts',
	banner: 'define("vs/language/html/htmlWorker",[],()=>{'
});