angular.module('nadobit.app', [
    'ui.router',
])

.provider('nbState', /*@ngInject*/ function($stateProvider) {
    var self = this;

    this.$get = /*@ngInject*/ function($state) {
        return $state;
    };

    /**
     * register mutliple states with extended definition
     */
    this.states = function(definitions, parentName) {
        definitions.forEach(function(definition) {

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
})

;
