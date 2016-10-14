var browserify = require('gulp-browserify'),
    concat = require('gulp-concat-util'),
    fs = require('fs'),
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    minifier = require('gulp-minifier'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename'),
    revAppend = require('gulp-rev-append'),
    rsync = require('gulp-rsync'),
    webserver = require('gulp-webserver');

var config = {
    app: '{{app-name}}',
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

gulp.task('htdocs/vendor.css', function(done) {
    if (config.vendor.css.length > 0) {
        return gulp.src(config.vendor.css)
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest('htdocs'));
    }
    fs.writeFileSync('htdocs/vendor.css', '');
    done();
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

gulp.task('htdocs/fonts/*', function(done) {
    if (config.vendor.fonts.length > 0) {
        return gulp.src(config.vendor.fonts)
            .pipe(gulp.dest('htdocs/fonts'));
    }
    done();
});

gulp.task('htdocs/i18n/*', function() {
    return gulp.src(config.vendor.i18n)
        .pipe(gulp.dest('htdocs/i18n'));
});

// scripts ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(function() {

    var source = 'src/index.js';
    var target = 'htdocs/' + config.app + '.js';

    gulp.task(target, function() {
        return gulp.src(source)
            .pipe(browserify({
                debug: true,
            }))
            .pipe(ngAnnotate())
            .pipe(rename(config.app + '.js'))
            .pipe(gulp.dest('htdocs'))
    });

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

// styles ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(function() {

    var source = 'src/less/screen.less';
    var target = 'htdocs/' + config.app + '.css';

    gulp.task(target, function() {
        return gulp.src(source)
            .pipe(less())
            .pipe(rename(config.app + '.css'))
            .pipe(gulp.dest('htdocs'))
    });

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

// templates ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(function() {

    tasks = [];

    tasks.push(function() {
        return gulp.src([
            'src/**/*.html',
            '!src/index.html',
            '!src/index.release.html',
        ])
            .pipe(gulp.dest('htdocs/tpl'));
    });

    tasks.push(function() {
        return gulp.src('src/**/*.jade')
            .pipe(pug({
                pretty: '\t'
            }))
            .pipe(gulp.dest('htdocs/tpl'));
    });


    gulp.task('htdocs/tpl/*', gulp.parallel.apply(gulp, tasks));

})();

// static files ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('collectstatic', function() {
    return gulp.src('src/static/**')
        .pipe(gulp.dest('htdocs'));
});

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
    'htdocs/index.html',
    'htdocs/i18n/*',
    'htdocs/tpl/*'
));

gulp.task('dev', gulp.series(
    'build',
    function() {

        gulp.watch('src/**/*.js', gulp.parallel(
            'htdocs/' + config.app + '.js'
        ));

        gulp.watch([
            'src/**/*.jade',
            'src/**/*.html',
        ], gulp.task(
            'htdocs/tpl/*'
        ));

        gulp.watch(
            'src/static/**',
            gulp.task('collectstatic')
        );

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
