requirejs.config({
  baseUrl: '../../',
  nitroComponents: [
  ]
});

define(
  [
    'components/card/rule_editor',
    'components/card/action/send_email',
    'components/card/action/send_alarm',
    'components/sensor_widget/battery',
    'components/sensor_widget/angle',
    'components/slider',
    'components/angular_directives',
    'components/card/front/text',
    'components/card/back/text',
    'components/card/front/binary',
    'components/card/front/quantity_value',
    'components/card/front/off',
      'components/card/front/alarm',
    'components/form/dropdown'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

        angular.module('testApp', ['nitroComponents']);

        angular.module('testApp').controller(
            'ruleController',
            function($scope, $http) {
                $scope.ruleoptions = {
                    cards: {
                        actions: {
                            cards: []
                        },
                        conditions: {
                            cards: []
                        }
                    },
                    locales: {
                        Card: {
                            subject: 'Asunto',
                            to: 'Para',
                            sensor_name: 'Nombre del sensor'
                        },
                        CardData:{
                            'true':'Verdadero',
                            'false':'Falso',
                            'value':'Valor',
                            'after': 'Después de',
                            'every': 'Repite cada'

                        }
                    },
                    actionsLabel: 'Acciones',
                    conditionsLabel: 'Condiciones',
                    delimiterLabels: {
                        'EQUAL_TO': 'IGUAL',
                        'DIFFERENT_TO': 'DIFERENTE',
                        'MINOR_THAN': 'MENOR',
                        'GREATER_THAN': 'MAYOR',
                        'IS_OFF': 'APAGADO',
                        'ACTIVATED': 'ACTIVADA',
                        'DEACTIVATED': 'DESACTIVADA' 
                    }
                };
                $http.get('actions.json').success(function(data) {
                    $scope.ruleoptions.cards.actions.cards = data.data;
                });

                $http.get('cards.json').success(function(data) {
                    $scope.ruleoptions.cards.conditions.cards = data.data;
                });
                $http.get('rule.json').success(function(data) {
                    $scope.ruleData = {
                        rule:data.data[0],
                        isValid:true
                    };
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
