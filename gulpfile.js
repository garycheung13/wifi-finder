var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var bs = require("browser-sync").create();


gulp.task('serve', ['scss'], function() {
    bs.init({
        server: "./"
    });

    gulp.watch(["scss/*", "scss/**/*"], ['scss']);
    gulp.watch(["*.html", "static/js/*.js"]).on('change', bs.reload);
});

gulp.task("scss", function () {
    gulp.src("scss/main.scss")
        .pipe(sass({
            outputStyle: "compressed",
            errLogToConsole: true,
        }))
        .pipe(autoprefixer({
            browsers: ["last 20 versions"]
        }))
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("static/css/"))
        .pipe(bs.stream());
});

gulp.task("default", ["serve"]);