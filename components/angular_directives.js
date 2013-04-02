define([], function() {

  if (angular) {
    angular.module('nitroComponents', [])
      .directive('nitroComponent', function() {
       
        return {
          restrict: 'A',

          link: function(scope, element, attr) {
            var jqplugin = attr.nitroComponent
              , options = scope.$eval(attr.nitroOptions);
            console.log('options', options);
            $(element)[jqplugin](options);
          }
        };

      });    
  }

});
