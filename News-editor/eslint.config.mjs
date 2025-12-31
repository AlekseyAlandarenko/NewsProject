import globals from 'globals';
import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default [
	{
		ignores: ['dist', 'node_modules', 'vite.config.ts'],
	},

	pluginJs.configs.recommended,

	{
		files: ['**/*.{ts,tsx,js,jsx}'],

		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
			prettier: prettierPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			import: importPlugin,
		},

		settings: {
			react: { version: 'detect' },
		},

		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',

			'react/react-in-jsx-scope': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					'alphabetize': { order: 'asc', caseInsensitive: true },
					'newlines-between': 'never',
				},
			],
			
			'no-console': 'off',
			'no-undef': 'off',
			'prettier/prettier': 'error',

		},
	},
];