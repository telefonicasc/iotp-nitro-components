requirejs.config({
  baseUrl: '../../',
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
    'components/card/back/threshold',
    'components/card/back/label',
    'components/card/front/binary',
    'components/card/front/quantity_value',
    'components/card/front/off',
    'components/card/front/icon',
    'components/card/front/threshold',
    'components/card/front/values',
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
                            sensor_name: 'Nombre del sensor'
                        },
                        CardData:{
                            'true':'Verdadero',
                            'false':'Falso',
                            'value':'Valor',
                            'after': 'Después de',
                            'every': 'Repite cada',
                            'sendEmailHeader': 'Enviar email',
                            'sendAlarmHeader': 'Crear alarma',
                            'sendAlarmTxt': 'Esta acción creará todas las alarmas activas para los asset que cumplan las condiciones establecidas y no requieran configuración.',
                            'sendAlarmBack': 'Envío de alarma',
                            'deactivated': 'Desactivado',
                            'activated': 'Activado',
                            'to': 'Para',
                            'subject': 'Asunto',
                            'alarmConditionTxt': 'This condition includes all assets that have at least one active alarm and does not require configuration.',
                            'turnOffAlarmHeader': 'Apagar alarma',
                            'turnOffAlarmTxt': 'Esta acción apagará todas las alarmas activas para los asset que cumplan las condiciones establecidas y no requieran configuración.'
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
