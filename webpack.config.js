const dev = process.env.NODE_ENV !== "production";
const path = require( "path" );
const paths = require('./paths');
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" );
const FriendlyErrorsWebpackPlugin = require( "friendly-errors-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin( {
        filename: "styles.css",
    } ),
];

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
// Get environment variables to inject into our app.

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
          '@': paths.appSrc,
          // Support React Native Web
          // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
          'react-native': 'react-native-web',
        },
        plugins: [
          // Prevents users from importing files from outside of src/ (or node_modules/).
          // This often causes confusion because we only process files within src/ with babel.
          // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
          // please link the files into your node_modules/ and let module-resolution kick in.
          // Make sure your source files are compiled, as they will not be processed in any way.
          new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
        ],
    },
    module: {
        rules: [
            {
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
            },
            {
              // "oneOf" will traverse all following loaders until one will
              // match the requirements. When no loader matches it will fall
              // back to the "file" loader at the end of the loader list.
              oneOf: [
                // "url" loader works just like "file" loader but it also embeds
                // assets smaller than specified size as data URLs to avoid requests.
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
                    compact: true,
                  },
                },
                // The notation here is somewhat confusing.
                // "postcss" loader applies autoprefixer to our CSS.
                // "css" loader resolves paths in CSS and adds assets as dependencies.
                // "style" loader normally turns CSS into JS modules injecting <style>,
                // but unlike in development configuration, we do something different.
                // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
                // (second argument), then grabs the result CSS and puts it into a
                // separate file in our build process. This way we actually ship
                // a single CSS file in production instead of JS code injecting <style>
                // tags. If you use code splitting, however, any async bundles will still
                // use the "style" loader inside the async code so CSS from them won't be
                // in the main CSS file.
                {
                  test: /\.(css|less)$/,
                  loader: ExtractTextPlugin.extract(
                    Object.assign(
                      {
                        fallback: {
                          loader: require.resolve('style-loader'),
                          options: {
                            hmr: false,
                          },
                        },
                        use: [
                          {
                            loader: require.resolve('css-loader'),
                            options: {
                              importLoaders: 1,
                              minimize: true,
                              sourceMap: shouldUseSourceMap,
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

                              }
                            },
                          }
                        ],
                      },
                      extractTextPluginOptions
                    )
                  ),
                  // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                },
                // "file" loader makes sure assets end up in the `build` folder.
                // When you `import` an asset, you get its filename.
                // This loader doesn't use a "test" so it will catch all modules
                // that fall through the other loaders.
                {
                  loader: require.resolve('file-loader'),
                  // Exclude `js` files to keep "css" loader working as it injects
                  // it's runtime that would otherwise processed through "file" loader.
                  // Also exclude `html` and `json` extensions so they get processed
                  // by webpacks internal loaders.
                  exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                  options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                  },
                },
                // ** STOP ** Are you adding a new loader?
                // Make sure to add the new loader(s) before the "file" loader.
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
