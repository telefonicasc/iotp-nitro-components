define([], function() {

  if (angular) {
    angular.module('nitroComponents', [])
      .directive('nitroComponent', function() {
       
        return {
          restrict: 'A',
          link: function(scope, element, attr) {
            var jqplugin = attr.nitroComponent
              , options = scope.$eval(attr.nitroOptions);
            $(element)[jqplugin](options);
          }
        };
      })
      .directive('nitroValue', 
        ['$parse', '$timeout', function($parse, $timeout) {
        
        return {
          restrict: 'A',
          link: function(scope, element, attr) {
            var getValue = $parse(attr.nitroValue)
              , setValue = getValue.assign;
            scope.$watch(function() {
              element.trigger('valueChange', { 
                value: getValue(scope), 
                angularUpdate: false
              });
            });
            element.on('valueChange', function (e, o) {
              if (o.angularUpdate !== false) {
                scope.$apply(function() {
                    setValue(scope, o.value); 
                });
              }
            });
          }
        };
      }]);    
  }
});
