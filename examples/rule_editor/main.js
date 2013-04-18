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
    'components/slider',
    'components/angular_directives'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

        angular.module('testApp', ['nitroComponents']);

        angular.module('testApp').controller(
            'ruleController',
            function($scope) {
                $scope.cards = {
                    conditions: {
                        label: 'Conditions',
                        cards: [{
                            header: 'Battery',
                            front: {
                                items: [{
                                    component: 'Battery'
                                }]
                            },
                            back: {
                                items: [{
                                    component: 'Slider'
                                }]
                            }
                        }, {
                            header: 'Pitch'
                        }]
                    },
                    actions: {
                        label: 'Actions',
                        cards: [{
                            cssClass: 'm2m-card-action m2m-card-send-email',
                            header: 'Send Email',
                            component: 'SendEmail'
                        }]
                    }
                };

                $scope.ruleData = {
                    'name': 'My rule',
                    'cards': [{
                        'id': 'card0',
                        'sensorData': {

                        },
                        'configData': {

                        },
                        'connectedTo': ['card1']
                    }, {
                        'id': 'card1'
                    }]
                };
            }
        );

        angular.bootstrap(document, ['testApp']);

    });

  }
);
