const path = require('path');
const gulp = require('gulp');
const filter = require('gulp-filter');
const conf = require('../conf/gulp.conf');

function other() {
  const fileFilter = filter(file => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{html,css,js,styl}'),
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}

gulp.task('other', other);
