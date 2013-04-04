requirejs.config({
  baseUrl: '/m2m-nitro-components',
  paths: {
    'raphael': 'libs/raphael/raphael'
  }
});

define(
  [
    'components/card/rule_editor',
    'raphael'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

      $('#editor').m2mRuleEditor({ });

    });
  }
);
