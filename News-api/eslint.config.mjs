import globals from 'globals';
import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
	{
		ignores: ['dist', 'node_modules'],
	},

	pluginJs.configs.recommended,

	{
		files: ['**/*.{ts,js}'],

		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
			globals: {
				...globals.node,
			},
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
			prettier: prettierPlugin,
		},

		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',

			'no-undef': 'off',
			'prettier/prettier': 'error',
		},
	},
];