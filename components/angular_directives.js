define([], function() {

    if (angular) {
        angular.module('nitroComponents', [])
            .directive('nitroComponent', function() {

                return {
                    restrict: 'A',
                    link: function(scope, element, attr) {
                        var jqplugin = attr.nitroComponent,
                            options = angular.copy(
                                scope.$eval(attr.nitroOptions), {});
                        $(element)[jqplugin](options);

                        scope.$watch(function() {
                            var newOptions = angular.copy(
                                scope.$eval(attr.nitroOptions), {});
                            if (!angular.equals(options, newOptions)) {
                                console.log('OPTIONS CHANGE');
                                options = angular.copy(newOptions);
                                element.trigger('optionsChange', newOptions);
                            }
                        });
                    }
                };
            })
            .directive('nitroValue',
                ['$parse', '$timeout', function($parse, $timeout) {

                return {
                    restrict: 'A',
                    link: function(scope, element, attr) {
                        var getValue = $parse(attr.nitroValue),
                            setValue = getValue.assign;

                        scope.$watch(function() {
                            element.trigger('valueChange', {
                                value: getValue(scope),
                                angularUpdate: false
                            });
                        });
                        element.trigger('valueChange', {
                            value: getValue(scope)
                        });
                        element.on('valueChange', function(e, o) {
                            if (e.target === element[0] &&
                                o.angularUpdate !== false) {
                                scope.$apply(function() {
                                    setValue(scope, o.value);
                                });
                            }
                        });
                    }
                };
            }])
            .factory('BoxMessage', [function() {
                return BoxMessage;
            }]);
    }
});
