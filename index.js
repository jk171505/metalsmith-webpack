var metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inplace = require('metalsmith-in-place');
var permalinks = require('metalsmith-permalinks');
var webpack = require('metalsmith-webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

metalsmith(__dirname)
  .metadata({
    title: 'the title',
    description: 'the description',
    something: 'something'
  })
  .clean(true)
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
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader','sass-loader']
          })
        }
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
      new ExtractTextPlugin({filename: 'main.css'})
    ]
  }))
  .build(function (err) {
    if (err) {
      throw err;
    } else {
      console.info('success');
    }
  });