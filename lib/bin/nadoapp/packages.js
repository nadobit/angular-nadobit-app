module.exports = [
    {
        name: 'angular-nadobit-api',
        version: '*',
        js: [
            'angular-nadobit-api/dist/angular-nadobit-api.js',
            'angular-nadobit-config/dist/angular-nadobit-config.js',
        ],
    }, {
        name: 'angular-ui-bootstrap',
        version: '*',
        js: [
            'angular-ui-bootstrap/dist/ui-bootstrap.js',
            'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        ],
        css: [
            'angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
        ],
    }, {
        name: 'bootstrap',
        version: '*',
        js: [
            'bootstrap/dist/js/bootstrap.js',
        ],
        css: [
            'bootstrap/dist/css/bootstrap.css',
        ],
        fonts: [
            'bootstrap/dist/fonts/*',
        ],
    }, {
        name: 'font-awesome',
        version: '*',
        css: [
            'font-awesome/css/font-awesome.css',
        ],
        fonts: [
            'font-awesome/fonts/*',
        ],
    }, {
        name: 'jquery',
        version: '*',
        js: [
            'jquery/dist/jquery.js',
        ],
    }, {
        name: 'moment',
        version: '*',
        js: [
            'moment/moment.js',
            'moment/min/moment-with-locales.js',
        ],
    }, {
        name: 'ng-file-upload',
        version: '*',
        js: [
            'ng-file-upload/dist/ng-file-upload.js',
        ],
    }
];
