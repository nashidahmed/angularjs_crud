'use strict';

// build routines using gulpjs

// node packages
const gulp = require('gulp');

// gulp plugins
const bowerMainFiles = require('main-bower-files');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const filter = require('gulp-filter');
const gulpif = require('gulp-if');
const cssNano = require('gulp-cssnano');
const htmlMin = require('gulp-htmlmin');
const ngHtml2Js = require('gulp-ng-html2js');
const uglify = require('gulp-uglify');
const wrap = require('gulp-wrap');
const cachebust = require('gulp-cache-bust');
const debug = require('gulp-debug')

// karma
const Server = require('karma').Server;

// local variables
const isProduction = true;
const srcDir = './src/';
const appDir = srcDir + 'app/';
const assetsDir = srcDir + 'assets/';
const publicDir = './public/';
const publicJsDir = publicDir + 'js/';
const publicCssDir = publicDir + 'css/';
const publicImgDir = publicDir + 'img/';
const publicDataDir = publicDir + 'data/';
const port = 9990;

// file queries
const gulpFile = './gulpfile.js';
const indexFile = srcDir + 'index.html';
const appJsFiles = appDir + '**/!(*.spec)+(.js)';
const htmlFiles = appDir + '**/*.html';
const assetsFiles = assetsDir + '**/*';
const cssFiles = assetsDir + 'css/**/*.css';
const imgFiles = assetsDir + 'img/**/*';
const dataFiles = assetsDir + 'data/**/*';

// gulp filters
const jsFilter = filter('**/*.js');
const cssFilter = filter('**/*.css');

// task options
const htmlMinOptions = {
    collapseWhitespace: true
};

// clean build directories
gulp.task('clean', function () {
    // vinylPaths gets file paths from the vinyl stream produce in gulp.src
    return gulp.src([publicDir], { read: false })
        .pipe(vinylPaths(del));
});

// copy all assets files to public
gulp.task('assets', function () {
    gulp.src(imgFiles)
        .pipe(gulp.dest(publicImgDir))
        .pipe(connect.reload());
});

// concatenate and compress app js & styl file to app.{js|css}
gulp.task('app', () => {
    const jsFile = 'app.js', paths = appJsFiles;

    // build applications js files
    gulp.src(paths)
        .pipe(babel({
            "presets": ["@babel/env"]
        }))
        .pipe(wrap('!function(){\n<%= contents %>\n}();'))
        .pipe(concat(jsFile))
        .pipe(gulpif(isProduction, uglify({ compress: { drop_console: true } })))
        .pipe(gulp.dest(publicJsDir))
        .pipe(connect.reload());
});

gulp.task('css', () => {
    const cssFile = 'app.css';

    // build applications css files
    gulp.src(cssFiles)
        .pipe(concat(cssFile))
        .pipe(gulpif(isProduction, cssNano()))
        .pipe(gulp.dest(publicCssDir))
        .pipe(connect.reload());
});

// copy index to public
gulp.task('index', () => {
    gulp.src(indexFile)
        .pipe(cachebust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest(publicDir))
        .pipe(connect.reload());
});

// copy all templates to public
gulp.task('templates', () => {
    const tplfile = 'app.templates.js';

    gulp.src(htmlFiles)
        .pipe(gulpif(isProduction, htmlMin(htmlMinOptions)))
        .pipe(ngHtml2Js({ moduleName: 'customerApp.templates' }))
        .pipe(concat(tplfile))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulp.dest(publicJsDir))
        .pipe(connect.reload());
});

// copy JSON data to public
gulp.task('json', () => {
    gulp.src(dataFiles)
        .pipe(gulp.dest(publicDataDir))
        .pipe(connect.reload());
});

// concatenate and compress bower_components to vendor.{js|css}
gulp.task('vendor', () => {
    const jsfile = 'vendor.js', ccsFile = 'vendor.css';
    const bowerFiles = bowerMainFiles();

    // build vendor js files
    gulp.src(bowerFiles)
        .pipe(jsFilter)
        .pipe(concat(jsfile))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulp.dest(publicJsDir));

    // build vendor css files
    gulp.src(bowerFiles)
        .pipe(cssFilter)
        .pipe(concat(ccsFile))
        .pipe(gulpif(isProduction, cssNano()))
        .pipe(gulp.dest(publicCssDir));
});

// run test cases for the application
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

// watch dirs for edits
gulp.task('watch', () => {
    gulp.watch([appJsFiles], ['app']);
    gulp.watch([cssFiles], ['css']);
    gulp.watch([htmlFiles], ['templates']);
    gulp.watch([indexFile], ['index']);
    gulp.watch([assetsFiles], ['assets']);
    gulp.watch([dataFiles], ['json']);
});

// start test server and livereload
gulp.task('connect', () => {
    connect.server({
        root: [publicDir],
        livereload: true,
        port: port
    });
});

gulp.task('default', () => {
    gulp.start('connect', 'build', 'watch');
});

gulp.task('build', ['clean'], () => {
    gulp.start('assets', 'app', 'css', 'index', 'templates', 'json', 'vendor', 'test');
});