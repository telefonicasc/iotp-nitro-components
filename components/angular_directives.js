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
                            debugger;
                            var newOptions = angular.copy(
                                scope.$eval(attr.nitroOptions), {});
                            if (!angular.equals(options, newOptions)) {
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
                        debugger;
                        var getValue = $parse(attr.nitroValue),
                            setValue = getValue.assign,
                            currentValue;

                        scope.$watch(function() {
                            var value = getValue(scope);
                            if (!angular.equals(value, currentValue)) {
                                currentValue = value;
                                element.trigger('valueChange', {
                                    value: value,
                                    angularUpdate: false
                                });
                            }
                        });
                        currentValue = getValue(scope);
                        element.trigger('valueChange', {
                            value: currentValue
                        });
                        element.on('valueChange', function(e, o) {
                            if (e.target === element[0] &&
                                o.angularUpdate !== false) {
                                currentValue = o.value;
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
