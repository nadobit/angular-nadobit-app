process.bin = process.title = 'nadoapp';

var path = require('path'),
    gulp = require('gulp'),
    rename = require('gulp-rename');

var sourceDir = path.resolve(__dirname, '..', '..', 'boilerplate');
var targetDir = process.cwd();

gulp
    .src(sourceDir + '/**/*')
    .pipe(gulp.dest(targetDir));
