requirejs.config({
  baseUrl: '/',
  nitroComponents: [
  ]
});

define(
  [
    'components/application_menu',
    'components/angular_directives',
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
