var browserify = require('gulp-browserify'),
    gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename');


var config = {
    modules: [
        'nadobit.app',
    ],
};


// frontend modules ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(function() {

    var tasks = [];

    // compile modules
    config.modules.forEach(function(moduleName) {
        var source = 'frontend/src/' + moduleName + '/index.js';
        var target = 'frontend/dist/' + moduleName + '.js';
        tasks.push(target);
        gulp.task(target, function() {
            return gulp.src(source)
                .pipe(browserify({
                    debug: true,
                }))
                .pipe(rename(moduleName + '.js'))
                .pipe(ngAnnotate())
                .pipe(gulp.dest('frontend/dist'))
        });
    });

    // task for building all frontend modules
    gulp.task('frontend.build', gulp.parallel.apply(gulp, tasks));

})();


// final tasks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('build', gulp.parallel(
    'frontend.build'
));

gulp.task('dev', gulp.series(
    'build',
    function() {

        gulp.watch('frontend/src/**/*.js', gulp.task('frontend.build'));
    }
));

gulp.task('default', gulp.task('build'));
