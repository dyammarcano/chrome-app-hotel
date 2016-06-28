var merge2      = require('merge2');
var gulp        = require('gulp');
var coffee      = require('gulp-coffee');
var stylus      = require('gulp-stylus');
var concat      = require('gulp-concat');
var pug         = require('gulp-pug');
var uglify      = require('gulp-uglifyjs');
var imagemin    = require('gulp-imagemin');
var manifest    = require('gulp-chrome-manifest');
var jshint      = require('gulp-jshint');
var clean       = require('gulp-clean');
var zip         = require('gulp-zip');
var sourcemaps  = require('gulp-sourcemaps');
var minifyHtml  = require('gulp-minify-html');
var minifyCss   = require('gulp-clean-css');
var browserify  = require('gulp-browserify');
var rename      = require('gulp-rename');
var runSequence = require('run-sequence');
var util        = require('util');

var paths = {
  pug:            'src/views/**/*.pug',
  styles:         'src/styles/**/*.styl',
  coffee:         'src/scripts/**/*.coffee',
  images:         'src/images/**/*',
  chrome:         'src/chrome/**/*',
  temp_dir:       '.tmp/scripts',
  build_html:     'build/views',
  build_styles:   'build/styles',
  build_images:   'build/images',
  build_scrips:   'build/scripts',
  compile_scrips: '.tmp/compile/scripts',
};

var vendorsFiles = [
  "bower_components/angular/angular.js",
  "bower_components/angular-animate/angular-animate.js",
  "bower_components/angular-touch/angular-touch.js",
  "bower_components/angular-route/angular-route.js",
  "bower_components/angular-route-styles/route-styles.js",
  "bower_components/angular-bootstrap/ui-bootstrap.js",
  "bower_components/angular-socket-io/socket.js",
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

//////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('coffee', function() {
  gulp.src(paths.coffee)
    .pipe(coffee({ bare: true }))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(gulp.dest(paths.compile_scrips));
});

gulp.task('buildCoffee', ['coffee'], function() {
  setTimeout(function() {
    merge2(gulp.src([paths.compile_scrips + "/**", "!" + paths.compile_scrips + "/background.js"]))
      .pipe(concat('app.js'))
      .pipe(gulp.dest(paths.build_scrips));

    gulp.src(paths.compile_scrips + "/background.js")
      .pipe(gulp.dest(paths.build_scrips));
  }, 5000);
});

gulp.task('buildVendors', function() {
  merge2(gulp.src(vendorsFiles))
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(paths.build_scrips))
});

gulp.task('buildPug', ['copy'], function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: true }))
    //.pipe(minifyHtml({ empty: true }))
    .pipe(gulp.dest(paths.build_html));
});

gulp.task('buildStyles', function() {
  gulp.src(paths.styles)
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(paths.build_styles));
});

gulp.task('copy', function() {
  gulp.src(paths.chrome)
    .pipe(gulp.dest('build'));

  gulp.src(fonts.a.dn)
    .pipe(gulp.dest(fonts.a.dp));

  gulp.src(fonts.b.dn)
    .pipe(gulp.dest(fonts.b.dp));

  gulp.src(fonts.c.dn)
    .pipe(gulp.dest(fonts.c.dp));

  gulp.src(paths.images)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(paths.build_images));

  gulp.src(css)
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.build_styles));
    
  gulp.src(roboto)
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.build_styles + '/roboto'));
});

gulp.task('pack', function() {
  runSequence(['buildCoffee', 'buildStyles', 'buildVendors', 'buildPug']);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function(cb) {
  util.log('clean task executed.');
  gulp.src('dist', { read: false })
    .pipe(clean());

  gulp.src('build', { read: false })
    .pipe(clean());

  gulp.src('.tmp', { read: false })
    .pipe(clean());
  cb();
});

/*
gulp.task('copy', function() {
  gulp.src(paths.chrome)
    .pipe(gulp.dest(paths.build_scrips));

  gulp.src(fonts.a.dn)
    .pipe(gulp.dest(fonts.a.dp));

  gulp.src(fonts.b.dn)
    .pipe(gulp.dest(fonts.b.dp));

  gulp.src(fonts.c.dn)
    .pipe(gulp.dest(fonts.c.dp));

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

gulp.task('pugDev', function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: false }))
    .pipe(gulp.dest('build/views'));
});

gulp.task('scripts', function() {
  gulp.src(paths.coffee)
    .pipe(coffee({ bare: true }))
    .pipe(uglify({ mangle: false }))
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
*/
gulp.task('pug', function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: true }))
    //.pipe(minifyHtml({ empty: true }))
    .pipe(gulp.dest(paths.build_html));
});

gulp.task('styles', function() {
  gulp.src(paths.styles)
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(paths.build_styles));
});

gulp.task('zip', function() {
  util.log('zip task executed.');
  var manifest = JSON.parse(require('fs').readFileSync('./src/chrome/manifest.json'));
  gulp.src(['build/**', '!build/scripts/**/*.map', '!build/styles/**/*.map'])
    .pipe(zip(manifest.name + ' v' + manifest.version + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.pug,    ['pug']);
  gulp.watch(paths.coffee, ['buildCoffee']);
  gulp.watch(paths.styles, ['styles']);
});

//gulp.task('dev',     ['scriptsDev', 'copyDev', 'stylesDev', 'pugDev', 'vendorsDev']);
gulp.task('prod',    ['scripts', 'copy', 'styles', 'pug', 'vendors', 'zip']);
gulp.task('default', ['pack', 'watch']);