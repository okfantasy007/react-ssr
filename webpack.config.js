const dev = process.env.NODE_ENV !== "production";
const path = require( "path" );
const paths = require('./paths');
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );
const FriendlyErrorsWebpackPlugin = require( "friendly-errors-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

const plugins = [
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin( {
        filename: "styles.css",
    } ),
];

if ( !dev ) {
    plugins.push( new BundleAnalyzerPlugin( {
        analyzerMode: "static",
        reportFilename: "webpack-report.html",
        openAnalyzer: false,
    } ) );
}

module.exports = {
    mode: dev ? "development" : "production",
    context: path.join( __dirname, "src" ),
    devtool: dev ? "none" : "source-map",
    entry: {
        app: "./client.js",
    },
    resolve: {
        modules: [
            path.resolve( "./src" ),
            "node_modules",
        ],
        alias: {
          '@': path.resolve(__dirname, "./src")
        }
    },
    module: {
        rules: [
            /*{
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                ],
            },*/
						{
							// "oneOf" will traverse all following loaders until one will
							// match the requirements. When no loader matches it will fall
							// back to the "file" loader at the end of the loader list.
							oneOf: [
								// "url" loader works like "file" loader except that it embeds assets
								// smaller than specified limit in bytes as data URLs to avoid requests.
								// A missing `test` is equivalent to a match.
								{
									test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
									loader: require.resolve('url-loader'),
									options: {
										limit: 10000,
										name: 'static/media/[name].[hash:8].[ext]',
									},
								},
								// Process JS with Babel.
								{
									test: /\.(js|jsx|mjs)$/,
									include: paths.appSrc,
									loader: require.resolve('babel-loader'),
									options: {
										plugins: [
											[
												require.resolve('babel-plugin-named-asset-import'),
												{
													loaderMap: {
														svg: {
															ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
														},
													},
												},
											],
											// 按需加载
											["import", {
												"libraryName": "antd",
												"libraryDirectory": "es",
												"style": true // `style: true` 会加载 less 文件
											}],
										],
										// This is a feature of `babel-loader` for webpack (not Babel itself).
										// It enables caching results in ./node_modules/.cache/babel-loader/
										// directory for faster rebuilds.
										cacheDirectory: true,

									},
								},
								// "postcss" loader applies autoprefixer to our CSS.
								// "css" loader resolves paths in CSS and adds assets as dependencies.
								// "style" loader turns CSS into JS modules that inject <style> tags.
								// In production, we use a plugin to extract that CSS to a file, but
								// in development "style" loader enables hot editing of CSS.
								{
									test: /\.(css|less)$/,
									use: [
										require.resolve('style-loader'),
										{
											loader: require.resolve('css-loader'),
											options: {
												importLoaders: 1,
											},
										},
										{
											loader: require.resolve('postcss-loader'),
											options: {
												// Necessary for external CSS imports to work
												// https://github.com/facebookincubator/create-react-app/issues/2677
												ident: 'postcss',
												plugins: () => [
													require('postcss-flexbugs-fixes'),
													autoprefixer({
														browsers: [
															'>1%',
															'last 4 versions',
															'Firefox ESR',
															'not ie < 9', // React doesn't support IE8 anyway
														],
														flexbox: 'no-2009',
													}),
												],
											},
										},
										// 编译 less 文件
										{
											loader: require.resolve('less-loader'),
											options: {
												// 解决报错: Inline JavaScript is not enabled. Is it set in your options?
												javascriptEnabled: true,
												modifyVars: {
													'primary-color': '#747cf5',
													'menu-dark-selected-item-icon-color': '#ffffff',
													'menu-popup-bg': '#747cf5',
													'link-color': '#008DC9'
												}
											},
										}
									],
								},
								// "file" loader makes sure those assets get served by WebpackDevServer.
								// When you `import` an asset, you get its (virtual) filename.
								// In production, they would get copied to the `build` folder.
								// This loader doesn't use a "test" so it will catch all modules
								// that fall through the other loaders.
								{
									// Exclude `js` files to keep "css" loader working as it injects
									// its runtime that would otherwise processed through "file" loader.
									// Also exclude `html` and `json` extensions so they get processed
									// by webpacks internal loaders.
									exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
									loader: require.resolve('file-loader'),
									options: {
										name: 'static/media/[name].[hash:8].[ext]',
									},
								},
							],
						},
        ],
    },
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "[name].bundle.js",
    },
    plugins,
};
