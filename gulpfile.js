var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var stylus      = require('gulp-stylus');
var rupture     = require('rupture');


// Static Server + watching styl/html files
gulp.task('serve', ['html','imgs','fonts','js','stylus'], function() {

    browserSync.init({
        server: "./app"
    });
    gulp.watch("dev/imgs/*.*", ['imgs']);
    gulp.watch("dev/js/*.js", ['js']);
    gulp.watch("dev/fonts/*.*", ['fonts']);
    gulp.watch("dev/*.html", ['html']);
    gulp.watch("dev/stylus/*.styl", ['stylus']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('imgs', function() {
  return gulp.src("dev/imgs/*.*")
      .pipe(plumber())
      .pipe(gulp.dest("app/imgs"))
      .pipe(browserSync.stream());
});

gulp.task('html',function() {
    return gulp.src("dev/*.html")
      .pipe(plumber())
      .pipe(gulp.dest("app/"));
});

gulp.task('fonts', function() {
    return gulp.src("dev/fonts/*.*")
      .pipe(plumber())
      .pipe(gulp.dest("app/fonts/"))
      .pipe(browserSync.stream());
});

gulp.task('js',function() {
    return gulp.src("dev/js/*.js")
      .pipe(plumber())
      .pipe(gulp.dest("app/js/"))
      .pipe(browserSync.stream());
});

gulp.task('stylus', function() {

    return gulp.src("dev/stylus/main.styl")
        .pipe(plumber())
        .pipe(stylus({
          compress: false,
          use: rupture()
         }))
        .pipe(gulp.dest("app/css/"))
        .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);