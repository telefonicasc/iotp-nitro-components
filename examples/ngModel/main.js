requirejs.config({
  baseUrl: '/m2m-nitro-components',
  nitroComponents: [
  ]
});

define(
  [
    'components/dashboard/overview_subpanel',
    'components/angular_directives'
  ],

  function() {
    
    requirejs(['components/jquery_plugins'], function() {
      angular.module('testApp', ['nitroComponents'])
        .run(function() {
          console.log('init_app');
        });

      angular.bootstrap(document, ['testApp']);
    });
  }
);
