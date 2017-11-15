/* eslint-env jasmine */
/* eslint-disable max-len */

const path = require("path");
const MemoryFileSystem = require("memory-fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PreloadCssPlugin = require("../");
const OUTPUT_DIR = path.join(__dirname, "dist");

describe("PreloadCssPlugin works for single entry and single html webpack plugin", function() {
    it("adds preload tags to stylesheets", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle.js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin(),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({})
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const html = result.compilation.assets["index.html"].source();
            expect(html).toContain("<link href=\"/styles-home.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\">");
            expect(html).toContain("<noscript><link href=\"/styles-home.css\" rel=\"stylesheet\"></noscript>");
            expect(html).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });

    it("respects blacklist as regex pattern", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle.js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin(),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({
                    blacklist: [/styles-home/]
                })
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const html = result.compilation.assets["index.html"].source();
            expect(html).toContain("<link href=\"/styles-home.css\" rel=\"stylesheet\">");
            expect(html).toContain("<noscript></noscript>");
            expect(html).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });

    it("respects blacklist as string", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle.js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin(),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({
                    blacklist: ["styles-home"]
                })
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const html = result.compilation.assets["index.html"].source();
            expect(html).toContain("<link href=\"/styles-home.css\" rel=\"stylesheet\">");
            expect(html).toContain("<noscript></noscript>");
            expect(html).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });

    it("skips noscript", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle.js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin(),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({
                    noscript: false
                })
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const html = result.compilation.assets["index.html"].source();
            expect(html).toContain("<link href=\"/styles-home.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\">");
            expect(html).not.toContain("<noscript></noscript>");
            expect(html).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });

    it("skips noscript and respects blacklist", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle.js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin(),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({
                    blacklist: [/styles-home/],
                    noscript: false
                })
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const html = result.compilation.assets["index.html"].source();
            expect(html).toContain("<link href=\"/styles-home.css\" rel=\"stylesheet\">");
            expect(html).not.toContain("<noscript></noscript>");
            expect(html).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });
});

describe("PreloadCssPlugin works with commonsChunkPlugin", function() {
    it("adds preload tags to stylesheets", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js"),
                about: path.join(__dirname, "assets", "about.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle-[name].js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new webpack.optimize.CommonsChunkPlugin({
                    name: "shared",
                    minChunks: 2
                }),
                new HtmlWebpackPlugin({
                    title: "home",
                    chunks: ["shared", "home"],
                    filename: "home.html"
                }),
                new HtmlWebpackPlugin({
                    title: "about",
                    chunks: ["shared", "about"],
                    filename: "about.html"
                }),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({})
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const homehtml = result.compilation.assets["home.html"].source();
            expect(homehtml).toContain("<link href=\"/styles-shared.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\"><link href=\"/styles-home.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\">");
            expect(homehtml).toContain("<noscript><link href=\"/styles-shared.css\" rel=\"stylesheet\"><link href=\"/styles-home.css\" rel=\"stylesheet\"></noscript>");
            expect(homehtml).not.toContain("</title>\n</head>");
            const abouthtml = result.compilation.assets["about.html"].source();
            expect(abouthtml).toContain("<link href=\"/styles-shared.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\"><link href=\"/styles-about.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\">");
            expect(abouthtml).toContain("<noscript><link href=\"/styles-shared.css\" rel=\"stylesheet\"><link href=\"/styles-about.css\" rel=\"stylesheet\"></noscript>");
            expect(abouthtml).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });

    it("respects blacklist regex pattern for one of two assets in output", function(done) {
        const compiler = webpack({
            entry: {
                home: path.join(__dirname, "assets", "home.js"),
                about: path.join(__dirname, "assets", "about.js")
            },
            output: {
                path: OUTPUT_DIR,
                filename: "bundle-[name].js",
                chunkFilename: "chunk.[chunkhash].js",
                publicPath: "/",
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: "css-loader"
                        })
                    }
                ]
            },
            plugins: [
                new webpack.optimize.CommonsChunkPlugin({
                    name: "shared",
                    minChunks: 2
                }),
                new HtmlWebpackPlugin({
                    title: "home",
                    chunks: ["shared", "home"],
                    filename: "home.html"
                }),
                new HtmlWebpackPlugin({
                    title: "about",
                    chunks: ["shared", "about"],
                    filename: "about.html"
                }),
                new ExtractTextPlugin("styles-[name].css"),
                new PreloadCssPlugin({
                    blacklist: [/shared/]
                })
            ]
        }, function(err, result) {
            expect(err).toBeFalsy();
            console.log(result.compilation.errors);
            expect(JSON.stringify(result.compilation.errors)).toBe("[]");
            const homehtml = result.compilation.assets["home.html"].source();
            expect(homehtml).toContain("<link href=\"/styles-shared.css\" rel=\"stylesheet\"><link href=\"/styles-home.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\">");
            expect(homehtml).toContain("<noscript><link href=\"/styles-home.css\" rel=\"stylesheet\"></noscript>");
            expect(homehtml).not.toContain("</title>\n</head>");
            const abouthtml = result.compilation.assets["about.html"].source();
            expect(abouthtml).toContain("<link href=\"/styles-shared.css\" rel=\"stylesheet\"><link href=\"/styles-about.css\" rel=\"preload\" as=\"style\" onload=\"this.rel='stylesheet'\">");
            expect(abouthtml).toContain("<noscript><link href=\"/styles-about.css\" rel=\"stylesheet\"></noscript>");
            expect(abouthtml).not.toContain("</title>\n</head>");
            done();
        });
        compiler.outputFileSystem = new MemoryFileSystem();
    });
});

