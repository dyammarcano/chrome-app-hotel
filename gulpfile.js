var merge2     = require('merge2');
var gulp       = require('gulp');
var coffee     = require('gulp-coffee');
var stylus     = require('gulp-stylus');
var concat     = require('gulp-concat');
var pug        = require('gulp-pug');
var uglify     = require('gulp-uglify');
var imagemin   = require('gulp-imagemin');
var manifest   = require('gulp-chrome-manifest');
var jshint     = require('gulp-jshint');
var clean      = require('gulp-clean');
var zip        = require('gulp-zip');
var sourcemaps = require('gulp-sourcemaps');
var minifyHtml = require('gulp-minify-html');
var minifyCss  = require('gulp-clean-css');

var paths = {
  styles: ['src/styles/**/*.styl'],
  coffee: ['src/scripts/**/*.coffee'],
  pug:    ['src/views/**/*.pug'],
  images: ['src/images/**/*'],
  chrome: ['src/chrome/**/*']
};

var jsFiles = [
  "bower_components/angular/angular.js",
  "bower_components/angular-animate/angular-animate.js",
  "bower_components/angular-touch/angular-touch.js",
  "bower_components/angular-route/angular-route.js",
  "bower_components/angular-route-styles/route-styles.js",
  "bower_components/angular-bootstrap/ui-bootstrap.js",
  //"bower_components/underscore/underscore.js",
  "bower_components/moment/min/moment-with-locales.js",
  "bower_components/particles.js/particles.js",
  //"bower_components/js-xlsx/xlsx.js",
  //"bower_components/excellentexport/excellentexport.js",
  //"bower_components/pdfmake/build/pdfmake.js",
]

fonts = {
  "a": {
    "dn": "bower_components/roboto-fontface/fonts/roboto/*",
    "dp": "build/fonts/roboto"
  },
  "b": {
    "dn": "bower_components/bootstrap/dist/fonts/*",
    "dp": "build/fonts"
  },
  "c": {
    "dn": "bower_components/font-awesome/fonts/*",
    "dp": "build/fonts"
  }
}

css = [
  "bower_components/bootstrap/dist/css/bootstrap-theme.css",
  "bower_components/bootstrap/dist/css/bootstrap.css",
  "bower_components/font-awesome/css/font-awesome.css",
]

var roboto = "bower_components/roboto-fontface/css/roboto/roboto-fontface.css";

gulp.task('clean', function() {
  gulp.src('dist', { read: false }).pipe(clean());
  gulp.src('build', { read: false }).pipe(clean());
});

gulp.task('copy', function() {
  gulp.src(paths.chrome).pipe(gulp.dest('build'));
  gulp.src(fonts.a.dn).pipe(gulp.dest(fonts.a.dp));
  gulp.src(fonts.b.dn).pipe(gulp.dest(fonts.b.dp));
  gulp.src(fonts.c.dn).pipe(gulp.dest(fonts.c.dp));
  gulp.src(paths.images)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('build/images'));
  gulp.src(css)
    .pipe(minifyCss())
    .pipe(gulp.dest('build/styles'));
  gulp.src(roboto)
    .pipe(minifyCss())
    .pipe(gulp.dest('build/styles/roboto'));
});

gulp.task('copyDev', function() {
  gulp.src(paths.chrome).pipe(gulp.dest('build'));
  gulp.src(fonts.a.dn).pipe(gulp.dest(fonts.a.dp));
  gulp.src(fonts.b.dn).pipe(gulp.dest(fonts.b.dp));
  gulp.src(fonts.c.dn).pipe(gulp.dest(fonts.c.dp));
  gulp.src(paths.images)
    .pipe(gulp.dest('build/images'));
  gulp.src(css)
    .pipe(sourcemaps.init()) // source maps init
    .pipe(sourcemaps.write('maps')) // source maps write
    .pipe(gulp.dest('build/styles'));
  gulp.src(roboto)
    .pipe(gulp.dest('build/styles/roboto'));
});

gulp.task('vendors', function() {
  merge2(gulp.src(jsFiles))
    .pipe(uglify())
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('build/scripts'))
});

gulp.task('vendorsDev', function() {
  merge2(gulp.src(jsFiles))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(concat('vendors.js'))
    .pipe(sourcemaps.init()) // source maps init
    .pipe(sourcemaps.write('maps')) // source maps write
    .pipe(gulp.dest('build/scripts'))
});

gulp.task('pug', function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: true }))
    .pipe(minifyHtml({ empty: true }))
    .pipe(gulp.dest('build/views'));
});

gulp.task('pugDev', function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: false }))
    .pipe(gulp.dest('build/views'));
});

gulp.task('scripts', function() {
  gulp.src(paths.coffee)
    .pipe(coffee({ bare: true }))
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('scriptsDev', function() {
  gulp.src(paths.coffee)
    .pipe(coffee({ bare: true }))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(sourcemaps.init()) // source maps init
    .pipe(sourcemaps.write('maps')) // source maps write
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('styles', function() {
  gulp.src(paths.styles)
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest('build/styles'));
});

gulp.task('stylesDev', function() {
  gulp.src(paths.styles)
    .pipe(stylus({ compress: false }))
    .pipe(gulp.dest('build/styles'));
});

gulp.task('zip', function() {
  var manifest = JSON.parse(require('fs').readFileSync('./src/chrome/manifest.json'));
  gulp.src(['build/**', '!build/scripts/**/*.map', '!build/styles/**/*.map'])
    .pipe(zip(manifest.name + ' v' + manifest.version + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.pug,    ['pugDev']);
  gulp.watch(paths.coffee, ['scriptsDev']);
  gulp.watch(paths.styles, ['stylesDev']);
});

gulp.task('dev',     ['scriptsDev', 'copyDev', 'stylesDev', 'pugDev', 'vendorsDev']);
gulp.task('prod',    ['scripts', 'copy', 'styles', 'pug', 'vendors', 'zip']);
gulp.task('default', ['dev', 'watch']);