const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const conf = require('../conf/gulp.conf');

function image() {
  gulp.src(conf.paths.images)
    .pipe(imagemin({ optimizationLevel: 2 }))
    .pipe(gulp.dest(conf.paths.dist));
}

gulp.task('image', image);
