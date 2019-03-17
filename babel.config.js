module.exports = function(api) {
	api.cache.using(() => process.env.NODE_ENV);

	const presets = ['@babel/env'];
	const plugins = [
		/**
		 * Also @babel/runtime and @babel/polyfill must be installed as production
		 * dependency and @babel/polyfill must be loaded prior app.js, which is
		 * maintained in `config.entry`. Option `useBuiltins` in @babel/env must
		 * not be defined (or false)
		 * TODO: bug in `@babel/polyfill` not resolving `core-js`, `core-js` instaled as dev-dependency
		 * @see https://babeljs.io/docs/en/babel-plugin-transform-runtime/
		 */
		'@babel/plugin-transform-runtime',
		// '@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		// 'react-hot-loader/babel',
		// [
		// 	'react-intl',
		// 	{
		// 		messagesDir: './src/i18n/src/',
		// 		enforceDescriptions: false,
		// 	},
		// ],
		/**
		 * Rewrite lodash imports so they could be tree-shaked
		 * @see https://www.npmjs.com/package/babel-plugin-lodash
		 */
		api.env('production') && 'lodash',
	].filter(Boolean);

	return {
		presets,
		plugins,
	};
};
