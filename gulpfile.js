var stream = require('stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var chalk = require('chalk');
var sass = require('gulp-sass');
var util = require('gulp-util');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var stringify = require('stringify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync'); // .create()
var through = require('through2');
var fs = require('fs');
var inject = require('gulp-inject');
var argv = require('yargs').argv;
var wiredep = require('wiredep').stream;
var clean = require('gulp-clean');
var open = require('gulp-open');

// app path
var appPath = 'app';
// destination path
var destPath = 'build';

// if we are watching
var watch = false;

// our source files
var src = {
    webpages: './' + appPath + '/*.html',
    sass: './' + appPath + '/scss/**/*.scss',
    images: './' + appPath + '/images/*.*',
}

// default task is to run build
gulp.task('default', ['serve']);

// main build task
gulp.task('build', ['clean-build', 'favicon', 'config', 'inject', 'bowerjs', 'bowersass', 'bowercopy', 'html', 'sass', 'css-legacy', 'js-legacy', 'images', 'scripts']);

gulp.task('clean-build', function () {
    if (!watch) {
        return gulp.src('build', { read: false })
            .pipe(clean());
    }
});

//Custom config task
//This task edits the config/index.js file to represent the settings for the
//current environment being used. The scripts task will then bundle the 
//updated script accordingly.
gulp.task('config', function () {
    util.log('Updating Config Files.');
    return gulp.src('./' + appPath + '/js/config/index.js')
        .pipe(through.obj(function (file, enc, callback) {
            if (file.isNull()) {
                return callback(null, file);
            }
            if (file.isStream()) {
                return callback(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            }
            if (!file.contents.length) {
                return callback(null, file);
            }

            var startTag = '/* config object start */';
            var endTag = '/* config object end */';

            var contents = file.contents.toString(enc);

            var base_config = JSON.parse(fs.readFileSync('./' + appPath + '/js/config/base.json', { encoding: enc }));
            //TODO abstract this to load different values based upon the build command
            var env_config = {};

            if (argv.prod || argv.production || argv.dist) {
                env_config = JSON.parse(fs.readFileSync('./' + appPath + '/js/config/production.json', { encoding: enc }));
            } else if (argv.staging || argv.stage) {
                env_config = JSON.parse(fs.readFileSync('./' + appPath + '/js/config/staging.json', { encoding: enc }));
            } else if (argv.testing || argv.test) {
                env_config = JSON.parse(fs.readFileSync('./' + appPath + '/js/config/test.json', { encoding: enc }));
            } else {
                env_config = JSON.parse(fs.readFileSync('./' + appPath + '/js/config/dev.json', { encoding: enc }));
            }

            var config = Object.assign(base_config, env_config);

            var pre = contents.substring(0, contents.indexOf(startTag) + startTag.length);
            var post = contents.substring(contents.indexOf(endTag), contents.length);
            var body = '\n' + JSON.stringify(config, undefined, 4) + '    \n';



            file.contents = new Buffer(pre + body + post, enc);

            this.push(file);
            callback();
        }))
        .pipe(gulp.dest('./' + appPath + '/js/config/'))
});

gulp.task('inject', function () {
    var sources = gulp.src(
        [
            './' + appPath + '/scss/**/*.scss',
            './' + appPath + '/scss/**/*.scss',
            '!./' + appPath + '/scss/app.scss',
            '!./' + appPath + '/scss/legacy.scss'
        ], { read: false });

    return gulp.src('./' + appPath + '/scss/app.scss')
        .pipe(
            inject(
                sources, {
                    relative: true,
                    empty: true
                }
            )
        )
        .pipe(gulp.dest('./' + appPath + '/scss/'));
});

// called before watch starts
gulp.task('pre-watch', function () {
    watch = true;
});

// our watch task to watch files and perform other tasks
gulp.task('watch', ['pre-watch', 'build'], function () {
    gulp.watch(src.webpages, ['html']).on('change', function () {
        //if (browserSync.active)
        browserSync.reload();
    });
    gulp.watch(src.sass, ['inject', 'sass']);
    gulp.watch(src.images, ['images']);
    gulp.watch('./' + appPath + '/js/config/*.json', ['config']);
});

//Load any bower compoenents into index.html
gulp.task('bowercopy', ['clean-build'], function () {
    var deps = require('wiredep')();
    return gulp.src(deps.js, { cwd: 'bower_compoenents/**' })
        .pipe(gulp.dest('build/js/libs/'));
});

//Load any bower compoenents into index.html
gulp.task('bowerjs', function () {
    return gulp.src('./' + appPath + '/index.html')
        .pipe(wiredep({
            ignorePath: '../bower_components/',
            fileTypes: {
                html: {
                    replace: {
                        js: function (filepath) {
                            var split = filepath.split('/');
                            return '<script src="js/libs/' + split[split.length - 1] + '"></script>';
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('./' + appPath + '/'));
});

//Load any bower compoenents into index.html
gulp.task('bowersass', function () {
    return gulp.src('./' + appPath + '/scss/app.scss')
        .pipe(wiredep({}))
        .pipe(gulp.dest('./' + appPath + '/scss/'));
});

// called to move any HTML documents into the destination folder
gulp.task('html', ['bowerjs', 'clean-build'], function () {
    return gulp.src(src.webpages)
        .pipe(gulp.dest(destPath));
});

// build and move SCSS files to destination folder
gulp.task('sass', ['inject', 'bowersass', 'clean-build'], function () {
    return gulp.src('./' + appPath + '/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber(function (error) {
            util.beep();
            console.log(
                chalk.gray('\n====================================\n') +
                '[' + chalk.magenta('SASS') + '] ' + chalk.red.bold('Error') +
                chalk.gray('\n------------------------------------\n') +
                chalk.yellow('Message:\n  ') +
                error.messageFormatted +
                chalk.gray('\n------------------------------------\n') +
                chalk.yellow('Details:') +
                chalk.green('\n  Line: ') + error.line +
                chalk.green('\n  Column: ') + error.column +
                chalk.gray('\n====================================\n')
            );
            this.emit('end');
        }))
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(concat('app.css'))
        .pipe(gulp.dest(destPath + '/css'))
        .pipe(browserSync.stream());
});

// build and move the legacy CSS file(s) to destination folder
gulp.task('css-legacy', ['clean-build'], function () {
    return gulp.src('./quarantine/build/assets/css/app.css')
        .pipe(concat('legacy.css'))
        .pipe(gulp.dest(destPath + '/css'))
        .pipe(browserSync.stream());
});

// build and move the legacy CSS file(s) to destination folder
gulp.task('js-legacy', ['clean-build'], function () {
    return gulp.src('./quarantine/build/assets/js/*.js')
        .pipe(gulp.dest(destPath + '/js/legacy/'))
        .pipe(browserSync.stream());
});


// called to move any images over
gulp.task('images', ['clean-build'], function () {
    return gulp.src(src.images)
        .pipe(gulp.dest(destPath + '/images'));
});

// called to move any images over
gulp.task('favicon', ['clean-build'], function () {
    return gulp.src('./' + appPath + '/favicon.ico')
        .pipe(gulp.dest(destPath));
});

// called to proccess your javascript files
gulp.task('scripts', ['config', 'clean-build'], function () {
    // our browserify instance
    var bro = browserify({
        entries: './' + appPath + '/js/app.js',
        debug: true,
        transform: [stringify, babelify]
    });

    // our javascript bundler
    var bundler = (watch) ? watchify(bro) : bro;

    // when the bundler updates
    bundler.on('update', function () {
        // call our rebundler again
        rebundle(bundler);
    });

    // our rebundle function
    function rebundle(bundler) {
        util.log('Browserify is bundling...');
        // tell browserify we are compiling
        browserSync.notify('Browserify is bundling...');
        // default bundler to not have an error
        bundler.error = false;
        // send our bundler bundle back
        return bundler.bundle()
            .on('error', function (error) {
                // set bundler error to true to check for later
                bundler.error = true;
                // beep and give us the error
                util.beep();
                // tell browserify we got an error
                browserSync.notify('Browserify Error!');
                // log the message
                console.log(
                    chalk.gray('\n====================================\n') +
                    '[' + chalk.blue('Browserify') + '] ' + chalk.red.bold('Error') +
                    chalk.gray('\n------------------------------------\n') +
                    chalk.yellow('Message:\n  ') + error.message +
                    chalk.gray('\n------------------------------------\n') +
                    error.codeFrame + '\n' +
                    chalk.gray('\n------------------------------------\n') +
                    chalk.yellow('Details:') +
                    chalk.green('\n  File: ') + error.filename +
                    chalk.green('\n  Line: ') + (error.loc && error.loc.line ? error.loc.line : 'Unknown') +
                    chalk.green('\n  Column: ') + (error.loc && error.loc.column ? error.loc.column : 'Unknown') +
                    chalk.gray('\n====================================\n')
                );
            })
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(destPath + '/js'))
            .on('end', function () {
                // don't do anything if we have an error
                if (!bundler.error) {
                    // we are done bundling
                    util.log('Browserify finished bundling!');
                    // tell browserify we got an error
                    browserSync.notify('Browserify finished bundling!');
                    // uglify the file
                    gulp.src(destPath + '/js/app.js')
                        .pipe(uglify())
                        .pipe(rename({
                            extname: '.min.js'
                        }))
                        .pipe(gulp.dest(destPath + '/js'));

                    // tell browser sync to reload the page
                    browserSync.reload();
                }
            });
    }

    // call the rebundle to bundle the app
    return rebundle(bundler);
});

// called to serve the files on localhost
gulp.task('serve', ['watch'], function () {
    // initialize browser sync
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: destPath,
            routes: {}
        },
        open: 'external',
        host: 'contempo.dev'
    });
});
