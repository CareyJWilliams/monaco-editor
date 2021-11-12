// configure the JSON language support with schemas and schema associations
export const monacoThemeSchema = {
	uri: '', // id of the first schema
	fileMatch: ['*.cside.theme.json'],
	schema: {
		title: 'Monaco Theme Schema',
		type: 'object',
		required: ['base', 'inherit', 'rules', 'colors'],
		properties: {
			base: {
				enum: ['vs', 'vs-dark', 'hc-black']
			},
			inherit: {
				type: 'boolean'
			},
			rules: {
				type: 'array',
				items: {
					$ref: '#/definitions/rule'
				}
			},
			colors: {
				type: 'object',
				patternProperties: {
					'.*': {
						$ref: '#/definitions/color'
					}
				}
			},
			encodedTokensColors: {
				type: 'array',
				items: {
					type: 'string'
				}
			}
		},
		definitions: {
			color: {
				type: 'string',
				pattern: '^#[0-9A-Fa-f]{6}$',
				errorMessage: 'Expected a color: #000000',
				format: 'color-hex'
			},
			rule: {
				type: 'object',
				patternProperties: {
					'^(fore|back)ground': {
						pattern: '^#[0-9A-Fa-f]{6}$',
						errorMessage: 'Expected a color: #000000',
						format: 'color-hex'
					},
					token: {
						type: 'string'
					},
					fontStyle: {
						type: 'string',
						pattern: '^((italic|bold|underline) ?)+$'
					}
				},
				additionalProperties: false
			}
		},
		additionalProperties: false
	}
};
