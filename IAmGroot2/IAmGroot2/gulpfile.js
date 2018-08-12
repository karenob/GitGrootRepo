"use strict";

var gulp = require('gulp'); //A .NET integrated task runner hosted as an open source project. github: https://github.com/gulpjs/gulp
var rimraf = require('gulp-rimraf'); //gulp extension for deleting files and folders. github: https://github.com/robrich/gulp-rimraf
var through = require('through2'); //simple package to help create a gulp extension on-the-fly without having to re-do everything. github: https://github.com/rvagg/through2
var builderModule = require('systemjs-builder'); //an advanced build and bundling tool. github: https://github.com/systemjs/builder/

var bundlesFolder = 'Scripts/bundles/'; //all bundles are placed here.
var tsFolder = 'Scripts/Angular/'; //all files that need to be bundled are specified under this folder.

var builder = new builderModule();
builder.loadConfig('systemjs-builder.config.js'); //loads the configuration file.

gulp.task('bundle:ALL', [
    'bundle:LoginComponent'
    , 'bundle:ServerRequestComponent'
]);

gulp.task('bundle:LoginComponent', function (cb) {
    return bundle('LoginComponent');
});

gulp.task('bundle:ServerRequestComponent', function (cb) {
    return bundle('ServerRequestComponent');
});

gulp.task("clean:all-bundles", function () {
    return gulp.src([bundlesFolder + '**/*.js'], { read: false }).pipe(rimraf()); // much faster not to read
});


//Notes:
//1. SFX bundles don't need module loaders to be defined for browsers. These bundles can be referenced via <script src> tag.
function bundle(entryFile) {
    ///<summary>
    /// Using SystemJS-Builder, starts the tree-shaking of dependencies from passed file path (aka entry file) and creates an SFX (aka self executing) bundle and copies it to bundlesFolder. 
    /// Don't include file extensions, just the relative path to Angular folder.
    ///</summary>

    return gulp.src(['./'])
        .pipe(build());


    function build() {
        return through.obj(function (file, encoding, callback) { buildLogic(callback); });

        function buildLogic(callback) {
            callback(null,
                builder
                    .buildStatic(tsFolder + entryFile + '.js', bundlesFolder + entryFile + '.min.js', { mangle: true, minify: true })
                    .then(function () {
                        console.log('Tree-shaking and bundling of "' + entryFile + '.js" has completed.');
                    })
                    .catch(function (err) {
                        console.log('Tree-shaking and bundling of "' + entryFile + '.js" failed with following error(s):');
                        console.log(err);
                    })
            );
        }
    }
}