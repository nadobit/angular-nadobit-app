module.exports = new GulpNadobit();


var browserify = require('gulp-browserify'),
    concat = require('gulp-concat-util'),
    fs = require('fs'),
    gettext = require('gulp-angular-gettext'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    minifier = require('gulp-minifier'),
    ngAnnotate = require('gulp-ng-annotate'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    revAppend = require('gulp-rev-append'),
    rsync = require('gulp-rsync'),
    webserver = require('gulp-webserver');


function GulpNadobit()
{
    this.app = {
        name: 'nadoapp'
    };
    this.vendor = {
        js: [],
        css: [],
        fonts: [],
        i18n: [],
    };
    this.deploy
}

GulpNadobit.prototype.configApp = function(config) {
    this.app = config;
    return this;
};

GulpNadobit.prototype.configDeploy = function(config) {
    this.deployConfig = config;
    return this;
};

GulpNadobit.prototype.vendorJs = function(files) {
    var self = this;
    files.forEach(function(file) {
        self.vendor.js.push('node_modules/' + file);
    });
    return this;
};

GulpNadobit.prototype.vendorCss = function(files) {
    var self = this;
    files.forEach(function(file) {
        self.vendor.css.push('node_modules/' + file);
    });
    return this;
};

GulpNadobit.prototype.vendorFonts = function(files) {
    var self = this;
    files.forEach(function(file) {
        self.vendor.fonts.push('node_modules/' + file);
    });
    return this;
};

GulpNadobit.prototype.vendorI18n = function(files) {
    var self = this;
    files.forEach(function(file) {
        self.vendor.i18n.push('node_modules/' + file);
    });
    return this;
};

GulpNadobit.prototype.finish = function(files) {

    this.initVendorJsTasks();
    this.initVendorStyleTasks();
    this.initVendorStaticTasks();

    this.initAppJsTasks();
    this.initAppStyleTasks();
    this.initAppTemplateTasks();
    this.initAppStaticTasks();
    this.initAppIndexTasks();
    this.initAppBuildTasks();
    this.initAppLocaleTasks();

    this.initCommandLineTasks();
};

GulpNadobit.prototype.initVendorJsTasks = function() {
    var self = this;

    // concatenated vendor files
    gulp.task('htdocs/vendor.js', function() {
        return gulp.src(self.vendor.js)
            .pipe(concat.footer('\n;\n'))
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest('htdocs'));
    });

    // minified vendor files
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
};

GulpNadobit.prototype.initVendorStyleTasks = function() {
    var self = this;

    // concatenated vendor css
    gulp.task('htdocs/vendor.css', function(done) {
        if (self.vendor.css.length > 0) {
            return gulp.src(self.vendor.css)
                .pipe(concat('vendor.css'))
                .pipe(gulp.dest('htdocs'));
        }
        fs.writeFileSync('htdocs/vendor.css', '');
        done();
    });

    // minified vendor css
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
};

GulpNadobit.prototype.initVendorStaticTasks = function() {
    var self = this;

    // vendor font files
    gulp.task('htdocs/fonts/*', function(done) {
        if (self.vendor.fonts.length > 0) {
            return gulp.src(self.vendor.fonts)
                .pipe(gulp.dest('htdocs/fonts'));
        }
        done();
    });

    // vendor i18n files
    gulp.task('htdocs/i18n/*', function(done) {
        if (self.vendor.i18n.length > 0) {
            return gulp.src(self.vendor.i18n)
                .pipe(gulp.dest('htdocs/i18n'));
        }
        done();
    });
};

GulpNadobit.prototype.initAppJsTasks = function() {
    var self = this;

    var source = 'src/index.js';
    var target = 'htdocs/' + self.app.name + '.js';

    gulp.task(target, function() {
        return gulp.src(source)
            .pipe(browserify({
                debug: true,
                paths: ['./src'],
            }))
            .pipe(ngAnnotate())
            .pipe(rename(self.app.name + '.js'))
            .pipe(gulp.dest('htdocs'))
    });

    gulp.task('release/' + self.app.name + '.min.js', gulp.series(
        'htdocs/' + self.app.name + '.js',
        function() {
            return gulp.src('htdocs/' + self.app.name + '.js')
                .pipe(minifier({
                    minify: true,
                    minifyJS: true,
                    collapseWhitespace: true,
                }))
                .pipe(rename(self.app.name + '.min.js'))
                .pipe(gulp.dest('release'));
        }
    ));
};

GulpNadobit.prototype.initAppStyleTasks = function() {
    var self = this;

    var source = 'src/less/screen.less';
    var target = 'htdocs/' + self.app.name + '.css';

    gulp.task(target, function() {
        return gulp.src(source)
            .pipe(less())
            .pipe(rename(self.app.name + '.css'))
            .pipe(gulp.dest('htdocs'))
    });

    gulp.task('release/' + self.app.name + '.min.css', gulp.series(
        'htdocs/' + self.app.name + '.css',
        function() {
            return gulp.src('htdocs/' + self.app.name + '.css')
                .pipe(minifier({
                    minify: true,
                    minifyCSS: true,
                    collapseWhitespace: true,
                }))
                .pipe(rename(self.app.name + '.min.css'))
                .pipe(gulp.dest('release'));
        }
    ));
};

GulpNadobit.prototype.initAppTemplateTasks = function() {

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
        return gulp.src('src/**/*.pug')
            .pipe(pug({
                pretty: '\t'
            }))
            .pipe(gulp.dest('htdocs/tpl'));
    });


    gulp.task('htdocs/tpl/*', gulp.parallel.apply(gulp, tasks));
};

GulpNadobit.prototype.initAppStaticTasks = function() {

    gulp.task('collectstatic', function() {
    return gulp.src('src/static/**')
        .pipe(gulp.dest('htdocs'));
    });
};

GulpNadobit.prototype.initAppIndexTasks = function() {
    var self = this;

    gulp.task('htdocs/index.html', gulp.series(
        gulp.parallel(
            'htdocs/' + self.app.name + '.css',
            'htdocs/' + self.app.name + '.js',
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
            'release/' + self.app.name + '.min.css',
            'release/' + self.app.name + '.min.js'
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
};

GulpNadobit.prototype.initAppBuildTasks = function() {

    gulp.task('htdocs/translations/*', function() {
        return gulp.src('locale/**/*.po')
            .pipe(gettext.compile({
                format: 'json'
            }))
            .pipe(gulp.dest('htdocs/i18n'))
    });

    gulp.task('build', gulp.parallel(
        'collectstatic',
        'htdocs/fonts/*',
        'htdocs/index.html',
        'htdocs/i18n/*',
        'htdocs/tpl/*',
        'htdocs/translations/*'
    ));
};

GulpNadobit.prototype.initAppLocaleTasks = function() {
    var self = this;

    gulp.task('locale', gulp.series(
        'build',
        function() {
            return gulp.src([
                    'src/index.js',
                    'src/**/*.js',
                    'htdocs/**/*.html',
                    'src/index.release.html',
                ])
                .pipe(gettext.extract(self.app.name + '.pot', {
                    lineNumbers: false,
                }))
                .pipe(gulp.dest('locale'));
        }
    ));
};

GulpNadobit.prototype.initCommandLineTasks = function() {
    var self = this;

    gulp.task('dev', gulp.series(
        'build',
        function() {

            gulp.watch('src/**/*.js', gulp.parallel(
                'htdocs/' + self.app.name + '.js'
            ));

            gulp.watch([
                'src/**/*.pug',
                'src/**/*.html',
            ], gulp.task(
                'htdocs/tpl/*'
            ));

            gulp.watch(
                'src/static/**',
                gulp.task('collectstatic')
            );

            gulp.watch([
                'src/less/*.less',
            ], gulp.task(
                'htdocs/index.html'
            ));

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
                        '!htdocs/' + self.app.name + '.css',
                        '!htdocs/' + self.app.name + '.js',
                        '!htdocs/vendor.css',
                        '!htdocs/vendor.js',
                        '!htdocs/index.html',
                    ])
                    .pipe(gulp.dest('release'));
            }
        )
    ));

    if (self.deploy) {
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
                        username: self.deploy.user,
                        hostname: self.deploy.hostname,
                        destination: self.deploy.destination,
                    }));
            }
        ));
    }

    gulp.task('default', gulp.parallel(
        'build'
    ));
};
