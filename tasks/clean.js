const del = require('del');
const gulp = require('gulp');
const filter = require('gulp-filter');
const conf = require('../conf/gulp.conf');

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

gulp.task('clean', clean);
