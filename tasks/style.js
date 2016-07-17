const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const conf = require('../conf/gulp.conf');

function style() {
  gulp.src(conf.paths.style + '/main.styl')
    .pipe(stylus({ compress: true, linenos: false }))
    // .pipe(rename('main.min.css'))
    .pipe(gulp.dest(conf.paths.dist));
}

function styleDev() {
  gulp.src(conf.paths.style + '/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({ compress: true, linenos: false }))
    // .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('map'))
    .pipe(gulp.dest(conf.paths.dist));
}

gulp.task('style', style);
gulp.task('styleDev', styleDev);
