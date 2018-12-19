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
    gulp.watch(["*.html"]).on('change', bs.reload);
});

// gulp.task('serve', gulp.series('scss', function(){
//     bs.init({
//         server: "./"
//     });

//     gulp.watch("scss/*/**", ['scss']);
//     gulp.watch(["*.html"]).on('change', bs.reload);
// }))


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
        .pipe(gulp.dest("css/"))
        .pipe(bs.stream());
});

gulp.task("default", ["serve"]);