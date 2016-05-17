// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var gulp = require('gulp');
var rimraf = require('rimraf');
var sequence = require('run-sequence');

// Check for --production flag
var isProduction = !!(argv.production);
var environment = argv.env || 'local';

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
    assets: [
        './client/**/*.*',
        '!./client/index.html',
        '!./client/assets/{scss,js}/**/*.*'
    ],
    // Sass will check these folders for files when you use @import.
    sass: [
        'bower_components/bootstrap-sass/assets/stylesheets',
        'client/assets/scss'
    ],
    // These are external libraries we use for the app
    externalJS: [
        'bower_components/moment/moment.js',
        'bower_components/numeral/numeral.js',
        'bower_components/modernizr/modernizr.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        'bower_components/jquery-ui/jquery-ui.js'
    ],
    // These files are for your app's JavaScript
    appJS: [
        'client/assets/js/config/' + environment + '.js',
        'client/assets/js/config.js',
        'client/assets/js/api.js',
        'client/assets/js/app.js'
    ],
    appJSDashboard: [
        'client/assets/js/config/' + environment + '.js',
        'client/assets/js/config.js',
        'client/assets/js/api.js',
        'client/assets/js/dashboard.js'
    ]
}

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function () {
    return gulp.src(paths.assets, {
            base: './client/'
        })
        .pipe(gulp.dest('./build'));
});

gulp.task('copy:fonts', function () {
    return gulp.src('./bower_components/bootstrap-sass/assets/fonts/**/*.*')
        .pipe(gulp.dest('./build/assets/fonts'));
});

// Apply references to cache-busted resources
gulp.task('html', function () {
    return gulp.src('./client/index.html', {
            base: './client/'
        })
        .pipe(gulp.dest('./build'));
});

// Compiles Sass
gulp.task('sass', function () {
    var minifyCss = $.if(isProduction, $.minifyCss());
    return gulp.src('client/assets/scss/app.scss')
        .pipe($.sass({
            includePaths: paths.sass,
            outputStyle: (isProduction ? 'compressed' : 'nested'),
            errLogToConsole: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie 10']
        }))
        .pipe(minifyCss)
        .pipe(gulp.dest('./build/assets/css/'));
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:external', 'uglify:app', 'uglify:dashboard'])

gulp.task('uglify:external', function () {
    var uglify = $.if(isProduction, $.uglify()
        .on('error', function (e) {
            console.log(e);
        }));

    return gulp.src(paths.externalJS)
        .pipe(uglify)
        .pipe($.concat('external.js'))
        .pipe(gulp.dest('./build/assets/js'));
});

gulp.task('uglify:app', function () {
   var uglify = $.if(isProduction, $.uglify()
        .on('error', function (e) {
            console.log(e);
        }));

    return gulp.src(paths.appJS)
        .pipe(uglify)
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('uglify:dashboard', function () {
    var uglify = $.if(isProduction, $.uglify()
        .on('error', function (e) {
            console.log(e);
        }));

    return gulp.src(paths.appJSDashboard)
        .pipe(uglify)
        .pipe($.concat('dashboard.js'))
        .pipe(gulp.dest('./build/assets/js/'));
});

// Builds your entire app once, without starting a server
gulp.task('build', function (cb) {
    sequence('clean', ['copy', 'sass', 'uglify'], 'copy:fonts', 'html', cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['build'], function () {
    // Watch Sass
    gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

    // Watch JavaScript
    gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify:app','uglify:dashboard']);

    // Watch static files
    gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

});
