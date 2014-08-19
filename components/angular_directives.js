/*
We have created a set of angular directives to ease the use of the components
inside [AngularJS](http://angularjs.org/).

The data-nitro-component directive, attach a component to the node. You can
set the options for component using data-nitro-options directive:
```html
    <div id="blabla"
        data-nitro-component="m2mMyComponent"
        data-nitro-options="{ ... }">
```

This is like doing:
```javascript
    $('#blabla').m2mMyComponent({ ... });
```

You can use scope values inside the data-nitro-options definition.

The data-nitro-value directive can be used for data binding. Components should
trigger a *valueChange* event when the component data is changed.
This directive sets the value of the component when the scope is changed, and
it changes de scope when the value of the component changes.
```html
    <div data-nitro-component="m2mMyComponent"
         data-nitro-value="scopefield">
```

When $scope.scopefield changes, it will trigger *valueChange* on the component
updating its value. When the components changes its value, it will automatically
update the $scope.scopefield.

@name AngularDirective
*/
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
                            setValue = getValue.assign,
                            currentValue;

                        scope.safeApply = function(fn) {
                            var phase = this.$root.$$phase;
                            if(phase == '$apply' || phase == '$digest') {
                                if(fn && (typeof(fn) === 'function')) {
                                    fn();
                                }
                            } else {
                                this.$apply(fn);
                            }
                        };

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
                                scope.safeApply(function() {
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
