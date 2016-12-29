var nadoapp = require('./nadoapp-gulp');

nadoapp
    .configApp({
        name: '{{app-name}}',
    })
    .vendorJs([
        'angular/angular.js',

        'angular-nadobit-app/frontend/dist/nadobit.app.js',
        'angular-ui-router/release/angular-ui-router.js',
{{vendor-js}}
    ])
    .vendorCss([
{{vendor-css}}
    ])
    .vendorFonts([
{{vendor-fonts}}
    ])
    .vendorI18n([
{{vendor-i18n}}
    ])
    .finish();
