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
    'components/angular_directives'
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
                        cards: [{
                            cssClass: 'm2m-card-action m2m-card-send-email',
                            header: 'Send Email',
                            component: 'SendEmail',
                            tokens: ['device_latitude', 'device_longitude', 'measure.value', 'device.asset.name']
                        }]
                    }
                };

                $http.get('cards.json').success(function(data) {
                    var cards = processCards(data.data);
                    $scope.cards.conditions.cards = cards;
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

    function processCards(cardsData) {
        var cards = [];
        $.each(cardsData, function(i, cardData) {
            var card = $.extend({}, cardData.configData);
            card.header = cardData.sensorData.measureName;
            cards.push(card);

            if (cardData.sensorData.phenomenon ===
                "urn:x-ogc:def:phenomenon:IDAS:1.0:angle") {
                card.front = {
                        items: [{
                            component: 'AngleWidget'
                        }]
                    };
                card.back = {
                        items: [{
                            component: 'Slider'
                        }]
                    };
            } else if (cardData.sensorData.phenomenon ===
                "urn:x-ogc:def:phenomenon:IDAS:1.0:electricPotential") {
                card.front = {
                    items: [{
                        component: 'Battery'
                    }]
                };
                card.back = {
                        items: [{
                            component: 'Slider'
                        }]
                    };
            } else if (card.Data.sensorData.dataType === "Boolean") {
                card.front = {
                    items: [{
                        component: 'CardFrontBinary'
                        trueLabel: 'True',
                        trueValue: 'true',
                        falseLabel: 'False',
                        falseValue: 'false' 
                    }]
                };
                card.back = {
                    items: [{
                        component: 'Dropdown',
                        options: [{
                            label: 'True', 
                            value: 'true'
                        }, {
                            label: 'False', 
                            value: 'false'
                        }]
                };

            }
        });
        return cards;
    }

  }
);
