/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const playwright = require('playwright');
const { assert } = require('chai');
const { PORT } = require('./common');

const browserType = process.env.BROWSER || 'chromium';
const DEBUG_TESTS = Boolean(process.env.DEBUG_TESTS || false);
const URL = `http://127.0.0.1:${PORT}/test/smoke/amd.html`;

/** @type {playwright.Browser} */
let browser;

/** @type {playwright.Page} */
let page;

before(async () => {
	console.log(`Starting browser: ${browserType}`);
	browser = await playwright[browserType].launch({
		headless: !DEBUG_TESTS,
		devtools: DEBUG_TESTS
		// slowMo: DEBUG_TESTS ? 2000 : 0
	});
});

after(async () => {
	await browser.close();
});

let pageErrors = [];

beforeEach(async () => {
	pageErrors = [];
	page = await browser.newPage({
		viewport: {
			width: 800,
			height: 600
		}
	});
	page.on('pageerror', (e) => {
		console.log(e);
		pageErrors.push(e);
	});
	const response = await page.goto(URL);
	assert.ok(!!response);
	assert.strictEqual(response.status(), 200);
});

afterEach(async () => {
	for (const e of pageErrors) {
		throw e;
	}
	await page.close();
});

describe('Smoke Test', () => {
	it('`monaco` is exposed as global', async () => {
		assert.strictEqual(await page.evaluate(`typeof monaco`), 'object');
	});

	/**
	 * @param {string} text
	 * @param {string} language
	 * @returns Promise<void>
	 */
	async function createEditor(text, language) {
		return await page.evaluate(
			`window.ed = monaco.editor.create(document.getElementById('editor-container'), { value: '${text}', language: '${language}' })`
		);
	}

	/**
	 * @param {number} lineNumber
	 * @param {number} column
	 * @returns Promise<void>
	 */
	async function setEditorPosition(lineNumber, column) {
		return await page.evaluate(
			`window.ed.setPosition({ lineNumber: ${lineNumber}, column: ${column} });`
		);
	}

	/**
	 * @param {string} commandId
	 * @param {any} args
	 * @returns Promise<void>
	 */
	async function triggerEditorCommand(commandId, args) {
		return await page.evaluate(
			`window.ed.trigger(null, '${commandId}', ${args ? JSON.stringify(args) : 'undefined'});`
		);
	}

	async function focusEditor() {
		await page.evaluate(`window.ed.focus();`);
	}

	it('should be able to create plaintext editor', async () => {
		await createEditor('hello world', 'plaintext');

		// type a link in it
		await setEditorPosition(1, 12);
		await triggerEditorCommand('type', { text: '\nhttps://www.microsoft.com' });

		// check that the link gets highlighted, which indicates that the web worker is healthy
		await page.waitForSelector('.detected-link');
	});

	it('css smoke test', async () => {
		await createEditor('.sel1 { background: red; }\\n.sel2 {}', 'css');

		// check that a squiggle appears, which indicates that the language service is up and running
		await page.waitForSelector('.squiggly-warning');
	});

	it('html smoke test', async () => {
		await createEditor('<title>hi</title>', 'html');

		// trigger hover
		await focusEditor();
		await setEditorPosition(1, 3);
		await page.keyboard.press('F1');
		await page.keyboard.type('Show Hover');
		await page.keyboard.press('Enter');

		// check that a hover explaining the `<title>` element appears, which indicates that the language service is up and running
		await page.waitForSelector(`text=The title element represents the document's title or name`);
	});

	it('json smoke test', async () => {
		await createEditor('{}', 'json');

		// trigger suggestions
		await focusEditor();
		await setEditorPosition(1, 2);
		await triggerEditorCommand('editor.action.triggerSuggest');

		// check that a suggestion item for `$schema` appears, which indicates that the language service is up and running
		await page.waitForSelector(`text=$schema`);
	});

	it('typescript smoke test', async () => {
		await createEditor('window.add', 'typescript');

		// check that a squiggle appears, which indicates that the language service is up and running
		await page.waitForSelector('.squiggly-error');

		// trigger suggestions
		await focusEditor();
		await setEditorPosition(1, 11);
		await triggerEditorCommand('editor.action.triggerSuggest');

		// check that a suggestion item for `addEventListener` appears, which indicates that the language service is up and running
		await page.waitForSelector(`text=addEventListener`);
	});

	it('choicescript smoke test', async () => {
		await createEditor('*c', 'choicescript');

		// check that a squiggle appears, which indicates that the language service is up and running
		await page.waitForSelector('.squiggly-error');

		// trigger suggestions
		await focusEditor();
		await setEditorPosition(1, 3);
		await triggerEditorCommand('editor.action.triggerSuggest');

		// check that a suggestion item for `choice` appears, which indicates that the language service is up and running
		await page.waitForSelector(`text=choice`);
	});
});

function timeout(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}
