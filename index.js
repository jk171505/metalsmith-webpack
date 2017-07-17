var metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inplace = require('metalsmith-in-place');
var permalinks = require('metalsmith-permalinks');
var webpack = require('metalsmith-webpack');
var watch             = require('metalsmith-watch');
var metalsmithExpress = require('metalsmith-express');
var path = require('path');
//var sass = require('metalsmith-sass');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var withLiveReload = process.argv.indexOf('--livereload') > -1;

metalsmith(__dirname)
  .metadata({
    title: 'the title',
    description: 'the description',
    something: 'something'
  })
  .clean(true)
  .use(withLiveReload ? metalsmithExpress() : function () {})
  .use(withLiveReload ? watch({
    paths: {
      '${source}/**/*': true,
      'partials/*.html': '*.html',
      'layouts/*.html': '*.html'
    },
    livereload: true
  }) : function () {}
  )
  .use(inplace({
    engine: 'swig',
    pattern: '**/*.html',
    autoescape: false
  }))
  .use(permalinks({
    relative: false
  }))
  .use(layouts({
    engine: 'handlebars'
  }))
  .ignore([path.join(__dirname, './src/assets/js/*'), path.join(__dirname, './src/assets/sass/*')])
  .use(webpack({
    devtool: 'source-map',
    module: {
      loaders: [
        { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass')  }
      ]
    },
    entry: {
      site: './src/assets/js/site.js'
    },
    output: {
      path: path.join(__dirname, './build', 'assets/js'),
      filename: '[name].bundle.js'
    },
    plugins: [
      new ExtractTextPlugin('../css/main.css', { disable: false, allChunks: true })
    ]
  }))
  .build(function (err) {
    if (err) {
      throw err;
    } else {
      console.info('success');
    }
  });
