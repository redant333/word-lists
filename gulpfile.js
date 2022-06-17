import gulp from "gulp";
const { src, dest, watch, parallel } = gulp;
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import jsonminify from 'gulp-jsonminify';
import webpack from 'webpack-stream';

const htmlminConfig = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyJS: true,
}

const jsFiles = ["src/js/**/*.js"];
const htmlFiles = ["src/html/index.html", "src/html/list.html", "src/html/practice.html"];
const jsonFiles = ["src/data/*json"];

function assembleJs(cb) {
    src("src/js/WordListsLoader.js")
        .pipe(webpack({ mode: "production", output: { filename: "./minified.js" } }))
        .pipe(dest("."));
    cb();
}

function assembleHtml(cb) {
    src(htmlFiles)
        .pipe(fileinclude())
        .pipe(htmlmin(htmlminConfig))
        .pipe(dest("."));
    cb();
}

function minifyJson(cb) {
    src(jsonFiles)
        .pipe(jsonminify())
        .pipe(dest("./data"))
    cb();
}

function watchTask() {
    watch(jsFiles, assembleJs);
    watch(htmlFiles, assembleHtml);
    watch(jsonFiles, minifyJson);
}

let defaultTask = parallel(assembleJs, assembleHtml, minifyJson);

export {
    watchTask as watch,
    defaultTask as default
};
