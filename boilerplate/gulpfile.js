var browserify = require('gulp-browserify'),
    concat = require('gulp-concat-util'),
    fs = require('fs'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    minifier = require('gulp-minifier'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename'),
    revAppend = require('gulp-rev-append'),
    rsync = require('gulp-rsync'),
    webserver = require('gulp-webserver');

var config = {
    app: '{{app-name}}',
    modules: [
        '{{app-name}}',
    ],
    vendor: {
        js: [
            'node_modules/angular/angular.js',
            'node_modules/angular-nadobit-app/frontend/dist/nadobit.app.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
        ],
        css: [
        ],
        fonts: [
        ]
    }
};

// vendor files ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('htdocs/vendor.js', function() {
    return gulp.src(config.vendor.js)
        .pipe(concat.footer('\n;\n'))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('htdocs'));
});

gulp.task('release/vendor.min.js', gulp.series(
    'htdocs/vendor.js',
    function() {
        return gulp.src('htdocs/vendor.js')
            .pipe(minifier({
                minify: true,
                minifyJS: true,
                collapseWhitespace: true,
            }))
            .pipe(rename('vendor.min.js'))
            .pipe(gulp.dest('release'));
    }
));

gulp.task('htdocs/vendor.css', function() {
    return gulp.src(config.vendor.css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('htdocs'));
});

gulp.task('release/vendor.min.css', gulp.series(
    'htdocs/vendor.css',
    function() {
        return gulp.src('htdocs/vendor.css')
            .pipe(minifier({
                minify: true,
                minifyCSS: true,
                collapseWhitespace: true,
            }))
            .pipe(rename('vendor.min.css'))
            .pipe(gulp.dest('release'));
    }
));

gulp.task('htdocs/fonts/*', function() {
    return gulp.src(config.vendor.fonts)
        .pipe(gulp.dest('htdocs/fonts'));
});

// modules scripts ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(function() {

    var tasks = [];
    config.modules.forEach(function(moduleName) {
        var source = 'src/' + moduleName + '/index.js';
        var target = 'htdocs/js/' + moduleName + '.js';
        tasks.push(target);
        gulp.task(target, function() {
            return gulp.src(source)
                .pipe(browserify({
                    debug: true,
                }))
                .pipe(rename(moduleName + '.js'))
                .pipe(gulp.dest('htdocs/js'))
        });
    });

    gulp.task('htdocs/' + config.app + '.js', gulp.series(
        gulp.parallel.apply(gulp, tasks),
        function() {
            return gulp.src('htdocs/js/**/*.js')
                .pipe(concat.footer('\n;\n'))
                .pipe(concat(config.app + '.js'))
                .pipe(ngAnnotate())
                .pipe(gulp.dest('htdocs'));
        }
    ));

})();

gulp.task('release/' + config.app + '.min.js', gulp.series(
    'htdocs/' + config.app + '.js',
    function() {
        return gulp.src('htdocs/' + config.app + '.js')
            .pipe(minifier({
                minify: true,
                minifyJS: true,
                collapseWhitespace: true,
            }))
            .pipe(rename(config.app + '.min.js'))
            .pipe(gulp.dest('release'));
    }
));

(function() {

    var tasks = [];
    config.modules.forEach(function(moduleName) {
        var source = 'src/' + moduleName + '/less/screen.less';
        var target = 'htdocs/css/' + moduleName + '.css';

        var sourceExists = false;
        try {
            fs.statSync(source);
            sourceExists = true;
        } catch(e) {}

        if (sourceExists) {
            tasks.push(target);
            gulp.task(target, function() {
                return gulp.src(source)
                    .pipe(less())
                    .pipe(rename(moduleName + '.css'))
                    .pipe(gulp.dest('htdocs/css'))
            });
        }
    });

    gulp.task('htdocs/' + config.app + '.css', gulp.series(
        gulp.parallel.apply(gulp, tasks),
        function() {
            return gulp.src('htdocs/css/**/*.css')
                .pipe(concat(config.app + '.css'))
                .pipe(gulp.dest('htdocs'));
        }
    ));

})();

gulp.task('release/' + config.app + '.min.css', gulp.series(
    'htdocs/' + config.app + '.css',
    function() {
        return gulp.src('htdocs/' + config.app + '.css')
            .pipe(minifier({
                minify: true,
                minifyCSS: true,
                collapseWhitespace: true,
            }))
            .pipe(rename(config.app + '.min.css'))
            .pipe(gulp.dest('release'));
    }
));

(function() {

    var tasks = [];
    config.modules.forEach(function(moduleName) {
        var source = 'src/' + moduleName + '/static/**';
        var target = 'collectstatic-' + moduleName;
        tasks.push(target);
        gulp.task(target, function() {
            return gulp.src(source)
                .pipe(gulp.dest('htdocs'));
        });
    });

    gulp.task('collectstatic', gulp.series(
        function() {
            return gulp.src('src/static/**')
                .pipe(gulp.dest('htdocs'));
        },
        gulp.series.apply(gulp, tasks)
    ));

})();


// index ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('htdocs/index.html', gulp.series(
    gulp.parallel(
        'htdocs/' + config.app + '.css',
        'htdocs/' + config.app + '.js',
        'htdocs/vendor.css',
        'htdocs/vendor.js'
    ),
    function() {
        return gulp.src('src/index.html')
            .pipe(gulp.dest('htdocs'))
    },
    function() {
        return gulp.src('htdocs/index.html')
            .pipe(revAppend())
            .pipe(gulp.dest('htdocs'))
    }
));

gulp.task('release/index.html', gulp.series(
    gulp.parallel(
        'release/vendor.min.css',
        'release/vendor.min.js',
        'release/' + config.app + '.min.css',
        'release/' + config.app + '.min.js'
    ),
    function() {
        return gulp.src('src/index.release.html')
            .pipe(rename('index.html'))
            .pipe(gulp.dest('release'))
    },
    function() {
        return gulp.src('release/index.html')
            .pipe(revAppend())
            .pipe(gulp.dest('release'))
    }
));

// Command Line ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('build', gulp.parallel(
    'collectstatic',
    'htdocs/fonts/*',
    'htdocs/index.html'
));

gulp.task('dev', gulp.series(
    'build',
    function() {

        gulp.watch('src/**/*.js', gulp.parallel(
            'htdocs/' + config.app + '.js'
        ));

        config.modules.forEach(function(moduleName) {

            gulp.watch([
                'src/' + moduleName + '/less/**/*.less',
                'src/' + moduleName + '/**/*.js',
            ], gulp.task('htdocs/index.html'));

            gulp.watch(
                'src/' + moduleName + '/static/**/*.html',
                gulp.task('collectstatic-' + moduleName)
            );
        });

        gulp.watch('src/index.html', gulp.task('htdocs/index.html'));

        gulp.src('htdocs').pipe(webserver({
            host: '0.0.0.0',
            port: 8001
        }));
    }
));

gulp.task('release', gulp.parallel(
    'release/index.html',
    gulp.series(
        'build',
        function() {
            return gulp.src([
                    'htdocs/**',
                    '!htdocs/config.js',
                    '!htdocs/js',
                    '!htdocs/js/**',
                    '!htdocs/css',
                    '!htdocs/css/**',
                    '!htdocs/' + config.app + '.css',
                    '!htdocs/' + config.app + '.js',
                    '!htdocs/vendor.css',
                    '!htdocs/vendor.js',
                    '!htdocs/index.html',
                ])
                .pipe(gulp.dest('release'));
        }
    )
));

gulp.task('deploy', gulp.series(
    'release',
    function(done) {
        return gulp.src('release')
            .pipe(rsync({
                root: 'release',
                recursive: true,
                clean: true,
                exclude: [
                    '.DS_Store',
                    'config.js',
                ],
                username: '{{deploy-user}}',
                hostname: '{{deploy-host}}',
                destination: '{{deploy-directory}}',
            }));
    }
));

gulp.task('default', gulp.parallel(
    'build'
));
