process.bin = process.title = 'nadoapp';


var path = require('path'),
    gulp = require('gulp'),
    inquirer = require('inquirer'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    vorpal = require('vorpal')(),
    packages = require('./packages'),
    pjson = require('../../../package.json');

vorpal
    .command('init-app', 'intializes nadoapp boilerplate')
    .action(function(args, callback) {

        var inquirer_choices = packages.map(function(item) { return item.name; });
        var questions = [{
                type: 'input',
                name: 'appName',
                message: 'What\'s the short name of your app? '
            }, {
                type: 'checkbox',
                name: 'packages',
                message: 'Shall we include some Packages? ',
                choices: inquirer_choices
            }
        ];

        return this.prompt(questions, function(answers) {

            var sourceDir = path.resolve(__dirname, '..', '..', '..', 'boilerplate');
            var targetDir = process.cwd();
            var selectedPackages = answers.packages;
            var vendorJS = [];
            var vendorCSS = [];
            var vendorFonts = [];
            var vendorI18n = [];
            var vendorPackage = [
                '    "angular-nadobit-app": "^'+ pjson.version +'"'
            ];
            var keys = ['js', 'css', 'fonts', 'i18n'];

            packages.forEach(function(package) {
                if (selectedPackages.indexOf(package.name) > -1) {
                    keys.forEach(function(key) {
                        if (key in package) {
                            package[key].forEach(function(obj) {
                                var configStr = "        '"+ obj +"',";
                                if (key == 'js') {
                                    vendorJS.push(configStr)
                                } else if (key == 'css') {
                                    vendorCSS.push(configStr)
                                } else if (key == 'fonts') {
                                    vendorFonts.push(configStr)
                                } else {
                                    vendorI18n.push(configStr)
                                }
                            });
                        }
                    });
                    vendorPackage.push(
                        '    "'+ package.name +'": "'+ package.version +'"'
                    );
                }
            });

            gulp
                .src([
                    sourceDir + '/**/*',
                    sourceDir + '/**/.*',
                ])
                .pipe(rename(function(path) {
                    path.basename = path.basename.replace('{{gitignore}}', '.gitignore');
                    path.basename = path.basename.replace('{{app-name}}', answers.appName);
                    path.dirname = path.dirname.replace('{{app-name}}', answers.appName);
                }))
                .pipe(replace('{{app-name}}', answers.appName, {
                    skipBinary: true,
                }))
                .pipe(replace('{{nadoapp-version}}', pjson.version, {
                    skipBinary: true,
                }))
                .pipe(replace('{{vendor-js}}', vendorJS.join('\n'), {
                    skipBinary: true,
                }))
                .pipe(replace('{{vendor-css}}', vendorCSS.join('\n'), {
                    skipBinary: true,
                }))
                .pipe(replace('{{vendor-fonts}}', vendorFonts.join('\n'), {
                    skipBinary: true,
                }))
                .pipe(replace('{{vendor-i18n}}', vendorI18n.join('\n'), {
                    skipBinary: true,
                }))
                .pipe(replace('{{vendor-package}}', vendorPackage.join(',\n'), {
                    skipBinary: true,
                }))
                .pipe(gulp.dest(targetDir));

            callback();
        });
    });


vorpal
    .delimiter('nadoapp$')
    .show();
