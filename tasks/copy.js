const gulp = require('gulp');
const conf = require('../conf/gulp.conf');

function copy() {
  gulp.src(conf.paths.chrome)
    .pipe(gulp.dest(conf.paths.dist));
}

gulp.task('copy', copy);
