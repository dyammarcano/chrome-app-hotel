var merge2      = require('merge2');
var config      = require('config.json');
var gulp        = require('gulp');
//var coffee      = require('gulp-coffee');
var stylus      = require('gulp-stylus');
var connect     = require('gulp-connect');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var concat      = require('gulp-concat');
var pug         = require('gulp-pug');
var uglify      = require('gulp-uglifyjs');
var imagemin    = require('gulp-imagemin');
var manifest    = require('gulp-chrome-manifest');
var jshint      = require('gulp-jshint');
var clean       = require('gulp-clean');
var zip         = require('gulp-zip');
var sourcemaps  = require('gulp-sourcemaps');
//var minifyHtml  = require('gulp-minify-html');
//var minifyCss   = require('gulp-clean-css');
//var browserify  = require('gulp-browserify');
var rename      = require('gulp-rename');
var webpack     = require('gulp-webpack');
//var runSequence = require('run-sequence');
//var util        = require('util');
var del         = require('del');
//var stylint     = require('gulp-stylint');
//var templateCache = require('gulp-angular-templatecache');

var paths = {
  css:            'src/stylesheets/*.css',
  pug:            'src/views/**/*.pug',
  styles:         'src/stylesheets/**/*.styl',
  scripts:        'src/javascripts/**/*.js',
  images:         'src/images/**/*',
  chrome:         'src/chrome/**/*',
  temp_dir:       '.tmp/scripts',
  build_html:     'build/views',
  build_styles:   'build/stylesheets',
  build_images:   'build/images',
  build_scrips:   'build/javascripts',
  compile_scrips: 'src/scripts',
};

var vendorsFiles = [
  "bower_components/angular/angular.min.js",
  //"bower_components/angular-ui-validate/dist/validate.js",
  //"bower_components/angular-ui-indeterminate/dist/indeterminate.js",
  //"bower_components/angular-ui-mask/dist/mask.js",
  //"bower_components/angular-ui-event/dist/event.js",
  //"bower_components/angular-ui-scroll/dist/ui-scroll.js",
  //"bower_components/angular-ui-scrollpoint/dist/scrollpoint.js",
  //"bower_components/angular-ui-uploader/dist/uploader.js",
  "bower_components/angular-animate/angular-animate.js",
  "bower_components/angular-touch/angular-touch.js",
  //"bower_components/angular-route/angular-route.js",
  "bower_components/angular-ui-router/release/angular-ui-router.min.js",
  "bower_components/angular-ui-router-styles/ui-router-styles.js",
  //"bower_components/angular-route-styles/route-styles.js",
  //"bower_components/angular-sanitize/angular-sanitize.js",
  "bower_components/angular-primus/angular-primus.min.js",
  "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
  //"bower_components/angular-socket-io/socket.js",
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
  "bower_components/angular/angular-csp.css",
]

var roboto = "bower_components/roboto-fontface/css/roboto/roboto-fontface.css";

//////////////////////////////////////////////////////////////////////////////////////////////////////


/*gulp.task('buildVendors', function() {
  merge2(gulp.src(vendorsFiles))
  //merge2(gulp.src(vendorsFiles))
    //.pipe(uglify({ sourceMap: true }))
    //.pipe(sourcemaps.init()) // source maps init
    //.pipe(sourcemaps.write('maps')) // source maps write
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter(require('jshint-stylish')))
    //.pipe(concat('vendors.js'))
    .pipe(gulp.dest(paths.build_scrips))
});*/


/*gulp.task('pug', function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: true }))
    //.pipe(minifyHtml({ empty: true }))
    .pipe(gulp.dest(paths.build_html));
});*/


/*gulp.task('buildStyles', function() {
  gulp.src(paths.styles)
    .pipe(stylint({config: '.stylintrc'}))
    .pipe(stylint.reporter())
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(paths.build_styles));
});*/


gulp.task('copy', function() {
  /*gulp.src(paths.scripts)
    .pipe(gulp.dest(paths.build_scrips));*/

  gulp.src(paths.chrome)
    .pipe(gulp.dest('build'));

  gulp.src(fonts.a.dn)
    .pipe(gulp.dest(fonts.a.dp));

  gulp.src(fonts.b.dn)
    .pipe(gulp.dest(fonts.b.dp));

  gulp.src(fonts.c.dn)
    .pipe(gulp.dest(fonts.c.dp));

  gulp.src(paths.images)
    //.pipe(imagemin({ optimizationLevel: 1 }))
    .pipe(gulp.dest(paths.build_images));

  gulp.src(paths.css)
    //.pipe(minifyCss())
    .pipe(gulp.dest(paths.build_styles));
    
  gulp.src(roboto)
    //.pipe(minifyCss())
    .pipe(gulp.dest(paths.build_styles + '/roboto'));
});


gulp.task('background', function() {
  return browserify('./src/javascripts/background.js')
    .bundle()
    //.pipe(uglify())
    .pipe(source('background.bundle.js'))
    .pipe(gulp.dest('./build/javascripts/'));
});


gulp.task('main', function() {
  return browserify('./src/javascripts/main.js')
    .bundle()
    //.pipe(uglify())
    .pipe(source('main.bundle.js'))
    .pipe(gulp.dest('./build/javascripts/'));
});


gulp.task('connect', function () {
  connect.server({ root: 'build', port: 4000 });
});


gulp.task('clean', function() {
  gulp.src('dist', { read: false })
    .pipe(clean());

  gulp.src('build', { read: false })
    .pipe(clean());

  /*gulp.src('.tmp', { read: false })
    .pipe(clean());*/
});


gulp.task('pug', function() {
  gulp.src(paths.pug)
    .pipe(pug({ pretty: true }))
    //.pipe(minifyHtml({ empty: true }))
    .pipe(gulp.dest(paths.build_html));
});


/*gulp.task('styles', function() {
  gulp.src(paths.styles)
    .pipe(stylint({config: '.stylintrc'}))
    .pipe(stylint.reporter())
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(paths.build_styles));
});*/


gulp.task('styles', function() {
  /*gulp.src('build', { read: false })
    .pipe(clean());*/
    
  gulp.src('src/stylesheets/dashboard.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({ compress: true, linenos: false }))
    .pipe(rename('dashboard.min.css'))
    .pipe(sourcemaps.write('map'))
    .pipe(gulp.dest(paths.build_styles));
});


gulp.task('styles-dev', function() {
  gulp.src('src/styles/dashboard.styl')
    .pipe(stylus({ compress: false, linenos: true }))
    .pipe(rename('dashboard.css'))
    .pipe(gulp.dest(paths.build_styles));
});


//gulp.task('zip', function() {
//  var manifest = JSON.parse(require('fs').readFileSync('./src/chrome/manifest.json'));
//  gulp.src(['build/**', '!build/scripts/**/*.map', '!build/styles/**/*.map'])
//    .pipe(zip(manifest.name + ' v' + manifest.version + '.zip'))
//    .pipe(gulp.dest('dist'));
//});


gulp.task('cfg', function() {
  gulp.src(paths.chrome)
    .pipe(gulp.dest('build'));
});


/*gulp.task('js', ['background', 'main'], function() {
  gulp.src(paths.scripts)
    .pipe(gulp.dest(paths.build_scrips));
});*/


gulp.task('watch', function() {
  gulp.watch(paths.scripts,  ['background', 'main']);
  gulp.watch(paths.pug,      ['pug']);
  gulp.watch(paths.chrome,   ['cfg']);
  gulp.watch('styles/**/*.styl',  ['styles']);
});


//gulp.task('webserver', function() {
  //connect.server({
    //root: 'dist',
    //livereload: true,
//    port: 8888
  //});
//});


//gulp.task('livereload', function() {
  //gulp.src(['dist/**/*.*'])
    //.pipe(watch(['dist/**/*.*']))
    //.pipe(connect.reload());
//});

gulp.task('clean', function (done) {
  del(['build/**'], done);
});

//gulp.task('prod',    ['scripts', 'copy', 'styles', 'pug', 'vendors', 'zip']);
gulp.task('default', ['styles', 'pug', 'copy', 'background', 'main']);

gulp.task('build', function (done) {
  runSequence('clean', ['bundle', 'copy'], done);
});