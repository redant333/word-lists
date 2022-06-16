import gulp from "gulp";
const {src, dest} = gulp;
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

function defaultTask(cb) {
    // Minify and concatenate JavaScript
    src("src/js/entry.js")
        .pipe(webpack({mode: "production", output: {filename: "./minified.js"}}))
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

export { defaultTask as default };
