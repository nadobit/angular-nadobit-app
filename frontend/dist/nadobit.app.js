(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('nadobit.app', [
    'ui.router',
])

.provider('nbState', /*@ngInject*/ ["$stateProvider", function($stateProvider) {
    var self = this;

    this.$get = /*@ngInject*/ ["$state", function($state) {
        return $state;
    }];

    /**
     * register mutliple states with extended definition
     */
    this.states = function(definitions, parentName) {
        definitions.forEach(function(definition) {

            // definition maybe loaded via require. At some point there is
            // a caching mechanism which reuses exported objects if the imported
            // files are exactly the same. Because of this, we cannot change
            // the name attribute directly. For this reason a new object is
            // created.
            definition = Object.create(definition);

            if (parentName) {
                definition.name = parentName + '.' + definition.name;
            }

            var subStates = null;
            if ('subStates' in definition) {
                subStates = definition.subStates;
                delete definition.subStates;
            }

            if (definition.templateUrl === true) {
                definition.templateUrl = 'tpl/states/' + definition.name.replace(/\./g, '/') + '.html';
            }

            $stateProvider.state(definition);

            if (subStates) {
                self.states(subStates, definition.name);
            }
        });
        return this;
    };
}])

;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9jb250bXAvRW50d2lja2x1bmcvTmFkb0JpdC9hbmd1bGFyLW5hZG9iaXQtYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29udG1wL0VudHdpY2tsdW5nL05hZG9CaXQvYW5ndWxhci1uYWRvYml0LWFwcC9mcm9udGVuZC9zcmMvbmFkb2JpdC5hcHAvZmFrZV84YTIyYWEyYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYW5ndWxhci5tb2R1bGUoJ25hZG9iaXQuYXBwJywgW1xuICAgICd1aS5yb3V0ZXInLFxuXSlcblxuLnByb3ZpZGVyKCduYlN0YXRlJywgLypAbmdJbmplY3QqLyBmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuJGdldCA9IC8qQG5nSW5qZWN0Ki8gZnVuY3Rpb24oJHN0YXRlKSB7XG4gICAgICAgIHJldHVybiAkc3RhdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIG11dGxpcGxlIHN0YXRlcyB3aXRoIGV4dGVuZGVkIGRlZmluaXRpb25cbiAgICAgKi9cbiAgICB0aGlzLnN0YXRlcyA9IGZ1bmN0aW9uKGRlZmluaXRpb25zLCBwYXJlbnROYW1lKSB7XG4gICAgICAgIGRlZmluaXRpb25zLmZvckVhY2goZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuXG4gICAgICAgICAgICAvLyBkZWZpbml0aW9uIG1heWJlIGxvYWRlZCB2aWEgcmVxdWlyZS4gQXQgc29tZSBwb2ludCB0aGVyZSBpc1xuICAgICAgICAgICAgLy8gYSBjYWNoaW5nIG1lY2hhbmlzbSB3aGljaCByZXVzZXMgZXhwb3J0ZWQgb2JqZWN0cyBpZiB0aGUgaW1wb3J0ZWRcbiAgICAgICAgICAgIC8vIGZpbGVzIGFyZSBleGFjdGx5IHRoZSBzYW1lLiBCZWNhdXNlIG9mIHRoaXMsIHdlIGNhbm5vdCBjaGFuZ2VcbiAgICAgICAgICAgIC8vIHRoZSBuYW1lIGF0dHJpYnV0ZSBkaXJlY3RseS4gRm9yIHRoaXMgcmVhc29uIGEgbmV3IG9iamVjdCBpc1xuICAgICAgICAgICAgLy8gY3JlYXRlZC5cbiAgICAgICAgICAgIGRlZmluaXRpb24gPSBPYmplY3QuY3JlYXRlKGRlZmluaXRpb24pO1xuXG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGRlZmluaXRpb24ubmFtZSA9IHBhcmVudE5hbWUgKyAnLicgKyBkZWZpbml0aW9uLm5hbWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdWJTdGF0ZXMgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCdzdWJTdGF0ZXMnIGluIGRlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICBzdWJTdGF0ZXMgPSBkZWZpbml0aW9uLnN1YlN0YXRlcztcbiAgICAgICAgICAgICAgICBkZWxldGUgZGVmaW5pdGlvbi5zdWJTdGF0ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkZWZpbml0aW9uLnRlbXBsYXRlVXJsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbi50ZW1wbGF0ZVVybCA9ICd0cGwvc3RhdGVzLycgKyBkZWZpbml0aW9uLm5hbWUucmVwbGFjZSgvXFwuL2csICcvJykgKyAnLmh0bWwnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShkZWZpbml0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHN1YlN0YXRlcykge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RhdGVzKHN1YlN0YXRlcywgZGVmaW5pdGlvbi5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG59KVxuXG47XG4iXX0=
