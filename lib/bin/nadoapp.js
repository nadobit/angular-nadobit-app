process.bin = process.title = 'nadoapp';


var path = require('path'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    vorpal = require('vorpal')(),
    pjson = require('../../package.json');


vorpal
    .command('init-app', 'intializes nadoapp boilerplate')
    .action(function(args, callback) {
        return this.prompt({
            type: 'input',
            name: 'appName',
            message: 'What\'s the short name of your app? '
        }, function(result) {
            var sourceDir = path.resolve(__dirname, '..', '..', 'boilerplate');
            var targetDir = process.cwd();

            gulp
                .src([
                    sourceDir + '/**/*',
                    sourceDir + '/**/.*',
                ])
                .pipe(rename(function(path) {
                    path.basename = path.basename.replace('{{gitignore}}', '.gitignore');
                    path.basename = path.basename.replace('{{app-name}}', result.appName);
                    path.dirname = path.dirname.replace('{{app-name}}', result.appName);
                }))
                .pipe(replace('{{app-name}}', result.appName, {
                    skipBinary: true,
                }))
                .pipe(replace('{{nadoapp-version}}', pjson.version, {
                    skipBinary: true,
                }))
                .pipe(gulp.dest(targetDir));

            callback();
        });
    });


vorpal
    .delimiter('nadoapp$')
    .show();
