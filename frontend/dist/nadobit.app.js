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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9rYWVzZWJyb3Qvd29yay9wcm9qZWN0cy9naXRodWIvYW5ndWxhci1uYWRvYml0LWFwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL21lZGlhL2thZXNlYnJvdC93b3JrL3Byb2plY3RzL2dpdGh1Yi9hbmd1bGFyLW5hZG9iaXQtYXBwL2Zyb250ZW5kL3NyYy9uYWRvYml0LmFwcC9mYWtlXzY0OWJmZWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuZ3VsYXIubW9kdWxlKCduYWRvYml0LmFwcCcsIFtcbiAgICAndWkucm91dGVyJyxcbl0pXG5cbi5wcm92aWRlcignbmJTdGF0ZScsIC8qQG5nSW5qZWN0Ki8gZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLiRnZXQgPSAvKkBuZ0luamVjdCovIGZ1bmN0aW9uKCRzdGF0ZSkge1xuICAgICAgICByZXR1cm4gJHN0YXRlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiByZWdpc3RlciBtdXRsaXBsZSBzdGF0ZXMgd2l0aCBleHRlbmRlZCBkZWZpbml0aW9uXG4gICAgICovXG4gICAgdGhpcy5zdGF0ZXMgPSBmdW5jdGlvbihkZWZpbml0aW9ucywgcGFyZW50TmFtZSkge1xuICAgICAgICBkZWZpbml0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGRlZmluaXRpb24pIHtcblxuICAgICAgICAgICAgLy8gZGVmaW5pdGlvbiBtYXliZSBsb2FkZWQgdmlhIHJlcXVpcmUuIEF0IHNvbWUgcG9pbnQgdGhlcmUgaXNcbiAgICAgICAgICAgIC8vIGEgY2FjaGluZyBtZWNoYW5pc20gd2hpY2ggcmV1c2VzIGV4cG9ydGVkIG9iamVjdHMgaWYgdGhlIGltcG9ydGVkXG4gICAgICAgICAgICAvLyBmaWxlcyBhcmUgZXhhY3RseSB0aGUgc2FtZS4gQmVjYXVzZSBvZiB0aGlzLCB3ZSBjYW5ub3QgY2hhbmdlXG4gICAgICAgICAgICAvLyB0aGUgbmFtZSBhdHRyaWJ1dGUgZGlyZWN0bHkuIEZvciB0aGlzIHJlYXNvbiBhIG5ldyBvYmplY3QgaXNcbiAgICAgICAgICAgIC8vIGNyZWF0ZWQuXG4gICAgICAgICAgICBkZWZpbml0aW9uID0gT2JqZWN0LmNyZWF0ZShkZWZpbml0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBwYXJlbnROYW1lICsgJy4nICsgZGVmaW5pdGlvbi5uYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3ViU3RhdGVzID0gbnVsbDtcbiAgICAgICAgICAgIGlmICgnc3ViU3RhdGVzJyBpbiBkZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgc3ViU3RhdGVzID0gZGVmaW5pdGlvbi5zdWJTdGF0ZXM7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRlZmluaXRpb24uc3ViU3RhdGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVmaW5pdGlvbi50ZW1wbGF0ZVVybCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGRlZmluaXRpb24udGVtcGxhdGVVcmwgPSAndHBsL3N0YXRlcy8nICsgZGVmaW5pdGlvbi5uYW1lLnJlcGxhY2UoL1xcLi9nLCAnLycpICsgJy5odG1sJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoZGVmaW5pdGlvbik7XG5cbiAgICAgICAgICAgIGlmIChzdWJTdGF0ZXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlcyhzdWJTdGF0ZXMsIGRlZmluaXRpb24ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufSlcblxuO1xuIl19
