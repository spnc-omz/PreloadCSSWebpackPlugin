PreloadCSSWebpackPlugin
============
Preload css plugin is an add-on for html-webpack-plugin. Inspired by [Filament Group's LoadCSS](https://github.com/filamentgroup/loadCSS). Plays nicely with multiple html-wepack-plugins and commons chunks plugin

Pre-requisites
--------------
This module requires [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) and [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) to work. The plugin must be called after those two in your webpack configuration.

Installation
---------------
Install with npm or yarn.
```sh
$ npm install --save-dev preload-css-webpack-plugin
```
```sh
yarn add -D preload-css-webpack-plugin
```

Usage
-----------------
Require it in your webpack configuration:
```js
const PreloadCSSPlugin = require("preload-css-webpack-plugin");
```

Add it to your Webpack `plugins` array after `HtmlWebpackPlugin` and `ExtractTextPlugin`:

```js
plugins: [
    new HtmlWebpackPlugin(),
    new ExtractTextPlugin("[name].css"),
    new PreloadCssPlugin()
]
```

The plugin assumes that all css assets should be preloaded. It converts your style link from 
```html
<link rel="stylesheet" href="style.css">
```
to the following
```html
<link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'"><noscript><link rel="stylesheet" href="style.css"></noscript>
```

This transformation is based on what Filament Group has found has best asynchronous behavior. Since support for preload is pretty limited, I highly recommend that you include Filament Groups polyfill.  

Configuring
-----------------
Preloadcss plugin offers two options at this point in time.
|Name|Type|Default|Description|
|:--:|:--:|:--:|:----------|
|**`blacklist`**|`{Array}`|`[/\.map/]`|Allows for excluding files from being asynchronously loaded. Accepts regex pattern or string.|
|**`noscript`**|`{Boolean}`|`True`|Indicates whether or not to include noscript snippet on dom|

```js
plugins: [
    new HtmlWebpackPlugin(),
    new ExtractTextPlugin("[name].css"),
    new PreloadCssPlugin({
        blacklist: [/\.map/],
        noscript: true
    })
]
```

Developing
-----------------
Feel free to Fork and Clone Repository. `npm install <file>` or `npm link` then start contributing! 

Before PR's please run unit tests, `npm run test` make sure that all tests pass.
