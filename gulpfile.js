const gulp = require("gulp");
const {src, dest} = gulp;
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin')
const jsonminify = require('gulp-jsonminify');

const htmlminConfig = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyJS: true,
}

function defaultTask(cb) {
    // Minify and concatenate JavaScript
    src("src/js/*.js")
        .pipe(uglify())
        .pipe(concat("minified.js"))
        .pipe(dest("."));

    // Resolve includes and minify HTML
    const htmlFiles = [
        "src/html/index.html",
        "src/html/list.html",
        "src/html/practice.html",
    ]
    src(htmlFiles)
        .pipe(fileinclude())
        .pipe(htmlmin(htmlminConfig))
        .pipe(dest("."));

    // Minify JSON
    src("src/data/*json")
        .pipe(jsonminify())
        .pipe(dest("./data"))

    cb();
}

exports.default = defaultTask