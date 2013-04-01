requirejs.config({
  baseUrl: '/m2m-nitro-components',
  nitroComponents: [
    'components/application_menu',
    'components/angular_directives'
  ]
});

define(
  [
    'components/jquery_plugins'
  ],

  function() {
    
    angular.module('testApp', ['nitroComponents'])
      .run(function() {
        console.log('init_app');
      });

    angular.bootstrap(document, ['testApp']);
  }
);
