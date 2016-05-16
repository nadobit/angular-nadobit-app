var states = [
    require('./states/home.js'),
    require('./states/404.js'),
];

angular.module('{{app-name}}', [
    'nadobit.app',
])

.config(function($httpProvider, $urlRouterProvider, nbStateProvider)
{
    nbStateProvider.states(states);

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.interceptors.push('TemplateCacheBustInterceptor');
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/404');
})

.run(function($rootScope, $window, $state)
{
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        $rootScope.loadingState = toState;
    });

    $rootScope.$on('$stateChangeSuccess', function() {
        delete $rootScope.loadingState;
    });

    $rootScope.$on('$stateChangeCancel', function() {
        delete $rootScope.loadingState;
    });

    $rootScope.$on('$stateChangeError', function() {
        delete $rootScope.loadingState;
    });
})

.factory('TemplateCacheBustInterceptor', function() {
    return {
        'request': function(config) {
            if (config.url.match(/^tpl\/.*/g)) {
                config.url = config.url + '?rev=' + Math.floor(Date.now() / 1000 / 60);
            }
            return config;
        }
    };
})

;
