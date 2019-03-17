const autoprefixer = require('autoprefixer');
const path = require('path');
const WebpackConfig = require('webpack-chain');


const OUTPUT_PATH = path.resolve(__dirname, './public');
const PUBLIC_PATH = '/';

const config = new WebpackConfig();

config
	.target('web')	// unnecessary - 'web' is default value of target option
	.entry('app')	// 'app' ?== bundle name
		// .add('@babel/polyfill')
		.add('./src/index.js')
		.end()
	.output
		.path(OUTPUT_PATH)
		.publicPath(PUBLIC_PATH)
		.filename('[name].js');
		// .sourceMapFilename('[file].map');

config.node
	.set('fs', 'empty')
	.set('net', 'empty');

config.resolve
	.alias
		// .set('api', path.resolve(__dirname, './src/api'))
		.set('constants', path.resolve(__dirname, './src/constants'))
		.end()
	.extensions
		.merge(['.js', '.ts', '.tsx', '.json', '.sass', '.scss'])
		.end()
	.modules
	.merge([
		path.resolve(__dirname, 'node_modules'), // node_modules must be absolute, otherwise `../../core` will fail to resolve node_modules dependencies
		'src', // src must be relative to resolve `core` modules into `core/src`
	])
	.end()
	.mainFields
		.prepend('main'); // mainFields are set according to config.target but graphql-tools imports Node.js modules if `main` not first, @see https://github.com/webpack/webpack/issues/6459

/**
 * LOADERS
 */
config.module
	.rule('js')
		.test(/\.m?(ts|js)x?$/)
		.exclude
			.add(/node_modules/)
			.end()
		.use('babel')
			.loader('babel-loader');

config.module
	.rule('styles')
		.test(/\.(sa|sc|c)ss$/)
		.use('finalLoader') // use style-loader for HMR, replace with ExtractText in production
			.loader('style-loader')
			.end()
		.use('css')
			.loader('css-loader')
			.end()
		.use('postcss')
			.loader('postcss-loader')
			.options({
				ident: 'postcss',
				plugins: [autoprefixer()],
			})
			.end()
		// .use('resolveUrl')
		// .loader('resolve-url-loader')
		// .end()
		.use('sass')
			.loader('sass-loader');

config.module
	.rule('images')
		.test(/\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/)
		.use('urlLoader')
			.loader('url-loader')
			.options({
				limit: 8192,
				name: '[hash].[ext]',
			});

// config.module
// 	.rule('svg')
// 	.test(/\.svg$/)
// 	.use()
// 	.loader('file-loader');


/**
 * PLUGINS
 */
config
	.plugin('indexHtml')
	.use(
		require('html-webpack-plugin'),
		[
			{
				alwaysWriteToDisk: true, // extra option provided by html-webpack-harddisk-plugin
				env: process.env,
				filename: path.resolve(__dirname, './public/index.html'),
				hash: false,
				inject: 'body',
				template: path.resolve(__dirname, './src/index.ejs'),
			},
		]
	);

config
	.plugin('env')
	.use(
		require.resolve('webpack/lib/EnvironmentPlugin'),
		[
			// pass all build time constants, also needed for plugins.
			// NODE_ENV is passed automatically.
			//
			// meaning of values:
			// undefined - required
			// null - optional
			// other - default value if not defined
			// @see https://webpack.js.org/plugins/environment-plugin/#usage-with-default-values
			// {
			// 	BROWSERSLIST_CONFIG,
			// },
		]
	);


if (process.env.NODE_ENV === 'development') {
	/**
	 * DEVELOPMENT
	 */
	config
		.mode('development')
		.devtool('eval');

	// @see https://github.com/jantimon/html-webpack-harddisk-plugin
	config
		.plugin('enhance HtmlWebpackPlugin with alwaysWriteToDisk option')
		.use(require.resolve('html-webpack-harddisk-plugin'));

	config.devServer
		.compress(true)
		.contentBase(OUTPUT_PATH)
		.historyApiFallback(true)
		.hot(false)
		.inline(true)
		.port(process.env.DEV_PORT || 8080)
		.publicPath(PUBLIC_PATH)
		.stats('minimal');
} else {
	/**
	 * PRODUCTION
	 */
	config
		.mode('production')
		.devtool('eval');

	config
		.plugin('cleanBuildFolder')
		.use(
			require.resolve('clean-webpack-plugin'),
			[
				[OUTPUT_PATH],
				{
					root: __dirname,
				},
			]
		);


	/**
	 * extract CSS into file app.css
	 * @see https://github.com/webpack-contrib/mini-css-extract-plugin
	 */
	const MiniCssExtractPlugin = require('mini-css-extract-plugin');
	config
		.plugin('miniCssExtract')
			.use(
				MiniCssExtractPlugin,
				[
					{
						filename: '[name].[hash].css',
					},
				]
			)
			.end()
		.module
			.rule('styles')
				.use('finalLoader')
					.loader(MiniCssExtractPlugin.loader);


	/**
	 * remove unused locales in moment.js
	 */
	// config
	// 	.plugin('momentLocales')
	// 	.use(
	// 		require.resolve('moment-locales-webpack-plugin'),
	// 		[
	// 			{ localesToKeep: ['cs'] },
	// 		]
	// 	);

	// config.optimization
	// 	.minimizer('uglifyJS')
	// 	.use(
	// 		require.resolve('uglifyjs-webpack-plugin'),
	// 		[
	// 			{
	// 				cache: true,
	// 				parallel: true,
	// 				sourceMap: true,
	// 				uglifyOptions: {
	// 					// @see https://github.com/mishoo/UglifyJS2#minify-options
	// 					compress: {
	// 						drop_console: true, // Drop console statements
	// 					},
	// 				},
	// 			},
	// 		]);

	config.optimization
		.minimizer('optimizeCssAssets')
			.use(require.resolve('optimize-css-assets-webpack-plugin'));
}


module.exports = config.toConfig();
