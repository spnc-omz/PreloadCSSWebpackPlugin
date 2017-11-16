"use strict";

const clone = require("clone");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const defaultOptions = {
    blacklist: [/\.map/],
    noscript: true
};

class PreloadCssPlugin {
    constructor(options) {
        this.options = Object.assign({}, defaultOptions, options);
        this.noScriptArray = [];
    }

    apply(compiler) {
        const options = this.options;

        compiler.plugin("compilation", compilation => {
            compilation.plugin("html-webpack-plugin-alter-asset-tags", (htmlPluginData, cb) => {
                this.noScriptArray = [];
                const defaultPreload = {
                    as: "style",
                    onload: "this.rel='stylesheet'",
                    rel: "preload"
                };
                // test to see if the name of the file is in our blacklist. blacklist can be a string or regex pattern 
                htmlPluginData.head.filter(entry => {
                    return options.blacklist.every(regex => {
                        if (!(regex instanceof RegExp)) {
                            regex = new RegExp(regex);
                        }

                        return regex.test(entry.attributes.href) === false;
                    });
                }).forEach(entry => {
                    this.noScriptArray.push(clone(entry));
                });
                // loop through noscript array, find match in htmlPluginData.head and update it to be preload
                this.noScriptArray.forEach((script) => {
                    const idx = htmlPluginData.head.findIndex((original) => {
                        return script.attributes.href === original.attributes.href;
                    });
                    if (htmlPluginData.head[idx]) {
                        htmlPluginData.head[idx].attributes = Object.assign({}, script.attributes, defaultPreload);
                    };
                })
                cb(null, htmlPluginData);
            });
        });
        compiler.plugin("compilation", compilation => {
            compilation.plugin("html-webpack-plugin-after-html-processing", (htmlPluginData, cb) => {
                // dump noscript array inside no script within head
                const htmlify = new HtmlWebpackPlugin();

                if (this.options.noscript && this.noScriptArray.length > -1) {
                    const noScriptData = this.noScriptArray.map((script) => {
                        return htmlify.createHtmlTag(script);
                    });
                    const noScriptDataString = `<noscript>${ noScriptData.join("") }</noscript></head>`;
                    htmlPluginData.html = htmlPluginData.html.replace("</head>", noScriptDataString);
                }
                cb(null, htmlPluginData);
            });
        });
    }
}

module.exports = PreloadCssPlugin;
