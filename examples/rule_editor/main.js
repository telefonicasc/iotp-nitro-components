requirejs.config({
  baseUrl: '/m2m-nitro-components',
  nitroComponents: [
  ]
});

define(
  [
    'components/card/rule_editor',
    'components/card/action/send_email',
    'components/sensor_widget/battery',
    'components/sensor_widget/angle',
    'components/slider',
    'components/angular_directives',
    'components/card/front/text',
    'components/card/back/text',
    'components/card/front/binary',
    'components/card/front/quantity_value',
    'components/form/dropdown'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

        angular.module('testApp', ['nitroComponents']);

        angular.module('testApp').controller(
            'ruleController',
            function($scope, $http) {
                $scope.cards = {
                    conditions: {
                        label: 'Conditions',
                        cards: []
                    },
                    actions: {
                        label: 'Actions',
                        cards: []
                    }
                };

                $http.get('actions.json').success(function(data) {
                    $scope.cards.actions.cards = data.data;
                });

                $http.get('cards.json').success(function(data) {
                    $scope.cards.conditions.cards = data.data;
                });

                $http.get('rule.json').success(function(data) {
                    $scope.ruleData = data.data[0];
                });

                $scope.$watch('ruleData', function() {
                    console.log('RuleData change', $scope.ruleData);
                });
            }
        );

        angular.bootstrap(document, ['testApp']);

    });
  }
);
